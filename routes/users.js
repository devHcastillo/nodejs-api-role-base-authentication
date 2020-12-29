const router = require("express").Router();
const { userRegister } = require("../utils/Auth");

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
router.post("/login-user", async (req, res) => {});

//Admin login Route
router.post("/login-admin", async (req, res) => {});

//Super Admin login Route
router.post("/login-super-admin", async (req, res) => {});

//Profile route
router.get("profile", (req, res) => {});

//Users protected Route
router.post("/user-protected", async (req, res) => {});

//Admin protected Route
router.post("/admin-protected", async (req, res) => {});

//Super Admin protected Route
router.post("/super-admin-protected", async (req, res) => {});

module.exports = router;
