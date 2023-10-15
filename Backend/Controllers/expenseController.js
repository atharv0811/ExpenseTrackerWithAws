const path = require('path');
const expenseData = require('../Model/expenseModel');
const userDB = require('../Model/userModel');

exports.mainHome = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'homeAfterLogin.html'))
}

exports.getExpense = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'expense.html'))
}

exports.addExpense = async (req, res) => {
    const body = req.body;
    const id = req.user.id;
    const expenseAmount = body.ExpenseAmount;
    const description = body.ExpenseDesc;
    const expenseType = body.ExpenseType;
    try {
        await expenseData.create({
            expenseAmount: expenseAmount,
            description: description,
            expenseType: expenseType,
            userDatumId: id
        });
        res.status(201).json({ data: 'success' })
    } catch (error) {
        res.status(500).json({ data: 'error' });
    }
}

exports.getExpensePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'viewExpense.html'))
}

exports.getExpenseData = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await expenseData.findAll({ where: { userDatumId: id } });
        res.json(result)
    } catch (error) {
        res.status(500).json({ data: 'error' });
        console.log(error)
    }
}

exports.deleteExpenseData = async (req, res) => {
    try {
        const id = req.body.id;
        const userid = req.user.id;

        await expenseData.destroy({ where: { id: id, userDatumId: userid } });
        res.redirect('/expense/viewExpenses');
    }
    catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err)
    }
}

exports.updateExpense = async (req, res) => {
    const body = req.body;
    const id = body.id;
    const userid = req.user.id;
    const expenseAmount = body.data.ExpenseAmount;
    const description = body.data.ExpenseDesc;
    const expenseType = body.data.ExpenseType;
    try {
        const ExpenseData = await expenseData.findOne({ where: { id: id, userDatumId: userid } });
        ExpenseData.expenseAmount = expenseAmount;
        ExpenseData.description = description;
        ExpenseData.expenseType = expenseType;
        await ExpenseData.save();
        res.status(201).json({ data: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ data: 'error' });
    }
}

exports.getLeaderBoardPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", '..', 'Frontend', "Views", "expenseLeaderBoard.html"));
};

exports.getLeaderBoardData = async (req, res) => {
    try {
        const response = await expenseData.findAll();
        const dataMap = new Map();

        for (let i = 0; i < response.length; i++) {
            const userid = response[i].userDatumId;
            const user = await userDB.findOne({ where: { id: userid } });
            const expenseAmount = parseInt(response[i].expenseAmount);

            if (dataMap.has(user.name)) {
                dataMap.set(user.name, dataMap.get(user.name) + expenseAmount);
            } else {
                dataMap.set(user.name, expenseAmount);
            }
        }

        let leaderboardData = [];
        dataMap.forEach((value, key) => {
            leaderboardData.push({
                name: key,
                amount: value
            });
        });
        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};