/**
 * The login credentials used to login to salesforce.
 * (The fruit from any credentials prompt)
 * @see ConnectionManager
 **/
export interface ILoginCredentials {
	
	/** username to login as **/
	username: String;
	
	/** password or passwordtoken **/
	password: String;
	
	/** optional token **/
	token: String;
};

export class LoginCredentials implements ILoginCredentials {
	
	public username:String;
	
	/**
	 * either simply the password
	 * or
	 * passwordtoken (password + token without any spaces)
	 **/
	public password:String;
	
	/** optional token **/
	public token:String;
}