const express=require('express')
const bodyParser=require('body-parser')
const exp = require('constants')
const mongoose=require('mongoose');

const app=express()
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
//const date=require(__dirname+"/date.js");


mongoose.connect('mongodb+srv://admin:Test123@cluster0.4dc9a.mongodb.net/todolistDB');

const itemsSchema ={
    name:String
};

const Item=mongoose.model("Item",itemsSchema)

//console.log(date())

//var day="";
//const items=[];

const item1=new Item({
    name:"Welcome to todolist"
})
const item2=new Item({
    name:"Hit this + button to add a new item."
})
const item3=new Item({
    name:"<-- Hit this to delete an item."
})

const defaultItems=[item1,item2,item3]


const listSchema={
    name :String,
    items:[itemsSchema]
}

const List=mongoose.model("List",listSchema);
// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("sucess saved defaults items saved");
//     }
// })

app.get('/',function(req,res){
    // const today =new Date();

    //const day=date.getDate();
    Item.find({},function(err,foundItems){

        if(foundItems.length===0)
        {
                
            Item.insertMany(defaultItems,function(err){
                if(err){
                     console.log(err);
             }else{
                console.log("sucess saved defaults items saved");
             }
             res.redirect('/');
        })
        }else{

        res.render("list",{kindOfDay:"Today",newListItems:foundItems});
        }
    })

   //res.render("list",{kindOfDay:"Today",newListItems:items});
})

app.get('/:customListName',function(req,res){
    const customListName=req.params.customListName;

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create new list

                const list =new List({
                    name:customListName,
                    items: defaultItems
                })
            
                list.save();
                res.redirect("/" +customListName);

            }else{
                //show existing list
                res.render("list",{kindOfDay:foundList.name , newListItems:foundList.items});

            }
        }
    })
    
})

app.post("/",(req,res)=>{
    const itemName=req.body.newItem;
    const listName=req.body.list;

    const item=new Item({
        name:itemName
    });

    if(listName==="Today"){
        item.save();
        res.redirect('/');
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }

    
})

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
                return err;
            }else{
                console.log("removed sucessfully");
                res.redirect('/');
            }
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id: checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+ listName);
            }
        })
    }
    
})

app.listen(5000,()=>{
    console.log('server listening at port 5000...')
})

