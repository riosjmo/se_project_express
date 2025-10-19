const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

// Test login function
async function testLogin(email, password) {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    
    const user = await User.findUserByCredentials(email, password);
    console.log("✅ Login successful for:", user.email);
    console.log("User:", { name: user.name, email: user.email });
  } catch (error) {
    console.log("❌ Login failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Replace with the password you think you used
const testEmail = "riojordan127@yahoo.com";
const testPassword = "your-password-here"; // Replace with actual password

console.log(`Testing login for: ${testEmail}`);
testLogin(testEmail, testPassword);