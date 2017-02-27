/**
 * Function to show failures simply and easily.
 * @param message (string) - the message to be shwon when the handler is called.
 * @return (Function) - function that will print the message and echo all of the arguments
 **/
export function simpleFailureHandler( message:string, args:any ):void {
	console.log( 'simpleFailureHandler:' + message );
	console.log( '[' + args + ']' );
	console.log( JSON.stringify( args ));
}