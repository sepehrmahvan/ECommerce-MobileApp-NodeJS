const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    mainCategory: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: false,
    },
    condition: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    images: [{ url: String }],
    views: {
        type: Number,
        required: false,
        default: 0
    },
    favorites: {
        type: Number,
        required: false,
        default: 0
    },
    seller: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,   
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
    },
    fullPrice: {
        type: Number,
        required: false,
    },
    features: {
        brand: {
            type: String,
            required: false,
        },
        // Dynamic features based on category
        // for sell real estate
        apartmentSize: {
            type: Number,
            required: false,
        },
        rooms: {
            type: Number,
            required: false,
        },
        bathrooms: {
            type: Number,
            required: false,
        },
        yearBuilt: {
            type: Number,
            required: false,
        },
        parking: {
            type: Boolean,
            required: false,
        },
        furnished: {
            type: Boolean,
            required: false,
        },
        balcony: {
            type: Boolean,
            required: false,
        },
        storage: {
            type: Boolean,
            required: false,
        },
        elevator: {
            type: Boolean,
            required: false,
        },
        floorMaterial: {
            type: String,
            required: false,
        },
        bathroomType: {
            type: String,
            required: false,
        },
        apartmentDirection: {
            type: String,
            required: false,
        },
        oneMeterPrice: {
            type: Number,
            required: false,
        },
        // for rent real estate
        // for short term rent
        normalDaysRentPrice: {
            type: Number,
            required: false,
        },
        holidayDaysRentPrice: {
            type: Number,
            required: false,
        },
        // For sell vehicles:
        mileage: {
            type: Number,
            required: false,
        },
        vehicleYear: {
            type: Number,
            required: false,
        },
        color: {
            type: String,
            required: false,
        },
        vehicleModel: {
            type: String,
            required: false,
        },
        insuranceLeft: {
            type: Number,
            required: false,
        },
        gearbox: {
            type: String,
            required: false,
        },
        fuelType: {
            type: String,
            required: false,
        },
        engineHealth: {
            type: String,
            required: false,
        },
        chassisCondition: {
            type: String,
            required: false,
        },
        bodyCondition: {
            type: String,
            required: false,
        },
        // For electronics:
        // mobile phones
        healthStatus: {
            type: String,
            required: false,
        },
        originality: {
            type: String,
            required: false,
        },
        internalMemory: {
            type: String,
            required: false,
        },
        ram: {
            type: String,
            required: false,
        },
        electronicsColor: {
            type: String,
            required: false,
        },
        mobileOs: {
            type: String,
            required: false,
        },
        // camputer and laptops
        cpu: {
            type: String,
            required: false,
        },
        screenSize: {
            type: Number,
            required: false,
        },
        // network and modems
        lanPortNumber: {
            type: Number,
            required: false,
        },
        modemType: {
            type: String,
            required: false,
        },
        // electronics-home-appliances
        tvSize: {
            type: Number,
            required: false,
        },
        tvOs: {
            type: String,
            required: false,
        },
        // home furniture
        furnitureType: {
            type: String,
            required: false,
        },
        furnitureColor: {
            type: String,
            required: false,
        },
        furnitureMaterial: {
            type: String,
            required: false,
        },
        furnitureCoverType: {
            type: String,
            required: false,
        },
        numberOfSeats: {
            type: Number,
            required: false,
        },
        // lampshade
        lampshadeMaterial: {
            type: String,
            required: false,
        },
        lampshadeNumberOfBranches: {
            type: Number,
            required: false,
        },
        // carpets
        carpetMaterial: {
            type: String,
            required: false,
        },
        carpetTexture: {
            type: String,
            required: false,
        },
        carpetColor: {
            type: String,
            required: false,
        },
        carpetWidth: {
            type: Number,
            required: false,
        },
        carpetLength: {
            type: Number,
            required: false,
        },
        // services
        expertise: {
            type: String,
            required: false,
        },
        serviceHoursFrom: {
            type: Number,
            required: false,
        },
        serviceHoursTo: {
            type: Number,
            required: false,
        },
        // bag, shoes, belt
        personalGender: {
            type: String,
            required: false,
        },
        personalType: {
            type: String,
            required: false,
        },
        // accessory
        personalMaterial: {
            type: String,
            required: false,
        },
        // hire
        cooperationType: {
            type: String,
            required: false,
        },
        workExperience: {
            type: Number,
            required: false,
        },
        workHoursFrom: {
            type: Number,
            required: false,
        },
        workHoursTo: {
            type: Number,
            required: false,
        },
        paymentPeriod: {
            type: String,
            required: false,
        },
        jobType: {
            type: String,
            required: false,
        },
    },
}, {
    timestamps: true,
    _id: true
});

// Drop all existing indexes
bannerSchema.indexes().forEach(index => {
    bannerSchema.index(index[0], { unique: false });
});

// Create a new model with a different collection name
const Banner = mongoose.model('Banner', bannerSchema, 'banners_new');

module.exports = Banner;
