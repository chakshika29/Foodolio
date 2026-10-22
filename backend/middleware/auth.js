import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : req.headers.authorization;
    }
    if (!token) {
        return res.json({success:false,message:'Not Authorized Login Again'});
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "foodolio_secret_key");
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export default authMiddleware;