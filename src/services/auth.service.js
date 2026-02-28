import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { User } from '#models/user.model.js';
import { eq } from 'kysely';

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    logger.error('Error hashing password:', err);
    throw err;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = db.selectFrom(User).where(eq(User.email, email)).limit(1);

    if (existingUser.length > 0) throw new Error('user already exists');
    const password_hash = await hashPassword(password);

    const newUser = await db.insertInto(User).values({
      name,
      email,
      password_hash,
      role
    }).returning({ id: User.id, name: User.name, email: User.email, role: User.role, created_at: User.created_at }).execute();

    logger.info(`User ${name} with email ${email} and role ${role} created successfully`);
    return newUser[0];
  } catch (err) {
    logger.error('Error creating user:', err);
    throw err;
  }
};