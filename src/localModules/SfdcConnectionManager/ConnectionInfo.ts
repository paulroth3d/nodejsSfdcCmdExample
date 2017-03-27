/**
 * Represents an active connection to a Salesforce Session.
 * @TODO: make connectionStore typescript safe - right now it supports smartstore / npm configStore
 **/
export class ConnectionInfo {
	/** server domain the session is tied to **/
	public serverUrl:string;
	/** session id/access token **/
	public sessionId:string;
	/** connection host used to initiate the connection / often the same as serverUrl **/
	public lastConnectionHost:string;
	
	/**
	 * constructor
	 * @param serverUrl (string)
	 * @param sessionId (string)
	 * @param lastConnectionHost (string)
	 **/
	constructor( serverUrl:string, sessionId:string, lastConnectionHost:string ){
		this.serverUrl = serverUrl;
		this.sessionId = sessionId;
		this.lastConnectionHost = lastConnectionHost;
	}
	
	/**
	 * Whether the connection info is complete (all information provided)
	 * @return boolean - true if complete, false if not
	 **/
	public isComplete():boolean{
		if( this.serverUrl && this.sessionId && this.lastConnectionHost ){
			return( true );
		} else {
			return( false );
		}
	}
	
	/**
	 * Serializes this instance into a connection store.
	 * (Performed synchronously for now)
	 **/
	public serialize( connectionStore:any ):void {
		connectionStore.set( 'serverUrl', this.serverUrl );
		connectionStore.set( 'sessionId', this.sessionId );
		connectionStore.set( 'lastConnectionHost', this.lastConnectionHost );
	}
	
	/**
	 * Deserializes a connection from the connection store.
	 * @return (ConnectionStore)
	 * @see #serialize(connectionStore)
	 **/
	public static deserialize( connectionStore:any ):ConnectionInfo {
		let result:ConnectionInfo = new ConnectionInfo( 
			connectionStore.get( 'serverUrl' ),
			connectionStore.get( 'sessionId' ),
			connectionStore.get( 'lastConnectionHost' )
		);
		return( result );
	}
}