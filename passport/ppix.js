import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { UserModel } from "../db/schema";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id).select('+password');
        
        done(null, user || false);
    } catch (err) {
        done(err, false);
    }
});

passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username }).select('+password');

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const ok = await bcrypt.compare(password, user.password);

                if (!ok) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                if (!user.emailVerified) {
                    return done(null, false, { message: 'Please verify your email before logging in' })
                }

                if (user.isActive === false) {
                    return done(null, false, { message: 'Account inactive' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${BASE_URL}/user/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase(); 
                
                if (!email) {
                    return done(null, false, { message: 'No email from Google' });
                }

                let user = await UserModel.findOne({ emailId: email });

                if (!user) {
                    user = await UserModel.create({
                        name: profile.displayName || 'Google User',
                        username: `g_${profile.id}`,
                        emailId: email,
                        isActive: true,
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

export default passport;