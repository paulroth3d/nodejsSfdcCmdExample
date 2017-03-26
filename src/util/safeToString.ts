/**
 * Function to safely print an object to string EVEN IF there are cyclical dependencies.
 * (This only prints the first level)
 * 
 * ex: import
 **/
export function safeToString(evt:any, printErrors:boolean ):string {
	//-- container for property by string [type]:value
	var result:any={};
	var str;
	for( var prop in evt ){
		str="evt[" + prop + "]:";
		try{
			str+=(typeof evt[prop]);
		} catch(e){
			str+="unknown";
			if( printErrors === true ){
				console.error( "error found while checking prop[" + prop + "]" ); console.error( e ); console.error( JSON.stringify(e));
			}
		}
		str+="=";
		try{
			str+=JSON.stringify(evt[prop]);
		} catch( e ){
			str+="unknown";
			if( printErrors === true ){
				console.error( "error found while getting value for prop[" + prop + "]" ); console.error( e ); console.error( JSON.stringify(e));
			}
		}
		result[prop]=str;
	}
	return( JSON.stringify( result ));
}