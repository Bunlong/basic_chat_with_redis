const express = require('express');
const debug = require('debug')('backend:server');
const logger = require('morgan');

const http = require("http");
const socketIo = require("socket.io");
var redis = require('redis');
const Moniker = require('moniker');

const index = require('./routes/index');

const app = express();
const port = normalizePort(process.env.PORT || '8000');

app.set('port', port);
app.use(logger('dev'));

app.use('/', index);

const server = http.createServer(app);

const io = socketIo(server);
var store = redis.createClient();
var pub = redis.createClient();
var sub = redis.createClient();

// ===================================

// connection event
sub.subscribe("chatting");
io.sockets.on('connection', function (client) {
  sub.on("message", function (channel, message) {
      console.log("message received on server from publish ");
      client.send(message);
  });
  client.on("message", function (msg) {
      console.log(msg);
      if (msg.type == "chat") {
        pub.publish("chatting", msg.message);
      }
      else if (msg.type == "setUsername") {
        pub.publish("chatting", "A new user in connected:" + msg.user);
        store.sadd("onlineUsers", msg.user);
      }
  });
  client.on('disconnect', function () {
    pub.publish("chatting","User is disconnected :" + client.id);
    sub.quit();
  });
});
// ===================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, () => console.log(`Listening on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

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
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
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
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var favicon = require('serve-favicon');
// var path = require('path');
/**
 * view engine setup
 */
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
/**
 * =================
 */
