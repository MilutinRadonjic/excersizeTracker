// APP REQUIREMENTS
var mongoose = require('./config/mongo.js');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

var userModel = require('./models/users.js')

var app = module.exports = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({ optionSuccessStatus: 200 }));



// ADD NEW USER ------------------------------------------------------------------------------------------------------------------
app.post('/api/exercise/new-user/', (req, res) => {
    const username = req.body.username;
    console.log(typeof(username));
  
    if (username === '') {
      res.send('Username cannot be blank');
    } else if (username.length > 10) {
      res.send('Username cannot be greater than 10 characters');
    } else {
      const newUser = new userModel({
        username,
      });
  
      newUser.save((err, data) => {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) { // Duplicate key error
            res.send('Duplicate username, try a different username');
          } else {
            res.send('Error occurred while saving user');
          }
        } else {
          res.json(data);
        }
      });
    }
  });
//   ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// LIST ALL USERS --------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/exercise/users/', (req, res, next) =>{

userModel.find({}, (err, data) =>{
    if(err) throw err;
    res.json(data);
})
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
  });
app.listen( process.env.PORT || 3000, () => {
    console.log('Open localhost://3000 or localhost://' + process.env.PORT);
});