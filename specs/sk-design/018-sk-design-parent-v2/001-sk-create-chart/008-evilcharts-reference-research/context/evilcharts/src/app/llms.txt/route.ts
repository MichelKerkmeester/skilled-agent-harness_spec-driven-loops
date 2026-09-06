import { generateLlmsTxt } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new Response(generateLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
