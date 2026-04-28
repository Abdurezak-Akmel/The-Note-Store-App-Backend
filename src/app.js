import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pool from './config/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

//Routes
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Registration
//  Auth Routes
app.use('/api/v1/auth', authRoutes);

// Users Routes
app.use('/api/v1/users', usersRoutes);

// Notes Routes
app.use('/api/v1/notes', notesRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
     // eslint-disable-next-line no-console
     console.error(err.stack); // Log the error for debugging

     const status = err.statusCode || 500;
     const message = err.message || 'Internal Server Error';

     res.status(status).json({
          success: false,
          status,
          message,
          // Only show stack trace in development mode
          stack: process.env.NODE_ENV === 'development' ? err.stack : {}
     });
});

const seedAdmin = async () => {
     try {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          const adminRole = process.env.ADMIN_ROLE;

          // Check if any admin exists (adjust query based on your schema)
          const { rows } = await pool.query('SELECT * FROM "users" WHERE email = $1', [adminEmail]);

          if (rows.length === 0) {
               const hashedPassword = await bcrypt.hash(adminPassword, 10);
               await pool.query(
                    'INSERT INTO "users" (email, password_hash, role) VALUES ($1, $2, $3)',
                    [adminEmail, hashedPassword, adminRole]
               );
               console.log(`Admin user seeded: ${adminEmail}`);
          }
     } catch (error) {
          console.error('Error seeding admin:', error.message);
     }
};

// If this file is run directly, start the server.
if (process.argv[1] === __filename) {
     app.listen(PORT, async () => {
          console.log(`Server listening on port ${PORT}`);

          // Run the seed function on startup
          await seedAdmin();
     });
};

export default app;