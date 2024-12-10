const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
// router.post('/forgotPassword', authController.forgotPassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
//get me endpoint
// router.use(authController.protect) in this after this point every router have a protect middle ware without embedding in them so we can now remove authcontroler.protect from them
router.use(authController.protect);

router.get(
  '/me',
  // authController.protect,
  userController.getMe,
  userController.getUser,
);

router.patch(
  '/updatePassword',
  // authController.protect,
  authController.updatePassword,
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// from this point only admin has a access so now here we can use router.use(authController.restrictTo('admin')) so that after this point only admin can access this route
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
