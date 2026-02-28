import logger from '#config/logger.js';
import { signupSchema } from '../validations/auth.validation.js';
import { formatValidationErrors } from '../services/utils/format.js';
import { createUser } from '../services/auth.service.js';
import { jwttoken } from '#services/utils/jwt.js';
import { cookies } from '#services/utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, role, password } = validationResult.data;

    const user= await createUser({ name, email, password, role });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    cookies.set(res, 'token', token);

    // Replace this block with real database logic (e.g., create user, hash password)
    const createdUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    logger.info(`User ${name} with email ${email} and role ${role} signed up successfully`);
    return res.status(201).json({
      message: 'User signed up successfully',
      user: createdUser,
    });
  } catch (err) {
    logger.error('Error in signup controller:', err);
    if (err && err.message === 'user already exists') {
      return res.status(409).json({ message: 'User already exists' });
    }
    return next(err);
  }
};