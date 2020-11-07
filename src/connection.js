const mongoose = require("mongoose");
// const uri = "mongodb+srv://admin:admin123@cluster0.guvch.mongodb.net/tcsdb?retryWrites=true&w=majority";
const password = 'pablo4', dbname = 'tcsdb';
const uri = `mongodb+srv://pablo:${password}@cluster0.2zxmb.mongodb.net/${dbname}?retryWrites=true&w=majority`;
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if (err) console.error('Mongoose connection error:', err)
    else console.log("connected to db");
})
