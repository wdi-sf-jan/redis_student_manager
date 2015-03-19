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
  client.lrange("students",0, -1, function(err,students){
    res.render('index', {students:students});
  });
});

app.get('/students/:name/edit', function(req,res){
  client.lrange("students",0, -1, function(err,students){
    // THIS IS WHY A LIST IS NOT THE BEST STRUCTURE!
    students.forEach(function(student){
      if(student === req.params.name){
        res.render('edit', {student:student});
      }
    });
  });
});

app.post('/create', function(req,res){
  client.lpush("students",req.body.name);
  res.redirect("/");
});

app.put("/students/:name/", function(req,res){
  // ADDITIONAL VALIDATION SHOULD GO HERE!
  client.lrem("students",1, req.params.name);
  client.lpush("students",req.body.newName);
  res.redirect('/');
});

app.delete("/students/:name/", function(req,res){
  client.lrem("students",1, req.params.name);
  res.redirect('/');
});

app.delete('/students', function(req,res){
  client.del("students");
  res.redirect('/');
});

app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
