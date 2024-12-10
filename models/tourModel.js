const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: [40, 'Name should be of max length of 40 char'],
      minLength: [10, 'Name should be of min length of 10 char'],
      // validate: [validator.isAlpha, 'tour name should only contain alphabet'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'max group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      // enum: ['easy', 'medium', 'difficult'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'difficulty must have one  of three value easy medium difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating should of atleast 1.0'],
      max: [5, 'rating should of atmost 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666-->46.666->47->4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // here this only point on the current document when creating document it doesnot work on the update
        validator: function (val) {
          return val < this.price;
        },
        message: 'price discount ({VALUE})must be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A summary is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'an image is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GEOJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //GEOJSON
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,// for embedding
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  /// for showing virtuals
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//////////////////////////////////////////////////////////
///////////// creating indexes
// tourSchema.index({ price: 1 }); // creating index on price field and if value is 1 mean ascending order and -1 mean in descending order
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//////////////////////////////////////////////////////////
////////// Creating Virtual properties
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});
// virtual populate
// foregin fields --> isme vo value jayegi jo Review wale model mai hai
// local fiels --> mai iski khud ki value rhegi

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (el) => await User.findById(el));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

// refrencing

///////////////////////////////////////////////////////////
/////////////// Middleware in the mongoose

///////// 1) Document middleware ..... it changes in te documented created it have two type pre and post hooks ... pre is for changing document when retrive and post is for changind document before saving

////////////// pre only work on 'save' and 'create'
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('this is  from after the pre middleware');
//   next();
// });

// ////// post
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

///////////////// 2) Query MiddleWare
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// }); // this work for find but donot work for findOne so there are two solution of this problem
// ///// 1) create a another query middleWare with findOne property
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();

////// 2) use regular expression that starts with find keyword
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//// middle ware to embedd refrence data
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -changedPasswordAt -passwordResetToken -passwordResetExpire',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query takes ${Date.now() - this.start} millisecond6+`);
  // console.log(docs);

  next();
});

////////////////////// 3) Aggretion middleware
// tourSchema.pre('aggregate', function (next) {
//   // console.log(this);
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
/////////////////////////////////////////////////////////

// eslint-disable-next-line new-cap
const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
