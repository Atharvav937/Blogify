const JWT=require('jsonwebtoken');

const secret="Atharvav937@";

function createTokenForUser(user){
    const token=JWT.sign({
        _id:user._id,
        fullName: user.fullName,
        email:user.email,
        profileImageURL: user.profileImageURL,
        role:user.role,
    },secret);

    return token;
}


function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}


module.exports={
    createTokenForUser,
    validateToken,
};