/** store for holding connections **/
var ConfigStore = require( 'configstore' );

import * as Q from 'q';

/**
 * Represents a connection to salesforce.
 **/
export class Connection {
	
	/** The connection **/
	private nforce:any;
	
	/** the store for the connection **/
	private connectionStore:any;
	
	/** the initial host to connect to, otherwise we'll use the last connected host we've used, or production **/
	private initialHost:string;
	
	constructor( initialHost:string ){
		if( !initialHost ){
			initialHost = 'production';
		}
		this.nforce = null;
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
		//try {
			if( this.nforce !== null ){
				console.log( 'nforce was found' );
				return( true );
			} else {
				console.log( 'nforce not found' );
				let connectionInfo:ConnectionInfo = ConnectionInfo.deserialize( this.connectionStore );
				console.log( 'connectionInfo:' ); console.log( JSON.stringify( connectionInfo ) );
				return( connectionInfo.isComplete() );
			}
		//} catch( err ){ console.error( 'error occurred while checking connection' ); console.error( err ); }
		
		//return( false );
	}
		
	/**
	 * Determines if there is a connection (see hasConnection) and it is valid.
	 * If there is no cached connection (as determined by hasConnection), it will return false.
	 * return ConnectionInfo
	 **/
	public checkConnection():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		deferred.resolve( 'connection has been resolved' );
		
		return( deferred.promise );
	}
	
	/**
	 * Tries to login
	 **/
	public login( username:string, pass:string, token:string ):Q.Promise {
		//-- @TODO: 
		let deferred:Q.Promise = Q.defer();
		
		let conn:ConnectionInfo = new ConnectionInfo( "myServerUrl", "mySessionId", this.initialHost );
		conn.serialize( this.connectionStore );
		this.nforce = conn;
		
		deferred.resolve( this );
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
		this.nforce = null;
		
		deferred.resolve( 'success' );
		console.log( "Successful logout" );
		
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
var nforce = require('nforce');

var org = nforce.createConnection({
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

