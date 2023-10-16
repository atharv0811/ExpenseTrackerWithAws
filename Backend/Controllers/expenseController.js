const path = require('path');
const expenseData = require('../Model/expenseModel');
const userDB = require('../Model/userModel');
const sequelize = require('../db');

exports.mainHome = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'homeAfterLogin.html'))
}

exports.getExpense = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'expense.html'))
}

exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const body = req.body;
    const id = req.user.id;
    const expenseAmount = parseInt(body.ExpenseAmount);
    const description = body.ExpenseDesc;
    const expenseType = body.ExpenseType;
    try {
        const result = await userDB.findByPk(id, { attributes: ['totalExpense'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);

        await expenseData.create({
            expenseAmount: expenseAmount,
            description: description,
            expenseType: expenseType,
            userDatumId: id

        }, { transaction: t });

        await userDB.update({ totalExpense: totalExpense + expenseAmount }, { where: { id: id }, transaction: t });

        await t.commit();
        res.status(201).json({ data: 'success' })
    } catch (error) {
        console.log(error)
        await t.rollback();
        res.status(500).json({ data: 'error' });
    }
};

exports.getExpensePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Views', 'viewExpense.html'))
};

exports.getExpenseData = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await expenseData.findAll({ where: { userDatumId: id } });
        res.json(result)
    } catch (error) {
        res.status(500).json({ data: 'error' });
        console.log(error)
    }
};

exports.deleteExpenseData = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.body.id;
        const expenseAmount = parseInt(req.body.expenseAmount);
        const userid = req.user.id;
        const result = await userDB.findByPk(userid, { attributes: ['totalExpense'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);

        await expenseData.destroy({ where: { id: id, userDatumId: userid }, transaction: t });
        await userDB.update({ totalExpense: totalExpense - expenseAmount }, { where: { id: userid }, transaction: t })

        await t.commit();
        res.redirect('/expense/viewExpenses');
    }
    catch (err) {
        await t.rollback();
        res.status(500).json({ data: 'error' });
        console.log(err)
    }
}

exports.updateExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const body = req.body;
    const id = body.id;
    const userid = req.user.id;
    const newExpenseAmount = parseInt(body.data.ExpenseAmount);
    const newDescription = body.data.ExpenseDesc;
    const newExpenseType = body.data.ExpenseType;

    try {
        const ExpenseData = await expenseData.findOne({ where: { id: id, userDatumId: userid }, transaction: t });

        const oldExpenseAmount = ExpenseData.expenseAmount;
        const expenseAmountDifference = newExpenseAmount - oldExpenseAmount;
        ExpenseData.expenseAmount = newExpenseAmount;
        ExpenseData.description = newDescription;
        ExpenseData.expenseType = newExpenseType;

        await ExpenseData.save({ transaction: t });
        const result = await userDB.findByPk(userid, { attributes: ['totalExpense'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);
        await userDB.update({ totalExpense: totalExpense + expenseAmountDifference }, { where: { id: userid }, transaction: t });

        await t.commit();
        res.status(201).json({ data: 'success' })
    } catch (err) {
        console.log(err)
        await t.rollback();
        res.status(500).json({ data: 'error' });
    }
}

exports.getLeaderBoardPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", '..', 'Frontend', "Views", "expenseLeaderBoard.html"));
};

exports.getLeaderBoardData = async (req, res) => {
    try {
        const leaderboardData = await userDB.findAll({
            attributes: [
                'id',
                'name',
                'totalExpense'
            ],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        });
        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};