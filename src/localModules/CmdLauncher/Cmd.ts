import * as Q from 'q';
import { CmdLauncher } from "./index";

/**
 * Command that is created from a CommandGenerator and launched from a CmdLauncher.
 * These need to be created from the CmdGenerator.generate method.
 **/
export interface Cmd {
	/**
	 * Executes the command
	 * <p>Note: the command name does not need to be a name, it can be delimited. BUT this should likely be passed through options by the generator</p>
	 * @param launcher (CmdLauncher) - the launcher that generated the command (can be used to run other commands)
	 * @param cmdName (String) - the command name (or pattern) that the generator matched on.
	 * @param options (Object) - object with whatever parameters (as properties) that the command should use when running.
	 **/
	execute( launcher:CmdLauncher, cmdName:string, options:any ):Q.Promise;
}