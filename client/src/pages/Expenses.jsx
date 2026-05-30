import { useEffect, useState } from 'react';
import { getExpenses } from '../services/api';
import { FileText, Image as ImageIcon, Search, Filter } from 'lucide-react';

const categories = [
  'Rent', 'Salary', 'Utilities', 'Food', 'Transport', 
  'Learning Materials', 'Maintenance', 'Marketing', 'Miscellaneous'
];

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

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedCategory: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.searchTerm) params.search = filters.searchTerm;
        if (filters.selectedCategory) params.category = filters.selectedCategory;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const response = await getExpenses(params);
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        setLoading(false);
      }
    };

    // Add a slight debounce to the search fetch
    const timeoutId = setTimeout(() => {
      fetchExpenses();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategory: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Expenses</h1>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              id="search"
              type="text" 
              placeholder="Search expenses..." 
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="w-48">
          <label htmlFor="category" className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <select 
            id="category"
            value={filters.selectedCategory}
            onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
          <input 
            id="startDate"
            type="date" 
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
          <input 
            id="endDate"
            type="date" 
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button 
          type="button"
          onClick={clearFilters}
          className="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
        >
          Clear
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-sm tracking-wide">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Payment Method</th>
                <th className="px-6 py-4 font-medium text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Loading expenses&hellip;</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="mx-auto size-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Filter className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No expenses found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-slate-800 font-medium">{expense.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(expense.expense_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{expense.payment_method}</td>
                    <td className="px-6 py-4 flex justify-center">
                      {expense.receipt_url ? (
                        <a href={expense.receipt_url} target="_blank" rel="noreferrer" className="text-rose-500 hover:text-rose-600 bg-rose-50 p-2 rounded-lg transition" title="View Receipt">
                          {expense.receipt_url.toLowerCase().endsWith('.pdf') ? <FileText size={18} /> : <ImageIcon size={18} />}
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
