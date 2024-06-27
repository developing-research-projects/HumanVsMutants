const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const isTokenExpired = (token) => {
    const decodedToken = jwt.decode(token);
    return decodedToken.exp * 1000 < Date.now();
};

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        const userProfile = req.user.profile;

        // Extract user details from GitHub profile
        const githubUsername = userProfile.username;
        const email = userProfile.emails && userProfile.emails[0] && userProfile.emails[0].value;
        const profilePicture = userProfile.photos && userProfile.photos[0] && userProfile.photos[0].value;

        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
            where: { email: email },
        });

        // If the user exists but doesn't have the GitHub username, update the user
        if (user && !user.github_username) {
            user = await prisma.user.update({
                where: { email: email },
                data: {
                    github_username: githubUsername,
                    profile_picture: profilePicture,
                },
            });
        }

        // If the user doesn't exist, create a new user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    github_username: githubUsername,
                    email: email,
                    profile_picture: profilePicture,
                },
            });
        }

        // Check if the user already has a refresh token
        let refreshToken = await prisma.refreshToken.findFirst({
            where: { userId: user.user_id },
            orderBy: { createdAt: 'desc' },
        });

        // If a refresh token exists and it's not expired, reuse it
        if (refreshToken && !isTokenExpired(refreshToken.token)) {
            refreshToken = refreshToken.token;
        } else {
            // Generate a new refresh token
            refreshToken = jwt.sign({
                id: user.user_id,
                username: user.github_username,
            }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Long-lived refresh token

            // Store refresh token in the database
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.user_id,
                }
            });
        }

        const token = jwt.sign({
            id: user.user_id,
            username: user.github_username,
            email: user.email,
            avatar_url: user.profile_picture,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`);
    }
);


router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    let userId;
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userId = payload.id;
    } catch (error) {
        return res.sendStatus(403);
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });

    if (!tokenRecord) return res.sendStatus(403);

    const user = await prisma.user.findUnique({
        where: { user_id: userId },
    });

    const newAccessToken = jwt.sign({
        id: user.user_id,
        username: user.github_username,
        email: user.email,
        avatar_url: user.profile_picture,
    }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
});

module.exports = router;
