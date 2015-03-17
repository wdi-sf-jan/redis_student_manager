var express = require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
methodOverride = require('method-override'),
bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))


// REGULAR GET
app.get('/', function(req,res){
  // client.lrange("students",0, -1, function(err,students){
    res.render('index');
  // })
});

// AJAX GET
app.get('/students.json', function(req,res){
  client.lrange("students",0, -1, function(err,students){
    res.json(students);
  })
});

// REGULAR POST

// app.post('/add', function(req,res){
//   client.lpush("students",req.body.name)
//   res.redirect('/');
// });

// AJAX POST

app.post('/add.json', function(req,res){
  client.lpush("students",req.body.name)
  res.json("ADDED")
});

// REGULAR DELETE_ONE

// app.delete("/student/:name/", function(req,res){
//   client.lrange("students",0,-1,function(err,students){
//     students.forEach(function(student){
//       if (req.params.name === student){
//         client.lrem("students",1, student)
//         res.redirect('/');
//       }
//     })
//   });
// })

// AJAX UPDATE

app.put("/student/:name.json", function(req,res){
  client.lrange("students",0,-1,function(err,students){
    console.log("GOT HERE!!")
    students.forEach(function(student){
      if (req.params.name === student){
        console.log(req.params)
        console.log(req.body)
        client.lrem("students",1, student)
        client.lpush("students",req.body.newName)
        res.json('UPDATED');
      }
    })
  });
})

// AJAX DELETE_ONE

app.delete("/student/:name.json", function(req,res){
  client.lrange("students",0,-1,function(err,students){
    students.forEach(function(student){
      if (req.params.name === student){
        console.log("HIT!")
        client.lrem("students",1, student)
        res.json('DELETED');
      }
    })
  });
})

// AJAX DELETE ALL

app.delete('/students.json', function(req,res){
  client.del("students")
  res.json('ALL DELETED');
});


// REGULAR DELETE

// app.delete('/students', function(req,res){
//   client.del("students")
//   res.redirect('/');
// });

app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
