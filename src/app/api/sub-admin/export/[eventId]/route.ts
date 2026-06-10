import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubAdminExportData } from "@/app/actions/reports";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "competition"; // 'competition' | 'school'
    const format = searchParams.get("format") || "csv"; // 'csv' | 'pdf'

    const data = await getSubAdminExportData(eventId);
    const { eventTitle, registrations } = data;

    if (format === "csv") {
        let csvContent = "";
        
        if (type === "competition") {
          const headers = ["School", "Faculty Coach Name", "Faculty Coach Email", "Competitors"];
          const rows = registrations.map(r => [
            `"${r.school.replace(/"/g, '""')}"`,
            `"${r.coachName.replace(/"/g, '""')}"`,
            `"${r.coachEmail.replace(/"/g, '""')}"`,
            `"${r.members.map(m => m.name).join(", ").replace(/"/g, '""')}"`
          ]);
          csvContent = `Competition: ${eventTitle}\n` + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        } else {
          const headers = ["ID", "Competitor's Name", "Competitor's Email", "Competitor's Competition Name", "Faculty Coach Name", "Faculty Coach Email"];
          const rows: string[][] = [];
          registrations.forEach(r => {
            r.members.forEach(m => {
              rows.push([
                `"${m.id.replace(/"/g, '""')}"`,
                `"${m.name.replace(/"/g, '""')}"`,
                `"${m.email.replace(/"/g, '""')}"`,
                `"${eventTitle.replace(/"/g, '""')}"`,
                `"${r.coachName.replace(/"/g, '""')}"`,
                `"${r.coachEmail.replace(/"/g, '""')}"`
              ]);
            });
          });
          csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        }

        return new NextResponse(csvContent, {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="${eventTitle}_${type}_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    }

    // PDF generation cannot be directly returned from an API route in this architecture
    // as it relies on client-side jsPDF. The button handles this client-side.
    return new NextResponse("PDF generation is handled client-side", { status: 400 });

  } catch (error) {
    return new NextResponse("Unauthorized or Error", { status: 401 });
  }
}
