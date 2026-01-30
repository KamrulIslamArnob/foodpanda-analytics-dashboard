import Link from "next/link";
import { Github, Linkedin, GitBranch } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 py-6 px-6 border-t border-zinc-100 bg-white/50 backdrop-blur-sm mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left: Author & Credits */}
                <div className="flex flex-col items-center md:items-start gap-0.5 order-2 md:order-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>Developed by</span>
                        <div className="flex items-center gap-2 ml-1">
                            <Link
                                href="https://github.com/KamrulIslamArnob"
                                target="_blank"
                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                                aria-label="GitHub Profile"
                            >
                                <Github className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/kamrulislamarnob/"
                                target="_blank"
                                className="text-zinc-400 hover:text-[#0077b5] transition-colors"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                        Kamrul Islam Arnob
                    </h3>
                </div>

                {/* Center: Source Code (Primary Action) */}
                <div className="flex flex-col items-center order-1 md:order-2">
                    <Link
                        href="https://github.com/KamrulIslamArnob/foodpanda-analytics-dashboard.git"
                        target="_blank"
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5
                       bg-zinc-900 text-zinc-50 
                       rounded-full font-medium text-xs antialiased 
                       shadow-[0_0_15px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.4)]
                       transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <GitBranch className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                        <span>Contribute / Source Code</span>
                    </Link>
                </div>

            </div>
        </footer>
    );
}
