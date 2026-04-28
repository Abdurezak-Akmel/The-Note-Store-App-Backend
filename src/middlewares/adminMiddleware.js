// Admin middleware: ensures the authenticated user has admin privileges.
// By default this checks for `role_id === 1`, but the admin role id
// can be overridden with the `ADMIN_ROLE_ID` env var.
export function requireAdmin(req, res, next) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

		const adminRole = process.env.ADMIN_ROLE ? process.env.ADMIN_ROLE : 'ADMIN';
		if (typeof user.role === 'undefined' || user.role === null) {
			return res.status(403).json({ success: false, message: 'Admin access required' });
		}

		if (user.role !== adminRole) {
			return res.status(403).json({ success: false, message: 'Admin access required' });
		}

		return next();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('requireAdmin middleware error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export default { requireAdmin };
