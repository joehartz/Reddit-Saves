'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');

var Api = function () {
  function Api() {
    _classCallCheck(this, Api);

    this.appSecret = process.env.REACT_APP_APPSECRET;
    this.clientID = process.env.REACT_APP_CLIENTID;
    this.code = '';
    this.redirectURL = process.env.REACT_APP_REDIRECTURL;
    this.authURL = 'https://oauth.reddit.com/';
    this.username = '';

    this.res = '';

    // after authenticaiton codes
    this.accessToken = '';
    this.refreshToken = '';
  }

  _createClass(Api, [{
    key: 'getAccessCode',
    value: function getAccessCode() {
      var _this = this;

      // make the request for the auth code....
      var auth = new Buffer(this.clientID + ':' + this.appSecret).toString('base64');
      var options = {
        form: {
          grant_type: 'authorization_code',
          code: this.code,
          redirect_uri: this.redirectURL
        },
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded'

        }
      };

      // send the request
      request.post('https://www.reddit.com/api/v1/access_token', options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var body = JSON.parse(body);

          // set the resonse and acces tokens to use again
          _this.accessToken = body.access_token;
          _this.refreshToken = body.refresh_token;

          console.log('Access Token: ' + _this.accessToken);

          _this.makeApiRequest('api/v1/me', 'get');
        } else {
          console.log('COULD NOT GET AN ACCESS TOKEN FORM REDDIT!');
          return false;
        }
      });
    }
  }, {
    key: 'makeApiRequest',
    value: function makeApiRequest(endpoint) {
      var _this2 = this;

      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';

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

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // set the username
          _this2.username = body.name;
          _this2.res.status(200).json({ username: _this2.username, access_code: _this2.accessToken });
          return true;
        }
      });

      // make the request
      //request(options, (error, response, body) => {
      //  console.log(body);
      //});

    }
  }, {
    key: 'setCode',
    value: function setCode() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      this.code = code;
    }
  }, {
    key: 'setResonse',
    value: function setResonse(res) {
      this.res = res;
    }
  }]);

  return Api;
}();

exports.default = Api;