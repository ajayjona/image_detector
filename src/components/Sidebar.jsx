import React from 'react';
import { Filter, Trash2, ShieldAlert, Heart, RefreshCw, Sliders, Cpu, Download, Camera } from 'lucide-react';
import { cn } from '../utils/utils';

const Sidebar = ({
  filters,
  setFilters,
  thresholds,
  setThresholds,
  stats,
  modelStatus,
  onProcess,
  isProcessing,
  isExporting,
  onClear,
  onExport,
  filteredCount
}) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tighter text-slate-900 italic">Filters</h2>
          </div>

          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500",
            modelStatus.loaded ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
              modelStatus.loading ? "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse" :
                "bg-slate-50 text-slate-400 border border-slate-100"
          )}>
            <Cpu size={10} className={modelStatus.loading ? "animate-spin" : ""} />
            {modelStatus.loaded ? "AI Ready" : modelStatus.loading ? "Loading AI" : "AI Idle"}
          </div>
        </div>

        <button
          onClick={onProcess}
          disabled={isProcessing || stats.total === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Filter size={18} className="text-blue-400" />
          )}
          {isProcessing ? "Analyzing Photos..." : "Run AI Filters"}
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
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sliders size={12} />
            AI Thresholds
          </h3>
          <div className="space-y-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Blur Sensitivity</span>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{thresholds.blur}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={thresholds.blur}
                onChange={(e) => setThresholds({ ...thresholds, blur: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Lower = More strict (rejects more blurry photos)</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Smile Confidence</span>
                <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">{Math.round(thresholds.smile * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={thresholds.smile * 100}
                onChange={(e) => setThresholds({ ...thresholds, smile: parseInt(e.target.value) / 100 })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
              <p className="text-[10px] text-slate-400">Higher = Requires a bigger smile to pass</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Manual Toggles</h3>
          <div className="space-y-3">
            <label className="flex items-center group cursor-pointer bg-white p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
              <input
                type="checkbox"
                checked={filters.hideBlurry}
                onChange={(e) => setFilters({ ...filters, hideBlurry: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-500" />
                Hide Blurry
              </span>
            </label>
            <label className="flex items-center group cursor-pointer bg-white p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
              <input
                type="checkbox"
                checked={filters.onlySmiling}
                onChange={(e) => setFilters({ ...filters, onlySmiling: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                <Heart size={16} className="text-pink-500" />
                Show Only Smiling
              </span>
            </label>
          </div>
        </div>

      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
        <button
          onClick={onExport}
          disabled={filteredCount === 0 || isExporting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-blue-100 active:scale-[0.98]"
        >
          {isExporting ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {isExporting ? "Zipping Photos..." : `Download Filtered (${filteredCount})`}
        </button>
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Trash2 size={14} />
          Clear Library
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
