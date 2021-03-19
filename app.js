// dependencies - main
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path'); // builds path strings
const favicon = require('serve-favicon');
const morgan = require('morgan'); // logging

// dependencies - allow multiple view engines
const engines = require('consolidate');

// dependencies - production
const expressStatusMonitor = require('express-status-monitor');
const helmet = require('helmet'); // safer http headers
const compression = require('compression'); // smaller=faster

// dependencies - passport authentication
const flash = require('connect-flash'); // used with passport
const passport = require('passport');
const session = require('express-session');

// bring in logger
const LOG = require('./util/logger');
// configure app variables
const isProduction = process.env.NODE_ENV === 'production';
LOG.info('Environment isProduction = ', isProduction);

// create Express app
const app = express();
LOG.info('app created');

// app middleware - configure EJS (and other view engines as needed)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engines.ejs);

// app middleware - status monitoring; view at /status
app.use(expressStatusMonitor());

// app middleware - basic
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // bodyParser not needed
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(expressLayouts);
app.use(morgan('combined'));

// app middleware - production
// app.use(helmet()); // security, http headers
app.use(compression()); // compress all routes

// app middleware - expose passport req.user to views
app.use((req, res, next) => {
  res.locals.location = req.location;
  next();
});

LOG.info('app middleware configured');

// app middleware - configure routing
const purl = process.env.BASE_URL || '/aboutrohith';
app.use(purl,require('./routes/index'));
const baseUrl = process.env.BASE_URL || '/';
app.use(baseUrl, require('./routes/index'));

// error handler from
// https://github.com/mdn/express-locallibrary-tutorial/blob/master/app.js
app.use((req, res, err) => {
  // set locals, only providing errors in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error.ejs', { title: 'Error', res });
});

// export the express app (helpful for testing)
// see bin/www.js for environment-specific startup
module.exports = app;

app.get('/aboutp', (req, res) => {ss
  res.send(' Hello! This is rohith ')
})