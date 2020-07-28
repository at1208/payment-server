const mongoose =  require('mongoose');
const userSchema  = mongoose.Schema({
   name: {
     type: String
   },
   email: {
     type: String
   },
   mobile: {
     type: String,
     required: true,
     unique: true
   },
   verified: {
     type: Boolean,
     default: false
   }
})
module.exports = mongoose.model('User', userSchema);
