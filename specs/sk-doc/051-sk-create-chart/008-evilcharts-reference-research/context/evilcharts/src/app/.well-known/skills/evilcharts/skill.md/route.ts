import { generateSkillMd } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new Response(generateSkillMd(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
