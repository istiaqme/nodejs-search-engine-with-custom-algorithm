const mongoose = require('mongoose');

const fields = {
    url : {
        type : String
    },
    title : {
        type : String
    },
    keywords : {
        type : Array
    },
    description : {
        type : String
    },
    headings : {
        type : Array
    },
    paragraphs : {
        type : Array
    },
    listItems : {
        type : Array
    },
    anchors : {
        type : Array
    },
    images : {
        type : Array
    }
}

const schema = mongoose.Schema(fields, {timestamps: true});
const model = mongoose.model('Webpage', schema);

module.exports = model;