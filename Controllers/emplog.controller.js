const Auth = require("../Models/auth.model");
const bcrypt = require("bcrypt");

exports.loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    console.log(`Login attempt: ${cleanUsername} ${cleanPassword}`);
    console.log(`Entered password (plaintext): ${cleanPassword}`);

    // convert callback to promise
    const user = await new Promise((resolve, reject) => {
      Auth.findByUsername(cleanUsername, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    console.log(user)
    if (!user) {
      console.log(`User ${cleanUsername} not found`);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log(`DB hash for ${cleanUsername}: ${user.password}`);

    bcrypt.compare(cleanPassword, user.password, (error) => console.log("\n"+error));
    
    const match = await bcrypt.compare(cleanPassword, user.password);
    console.log(`bcrypt.compare(${cleanPassword}, ${user.password}) result: ${match}`);

    if (!match) {
      console.log(`Invalid password for user: ${cleanUsername}`);
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({
      success: true,
      id: user.employeeId,
      username: user.username
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
