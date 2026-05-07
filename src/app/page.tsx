import { getReportData } from "@/lib/excel";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const rawData = await getReportData();

  return (
    <main className="">

      <section className="w-full ">
        <DashboardContent initialData={rawData} />
      </section>
    </main>
  );
}
