/* Reddit class to preform API functions */
var _ = require('lodash');

class Reddit {
    constructor()
    {
        // setup env variables
        this.clientID = process.env.REACT_APP_CLIENTID;
        this.redirectURL = process.env.REACT_APP_REDIRECT_URL;
        this.scope = process.env.REACT_APP_SCOPE;

        this.duration = 'temporary';
        this.state = new Date().getUTCMilliseconds();
        this.code = '';
        this.accessToken = '';
        this.saves = [];
        this.fetching = true;
        this.subs = [];

        if (process.env.NODE_ENV === 'production') {
               this.redirectURL = process.env.REACT_APP_PROD_REDIRECT_URL;
               this.clientID = process.env.REACT_APP_CLIENTID_PROD;
         }

    }

    getAuthURL() {

        let url = `https://www.reddit.com/api/v1/authorize?client_id=${this.clientID}&response_type=code&state=${this.state}&redirect_uri=${this.redirectURL}&duration=${this.duration}&scope=${this.scope}`;

        return encodeURI(url);
    }

    getAccessToken(cb) {
        // get the url parameters
        this.code = this.getUrlParameter('code');

        if (this.code) {

            // make a request to the node server!
            let request = new Request('/server/?code=' + this.code, {
                headers: {
                     accept: 'application/json',
                }
            });

            // make the call....

            fetch(request).then(response => response.json()).then(cb).catch(error => {
                console.log('request failed', error);
            });

        }

    }

    getSaves(cb) {
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

    setAccesToken(token) {
        this.accessToken = token;
    }

    normalize(item) {

      const fs = {};

      // set the id
      fs.id = item.data.id;

      // thumbnail
      if(item.data.thumbnail === 'default' || item.data.thumbnail === 'self' || item.data.thumbnail === '') {
        fs.thumbnail = false;
      } else {
        fs.thumbnail = item.data.thumbnail;
      }

      // title
      if (item.data.title) {
        fs.title = item.data.title;

      } else {
        fs.title = item.data.link_title;
      }

      //url
      if (item.data.url) {
        fs.url = item.data.url;
      } else {
        fs.url = item.data.link_url;
      }

      // subreddit
      fs.subreddit = item.data.subreddit;

      // domain
      if (item.data.domain) {
        fs.domain = item.data.domain;

      } else {
        fs.doamin = 'redit.com';
      }

      // author
      if (item.data.author) {
        fs.author = item.data.author;
      } else {
        fs.author = item.data.link_author;
      }

      // body html
      if (item.data.body_html) {
        fs.body_html = item.data.body_html;
      } else if (item.data.selftext_html){
        fs.body_html = item.data.selftext_html;
      } else {
        fs.body_html = false;
      }

      //permalink
      fs.permalink = item.data.permalink ? 'http://www.reddit.com'+item.data.permalink : item.data.link_url;

      // timestamp
      fs.time = this.timeSince(item.data.created);

      return fs;


    }

   timeSince(t) {
     var timeStamp = new Date(t*1000);
    var now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime() ) / 1000;
    if(secondsPast < 60){
        return parseInt(secondsPast, 10) + ' seconds ago';
    }
    if(secondsPast < 3600){
        return parseInt(secondsPast/60, 10) + ' mins ago';
    }
    if(secondsPast <= 86400){
        return parseInt(secondsPast/3600, 10) + ' hours ago';
    }
    if(secondsPast <= 172800){
        return parseInt(secondsPast/86400, 10) + ' day ago';
    }
    if(secondsPast <= 432000){
        return parseInt(secondsPast/86400, 10) + ' days ago';
    }
    if(secondsPast > 86400){
          var day = timeStamp.getDate();
          var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
          var year = timeStamp.getFullYear() === now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
          return day + " " + month + year;
    }
  }

}

export default(new Reddit());
