require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const util = require("util");
const cors = require("cors");
const app = express();

app.use(cors());
const path = __dirname + "/build/";
app.use(express.static(path));
app.use(express.json());

// Setup MongoDB
const Bin = require("./models/bin");
const Request = require("./models/request");
const RawRequest = require("./models/rawRequest");

const url = process.env.MONGODB_URI;
mongoose.connect(url);

// Home page

app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.get('/view/:id', function (req,res) {
  res.sendFile(path + "index.html");
});

// View a bin's requests
app.get("/api/bins/:id/view", (req, res) => {
  Bin.findOne({ id: req.params.id }).populate("requests")
    .then(binRequests => {
      if (binRequests) {
        res.json(binRequests);
      } else {
        res.status(404).end();
      }
    });
});

// Create a new bin
app.post("/api/bins/new", (req, res) => {
  const newBinId = Math.round(Math.random() * 9999999999).toString();

  const newBin = new Bin({ id: newBinId });
  newBin.save().then(result => {
    console.log("Bin saved!");
    res.json(result);
  });
});

// Collect all requests
app.all("/api/bins/:id", (req, res) => {
  // console.log(req);
  const newRequestId = Math.round(Math.random() * 9999999999).toString();

  // Save raw request
  const rawRequestString = util.inspect(req);
  const newRawRequest = new RawRequest({
    id: Math.round(Math.random() * 9999999999).toString(),
    raw_request: rawRequestString,
    request_id: newRequestId,
  });

  newRawRequest.save().then(result => {
    console.log("Raw request saved!");
  })

  // Parsed request
  const newRequest = new Request({
    id: newRequestId,
    body: util.inspect(req.body),
    headers: req.headers,
    method: req.method,
    bin: req.params.id,
  });

  // Save request
  newRequest.save().then(result => {
    console.log("Request saved!");

    // Save request into bin
    Bin.findOne({ id: req.params.id }).then(bin => {
      bin.requests.push(result);
      bin.save()
    });
  });
});

const PORT = process.env.PORT || 80
app.listen(PORT);
console.log(`Server running on port ${PORT}`);