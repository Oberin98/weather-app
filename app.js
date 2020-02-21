if (process.env.NODE_ENV !== 'prodution') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override')

const forecastRouter = require('./routes/forecast');
const usersRouter = require('./routes/users');

const app = express();

const passportInitialize = require('./pasport-config');
passportInitialize(passport);

// DB connection
const dbConnection = `mongodb+srv://Obbern98:${process.env.BD_PASS}@cluster0-waynd.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'token',
  secret: process.env.SECRET_SESSION,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


//checking whether user is liged in to show other stuff
app.use((req, res, next) => {
  if (req.user) {
    app.locals.user = true
  } else {
    app.locals.user = false
  }
  next();
})

// useing overRide lib to use REST methods
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', forecastRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
