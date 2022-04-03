const express = require('express');

const User = require('../models/user.models');

const upload =require("../middlewares/uploads");
const { Router } = require('express');

const router = express.Router();

router.get("",async (req, res) => {
    try{
      const users = await User.find().lean().exec();
     
      return res.status(200).send(users);
    }catch(err){
        return res.status(500).send({message: err.message})
    }
})

router.post("",upload.single("profile_pic"),async (req, res) => {
    try{
        const user=await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile_pic:req.file.path,

        })
        return res.status(200).send(user)
    }
    catch(err){
        return res.status(500).send({message: err.message})
    }
});

router.post("/multiple",upload.any("Profile_pic"), async (req, res)=>{
    try{
        const  filePaths=req.files.map((file)=>{
        return file.path;
        });
    // console.log({filePaths})
    const user=await User.create({
        first_name: req.body.first_name, 
        last_name:req.body.last_name,
        profile_pic:filePaths,
    })
    return res.status(200).send(user);
   }
    catch(err)
    {
        return res.status(500).send({message:err.message})
    }
});

router.patch('/:id',async( req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{
            new: true
         })
         .populate({
            path:"postId",
            select:"[first_name]",
             setpopulate:({path:"userId",select:["first_name"]})
       
         })
         setpopulate:({path:"userId",select:["last_name"]}).exec(); 
return res.status(200).send({message})
    }catch(err) {return res.status(500).send({message:err.message})
}
        
});

// router.delete("/:id", user.controller.deleteOne(user))

// router.delete("/:id", User.controller.deleteOne(user))



module.exports =router;