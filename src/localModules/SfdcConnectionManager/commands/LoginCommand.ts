import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

import { simpleFailureHandler } from '../util';

import { Application, Connection } from '../application';
let APP = Application.getInstance();

import { PromptCredentialsCommand } from './PromptCredentialsCommand';

/**
 * The commands to perform the login.
 **/
export class LoginCommandGenerator implements CmdGenerator {
	
	public cmdName:string;
	
	public matches( cmdName:string ):boolean {
		return( cmdName == "login" );
	}
	
	public generate( options:any ):LoginCommand {
		return( new LoginCommand() );
	}
}

export class LoginCommand implements Cmd {
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		let c:Connection = APP.getConnection();
		let hasConnection:boolean = c.hasConnection();
		
		debugger;
		
		if( !hasConnection ){
			launcher.execute( 'promptCredentials', {} )
				.then( function( creds:any ):void {
					//console.log( 'connection credentials received' );
					c.login( creds.username, creds.password, creds.token )
						.then( function( c:Connection ):void {
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
			deferred.resolve( c );
		}
		
		return( deferred.promise );
	}
}

