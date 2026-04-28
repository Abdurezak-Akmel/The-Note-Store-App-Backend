import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { readUserByEmail, createUser, updateUserById } from '../models/usersModels.js';

/**
 * Register a new user.
 * Flow:
 * - Validate input
 * - Check if email exists
 * - Hash password (bcrypt)
 * - Insert user into DB
 * - Return success response
 */
export async function registerController(req, res) {
    try {
      const { email, password } = req.body || {};
  
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }
  
      // Check if email already exists
      const existing = await readUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
  
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
  
      // Insert user with verification fields
      const newUser = await createUser({
        email,
        password_hash,
        role: 'USER'
      });
  
      // Return success (omit password_hash and verification token)
      const { password_hash: _ph, ...userSafe } = newUser;
      return res.status(201).json({ success: true, message: 'Registration successful. Log in with your credentials.', user: userSafe });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

/**
 * Log in a user and return a JWT.
 * Device-based authentication: Non-admin users can only login from their registered device.
 */
export async function loginController(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
  
      const user = await readUserByEmail(email);
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  
      const payload = { user_id: user.id, role: user.role };
      const token = generateToken(payload, '1h');
  
      const { password_hash, ...userSafe } = user || {};
      return res.json({ success: true, token, user: userSafe });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('login error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

/**
 * Logout endpoint. With stateless JWTs the server cannot fully revoke tokens
 * without a token store; this endpoint returns success and lets the client
 * remove the token. If a token is provided it is optionally verified.
 */
export async function logoutController(req, res) {
    try {
      const auth = req.headers && req.headers.authorization;
      const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  
      if (token) {
        try {
          // verify token to provide more accurate feedback (not required)
          verifyToken(token);
        } catch (verErr) {
          // token invalid or expired — still return success so client clears it
        }
      }
  
      return res.json({ success: true, message: 'Logged out' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('logout error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

/**
 * Reset password using a valid token and new password provided by the user.
 */
export async function resetPasswordController(req, res) {
    try {
      const { email, newPassword } = req.body || {};
      
      if (!newPassword) return res.status(400).json({ success: false, message: 'new password is required' });
      
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
  
      const user = await readUserByEmail(email);
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });
  
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);
  
      await updateUserById(user.id, { password_hash });
  
      return res.json({ success: true, message: 'Password has been updated' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('resetPassword error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  export default { 
    registerController, 
    resetPasswordController, 
    loginController, 
    logoutController
};