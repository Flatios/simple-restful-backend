import { sign, verify } from 'jsonwebtoken';

// Secret key retrieval and validation
const getSecretKey = () => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
    }
    return secretKey;
};

// Create a new token
function createToken(id, options = { expiresIn: '1h' }) {
    const secretKey = getSecretKey();
    return sign({ id }, secretKey, options);
}

// Verify an existing token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        const secretKey = getSecretKey();
        verify(token, secretKey, (err, decoded) => {
            if (err) {
                return reject(new Error(`Token verification failed: ${err.message}`));
            }
            resolve(decoded);
        });
    });
}

export default {
    createToken,
    verifyToken
};