const express = require('express');
const app = express();
const cors = require('cors');
const authenticate = require('./middlewares/verifyAuth');
const roles = require('./middlewares/verifyPermission');
const socketIo = require("socket.io");
const socketioJwt   = require('socketio-jwt');
const https = require("https");
const http = require("http");
const PORT = process.env.PORT || 8080;
const fs = require('fs');

var privateKey  = fs.readFileSync('/home/eternbo0/ssl/keys/ef826_ee615_0d4973fc86d7854ede1a814e891ce41b.key', 'utf8');
var certificate = fs.readFileSync('/home/eternbo0/ssl/certs/meeting_eternal_investment_com_ef826_ee615_1630371605_a32e86b3b91e757e1d73d09c6595869b.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());

// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static('public'));

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const protectedRoute = require('./routes/protected');
app.use('/api', protectedRoute);

// const server = http.createServer(app);
const server = https.createServer(credentials, app);
const io = socketIo(server); 

io.set('authorization', socketioJwt.authorize({
    secret: process.env.TOKEN_SECRET,
    handshake: true
}));

  
io.on("connection", (socket) => {
    console.log("New client connected: ");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.set('socketio', io);


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

