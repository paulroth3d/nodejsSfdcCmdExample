#!/usr/bin/env node
'use strict';

var pkg = require( './package.json' );

/** command line argument handling **/
var program = require('commander');

/** extensible configuration settings, with overrides based on build enviornments **/
var config = require( 'config' );

/** command line prompting tool **/
var prompt = require( 'prompt' );

/** tool to allow connecting and interacting with salesforce **/
var sf = require( 'node-salesforce' );

/** configuration storage **/
var Configstore = require( 'configstore' );
var STORE = new Configstore( pkg.name, { somevalue: 'original value' });

//-- commander examples: https://github.com/tj/commander.js/tree/master/examples

program
        .version('0.0.1')
        .option( '-l, --login', 'start the login process' )
        .option( '-s, --sandbox', 'use this parameter if you need to connect to a sandbox' )
        .option( '-h, --host [domain]', 'use this to connect to a custom domain' )
        .option( '-p, --put [somevalue]', 'test put and getting values' )
        .option( '-g, --get', 'gets the value from the config store' )
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

function safeToString(evt){
    var result={};
    var str;
    for( var prop in evt ){
      str="evt[" + prop + "]:";
      try{
        str+=(typeof evt[prop]);
      } catch(e){
        str+="unknown";
      }
      str+="=";
      try{
        str+=JSON.stringify(evt[prop]);
      } catch( e ){
        str+="unknown";
      }
      result[prop]=str;
    }
    return( JSON.stringify( result ));
}

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
		
		conn = new sf.Connection({
			loginUrl: hostURL
		});
		conn.login( result.username, passToken, function( err, userInfo ){
			console.log( 'result came back' );
			if( err ){
				console.log( err );
				console.log( 'error occurred during login. please try again' );
			} else {
				console.log( 'userInfo' );
				console.log( JSON.stringify( userInfo ));
				console.log( 'conn:' + (typeof conn) );
				try {
					STORE.set( 'lasthost', hostURL );
					STORE.set( 'accessToken', conn.accessToken );
					STORE.set( 'instanceUrl', conn.instanceUrl );
				} catch( err ){
					console.log( 'error occurred' ); console.log( err );
				}
				console.log( 'successfuly logged in' );
				
				conn.query( 'select id, name from account limit 10', function( err, result ){
					console.log( 'query came back' );
					if( err ){
						console.log( 'error:' ); console.log( JSON.stringify( err ));
					} else {
						console.log("total : " + result.totalSize);
						console.log("fetched : " + result.records.length);
						console.log("done ? : " + result.done);
						if (!result.done) {
							// you can use the locator to fetch next records set. 
							// Connection#queryMore() 
							console.log("next records URL : " + result.nextRecordsUrl);
						}
					}
				});
			}
		});
	});
} else {
	var connObj = {
		instanceUrl: STORE.get( 'instanceUrl' ),
		accessToken: STORE.get( 'accessToken' )
	};
	console.log( 'connObj:' );
	console.log( JSON.stringify( connObj ));
	console.log( 'lastHost:' + STORE.get( 'lasthost' ) );
	
	var conn = new sf.Connection(connObj);
	console.log( 'conn:' ); console.log( safeToString( conn ));
	
	conn.query( 'select id, name from account limit 10', function( err, result ){
		console.log( 'query came back' );
		if( err ){
			console.log( 'error:' ); console.log( JSON.stringify( err ));
		} else {
			console.log("total : " + result.totalSize);
			console.log("fetched : " + result.records.length);
			console.log("done ? : " + result.done);
			if (!result.done) {
				// you can use the locator to fetch next records set. 
				// Connection#queryMore() 
				console.log("next records URL : " + result.nextRecordsUrl);
			}
		}
	});
}

