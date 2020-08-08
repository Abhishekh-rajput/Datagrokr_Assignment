const cors = require('cors');
const path = require('path');

// .env
const dotenv = require('dotenv');
dotenv.config();

// Express
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

// MongoDB Atlas
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/postcards", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('CONNECTED TO DB...'))
  .catch(err => console.log(`DB Error: ${err.message}`));

  mongoose.connection.on('connected', ()=>{
    console.log("MONGOOSE IS CONNECTED...");
  });

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// routes
app.get('/', (req, res) => res.json(require('./docs/api')));  // localhost:8080/
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

// error handling
app.use((err, req, res, next) => {    // see express-jwt docs
  if (err.name === 'UnauthorizedError') res.status(401).json({error: 'Unauthorized!'});
});

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log(`server started on  ${port}`);
})


