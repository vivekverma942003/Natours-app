const express = require('express');
// eslint-disable-next-line import/no-useless-path-segments
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');

const reviewRouter = require('./../routes/reviewRoutes');

// making a route to reivew related to a tour
// for using below code please uncomment the review controller
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

// now doing same but this time usign EXPRESS function of merge params
/*for this first import review route */
const router = express.Router();
// redirect to review Router if this route come
router.use('/:tourId/reviews', reviewRouter);
// router.param('id', (req, res, next, val) => {

//   // console.log(`tour id : ${val}`);
//   next();
// });
// router.param('id', tourController.checkId);
router.route('/top-5-cheap').get(
  tourController.aliasTopTours, // Middleware
  tourController.getAllTours, // Main handler
);

router.route('/get-tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
