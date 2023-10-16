const path = require("path");
const userDB = require("../Model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require("../db");
var SibApiV3Sdk = require('sib-api-v3-sdk');

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
  const passwordInput = body.passwordInput;
  const t = await sequelize.transaction();

  try {
    const password = await bcrypt.hash(passwordInput, 10);
    await userDB.create({
      name: name,
      email: email,
      password: password
    }, { transaction: t })

    await t.commit();
    res.status(201).json({ data: 'success' })
  } catch (err) {
    await t.rollback();
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
  const t = await sequelize.transaction();

  try {
    let data = await userDB.findOne({
      where: {
        email: email
      },
      transaction: t
    })

    if (data) {
      const checkLogin = await bcrypt.compare(password, data.password);
      if (checkLogin) {
        t.commit();
        res.status(201).json({ data: 'success', token: generateAccessToken(data.id) });
      }
      else {
        await t.rollback();
        res.status(401).json({ data: 'Failed' });
      }
    }
    else {
      await t.rollback();
      res.status(404).json({ data: 'notExist' })
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ data: 'error' })
    console.log(error)
  }
}

exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'home.html'))
}

exports.forgetPassword = async (req, res) => {
  try {
    const email = req.body.emailId;
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.FORGETPASSWORDKEY;
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = { email: "karnekaratharv12@gmail.com" };
    const receivers = [{ email: `${email}` }];
    apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Test",
      textContent: "DummyText"
    }).then(() => {
      res.status(202).json({ message: 'success' });
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

function generateAccessToken(id) {
  return jwt.sign({ userid: id }, process.env.SECRETKEY);
}