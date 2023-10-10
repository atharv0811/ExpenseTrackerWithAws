const path = require("path");

exports.getRegistrationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Views", "register.html"));
};

exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Views", "login.html"));
};
