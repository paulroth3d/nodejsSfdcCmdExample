import { CmdLauncher, CmdGenerator, Cmd } from "./localModules/CmdLauncher";

class LoginCommandGenerator implements CmdGenerator {
	
	public cmdName:string;
	
	public matches( cmdName:string ):boolean {
		return( cmdName == "login" );
	}
	
	public generate( options:any ):LoginCommand {
		return( new LoginCommand() );
	}
}

class LoginCommand implements Cmd {
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):any {
		console.log( "login command was called! by command:" + cmdName );
		if( options ){
			console.log( "options:" + options );
			console.log( JSON.stringify( options ));
		}
	}
}

//-- logout command
class LogoutCommandGenerator implements CmdGenerator {
	
	public cmdName:string;
	
	public matches( cmdName:string ):boolean {
		return( cmdName == "logout" );
	}
	
	public generate( options:any ):LoginCommand {
		return( new LoginCommand() );
	}
}

class LogoutCommand implements Cmd {
	
	public execute( launcher:CmdLauncher, cmdName:string, options:any ):any {
		console.log( "logout command was called! by command:" + cmdName );
		if( options ){
			console.log( "options:" + options );
			console.log( JSON.stringify( options ));
		}
	}
}

/**
 * Initializes the cmd launcher with a bunch of commands
 * @param launcher (CmdLauncher)
 **/
module.exports = exports = function( launcher:CmdLauncher ):void {
	launcher.addType( new LoginCommandGenerator() );
	launcher.addType( new LogoutCommandGenerator() );
}