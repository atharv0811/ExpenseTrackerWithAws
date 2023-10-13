const userDB = require("../Model/userModel");
const jwt = require('jsonwebtoken');
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, '7b44adaa2e7cf67c6c0ce4aa6cbd647774cb1ab2f46dd4509c2d251b97e6360f');
        const result = await userDB.findByPk(user.userid);
        req.user = result;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ data: 'failed' });
    }
}

module.exports = authenticateUser;