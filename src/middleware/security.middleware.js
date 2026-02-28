import arcjet from '@arcjet/node';
import { slidingWindow } from '@arcjet/node';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : 'guest';

    let maxRequests;

    switch (role) {
      case 'admin':
        maxRequests = 20;
        break;
      case 'user':
        maxRequests = 10;
        break;
      default:
        maxRequests = 5;
        break;
    }

    const aj = arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        slidingWindow({
          interval: '1m',   // 1 minute
          max: maxRequests  // số request theo role
        })
      ]
    });

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        role
      });

      return res.status(429).json({
        message: 'Too many requests - please try again later'
      });
    }

    next();

  } catch (err) {
    console.error('Error in security middleware:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default securityMiddleware;