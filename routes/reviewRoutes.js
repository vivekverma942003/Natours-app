const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams give the acces to the the params that are not for review route
// eg. /tour/tourId/review here review Route do no have access to the tourId param but using mergeParam it get it now
const router = express.Router({ mergeParams: true });

// for creating review everyone have to be logged in so here uses router.use(authController.protect) so from this point on everything is protected

router.use(authController.protect);

router.route('/').get(reviewController.getAllReview).post(
  // authController.protect,
  authController.restrictTo('user'),
  reviewController.setUserTourIds,
  reviewController.createReview,
);
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user,admin'),
    reviewController.deleteReview,
  );

module.exports = router;
