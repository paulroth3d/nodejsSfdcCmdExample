import { Cmd } from "./Cmd";

/**
 * Generator base class that will create command instances when they are run.
 **/
export interface CmdGenerator {
	
	/**
	 * Whether this command generator matches a given command pattern.
	 * @return Boolean
	 **/
	matches( cmdName:string ):boolean;
	
	/**
	 * Generates the command
	 * @return Cmd
	 **/
	generate( options:any ):Cmd;
}