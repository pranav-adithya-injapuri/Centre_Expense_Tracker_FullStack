import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Receipt, BarChart2, Tags, Settings, HelpCircle, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Add Expense', path: '/add-expense', icon: PlusCircle },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Reports', path: '/reports', icon: BarChart2 },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ onClose }) => {

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full lg:h-screen lg:fixed top-0 left-0">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
            <span className="text-sm">CE</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800 leading-tight">Centre Expense<br/><span className="text-sm text-slate-500 font-normal">Tracker</span></h1>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-indigo-600 rounded-xl p-4 text-white flex items-center gap-3 mb-4 cursor-pointer hover:bg-indigo-700 transition">
          <div className="size-10 bg-white/20 rounded-full flex items-center justify-center font-bold">AD</div>
          <div>
            <div className="font-semibold text-sm">Admin Demo</div>
            <div className="text-xs text-indigo-200">admin@demo.com</div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hidden sm:block">
          <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
               <HelpCircle size={18} className="text-indigo-600" />
            </div>
            Need Help?
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">If you have any questions, feel free to contact support.</p>
          <button type="button" className="w-full py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
