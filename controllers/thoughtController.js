const { User, Thought } = require("../models");

const thoughtController = {
    // Get all thoughts
    getThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find();
            return res.status(200).json(thoughts);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Get single Thought by ID
    getSingleThought: async (req, res) => {
        try {
            const thought = await Thought.findOne(
                {
                    _id: req.params.thoughtId
                });
            if (!thought) return res.status(404).json({ message: 'Thought not found' });

            return res.status(200).json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Create a new thought
    createThought: async (req, res) => {
        try {
            const newThought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: newThought._id } },
                { new: true }
            );

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Thought created" });
            }

            return res.status(200).json(newThought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Update thought
    updateThought: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true });

            if (!thought) return res.status(404).json({ message: 'Thought not found' });

            return res.status(200).json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Delete thought
    deleteThought: async (req, res) => {
        try {
            const thought = await Thought.findOneAndDelete(
                {
                    _id: req.params.thoughtId
                });

            if (!thought) return res.status(404).json({ message: 'Thought not found' });

            return res.status(200).json({ message: 'Thought deleted successfully' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Add reaction to thought
    addReaction: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true }
            );

            if (!thought) return res.status(404).json({ message: 'Thought not found' });

            return res.status(200).json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Remove reaction to thought
    removeReaction: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { new: true }
            );

            if (!thought) return res.status(404).json({ message: 'Thought not found' });

            return res.status(200).json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
}

module.exports = thoughtController;