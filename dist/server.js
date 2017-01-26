'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//require('dotenv').config({path: 'client/'});
require('dotenv').config();

// Setup the app...
var app = new _express2.default();
var api = new _api2.default();

app.set('port', process.env.PORT || 3001);

console.log('ENV: ', process.env.NODE_ENV);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(_express2.default.static('../client/build'));
}

app.get('/server', function (req, res) {
  if (req.query.code) {
    // we have the code now we can try to auth
    //console.log('Code: '+req.query.code);
    api.setCode(req.query.code);
    api.setResonse(res);

    // get the access code
    api.getAccessCode();
  } else {
    res.status(500).json({ error: 'No Code. Can not auth' });
  }
});

app.listen(app.get('port'), function () {
  console.log('This app listening on port 3001!');
});