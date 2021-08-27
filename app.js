const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const multer = require('multer');
const upload = multer();
app.use(upload.array())

mongoose.connect('mongodb+srv://admin:admin@data-test.r8otw.mongodb.net/data-test?retryWrites=true&w=majority',{useNewUrlParser: true})
    .then(()=>console.log('Connected'))
    .catch(err => console.log(err));

const schema = new mongoose.Schema({
    user: String,
    invited: String,
    score: Number
})

var users = mongoose.model('users', schema);


app.get('/',(req,res)=>{
    users.find((err,data)=>res.render('index.ejs',{data:data}));
});

app.post('/',(req,res)=>{
    create(req);
    processing(req.body.invited,res);
})


var create = (req)=>{
    users.create({
        user: req.body.user,
        invited: req.body.invited,
        score: 100,
    });
}

var processing = async (invited,res) =>{
    var user = await users.findOne({user:invited});
    var i=30;
    while (i>0 && user!=null){
        console.log(user.user + " " + Number(user.score + i));
        await users.updateOne({user:user.user},{score: user.score + i});
        user = await users.findOne({user:user.invited});
        i-=10;
    }
    users.find((err,data)=>res.json(data));

}
app.listen(port,()=>{
    console.log('listening on port ' + port);
})
