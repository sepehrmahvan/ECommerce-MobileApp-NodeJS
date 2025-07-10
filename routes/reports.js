const express = require("express");

const reportsController = require("../controllers/reports");

const router = express.Router();

router.post("/post-report/:bannerId", reportsController.reportBanner);

router.get("/get-reports", reportsController.getReports);

router.post("/reject-report/:reportId", reportsController.rejectReport);

module.exports = router;
