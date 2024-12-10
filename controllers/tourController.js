/* eslint-disable no-console */
/* eslint-disable spaced-comment */
// const fs = require('fs');
// eslint-disable-next-line import/no-useless-path-segments
// const { json } = require('express');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
// const APIfeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//// API features

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`tour id : ${val}`);

//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   next();
// };
//// get All tour
exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIfeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination();

//   //executing the query
//   const tours = await features.query;

//   // send response
//   res.status(200).json({
//     status: 'success',
//     requestAt: req.requestTime,
//     result: tours.length,
//     data: {
//       // tours: tours,
//       tours,
//     },
//   });
// console.log(req.requestTime);
// try {
// building a query
// 1A) filltering
// const queryObj = { ...req.query }; //created a shallow copy of the req.query
// const excludeField = ['page', 'sort', 'limit', 'fields'];
// excludeField.forEach((el) => {
//   delete queryObj[el];
// });

// console.log(req.query, queryObj);

// 1B) Advanced filtering
// { price: { gte: '500' }, difficulty: 'medium' }
// { price: { $gte: '500' }, difficulty: 'medium' } mongo filterring code
// gte => greter then or equal
// gt => greter then
// lt => lesser then
// lte => lesser then equal

// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`,
// );
// console.log(JSON.parse(queryString));
// const query = Tour.find(queryObj);
// let query = Tour.find(JSON.parse(queryString));
// // 2) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   // query = query.sort(req.query.sort);
//   // sort(price ratingAverage)
//   query = query.sort(sortBy);
// } else {
//   query.sort('-createdAt');
// }

//3) Field limiting
// if (req.query.fields) {
//   const field = req.query.fields.split(',').join(' ');
//   query = query.select(field);
// } else {
//   query = query.select('-__v');
// }

//4) Pagination
// const page = req.query.page * 1 || 1; // seting the default page value to 1
// const limit = req.query.limit * 1 || 100; // seting the default limit value to 100
// const skip = (page - 1) * limit;
// // ?page=2&limit=10
// // 1-10 on page 1 , 11-20 on page 2, 21 - 30 on page 3
// // (query = query.skip(10).limit(10)),
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTour = await Tour.countDocuments();
//   if (skip > numTour) throw new Error('Page doesnot exist');
// }

// executing API features
// const features = new APIfeatures(Tour.find(), req.query)
//   .filter()
//   .sort()
//   .limitFields()
//   .pagination();

// //executing the query
// const tours = await features.query;

// // send response
// res.status(200).json({
//   status: 'success',
//   requestAt: req.requestTime,
//   result: tours.length,
//   data: {
//     // tours: tours,
//     tours,
//   },
// });
// } catch (err) {
//   console.log(err);
//   res.status(404).json({
//     status: 'fail',
//     message: err,
//   });
// }
// });
// get tour function
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// exports.getTour = catchAsync(async (req, res, next) => {
//   console.log(req.params);
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('no tour find with this id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// try {
//   const tour = await Tour.findById(req.params.id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'err',
//   });
// }
// // const id = req.params.id * 1;
// const tour = tours.find((el) => {
//   return el.id === id;
// });

//way to handle in valid id
/// solution 1;
// if (id > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'invalid id',
//   });
// }
/// solution 2;
// if (!tour) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'invalid id',
//   });
// }
// res.status(200).json({
//   status: 'success',
//   data: {
//     tours,
//   },
// });
// });
// const catchAsyn = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
/// create Tour
exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// console.log(req.body);
// const newId = tours[tours.length - 1].id + 1;
// // res.send('success')
// const newTour = Object.assign({ id: newId }, req.body);
// tours.push(newTour);
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   },
// );
// try {
//   // const newTour = new Tour({});
//   // newTour.save();

//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'error',
//     err,
//   });
// }
// });
/// update TOUR
exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('no tour find with this id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// const id = req.params.id * 1;
// if (id > tours.length) {
//   return res.status(400).json({
//     status: 'fail',
//     message: 'invalid id',
//   });
// }
// try {
// const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//   new: true,
//   runValidators: true,
// });
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'error',
//   });
// }
// });
/////// delete TOUR function

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('no tour find with this id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });

// now using the handler factory code
exports.deleteTour = factory.deleteOne(Tour);

// try {
//   await Tour.findByIdAndDelete(req.params.id);
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'error',
//   });
// }
// });

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' }, // it just convert the text of difficulty to upper case
        numTour: { $sum: 1 },
        numsRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // after these stage we donot have access to old name .... after this point we have only access to the name that are defined up
      $sort: {
        avgPrice: 1, // sort asceding order
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // it created a match that have fields ne(not equal to ) == 'EASY'
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingsAverage: { $gte: 4.5 } },
  //     },
  //     {
  //       $group: {
  //         // _id: null,
  //         // _id: '$difficulty',
  //         _id: { $toUpper: '$difficulty' }, // it just convert the text of difficulty to upper case
  //         numTour: { $sum: 1 },
  //         numsRating: { $sum: '$ratingsQuantity' },
  //         avgRating: { $avg: '$ratingsAverage' },
  //         avgPrice: { $avg: '$price' },
  //         minPrice: { $min: '$price' },
  //         maxPrice: { $max: '$price' },
  //       },
  //     },
  //     {
  //       // after these stage we donot have access to old name .... after this point we have only access to the name that are defined up
  //       $sort: {
  //         avgPrice: 1, // sort asceding order
  //       },
  //     },
  //     // {
  //     //   $match: { _id: { $ne: 'EASY' } }, // it created a match that have fields ne(not equal to ) == 'EASY'
  //     // },
  //   ]);
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       stats,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'error',
  //   });
  //   // console.log(err);
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // its created a single document for each startDates field
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTour: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { months: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTour: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // try {
  //   const year = req.params.year * 1;
  //   const plan = await Tour.aggregate([
  //     {
  //       $unwind: '$startDates', // its created a single document for each startDates field
  //     },
  //     {
  //       $match: {
  //         startDates: {
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`),
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { $month: '$startDates' },
  //         numTour: { $sum: 1 },
  //         tour: { $push: '$name' },
  //       },
  //     },
  //     {
  //       $addFields: { months: '$_id' },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //       },
  //     },
  //     {
  //       $sort: {
  //         numTour: -1,
  //       },
  //     },
  //   ]);
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       plan,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'error',
  //   });
  // }
});

// '/tour-within/:distance/center/:latlng/unit/:unit',
// latlng look like 123,-546
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    next(new AppError('pls provide in the format lat,lng', 204));
  console.log({ distance, unit, lat, lng });
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log({ tour });
  res.status(200).json({
    status: 'success',
    result: tour.length,
    data: {
      data: tour,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng)
    next(new AppError('pls provide in the format lat,lng', 204));
  const distances = await Tour.aggregate([
    {
      // in geospatial pipeline geonear must be at first stage

      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
