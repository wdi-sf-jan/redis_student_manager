var express = require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
methodOverride = require('method-override'),
bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


// REGULAR GET
app.get('/', function(req,res){
  res.render('index');
});

// AJAX GET
app.get('/students.json', function(req,res){
  client.smembers("students", function(err,students){
    res.json(students);
  });
});



// AJAX POST

app.post('/add.json', function(req,res){
  client.sismember("students", req.body.name, function(err,reply){
    console.log(reply);
    if(reply > 0){
      res.json("No duplicates please");
    }
    else {
      client.sadd("students",req.body.name);
      res.status(201).json("");
    }
  });
});

// AJAX UPDATE

// check if new name is part of the set, if it is do nothing....
// 1 = part of the set
// 2 = not part

app.put("/student/:name.json", function(req,res){
  if(req.body.newName.length < 1){
    res.status(406).json("The student must have a name");
  }
  else{
      client.sismember("students", req.body.newName, function (err,reply){
      if(reply === 1){
        res.json("That name already exists");
      }
      else {
        client.srem("students", req.params.name);
        client.sadd("students",req.body.newName);
        res.status(204).json("");
      }
    });
  }
});

// AJAX DELETE_ONE

app.delete("/student/:name.json", function(req,res){
  client.sismember("students", req.params.name, function(err,reply){
    client.srem("students", req.params.name);
    res.json("");
  });
});

// AJAX DELETE ALL

app.delete('/students.json', function(req,res){
  client.del("students");
  res.status(204).json();
});

app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
