/**
 * Module dependencies.
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http'); // This module creates the 'raw' http server, to which we connect the express app, see below.

/** 
 * Our own module dependecies, like utilities, converters, language and so on
 */
// pick only the following ones, could be more available
const { normalizePort, onError, onListening, baseURL } = require('./serverUtilities.js');

/**
 * Pick out the static web content folder
 */
const publicDirectoryPath = path.join(__dirname, './public');
/**
 * Create the express web part and connect the modules that is will use
 * Express is a routing and middleware web framework that has minimal functionality of its own: 
 * An Express application is essentially a series of middleware function calls.
 */
const app = express(); // Creates an Express web application. The express() function is a top-level function exported by the express module.
app.use(logger('dev'));
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDirectoryPath));

/**
 * Middleware request handlers
 * They need to be in the correct order, ie the request is passed true them in the order they are defined.
 * So, first the ones we define, and last the error handlers
 */

// ===================================================
// HERE WE SHALL HAVE OUR HANDLERS, which we add 
// ===================================================
// Both the '/' and the '/home' routes will show the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, './index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, './index.html'));
});

app.get('/weather', (req, res) => {
    res.send(
        {
            forecast: 'It is snowing',
            location: 'Vaasa'
        }
    );
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, './login.html'));
});

app.post('/submit-form', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        // Get correct user from db and check pw
        if (username == 'novia' && password == '2023') {
            res.send('Correct User name and/or Password!');

        } else {
            res.send('Incorrect User name and/or Password!').end();
        }
    } else {
        res.send('Please enter User name and Password').end();

    }

});

// ===================================================
// Error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(res.sendFile(path.join(publicDirectoryPath, './404.html')));
});

// error handler for everything else
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    //
    // This will later change to render (when
    // we have a rendering engine.)
    //
    res.send('error');
});

// ===================================================


/**
 * Get port from environment and store in Express.
 * Set the DEBUG environment value so that the debug package shows the output
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // all object that we set on the express app is readable from the requests


/**
* Create HTTP server.
*/

const server = http.createServer(app); // Here the real server is created with the express app

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('error', onError); // connect the SERVER error handler not the request error handling! 
server.on('listening', onListening); // what to call when listening, ie server up and running

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});