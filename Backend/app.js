const bodyParser = require("body-parser");
const express = require("express");
const router = require("./Routers/routes");
const userRouter = require("./Routers/userRoute");
const path = require('path');
const sequelize = require("./db");
const expenseRouter = require("./Routers/expenseRouter");
const userDB = require("./Model/userModel");
const expenseData = require("./Model/expenseModel");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

app.use(router);
app.use("/user", userRouter);
app.use('/expense', expenseRouter);

userDB.hasMany(expenseData);
expenseData.belongsTo(userDB);

sequelize.sync()
    .then(() => {
        app.listen(port);
    })
    .catch(err => console.log(err))
