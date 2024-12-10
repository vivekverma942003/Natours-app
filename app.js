/* eslint-disable spaced-comment */
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();
//server side rendering
app.set('view engine', 'pug'); //telling the express which render template to use in this case is pug
// pug is so common so we  need to install  it and but didnot need to require it
//now setting the view setting we previously define the Model controller now defining the VIew to complete our MVC architecture
app.set('views', path.join(__dirname, 'views'));
/// 1) MIDDLEWARE
// serving static file
// app.use(express.static(`${__dirname}/public`)); // for access static file
app.use(express.static(path.join(__dirname, 'public'))); // for access static file
//security miidleware
app.use(helmet());
// login into developer mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limmiter middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //allow 100 request in 1hour
  message: 'too many request this ip now please try again in a hour',
});
app.use('/api', limiter);
// body parser , reading data from body into req.body

app.use(express.json({ limit: '10kb' })); //middleWare
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
); //for parsing the data that come with url post request

/// DATA sanitization against noSql query injection
app.use(mongoSanitize());
/// DATA sanitization against XSS
app.use(xss());

//// avoiding parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//////////////////////////////////////////////////////////////////////
/////////// Creating our own middleWare function
app.use((req, res, next) => {
  console.log('hello from the middleware 😎');
  console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//////////////////////////////////////////////////////////////////////
// app.get('/', (req, res) => {
//   //   res.status(200).send('HEllo from the server');
//   res.status(200).json({ message: 'HEllo from the server', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('this is from end point');
// });
///////////////////////////////////////////////////////////////////////

// JSON.parse convert json into javaScript object
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

/// 2) ROUTE HANDLERS
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestAt: req.requestTime,
//     result: tours.length,
//     data: {
//       // tours: tours,
//       tours,
//     },
//   });
// };
// const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => {
//     return el.id === id;
//   });

//   //way to handle in valid id
//   /// solution 1;
//   // if (id > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'invalid id',
//   //   });
//   // }
//   /// solution 2;
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   // console.log(req.body);
//   const newId = tours[tours.length - 1].id + 1;
//   // res.send('success')
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<updated tour here>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'route is not yet defined',
//   });
// };
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'route is not yet defined',
//   });
// };
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'route is not yet defined',
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'route is not yet defined',
//   });
// };
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'route is not yet defined',
//   });
// };
/// ROUTEs

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// mounting of the router
// now i gonna use this routes from the different self generated file so below code are commented and is different file
// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
///////////////////////////////////////////////////////////////
//setting routes for pug template
// app.get('/', (req, res, next) => {
//   // this set the very first page of the (root page) according to the base (pug) template on the views folder
//   res.status(200).render('base', {
//     tour: 'Forest Hiker', // here tour and user is a variable that can be used in a pug file
//     user: 'ujjwal',
//   });
// });
// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'All Tour',
//   });
// });
// app.get('/tour', (req, res) => {
//   res.status(200).render('tour', {
//     title: 'The Forest Hiker Tour',
//   });
// });
///////////////////////////////////////////////////////////////////////////
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/review/', reviewRouter);

//// creating unhandle route handler .... code reach here when it cannot get the above routes

// app.all('*', (req, res, next) => {
//   // res.status(404).json({
//   //   status: 'not found',
//   //   message: `can't find the ${req.originalUrl}`,
//   // });

//   // err building
//   // const err = new Error(`can't find the ${req.originalUrl}`);
//   // err.status = 'fail';
//   // err.statusCode = 404;

//   // next(err);
//   // passing any thing in the next argument automatically treat as a error
// });

app.all('*', (req, res, next) => {
  next(new AppError(`can't find the ${req.originalUrl}`, 404));
});
//// Implementing the global error handling middleware

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
///// using the global error handler
app.use(globalErrorHandler);
/// START THE SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on a server ${port} ....`);
// }); //created a server
module.exports = app;
