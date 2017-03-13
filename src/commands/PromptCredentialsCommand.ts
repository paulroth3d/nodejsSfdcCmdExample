import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher";

import { simpleFailureHandler } from '../util';

let config:any = require( 'config' );

let APP = require( '../application' );
import { Connection } from '../application';

let prompt:any = require( 'prompt' );

/**
 * The commands to perform the login.
 **/
export class PromptCredentialsCommandGenerator implements CmdGenerator {
	
	public cmdName:string;
	
	public matches( cmdName:string ):boolean {
		return( cmdName == "promptCredentials" );
	}
	
	public generate( options:any ):PromptCredentialsCommand {
		return( new PromptCredentialsCommand() );
	}
}

export class PromptCredentialsCommand implements Cmd {
	
	private promptSchema:any;
	
	constructor(){
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
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		debugger;
		
		if( config.get('doNotPrompt' ) ){
			console.log( 'use default creds defined in config.' );
			deferred.resolve({
				"username": config.get("defaultCreds.username"),
				"password": config.get("defaultCreds.password"),
				"token": config.get("defaultCreds.token")
			});
		} else {
			//console.log( 'do not use default creds' );
			
			prompt.start();
			prompt.get( this.promptSchema, function( err, result ){
				if( err ){
					//simpleFailureHandler( 'error occurred while asking for credentials', arguments );
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