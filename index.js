const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const { success, error } = require("consola");

//bring in the app constants
const { DB, PORT } = require("./config/index");
const UserRouter = require("./routes/users");

const startApp = async () => {
  //Initialize the application
  const app = express();

  //Middlewares
  app.use(cors());
  app.use(bodyParser.json());
  app.use(passport.initialize());

  require("./middlewares/passport")(passport);
  app.use("/api/users", UserRouter);

  //Database connection
  try {
    await mongoose.connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      success({
        message: `Running in port ${PORT}`,
        badge: true,
      });
    });
  } catch (err) {
    error({
      message: `Error in DB connection : ${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();
