import Express from 'express';
import Api from './api';
//require('dotenv').config({path: 'client/'});
require('dotenv').config()

// Setup the app...
var app = new Express;
var api = new Api;

  console.log('ENV: ',process.env.NODE_ENV)

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}

app.get('/server',  (req, res) => {
  if(req.query.code)
  {
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

app.listen(3001, function () {
  console.log('This app listening on port 3001!')
})
