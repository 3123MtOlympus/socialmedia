const router = require('express').Router();
const {
  getThoughts,
  getSingleThoughts,
  createThoughts,
  updateThoughts,
  deleteThoughts,
  addReactions,
  removeReactions,
} = require('../../controllers/appcontroller');

// /api/applications
router.route('/')
  .get(getThoughts)
  .post(createThoughts);

// /api/applications/:applicationId
router.route('/:thoughtId')
  .get(getSingleThoughts)
  .put(updateThoughts)
  .delete(deleteThoughts)
  .post(addReactions)
  .delete(removeReactions);

// /api/applications/:applicationId/tags
router.route('/:thoughtId/tags')
  .post(addTag);

// /api/applications/:applicationId/tags/:tagId
router.route('/:thoughtId/tags/:tagId')
  .delete(removeTag);

module.exports = router;
