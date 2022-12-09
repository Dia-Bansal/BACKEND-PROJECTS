const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');
const { encode } = require('punycode');

let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "", // my password
    database: "names"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.post('/register', encodeUrl, (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var phonenumber=req.body.phonenumber;
    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or no
        con.query(`SELECT * FROM myform WHERE firstname = '${firstname}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(result.length > 0){
                res.sendFile(__dirname + '/failreg.html');
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.myform = {
                    firstname: firstname,
                    lastname: lastname,
                    password: password,
                    phonenumber:phonenumber
                };

                // res.send(`
                // <!DOCTYPE html>
                // <html lang="en">
                // <head>
                //     <title>Login and register form with Node.js, Express.js and MySQL</title>
                //     <meta charset="UTF-8">
                //     <meta name="viewport" content="width=device-width, initial-scale=1">
                //     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                // </head>
                // <body>
                //     <div class="container">
                //         <h3>Hi, ${req.session.myform.firstname} ${req.session.myform.lastname}</h3>
                //         <button type="submit" class="btn btn-light btn-block btn-lg gradient-custom-4 text-body"><a href="/">Log out</a></button>
                //     </div>
                // </body>
                // </html>
                // `);
                res.sendFile(__dirname+'/login.html');
            }
                // inserting new user data
                var sql = `INSERT INTO myform (firstname, lastname,  password,phonenumber) VALUES ('${firstname}', '${lastname}', '${password}', '${phonenumber}')`;
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }

        });
    });


});

app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/login.html");
});

app.post("/dashboard", encodeUrl, (req, res)=>{
    var firstname = req.body.firstname;
    var password = req.body.password;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
        con.query(`SELECT * FROM myform WHERE firstname = '${firstname}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };

          function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.myform = {
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                password: password ,
                // phonenumber:phonenumber
            };

            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Login and register form with Node.js, Express.js and MySQL</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${req.session.myform.firstname} ${req.session.myform.lastname}</h3>
                    <button type="submit" class="btn btn-light btn-block btn-lg gradient-custom-4 text-body"><a href="/">Log out</a></button>
                </div>
            </body>
            </html>
            `);
        }

        if(result.length > 0){
            userPage();
        }else{
            res.sendFile(__dirname + '/faillog.html');
        }

        });
    });
});

app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});