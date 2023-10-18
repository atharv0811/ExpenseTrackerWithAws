const bodyParser = require("body-parser");
const express = require("express");
require('dotenv').config();
const router = require("./Routers/routes");
const userRouter = require("./Routers/userRoute");
const path = require('path');
const sequelize = require("./db");
const expenseRouter = require("./Routers/expenseRouter");
const payRoute = require("./Routers/paymentRoute");
const userDB = require("./Model/userModel");
const expenseData = require("./Model/expenseModel");
const OrderData = require("./Model/paymentModel");
const forgetPasswordModel = require("./Model/forgetPasswordModel");
const UrlDb = require("./Model/fileDownloadUrlModel");
const yearlyReportDb = require("./Model/yearlyReaportModel");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

app.use(router);
app.use("/user", userRouter);
app.use('/expense', expenseRouter);
app.use('/payment', payRoute);

userDB.hasMany(expenseData);
expenseData.belongsTo(userDB);
userDB.hasMany(OrderData);
OrderData.belongsTo(userDB);
userDB.hasMany(forgetPasswordModel);
forgetPasswordModel.belongsTo(userDB);
userDB.hasMany(yearlyReportDb);
yearlyReportDb.belongsTo(userDB);
userDB.hasMany(UrlDb);
UrlDb.belongsTo(userDB);

sequelize.sync()
    .then(() => {
        app.listen(port);
    })
    .catch(err => console.log(err))
