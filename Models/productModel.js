const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true,
        unique : true
    },
    productCode : {
        type : String,
        required : true,
        unique : true
    },
    manufacturer : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        default : 0.0,
        required : true
    },
    stock : {
        type : Number,
    },
    productImage : {
        type : String,
        data : Buffer
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;