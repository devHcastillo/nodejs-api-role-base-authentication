const User = require("../models/users");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { SECRET } = require("../config");
const { success, error } = require("consola");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, role, res) => {
  try {
    // Validate user
    let usernameTaken = await validateUsername(userDets.username);
    console.log(usernameTaken);
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

/**
 * @DESC To login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  // first check
  const currentUser = await User.findOne({ username });

  if (!currentUser) {
    return res.status(404).json({
      message: `Username not found. Invalid login credentials `,
      success: false,
    });
  }

  if (currentUser.role != role) {
    return res.status(404).json({
      message: `Please make sure you are logging in from the right portal`,
      success: false,
    });
  }

  let isMatch = await bcrypt.compare(password, currentUser.password);

  if (isMatch) {
    // sign token
    let token = jwt.sign(
      {
        user_id: currentUser._id,
        role: currentUser.role,
        username: currentUser.username,
        email: currentUser.email,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: currentUser.username,
      role: currentUser.role,
      email: currentUser.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Incorrent password`,
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  console.log(user);
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * @desc Passport middleware
 */

const userAuth = passport.authenticate("jwt", { session: false });

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    _id: user._id,
    name: user.name,
  };
};

/**
 * @DESC check Role Middleware
 */

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

module.exports = {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
};
