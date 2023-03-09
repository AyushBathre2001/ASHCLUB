const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
const dbConnect = ()=>{
    mongoose.connect(process.env.DB_URI,()=>{
        console.log("Connected")
    })
}

module.exports = dbConnect