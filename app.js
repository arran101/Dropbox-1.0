//to remember what everything is doing
//using the app.get('/') to send the browser the index.html to load
//when submitting a file, the app.post('data') is linked to the form action '/data', which then runs the writeFile function which writes the file into /uploads, then passes it to readFile function

//3rd party
const express = require("express");
const bodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");
const app = express();

//native
const fs = require("fs");
const path = require("path");

//set up application level middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());

//port
const port = 3000;

//set up object cache
let cache = {};

//set up directory variables
//path.sep == '/'
const uploadDirectory = __dirname + path.sep + "uploads";

//serves uploaded folders
app.use(express.static("uploads"));
app.use(express.static("assets"));

//write function
//i should keep it consistant between using path.sep and /, but i used / in this example so i remember that i can use both
//although depending on if it makes everything go fucky i may have to just change it back to path.sep
function writeFile(name, body) {
  return new Promise((resolve, reject) => {
    // console.log('wf running')
    fs.writeFile(uploadDirectory + path.sep + name, body, function (err) {
      if (err) {
        return reject(err);
      } else {
        resolve(name);
      }
    });
  }).then((data) => {
    return body;
  });
}

//read function
function readFile(name) {
  return new Promise((resolve, reject) => {
    // console.log('rf running')
    fs.readFile(uploadDirectory + path.sep + name, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

//get request for index
app.get("/", (req, res) => {
  // console.log('sending index')
  res.sendFile(__dirname + "/index.html");
});

//post request for file
app.post("/data", (req, res) => {
  console.log(req.files);
  console.log(req);
  if (req.files.file instanceof Array) {
    for (let i = 0; i < req.files.file.length; i++) {
      let name = req.files.file[i].name;
      let data = req.files.file[i].data;
      cache[name] = writeFile(name, data);
    }
    //an alternative way of doing the above for loop, shown by corbs. I rly need to learn .map better
    // req.files.file.map(value => {
    //   let name = value.name;
    //   let data = value.data;
    //   cache[name] = writeFile(name, data);
    // })
    res.send(req.files.file.map((value) => value.name));
  } else {
    let name = req.files.file.name;
    let data = req.files.file.data;

    cache[name] = writeFile(name, data);
    res.send(name);
  }
});

//get request for files
app.get("/uploads/:name", (req, res) => {
  name = req.params.name;
  console.log(name);

  if (cache[name] == null) {
    console.log("file is not in cache");
    cache[name] = readFile(name);
  }
  cache[name]
    .then((body) => {
      console.log(body);
      res.send(body);
    })
    .catch((error) => res.status(500).send(error.message));
});

//this is to get the file names, so i can make an onload get function to add to the list on my html
app.get("/names", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log(files);
      res.send(files);
    }
  });
});

//listening to port 8080 for incoming requests
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
