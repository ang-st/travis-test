'use strict';

const util = require('util');
const EventEmitter = require('events');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var fs = require("fs");
var Notify = require('fs.notify');
var validUrl = require('valid-url');
var express = require('express');
var webapp = express();
var MetaInspector = require('node-metainspector');


var bodyParser = require('body-parser')
require('crash-reporter').start();


const refresh = new Refresh();

function Refresh() {
  EventEmitter.call(this);
}
util.inherits(Refresh, EventEmitter);

var default_url="file://" + process.cwd() + "/back.png"

var url_file = process.cwd() + "/url.txt"
var files = [ url_file ]

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var notifications = new Notify(files);

webapp.set('view engine', 'jade');
webapp.use(express.static('assets'));
webapp.use( bodyParser.json() );       // to support JSON-encoded bodies
webapp.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//webapp.use(express.json());       // to support JSON-encoded bodies
//webapp.use(express.urlencoded());

webapp.get('/', function (req, res) {
    res.render('index', {ressources:[]});
});
webapp.post('/set', function (req, res) {
    var candidate =  req.body.url 
    if( validUrl.isUri(candidate) )
      refresh.emit('event',candidate)
    res.send({ressources:[]});
});


webapp.post("/", function(req,res){
    
    console.log("/new")
    var resp = res
    var candidate = req.body.url
    console.log(candidate)
    if( validUrl.isUri(candidate) ){
      var client = new MetaInspector(candidate, { timeout: 5000 });
      client.on("fetch", function(){
        console.log("Description: " + client.description);
        //imainWindow.loadURL(candidate);
        refresh.emit('event',candidate)
        resp.send({title:client.title, url:candidate, description: client.description})    
      
      });

      client.on("error", function(err){
            resp.send("ERR");
            console.log(error);
      });

      client.fetch();

    }
    else {
      console.log("Invalid URL: " + candidate)
      resp.send("ERR");
    }
             
            
})



webapp.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(default_url);
  // Open the DevTools.
  mainWindow.maximize()
  //mainWindow.webContents.openDevTools();
  refresh.on('event', function(url) {
    console.log("got data", url)
    //console.log(mainWindow)
    const options = {}
    mainWindow.loadURL(url, options); 
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

app.on('uncaughtException', function (error) {
   console.log(error) // Handle the error
})


app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  console.log(error, certificate) 
   event.preventDefault();
    callback(true);

})
