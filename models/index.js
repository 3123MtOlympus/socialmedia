const mongoose = require('mongoose');
const { Schema } = mongoose;

const thoughtSchema = new Schema({
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;