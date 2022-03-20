const mongoose = require('mongoose');

const fields = {
    url : {
        type : String
    },
    scrapeStatus : {
        type : String
    }
}

const schema = mongoose.Schema(fields, {timestamps: true});
const model = mongoose.model('ScrapeQueue', schema);

module.exports = model;