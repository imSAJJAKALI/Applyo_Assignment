import jwt from 'jsonwebtoken';

const SECRET = 'my_super_secret';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);

    return decoded;
  } catch (err) {
    console.error('JWT verify error:', err.message);

    const decoded = jwt.decode(token);
    console.log('Decoded token (unsafe):', decoded);

    return null;
  }
}