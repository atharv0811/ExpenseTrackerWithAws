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
    res.status(201).json({ data: 'success' })
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ data: 'exist' });
    } else {
      res.status(500).json({ data: 'error' });
    }
  }
}

exports.checkLogin = async (req, res) => {
  const body = req.body;
  const email = body.emailInput;
  const password = body.passwordInput;
  try {
    let data = await userDB.findOne({
      where: {
        email: email
      }
    })

    if (data) {
      const loginCheck = await userDB.findOne({
        where: {
          email: email,
          password: password
        }
      })

      if (loginCheck) {
        res.status(201).json({ data: 'success' });
      }
      else {
        res.status(401).json({ data: 'Failed' });
      }
    }
    else {
      res.status(404).json({ data: 'notExist' })
    }
  } catch (error) {
    res.status(500).json({ data: 'error' })
    console.log(error)
  }
}

exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'home.html'))
}