const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    // this is basically a foreign key which is getting its reference from the User.js model
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    user: {
        type: String,
        required: true
    },
    itemname: {
        type: String,
        required: true,
        minlength: 3
    },
    itemdescription: {
        type: String,
        required: true,
        minlength: 3
    },
    concerntype: {
        type: String,
        enum: ['lost', 'found'] // Specify the allowed values
    },
    location: { type: String },
    category: { type: String },
    status: { type: String, enum: ['reported', 'claimed', 'resolved'], default: 'reported' },
    isDeleted: { type: Boolean, default: false },

    images: [{ type: String }], // Array to store image paths
    date: {
        type: Date,
        // default: Date.now(),
        default: Date.now //This way, the date will be set when the document is created but won't update when the document is modified.
    }
}, { timestamps: true });

module.exports = new mongoose.model("Item", ItemSchema);
