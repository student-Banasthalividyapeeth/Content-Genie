const User = require("../models/User");
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');

const register = asyncHandler(async(req,res) => {
    

        const {username,password,email} = req.body;

        if(!username || !password || !email)
        {
            res.status(400);
            throw new Error("All fields are required");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);

        const newUser =new User({
            username,
            email,
            password:hashedPassword,
        });

        newUser.trialExpires = new Date(
            new Date().getTime() + newUser.trialPeriod*24*60*60*1000
        );

        await newUser.save()




        res.json({
            status: true,
            message: "Registration was successful",
            user:{
                username,
                email,
            }
        });
    
    
});


const login = async(req,res) => {
     try {
        const {email,password}=req.body;
        if(!email || !password){
            res.status(401);
            throw new Error("All fields are required");
        }
        const user=await User.findOne({email});

        if(!user){
            res.status(401);
            throw new Error("Register before login");
        }

        const compare=await  bcrypt.compare(password, user?.password);
        if(!compare){
            res.status(401);
            throw new Error("Password was incorrect");
        }

        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
            expiresIn: "3d", //token expires in 3 days
          });
          console.log(token);
          //set the token into cookie (http only)
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, //1 day
          });

        res.json({
           status:'success',
           _id: user?._id,
           message:'Login Successful',
           username: user?.username,
           email : user?.email,

        });
        



     } catch (error) {
        throw new Error(error);
     }
};


const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
  });


const userProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req?.user?.id)
      .select("-password")
      .populate("payments")
      .populate("contentHistory");
    // const id = "66157a4d41ee27a3d9e67ce2";
    // const user = await User.findById(req?.user?.id).select('-password');

    if (user) {
      res.status(200).json({
        status: "success",
        user,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
});  

const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});


module.exports = {
    register,
    login,
    logout,
    userProfile,
    checkAuth,
};




