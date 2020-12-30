const { Strategy, ExtractJwt } = require("passport-jwt");

const UserModel = require("../models/users");
const { SECRET } = require("../config/index");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await UserModel.findById(payload.user_id)
        .then(async (user) => {
          if (user) {
            return done(null, user);
          }
          return null, false;
        })
        .catch((err) => {
          return done(null, false);
        });
    })
  );
};
