// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const { date } = req.params;

  const formatDate = (type, timestamp) => {
    const parsedDate = new Date(timestamp);
    if (isNaN(parsedDate.getTime())) {
      return { error: "Invalid Date" };
    }
    const utcToUnix = parsedDate.getTime();
    const unixToUtc = parsedDate.toUTCString();
    switch (type) {
      case "unix":
        return utcToUnix;
      case "utc":
        return unixToUtc;
    }
  }

  if (date) {
    let timestamp;
    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const isTimestamp = /^\d+$/.test(date);

    if (isDateFormat) {
      timestamp = new Date(date).getTime();
    } else if (isTimestamp) {
      timestamp = parseInt(date);
    } else {
      timestamp = new Date(date).getTime();
    }

    if (isNaN(timestamp)) {
      res.json({ error: "Invalid Date" });
    } else {
      res.json({
        unix: formatDate('unix', timestamp),
        utc: formatDate('utc', timestamp)
      });
    }
  } else {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    res.json({
      unix: currentTimestamp,
      utc: currentDate.toUTCString()
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
