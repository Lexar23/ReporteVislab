"use client";

import Link from "next/link";
import { FileBarChart2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
    return (
        <nav className="sticky top-0 left-0 right-0 z-50 w-full h-16 glass-panel px-6 shadow-lg shadow-black/5">
            <div className=" mx-auto h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/30 ring-2 ring-primary/20 glow-primary">
                        <FileBarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                        REPORTE<span className="text-gradient italic">Lab</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
