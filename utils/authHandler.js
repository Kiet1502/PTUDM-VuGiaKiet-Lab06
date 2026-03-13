let userController = require("../controllers/users");
let { VerifyToken } = require("./JwtRS256Handler");
module.exports = {
  checkLogin: async function (req, res, next) {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      res.status(403).send("ban chua dang nhap");
      return;
    }
    token = token.split(" ")[1];
    try {
      let result = VerifyToken(token);
      let user = await userController.FindById(result.id);
      if (!user) {
        res.status(403).send("ban chua dang nhap");
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(403).send("ban chua dang nhap");
    }
  },
};
