import { CmdLauncher, CmdGenerator, Cmd } from "./localModules/CmdLauncher";

//import { LoginCommandGenerator, LogoutCommandGenerator, PromptCredentialsCommandGenerator } from "./commands";


/**
 * Initializes the cmd launcher with a bunch of commands
 * @param launcher (CmdLauncher)
 **/
module.exports = exports = function( launcher:CmdLauncher ):void {
	//-- launcher isn't needed to be sent - as it is a singleton
	//-- but it makes it clearer what we are doing here.'
	//launcher.addType( new LoginCommandGenerator() );
}