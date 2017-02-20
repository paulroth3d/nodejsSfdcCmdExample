import { CmdLauncher, CmdGenerator, Cmd } from "../localModules/CmdLauncher"

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
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):any {
		console.log( "logout command was called! by command:" + cmdName );
		if( options ){
			console.log( "options:" + options );
			console.log( JSON.stringify( options ));
		}
	}
}