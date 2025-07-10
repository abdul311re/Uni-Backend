const bcrypt = require("bcrypt");
const Auth = require("../Models/auth.model");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password);

  try {
    const user = await Auth.findByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     
    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    console.log("Input password:", password);
    console.log("DB password:", user.password);
    console.log("Password is match:", isMatch);
    if(password === user.password){
      console.log("correct")
    }else{
      console.log("natcho false")
    }
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user, success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
