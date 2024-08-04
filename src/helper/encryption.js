import config from "../config/config.js";
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';


const createToken = (data, options = { expiresIn: '1h' }) => jsonwebtoken.sign(data, config.secretKey, options);

const verifyToken = token => new Promise((resolve, reject) => 
    jsonwebtoken.verify(token, secretKey, (err, decoded) => err ? reject(console.error(err)) : resolve(decoded) )
);

const hashPassword = (password, salt=16) => {
    const salts = crypto.randomBytes(salt).toString('hex');
    const hash = crypto.createHmac('sha512', salts);
    hash.update(password);
    return hash.digest('hex');
}

const verifyPassword = (inputPassword, storedHash, storedSalt=16) => {
    const hashOfInput = hashPassword(inputPassword, storedSalt);
    return hashOfInput === storedHash;
};

export default {
    createToken,
    verifyToken,
    randomUUID: crypto.randomUUID,
    hashPassword,
    verifyPassword
};