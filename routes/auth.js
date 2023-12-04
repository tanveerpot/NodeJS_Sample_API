import express from 'express';

import passport from 'passport';

import {
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword
} from '../controllers/auth';

import User from '../models/user';

import { authenticateAuthToken } from '../middlewares/auth';

import catchResponse from '../utils/catch-response';

const router = express.Router();

const loginCheck = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      req.error = info.error;
    } else req.user = user;
    next();
  })(req, res, next);
};

router.post('/sign-in', loginCheck, async (req, res) => {
  try {
    if (req.error) {
      const err = new Error();
      err.error = 'Email or Password is incorrect';
      err.statusCode = 401;
      throw err;
    }

    const {
      user: {
        _id: userId,
        email,
        name,
        role
      }
    } = req;

    const response = await SignIn({
      userId,
      email
    });

    const {
      token,
      user
    } = response;

    res.status(200).json({
      token,
      user: {
        ...user,
        name,
        role
      }
    });
  } catch (err) {
    await catchResponse({
      res,
      err
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      body: { name, email, password }
    } = req;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, Email and Password Are Required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Email Already Exists' });

    const response = await SignUp({ name, email, password });

    const { token, user } = response;
    return res.status(200).json({
      token,
      user
    });
  } catch (err) {
    await catchResponse({
      res,
      err
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { body: { email } } = req;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json('email not found');
    }

    const response = await ForgotPassword({ email, user });

    return res.status(200).json(response);
  } catch (err) {
    await catchResponse({
      res,
      err
    });
  }
});
router.put('/reset-password', authenticateAuthToken, async (req, res) => {
  try {
    const { user: { email }, body: { password } } = req;

    const response = await ResetPassword({ email, password });

    return res.status(200).json({
      message: response.message
    });
  } catch (err) {
    await catchResponse({
      res,
      err
    });
  }
});

export default router;
