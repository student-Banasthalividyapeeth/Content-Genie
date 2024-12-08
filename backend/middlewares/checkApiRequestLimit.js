const asyncHandler = require('express-async-handler');
const User = require('../models/User');


const checkApiRequestLimit = asyncHandler(async(req,res,next)=>{
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      //Find the user
      const user = await User.findById(req?.user?.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let requestLimit=0;
      
      if(user?.trialActive)
      {
        requestLimit=user?.monthlyRequestCount;
      }
      if (user?.apiRequestCount >= requestLimit) {
        throw new Error("API Request limit reached, please subscribe to a plan");
      }
      next();


});


module.exports = checkApiRequestLimit;