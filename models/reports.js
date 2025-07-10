const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reportType: {
        type: String,
        required: true,
    },
    bannerId: {
        type: Schema.Types.ObjectId,
        ref: 'Banner',
        required: true,
    },
}, {
    timestamps: true,
    _id: true
});

module.exports = mongoose.model('Report', ReportSchema);