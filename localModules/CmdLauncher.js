/**
 * Module to handle the command pattern.
 * @author Paul Roth <proth@salesforce.com>
 **/
function CmdLauncher(){
	this.initialize();
	return( this );
}

/**
 * the initialization of the command structure.
 * (should always be the first thing called)
 **/
CmdLauncher.prototype.initialize = function(){
	console.log( "initialize called" );
}

module.exports = exports = new CmdLauncher();