const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path")
var xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
require("dotenv").config({ path: "./config.env" });

// @ts-ignore
global.__basedir = __dirname;
app.use(express.urlencoded({ extended: true }));


// Configuring the database
const dbConfig = require('./app/configs/database.config.js');
const mongoose = require('mongoose');



const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())



app.use("/", express.static(path.join(__dirname, "/app/upload")));



// to prevent ddos attack 
const limit = rateLimit({
  max: 100,// max requests
  windowMs: 60 * 60 * 1000, // 1 Hour of ban each ip depass 100 request  
  message: 'Too many requests !' // message to send
});

global.ddos = limit;
global.__basedir = __dirname;


// XSS attacks
app.use(xss());


//helmet
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url,  {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});


// NoSQL Injection Attacks
app.use(mongoSanitize({
  replaceWith: 'get_some_help'
}));


require(__basedir + "/app/routes/route.admin")(app)
require(__basedir + "/app/routes/route.user")(app)
require(__basedir + "/app/routes/route.category")(app)
require(__basedir + "/app/routes/route.post")(app)
require(__basedir + "/app/routes/route.event")(app)





var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
