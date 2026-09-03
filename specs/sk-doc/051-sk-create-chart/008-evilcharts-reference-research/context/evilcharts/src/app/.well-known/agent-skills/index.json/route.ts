import { getAgentSkillsIndex } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return Response.json(getAgentSkillsIndex());
}
