var createError = require('http-errors');
const port = 3000
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')
var mongooseConnection = require('./config/mongoose')
require('dotenv').config()

var app = express();

//setting up socket.io
const socketio = require('socket.io')
const http = require('http');
// const { connection } = require('mongoose');
const server = http.createServer(app)
const io = socketio(server)

io.on("connection",function(socket){

  socket.on('send-location', (data) => {
    console.log(data)
    io.emit('receive-location', { id: socket.id, ...data });
    }) 
    console.log(" socket io connected")


    socket.on('disconnect',(data)=>{
      io.emit('user-disconnected', socket.id)
    })
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware

app.use(session({
  secret: process.env.JWT_SSH, // change this to a random string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // if using https, set to true
}));

// ---------end of session-----------------------


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

//test routes

app.get('/test',(req,res)=>{
  res.render('testmap')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

server.listen(port,()=>{
  console.log(`server isrunning on port ${port}`)
})

