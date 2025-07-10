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
    const {
      subCategory: bodySubCategory,
      cities: bodyCities,
      condition,
      priceFrom,
      priceTo,
      bannerWithImages,
      sortBy,
      brand,
      houseSizeFrom,
      houseSizeTo,
      houseAgeFrom,
      houseAgeTo,
      roomsNumbers,
      parking,
      elevator,
      balcony,
      storage,
      carAgeFrom,
      carAgeTo,
      pickedColors,
      mileageFrom,
      mileageTo,
      bodyCondition,
      chassisCondition,
      engineHealth,
      gearBox,
      fuelType,
      originality,
      internalMemory,
      screenSize,
      tvSize,
      numberOfSeats,
      carpetWidth,
      carpetLength,
      personalGender,
      cooperationType,
      paymentPeriod,
      jobType,
    } = req.body;

    let query = {};

    // اگر جستجو وجود داشته باشد، فقط جستجو را اعمال کن و فیلترها را نادیده بگیر
    if (searchQuery) {
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      };
    } else {
      // اگر جستجو نباشد، فیلترها را اعمال کن

      // اگر subCategory در body وجود داشته باشد و خالی نباشد
      if (bodySubCategory !== undefined && bodySubCategory !== "") {
        query.$or = [
          { mainCategory: bodySubCategory },
          { category: bodySubCategory },
          { subCategory: bodySubCategory },
        ];
      }

      // اگر userId وجود داشته باشد
      if (userId) {
        query.seller = userId;
      }

      // اگر cities در body وجود داشته باشد
      if (bodyCities && Array.isArray(bodyCities) && bodyCities.length > 0) {
        query.city = { $in: bodyCities };
      }

      // اگر condition در body وجود داشته باشد و خالی نباشد
      if (condition !== undefined && condition !== "") {
        query.condition = { $regex: condition, $options: "i" };
      }

      // فیلتر قیمت
      if (
        (priceFrom !== undefined && priceFrom !== "") ||
        (priceTo !== undefined && priceTo !== "")
      ) {
        query.fullPrice = {};

        // اگر priceFrom وجود داشته باشد
        if (priceFrom !== undefined && priceFrom !== "") {
          query.fullPrice.$gte = parseFloat(priceFrom);
        }

        // اگر priceTo وجود داشته باشد
        if (priceTo !== undefined && priceTo !== "") {
          query.fullPrice.$lte = parseFloat(priceTo);
        }
      }

      // اگر bannerWithImages در body وجود داشته باشد و true باشد
      if (bannerWithImages === true) {
        query.$expr = { $gt: [{ $size: "$images" }, 0] };
      }

      // اگر brand در body وجود داشته باشد
      if (brand !== undefined && brand !== "") {
        query["features.brand"] = { $regex: brand, $options: "i" };
      }

      // اگر houseSizeFrom در body وجود داشته باشد
      if (houseSizeFrom !== undefined && houseSizeFrom !== "") {
        const houseSizeFromNum = parseFloat(houseSizeFrom);
        if (!isNaN(houseSizeFromNum)) {
          if (!query["features.apartmentSize"]) {
            query["features.apartmentSize"] = {};
          }
          query["features.apartmentSize"].$gte = houseSizeFromNum;
        }
      }

      // اگر houseSizeTo در body وجود داشته باشد
      if (houseSizeTo !== undefined && houseSizeTo !== "") {
        const houseSizeToNum = parseFloat(houseSizeTo);
        if (!isNaN(houseSizeToNum)) {
          if (!query["features.apartmentSize"]) {
            query["features.apartmentSize"] = {};
          }
          query["features.apartmentSize"].$lte = houseSizeToNum;
        }
      }

      // اگر houseAgeFrom در body وجود داشته باشد
      if (houseAgeFrom !== undefined && houseAgeFrom !== "") {
        const houseAgeFromNum = parseFloat(houseAgeFrom);
        if (!isNaN(houseAgeFromNum)) {
          if (!query["features.yearBuilt"]) {
            query["features.yearBuilt"] = {};
          }
          query["features.yearBuilt"].$gte = houseAgeFromNum;
        }
      }

      // اگر houseAgeTo در body وجود داشته باشد
      if (houseAgeTo !== undefined && houseAgeTo !== "") {
        const houseAgeToNum = parseFloat(houseAgeTo);
        if (!isNaN(houseAgeToNum)) {
          if (!query["features.yearBuilt"]) {
            query["features.yearBuilt"] = {};
          }
          query["features.yearBuilt"].$lte = houseAgeToNum;
        }
      }

      // اگر roomsNumbers در body وجود داشته باشد
      if (roomsNumbers !== undefined && roomsNumbers !== "") {
        const roomsNumbersNum = parseFloat(roomsNumbers);
        if (!isNaN(roomsNumbersNum)) {
          if (roomsNumbersNum >= 4) {
            // اگر تعداد اتاق 4 یا بیشتر باشد، نمایش اتاق‌هایی با تعداد برابر یا بیشتر
            query["features.rooms"] = { $gte: roomsNumbersNum };
          } else {
            // اگر تعداد اتاق کمتر از 4 باشد، فقط نمایش اتاق‌هایی با تعداد دقیق
            query["features.rooms"] = roomsNumbersNum;
          }
        }
      }

      // اگر parking در body وجود داشته باشد
      if (parking === true) {
        query["features.parking"] = true;
      }

      // اگر elevator در body وجود داشته باشد
      if (elevator === true) {
        query["features.elevator"] = true;
      }

      // اگر balcony در body وجود داشته باشد
      if (balcony === true) {
        query["features.balcony"] = true;
      }

      // اگر storage در body وجود داشته باشد
      if (storage === true) {
        query["features.storage"] = true;
      }

      // فیلتر سن خودرو
      if (
        (carAgeFrom !== undefined && carAgeFrom !== "") ||
        (carAgeTo !== undefined && carAgeTo !== "")
      ) {
        query["features.vehicleYear"] = {};

        if (carAgeFrom !== undefined && carAgeFrom !== "") {
          const carAgeFromNum = parseFloat(carAgeFrom);
          if (!isNaN(carAgeFromNum)) {
            query["features.vehicleYear"].$gte = carAgeFromNum;
          }
        }

        if (carAgeTo !== undefined && carAgeTo !== "") {
          const carAgeToNum = parseFloat(carAgeTo);
          if (!isNaN(carAgeToNum)) {
            query["features.vehicleYear"].$lte = carAgeToNum;
          }
        }
      }

      // اگر pickedColors در body وجود داشته باشد
      if (pickedColors !== undefined && pickedColors.length > 0) {
        query["features.color"] = { $in: pickedColors };
      }

      // اگر mileageFrom در body وجود داشته باشد
      if (mileageFrom !== undefined && mileageFrom !== "") {
        const mileageFromNum = parseFloat(mileageFrom);
        if (!isNaN(mileageFromNum)) {
          if (!query["features.mileage"]) {
            query["features.mileage"] = {};
          }
          query["features.mileage"].$gte = mileageFromNum;
        }
      }

      // اگر mileageTo در body وجود داشته باشد
      if (mileageTo !== undefined && mileageTo !== "") {
        const mileageToNum = parseFloat(mileageTo);
        if (!isNaN(mileageToNum)) {
          if (!query["features.mileage"]) {
            query["features.mileage"] = {};
          }
          query["features.mileage"].$lte = mileageToNum;
        }
      }

      // اگر bodyCondition در body وجود داشته باشد
      if (bodyCondition !== undefined && bodyCondition !== "") {
        query["features.bodyCondition"] = {
          $regex: bodyCondition,
          $options: "i",
        };
      }

      if (chassisCondition !== undefined && chassisCondition !== "") {
        query["features.chassisCondition"] = {
          $regex: chassisCondition,
          $options: "i",
        };
      }

      if (engineHealth !== undefined && engineHealth !== "") {
        query["features.engineHealth"] = {
          $regex: engineHealth,
          $options: "i",
        };
      }

      if (gearBox !== undefined && gearBox !== "") {
        query["features.gearbox"] = { $regex: gearBox, $options: "i" };
      }

      if (fuelType !== undefined && fuelType !== "") {
        query["features.fuelType"] = { $regex: fuelType, $options: "i" };
      }

      if (originality !== undefined && originality !== "") {
        query["features.originality"] = { $regex: originality, $options: "i" };
      }

      if (internalMemory !== undefined && internalMemory !== "") {
        query["features.internalMemory"] = {
          $regex: internalMemory,
          $options: "i",
        };
      }

      if (screenSize !== undefined && screenSize !== null) {
        const screenSizeNum = parseFloat(screenSize);
        if (!isNaN(screenSizeNum)) {
          query["features.screenSize"] = screenSizeNum;
        }
      }

      if(tvSize !== undefined && tvSize !== null) {
        const tvSizeNum = parseFloat(tvSize);
        if (!isNaN(tvSizeNum)) {
          query["features.tvSize"] = tvSizeNum;
        }
      }

      if (numberOfSeats !== undefined && numberOfSeats !== null) {
        const numberOfSeatsNum = parseFloat(numberOfSeats);
        if (!isNaN(numberOfSeatsNum)) {
          query["features.numberOfSeats"] = numberOfSeatsNum;
        }
      }

      if (carpetWidth !== undefined && carpetWidth !== null) {
        const carpetWidthNum = parseFloat(carpetWidth);
        if (!isNaN(carpetWidthNum)) {
          query["features.carpetWidth"] = carpetWidthNum;
        }
      }

      if (carpetLength !== undefined && carpetLength !== null) {
        const carpetLengthNum = parseFloat(carpetLength);
        if (!isNaN(carpetLengthNum)) {
          query["features.carpetLength"] = carpetLengthNum;
        }
      }

      if (personalGender !== undefined && personalGender !== "") {
        query["features.personalGender"] = {
          $regex: personalGender,
          $options: "i",
        };
      }

      if (cooperationType !== undefined && cooperationType !== "") {
        query["features.cooperationType"] = {
          $regex: cooperationType,
          $options: "i",
        };
      }

      if (paymentPeriod !== undefined && paymentPeriod !== "") {
        query["features.paymentPeriod"] = {
          $regex: paymentPeriod,
          $options: "i",
        };
      }

      if (jobType !== undefined && jobType !== "") {
        query["features.jobType"] = {
          $regex: jobType,
          $options: "i",
        };
      }
    }

    const totalBanners = await Banner.countDocuments(query);
    let banners;
    let pagination = null;

    // تعریف sort options بر اساس sortBy
    let sortOption = { createdAt: -1 }; // پیش‌فرض: جدیدترین
    if (sortBy) {
      switch (sortBy) {
        case "Навтарин":
          sortOption = { createdAt: -1 }; // جدیدترین
          break;
        case "Арзонтарин":
          sortOption = { fullPrice: 1 }; // ارزان‌ترین
          break;
        case "Гаронтарин":
          sortOption = { fullPrice: -1 }; // گران‌ترین
          break;
        default:
          sortOption = { createdAt: -1 }; // پیش‌فرض
      }
    }

    // اگر هیچ بنری با فیلتر شهر تطابق نداشت، هیچ داده‌ای برنگردان
    if (
      totalBanners === 0 &&
      bodyCities &&
      Array.isArray(bodyCities) &&
      bodyCities.length > 0 &&
      !searchQuery
    ) {
      return res.status(200).json({
        success: true,
        banners: [],
        pagination: null,
      });
    } else {
      if (totalBanners > limit) {
        banners = await Banner.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(limit);
      } else {
        banners = await Banner.find(query).sort(sortOption);
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
        message: "Рақами корбар ҳатмист",
      });
    }

    const query = { "seller.userId": userId };
    const banners = await Banner.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      banners: banners,
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
