import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher";

import { simpleFailureHandler } from '../util';

let fs = require('fs');

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
		let shouldPrompt:Boolean = true;
		
		//-- @TODO: separate out credentials to a separate class/interface
		
		//-- check for default credentials
		try {
			let defaultCredentials:any = require('../defaultCredentials.json');
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