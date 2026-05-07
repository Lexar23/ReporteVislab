"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Hammer, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReworkManager() {
    const [invoice, setInvoice] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice || !reason) return;

        // Simulate API call
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setInvoice("");
            setReason("");
        }, 3000);
    };

    return (
        <Card className="mt-8 border-amber-200 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-400">
                <Hammer className="w-5 h-5" />
                <h3 className="text-xl font-bold">Registro de Retrabajo</h3>
            </div>

            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium mb-1.5 opacity-70">Número de Factura</label>
                            <input
                                type="text"
                                value={invoice}
                                onChange={(e) => setInvoice(e.target.value)}
                                placeholder="Ex. 8738"
                                className="w-full px-4 py-2 rounded-xl border border-border bg-card focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1.5 opacity-70">Motivo del Retrabajo</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Describa el problema..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-border bg-card focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Registrar</span>
                                </button>
                            </div>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-4 text-emerald-600 dark:text-emerald-400"
                    >
                        <CheckCircle2 className="w-12 h-12 mb-2" />
                        <p className="font-bold">Retrabajo registrado exitosamente</p>
                        <p className="text-sm opacity-70 italic">La información ha sido guardada en la bitácora del sistema.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
