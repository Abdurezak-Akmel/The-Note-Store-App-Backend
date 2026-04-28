import express from 'express';
import { 
    createNoteController, 
    readAllNotesController, 
    readNotesByUserIdController, 
    readNoteByNoteIdController, 
    updateNoteByNoteIdController, 
    deleteNoteByNoteIdController 
} from '../controllers/notesControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// User: Route to create note (POST /api/v1/notes)
router.post('/createNote', authenticate, createNoteController);
//Tested and Working

// Admin: Route to read all notes (GET /api/v1/notes/admin/notes)
router.get('/admin/notes', authenticate, requireAdmin, readAllNotesController);
//Tested and Working

// User: Route to read all authorized notes for a specific user (GET /api/v1/notes/user/:userId)
router.get('/user/:userId', authenticate, readNotesByUserIdController);
//Tested and Working

// User: Route to read a single note (GET /api/v1/notes/:noteId)
router.get('/:noteId', authenticate, readNoteByNoteIdController);

// User: Route to update a note (PATCH /api/v1/notes/:noteId)
router.patch('/:noteId', authenticate, updateNoteByNoteIdController);

// User: Route to delete note (DELETE /api/v1/notes/:noteId)
router.delete('/:noteId', authenticate, deleteNoteByNoteIdController);


export default router;
