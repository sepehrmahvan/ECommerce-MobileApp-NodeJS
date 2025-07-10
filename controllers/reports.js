const Report = require("../models/reports");
const Banner = require("../models/banner");

// report banner --------------------------------------------------------------
exports.reportBanner = async (req, res) => {
    const bannerId = req.params.bannerId;
    const { reportType } = req.body;

  try {
    // Check if banner exists
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Баннер ёфт нашуд",
      });
    }

    // Create new report
    const reportData = {
      reportType,
      bannerId
    };

    const report = new Report(reportData);
    await report.save();

    return res.status(201).json({
      success: true,
      message: "Репорт бо муваффақият пешниҳод шуд ва аз ҷониби маъмур баррасӣ хоҳад шуд",
    });

  } catch (error) {
    console.error('Error in reportBanner:', error);
    return res.status(500).json({
      success: false,
      message: "Хатои дохилии сервер",
      error: error.message
    });
  }
};

// get reports --------------------------------------------------------------
exports.getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const reports = await Report.find()
      .populate('bannerId')
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalReports = await Report.countDocuments();
    const totalPages = Math.ceil(totalReports / perPage);
    
    return res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalReports: totalReports,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error in getReports:', error);
    return res.status(500).json({
      success: false,
      message: "Хатои дохилии сервер",
      error: error.message
    });
  }
};

// reject report --------------------------------------------------------------
exports.rejectReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Репорт ёфт нашуд",
      });
    }

    await Report.findByIdAndDelete(reportId);

    return res.status(200).json({
      success: true,
      message: "Репорт бо муваффақият рад карда шуд",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Хатои дохилии сервер",
    });
  }
};

