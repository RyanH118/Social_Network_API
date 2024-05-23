const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function (date) {
            return new Date(date).toLocaleString();
        }
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema]
});

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought