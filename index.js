//jshint esversion:6
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const result = dotenv.config();
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/d35f3dd601",
    method: 'post',
    headers: {
      "Authorization": "tintin_das " + process.env.mailchimpapi
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    console.log(response.statusCode);
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else if(response.statusCode === 200){

      res.sendFile(__dirname + "/success.html");
    } else{
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});
