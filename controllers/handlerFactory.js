const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIfeatures = require('./../utils/apiFeatures');
// created a function that delete something in database and now we can call this function in any controller this reduce the too much writing of the same code
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
// in this deleteOne i just uses the deleteTour method template
//similarily now creating the update factory handler
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
// similarily creating the cretae one funciton to create anything
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newDoc,
      },
    });
  });
exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params);
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate('reviews');
    if (!doc) {
      return next(new AppError('no document find with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //for just nested get routes
    let filter = {};
    if (req.params.tourId) filter = { tours: req.params.tourId };
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    //executing the query
    const doc = await features.query;
    // const doc = await features.query.explain(); //explain give the statistically knowledge of the result

    // send response
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      result: doc.length,
      data: {
        // doc: doc,
        doc,
      },
    });
  });
