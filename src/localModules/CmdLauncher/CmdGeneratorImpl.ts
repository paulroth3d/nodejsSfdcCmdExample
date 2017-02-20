let _ = require('underscore');
import { CmdGenerator } from "./CmdGenerator";
import { Cmd } from "./Cmd";
import { CmdImpl } from "./CmdImpl";

/**
 * Generator base class that will create command instances when they are run.
 **/
export class CommandGenerator implements CmdGenerator {
	
	/** name of the commad the generator is used for.
	 * used mostly for debugging.
	 * @TODO: review if it should be removed
	 **/
	public cmdName:string;
	
	/**
	 * Constructor
	 * @param cmdName (String)
	 **/
	constructor( cmdName:string ){
		this.cmdName = cmdName;
	}
	
	/**
	 * determines if this command generator matches the command given.
	 **/
	matches( cmdName:string ):boolean {
		return( cmdName && cmdName.indexOf( this.cmdName ) > -1 );
	}
	
	/**
	 * Generates the commandd
	 * @param options (Object)
	 * @return Cmd
	 **/
	generate( options:any ):Cmd {
		if( !options ){
			options = {};
		}
		
		return( new CmdImpl());
	}
}
