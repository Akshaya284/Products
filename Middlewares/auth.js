const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    jwt.verify(token, "process.env.TOKEN_SECRET", (err, decodedToken) => {
        console.log(err, decodedToken, "token");
        if (err) return res.sendStatus(403).json({ message: "Invalid token." });

        const { role } = decodedToken;
        req.user = role;
        next()
    })
}

module.exports = {
    authenticateToken
};