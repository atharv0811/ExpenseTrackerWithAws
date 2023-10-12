const bodyParser = require("body-parser");
const express = require("express");
const router = require("./Routers/routes");
const userRouter = require("./Routers/userRoute");
const path = require('path');
const sequelize = require("./db");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

app.use("/user", userRouter);
app.use(router);

sequelize.sync()
    .then(() => {
        app.listen(port);
    })
    .catch(err => console.log(err))
