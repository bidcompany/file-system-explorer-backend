const express = require('express');
const morgan = require('morgan');

const fileRouter = require('./routes/fileRoutes');

const app = express();

// 1. MIDDLEWARE 
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));    
}

app.use(express.json());
// app.use(express.static(`${__dirname}`))


app.use((req, res, next) => {
    console.log('Hello form the middleware!! ');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


// 3. ROUTES
app.use('/api/v1/files', fileRouter);

module.exports = app ;