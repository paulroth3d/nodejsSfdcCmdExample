import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

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
			username: {
				required: true
			},
			password: {
				hidden: true
			},
			token: {
				required: false
			}
		};
	}
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		prompt.start();
		prompt.get( this.promptSchema, function( err, result ){
			if( err ){
				console.log( "there was an error asking for credentials" );
				console.log( '[' + err + ']' );
				console.log( JSON.stringify( err ));
				deferred.reject( err );
			} else {
				console.log( "successfully asked for credentials" );
				console.log( 'credentials:' + JSON.stringify( result ) );
				result = { username:'proth@salesforce.com', pass:'password', token:'' };
				deferred.resolve( result );
			}
		});
		
		return( deferred.promise );
	}
}