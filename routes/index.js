import express from 'express';

import auth from './auth';
import leads from './leads';

const router = express.Router();

router.use('/auth', auth);
router.use('/leads', leads);

export default router;
