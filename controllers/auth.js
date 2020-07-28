const axios = require('axios');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');

module.exports.send_otp = (req, res) => {
  const { mobile } =  req.body;
  if(mobile){
    return axios(`${process.env.TWOFACTOR_BASE_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${mobile}/AUTOGEN`)
        .then(data => {
          return res.status(200).json({
            message: `OTP has been sent to ${mobile}`,
            session: data.data.Details
          })
        })
        .catch(err => {
          return res.status(400).json({
            error: 'Something went wrong, Please try again!'
          })
        })
  }
  res.status(400).json({
    error: 'Please enter mobile number'
  })
}



module.exports.verify_otp = async (req, res) => {
  const { session_id, otp_input,mobile } =  req.body;
// verify input otp
  axios(`${process.env.TWOFACTOR_BASE_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${session_id}/${otp_input}`)
    .then(async data => {
      if(data.data.Details === "OTP Expired"){
        return res.status(400).json({
          error: "OTP is expired"
        })
      }
      //check whether is existed in the database
      const check_user_existence = await User.findOne({ mobile: mobile })
      //if user is existed in database then update user's verified status
       if(check_user_existence){
        return User.findOneAndUpdate({ mobile }, { verified: true }, (err, user) => {
          if(err){
            return res.status(400).json({
              error: 'failed to update verified status'
            })
          }
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.cookie('token', token, { expiresIn: '1d' });
          res.status(200).json({
            result: user,
            token: token,
            message: `Successfuly verified`
          })
        })
       }
      //if user is not existed in the database then save user info into the database
      const newUser = User({ mobile, verified: true });
             await newUser.save((err, user) => {
               if(err){
                 return res.status(400).json({
                    error: 'Something went wrong, Please try again!'
                  })
               }
             const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
             res.cookie('token', token, { expiresIn: '1d' });
             return res.status(200).json({
             result: user,
             token: token,
             message: `Successfuly verified`
           })
             })
    })
    .catch(err => {
      return res.status(400).json({
        error: "Wrong OTP"
      })
    })
}



 exports.signout = (req, res) => {
     res.clearCookie('token');
     res.json({
         message: 'Signout success'
     });
 };

 exports.requireSignin = expressJwt({
     secret: process.env.JWT_SECRET // req.user
 });


 exports.authMiddleware = (req, res, next) => {
     const authUserId = req.user._id;
     User.findById({ _id: authUserId }).exec((err, user) => {
         if (err || !user) {
             return res.status(400).json({
                 error: 'User not found'
             });
         }
         req.profile = user;
         next();
     });
 };
