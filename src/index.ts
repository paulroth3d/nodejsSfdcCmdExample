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

//-- import the command launcher
import { CmdLauncher } from './localModules/CmdLauncher';

import { safeToString, simpleFailureHandler } from './util';

//-- initialize the commands
let launcher:CmdLauncher = CmdLauncher.getInstance();
require( './CommandInitializer' )( launcher );

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- local variables
let initialHost:string;

/** the application instance **/
import { Application } from './application';
/** the connection manager **/
import { ConnectionManager } from './localModules/SfdcConnectionManager'
//-- singleton instance of the app
let APP:Application = Application.getInstance();
//-- singleton instance of the connection to salesforce
let connection:ConnectionManager= ConnectionManager.getInstance();

//-- whether the app is connected
let isConnected:boolean;

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

//-- initializes the app.
APP.init( pkg );

//-- determine which host to use. (either production, sandbox or a custom)
initialHost = ConnectionManager.getConnectionHost( program.host, program.sandbox );
//-- initialize the settings for a connection
connection.setup( initialHost, APP.getConnectionStore() );

//-- #	#	#	#	#	#	#	#	#	#	#	#	#	#	#
//-- send out the commands

if( program.logout ){
	//console.log( 'request to logout recieved' );
	connection.logout()
		.then( function(){
			console.log( "Successfully logged out." );
		})
		['catch']( function( err ){
			console.log( 'error occurred during logout' );
			console.log( err );
			console.log( JSON.stringify( err ));
		});
}
if( program.login ){
	//console.log( "request to login received" );
	connection.promptLogin()
		.then( function(){
			console.log( 'Successful login' );
		})
		.catch( function( err ){
			debugger;
			console.log( "error occurred for login" );
		});
}

//-- always check initially to make sure that we're connected
//-- before doing anything else.
if( !program.login && !program.logout ){
	
	debugger;
	//-- continue our merry way
	connection.checkConnection()
		.then( function( conn:ConnectionManager ){
			debugger;
			console.log( "Connected as:" + conn.userInfo.username + ". Waiting for further instruction" );
		})
		['catch']( function( err ){
			//simpleFailureHandler( 'Not connected', arguments );
			console.error( "not currently connected. Please try running with --login" );
			console.error( err );
			console.error( JSON.stringify( err ));
			debugger;
			connection.reset();
		});
}

//console.log( "at the end of the project" );