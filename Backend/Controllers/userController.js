const path = require("path");
const userDB = require("../Model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  try {
    const password = await bcrypt.hash(body.passwordInput, 10)
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
      const checkLogin = await bcrypt.compare(password, data.password);
      if (checkLogin) {
        res.status(201).json({ data: 'success', token: generateAccessToken(data.id) });
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

function generateAccessToken(id) {
  return jwt.sign({ userid: id }, '7b44adaa2e7cf67c6c0ce4aa6cbd647774cb1ab2f46dd4509c2d251b97e6360f')
}