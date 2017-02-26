//-- connection
import { Connection } from "./Connection";

/**
 * This is the magical container for the app.
 **/
class Application {
	
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
	public getConnectionHost( host:string, useSandbox:boolean ):String {
		if( host ){
			return( host );
		} else if( useSandbox ){
			return( 'sandbox' );
		}
		return( 'production' );
	}
}

module.exports = exports = new Application();

export * from './Connection';
