const User=require("../models/user");
const httpStatus=require("http-status")

const user=async(req,res)=>{
    try{
       const newTask=new User({todo:req.body.todo});
       const savedTask=await newTask.save();
       res.json(savedTask);
    }
    catch(err){
        res.status(500).json({error:err.message});
        console.log(err)
    }
}
module.exports={user}