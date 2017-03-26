/** store for holding connections **/
var ConfigStore = require( 'configstore' );

let config:any = require('config');

var jsforce:any = require('jsforce');

import { ConnectionInfo } from './ConnectionInfo';
import { ILoginCredentials, LoginCredentials } from './LoginCredentials';

import { CmdLauncher } from '../CmdLauncher';
let launcher:CmdLauncher = CmdLauncher.getInstance();

let prompt:any = require( 'prompt' );

import * as Q from 'q';

/**
 * Represents a connection to salesforce.
 * @TODO: genericize to separate out jsForce from the connection manager
 **/
export class ConnectionManager {
	
	/** singleton instance **/
	private static instance:ConnectionManager;
	
	public static getInstance():ConnectionManager {
		if( ConnectionManager.instance == null ){
			ConnectionManager.instance = new ConnectionManager();
		}
		return( ConnectionManager.instance );
	}
	
	/**
	 * Determine the connection host
	 * @param hostDomain (string) - the custom host domain to use (note: https:// should not be included)
	 * @param useSandbox (boolean) - whether to use the sandbox (true) or not (false) - only if the hostDomain is not specified
	 **/
	public static getConnectionHost( host:string, useSandbox:boolean ):string {
		if( host ){
			return( 'https://' + host );
		} else if( useSandbox ){
			return( config.get( 'hosts.sandbox' ) );
		}
		return( config.get( 'hosts.production' ) );
	}
	
	/**
	 * The (VERIFIED) jsForce connection.
	 * Currently this is jsForce, but can be extended to any other library.
	 * @TODO: investigate definitelyTyped definitions for jsForce - current ones are old...
	 **/
	private jsForceConn:any;
	
	/** the store for the connection
	 * @TODO: make typescript safe
	 **/
	private connectionStore:any;
	
	/** the initial host to connect to, otherwise we'll use the last connected host we've used, or production **/
	private initialHost:string;
	
	/** prompt schema used to prompt the user for credentials. **/
	private promptSchema:any;
	
	/** whether the connection has been checked within the current execution
	  * While we can test multiple times, for now we assume that it only
	  * needs to be checked once.
	  **/
	//private wasConnectionChecked:boolean = false;
	
	/**
	 * Current user's information
	 **/
	public userInfo:any;
	
	constructor(){
	}
	
	/**
	 * Initializes the settings for the ConnectionManager.
	 * (This does not start a connection, but are settings used in making/preservering it)
	 * @param initialHost (String) - host to use when logging in
	 * @param connectionStore (ConnectionStore) - the connection store to preserve credentials.
	 **/
	public setup( initialHost:string, connectionStore:any ):void {
		if( !initialHost ){
			initialHost = 'production';
		}
		this.jsForceConn = null;
		this.connectionStore = null;
		this.initialHost = initialHost;
		this.connectionStore = connectionStore;
		
		this.promptSchema = {
			properties: {
				username: {
					required: true
				},
				password: {
					hidden: true
				},
				token: {
					required: false
				}
			}
		};
	}
		
	/**
	 * Ensures there is a valid connection and returns a promise for when it is complete.
	 * @return Q.Promise - promise for when there is a valid connection to Salesforce.
	 **/
	public checkConnection():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		let scope:ConnectionManager = this;
		
		if( this.hasConnection() ){
			deferred.resolve( scope );
			return( deferred.promise );
		}
		
		//-- it still might be there, it could just be serialized
		let connectionInfo:ConnectionInfo = ConnectionInfo.deserialize( this.connectionStore );
		//console.log( 'connectionInfo:' ); console.log( JSON.stringify( connectionInfo ) );
		
		if( !connectionInfo || !connectionInfo.isComplete() ){
			//console.log( 'connection could not be deserialized. prompting' );
			//debugger;
			this.promptLogin()
				.then( function(){
					console.log( 'connection.checkConnection succeeded' );
					//-- login succeeded, and we can assume we're good to go.
					deferred.resolve( scope )
				})
				['catch']( function(){
					console.log( 'connection.checkConnection failed' );
					
					//debugger;
					return( scope.reset() );
				});
		} else {
			//console.log( 'connection deserialized. so verify connection.' );
			let newConn:any = new jsforce.Connection({
				"serverUrl": connectionInfo.serverUrl,
				"sessionId": connectionInfo.sessionId
			});
			newConn.identity( function( err, res ){
				//console.log( 'results from trying to get the user identity' );
				//debugger;
				if( err ){
					console.error( 'error occurred when finding the user info' );
					
					//-- reset the connection
					//debugger;
					return( scope.reset() );
					
				} else {
					//-- connection was valid and has been tested
					scope.jsForceConn = newConn;
					scope.userInfo = res;
					
					console.log( "connection was valid and tested" );
					
					//console.log( res ); console.log( JSON.stringify( res ));
					deferred.resolve( scope );
				}
			});
		}
		
		return( deferred.promise );
	}
	
	/**
	 * Internal method to prompt the user to login
	 **/
	public promptLogin():Q.Promise {
		let scope:ConnectionManager = this;
		let deferred:Q.Promise = Q.defer();
		
		if( !this.hasConnection() ){
			this.promptCredentials()
				.then( function( creds:any ):void {
					//console.log( 'connection credentials received' );
					scope.login( creds.username, creds.password, creds.token )
						.then( function( c:ConnectionManager ):void {
							//console.log( 'successful login' );
							deferred.resolve( c );
						})
						['catch']( function( err ){
							//simpleFailureHandler( 'failed on login', arguments );
							deferred.reject( err );
						});
				})
				['catch']( function( err ){
					//simpleFailureHandler( 'failure when asking for credentials', arguments );
					deferred.reject( err );
				})
		} else {
			console.log( 'connection already has a connection' );
			deferred.resolve( this );
		}
		
		return( deferred.promise );
	}
	
	/**
	 * Tries to login
	 **/
	public login( username:string, pass:string, token:string ):Q.Promise {
		let deferred:Q.Promise = Q.defer();
		let scope:ConnectionManager = this;
		
		let loginConn:any = new jsforce.Connection({
			loginUrl: this.initialHost	
		});
		
		loginConn.login( username, pass + token, function( err, userInfo ){
			if( err ){
				console.error( 'Error occurred during jsForce login' );
				console.log( err );
				console.log( JSON.stringify( err ));
				
				return( scope.promptLogin() );
				//deferred.reject( err );
			}
			
			let newConn:ConnectionInfo = new ConnectionInfo( loginConn.instanceUrl, loginConn.accessToken, scope.initialHost );
			newConn.serialize( scope.connectionStore );
			scope.jsForceConn = loginConn;
			
			scope.getUserInfo()
				.then( function( userInfo ){
					deferred.resolve( this );
				})
				['catch']( function( err ){
					console.error( 'ASSERTION: we just finished logging in. should not get error' );
					console.error( err ); console.error( JSON.stringify( err ));
				});
		});
		
		return( deferred.promise );
	}
	
	/**
	 * logs out
	 **/
	public logout():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		this.connectionStore.delete( 'serverUrl' );
		this.connectionStore.delete( 'sessionId' );
		this.connectionStore.delete( 'lastConnectionHost' );
		this.jsForceConn = null;
		
		deferred.resolve( 'success' );
		//console.log( "Successful logout" );
		
		return( deferred.promise );
	}
	
	/**
	 * Resets the connection.
	 * <p>Conveience function rather than logging out and logging in again.</p>
	 * return Q.Promise
	 **/
	public reset():Q.Promise {
		let deferred:Q.Promise = Q.defer();

		this.logout()
			.then( function(){
				this.checkConnection()
					.then( function(){
						deferred.resolve.apply( deferred, arguments );
					})
					['catch']( function(){
						deferred.reject.apply( deferred, arguments );
					});
			})
			['catch'](function(){
				throw( 'it is not expected that an error could occur during logout' );
			});

		return( deferred.promise );
	}
	
	/**
	 * Refreshes information about the current user.
	 **/
	public getUserInfo():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		let scope:ConnectionManager = this;
		
		this.checkConnection()
			.then( function(){
				//console.log( 'connection found before getting user info' );
				//debugger;
				scope.jsForceConn.identity( function( err, res ){
					//console.log( 'results from trying to get the user identity' );
					//debugger;
					if( err ){
						console.error( 'error occurred when finding the user info' );
						deferred.reject( err );
					} else {
						//console.log( 'running as:' + res.username );
						//console.log( 'successfully recieved the user info' );
						
						scope.userInfo = res;
						
						deferred.resolve( res );
					}
				})
			})
			['catch']( function( err ){
				console.log( 'unable to get a valid connection.' );
				console.error( err ); console.error( JSON.stringify( err ));
				deferred.reject( arguments );
			});
					
		return( deferred.promise );
	}
	
	//-- private 
	
	/**
	 * Whether there is any connection currently.
	 * Whether there is a cached connection (true) or not (false).
	 * If there is a connection, it may not still be active - as determined by checkConnection.
	 * @see checkConnection
	 **/
	private hasConnection():boolean {
		return( this.jsForceConn !== null );
	}
	
		/**
	 * Prompts the user for credentials for logging in.
	 * (This is used under the sheets to force a login)
	 * @returns Q.Promise - for when the user has completed a successful connection to Salesforce.
	 **/
	private promptCredentials():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		let shouldPrompt:Boolean = true;
		
		//-- check for default credentials, but don't do anything unless its there and says doNotPrompt
		try {
			let defaultCredentials:any = require('../../defaultCredentials.json');
			if( defaultCredentials.doNotPrompt ){
				let results:any = ({
					"username": defaultCredentials.username,
					"password": defaultCredentials.password,
					"token": defaultCredentials.token
				});
				deferred.resolve( results );
				shouldPrompt=false;
			}
		} catch( err ){
			//-- to be expected if the default credentials are not there. move on.
		}
		
			//console.log( 'do not use default creds' );
		if( shouldPrompt ){
			prompt.start();
			prompt.get( this.promptSchema, function( err, result ){
				if( err ){
					deferred.reject( err );
				} else {
					console.log( "successfully asked for credentials" );
					console.log( 'credentials:' + JSON.stringify( result ) );
					deferred.resolve( result );
				}
			});
		}
		
		return( deferred.promise );
	}
}