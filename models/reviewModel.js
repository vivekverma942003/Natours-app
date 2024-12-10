const { text } = require('express');
const mongoose = require('mongoose');
const User = require('./userModel');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cant be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// middleware to populate the users and tours fields
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // .populate({
  //   path: 'tours',
  //   select: 'name photo',
  // });
  next();
});
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tours',
//     select: '-__v',
//   });
//   next();
// });

// creating function to change the dynamically averageRating of the tour based on reviewRating
reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].averageRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
  console.log(stats);
};
// using a index feature to set that only one review per one tour by any user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery()); //this created the instance of this.findOne that can be use in the POST
  console.log('this is  : ', this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); //this is not done here because query at this point is executed
  await this.r.constructor.calcAverageRating(this.r.tour);
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
