import {
    createNote,
    readNoteById,
    readNotesByUserId,
    readAllNotes,
    updateNoteById,
    deleteNoteById
} from '../models/notesModels.js';

/**
 * User controller: to create note.
 */
export async function createNoteController(req, res) {
    try {
        const { title, content } = req.body;
        const user_id = req.user.user_id;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const note = await createNote({ title, content, user_id });
        return res.status(201).json({ success: true, message: 'Note created', data: note });
    } catch (err) {
        console.error('createNote error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * Admin controller: to read all notes.
 */
export async function readAllNotesController(req, res) {
    try {
        const notes = await readAllNotes();
        return res.json({ success: true, data: notes });
    } catch (err) {
        console.error('readAllNotes error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * User controller: to read authorized notes.
 */
export async function readNotesByUserIdController(req, res) {
    try {
        const { userId } = req.params;

        // Safety check: Only allow users to see their own notes unless they are an admin
        if (userId !== req.user.user_id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Unauthorized access to user notes' });
        }

        const notes = await readNotesByUserId(userId);
        return res.json({ success: true, data: notes });
    } catch (err) {
        console.error('readNotesByUserId error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * User controller: to readd a single note.
 */
export async function readNoteByNoteIdController(req, res) {
    try {
        const { noteId } = req.params;
        const note = await readNoteById(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        return res.json({ success: true, data: note });
    } catch (err) {
        console.error('readNoteByNoteId error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * User controller: to update a note.
 */
export async function updateNoteByNoteIdController(req, res) {
    try {
        const { noteId } = req.params;
        const updates = req.body;

        const noteToUpdate = await readNoteById(noteId);
        if (!noteToUpdate) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        // Ownership check
        if (noteToUpdate.user_id !== req.user.user_id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const note = await updateNoteById(noteId, updates);

        return res.json({ success: true, data: note });
    } catch (err) {
        console.error('updateNoteByNoteId error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * User controller: delete a note.
 */
export async function deleteNoteByNoteIdController(req, res) {
    try {
        const { noteId } = req.params;
        const noteToDelete = await readNoteById(noteId);
        if (!noteToDelete) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        // Ownership check
        if (noteToDelete.user_id !== req.user.user_id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const ok = await deleteNoteById(noteId);

        return res.json({ success: true, message: 'Note deleted successfully' });
    } catch (err) {
        console.error('deleteNoteByNoteId error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default {
    createNoteController,
    readAllNotesController,
    readNotesByUserIdController,
    readNoteByNoteIdController,
    updateNoteByNoteIdController,
    deleteNoteByNoteIdController
};
