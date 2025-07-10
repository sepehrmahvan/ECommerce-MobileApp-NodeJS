const express = require('express');
const isAuth = require('../middlewares/auth');

const feedController = require('../controllers/feed');


const router = express.Router();


router.post('/get-banners', feedController.getBanners);

router.post('/create-banner', isAuth , feedController.postBanner);

router.get('/get-banner/:bannerId', feedController.getBanner);

router.get('/user-banners/:userId', isAuth, feedController.getUserBanners);

router.get("/pending", feedController.getPendingBanners);

router.post("/pending/approve/:pendingBannerId", feedController.approveBanner);

router.post("/pending/reject/:pendingBannerId", feedController.rejectBanner);

module.exports = router;
