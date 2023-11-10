// models/dataModel.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    origin: String,
    destination: String,
    timestamp: Date,
    secret_key: String,
});

const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel;
