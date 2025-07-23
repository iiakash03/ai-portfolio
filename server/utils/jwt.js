import jwt from 'jsonwebtoken';
import 'dotenv/config'

const generateToken=(userId)=>{
    const token = jwt.sign({ userId },process.env.JWT_SECRET || 'topsecret', {
        expiresIn: '1h',
    });
    return token;
}

export default generateToken;