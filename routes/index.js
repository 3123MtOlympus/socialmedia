// routes/api/userRoutes.js
const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = new User({
      username,
      email
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.username = username;
      user.email = email;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE to remove user by its _id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      await user.remove();
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single thought by its _id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  const { thoughtText, username, userId } = req.body;
  try {
    const newThought = new Thought({
      thoughtText,
      username,
    });
    const savedThought = await newThought.save();
    const user = await User.findById(userId);
    if (user) {
      user.thoughts.push(savedThought._id);
      await user.save();
    }
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
  const { thoughtText } = req.body;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, { thoughtText }, { new: true });
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (deletedThought) {
      res.json({ message: 'Thought deleted successfully' });
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  const { reactionBody, username } = req.body;
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (thought) {
      thought.reactions.push({ reactionBody, username });
      const updatedThought = await thought.save();
      res.status(201).json(updatedThought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (thought) {
      thought.reactions = thought.reactions.filter(reaction => reaction.reactionId !== req.params.reactionId);
      const updatedThought = await thought.save();
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
