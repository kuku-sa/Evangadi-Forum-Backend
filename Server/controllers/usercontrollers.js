// database connection
const dbconnection = require("../Database/databaseconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail =require("../utils/emailSender")
// ------------------- Register -------------------
async function register(req, res) {
  let { username, firstname, lastname, email, user_password } = req.body;

  //  Combined empty field checks
  const errors = [];
  if (!username) errors.push("Username is required");
  if (!firstname) errors.push("Firstname is required");
  if (!lastname) errors.push("Lastname is required");
  if (!email) errors.push("Email is required");
  if (!user_password) errors.push("Password is required");

  if (errors.length) {
    return res.status(400).json({ message: "Validation error", errors });
  }

  //  Stronger password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(user_password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
    });
  }

  try {
    // Check username uniqueness
    const [usernameValidation] = await dbconnection.query(
      "SELECT * FROM users WHERE username= ?",
      [username]
    );

    // Check email uniqueness
    const [emailValidation] = await dbconnection.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (usernameValidation.length > 0) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Username Already Exists" });
    }

    if (emailValidation.length > 0) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email Already in Use" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    // Insert new user into database
    await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, user_password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// ------------------- Login -------------------
async function login(req, res) {
  const { email, user_password, rememberMe } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is empty" });
  }
  if (!user_password) {
    return res.status(400).json({ message: "password is empty" });
  }

  try {
    const [rows] = await dbconnection.query(
      "SELECT username,userid,user_password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const username = rows[0].username;
    const userid = rows[0].userid;

    const expiresIn = rememberMe ? "30d" : "1d";

    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    return res.status(200).json({
      msg: "user login successful",
      token,
      username,
      userid, 
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// ------------------- Checkuser -------------------
async function checkuser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.json({ message: "user is logged in", username, userid });
}

// ------------------- Forgot Password -------------------

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user exists
    const [rows] = await dbconnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Email not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save hashed OTP + expiration
    await dbconnection.query(
      "UPDATE users SET reset_otp = ?, otp_expiration = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE email = ?",
      [hashedOtp, email]
    );

    // Send OTP email
    await sendEmail(
      email,
      "Your OTP Code - Do not share",
      `
      <p>Hello,</p>
      <p>Your OTP code for password reset is:</p>
      <h2 style="color:blue;">${otp}</h2>
      <p><b>This OTP will expire in 5 minutes.</b></p>
      <p style="color:red;">⚠️ Do not share this code with anyone for security reasons.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>Support Team</p>
      `
    );

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- Reset Password -------------------
 const resetPassword = async (req, res) => {
   const { email, otp, newPassword } = req.body;

   if (!email || !otp || !newPassword) {
     return res.status(400).json({ message: "All fields are required" });
   }

   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

   if (!passwordRegex.test(newPassword)) {
     return res.status(400).json({
       message:
         "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
     });
   }

   try {
     //  Get user by email ONLY
     const [rows] = await dbconnection.query(
       "SELECT reset_otp, otp_expiration FROM users WHERE email = ?",
       [email]
     );

     if (rows.length === 0) {
       return res.status(404).json({ message: "Email not found" });
     }

     const user = rows[0];

     //  Check OTP expiration
     if (!user.otp_expiration || new Date(user.otp_expiration) < new Date()) {
       return res.status(400).json({ message: "OTP has expired" });
     }

     //  Compare OTP using bcrypt
     const isOtpValid = await bcrypt.compare(otp, user.reset_otp);
     if (!isOtpValid) {
       return res.status(400).json({ message: "Invalid OTP" });
     }

     //  Hash new password
     const hashedPassword = await bcrypt.hash(newPassword, 10);

     //  Update password & clear OTP fields
     await dbconnection.query(
       "UPDATE users SET user_password = ?, reset_otp = NULL, otp_expiration = NULL WHERE email = ?",
       [hashedPassword, email]
     );

     res.json({ message: "Password reset successful! You can now login." });
   } catch (err) {
     console.error("Reset password error:", err);
     res.status(500).json({ message: "Server error" });
   }
 };
module.exports = {
  register,
  login,
  checkuser,
  resetPassword,
  forgotPassword
};
