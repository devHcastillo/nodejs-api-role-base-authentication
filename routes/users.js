const router = require("express").Router();
const {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
} = require("../utils/Auth");

//Users Registration Route
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

//Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

//Super Admin Registration Route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

//Users login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

//Admin login Route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

//Super Admin login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

//Profile route
router.get("/profile", userAuth, (req, res) => {
  return res.json(serializeUser(req.user));
});

//Users protected Route
router.post(
  "/user-protected",
  [userAuth, checkRole("user")],
  async (req, res) => {
    return res.json("hello USER")
  }
);

//Admin protected Route
router.get(
  "/admin-protected",
  [userAuth, checkRole("admin")],
  async (req, res) => {
    return res.json("hello ADMIN")
  }
);

//Super Admin protected Route
router.post(
  "/super-admin-protected",
  [userAuth, checkRole("superadmin")],
  async (req, res) => {
    return res.json("hello SUPERADMIN")
  }
);

router.post(
  "/super-admin-and-admin-protected",
  [userAuth, checkRole("superadmin", "admin")],
  async (req, res) => {}
);

module.exports = router;
