const Banner = require("../models/banner");
const PendingBanner = require("../models/pendingBanner");

// get banners ----------------------------------------------------------------

exports.getBanners = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.query.userId;
    
    // گرفتن subCategory و cities از body
    const { subCategory: bodySubCategory, cities: bodyCities } = req.body;

    let query = {};
    
    // اگر subCategory در body وجود داشته باشد و خالی نباشد
    if (bodySubCategory !== undefined && bodySubCategory !== "") {
      query = {
        $or: [
          { mainCategory: bodySubCategory },
          { category: bodySubCategory },
          { subCategory: bodySubCategory }
        ]
      };
      
      // اگر cities هم وجود داشته باشد، به query اضافه کن
      if (bodyCities && Array.isArray(bodyCities) && bodyCities.length > 0) {
        query.city = { $in: bodyCities };
      }
    } else {
      // منطق جستجوی عادی یا برگرداندن همه بنرها
      if (searchQuery) {
        query = {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
          ],
        };
      }

      if (userId) {
        query.seller = userId;
      }
      
      // اگر cities در body وجود داشته باشد
      if (bodyCities && Array.isArray(bodyCities) && bodyCities.length > 0) {
        query.city = { $in: bodyCities };
      }
    }

    const totalBanners = await Banner.countDocuments(query);
    let banners;
    let pagination = null;

    // اگر هیچ بنری با فیلتر شهر تطابق نداشت، هیچ داده‌ای برنگردان
    if (totalBanners === 0 && bodyCities && Array.isArray(bodyCities) && bodyCities.length > 0) {
      return res.status(200).json({
        success: true,
        banners: [],
        pagination: null,
      });
    } else {
      if (totalBanners > limit) {
        banners = await Banner.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      } else {
        banners = await Banner.find(query).sort({ createdAt: -1 });
      }
      
      // همیشه pagination object ایجاد کن
      pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalBanners / limit),
        totalItems: totalBanners,
        itemsPerPage: limit,
      };
    }

    return res.status(200).json({
      success: true,
      banners: banners,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get banner by id ----------------------------------------------------------

exports.getBanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Баннер ёфт нашуд",
      });
    }

    return res.status(200).json({
      success: true,
      banner: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// create banner ----------------------------------------------------------------

exports.postBanner = async (req, res) => {
  try {
    const {
      title,
      description,
      mainCategory,
      category,
      subCategory,
      condition,
      city,
      images,
      createdAt,
      views,
      favorites,
      seller,
      fullPrice,
      features,
    } = req.body;

    const pendingBanner = new PendingBanner({
      title,
      description,
      mainCategory,
      category,
      subCategory,
      condition,
      city,
      images,
      createdAt,
      views,
      favorites,
      seller,
      fullPrice,
      features: {
        brand: features.brand || "",
        apartmentSize: features.apartmentSize || null,
        rooms: features.rooms || null,
        bathrooms: features.bathrooms || null,
        yearBuilt: features.yearBuilt || null,
        parking: features.parking || null,
        furnished: features.furnished || null,
        balcony: features.balcony || null,
        storage: features.storage || null,
        elevator: features.elevator || null,
        floorMaterial: features.floorMaterial || "",
        bathroomType: features.bathroomType || "",
        apartmentDirection: features.apartmentDirection || "",
        oneMeterPrice: features.oneMeterPrice || null,
        normalDaysRentPrice: features.normalDaysRentPrice || null,
        holidayDaysRentPrice: features.holidayDaysRentPrice || null,
        mileage: features.mileage || null,
        vehicleYear: features.vehicleYear || null,
        color: features.color || "",
        vehicleModel: features.vehicleModel || "",
        insuranceLeft: features.insuranceLeft || null,
        gearbox: features.gearbox || "",
        fuelType: features.fuelType || "",
        engineHealth: features.engineHealth || "",
        chassisCondition: features.chassisCondition || "",
        bodyCondition: features.bodyCondition || "",
        healthStatus: features.healthStatus || "",
        originality: features.originality || "",
        internalMemory: features.internalMemory || "",
        ram: features.ram || "",
        electronicsColor: features.electronicsColor || "",
        mobileOs: features.mobileOs || "",
        cpu: features.cpu || "",
        screenSize: features.screenSize || null,
        lanPortNumbers: features.lanPortNumbers || null,
        modemType: features.modemType || "",
        tvSize: features.tvSize || null,
        tvOs: features.tvOs || "",
        furnitureType: features.furnitureType || "",
        furnitureColor: features.furnitureColor || "",
        furnitureMaterial: features.furnitureMaterial || "",
        furnitureCoverType: features.furnitureCoverType || "",
        numberOfSeats: features.numberOfSeats || null,
        lampshadeMaterial: features.lampshadeMaterial || "",
        lampshadeNumberOfBranches: features.lampshadeNumberOfBranches || null,
        carpetMaterial: features.carpetMaterial || "",
        carpetTexture: features.carpetTexture || "",
        carpetColor: features.carpetColor || "",
        carpetWidth: features.carpetWidth || null,
        carpetLength: features.carpetLength || null,
        expertise: features.expertise || "",
        serviceHoursFrom: features.serviceHoursFrom || null,
        serviceHoursTo: features.serviceHoursTo || null,
        personalGender: features.personalGender || "",
        personalType: features.personalType || "",
        personalMaterial: features.personalMaterial || "",
        cooperationType: features.cooperationType || "",
        workExperience: features.workExperience || null,
        workHoursFrom: features.workHoursFrom || null,
        workHoursTo: features.workHoursTo || null,
        paymentPeriod: features.paymentPeriod || "",
        jobType: features.jobType || "",
      },
    });

    await pendingBanner.save();

    return res.status(201).json({
      success: true,
      message: "Баннер барои тасдиқ пешниҳод шуд",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// get user banners ------------------------------------------------------------

exports.getUserBanners = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Рақами корбар ҳатмист"
      });
    }

    const query = { "seller.userId": userId };
    const banners = await Banner.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      banners: banners
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get pending banners ------------------------------------------------------------

exports.getPendingBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPendingBanners = await PendingBanner.countDocuments();
    let pendingBanners;
    let pagination = null;

    if (totalPendingBanners > limit) {
      pendingBanners = await PendingBanner.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalPendingBanners / limit),
        totalItems: totalPendingBanners,
        itemsPerPage: limit,
      };
    } else {
      pendingBanners = await PendingBanner.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      pendingBanners: pendingBanners,
      pagination: pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// approve banner ------------------------------------------------------------

exports.approveBanner = async (req, res) => {
  try {
    const pendingBannerId = req.params.pendingBannerId;
    const pendingBanner = await PendingBanner.findById(pendingBannerId);

    if (!pendingBanner) {
      return res.status(404).json({
        success: false,
        message: "Pending banner not found",
      });
    }

    // Create new banner from pending banner
    const banner = new Banner(pendingBanner.toObject());
    await banner.save();

    // Delete the pending banner
    await PendingBanner.findByIdAndDelete(pendingBannerId);

    return res.status(200).json({
      success: true,
      message: "Banner approved and published",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// reject banner ------------------------------------------------------------

exports.rejectBanner = async (req, res) => {
  try {
    const pendingBannerId = req.params.pendingBannerId;
    const pendingBanner = await PendingBanner.findById(pendingBannerId);

    if (!pendingBanner) {
      return res.status(404).json({
        success: false,
        message: "Pending banner not found",
      });
    }

    await PendingBanner.findByIdAndDelete(pendingBannerId);

    return res.status(200).json({
      success: true,
      message: "Banner rejected and deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
