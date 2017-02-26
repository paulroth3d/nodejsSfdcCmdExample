import { CmdLauncher, CmdGenerator, Cmd } from "./localModules/CmdLauncher";

import { LoginCommandGenerator, LogoutCommandGenerator, PromptCredentialsCommandGenerator } from "./commands";


/**
 * Initializes the cmd launcher with a bunch of commands
 * @param launcher (CmdLauncher)
 **/
module.exports = exports = function( launcher:CmdLauncher ):void {
	launcher.addType( new LoginCommandGenerator() );
	launcher.addType( new LogoutCommandGenerator() );
	launcher.addType( new PromptCredentialsCommandGenerator() );
}