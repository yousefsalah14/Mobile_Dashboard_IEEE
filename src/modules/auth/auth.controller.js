import { Token } from "../../../DB/models/token.model.js";
import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";
import randomstring from "randomstring";


// register 


export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword, phone, gender, role } =
    req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new Error("user is already exist!"));
  }
  if (password != confirmPassword) {
    return next(new Error("password and confirm password must be same!"));
  }
  const user = new User({
    userName,
    email,
    password,
    phone,
    gender,
    role,
  });
  await user.save();





  //create confirmaion link
  const token = jwt.sign({ email }, process.env.TOKEN_KEY);
  const link = `https://mobile-dashboard-ieee.vercel.app/${token}`;
  //send email
  const mail = await sendEmail({
    to: email,
    subject: "Confirm your account",
    text: `Hello ${userName},\n\nPlease click on the link below to activate your account:\n\n${link}\n\nThank you!`,
  });

  if (!mail)
    return next(new Error("message not sent to email for verify Email"));

  return res.json({
    success: true,
    msg: "check your email to verify your account ",
    user,
  });
});





// activate account
export const activate = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    return next(new Error("User not found!"));
  }

  user.isVerified = true;
  await user.save();
  return res.json({ success: true, msg: "Account is verified!" });
});




// log in

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email or Password are not correct!"));

    const isMatch =  bcryptjs.compareSync(password, user.password);
    
    if (!isMatch) return next(new Error("Email or Password are not correct!"));
  
    if (!user.isVerified) return next(new Error("Account is not verified!"));
  
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, { expiresIn: "1h" });
    await Token.create({ token, user: user._id });
  
    return res.json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  });
  




// send forgetCode
export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("email not found!"));
  }
  const code = randomstring.generate({
    length: 6,
    numeric: true,
  });
  user.forgetCode = code;
  await user.save();
  const messageSent = await sendEmail({
    to: email,
    subject: "Reset  Password",
    text: code,
  });
  if (!messageSent) return next(new Error("message not sent to email "));

  return res.json({ success: true, message: "code sent to your email " });
});




//reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { code, email, newPassword, confirmPassword } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email not found!"));
  
    if (user.forgetCode !== code) return next(new Error("Code is not correct!"));
  
    if (newPassword !== confirmPassword) return next(new Error("Passwords do not match!"));

    user.password = newPassword;
    user.forgetCode = "";
    await user.save();
    await Token.deleteMany({ user: user._id });
  
    return res.json({ success: true, message: "Password reset successfully" });
  });
  