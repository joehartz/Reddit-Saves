import Express from 'express';
import Api from './server/api';
require('dotenv').config();

// Setup the app...
var app = new Express;
var api = new Api;


// Allow cross origin CORS, or we can use a proxy
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/',  (req, res) => {
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

app.listen(3004, function () {
  console.log('This app listening on port 3004!')
})
