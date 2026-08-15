const mongoose=require('mongoose');
const {createHmac, randomBytes}=require('crypto');
const {createTokenForUser,validateToken}=require('../service/authentication');

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:"/images/default.png",
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:"USER",
    }
},{timestamps:true});

userSchema.pre('save',async function (){
    const user=this;
    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken",async function (email,password){
    const userSignIn= await User.findOne({email});
    if(!userSignIn) throw new Error("User not found");

    const salt=userSignIn.salt;
    const hashedPassword=userSignIn.password;

    const userProvidedPassword=createHmac('sha256',salt).update(password).digest('hex');
    if(userProvidedPassword!==hashedPassword){
        throw new Error("Wrong Password");
    }

    const token=createTokenForUser(userSignIn);
    return token;


})


const User=mongoose.model('user',userSchema);


module.exports=User;