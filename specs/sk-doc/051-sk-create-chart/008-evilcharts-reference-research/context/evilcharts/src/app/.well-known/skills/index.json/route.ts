export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return Response.json({
    skills: [
      {
        name: "evilcharts",
        description: "Add and customize EvilCharts chart components in shadcn/ui and Recharts projects.",
        files: ["skill.md"],
      },
    ],
  });
}
