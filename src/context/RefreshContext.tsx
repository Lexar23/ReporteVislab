"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshContextType {
    isRefreshing: boolean;
    refreshData: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const refreshData = useCallback(() => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    }, [router]);

    return (
        <RefreshContext.Provider value={{ isRefreshing, refreshData }}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefresh() {
    const context = useContext(RefreshContext);
    if (context === undefined) {
        throw new Error('useRefresh must be used within a RefreshProvider');
    }
    return context;
}
