import { getReportData } from "@/lib/excel";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

import { calculateDashboardStats } from "@/lib/stats";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const rawData = await getReportData();
  const initialStats = calculateDashboardStats(rawData);

  return (
    <main className="">
      <section className="w-full ">
        <DashboardContent initialStats={initialStats} />
      </section>
    </main>
  );
}
