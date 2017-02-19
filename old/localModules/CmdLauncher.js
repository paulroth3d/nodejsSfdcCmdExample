var q = require('q');

/**
 * Module to handle the command pattern.
 * @author Paul Roth <proth@salesforce.com>
 **/
function CmdLauncher(){
	this.initialize();
	this.generators = {};
	return( this );
}

/**
 * the initialization of the command structure.
 * (should always be the first thing called) and overridden
 **/
CmdLauncher.prototype.initialize = function(){
	console.log( "initialize called" );
}

//-- sub classes
/*
abstract class LauncherCommand {
	LauncherCommand( cmdName:String , launcher:CmdLauncher );
	getName():String;
	getLauncher():CmdLauncher;
	execute( launcher:CmdLauncher ):Q.Promise;
}
*/

/**
 * Instance of a command (BaseClass) that is created by the CommandGenerator every time the command is launched.
 * The CommandGenerator should create an instance of this on the generate() method
 **/
function LauncherCommand( launcher, cmdName, options ){
	this.cmdName = cmdName;
	this.launcher = launcher;
	this.options = options || {};
	return( this );
}

LauncherCommand.prototype.getName = function(){
	return( this.cmdName );
}

LauncherCommand.prototype.getLauncher = function(){
	return( this.launcher );
}

LauncherCommand.prototype.getOptions = function(){
	return( this.options );
}

/**
 * Method to be executed when the command is ready to be run.
 * should always return a q.Promise
 **/
LauncherCommand.prototype.execute = function(){
	console.warn( "default execute method called. Override this method with your own functionality" );
	var promise = Q.defer();
	promise.resolve();
	return( promise );
}

/*
interface CommandGenerator {
	generate( launcher:CmdLauncher ):LauncherCommand
}
*/

/**
 * Generator base class that will create command instances when they are run.
 **/
function CommandGenerator( cmdName ){
	this.launcher = launcher;
	this.cmdName = cmdName;
	return(this);
}

CommandGenerator.prototype.getName = function(){
	return( this.cmdName );
}

CommandGenerator.prototype.setLauncher = function( launcher ){
	this.launcher = launcher;
}

CommandGenerator.prototype.getLauncher = function(){
	return( this.launcher );
}

/**
 * builds a LauncherCommand
 * @param options (Object)
 * @return LauncherCommand
 **/
CommandGenerator.prototype.generate = function( options ){
	if( !options ){
		options = {};
	}
	return( new LauncherCommand( this.launcher, this.cmdName, options ));
}

/**
 * Allow the CmdLauncher to include builders based on a cmdName
 * @param cmdName (String)
 * @param generator (CommandGenerator) - the generator that will generate the commands
 **/
CmdLauncher.prototype.addType = function( generator ){
	if( !generator ){
		throw( 'Cannot add invalid generator' );
	}
	
	var cmdName = generator.getName();
	
	if( !this.hasType( cmdName )){
	} else {
		this.generators[ cmdName ] = generator;
		generator.setLauncher( this );
		return( true );
	}
}

/**
 * Whether there is already a command registered for a given cmdName
 * @return Boolean
 **/
CmdLauncher.prototype.hasType = function( cmdName ){
	return( this.generators.hasOwnProperty( cmdName ));
}

/**
 * Execute a command based on a given command name
 * @param cmdName (String)
 * @param options (Object)
 * @return q.Promise
 **/
CmdLauncher.prototype.execute = function( cmdName, options ){
	if( !this.hasType( cmdName )){
		throw( "Unknown command:" + cmdName );
	}
	
	var generator = this.generators[ cmdName ];
	var cmd = generator.generate( options );
	return( cmd.execute() );
}

CmdLauncher.prototype.LauncherCommand = LauncherCommand;
CmdLauncher.prototype.CommandGenerator = CommandGenerator;

module.exports = exports = new CmdLauncher();