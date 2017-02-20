//-- utilize promises
import * as Q from 'q';

import { CmdGenerator } from "./CmdGenerator"
import { Cmd } from "./Cmd"

/**
 * Launcher and facade to build commands and generators.
 * @author Paul Roth <proth@salesforce.com>
 **/
export class CmdLauncher {
	
	//-- errors
	public static ERROR_COMMAND_NOT_FOUND:string = 'ERROR: No command found matching:';
	
	/**
	 * Map of the command name : generators
	 */
	private generators:CmdGenerator[];
	
	/**
	 * Constructor
	 **/
	constructor(){
		this.generators = [];
		return( this );
	}
	
	/**
	 * Adds a generator to the list
	 * @param generator (CmdGenerator)
	 **/
	addType( generator:CmdGenerator ):void {
		this.generators.unshift( generator );
	}
	
	/**
	 * Whether the CmdLauncher has a specific command type defined.
	 * @return Boolean
	 **/
	hasType( cmdName:string ):boolean {
		return( this.getType( cmdName ) !== null );
	}
	
	/**
	 * Determines the generator that matches a given cmd
	 * @return CmdGenerator
	 **/
	getType( cmdName:string ):CmdGenerator {
		let result:CmdGenerator = null;
		let generator:CmdGenerator;
		if( this.generators && this.generators.length > 0 ){
			for( let i = 0; i < this.generators.length; i++ ){
				generator = this.generators[i];
				
				//-- do not put a try catch on, because we want to know errors that occur
				//try {
					if( generator.matches( cmdName )){
						return( generator );
					}
				//} catch( err ){}
			}
		}
		return( result );
	}
	
	/**
	 * Execute a command based on a given command name
	 * @param cmdName (String)
	 * @param options (Object)
	 * @return q.Promise
	 **/
	execute( cmdName:string, options:any ):Q.Promise {
		let generator:CmdGenerator = this.getType( cmdName );
		if( generator == null ){
			console.error( CmdLauncher.ERROR_COMMAND_NOT_FOUND + cmdName );
			return( null );
		}
		
		let resultCmd:Cmd = generator.generate( options );
		return( resultCmd.execute( this, cmdName, options ));
	}
}

export * from "./CmdGenerator"
export * from "./Cmd"