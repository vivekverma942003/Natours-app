const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const router = express.Router();
// router.use(authController.isLogin);
router.get('/', authController.isLogin, viewController.getOverview);
router.get('/tour/:slug', authController.isLogin, viewController.getTour);
router.get('/login', authController.isLogin, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
// note :- isLogin and protect route have the same implementation but in getMe route we need to protect the route but we mounted the isLogin middleware in the top as it goes in every route now in getMe route the number of same query twice so to prevent that we insert inLogin middleware in every route so to prevent multiple query
module.exports = router;
///////// only test file
// router.get('/', (req, res, next) => {
//   // this set the very first page of the (root page) according to the base (pug) template on the views folder
//   res.status(200).render('base', {
//     tour: 'Forest Hiker', // here tour and user is a variable that can be used in a pug file
//     user: 'ujjwal',
//   });
// });
