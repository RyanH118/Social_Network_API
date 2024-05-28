const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getUsers(req, res) {
    try {
      const Users = await User.find()
        .populate("thoughts")
        .populate("friends")
        .select("-__v");
      return res.status(200).json(Users);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
// get single user by id
async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
       .populate("thoughts")
       .populate("friends")
       .select("-__v");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
// create a new user
async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json(newUser);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
// update a user
async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
// delete user (BONUS: and delete associated thoughts)
async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await Thought.deleteMany({ username: user.username });
      return res.status(200).json({ message: "User and associated thoughts deleted" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },
// add friend to friend list
async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};

module.exports = userController;