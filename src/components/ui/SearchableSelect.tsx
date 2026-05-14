import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './index';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function SearchableSelect({ value, onChange, options, placeholder = "Buscar...", icon, className }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Display value: if open, show search term. If closed, show selected value.
    const displayValue = isOpen ? searchTerm : value;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputFocus = () => {
        setIsOpen(true);
        setSearchTerm(""); // Clear search when starting to type
    };

    return (
        <div className={cn("relative group", className)} ref={containerRef}>
            {/* Input Trigger */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                    {icon}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                    onFocus={handleInputFocus}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-[11px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 premium-shadow cursor-text"
                />
                <div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                        if (isOpen) setIsOpen(false);
                        else inputRef.current?.focus();
                    }}
                >
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onMouseDown={(e) => {
                                            // Use onMouseDown to trigger before onBlur of input
                                            e.preventDefault();
                                            onChange(option);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all text-left",
                                            value === option
                                                ? "bg-primary/10 text-primary"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-primary"
                                        )}
                                    >
                                        <span className="truncate">{option}</span>
                                        {value === option && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-[10px] text-slate-400 italic">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

