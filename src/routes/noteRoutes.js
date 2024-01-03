const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

router.use(authMiddleware.authenticateToken);

router
  .get("/notes", noteController.getNotes)
  .post("/notes", noteController.createNote);
router
  .get("/notes/:id", noteController.getNotebyId)
  .put("/notes/:id", noteController.updateNote)
  .delete("/notes/:id", noteController.deleteNote);
router.post("/notes/:id/share", noteController.shareNote);
router.get("/notes/search/:query", noteController.searchNotes);

module.exports = router;
