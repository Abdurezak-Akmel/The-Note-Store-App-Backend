import { query } from '../config/db.js';

/**
 * Create a new user.
 * @param {{email:string,password:string,role:string}} user
 * @returns {Promise<object>} inserted user row
 */
export async function createUser(user) {
	const text = `INSERT INTO "users" (email, password_hash, role) VALUES ($1,$2,$3) RETURNING *`;
	const values = [
		user.email,
		user.password_hash,
		user.role,
	];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get a user by user id.
 * @param {number} user_id
 * @returns {Promise<object|null>}
 */
export async function readUserByUserId(user_id) {
	const text = `SELECT * FROM "users" WHERE id = $1`;
	const res = await query(text, [user_id]);
	return res.rows[0] || null;
}

/**
 * Get a user by email.
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function readUserByEmail(email) {
	const text = `SELECT * FROM "users" WHERE email = $1`;
	const res = await query(text, [email]);
	return res.rows[0] || null;
}

/**
 * Get all users (simple list).
 * @returns {Promise<Array>} array of users
 */
export async function readAllUsers() {
	const text = `SELECT * FROM "users" ORDER BY id`;
	const res = await query(text);
	return res.rows;
}

// Not robust 
/**
 * Update a user by id. Only fields present in `updates` are changed.
 * @param {number} user_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateUserById(user_id, updates) {
	const set = [];
	const values = [];
	let idx = 1;
	const allowed = [
		'email',
		'password_hash',
		'role',
	];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}
	if (set.length === 0) return readUserByUserId(user_id);

	const text = `UPDATE "users" SET ${set.join(', ')} WHERE id = $${idx} RETURNING *`;
	values.push(user_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a user by id.
 * @param {string} user_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteUserById(user_id) {
	const text = `DELETE FROM "users" WHERE id = $1`;
	const res = await query(text, [user_id]);
	return res.rowCount > 0;
}

export default {
	createUser,
	readUserByUserId,
	readUserByEmail,
	readAllUsers,
	updateUserById,
	deleteUserById,
};

