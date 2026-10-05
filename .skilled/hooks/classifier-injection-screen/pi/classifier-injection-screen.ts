// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Injection Screen
// ───────────────────────────────────────────────────────────────────
// Pi has no built-in fetch tool; the pi-web-access package registers
// `fetch_content`, whose result is a content block array. This adapter
// screens those fetched blocks for instructions aimed at the agent and,
// when the screen flags, appends one advisory text block to the tool
// result -- the model call being answered is the model call that reads
// the fetched text, so the warning lands beside it.
//
// Advisory only and fail open: a screen error, a blank payload or a
// disabled hook returns undefined, leaving the fetched result untouched.
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isHookEnabled } from "../../.skilled/hooks/shared/hook-flags.mjs";
import { fetchedText, screenAdvisory } from "../../.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs";

const FETCH_TOOL = "fetch_content";

type InjectionScreenOptions = {
  screenAdvisory?: typeof screenAdvisory;
};

/** Appends the injection-screen advisory to a `fetch_content` tool result. */
export default function injectionScreen(pi: ExtensionAPI, options: InjectionScreenOptions = {}): void {
  if (!isHookEnabled("injection-screen")) return undefined;
  const screen = typeof options.screenAdvisory === "function" ? options.screenAdvisory : screenAdvisory;
  pi.on("tool_result", async (event) => {
    try {
      if (event.toolName !== FETCH_TOOL) return;
      const advisory = await screen(fetchedText(event.content));
      if (typeof advisory !== "string" || advisory.length === 0) return;
      return { content: [...event.content, { type: "text", text: advisory }] };
    } catch {
      // Fail open because a screen bug must never alter the fetch it observes.
      return undefined;
    }
  });
}
