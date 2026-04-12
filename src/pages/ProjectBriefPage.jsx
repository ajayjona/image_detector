import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { cn } from '../utils/utils';
import {
    Brain, Settings, Puzzle, UserCheck, BarChart3, Binary,
    Camera, Heart, ShieldCheck, Filter, Download, Sparkles,
    Code2, Layers, Cpu, Database, Archive, Layout, Zap, ArrowRight,
    Github, Twitter, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectBriefPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    const techStack = [
        { name: "React (v19) + Vite", icon: <Code2 size={16} />, color: "text-blue-500" },
        { name: "Tailwind CSS", icon: <Layout size={16} />, color: "text-sky-500" },
        { name: "Framer Motion", icon: <Layers size={16} />, color: "text-pink-500" },
        { name: "Face-api AI", icon: <Cpu size={16} />, color: "text-emerald-500" },
        { name: "Dexie.js (IDB)", icon: <Database size={16} />, color: "text-amber-500" },
        { name: "JSZip", icon: <Archive size={16} />, color: "text-indigo-500" },
        { name: "Lucide Icons", icon: <Sparkles size={16} />, color: "text-yellow-500" }
    ];

    return (
        <div className="flex h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
            <Sidebar
                isCollapsed={!isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto bg-[#fafaf9] scroll-smooth">
                {/* 🧠 Project Overview (Hero Section) */}
                <header className="px-12 pt-32 pb-24 max-w-7xl mx-auto w-full relative">
                    <div className="absolute top-20 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-blue-600 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Brain size={24} />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Project Overview</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.8]">
                            Id’a — <br />
                            <span className="text-blue-600 italic">Curation Workspace.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            A modern, AI-powered platform designed to help photographers quickly sort, analyze, and deliver high-quality images. Built entirely client-side for total privacy.
                        </p>
                    </div>
                </header>

                <main className="px-12 pb-32 max-w-7xl mx-auto w-full space-y-32">

                    {/* ⚙️ What We Built (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Settings className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">What We Built</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Clinical Design", desc: "A precision-focused digital workspace with a flat, shadow-free system and 10px radius." },
                                { title: "Fluid Imports", desc: "A collapsible dropzone and unified navigation for seamless image and dataset syncing." },
                                { title: "Uninterrupted Stream", desc: "A continuous workspace view that eliminates intrusive popups and distracting banners." },
                                { title: "Team Connect", desc: "Interactive project and people pages with real-time hover previews and rich member cards." },
                                { title: "Contextual Insights", desc: "A specialized hover-card system for quick project and team insights without navigation." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-3 hover:border-slate-400 transition-colors">
                                    <h3 className="font-black text-lg text-slate-900 uppercase italic tracking-tight">{item.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 🧩 Core Features (Card Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Puzzle className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Core Features</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                                <div className="relative z-10 space-y-6">
                                    <Camera className="text-emerald-400" size={32} />
                                    <h3 className="text-3xl font-black tracking-tight italic uppercase">AI Sharpness Detection</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Each image is analyzed locally to determine clarity and focal accuracy, helping identify technically strong shots without manual pixel-peeping.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
                                <div className="relative z-10 space-y-6">
                                    <Heart className="text-pink-400" size={32} />
                                    <h3 className="text-3xl font-black tracking-tight italic uppercase">Emotion Recognition</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Advanced facial analysis highlights images with natural smiles and positive emotions, ensuring your selections resonate emotionally.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: <ShieldCheck className="text-blue-500" />, t: "Privacy First", d: "Computations run entirely in the browser—no uploads, no servers, no tracking." },
                                { icon: <Filter className="text-indigo-500" />, t: "Smart Filtering", d: "Dynamically adjust thresholds for 'Perfect' shots vs 'Rejects' in real-time." },
                                { icon: <Download className="text-emerald-500" />, t: "Bulk Export", d: "Instantly package and download your selections as a single ZIP archive." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">{item.icon}</div>
                                    <h4 className="font-black text-lg tracking-tight uppercase">{item.t}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 📊 Insights & Feedback (Section) */}
                    <section className="bg-white border border-slate-200 rounded-[4rem] p-16 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px]" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <BarChart3 className="text-blue-600" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600">Insights & Feedback</h2>
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter leading-tight">
                                    A streamlined Stats Board <br />
                                    for instant visual feedback.
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Color-coded metrics make scanning processed data fast and intuitive. Monitor total images, sharp vs. blurry balances, and emotion-based classifications at a glance.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase text-yellow-600">Total processed</span>
                                    <div className="h-2 w-12 bg-yellow-200 rounded-full" />
                                </div>
                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase text-emerald-600">Sharp Detection</span>
                                    <div className="h-2 w-16 bg-emerald-200 rounded-full" />
                                </div>
                                <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase text-red-600">Blurry Alert</span>
                                    <div className="h-2 w-8 bg-red-200 rounded-full" />
                                </div>
                                <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase text-pink-600">Happy Moments</span>
                                    <div className="h-2 w-20 bg-pink-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 🛠️ Technical Stack (Section) */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <Binary className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Technical Stack</h2>
                        </div>
                        <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 space-y-10">
                            <p className="text-lg text-slate-600 max-w-3xl font-medium leading-relaxed">
                                Id’a is built using a modern, high-performance frontend stack designed for fluid interactions and robust client-side AI processing.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {techStack.map((tech) => (
                                    <div key={tech.name} className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:scale-105 transition-transform">
                                        <div className={tech.color}>{tech.icon}</div>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-700">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 🚀 Final Outcome (Closing) */}
                    <footer className="pt-24 pb-12 border-t border-slate-100">
                        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                            <div className="space-y-6 max-w-2xl">
                                <h3 className="text-4xl font-black tracking-tight">The Result.</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    A fully functional, AI-assisted curation tool that runs entirely in the browser. It balances performance, privacy, and design clarity, giving photographers a powerful way to manage large image sets without compromising speed or user experience.
                                </p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/app'}
                                className="group px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center gap-4 hover:scale-105 active:scale-95 transition-all w-full lg:w-auto justify-center"
                            >
                                Launch Workspace
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default ProjectBriefPage;
