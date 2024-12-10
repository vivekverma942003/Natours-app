const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //steps to  build overview page
  // 1) get tour data from collection
  const tours = await Tour.find();
  // 2) build the template
  // 3) render this template using tour data from the collection
  res.status(200).render('overview', {
    title: 'All Tour',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //steps to  build tour page
  // 1) get tour with respected guides and review
  console.log(req.params.slug);
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) return next(new AppError('there is not a tour of that name', 404));
  // 2) build the template
  // 3) render the template with respected data

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res
    .status(200)
    // .set('Content-Security-Policy', "connect-src 'self' 127.0.0.1:3000/")
    .render('login', {
      title: 'Log into your account',
    });
});
exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: user,
  });
});
