const prisma = require('../db');

exports.getMonthlyReport = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      select: { amount: true, expense_date: true },
      where: {
        expense_date: { not: null }
      }
    });

    const monthlyData = {};

    expenses.forEach(exp => {
      if (!exp.expense_date) return;
      
      const monthYear = new Date(exp.expense_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += parseFloat(exp.amount) || 0;
    });

    // Convert to array format for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
      name: key,
      total: monthlyData[key]
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
};

exports.getCategoryReport = async (req, res) => {
  try {
    const expenses = await prisma.expense.groupBy({
      by: ['category'],
      _sum: {
        amount: true
      },
      where: {
        category: { not: null }
      }
    });

    const chartData = expenses.map(exp => ({
      name: exp.category,
      value: parseFloat(exp._sum.amount) || 0
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching category report:', error);
    res.status(500).json({ error: 'Failed to fetch category report' });
  }
};
