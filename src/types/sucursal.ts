export interface LensTypeStat {
    type: string;
    count: number;
    color: string;
}

export interface BranchData {
    branchName: string;
    sales: number;
    ordersCount: number;
    lensTypes: LensTypeStat[];
}

export interface BranchFilter {
    branch: string;
    year: number;
    months: number[];
}
