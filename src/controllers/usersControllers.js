import { readAllUsers, deleteUserById } from '../models/usersModels.js';

/**
 * Admin controller: return all users.
 */
export async function readAllUsersController(req, res) {
	try {
		const users = await readAllUsers();
		// Remove sensitive fields from response
		const safe = users.map(u => {
			const { password_hash, ...rest } = u || {};
			return rest;
		});
		return res.json({ success: true, users: safe });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('readAllUsersController error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

/**
 * Admin controller: delete a user.
 */
export async function deleteUserByIdController(req, res) {
	try {
		const userId = req.params.userId;

		// Optional: Simple UUID v4 validation regex
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(userId)) {
			return res.status(400).json({ success: false, message: 'Invalid user UUID' });
		}

		const ok = await deleteUserById(userId);
		if (!ok) return res.status(404).json({ success: false, message: 'User not found' });

		return res.json({ success: true, message: 'User deleted' });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('deleteUser error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export default { readAllUsersController, deleteUserByIdController };