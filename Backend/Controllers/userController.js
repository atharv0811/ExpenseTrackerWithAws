const path = require("path");
const userDB = require("../Model/userModel");

exports.getRegistrationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", '..', 'Frontend', "Views", "register.html"));
};

exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", '..', 'Frontend', "Views", "login.html"));
};

exports.addUser = async (req, res) => {
  const body = req.body;
  const name = body.nameInput;
  const email = body.emailInput;
  const password = body.passwordInput;

  try {
    await userDB.create({
      name: name,
      email: email,
      password: password
    });
    res.json({ data: 'success' })
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.json({ data: 'exist' });
    } else {
      res.json({ data: 'error' });
    }
  }
}
