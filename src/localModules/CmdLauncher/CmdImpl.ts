let q = require('q');
import { CmdLauncher } from "./index";
import { Cmd } from "./Cmd";

/**
 * Implementation of a command
 **/
export class CmdImpl implements Cmd {
	
	constructor(){
		console.log( "Cmd was implemented" );
	}
	
	/**
	 * Execute the command
	 * @param launcher:CmdLauncher
	 * @param cmdName:String - the name the command was created through
	 * @param options (any/object) - the arguments to use when running the command
	 **/
	execute( launcher:CmdLauncher, cmdName:string, options:any ):any {
		console.log( 'launcher executed[' + cmdName + ']' );
		try {
			console.log( 'arguments sent:' ); console.log( options ); console.log( JSON.stringify( options ));
		} catch( err ){}
	}
}