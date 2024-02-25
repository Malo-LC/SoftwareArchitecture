const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const users = require("./users");

function getToken(req) {
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  console.log(token);
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
