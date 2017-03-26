//-- connection
import { ConnectionManager } from "../localModules/SfdcConnectionManager";

/** store for holding connections **/
var ConfigStore = require( 'configstore' );

let config:any = require('config');

import * as Q from 'q';

/**
 * This is the magical container for the app.
 * @TODO: make this an event emitter.
 **/
export class Application {
	
	static instance:Application;
	public static getInstance(){
		if( !Application.instance ){
			Application.instance = new Application();
		}
		return( Application.instance );
	}
	
	/** connection store used
	 * @TODO: make typescript safe
	 **/
	private connectionStore:any;
	
	/** node package **/
	private pkg:any;
	
	/** initial host **/
	private initialHost:string;
	
	constructor(){
		
	}
	
	/**
	 * initializes the application.
	 * @param pkg (any) - the node package.
	 **/
	public init( pkg:any ):void {
		//debugger;
		this.pkg = pkg;
		let projectName:string = this.pkg.name;
		
		this.connectionStore = new ConfigStore( projectName );
		
		//console.log( "application has been initialized" );
	}
	
	/**
	 * Gets the current connection store
	 * @TODO: make the connectionStore typescript safe
	 **/
	public getConnectionStore():any {
		return( this.connectionStore );
	}
	
	/**
	 * Convenience function go get the application
	 * @return Connection
	 **/
	public getConnection():ConnectionManager {
		return( ConnectionManager.getInstance() );
	}
	
	/**
	 * gets the node package info
	 * @return (Object) - the npm project package json
	 **/
	public getPackageInfo():any {
		return( this.pkg );
	}
}
