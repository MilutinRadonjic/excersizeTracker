// APP REQUIREMENTS
var mongoose = require('./config/mongo.js');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

var userModel = require('./models/users.js')
var excersizeModel = require('./models/userExercizes.js');
var app = module.exports = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({ optionSuccessStatus: 200 }));



// ADD NEW USER ------------------------------------------------------------------------------------------------------------------
app.post('/api/exercise/new-user/', (req, res) => {
  const username = req.body.username;
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
app.get('/api/exercise/users/', (req, res, next) => {

  userModel.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  })
});
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ENTER EXCERSIZE ==============================================================================================
app.post('/api/exercise/add', (req, res, next) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = req.body.duration;
  const time = req.body.date;

  if (username === undefined || description === undefined || duration === undefined) {
    res.send('this is not valid information. Are you exercizing at all??');
  } else if (username === '' || description === '' || duration === '') {
    res.send('please, insert required fields, you lazy bag');
  } else if (isNaN(duration)) {
    res.send('duration must be a number, fatty');
  } else {
    userModel.findOne({ username }, (err, data) => {
      if (err) {
        res.send('Error finding user in database');
      } else if (!data) {
        res.send('There is no such user in database');
      } else {
        userId = data.id
      }
    });
  }
  const newExercize = new excersizeModel({ userId, description, duration, time });
  newExercize.save((err, data) => {
    if (err) throw err;
    res.json(data)
  });
});
// =================================================================================================================

// ======================================GET LOG OF ALL EXERCIZES USER HAS =======================================================================================================
app.get('/api/exercise/:log', (req, res) => {
  const username = req.query.username;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let userId;
  const query = {};

  if (username === undefined) {
    res.send('Fill all data.');
  } else if (username === '') {
    res.send('Who is user');
  } else if (from !== undefined && isNaN(Date.parse(from)) === true) {
    res.send(username + ' didnt exercize at that time');
  } else if (to !== undefined && isNaN(Date.parse(to)) === true) {
    res.send('unusual date');
  } else {
    // Find userId for username\
    userModel.findOne({ username }, (err, user) => {
      if (err) {
        res.send('Could\'t find user, some kind of error');
      } else if (!user) {
        res.send('Username not found');
      } else {
        userId = user.id;
        query.userId = userId;

        if (from !== undefined) {
          from = new Date(from);
          query.date = { $gte: from };
        }

        if (to !== undefined) {
          to = new Date(to);
          to.setDate(to.getDate() + 1); // Add 1 day to include date
          query.date = { $lt: to };
        }

        if (limit !== undefined) {
          limit = Number(limit);
        }

        excersizeModel.find(query).select('userId description date duration ').limit(limit).exec((errExercise, exercises) => {
          if (err) {
            res.send('Error while searching for exercises, try again');
          } else if (!user) {
            res.send('Exercises not found');
          } else {
            res.json(exercises);
          }
        });
      }
    });
  }

});
// ===================================================================================================================================================================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Open localhost://3000 or localhost://' + process.env.PORT);
});