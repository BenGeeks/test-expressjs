const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const startSchema = new Schema({
  date: { type: String, required: true },
  value: { type: Number, required: true },
});

module.exports = mongoose.model('Start', startSchema);
