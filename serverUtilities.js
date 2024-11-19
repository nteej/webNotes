//debug exposes a function; pass this function the name of your module, 
// and it will return a decorated version of console.error for you to pass debug statements to. 
const debug = require('debug')('webnotes:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event. IE THE SERVER has some problem, not routing error, that will be set in the app.js file.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const { port } = error; // Pick out port from error.
    //const port = error.port;//same as above

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 * This is what gets called when the server is up and listening to requests.
 */

function onListening(event) {
    const addr = this.address(); // This is a reference to the server object
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * 
 * Base URL build
 * * Pick out the static web content folder
 */
function baseURL() {

    const publicDirectoryPath = path.join(__dirname, './public');
    if (publicDirectoryPath) {
        return publicDirectoryPath;
    }
}
module.exports = { normalizePort, onError, onListening, baseURL };