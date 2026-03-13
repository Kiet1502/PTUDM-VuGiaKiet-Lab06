var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
let {
  RegisterValidator,
  handleResultValidator,
} = require("../utils/validatorHandler");
let bcrypt = require("bcrypt");
let { GenerateToken } = require("../utils/JwtRS256Handler");
let { checkLogin } = require("../utils/authHandler");
/* GET home page. */
router.post(
  "/register",
  RegisterValidator,
  handleResultValidator,
  async function (req, res, next) {
    let newUser = userController.CreateAnUser(
      req.body.username,
      req.body.password,
      req.body.email,
      "69aa8360450df994c1ce6c4c",
    );
    await newUser.save();
    res.send({
      message: "dang ki thanh cong",
    });
  },
);
router.post("/login", async function (req, res, next) {
  let { username, password } = req.body;
  let getUser = await userController.FindByUsername(username);
  if (!getUser) {
    res.status(403).send("tai khoan khong ton tai");
  } else {
    if (getUser.lockTime && getUser.lockTime > Date.now()) {
      res.status(403).send("tai khoan dang bi ban");
      return;
    }
    if (bcrypt.compareSync(password, getUser.password)) {
      await userController.SuccessLogin(getUser);
      let token = GenerateToken({
        id: getUser._id,
      });
      res.send({
        message: "dang nhap thanh cong",
        token: token,
        user: {
          id: getUser._id,
          username: getUser.username,
          email: getUser.email,
          fullName: getUser.fullName,
        },
      });
    } else {
      await userController.FailLogin(getUser);
      res.status(403).send("thong tin dang nhap khong dung");
    }
  }
});
router.get("/me", checkLogin, function (req, res, next) {
  res.send({
    message: "thong tin nguoi dung",
    user: req.user,
  });
});

// Change password endpoint - requires login
router.post("/changepassword", checkLogin, async function (req, res, next) {
  try {
    let { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        message: "Vui long nhap day du thong tin",
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).send({
        message: "Mat khau moi phai co it nhat 6 ky tu",
      });
    }

    // Check if new password is different from old password
    if (oldPassword === newPassword) {
      return res.status(400).send({
        message: "Mat khau moi phai khac mat khau cu",
      });
    }

    // Get current user from token
    let user = req.user;

    // Verify old password
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(403).send({
        message: "Mat khau cu khong chinh xac",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.send({
      message: "Thay doi mat khau thanh cong",
    });
  } catch (error) {
    res.status(500).send({
      message: "Co loi xay ra",
      error: error.message,
    });
  }
});

module.exports = router;
