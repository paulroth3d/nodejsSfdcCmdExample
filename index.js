#!/usr/bin/env node
'use strict';

const program = require('commander');
const pkg = require( './package.json' );

const config = require( 'config' );

//-- commander examples: https://github.com/tj/commander.js/tree/master/examples

program
        .version('0.0.1')
        .option( '-s, --sandbox', 'use this parameter if you need to connect to a sandbox' )
        .option( '-h, --host [domain]', 'use this to connect to a custom domain' )
        .parse( process.argv ); //-- always end with a parse

program.on( '--help', function(){
	console.log( '' + pkg.description );
	console.log( '[' + pkg.version + ']' );
	
	program.help();
});

try {
	var hostURL = config.get( 'hosts.production' );
	if( program.host ){
		hostURL = 'https://' + program.host;
	} else if( program.sandbox ){
		hostURL = config.get( 'hosts.sandbox' );
	}
	console.log( 'hostURL:' + hostURL );
} catch( err ){
	console.log( 'error occurred:' ); console.log( err );
}