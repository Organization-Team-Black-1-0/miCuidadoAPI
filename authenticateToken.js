import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ error: "Token de acceso faltante" });
    }

    const user = await jwt.verify(token, process.env.SECRET_KEY);
    if (!user) {
        return res.status(401).json({ error: "Token inválido" });
    }

    req.user = user;
    next();
};