const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
require('dotenv').config({
    path: './config'
});

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('test route => home page');
});


//Page Not Found
app.use((req, res) => {
    res.status(404).json({ message: 'Page not found'});
})
app.listen(5000, () => {
    console.log('listening on port 5000');
})