if (process.env.NODE_ENV !== 'prodution') {
  require('dotenv').config();
}

//Modules
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
//Schemas
const User = require('./models/user-model');


//API

const forecast = require('./utils/forecast-server');
const geocode = require('./utils/geocode-server');

const dbConnection = `mongodb+srv://Obbern98:${process.env.BD_PASS}@cluster0-waynd.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// function to get each user
async function getUsers() {
  const users = await User.find({});
  return users
}

async function emailTemplate(path) {
  const template = new Promise((resolve, reject) => {
    return fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  return await template
}

let template = './email.html';


// NODEMAILER stuff

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { // email and password from sender email and password
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_USER,
  },
});




// function to send email
async function sendEmail(user) {
  const { email, username, city } = user;

  geocode(city, (err, { latitude, longtitude, location = city }) => {
    if (err) {
      return res.send(err);
    } else {
      forecast(latitude, longtitude, (err, forecastData) => {
        if (err) {
          return res.send('Error', error)
        } else {
          return transporter.sendMail({
            from: `"Weather notification 🌞" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Weather forecast!',
            text: 'Weather forecast!', // plain text body
            html: `<b>Today's forecast</b>
                                <p>The temperature in ${city} is ${forecastData.temperature}, <br>
                                   and the summary is ${forecastData.summary}</p>`
          });
        }
      })
    }
  })

  // const mail = await 
}



let jobSendEmail = new CronJob('* * * * * *', async () => {
  getUsers()
    .then((users) => {
      users.forEach(user => {
        sendEmail(user)
          .then(() => console.log('Email is send!'))
          .catch(console.error)

      })
    })
});
jobSendEmail.start();



