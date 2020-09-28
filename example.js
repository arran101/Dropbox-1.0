//needs node modules

//3rd party
const app = require('express')();
const { rejects } = require('assert');
const bodyParser = require('body-parser');
const expressFileUpload = require('express-fileupload');

//native
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

//set up application level middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(expressFileUpload());

//set up object cache
let cache = {};

const directory = __dirname + path.sep + 'uploads'

function writeFile(name, body){
    return new Promise((resolve, reject) => {
fs.writeFile((directory + path.sep + name, data, err) => {
 if(err){
     reject(err)
 } else {
     resolve(name)
 }
})
}).then(readFile);
}

function readFile(fileName){
    return new Promise((resolve, reject) => {
        fs.writeFile((directory + path.sep + name, data, err) => {
         if(err){
            return reject(err)
     } else {
         console.log('successful read')
             resolve(name)
        }
    })
    })
}
//need to fix the {} n shit 

app.use('/', (req, res, next) => {
   console.log(req.url);
   console.log(req.method);
   next();
});


//route handler (technically)
app.get('/', (req, res) => {
    console.log('sending index')
    res.sendFile(__dirname + '/index.html')
});

app.post('/data', (req,res)=>{
    cache[req.params.name] = req.body.data;
    console.log(cache);
    res.send(cache);
})

//listening to port 8080 for incoming requests
app.listen(8080, ()=>{
    console.log('listening to port 8080')
})