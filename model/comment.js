const mongoose=require('mongoose');


const commentSchema=mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog",
        required: true,
   },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
},{timestamps:true}
);

const commentModel=mongoose.model('comment',commentSchema);

module.exports=commentModel;