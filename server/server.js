let express           = require('express'),
    app               = express(),
    socket            = require('socket.io'),
    cors              = require('cors'),
    fs                = require('fs'),
    firebase          = require('firebase'),
    mysql             = require('mysql'),
    nodemailer        = require('nodemailer'),
    connectionsArray  = [],
    request           = require("request"),
    profile_id,
    last_count        = 0, //this variable is to check previous count value
    sendMail          = 0,
    connection        = mysql.createConnection({
      host      : 'localhost',
      user      : 'root',
      password  : '', //put your own mysql pwd
      database  : 'pasarpolis', //put your database name
      port      : 3306
    }),
    POLLING_INTERVAL  = 1000,
    pollingTimer;

    var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: 'maulana.robert.mr@gmail.com',
            pass: 'pgg773sG56'
        }
    });
    const mailOptions = {
      from    : 'maulana.robert.mr@gmail.com', // sender address
      to      : 'maulana.robert.mr@gmail.com', // list of receivers
      subject : 'Server down', // Subject line
      html    : '<p>Sepertinya server mega down</p>'// plain text body
    };

    var config = {
    apiKey           : "AIzaSyAwJipkhOuKpMeDLYNZlGEsxtCbnxImDS0",
    authDomain       : "pasarpolis-api-monitoring.firebaseapp.com",
    databaseURL      : "https://pasarpolis-api-monitoring.firebaseio.com",
    projectId        : "pasarpolis-api-monitoring",
    storageBucket    : "pasarpolis-api-monitoring.appspot.com",
    messagingSenderId: "987718083796"
  };
  var auth = firebase.initializeApp(config);
  var query = firebase.database(auth).ref();

app.use(cors())

// If there is an error connecting to the database
connection.connect(function(err) {
  // connected! (unless `err` is set)
  console.log(err);
});

// creating the server ( localhost:8000 )
const conn = app.listen(3000);
const io = socket(conn);

// on server started we can load our client.html page
// function handler(req, res) {
  app.get('/', (req, res) => {
    fs.readFile(__dirname + '/client.html', function(err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
  })

// }

/*
* HERE IT IS THE COOL PART
* This function loops on itself since there are sockets connected
* to the page. Upon Update it only emits the notification if
* the value has changed.
* Polling the database after a constant interval
*/
var pollingLoop = function() {
  sql = "SELECT count(id) as c FROM goproteksi";
  // Doing the database query
  var query = connection.query(sql),
      users = []; // this array will contain the result of our db query
  // setting the query listeners
  query.on('error', function(err) {
    // Handle error, and 'end' event will be emitted after this as well
    console.log(err);
    updateSockets(err);
  }).on('result', function(count) {
    // it fills our array looping on each user row inside the db
    users.push(count);
    // loop on itself only if there are sockets still connected
    if (connectionsArray.length) {
      pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);

      updateSockets({
        count: count.c
      });
      request("http://121.52.49.174:9119", function(error, response, body) {
        updateStatusMega({
          statusCode: response.statusCode
        });
      });
    }
  })
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
  //This variable is passed via the client at the time of socket //connection, see "io.connect(..." line in client.html
  profile_id = socket.handshake.query.profile_id;
  console.log('Number of connections:' + connectionsArray.length);
  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {
    pollingLoop();
  }
  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socket = ' + socketIndex + ' disconnected');
    if (socketIndex >= 0) {
      connectionsArray.splice(socketIndex, 1);
    }
  });
  console.log('A new socket is connected!');
  connectionsArray.push(socket);
});

var updateStatusMega = function(data) {
  // console.log(data.statusCode);
  var query = firebase.database(auth).ref('API');
  var mega = query.child('Mega');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "statusCode": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {
      transporter.sendMail(mailOptions, function (err, info) {
         if(err) {
           console.log(err)
         }else {
           console.log(info);
         }
      });
    }
  }else {
    mega.once('value', function(snap) {
      snap.ref.update({ "statusCode": data.statusCode })
    })
  }

}

var updateSockets = function(data) {
  if (last_count != data.count) {
    query.once('value', function(snap) {
      snap.ref.update({ "online-registration-today": data.count })
    })
  }
  last_count = data.count;
};

module.exports = app;
