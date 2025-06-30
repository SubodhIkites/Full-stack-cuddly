const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://dbUser:V2Z-e9bkhuU7t3S@cluster0.ojhqnpa.mongodb.net/myDB?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = { connect };

// cuddlyfuff
// cuddly@9639#puff
// cuddly@9639#puff
//dbUser
// V2Z-e9bkhuU7t3S
//V2Z-e9bkhuU7t3S
