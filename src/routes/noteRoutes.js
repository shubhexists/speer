const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

router.use(authMiddleware.authenticateToken);

router
  .route("/notes")
  .get(noteController.getNotes)
  .post(noteController.createNote);
router
  .route("/notes/:id")
  .get(noteController.getNotebyId)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);
  
router.post("/notes/:id/share", noteController.shareNote);
router.get("/notes/search/:query", noteController.searchNotes);

module.exports = { router };
