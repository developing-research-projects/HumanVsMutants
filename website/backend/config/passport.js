const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/github/callback`,
    scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, { profile, accessToken });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
