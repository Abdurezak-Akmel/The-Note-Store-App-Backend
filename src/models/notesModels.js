import { query } from '../config/db.js';

/**
 * Create a new note.
 * @param {{title:string,content:string,user_id:string}} note
 * @returns {Promise<object>} inserted note row
 */
export async function createNote(note) {
	const text = `INSERT INTO "notes" (title, content, user_id) VALUES ($1,$2,$3) RETURNING *`;
	const values = [
		note.title,
		note.content,
		note.user_id,
	];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Read a note by id.
 * @param {string} note_id
 * @returns {Promise<object|null>}
 */
export async function readNoteById(note_id) {
	const text = `SELECT * FROM "notes" WHERE id = $1`;
	const res = await query(text, [note_id]);
	return res.rows[0] || null;
}

/**
 * Read all notes by user_id.
 * @param {string} user_id
 * @returns {Promise<object|null>} array of notes
 */
export async function readNotesByUserId(user_id) {
	const text = `SELECT * FROM "notes" WHERE user_id = $1`;
	const res = await query(text, [user_id]);
	return res.rows;
}

/**
 * Read all notes (simple list).
 * @returns {Promise<Array>} array of notes
 */
export async function readAllNotes() {
	const text = `SELECT * FROM "notes" ORDER BY id`;
	const res = await query(text);
	return res.rows;
}

// Not robust 
/**
 * Update a note by id. Only fields present in `updates` are changed.
 * @param {string} note_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateNoteById(note_id, updates) {
	const set = [];
	const values = [];
	let idx = 1;
	const allowed = [
		'title',
		'content',
	];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}
	if (set.length === 0) return readNoteById(note_id);

	const text = `UPDATE "notes" SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
	values.push(note_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a note by id.
 * @param {string} note_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteNoteById(note_id) {
	const text = `DELETE FROM "notes" WHERE id = $1`;
	const res = await query(text, [note_id]);
	return res.rowCount > 0;
}

export default {
	createNote,
	readNoteById,
	readNotesByUserId,
	readAllNotes,
	updateNoteById,
	deleteNoteById,
};

