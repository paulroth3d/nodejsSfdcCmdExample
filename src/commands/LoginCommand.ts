import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

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
		
		debugger;
		console.log( 'login command execute received' );
		
		let c:Connection = APP.getConnection();
		let hasConnection:boolean = c.hasConnection();
		
		if( !hasConnection ){
			launcher.execute( 'promptCredentials', {} )
				.then( function( creds:any ):void {
					console.log( 'connection credentials received' );
					c.login( creds.username, creds.pass, creds.token )
						.then( function( c:Connection ):void {
							console.log( 'successful login' );
							deferred.resolve( c );
						})
						['catch']( function( err ){
							console.log( 'failed to connect' );
							console.error( '@TODO' );
							deferred.reject( err );
						});
				})
				['catch']( function( err ){
					console.log( 'failure when asking for credentials' );
					console.log( '[' + err + ']' );
					console.log( JSON.stringify( err ));
					deferred.reject( err );
				})
		} else {
			console.log( 'connection already has a connection' );
			deferred.resolve( c );
		}
		
		return( deferred.promise );
	}
}

