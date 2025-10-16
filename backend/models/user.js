const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    todo:{type:String,required:true},
    completed:{type:Boolean,default:false}
})

const User=mongoose.model("User",userSchema)
module.exports=User;