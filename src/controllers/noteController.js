const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ owner: userId });
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNotebyId = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const note = new Note({ title, content, owner: userId });
    const saveNote = await note.save();
    res.status(201).json({ note: saveNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      { title, content },
      { new: true }
    );
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to you! " });
    }
    res.status(200).json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const existingNote = await Note.deleteOne({ _id: noteId, owner: userId });
    if (!existingNote) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to you! " });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const shareNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const noteId = req.params.id;
    const { username } = req.body;

    const existingNote = await Note.findOne({ _id: noteId, owner: userId });
    if (!existingNote) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to you! " });
    }

    const userToShareWith = await User.findOne({ username });
    if (!userToShareWith) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToShareWith._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    if (existingNote.sharedWith.includes(userToShareWith._id)) {
      return res
        .status(400)
        .json({ message: "Note already shared with this user" });
    }

    existingNote.sharedWith.push(userToShareWith._id);
    await existingNote.save();
    res.status(200).json({ message: "Note shared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const query = req.params.query;

    const notes = await Note.find({
      owner: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotes,
  getNotebyId,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
