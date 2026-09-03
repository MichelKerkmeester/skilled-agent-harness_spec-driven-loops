import { generateLlmsFullTxt } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return new Response(await generateLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
