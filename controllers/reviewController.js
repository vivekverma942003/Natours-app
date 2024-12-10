// const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// exports.getAllReview = catchAsync(async (req, res, next) => {
//   // let filter = {};
//   // if (req.params.tourId) filter = { tours: req.params.tourId };
//   console.log(req.params.tourId);
//   const review = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     result: review.length,
//     data: {
//       review,
//     },
//   });
// });
exports.getAllReview = factory.getAll(Review);
exports.setUserTourIds = (req, res, next) => {
  //allowing nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
// exports.createReview = catchAsync(async (req, res, next) => {
//   //allowing nested route
//   if (!req.body.tour) req.body.tours = req.params.tourId;
//   if (!req.body.user) req.body.users = req.user.id;
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(new AppError('no review of this id was found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
