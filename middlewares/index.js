import express from 'express';
import cors from 'cors';
import passport from 'passport';
import logger from 'morgan';

import { LocalLoginStrategy, AuthenticationStrategy } from './auth';

const applyMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.json());
  app.use(logger('common'));
  app.use(passport.initialize());
  passport.use(LocalLoginStrategy);
  passport.use(AuthenticationStrategy);
};

export default applyMiddlewares;
