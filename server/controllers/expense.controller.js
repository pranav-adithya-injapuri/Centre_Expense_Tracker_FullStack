const prisma = require('../db');

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const { search, category, startDate, endDate } = req.query;

    const where = {};

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }
    if (startDate || endDate) {
      where.expense_date = {};
      if (startDate) where.expense_date.gte = new Date(startDate);
      if (endDate) where.expense_date.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expense_date: 'desc' },
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// Add new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, payment_method, expense_date, notes, receipt_url, created_by } = req.body;
    
    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        payment_method,
        expense_date: new Date(expense_date),
        notes,
        receipt_url,
        created_by
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, payment_method, expense_date, notes, receipt_url } = req.body;

    const data = {};
    if (title) data.title = title;
    if (amount) data.amount = parseFloat(amount);
    if (category) data.category = category;
    if (payment_method) data.payment_method = payment_method;
    if (expense_date) data.expense_date = new Date(expense_date);
    if (notes !== undefined) data.notes = notes;
    if (receipt_url !== undefined) data.receipt_url = receipt_url;

    const expense = await prisma.expense.update({
      where: { id: parseInt(id, 10) },
      data,
    });

    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.expense.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
