import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ShieldCheck, Sparkles, ArrowRight, Zap, CloudOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="h-24 overflow-hidden group">
                        <img
                            src="/logo.png"
                            alt="Id'a Logo"
                            className="h-full object-contain mix-blend-screen brightness-150 group-hover:brightness-200 transition-all duration-500 scale-125 origin-left"
                        />
                    </div>
                </div>
                <Link
                    to="/app"
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl font-bold transition-all"
                >
                    Open App
                </Link>
            </nav>

            {/* Hero */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest">
                                <Sparkles size={14} />
                                Next-Gen Photo Intelligence
                            </span>
                            <h1 className="flex flex-col gap-4">
                                <span className="text-sm font-black tracking-[0.3em] text-yellow-500 uppercase">The Art of Selection</span>
                                <img
                                    src="/logo.png"
                                    alt="Id'a"
                                    className="h-32 w-fit object-contain mix-blend-screen brightness-125"
                                />
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed pt-2">
                                "As a photographer, the hardest part isn't taking the shot—it's finding it."
                                <br />
                                <span className="text-white/80 text-sm font-black uppercase tracking-widest mt-2 block">— By Aiita Lyslay Osoa</span>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Link
                                to="/app"
                                className="group relative w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
                            >
                                Launch Detector
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <div className="flex items-center gap-3 px-6 text-white/40 text-sm font-bold">
                                <ShieldCheck className="text-emerald-500" size={18} />
                                No data leaves your device
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5"
                        >
                            <div>
                                <div className="text-2xl font-black text-white">100%</div>
                                <div className="text-xs text-white/30 font-bold uppercase tracking-widest">On-Device</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">0s</div>
                                <div className="text-xs text-white/30 font-bold uppercase tracking-widest">Upload Time</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">Limitless</div>
                                <div className="text-xs text-white/30 font-bold uppercase tracking-widest">Processing</div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative hidden lg:block"
                    >
                        {/* Visual Teaser */}
                        <div className="relative aspect-square rounded-[4rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50" />
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&q=80"
                                alt="AI Analysis"
                                className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="space-y-4 w-full px-12">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl space-y-4 scale-90 translate-x-4 rotate-3">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-white/40 italic">Sharpness</span>
                                            <span className="text-xs font-black text-emerald-400">92 / 100</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[92%] h-full bg-emerald-400 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl space-y-4 translate-x-[-10px] rotate-[-2deg]">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-white/40 italic">Expression</span>
                                            <span className="text-xs font-black text-pink-400">Pure Joy</span>
                                        </div>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-black">98</span>
                                            <span className="text-[10px] text-white/30 font-bold mb-1">% SMILE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* The Story Section */}
            <section className="relative z-10 py-32 px-8 bg-black/20">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        The Story
                    </div>
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <h2 className="text-5xl font-black leading-tight tracking-tighter">
                            Meet <span className="text-yellow-400 italic">Id'a</span>.
                        </h2>
                        <div className="space-y-6 text-white/50 font-medium leading-relaxed">
                            <p>
                                In the <span className="text-white">Lugbara</span> language, the word for picture is simple and beautiful: <span className="text-yellow-400 font-bold italic">Id'a</span>.
                            </p>
                            <p>
                                This project started with a simple question from <span className="text-white">Aiita Lyslay Osoa</span> and <span className="text-white">Oguzu Stephen</span>:
                                <span className="italic"> "How can we make curation feel less like a chore and more like a craft?"</span>
                            </p>
                            <p>
                                Built as a labor of love for the photography community, <span className="text-white">Id'a</span> is designed to be fast, fun, and completely private. Because your art belongs to you—and only you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 bg-white/5 border-t border-white/5 py-32 px-8">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black">Ultimate Performance. Built For Privacy.</h2>
                        <p className="text-white/40 font-medium max-w-xl mx-auto">We've combined industry-standard edge detection with advanced neutral-network expression analysis.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-blue-400" />}
                            title="Real-Time Analysis"
                            description="Process hundreds of photos locally with our optimized batch engine. Zero buffering."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-emerald-400" />}
                            title="Local-First Tech"
                            description="Your photos never touch a server. All AI processing happens right in your GPU/CPU."
                        />
                        <FeatureCard
                            icon={<CloudOff className="text-indigo-400" />}
                            title="Work Offline"
                            description="Once the models are cached, you can curate your entire library without an internet connection."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-16 px-8 border-t border-white/5 text-center space-y-4">
                <div className="text-white/20 text-xs font-black uppercase tracking-widest">
                    &copy; 2024 ID'A • A project by Aiita Lyslay Osoa & Oguzu Stephen
                </div>
                <p className="text-white/10 text-[10px] font-bold italic max-w-md mx-auto">
                    Designed for photographers who value both their art and their privacy.
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/[0.07] transition-all">
        <div className="p-4 bg-white/5 rounded-2xl w-fit">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-white/40 text-sm font-medium leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
