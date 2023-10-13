const express = require('express');
const expenseRouter = express.Router();
const expenseController = require('../Controllers/expenseController')

expenseRouter.get('/expense', expenseController.getExpense);
expenseRouter.post('/post-expense', expenseController.addExpense);
expenseRouter.get('/viewExpenses', expenseController.getExpensePage)
expenseRouter.get('/viewExpensesData', expenseController.getExpenseData);
expenseRouter.post('/deleteExpensedata', expenseController.deleteExpenseData);
expenseRouter.post('/update-expense', expenseController.updateExpense);

module.exports = expenseRouter;