var request = require('request');

export default class Api {
  constructor()
  {
     this.appSecret = process.env.APPSECRET;
     this.clientID = process.env.CLIENTID;
     this.code = '';
     this.redirectURL = process.env.REDIRECTURL;
     this.authURL = 'https://oauth.reddit.com/';
     this.username = '';

     this.res = '';

     // after authenticaiton codes
     this.accessToken = '';
     this.refreshToken = '';
  }

  getAccessCode()
  {
    // make the request for the auth code....
    var auth = new Buffer(this.clientID + ':' + this.appSecret).toString('base64');
    var options = {
      form: {
        grant_type: 'authorization_code',
        code: this.code,
        redirect_uri: this.redirectURL,
      },
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded'

        }
      };

    // send the request
     request.post('https://www.reddit.com/api/v1/access_token', options,  (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var body = JSON.parse(body);

        // set the resonse and acces tokens to use again
        this.accessToken = body.access_token;
        this.refreshToken = body.refresh_token;

        console.log(`Access Token: ${this.accessToken}`);

        this.makeApiRequest('api/v1/me', 'get');


      } else {
        console.log('COULD NOT GET AN ACCESS TOKEN FORM REDDIT!');
        return false;
      }
        });

  }

  makeApiRequest(endpoint, method='get')
  {
    // make a request to the reddit api
    var options = {
      uri: endpoint,
      method: method,
      baseUrl: this.authURL,
      json: true,
      auth: {
        'bearer': this.accessToken

      },
      headers: {
        'User-Agent': 'Node.js Reddit app'
      }
    };

    request(options, (error, response, body) => {
       if (!error && response.statusCode == 200) {
           // set the username
           this.username = body.name;
           this.res.status(200).json({ username: this.username, access_code: this.accessToken });
           return true;
       }
    });

    // make the request
    //request(options, (error, response, body) => {
    //  console.log(body);
    //});


  }

  setCode(code='')
  {
    this.code = code;
  }

  setResonse(res)
  {
    this.res = res;
  }


}
