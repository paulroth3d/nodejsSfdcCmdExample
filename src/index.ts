#!/usr/bin/env node

//-- this is an old line that I might be able to remove - ///<reference path='../typings/globals/require/index.d.ts' />

'use strict';

let pkg:any = require( '../package.json' );

/** command line argument handling **/
let program:any = require('commander');

/** extensible configuration settings, with overrides based on build enviornments **/
var config = require( 'config' );

/** allow for promises(); **/

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- local modules
let safeToString = require( './localModules/safeToString' );

//-- import the command launcher
import { CmdLauncher } from './localModules/CmdLauncher';

//-- initialize the commands
let launcher = new CmdLauncher();
require( './CommandInitializer' )( launcher )

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- local variables
let initialHost:string;

/** the application instance **/
import { Application } from './application';
let APP = Application.getInstance();

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- initialize the app.

program
        .version('0.0.1')
        .option( '-l, --login', 'start the login process' )
        .option( '-s, --sandbox', 'use this parameter if you need to connect to a sandbox' )
        .option( '-h, --host [domain]', 'use this to connect to a custom domain' )
        .option( '-p, --put [somevalue]', 'test put and getting values' )
        .option( '-g, --get', 'gets the value from the config store' )
        .option( '-o, --logout', 'logs the current user out' )
        .parse( process.argv ); //-- always end with a parse

program.on( '--help', function(){
	console.log( '' + pkg.description );
	console.log( '[' + pkg.version + ']' );
	
	program.help();
});

debugger;
initialHost = APP.getConnectionHost( program.host, program.sandbox );
APP.init( pkg, initialHost );
console.log( 'isConnected:' + APP.getConnection().hasConnection() );

//-- initializes the app.
APP.init( pkg, initialHost );

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- send out the commands

if( program.logout ){
	console.log( 'request to logout recieved' );
	launcher.execute( 'logout', {} )
		.then( function(){
			console.log( 'logout completed' );
		})
		['catch']( function( err ){
			console.log( 'error occurred during logout' );
			console.log( err );
			console.log( JSON.stringify( err ));
		});
}

if( program.login ){
	console.log( "request to login received" );
	launcher.execute( "login", { someProgram:"this" } )
		.then( function(){
			console.log( "login command completed" );
		})
		.catch( function(){
			console.log( "error occurred for login" );
		})
		.done( function(){
			console.log( "done called for login" );
		})
}

console.log( "at the end of the project" );