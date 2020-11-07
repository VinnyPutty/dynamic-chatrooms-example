// import * as moment from "moment";

const moment = require('moment');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const {MessageBuilder, Message} = require('./models/message');
const io = require('socket.io')(http);
// const mongoose = require('mongoose');
// import { MessageBuilder, Message } from 'models/message';
require('./connection');

const PORT = process.env.PORT || 8000;
const saveMessages = {welcome: false, join: false, leave: false, user: true, currentUsers: false};


app.use(express.static(__dirname + '/public'));

const clientInfo = {};

// Sends current users to provided socket
const sendCurrentUsers = socket => {
    const info = clientInfo[socket.id];
    const users = [];

    if (typeof info === 'undefined') {
        return;
    }

    Object.keys(clientInfo).forEach(function (socketId) {
        const userInfo = clientInfo[socketId];

        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    const name = 'System', text = 'Current users: ' + users.join(', '), timestamp = moment().valueOf();
    if (saveMessages.welcome) saveMessage(name, text, timestamp, clientInfo[socket.id].room);
    socket.emit('message', { name, text, timestamp });
}

const saveMessage = (name, text, timestamp, collection = undefined) => {
    const dbMessage = collection ? new (MessageBuilder(collection))({name, text, timestamp}) : new Message({
        name,
        text,
        timestamp
    });
    dbMessage.save();
};

const getMessages = (room) => {
    return MessageBuilder(room).find({
        $query: {},
        $orderby: { timestamp: 1 }
    });
};

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');

    socket.on('disconnect', function () {
        const userData = clientInfo[socket.id];

        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            const name = 'System', text = userData.name + ' has left!', timestamp = moment().valueOf();
            if (saveMessages.leave) saveMessage(name, text, timestamp, clientInfo[socket.id].room);
            io.to(userData.room).emit('message', {name, text, timestamp});
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        getMessages(req.room).then(messages => messages.forEach(({ name, text, timestamp }) => socket.emit('message', { name, text, timestamp })));
        socket.join(req.room);
        const name = 'System', text = req.name + ' has joined!', timestamp = moment().valueOf();
        if (saveMessages.join) saveMessage(name, text, timestamp, req.room);
        socket.broadcast.to(req.room).emit('message', {name, text, timestamp});
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            const name = message.name, text = message.text, timestamp = moment().valueOf();
            if (saveMessages.user) saveMessage(name, text, timestamp, clientInfo[socket.id].room);
            message.timestamp = timestamp;
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
    });

    // timestamp property - JavaScript timestamp (milliseconds)

    const name = 'System', text = 'Welcome to the chat application!', timestamp = moment().valueOf();
    if (saveMessages.welcome) saveMessage(name, text, timestamp, clientInfo[socket.id].room);
    socket.emit('message', {name, text, timestamp});
});


http.listen(PORT, function () {
    console.log('Server started!');
});
