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
    POLLING_INTERVAL  = 1000,
    pollingTimer;

const db          = require('./config/connection'),
      sequelize   = require('sequelize');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'maulana.robert.mr@gmail.com',
        pass: 'pgg773sG56'
    }
});

let config = {
  apiKey           : "AIzaSyAwJipkhOuKpMeDLYNZlGEsxtCbnxImDS0",
  authDomain       : "pasarpolis-api-monitoring.firebaseapp.com",
  databaseURL      : "https://pasarpolis-api-monitoring.firebaseio.com",
  projectId        : "pasarpolis-api-monitoring",
  storageBucket    : "pasarpolis-api-monitoring.appspot.com",
  messagingSenderId: "987718083796"
};
let auth = firebase.initializeApp(config);
let query = firebase.database(auth).ref();

app.use(cors())

// If there is an error connecting to the database
db.authenticate().then(function(errors) { console.log(errors) });

// creating the server ( localhost:8000 )
const conn = app.listen(3000);
const io = socket(conn);

// on server started we can load our client.html page
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

/*
* HERE IT IS THE COOL PART
* This function loops on itself since there are sockets connected
* to the page. Upon Update it only emits the notification if
* the value has changed.
* Polling the database after a constant interval
*/
let pollingLoop = function() {

  let onlineReg   = [];
  let sqlOnline   = "SELECT count(id) as countRegOnline FROM goproteksi WHERE origin = 'app'";

  db.query(sqlOnline,{ bind: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(projects => {

      onlineReg.push(projects[0].countRegOnline);

    if (connectionsArray.length) {

      pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);

      updateOnlineRegistration({
        count: projects[0].countRegOnline
      });

    }
  }).catch(err => {

    console.log(err);
    updateOnlineRegistration(err);

  })

  requestAPI()

};

let pollingLoopOffline = function() {
  
    let offlineReg   = [];
    let sqlOffline  = "SELECT count(id) as countRegOffline FROM goproteksi WHERE origin = 'offline'";
  
    db.query(sqlOffline,{ bind: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(projects => {
  
      offlineReg.push(projects[0].countRegOffline);
  
    if (connectionsArray.length) {
  
      pollingTimer = setTimeout(pollingLoopOffline, POLLING_INTERVAL);
  
      updateOfflineRegistration({
        count: projects[0].countRegOffline
      });
  
    }
    }).catch(err => {
  
      console.log(err);
      updateOfflineRegistration(err);
  
    })
  
  };

function requestAPI() {
  request("http://121.52.49.174:9119", function(error, response, body) {
    updateStatusMega({
      statusCode: response.statusCode
    });
  });

  request("https://services.pasarpolis.com", function(error, response, body) {
    updateStatusServices({
      statusCode: response.statusCode
    });
  });

  request("https://lab.pasarpolis.com", function(error, response, body) {
    updateStatusLab({
      statusCode: response.statusCode
    });
  });

  request("https://gp.pasarpolis.com", function(error, response, body) {
    updateStatusGp({
      statusCode: response.statusCode
    });
  });

  request("https://api.pasarpolis.com", function(error, response, body) {
    updateStatusApi({
      statusCode: response.statusCode
    });
  });
}

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

  //This letiable is passed via the client at the time of socket //connection, see "io.connect(..." line in client.html
  profile_id = socket.handshake.query.profile_id;

  console.log('Number of connections:' + connectionsArray.length);

  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {

    pollingLoop();
    pollingLoopOffline();

  }

  socket.on('disconnect', function() {

    let socketIndex = connectionsArray.indexOf(socket);

    console.log('socket = ' + socketIndex + ' disconnected');

    if (socketIndex >= 0) {

      connectionsArray.splice(socketIndex, 1);

    }

  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);
});

let updateStatusMega = function(data) {
  // console.log(data.statusCode);
  let query = firebase.database(auth).ref('API');
  let mega = query.child('Mega');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "statusCode": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {
      const mailOptions = {
        from    : 'maulana.robert.mr@gmail.com',
        to      : 'maulana.robert.mr@gmail.com',
        subject : 'Server down',
        html    : '<p>Sepertinya server mega down</p>'
      };

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

let updateStatusServices = function(data) {
  // console.log(data.statusCode);
  let query = firebase.database(auth).ref('API');
  let mega = query.child('Goproteksi');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "services": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {
      const mailOptions = {
        from    : 'maulana.robert.mr@gmail.com',
        to      : 'maulana.robert.mr@gmail.com',
        subject : 'Server https://services.pasarpolis.com down',
        html    : '<p>Sepertinya server https://services.pasarpolis.com down</p>'
      };

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
      snap.ref.update({ "services": data.statusCode })
    })
  }

}

let updateStatusLab = function(data) {
  // console.log(data.statusCode);
  let query = firebase.database(auth).ref('API');
  let mega = query.child('Goproteksi');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "lab": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {

      const mailOptions = {
        from    : 'maulana.robert.mr@gmail.com',
        to      : 'maulana.robert.mr@gmail.com',
        subject : 'Server https://lab.pasarpolis.com down',
        html    : '<p>Sepertinya server https://lab.pasarpolis.com down</p>'
      };

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
      snap.ref.update({ "lab": data.statusCode })
    })
  }

}

let updateStatusGp = function(data) {
  // console.log(data.statusCode);
  let query = firebase.database(auth).ref('API');
  let mega = query.child('Goproteksi');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "gp": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {

      const mailOptions = {
        from    : 'maulana.robert.mr@gmail.com',
        to      : 'maulana.robert.mr@gmail.com',
        subject : 'Server https://gp.pasarpolis.com down',
        html    : '<p>Sepertinya server https://gp.pasarpolis.com down</p>'
      };

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
      snap.ref.update({ "gp": data.statusCode })
    })
  }

}

let updateStatusApi = function(data) {
  // console.log(data.statusCode);
  let query = firebase.database(auth).ref('API');
  let mega = query.child('Goproteksi');

  if (data.statusCode !== 200) {
    mega.once('value', function(snap) {
      snap.ref.update({ "api": data.statusCode })
    })

    sendMail++;

    if (sendMail > 1) {
      return
    }else {

      const mailOptions = {
        from    : 'maulana.robert.mr@gmail.com',
        to      : 'maulana.robert.mr@gmail.com',
        subject : 'Server https://api.pasarpolis.com down',
        html    : '<p>Sepertinya server https://api.pasarpolis.com down</p>'
      };

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
      snap.ref.update({ "api": data.statusCode })
    })
  }

}

let updateOnlineRegistration = function(data) {
  if (last_count != data.count) {
    let query = firebase.database(auth).ref("Data-Registration");
    query.once('value', function(snap) {
      snap.ref.update({ "online-registration-today": data.count })
    })
  }
  last_count = data.count;
};

let updateOfflineRegistration = function(data) {
  if (last_count != data.count) {
    let query = firebase.database(auth).ref("Data-Registration");
    query.once('value', function(snap) {
      snap.ref.update({ "offline-registration-today": data.count })
    })
  }
  last_count = data.count;
};

module.exports = app;
