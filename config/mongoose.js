const mongoose = require('mongoose')
require('dotenv').config()

 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
 const db = mongoose.connection;

 db.on('error', (error) => console.error(error));

 db.once('open', () => console.log('Connected to MongoDB'));