//3rd party
const express = require('express');
// const { rejects } = require('assert');
const bodyParser = require('body-parser');
const expressFileUpload = require('express-fileupload');
const app = express();

//native
const fs = require('fs');
// const { resolve } = require('path');
const path = require('path');
// const http = require('http');
// const { response } = require('express');

//set up application level middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(expressFileUpload());

//port 
const port = 3000;

//set up object cache
let cache = {};

//set up directory variables
//path.sep == '/'
const uploadDirectory = __dirname + path.sep + 'uploads'
// const publicDirectory = __dirname + path.sep + 'public'


//serves uploaded folders
app.use(express.static('uploads'));
app.use(express.static('public'))

//write function
//i should keep it consistant between using path.sep and /, but i used / in this example so i remember that i can use both
//although depending on if it makes everything go fucky i may have to just change it back to path.sep
// function writeFile(name,body){
//     return new Promise ((resolve, reject)=>{
//         // console.log('wf running')
//         fs.writeFile(uploadDirectory+ path.sep + name, body, function (err) {
//             if(err){
//               return  reject(err)
//             }else{
//                 resolve(name)
//             }
//         });
//     }).then(readFile);
// }

function writeFile(name, body) {
    return new Promise((resolve, reject) => {
      fs.writeFile(uploadDirectory + path.sep + name, body, (err) => {
        if (err) {
          return reject(err);
        } else {
          resolve(name);
        }
      });
    }).then(readFile);
  }

//read function
// function readFile(name){
//     return new Promise ((resolve, reject)=>{
//         // console.log('rf running')
//         fs.readFile((uploadDirectory + path.sep + name, (err, data)=>{
//             if(err){
//                return reject(err)
//             }else{
//                 resolve(data)
//             }
//         }))
//     })
// }

function readFile(name) {
    return new Promise((resolve, reject) => {
      fs.readFile(uploadDirectory + path.sep + name, (err, body) => {
        if (err) {
          return reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

//get request for index
app.get('/',(req,res)=>{
    console.log('sending index')
    res.sendFile(__dirname + '/index.html')
})

//post request for file
app.post('/data', (req,res)=>{
    console.log(req.files)
    if(req.files.upload instanceof Array){
    for(let i = 0; i < req.files.upload.length; i++){
        let name = req.files.upload[i].name;
        let data = req.files.upload[i].data;
        cache[name] = writeFile(name,data);
        console.log(cache)
        cache[name]
            .then(()=>
            res.end(
                'to download the file, go to url: localhost:3000/uploads/:file-name'
            ))
            .catch((error)=>{
                console.log(error);
                res.end(error);
            })
    }
} else {
    // console.log(req.files);

    let name = req.files.upload.name;
    let data = req.files.upload.data;

    
    cache[name] = writeFile(name,data);
    // res.send('to download the file, go to url: localhost:3000/uploads/:file-name'
    // )
    console.log(cache[name])
    cache[name].then((data)=>{
        console.log(data)
    res.send(
        'to download the file, go to url: localhost:3000/uploads/:file-name'
    )})
    .catch((e) => res.status(500).send(e.message));
}
});

//get request for files
app.get('/uploads/:name', (req, res)=>{
    name = req.params.name
    if(cache[name] == null){
        console.log('file is not in cache')
        cache[name] = readFile(name)
    } 
    // else{
    //     console.log('file is in cache')
    // }
    cache[name]
    .then((body)=>{
        res.send(body)
    })
    .catch((error)=>
        res.status(500).send(error.message)
    )
})

//listening to port 8080 for incoming requests
app.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})