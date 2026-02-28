import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const jwttoken = {
  sign(payload) {
    try {
      return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      console.error('Error signing JWT:', error);
      throw error;
    }
  },
  verify(token) {
    try {
      return verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Error verifying JWT:', error);
      return null;
    }
  },
};