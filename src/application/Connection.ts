/** store for holding connections **/
var ConfigStore = require( 'configstore' );

var jsforce:any = require('jsforce');

import { CmdLauncher } from '../localModules/CmdLauncher';
let launcher:CmdLauncher = CmdLauncher.getInstance();

import * as Q from 'q';

/**
 * Represents a connection to salesforce.
 **/
export class Connection {
	
	/** The (VERIFIED) connection **/
	private jsForceConn:any;
	
	/** the store for the connection **/
	private connectionStore:any;
	
	/** the initial host to connect to, otherwise we'll use the last connected host we've used, or production **/
	private initialHost:string;
	
	/** whether the connection has been checked within the current execution
	  * While we can test multiple times, for now we assume that it only
	  * needs to be checked once.
	  **/
	//private wasConnectionChecked:boolean = false;
	
	/**
	 * Current user's information
	 **/
	public userInfo:any;
	
	constructor( initialHost:string ){
		if( !initialHost ){
			initialHost = 'production';
		}
		this.jsForceConn = null;
		this.connectionStore = null;
		this.initialHost = initialHost;
	}
	
	/**
	 * Initializes the connection store
	 * @param storename (String)
	 **/
	public initializeConnectionStore( storeName:string ):void {
		this.connectionStore = new ConfigStore( storeName );
	}
	
	/**
	 * Whether there is any connection currently.
	 * Whether there is a cached connection (true) or not (false).
	 * If there is a connection, it may not still be active - as determined by checkConnection.
	 * @see checkConnection
	 **/
	public hasConnection():boolean {
		return( this.jsForceConn !== null );
	}
		
	/**
	 * Determines if there is a connection (see hasConnection) and it is valid.
	 * If there is no cached connection (as determined by hasConnection), it will return false.
	 * return ConnectionInfo
	 * @TODO: make this private, really we should only need this when using it.
	 **/
	public checkConnection():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		let scope:Connection = this;
		
		//-- @TODO: verify the connection - possibly using the api for a test.
		//-- @TODO: perhaps we could also cache the latest check - we only need to check once.
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
					
					//-- @TODO: login?
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
					
					//-- could not get anything.
					//-- @TODO: login?
					
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
		//console.log( "request to login received" );
		return( launcher.execute( "login", null ));
	}
	
	/**
	 * Tries to login
	 **/
	public login( username:string, pass:string, token:string ):Q.Promise {
		//-- @TODO: 
		let deferred:Q.Promise = Q.defer();
		
		let loginConn:any = new jsforce.Connection({
			loginUrl: this.initialHost	
		});
		
		let scope:Connection = this;
		
		loginConn.login( username, pass + token, function( err, userInfo ){
			if( err ){
				console.error( 'Error occurred during jsForce login' );
				console.log( err );
				console.log( JSON.stringify( err ));
				
				return( launcher.execute( "login", null ));
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
	 * Gets information about the current user.
	 **/
	public getUserInfo():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		let scope:Connection = this;
		
		//-- @TODO: catch should never really fire, because we'll always try it again., right?
		
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
}

export class ConnectionInfo {
	public serverUrl:string;
	public sessionId:string;
	public lastConnectionHost:string;
	
	constructor( serverUrl:string, sessionId:string, lastConnectionHost:string ){
		this.serverUrl = serverUrl;
		this.sessionId = sessionId;
		this.lastConnectionHost = lastConnectionHost;
	}
	
	public isComplete():boolean{
		if( this.serverUrl && this.sessionId && this.lastConnectionHost ){
			return( true );
		} else {
			return( false );
		}
	}
	
	public static deserialize( connectionStore:any ):ConnectionInfo {
		let result:ConnectionInfo = new ConnectionInfo( 
			connectionStore.get( 'serverUrl' ),
			connectionStore.get( 'sessionId' ),
			connectionStore.get( 'lastConnectionHost' )
		);
		return( result );
	}
	
	public serialize( connectionStore:any ):void {
		connectionStore.set( 'serverUrl', this.serverUrl );
		connectionStore.set( 'sessionId', this.sessionId );
		connectionStore.set( 'lastConnectionHost', this.lastConnectionHost );
	}
}

/*
var jsForceConn = require('jsForceConn');

var org = jsForceConn.createConnection({
  clientId: 'SOME_OAUTH_CLIENT_ID',
  clientSecret: 'SOME_OAUTH_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  apiVersion: 'v27.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var username      = 'my_test@gmail.com',
    password      = 'mypassword',
    securityToken = 'some_security_token',
    oauth;

org.authenticate({ username: username, password: password, securityToken: securityToken }, function(err, resp){
  if(!err) {
    console.log('Access Token: ' + resp.access_token);
    oauth = resp;
  } else {
    console.log('Error: ' + err.message);
  }
});
*/

