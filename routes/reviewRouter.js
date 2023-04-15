const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');
const { get } = require('mongoose');
const router = express.Router({ mergeParams: true });
//POST/tour/124fdsfg4/reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  // .post(tourController.checkBody, tourController.createTour
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user', 'admin'),reviewController.updateReview)
  .delete(authController.restrictTo('user', 'admin'),reviewController.deleteReview);
module.exports = router;
