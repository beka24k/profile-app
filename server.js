const express=require('express');
const mongoose=require('mongoose');
const { name } = require("ejs");
const nodemailer =require('nodemailer');
const bcrypt = require("bcrypt");
const User = require('./modules/model');
const session=require('express-session')
const app=express();

app.use(express.urlencoded({extended: false}));

app.use(express.json());


app.post('/registration',(req,res)=>{
    let email=req.body.email;
    let lastName=req.body.lastName;
    let firstName=req.body.firstName;
    let age=req.body.age;
    let pswd1=req.body.password;
    let pswd2 =req.body.confirmPassword;
    let country=req.body.country;

    const newUser = new User({
        lastName: lastName,
        firstName:firstName,
        email: email,
        password: pswd1,
        passwordConfirm:pswd2,
        age: age,
        country:country,
        role:'basic'
    });
    
    newUser.save()
        .then(user => {
            res.redirect('/main');
            console.log('User saved successfully:', user);
        })
        .catch(error => {
            console.error('Error saving user:', error);
        });
    if(pswd1==pswd2){
        var transporter =nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth:{
                user:"begarys0505@mail.ru",
                pass: "kZc2D0d9XmR0z1ftyH4p"
            }
        });
        var mailOptions = {
            from: 'begarys0505@mail.ru',
            to: email,
            subject:'You are welcome',
            text:'Welcome to the site'
        };

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log('Email sent: ' + info.response);
            }
        });
    }
    
});

app.get('/registration',(req,res)=>{
    res.render('registration.ejs');
})

app.post('/login', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        var loginStatus = {
            success: false,
            message: "Неверный логин или пароль",
            data: {}
        };

        const user = await User.findOne({ email: email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                loginStatus.success = true;
                if(user.role=="admin") {
                    res.redirect('/admin');
                } else {
                    res.redirect('/main');
                }
            }
        }
        res.render("login.ejs", { loginStatus });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/login', (req,res)=>{
    res.render('login.ejs', { loginStatus: { success: false, message: "" } });
});

app.get('/admin', async (req, res) => {
    let data;
    try {
        const user = await User.findOne({ email: "shaikhieva84@gmail.com" });
        data = user;
    } catch (error) {
        console.log(error);
    }
    res.render('adminMain.ejs', { data });
});


app.post('/admin', async(req, res) => {
    let data;
    const email2=req.body.poisk;
    const Email = req.body.search;
    const newimg = req.body.img;
    const newage = req.body.age;
    const newlname=req.body.lName;
    const newfname=req.body.fName;
    const role=req.body.role;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: Email },
            { $set: { img: newimg, age: newage,lastName: newlname,firstName: newfname,role:role } },
            { new: true } // To return the updated document
        );
        const user = await User.findOne({ email: email2 });
        data = updatedUser;
    } catch (error) {
        data = null;
        console.log(error);
    }
    res.render('adminMain.ejs', { data })
});
app.post('/adminAdd',(req,res)=>{
    let email=req.body.email;
    let lastName=req.body.lastName;
    let firstName=req.body.firstName;
    let age=req.body.age;
    let pswd1=req.body.password;
    let pswd2 =req.body.confirmPassword;
    let country=req.body.country;

    const newUser = new User({
        lastName: lastName,
        firstName:firstName,
        email: email,
        password: pswd1,
        passwordConfirm:pswd2,
        age: age,
        country:country,
        role:'basic'
    });
    
    newUser.save()
        .then(user => {
            res.redirect('/admin');
            console.log('User saved successfully:', user);
        })
        .catch(error => {
            console.error('Error saving user:', error);
        });
})

app.get('/adminAdd',(req,res)=>{
    res.render('adminAdd.ejs')
})

app.post('/main', async (req, res) => {
    let data;
    const Email = req.body.search;
    const newimg = req.body.name;
    const newage=req.body.age;

    try {
        const user = await User.findOne({ email: email });

        if (!updatedUser || !updatedUser1) {
            throw new Error("User not found");
        }

        data = user;
    } catch (error) {
        data = null;
        console.log(error);
    }

});


app.get('/main', async(req,res)=>{
    let email = "beks040205@gmail.com";
    let data;
    try {
        const user = await User.findOne({ email: email });
        data=user;
    } catch (error) {
        data=null;
        console.log(error);
    }
    res.render('main.ejs',{data})
});


mongoose.connect("mongodb+srv://beka24k:040205@web.0rf2pml.mongodb.net/CRUD-API?retryWrites=true&w=majority")
.then(()=>{
    app.listen(3000,()=>{
        console.log("working on port 3000")
    })
    console.log("connected to db");
})
.catch((error)=>{
    console.error(error)
});