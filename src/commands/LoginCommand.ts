import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

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
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):any {
		console.log( "login command was called! by command:" + cmdName );
		if( options ){
			console.log( "options:" + options );
			console.log( JSON.stringify( options ));
		}
	}
}