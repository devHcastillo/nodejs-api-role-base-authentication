const User = require("../models/users");
const bcrypt = require("bcryptjs");

const { success, error } = require("consola");
/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */

const userRegister = async (userDets, role, res) => {
  try {
    // Validate user
    let usernameTaken = await validateUsername(userDets.username);
    console.log(usernameTaken)
    if (!usernameTaken) {
      return res.status(400).json({
        message: "Username is already taken",
        success: false,
      });
    }

    // //validate email
    let emailRegistered = await validateEmail(userDets.email);

    if (!emailRegistered) {
      return res.status(400).json({
        message: "Email is already registered",
        success: false,
      });
    }


    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Your user has been create",
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: `Database error, try again `,
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  console.log(user)
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

module.exports = {
  userRegister,
};
