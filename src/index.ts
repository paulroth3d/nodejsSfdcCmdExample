#!/usr/bin/env node

//-- this is an old line that I might be able to remove - ///<reference path='../typings/globals/require/index.d.ts' />

'use strict';

let pkg:any = require( '../package.json' );

//-- @TODO: remove
console.log( 'package.name:' + pkg.name );
debugger;
console.log( 'something else' );

/** command line argument handling **/
let program:any = require('commander');

/** extensible configuration settings, with overrides based on build enviornments **/
var config = require( 'config' );

//-- local commands
let hostURL:String;

//-- local modules
let safeToString = require( './localModules/safeToString' );

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

console.log( 'login:' + program.login );

//-- determine the host url;
try {
	hostURL = config.get( 'hosts.production' );
	if( program.host ){
		hostURL = 'https://' + program.host;
	} else if( program.sandbox ){
		hostURL = config.get( 'hosts.sandbox' );
	}
	console.log( 'hostURL:' + hostURL );
} catch( err ){
	console.log( 'error occurred:' ); console.error( err ); console.error( JSON.stringify( err ));
}

console.log( safeToString( pkg ));

console.log( "at the end of the project" );