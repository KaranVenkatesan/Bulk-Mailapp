const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()

app.use(cors())
app.use(express.json())


// Install Nodemailer
const nodemailer = require("nodemailer")

// connecting with mongoose
mongoose.connect("mongodb+srv://vkaran0915:2000@cluster0.zb8jg.mongodb.net/apppass?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to DB")
})
    .catch(function () {
        console.log("Failed to Connect")
    })

// Creating Model
const credentials = mongoose.model("credentials", {}, "bulkmail");

app.post("/sendemail", function (req, res) {
    var msg = req.body.msg;
    var emailList = req.body.emailList;
    
    credentials.find().then(function(data) {
       
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toObject().user,
                pass: data[0].toObject().pass
            }
            
          
            
        });
        
        
        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "v.karan0915@gmail.com",
                            to: emailList[i],
                            subject: "A message from Bulk Mail App",
                            text: msg
                        },
                    )
                    console.log("Email sent to :" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    }).catch(function (error) {
        console.log(error)
    })
})

app.listen(5000, function () {
    console.log("Server Started")
})