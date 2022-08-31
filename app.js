const express = require('express');
const morgan = require('morgan');



const fileRouter = require('./routes/fileRoutes');

const app = express();

// 1. MIDDLEWARE 
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));    
}

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('access-Control-Allow-Origin', '*');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.requestTime);
    next();
})


// 3. ROUTES
app.use('/api/v1/hist', fileRouter);
// route undefined
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
});

module.exports = app ;