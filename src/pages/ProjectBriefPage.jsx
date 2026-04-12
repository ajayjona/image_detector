import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { cn } from '../utils/utils';
import { BookOpen, Sparkles, Zap, ShieldCheck, Heart, ArrowRight, Camera, Filter, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectBriefPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    const pillars = [
        {
            icon: <Zap size={24} />,
            title: "Smart Curation",
            description: "Id'a uses high-precision AI to 'see' focus and emotion. It instantly benchmarks thousands of images, identifying the sharpest focal points and the warmest smiles while filtering out technical errors.",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            icon: <ShieldCheck size={24} />,
            title: "Absolute Privacy",
            description: "Built for professional integrity. Your photos never touch a cloud or a server. All AI analysis happens 100% locally in your browser, ensuring your client work remains entirely private.",
            color: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            icon: <Terminal size={24} />,
            title: "Local Speed",
            description: "By utilizing on-device hardware acceleration, Id'a processes images with near-zero latency. No more waiting for uploads or server response times.",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        }
    ];

    return (
        <div className="flex h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
            <Sidebar
                isCollapsed={!isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto bg-[#fafaf9] scroll-smooth">
                {/* Header Section */}
                <header className="px-12 pt-24 pb-16 max-w-7xl mx-auto w-full space-y-8 animate-fade-in text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between border-b border-slate-100 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-blue-600 justify-center lg:justify-start">
                                <Sparkles size={20} />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Project Narrative</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.85]">
                                The Art of <br />
                                <span className="text-blue-600 italic">Curation.</span>
                            </h1>
                        </div>
                        <div className="max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 text-left">
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Id'a was born from a simple realization: photographers spend too much time sorting and not enough time creating. We built a tool that handles the "heavy lifting" of technical vetting.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-12 pb-32 max-w-7xl mx-auto w-full space-y-24">
                    {/* Vision Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-6 group hover:border-slate-300 transition-all"
                            >
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", pillar.color)}>
                                    {pillar.icon}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{pillar.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        ))}
                    </section>

                    {/* How it works Section */}
                    <section className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <h3 className="text-4xl font-black tracking-tighter leading-tight">
                                    How Id'a sees <br />
                                    your work.
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Camera size={18} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">Input Agnostic</h4>
                                            <p className="text-slate-400 text-sm font-medium">Drop JPEG, PNG, or WebP files from any session—weddings, portraits, or lifestyle shoots.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Filter size={18} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">Real-time Benchmarking</h4>
                                            <p className="text-slate-400 text-sm font-medium">Our AI analyzes every pixel locally to determine sharpness scores and emotional warmth.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Heart size={18} className="text-pink-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">The Perfect Selection</h4>
                                            <p className="text-slate-400 text-sm font-medium">Export only what matters. ZIP your 'Perfects' and leave the 'Rejects' behind.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 aspect-square flex flex-col justify-center gap-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">The Human Factor</span>
                                    <h4 className="text-2xl font-black">A Tool, not a Replacement.</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        We didn't build Id'a to choose your art for you. We built it to clear the technical clutter so you can actually enjoy your creative process.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/app'}
                                    className="w-fit px-8 py-4 bg-white text-slate-900 rounded-[2rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm"
                                >
                                    Launch Workplace
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Footer Story */}
                    <footer className="max-w-3xl mx-auto text-center space-y-8 pb-12">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                            <BookOpen size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight italic">Simplified Workflow. Amplified Art.</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Id'a is a collaborative project dedicated to the photography community. It represents our belief that AI should be a transparent, high-performance assistant that respects its user's hardware and privacy.
                        </p>
                        <div className="pt-12 flex flex-col items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">A Project by Aiita Lyslay & Oguzu Stephen</span>
                            <div className="flex gap-4">
                                <img src="/lyslay.jpeg" className="w-10 h-10 rounded-full grayscale opacity-50 border border-slate-200" />
                                <img src="/Oguzu.jpeg" className="w-10 h-10 rounded-full grayscale opacity-50 border border-slate-200" />
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default ProjectBriefPage;
