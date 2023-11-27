//import user model
const  User = require('../models/User');
//bcrypt
const {hashSync, compareSync} =  require('bcrypt');
const jwt  = require('jsonwebtoken');
const userController = {
    // signUp 
    signUp: async(req,res)=>{
        const userData = req.body;
        console.log(userData)
        try{
            //create user
            const user = User.create({
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                password: hashSync(userData.password, 10),
            });
            console.log('User created successfully');
            //success 
            res.status(200).json({ message: 'User created successfully' });
        }catch(err){
            console.log(`Error in creating user: ${err}`);
            // error 
            res.status(500).json({ error: 'Error creating user' });
        }
    },

    //signIn
    signIn : async(req, res )=>{
        const userData = req.body;
        //find the user
        const user = await User.findOne({email: userData.email});
        
        //if user not found 
        if(!user){
            console.log('user not found')
            return res.status(401).json({message: "User not found"});
        }

        //user found 
        if(!compareSync(req.body.password, user.password)){
            console.log('password err')
            return res.status(401).json({message: "Incorrect Password"})
        }

        //create a token  
        const payload = {
            username: user.username,
            id : user._id
        }   
        const token = jwt.sign(payload , 'random', {expiresIn: '1d'});
      
        //send a token, since user is valid  
        return res.status(200).json({
            message: "Logged In successfully",
            userData: user,
            token: "Bearer " + token
        });
    },
    //get curr user Data
    getUserData: (req,res)=>{
        res.status(200).json(req.user);
    }
}
module.exports = userController;