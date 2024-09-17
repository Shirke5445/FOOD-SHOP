import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import  {getResetPasswordTemplate}  from "../utils/emailTemplates.js";
import Errorhandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"
import { delete_file, upload_file } from "../utils/cloudinary.js";

//import { send } from "process";
//Register User  => /api/v1/register
export const registerUser = catchAsyncErrors (async (req, res,next ) => {
const {name, email, password} = req.body;

const user = await User.create({
    name,
    email,
    password
});

sendToken(user, 201, res);
});

//Login User  => /api/v1/login
export const loginUser = catchAsyncErrors (async (req, res,next ) => {
    const { email, password} = req.body;
    
    if(!email || !password) {
        return next(new Errorhandler("Please enter email & password", 400));
    }   

    //Find user in the database
    const user = await User.findOne({email}).select("+password");

    if(!user) {
        return next(new Errorhandler("Invalid email or password", 401));
    } 

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new Errorhandler("Invalid email or password", 401));
    } 
 
    sendToken(user, 200, res);
    });


    //Logout User  => /api/v1/logout
export const logout = catchAsyncErrors (async (req, res,next ) => {
    res.cookie("token", null,  {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json ({
        message: "Loggged Out",
    });
});
//Upload User avatar  => /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors (async (req, res,next ) => {
    const avatarResponse = await upload_file(req.body.avatar, "FOOD-SHOP/avatars");


    //Remove previous avatar 
    if (req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id);
    }  
    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar : avatarResponse,
    });

    res.status(200).json ({
        user,
    });
});

//Forgot password  => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors (async (req, res,next ) => {

    //Find user in the database
    const user = await User.findOne({email:req.body.email});

    if(!user) {
        return next(new Errorhandler("User not found with this email", 404));
    } 

    //Get rest password token

    const resetToken = await user.getResetPasswordToken();
    await user.save();

    //create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name,resetUrl);
    try {
        await sendEmail({
        email:user.email,
        subject:"FOOD-SHOP password recovery",
        message,
    });
    res.status(200).json({
        message:`Email send to:${user.email}`,
    });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();
        return next(new Errorhandler(error?.message,500));
    }
    
    });


    //Reset password  => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors (async (req, res,next ) => {

//Hash the URL Token
const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({

        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(
            new Errorhandler(
                "Password reset token is invalid or hasbeen expird", 
        400
        )
        );
    } 

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
//set the new password
user.password = req.body.password

user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

sendToken(user, 200, res);
});


//Get current user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    });
});


//Update Password => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");

    //Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.olsPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect",400));
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    });
});      


//Update User Profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
    });
    

    res.status(200).json({
        user,
    });
});


//Get all Users - ADMIN => /api/v1/admin/users
export const allUsers = catchAsyncErrors(async(req, res, next) => {
    const user = await User.find();

    res.status(200).json({
        user,
    });
});



//Get User Details - ADMIN => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {

        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));

    };

    res.status(200).json({
        user,
    });
});


//Update User Details - ADMIN => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params._id, newUserData, {
        new: true,
    });
    

    res.status(200).json({
        user,
    });
});


//Delete User - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {

        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));

    };

    //TODO - Remove user avatar from cloudinary

    await user.deleteOne();

    res.status(200).json({
        user,
    });
});

