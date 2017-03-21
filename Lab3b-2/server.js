var express 		 = require('express');
var app          	 = express();
var bodyParser  	 = require('body-parser');
var morgan     		 = require('morgan');
var Sequelize   	 = require('sequelize');
var _                = require('lodash');
var bcrypt 			 = require('bcrypt');
var crypto			 = require('crypto');


var jwt    = require('jsonwebtoken');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var port = process.env.PORT || 8080;
app.set('superSecret', config.secret); // secret variable
var sequelize = new Sequelize('lab3', 'kennanseno', '', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

app.listen(port, function() {
	console.log('Connect at http://localhost:' + port);
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// =================================================================
// Model ===========================================================
// =================================================================
var User = sequelize.define('User', {
	username: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	},
	publicKey: {
		type: Sequelize.STRING,
		field: 'public_key'
	},
	privateKey: {
		type: Sequelize.STRING,
		field: 'private_key'
	}
}, {
	tableName: 'users'
});


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(function(user) {
		if (!user) {
			return res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if(err) {
					return res.status(401).send('Error while authenticating login information!');
				}

				if(result) {
					// if user is found and password is right
					// create a token
					var token = jwt.sign({username: user.username}, app.get('superSecret'), {
						expiresIn: 86400 // expires in 24 hours
					});

					return res.send({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				} else {
					res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
				}
			});
		}
	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {
	console.log('big boi:',req);

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	var data = !_.isEmpty(req.body) ? req.body : req.query;
	var signature = req.headers['x-signature'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				var requestSignature = req.headers["x-signature"];
				var computedSignature = crypto.createHmac("sha256", app.get('superSecret')).update(JSON.stringify(data)).digest("hex");

				//check if signature is different
				// console.log('data:', data);
				// console.log('signatures:', requestSignature, computedSignature);
				if(requestSignature == computedSignature) {
					req.decoded = decoded;	
					next();
				} else {
					return res.status(403).send({ 
						success: false, 
						message: 'Unauthorized access!'
					});
				}
			}
		});

	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided!'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

apiRoutes.post('/users', function(req, res) {
	User.findAll({}).then(function(result) {
		res.status(200).send(result);
	});
});

app.use('/api', apiRoutes);
