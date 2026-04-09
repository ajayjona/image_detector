import React from 'react';
import { Home, Camera, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../utils/utils';
import { motion } from 'framer-motion';

const Sidebar = ({
  isCollapsed,
  onToggle
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'detector', label: 'Detector', icon: Camera, path: '/app' },
    { id: 'people', label: 'People', icon: Users, path: '/people' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white border-r border-slate-200 h-screen overflow-hidden flex flex-col relative z-50"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      <div className={cn("p-6 flex flex-col gap-8", isCollapsed && "items-center px-4")}>
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain invert" />
          </div>
          {!isCollapsed && <h1 className="text-xl font-black italic tracking-tighter">Id'a</h1>}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path !== '#' && (window.location.href = item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                item.path === window.location.pathname
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon size={20} className={cn(item.path === window.location.pathname ? "text-blue-400" : "group-hover:text-slate-900", isCollapsed && "w-6 h-6")} />
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-16 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className={cn(
          "bg-slate-50 rounded-2xl p-4 border border-slate-100",
          isCollapsed && "p-2 items-center"
        )}>
          <div className={cn("flex items-center gap-3", isCollapsed && "flex-col")}>
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white">AL</div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 uppercase">Aiita Lyslay</span>
                <span className="text-[9px] font-bold text-slate-400">Founder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
