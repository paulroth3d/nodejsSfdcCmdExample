import * as Q from 'q';
import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

import { Application, Connection } from '../application';
let APP = Application.getInstance();

/**
 * The commands to perform the logout.
 **/
export class LogoutCommandGenerator implements CmdGenerator {
	
	public cmdName:string;
	
	public matches( cmdName:string ):boolean {
		return( cmdName == "logout" );
	}
	
	public generate( options:any ):LogoutCommand {
		return( new LogoutCommand() );
	}
}

export class LogoutCommand implements Cmd {
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):Q.Promise {
		let deferred:Q.Promise = Q.defer();
		
		let c:Connection = APP.getConnection();
		c.logout()
			.then( function(results){
				console.log( 'logout completed' );
				deferred.resolve( results );
			})
			['catch']( function( err ){
				console.log( 'error occurred during logout' );
				console.log( err );
				console.log( JSON.stringify( err ));
				deferred.reject( err );
			});
		
		return( deferred.promise );
	}
}