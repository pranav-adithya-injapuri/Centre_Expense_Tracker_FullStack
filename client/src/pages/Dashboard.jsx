import { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { getExpenses, getCategoryReport, getMonthlyReport } from '../services/api';
import { Wallet, DollarSign, PieChart as PieChartIcon, FileText, TrendingUp, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#818cf8', '#f87171', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#38bdf8', '#fb923c', '#94a3b8'];

const getCategoryColor = (category) => {
  const colors = {
    'Salary': 'text-indigo-600 bg-indigo-50',
    'Rent': 'text-orange-600 bg-orange-50',
    'Utilities': 'text-blue-600 bg-blue-50',
    'Food': 'text-green-600 bg-green-50',
    'Transport': 'text-pink-600 bg-pink-50',
  };
  return colors[category] || 'text-slate-600 bg-slate-50';
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes, monRes] = await Promise.all([
        getExpenses(),
        getCategoryReport(),
        getMonthlyReport()
      ]);
      setExpenses(expRes.data);
      setCategoryData(catRes.data);
      setMonthlyData(monRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Metrics
  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
  const thisMonthExpenses = expenses
    .filter(e => new Date(e.expense_date).toLocaleString('default', { month: 'short', year: 'numeric' }) === currentMonth)
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const highestCategory = categoryData.length > 0 
    ? categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current)
    : { name: 'N/A', value: 0 };
    
  const totalTransactions = expenses.length;

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard Data&hellip;</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Admin! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your expenses today.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer hover:bg-gray-50 transition">
            <option>May 1 - May 31, 2025</option>
          </select>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
               <Wallet size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>All time</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">↑ 12.5%</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
               <DollarSign size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">This Month Expense</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">₹{thisMonthExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>{currentMonth}</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">↑ 8.3%</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
               <PieChartIcon size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Highest Category</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{highestCategory.name}</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>₹{highestCategory.value.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
               <FileText size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Transactions</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{totalTransactions}</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>All time</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">↑ 14.3%</span>
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-bold text-slate-700 mb-6">Expenses by Category</h3>
           <div className="h-64">
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name || `cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
             )}
           </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-bold text-slate-700 mb-6">Monthly Expenses (Bar)</h3>
           <div className="h-64">
             {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(value) => `₹${value/1000}K`} />
                    <BarTooltip cursor={{fill: 'transparent'}} formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Bar dataKey="total" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
             )}
           </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-bold text-slate-700 mb-6">Expense Trend (Line)</h3>
           <div className="h-64">
             {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(value) => `₹${value/1000}K`} />
                    <BarTooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Line type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#818cf8' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
             )}
           </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Expenses Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Recent Expenses</h3>
            <Link to="/expenses" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{expense.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-semibold">
                      ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(expense.expense_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">No recent expenses.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Insights */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-700">Monthly Insights</h3>
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
              <div className="bg-emerald-50 text-emerald-500 p-2 rounded-full mt-1">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">Total expenses increased by <span className="text-indigo-600 font-bold">8.3%</span> from last month.</p>
                <p className="text-xs text-slate-400 mt-1">April: ₹29,920 <span className="mx-1">→</span> May: ₹{thisMonthExpenses.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
              <div className="bg-purple-50 text-purple-500 p-2 rounded-full mt-1">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed"><span className="font-bold text-slate-800">{highestCategory.name}</span> is your highest expense category this month.</p>
                <p className="text-xs text-slate-400 mt-1">{categoryData.length > 0 ? Math.round((highestCategory.value / totalExpenses) * 100) : 0}% of total expenses</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
              <div className="bg-orange-50 text-orange-500 p-2 rounded-full mt-1">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">You have made <span className="font-bold text-indigo-600">{totalTransactions} transactions</span> this month.</p>
                <p className="text-xs text-slate-400 mt-1">Keep tracking to stay on top!</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
