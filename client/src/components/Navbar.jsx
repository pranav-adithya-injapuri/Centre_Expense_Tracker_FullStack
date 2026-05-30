import { Menu, Bell } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-[#fafafa] border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
