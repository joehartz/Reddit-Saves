/* Reddit class to preform API functions */
var _ = require('lodash');

class Reddit {
    constructor()
    {
        // setup env variables
        this.clientID = process.env.REACT_APP_CLIENTID;
        this.redirectURL = process.env.REACT_APP_REDIRECT_URL;
        this.host = process.env.REACT_APP_REACT_APP_SERVER;
        this.scope = process.env.REACT_APP_SCOPE;

        this.duration = 'permanent';
        this.state = new Date().getUTCMilliseconds();
        this.code = '';
        this.accessToken = '';
        this.saves = [];
        this.fetching = true;
        this.subs = [];

    }

    getAuthURL()
    {

        let url = `https://www.reddit.com/api/v1/authorize?client_id=${this.clientID}&response_type=code&state=${this.state}&redirect_uri=${this.redirectURL}&duration=${this.duration}&scope=${this.scope}`;

        return encodeURI(url);
    }

    getAccessToken(cb)
    {
        // get the url parameters
        this.code = this.getUrlParameter('code');

        if (this.code) {

            // make a request to out node server!
            let request = new Request(this.host + '?code=' + this.code, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // make the call....

            fetch(request).then(response => response.json()).then(cb).catch(error => {
                console.log('request failed', error);
            });

        }

    }

    getSaves(cb)
    {
        // only if we have an access token
        if (this.accessToken) {

            function makeRequest(after = 0) {

                // setup the request test request
                let request = new Request(`https://oauth.reddit.com/user/${this.username}/saved?limit=100&after=` + after, {
                    method: 'get',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'bearer ' + this.accessToken
                    }
                });

                fetch(request).then(function(response) {
                    // Convert to JSON
                    return response.json();
                }).then((j) => {
                    // save the data
                    //this.saves .= _.assign(j.data.children, this.saves);
                    this.saves = this.saves.concat(j.data.children);

                    if (j.data.after !== null) {
                        // keep making requests to fetch all the save
                        makeRequest.call(this, j.data.after);
                    } else {
                        this.fetching = false;
                    }
                }).then(cb);

            }

            // start fetching their saves
            makeRequest.call(this);

        }
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null
            ? ''
            : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    setAccesToken(token)
    {
        this.accessToken = token;
    }

}

export default(new Reddit());
