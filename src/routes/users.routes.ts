import {auth} from '../midlewares/auth.middle';
import {Router} from 'express';
import {
  loginMethod,
  registerMethod,
  deleteMethod,
  getMeUser,
  patchMethod,
  changePassowrd,
  newPassowrd,
  resetPassowrd,
  verifyResetCode,
} from '../controllers/user.controller';

const router = Router();

router.route('/login').post(loginMethod);
router.route('/reset-password').post(resetPassowrd);
router.route('/verify-code').post(verifyResetCode);
router.route('/new-password').post(newPassowrd);
router.route('/change-pw').post(auth, changePassowrd);
router.route('/register').post(registerMethod);
router.route('/:id').delete(auth, deleteMethod);
router.route('/me').get(auth, getMeUser);
router.route('/:id').patch(auth, patchMethod);

export default router;
