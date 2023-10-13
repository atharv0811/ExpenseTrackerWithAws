const express = require('express');
const expenseRouter = express.Router();
const expenseController = require('../Controllers/expenseController');
const authenticateUser = require('../Middleware/auth');

expenseRouter.get('/mainHome', expenseController.mainHome);
expenseRouter.get('/expense', expenseController.getExpense);
expenseRouter.post('/post-expense', authenticateUser, expenseController.addExpense);
expenseRouter.get('/viewExpenses', expenseController.getExpensePage)
expenseRouter.get('/viewExpensesData', authenticateUser, expenseController.getExpenseData);
expenseRouter.post('/deleteExpensedata', authenticateUser, expenseController.deleteExpenseData);
expenseRouter.post('/update-expense', authenticateUser, expenseController.updateExpense);

module.exports = expenseRouter;