const express=require('express')
const fs=require('fs')
const bodyparse=require('body-parser');
const path=require('path')
const { response } = require('express');
const { json } = require('body-parser');
// const bodyParser = require('body-parser');
var app=express();
app.use(express.json());
app.use(bodyparse.urlencoded({extended:true}))
app.get('/',function(request,response){
response.sendFile(__dirname+'/form5.html')
})
app.post('/home',function(request,response){
    var id=request.body.idd;
    var fname=request.body.name;
    var add =request.body.address;
    var English=Number(request.body.emarks);
    var Hindi=Number(request.body.smarks);
    var Maths=Number(request.body.mmarks);
    var Physics=Number(request.body.pmarks);
    var Chemistry=Number(request.body.ssmarks);

    var total=Number(English+Hindi+Maths+Physics+Chemistry);
    var average=total/5;
    
    var grade = 'A';
    if(average>=90){
        grade='A';
    }else if(average>=80 && average<90){
        grade='B';
    }else if(average>=70 && average<80){
        grade='C';
    }else if(average>=55 && average<70){
        grade='D';
    }else if(average>=40 && average<55){
        grade='E';
    }else{
        grade='F';
    }

    

    let scoreCard = {
        'Student Id' : id,
        'Student Name' : fname,
        'Address':add,
        'English' : English,
        'Hindi' : Hindi,
        'Maths' : Maths,
        'Physics':Physics,
        'Chemistry':Chemistry,
        'Total Marks' : total,
        'Average Marks' : average,
        'Grade':grade
    }

    
    
    fs.appendFileSync("data.txt",JSON.stringify(scoreCard));
    const data = fs.readFileSync("data.txt","utf-8")
   
    console.log(data);
    response.send(data);
}).listen(3000);


