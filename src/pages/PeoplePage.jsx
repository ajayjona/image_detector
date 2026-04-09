import React, { useState } from 'react'; // Rebuild trigger
import Sidebar from '../components/Sidebar';
import { cn } from '../utils/utils';
import { Home, Users, Camera, Sparkles, ArrowRight, Heart } from 'lucide-react';

const PeoplePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    const members = [
        {
            name: "Aiita Lyslay Osoa",
            role: "Project Founder & Creative Lead",
            bio: "Visionary behind Id'a. Passionate about professional photography curation and the intersection of AI with creative workflows. Aiita leads the design language and core user experience of the platform.",
            avatar: "AL",
            color: "from-yellow-400 to-orange-500",
            socials: { github: "#", twitter: "#", linkedin: "#" }
        },
        {
            name: "Oguzu Stephen",
            role: "Lead AI Engineer & Technical Architect",
            bio: "Technical powerhouse driving the computer vision capabilities of Id'a. Stephen specializes in on-device AI models and ensuring high-performance image analysis directly in your browser.",
            avatar: "OS",
            color: "from-blue-500 to-indigo-600",
            socials: { github: "#", twitter: "#", linkedin: "#" }
        }
    ];

    return (
        <div className="flex h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
            <Sidebar
                isCollapsed={!isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto bg-[#fafaf9] scroll-smooth">
                {/* Header */}
                <header className="px-12 py-16 max-w-7xl mx-auto w-full space-y-4">
                    <div className="flex items-center gap-4 animate-fade-in">
                        <span className="h-px w-12 bg-slate-200"></span>
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">The Minds Behind Id'a</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                        A curation craft <br />
                        borne from <span className="text-blue-600 italic">collaboration.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed pt-4">
                        Id'a is more than just a tool—it's a shared vision for a faster, smarter, and more beautiful photography workflow.
                    </p>
                </header>

                <main className="px-12 pb-32 max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {members.map((member, index) => (
                            <div
                                key={member.name}
                                className="group relative bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 hover:shadow-slate-300/50 transition-all duration-500 overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {/* Decorative background element */}
                                <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 bg-gradient-to-br", member.color)} />

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500 bg-gradient-to-br",
                                            member.color
                                        )}>
                                            {member.avatar}
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                                <Camera size={18} />
                                            </button>
                                            <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                                <Users size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black tracking-tight text-slate-900">{member.name}</h2>
                                        <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {member.role}
                                        </div>
                                        <p className="text-slate-500 font-medium leading-relaxed pt-2">
                                            {member.bio}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <button className="flex items-center gap-3 text-slate-900 font-black text-sm group/btn">
                                            Get in touch
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-slate-900 group-hover/btn:text-white transition-all">
                                                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black tracking-tight">Interested in collaborating?</h3>
                                <p className="text-slate-400 font-medium max-w-md">We are always looking for ways to expand Id'a's capabilities and reach specialized photography workflows.</p>
                            </div>
                            <button className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/10 flex items-center gap-3 whitespace-nowrap">
                                <Sparkles size={18} className="text-blue-600" />
                                Contact the Team
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PeoplePage;
