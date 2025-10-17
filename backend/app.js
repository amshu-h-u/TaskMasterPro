const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv');
const cors=require('cors')
const userRoutes=require("./routes/routes.js")

dotenv.config();
const app=express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",userRoutes)
app.listen(PORT,()=>{
    console.log("Server is listening at port 8080")
})
const db_url=process.env.MONGO_URL;
const start=async ()=>{
    try{
   await mongoose.connect(db_url)
    console.log("Connected to DB")
    }catch(err){
        console.log(err)
    }
}
start()