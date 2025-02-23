const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name required"],
    },
    lastname: {
      type: String,
      required: [true, "Last name required"],
    },
    email: {
      type: String,
      required: [true, "Email required"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String, 
      default: "",  
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
