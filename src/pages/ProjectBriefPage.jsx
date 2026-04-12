import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { cn } from '../utils/utils';
import {
    Brain, Settings, Puzzle, Users2, BarChart3, Wrench, Rocket,
    Camera, Heart, ShieldCheck, Filter, Download, ArrowRight,
    Terminal, Layout, Sparkles, Database, Archive, Layers, Code2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectBriefPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    return (
        <div className="flex h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
            <Sidebar
                isCollapsed={!isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto bg-[#fafaf9] scroll-smooth">
                <main className="px-12 py-24 max-w-6xl mx-auto w-full space-y-32">

                    {/* 🧠 Project Overview (Hero Section) */}
                    <section className="space-y-8 text-center lg:text-left">
                        <div className="flex items-center gap-3 text-slate-400 justify-center lg:justify-start">
                            <Brain size={24} />
                            <h2 className="text-sm font-black uppercase tracking-[0.4em]">Project Overview</h2>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                            Id’a — AI Photography <br />
                            <span className="text-blue-600">Curation Workspace</span>
                        </h1>
                        <div className="max-w-3xl bg-white border border-slate-200 rounded-[2.5rem] p-10 mx-auto lg:mx-0">
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Id’a is a modern, AI-powered photography curation platform designed to help photographers quickly sort, analyze, and deliver high-quality images. Built as a fully client-side application, it combines intelligent image analysis with a clean, distraction-free interface to create a fast, private, and professional workflow.
                            </p>
                        </div>
                    </section>

                    {/* ⚙️ What We Built (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Settings className="text-slate-400" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">What We Built</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "A Command Center UI with a clean, flat design system (no shadows, consistent 10px radius)",
                                "A collapsible dropzone for seamless image importing",
                                "Unified navigation for loading files and sample datasets",
                                "A continuous workspace view (no intrusive popups or banners)",
                                "Interactive team and project pages with profile previews",
                                "A hover-card system for quick insights without navigation"
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-200 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <p className="text-slate-600 font-bold leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 🧩 Core Features (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                            <Puzzle className="text-slate-400" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Core Features</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Camera className="text-blue-600" size={28} />
                                    <h3 className="text-xl font-black">AI Sharpness Detection</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Each image is analyzed to determine clarity and focal accuracy, helping identify technically strong shots.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Heart className="text-pink-500" size={28} />
                                    <h3 className="text-xl font-black">Emotion Recognition</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    The system detects facial expressions and highlights images with natural smiles and positive emotions.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="text-emerald-500" size={28} />
                                    <h3 className="text-xl font-black">Privacy-First Processing</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    All computations run directly in the browser — no uploads, no servers, no data tracking.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Filter className="text-indigo-500" size={28} />
                                    <h3 className="text-xl font-black">Smart Filtering</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Users can dynamically adjust thresholds to filter:</p>
                                    <ul className="text-xs font-black text-slate-400 uppercase space-y-1 pl-4 border-l-2 border-indigo-100">
                                        <li>• “Perfect” shots</li>
                                        <li>• Rejected or low-quality images</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <Download className="text-yellow-600" size={28} />
                                    <h3 className="text-xl font-black">Bulk Export</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Selected images can be instantly packaged and downloaded as a ZIP file for delivery.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 🧑‍🤝‍🧑 Collaboration & Experience (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Users2 className="text-slate-400" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Collaboration & Experience</h2>
                        </div>
                        <div className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                {[
                                    "Dedicated People and Project Brief pages",
                                    "Integrated team identity with photos and branding",
                                    "Real-time hover previews for members and project details",
                                    "Designed to feel like a professional creative studio environment"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                        <p className="text-sm font-medium text-slate-300">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 📊 Insights & Feedback (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                            <BarChart3 className="text-slate-400" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Insights & Feedback</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                    A streamlined Stats Board provides instant visual feedback. Color-coded metrics make scanning fast and intuitive.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Total images processed",
                                        "Sharp vs. blurry detection",
                                        "Emotion-based classification (“Happy” images)"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-500 font-black uppercase text-[11px] tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-4 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                                <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-yellow-100"><span className="text-xs font-black uppercase text-yellow-600">Total</span><div className="h-2 w-16 bg-yellow-400 rounded-full" /></div>
                                <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-emerald-100"><span className="text-xs font-black uppercase text-emerald-600">Sharp</span><div className="h-2 w-24 bg-emerald-400 rounded-full" /></div>
                                <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-red-100"><span className="text-xs font-black uppercase text-red-600">Blurry</span><div className="h-2 w-12 bg-red-400 rounded-full" /></div>
                                <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-pink-100"><span className="text-xs font-black uppercase text-pink-600">Happy</span><div className="h-2 w-20 bg-pink-400 rounded-full" /></div>
                            </div>
                        </div>
                    </section>

                    {/* 🛠️ Technical Stack (Paragraph + Mini Cards) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Wrench className="text-slate-400" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">Technical Stack</h2>
                        </div>
                        <div className="space-y-8">
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Id’a is built using a modern, high-performance frontend stack:
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { t: "Frontend: React (v19) + Vite", i: <Code2 size={16} /> },
                                    { t: "Styling: Tailwind CSS", i: <Layout size={16} /> },
                                    { t: "Animations: Framer Motion", i: <Layers size={16} /> },
                                    { t: "AI Engine: face-api", i: <Sparkles size={16} /> },
                                    { t: "Storage: Dexie.js (IDB)", i: <Database size={16} /> },
                                    { t: "Exporting: JSZip", i: <Archive size={16} /> },
                                    { t: "Icons: Lucide React", i: <Terminal size={16} /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 transition-all">
                                        <div className="text-blue-500">{item.i}</div>
                                        <span className="text-xs font-black uppercase tracking-widest">{item.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 🚀 Final Outcome (Closing Paragraph) */}
                    <section className="pt-24 border-t border-slate-100 space-y-8">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Rocket size={24} />
                            <h2 className="text-sm font-black uppercase tracking-[0.4em]">Final Outcome</h2>
                        </div>
                        <div className="bg-blue-600 text-white p-16 rounded-[4rem] flex flex-col lg:flex-row gap-12 items-center justify-between">
                            <p className="text-2xl font-bold leading-relaxed max-w-3xl">
                                The result is a fully functional, AI-assisted curation tool that runs entirely in the browser. It balances performance, privacy, and design clarity, giving photographers a powerful way to manage large image sets without compromising speed or user experience.
                            </p>
                            <button
                                onClick={() => window.location.href = '/app'}
                                className="px-10 py-6 bg-white text-blue-600 rounded-[2rem] font-black text-lg flex items-center gap-4 hover:scale-105 active:scale-95 transition-all w-full lg:w-auto justify-center"
                            >
                                Launch Workspace
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProjectBriefPage;
