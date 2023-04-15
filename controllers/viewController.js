const Tour = require('../model/tourModel');
const catchAsync = require('.././catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build template
  // 3.
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async(req, res) => {
    // 1. get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    // 2. Build template
    // 3/ Render template using data from 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your Account'
  })
}