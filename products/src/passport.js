const passport = require("passport");
const apiUsers = require("./utils/apiUsers");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

function getToken(req) {
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!token) token = req.cookies?.jwt;
  return token;
}

module.exports = function (app) {
  const opts = {};
  opts.jwtFromRequest = getToken;
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    "user",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const users = await apiUsers.get("/all");
        const user = users.find((user) => user.id === jwtPayload.id);
        if (user) return done(null, user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    }),
  );

  passport.use(
    "admin",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const users = await apiUsers.get("/all");
        const user = users.find((user) => user.id === jwtPayload.id && user.role === "admin");
        if (user) return done(null, user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    }),
  );

  app.use(passport.initialize());
};
