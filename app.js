const express = require('express');
const { request } = require('http');
const path = require('path');
const tourRouter = require('./routes/tourRouter');
const viewRouter = require('./routes/viewRouter');
const reviewRouter = require('./routes/reviewRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middlewares

// Serving Static Files
app.use(express.static(`${__dirname}/public`));

//Set Security HTTP headers Middleware
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
// const limiter = rateLimit({
//   max: 3,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour.',
// });
// app.use('/api', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSql query injection in email box like {"email": {"$gt" : ""}}.So token will be generated
// So for not to generate token we use data sanitization
app.use(mongoSanitize());
// Data Sanitization against XSS scripting attacks
app.use(xss());
// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty'],
  })
);

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// ERROR HANDLING FOR ALL NON EXIST END POINTS REQUEST BY ERROR HANDLING MIDDLEWARE
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // this will point to error middleware and not leave all middleware between this and error middleware.
  // });
});

app.use(globalErrorHandler);
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
module.exports = app;
