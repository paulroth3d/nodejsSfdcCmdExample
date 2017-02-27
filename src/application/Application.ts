//-- connection
import { Connection } from "./Connection";

import * as Q from 'q';

/**
 * This is the magical container for the app.
 **/
export class Application {
	
	static instance:Application;
	public static getInstance(){
		if( !Application.instance ){
			debugger;
			Application.instance = new Application();
		}
		return( Application.instance );
	}
	
	/** node package **/
	private pkg:any;
	
	/** initial host **/
	private initialHost:string;
	
	/**
	 * Connection
	 **/
	private connection:any;
	
	constructor(){
		this.connection = null;
	}
	
	/**
	 * initializes the application.
	 * @param pkg (any) - the node package.
	 **/
	public init( pkg:any, initialHost:string ):void {
		debugger;
		this.initialHost = initialHost;
		
		this.pkg = pkg;
		let projectName:string = this.pkg.name;
		
		this.connection = new Connection( initialHost );
		this.connection.initializeConnectionStore( projectName );
		
		console.log( "application has been initialized" );
	}
	
	/**
	 * Gets the current connection
	 * @return Connection
	 **/
	public getConnection():Connection {
		return( this.connection );
	}
	
	/**
	 * Whether we are currently connected (true) or not (false)
	 * @return boolean
	 **/
	public isConnected():boolean {
		if( this.connection ){
			return( this.connection.isConnected() );
		}
		return( false );
	}
	
	/**
	 * Whether the connection is valid.
	 * (Delegate to the connection)
	 * @return Q.Promise
	 **/
	public checkConnection():Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		if( !this.connection ){
			deferred.reject('no connection');
		} else {
			return( this.connection.checkConnection() );
		}
		
		return( deferred.promise );
	}
	
	/**
	 * gets the node package info
	 * @return (Object) - the npm project package json
	 **/
	public getPackageInfo():any {
		return( this.pkg );
	}
	
	/**
	 * Determine the connection host
	 * @param hostDomain (string) - the custom host domain to use (note: https:// should not be included)
	 * @param useSandbox (boolean) - whether to use the sandbox (true) or not (false) - only if the hostDomain is not specified
	 **/
	public getConnectionHost( host:string, useSandbox:boolean ):string {
		if( host ){
			return( host );
		} else if( useSandbox ){
			return( 'sandbox' );
		}
		return( 'production' );
	}
}
