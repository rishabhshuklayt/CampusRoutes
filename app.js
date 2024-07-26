var createError = require("http-errors");
const port = 3000;
var express = require("express");
var session = require("express-session");
const studentModel = require("./model/student");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var mongooseConnection = require("./config/mongoose");
var jwt = require('jsonwebtoken')
const isLoggedIn = require('./middleware/isLoggedIn'); // Add the middleware
require("dotenv").config();

var app = express();
app.use(cookieParser());

// Setting up socket.io
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

// Use the middleware to get the user data
io.use(async (socket, next) => {
    const token = socket.handshake.headers.cookie?.split('token=')[1];
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SSH);
        const student = await studentModel.findById(decoded._id);
        if (!student) {
            return next(new Error('Authentication error'));
        }
        socket.user = student;
        next();
    } catch (error) {
        console.error('Error during token verification:', error);
        return next(new Error('Authentication error'));
    }
});

io.on("connection", function (socket) {
    socket.on("send-location", async (data) => {
        try {
            const userData = socket.user;
            if (userData) {
                io.emit("receive-location", {
                    id: socket.id,
                    ...data,
                    user: {
                        name: `${userData.firstName} ${userData.lastName}`,
                        avatar: userData.avatar.toString('base64'),
                    }
                });
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    });

    console.log("Socket.io connected");

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Express session middleware
app.use(session({
    secret: process.env.JWT_SSH,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// Test routes
app.get("/test", (req, res) => {
    res.render("testmap");
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
