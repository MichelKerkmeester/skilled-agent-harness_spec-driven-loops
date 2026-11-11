import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type Guard = typeof import("../../.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs");
type Watch = typeof import("../../.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs");

async function load(): Promise<{ guard: Guard; watch: Watch }> {
  const guard = await import("../../.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs");
  const watch = await import("../../.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs");
  return { guard: guard.default ?? guard, watch: watch.default ?? watch };
}

// Fail open because a guard bug must never block a call it could not judge,
// but say so, or a broken core would leave every call unguarded in silence.
function warn(error: unknown): undefined {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`env-secret-guard: allowing an unjudged call: ${message}\n`);
  return undefined;
}

export default function envSecretGuard(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      const { guard, watch } = await load();
      if (!guard.isGuardEnabled()) return undefined;
      const result = guard.evaluateToolCall({ tool: event.toolName, input: event.input, cwd: ctx.cwd });
      if (result.decision === "deny") return { block: true, reason: result.reason };
      if (guard.SHELL_TOOLS.has(String(event.toolName).toLowerCase())) watch.snapshotDotenv(ctx.cwd);
    } catch (error) {
      return warn(error);
    }
    return undefined;
  });

  // After the call: undo a dotenv write and take a dotenv value out of the
  // result before the model reads it.
  pi.on("tool_result", async (event, ctx) => {
    try {
      const { guard, watch } = await load();
      if (!guard.isGuardEnabled()) return undefined;
      const review = watch.reviewToolResult({ tool: event.toolName, output: event.content, cwd: ctx.cwd });
      if (!review.message) return undefined;
      const content = event.content.map((part) => (
        part.type === "text" ? { ...part, text: review.redact(part.text) } : part
      ));
      return { content: [...content, { type: "text", text: review.message }] };
    } catch (error) {
      return warn(error);
    }
  });
}
