const express=require('express')
const bodyParser=require('body-parser')
const exp = require('constants')

const app=express()
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
const date=require(__dirname+"/date.js");

//console.log(date())

var day="";
const items=[];



app.get('/',function(req,res){
    // const today =new Date();

    const day=date.getDate();

   res.render("list",{kindOfDay:day,newListItems:items});
})

app.post("/",(req,res)=>{
    const item= req.body.newItem;
    items.push(item);
    console.log(item)

    res.redirect("/");
})

app.listen(5000,()=>{
    console.log('server listening at port 5000...')
})

