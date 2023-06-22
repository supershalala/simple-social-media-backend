const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get single thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

// create new thought
createThought({ body }, res) {
  Thought.create(body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
},


  // update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

// delete thought by id
deleteThought({ params }, res) {
  Thought.findOneAndDelete({ _id: params.id })
    .then(deletedThought => {
      if (!deletedThought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      // Remove thought id from associated user's thoughts array
      return User.findOneAndUpdate(
        { thoughts: params.id },
        { $pull: { thoughts: params.id } },
        { new: true }
      );
    })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this thought!' });
      }
      res.json({ message: 'Thought deleted successfully' });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
},


  // create reaction for thought
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // delete reaction from thought
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports = thoughtController;
