import React from 'react';
import { Filter, Trash2, ShieldAlert, Heart, RefreshCw } from 'lucide-react';
import { cn } from '../utils/utils';

const Sidebar = ({ filters, setFilters, stats, onProcess, isProcessing, onClear }) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Filter size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900">PhotoFilter</h1>
        </div>

        <button
          onClick={onProcess}
          disabled={isProcessing || stats.total === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Filter size={18} />
          )}
          {isProcessing ? "Processing..." : "Run AI Filters"}
        </button>
      </div>

      <div className="p-6 space-y-8 flex-1">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">View Mode</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'all', label: 'All Photos', icon: Filter, color: 'text-slate-600' },
              { id: 'perfect', label: 'Perfect Shots', icon: Heart, color: 'text-emerald-600' },
              { id: 'rejects', label: 'Rejects', icon: Trash2, color: 'text-red-600' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setFilters({ ...filters, viewMode: mode.id })}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  filters.viewMode === mode.id
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <mode.icon size={18} className={filters.viewMode === mode.id ? "text-white" : mode.color} />
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Manual Toggles</h3>
          <div className="space-y-3">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hideBlurry}
                onChange={(e) => setFilters({ ...filters, hideBlurry: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-500" />
                Hide Blurry Photos
              </span>
            </label>
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlySmiling}
                onChange={(e) => setFilters({ ...filters, onlySmiling: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                <Heart size={16} className="text-pink-500" />
                Show Only Smiling
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-2xl font-bold text-slate-900 leading-none">{stats.total}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">Total Photos</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700 leading-none">{stats.sharp}</p>
              <p className="text-[10px] text-emerald-600 font-medium uppercase mt-1">Sharp</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-2xl font-bold text-red-700 leading-none">{stats.blurry}</p>
              <p className="text-[10px] text-red-600 font-medium uppercase mt-1">Blurry</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
              <p className="text-2xl font-bold text-pink-700 leading-none">{stats.smiling}</p>
              <p className="text-[10px] text-pink-600 font-medium uppercase mt-1">Smiling</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 transition-colors py-2 text-sm font-medium"
        >
          <Trash2 size={16} />
          Clear All Photos
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
