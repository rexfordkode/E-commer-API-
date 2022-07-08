const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
require('dotenv').config({
    path: './config/.env'
});
//Mongo DB configuration
const connectDB = require('./config/db');
connectDB();

app.use(morgan('dev'));
app.use(cors());

//Router
app.use('/api/user', require('./routes/auth.route'));
app.use('/api/category', require('./routes/category.route'));
app.get('/', (req, res) => {
    res.send('test route => home page');
});

//Page Not Found
app.use((req, res) => {
    res.status(404).json({
        message: 'Page not found'
    });
})

//PORT LISTENER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}!`);
})

