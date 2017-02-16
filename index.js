#!/usr/bin/env node
'use strict';

const program = require('commander');
const pkg = require( './package.json' );

const config = require( 'config' );
const prompt = require( 'prompt' );

//-- commander examples: https://github.com/tj/commander.js/tree/master/examples

program
        .version('0.0.1')
        .option( '-l, --login', 'start the login process' )
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

var promptSchema = {
	properties: {
		username: {
			required: true
		},
		password: {
			required: true,
			hidden: true
		},
		token: {
			message: 'your security token - blank if not needed'
		}
	}
};

if( program.login ){
	prompt.start();
	prompt.get( promptSchema, function( err, result ){
		if( err ){
			console.log( 'error found' );
			console.log( JSON.stringify( err ));
		} else {
			console.log( 'logging in as:' );
			console.log( 'username:' + result.username );
			var passToken = result.password + result.token;
			console.log( 'passToken:' + passToken );
		}
	});
}