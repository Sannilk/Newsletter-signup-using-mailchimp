
const express = require("express");
const bodyParser = require("body-parser");
// The request module is used to make HTTP calls.
const request = require("request")
//The HTTPS module provides a way of making Node. js transfer data over HTTP TLS/SSL protocol, which is the secure HTTP protocol.
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
//to use internal files
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
    // console.log(req.body)
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.Email;

    //data to upload in mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME:lastname
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/34a331fbd3"

    const options = {
        method : "POST",
        auth : "sannil1:f2d0462006368a54dc381d1d042fd4c4-us9" //api key
    }
    
    const request = https.request(url,options,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end()

});

app.post("/failure",function(req,res){
    res.redirect("/")
}) 


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000")
})


//list id
//34a331fbd3

//api key
//f2d0462006368a54dc381d1d042fd4c4-us9