const Users =  require("./userModels");
const bcrypt = require("bcrypt");

module.exports.login = async(req,res,next) => {
try{
  const {username,password} = req.body;
  const user = await Users.findOne({username});
  if(!user){
    return res.status(401).json({message:"Invalid email or password"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({message:"Invalid email or password"});
      
      }
      delete user.password;
      return res.json({status: true,user});
      
      }catch(err){
        next(err);
        }
        };
module.exports.register = async(req,res,next) => {
  try{
    const {username,email,password} = req.body;
    const user = await Users.findOne({email});
    if(user){
      return res.status(400).json({message:"Email already exists"});
      }
      const hashedPassword = await bcrypt.hash(password,10);
      const newUser = new Users({username,email,password:hashedPassword});
      await newUser.save();
      res.json({message:"User created successfully"});
      }catch(err){
        next(err);
      }
    };

module.exports.getalluser = async(req,res,next) => {
  try{
    const users = await Users.find().select("-password");
    res.json(users);
    }catch(err){
      next(err);
    }
};

module.exports.logout = async(req,res,next) => {
  try{
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({message:"Logged out successfully"});
    }catch(err){
      next(err);
    }
};

module.exports.setavtar = async(req,res,next) =>{
  try{
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userdata = await Users.findByIdAndUpdate(userId,{isAvatarImageSet:true,avatarImage,},{new:true});
    return res.json({
      isSet : userdata.isAvatarImageSet,
      image: userdata.avatarImage,
    });
}catch(ex){
  next(ex);
}
};