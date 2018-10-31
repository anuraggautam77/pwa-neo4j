class Auth {
    /**
     * Authenticate a user. Save a token string in Local Storage
     *
     * @param {string} token
     */
    static authenticateUser(token) {
        localStorage.setItem('jwtToken', token);
    }
    /**
     * Check if a user is authenticated - check if a token is saved in Local Storage
     *
     * @returns {boolean}
     */
    static isUserAuthenticated(cb) {

/*
        fetch('/api/authvalidate', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': window.localStorage.getItem('jwtToken'),
                'id': window.localStorage.getItem('userid')
            },
            body: JSON.stringify({})
        }
        ).then(res => res.json()).then(json => {
            if (json.status !== 200) {
                    
            } else {

            }
        });*/
         //return true;
           return localStorage.getItem('jwtToken') !== null;
    }
    /**
     * Deauthenticate a user. Remove a token from Local Storage.
     *
     */
    static deauthenticateUser() {
        localStorage.removeItem('jwtToken');
    }
    /**
     * Get a token value.
     *
     * @returns {string}
     */

    static getToken() {
        return localStorage.getItem('jwtToken');
    }
}

export default Auth;