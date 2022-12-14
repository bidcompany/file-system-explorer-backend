const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const saml = require('passport-saml');
const fs = require('fs');



const fileRouter = require('./routes/fileRoutes');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret: 'secret', resave: false, saveUninitialized: true,}));

passport.serializeUser(function(user, done) {
    console.log('-----------------------------');
    console.log('serialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('-----------------------------');
    console.log('deserialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});

// 0.SSO
var samlStrategy = new saml.Strategy(
	{
		callbackUrl: 'http://localhost/login/callback',
		entryPoint: 'https://fiam0fed.intesasanpaolo.com/auth/fed/initFed.html',
		issuer: 'https://www.cargeas/shibboleth',
		identifierFormat: null,
		cert: fs.readFileSync(__dirname + '/certs/idp_key.pem', 'utf8'),
		decryptionPvk: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
		privateCert: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
		validateInResponseTo: false,
		disableRequestedAuthnContext: true
	}, 
	function(profile, done) {
    	return done(null, profile);
	}
)

passport.use('samlStrategy', samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({}));


app.get('/login',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login handler');
        next();
    },
    passport.authenticate('samlStrategy'),
);

app.post('/login/callback',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login callback ');
        next();
    },
    passport.authenticate('samlStrategy'),
    function (req, res) {
        console.log('-----------------------------');
        console.log('login call back dumps');
        console.log(req.user);
        console.log('-----------------------------');
        res.send('Log in Callback Success');
    }
);

app.get('/metadata',
    function(req, res) {
        res.type('application/xml'); 
        res.status(200).send(
          samlStrategy.generateServiceProviderMetadata(
             fs.readFileSync(__dirname + '/certs/cert.pem', 'utf8'), 
             fs.readFileSync(__dirname + '/certs/cert.pem', 'utf8')
          )
        );
    }
);



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