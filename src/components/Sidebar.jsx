import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Camera, Users, PanelLeftClose, PanelLeftOpen, ArrowRight, BookOpen, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { cn } from '../utils/utils';

const Sidebar = ({
  isCollapsed,
  onToggle
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'detector', label: 'Detector', icon: Camera, path: '/app' },
    { id: 'people', label: 'People', icon: Users, path: '/people' },
  ];

  const members = [
    {
      name: "Aiita Lyslay Osoa",
      role: "Project Member",
      bio: "Core member of the Id'a development team, focused on building a private and high-performance photography curation experience.",
      image: "/lyslay.jpeg",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Oguzu Stephen",
      role: "Project Member",
      bio: "Core member of the Id'a development team, focused on building a private and high-performance photography curation experience.",
      image: "/Oguzu.jpeg",
      color: "from-blue-500 to-indigo-600",
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white border-r border-slate-200 h-screen flex flex-col relative z-50"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 z-50 transition-colors"
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
                  ? "bg-slate-900 text-white"
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

          {/* Project Brief - Special Section */}
          <motion.div
            className="pt-8 relative group/brief"
            initial="initial"
            whileHover="hover"
          >
            {!isCollapsed && (
              <div className="flex items-center gap-3 px-3 mb-3">
                <span className="h-px bg-slate-100 flex-1" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Story</span>
                <span className="h-px bg-slate-100 flex-1" />
              </div>
            )}

            <button
              onClick={() => window.location.href = '/brief'}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-help",
                isCollapsed && "justify-center px-0"
              )}
            >
              <BookOpen size={20} className="group-hover/brief:scale-110 transition-transform" />
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">Project Brief</span>
              )}
            </button>

            {/* Brief Hover Card */}
            <motion.div
              variants={{
                initial: { opacity: 0, scale: 0.95, x: 20, pointerEvents: 'none' },
                hover: { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' }
              }}
              className="absolute left-[110%] top-[-50px] w-[500px] bg-white border border-slate-200 rounded-[3rem] p-10 z-[100] overflow-hidden transition-all shadow-2xl shadow-blue-900/10 text-left"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 bg-blue-600" />

              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-blue-600">
                    <Sparkles size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Our Mission</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-slate-900">Building Id'a.</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 pb-2">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Smart Curation</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">AI that spots blurry shots and warm smiles instantly, saving hours of sorting work.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Total Privacy</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Your photos never leave this browser. Analysis happens right here on your device.</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">In simple terms...</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    We built Id'a to be an AI-powered co-pilot for photographers. Sorting through thousands of photos is the most painful part of the job—Id'a does the "heavy lifting" by finding the perfect shots automatically, so you can get back to the art of shooting.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Version 1.0 • Built with collaboration</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </nav>
      </div>

      <div className={cn("mt-auto p-4 flex flex-col gap-3", isCollapsed && "items-center")}>
        {members.map((member) => (
          <motion.div
            key={member.name}
            className="relative group/member w-full"
            initial="initial"
            whileHover="hover"
          >
            <div className={cn(
              "bg-slate-50 rounded-2xl p-3 border border-slate-100 w-full transition-all cursor-crosshair",
              isCollapsed && "p-1.5"
            )}>
              <div className={cn("flex items-center gap-3", isCollapsed && "flex-col")}>
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shrink-0">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-[10px] font-black text-slate-900 uppercase truncate">{member.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{member.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Card */}
            <motion.div
              variants={{
                initial: { opacity: 0, scale: 0.95, x: 20, pointerEvents: 'none' },
                hover: { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' }
              }}
              className="absolute left-[110%] bottom-0 w-[420px] bg-white border border-slate-200 rounded-[3rem] p-10 z-[100] overflow-hidden transition-all shadow-2xl shadow-slate-200/20"
            >
              <div className={cn("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 bg-gradient-to-br", member.color)} />
              <div className="relative z-10 space-y-8 text-left">
                <div className="flex items-center gap-6">
                  <div className={cn("w-20 h-20 rounded-[2rem] overflow-hidden rotate-[-4deg] bg-gradient-to-br", member.color)}>
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-2xl font-black text-slate-900 truncate tracking-tighter">{member.name}</h4>
                    <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl w-fit mt-1">
                      {member.role}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {member.bio}
                </p>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-900 uppercase tracking-widest">
                  <span>View Member Profile</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/member:bg-slate-900 group-hover/member:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
