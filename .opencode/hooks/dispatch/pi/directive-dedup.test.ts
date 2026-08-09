import { afterEach, describe, expect, it } from "vitest";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import promptAdvisor, {
  PI_DIRECTIVE_DEDUP_FLAG,
  PI_SUBAGENT_DISPATCH_DIRECTIVE,
  assemblePiPromptText,
  decidePiDirectiveDelivery,
  isPiDirectiveDedupEnabled,
  resetPiDirectiveDedupForSession,
  resetPiDirectiveDedupState,
} from "../../../skills/system-skill-advisor/hooks/pi/prompt-advisor";

// Mirrors the real advisor brief shape: a per-turn "Advisor: …" route line,
// then the three constant directives under the "\nDirectives:" separator.
const HEAD = "Advisor: live; use sk-code 0.91/0.23 pass.";
const DIRECTIVES =
  "\nDirectives:\n- comment-hygiene [HARD BLOCK]: never embed ids\n- Governor: lead with the result\n- Proof over appearance: only real command output counts";
const FULL = `${HEAD}${DIRECTIVES}`;
// A brief whose directive text changed (e.g. a redeploy edited a directive).
const FULL_V2 = `${HEAD}${DIRECTIVES.replace("lead with the result", "lead with the verdict")}`;
// Advisor-failure fallback: directives only, no advisor head to keep.
const FALLBACK = "Directives:\n- comment-hygiene [HARD BLOCK]: never embed ids";
const FALLBACK_V2 = FALLBACK.replace("never embed ids", "write the durable reason");

type Handler = (event: any, ctx: any) => unknown;

function makeApi(): { api: ExtensionAPI; handlers: Map<string, Handler[]> } {
  const handlers = new Map<string, Handler[]>();
  const api = {
    on(event: string, handler: Handler) {
      const list = handlers.get(event) ?? [];
      list.push(handler);
      handlers.set(event, list);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

function ctxFor(sessionId: string) {
  return { cwd: "/tmp", sessionManager: { getSessionId: () => sessionId } };
}

afterEach(() => {
  resetPiDirectiveDedupState();
  delete process.env[PI_DIRECTIVE_DEDUP_FLAG];
});

describe("decidePiDirectiveDelivery", () => {
  it("delivers the full brief on the first turn of a session", () => {
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d.suppressed).toBe(false);
    expect(d.reducedContext).toBeNull();
  });

  it("suppresses the directive block on an identical repeat, keeping the route line", () => {
    decidePiDirectiveDelivery(FULL, "s1");
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d.suppressed).toBe(true);
    expect(d.reducedContext).toBe(HEAD);
    // The dropped part is exactly the constant directive block.
    expect(d.reducedContext).not.toContain("Directives:");
  });

  it("re-delivers full after a per-session lifecycle reset (resume/compact)", () => {
    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
    resetPiDirectiveDedupForSession("s1");
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d.suppressed).toBe(false);
    expect(d.reducedContext).toBeNull();
  });

  it("re-delivers full when the directive text changes (dirty content)", () => {
    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
    // Different directive content in the same session -> must re-deliver.
    expect(decidePiDirectiveDelivery(FULL_V2, "s1").suppressed).toBe(false);
    // Then the new content becomes eligible on its own repeat.
    expect(decidePiDirectiveDelivery(FULL_V2, "s1").suppressed).toBe(true);
  });

  it("never suppresses for an unknown session id (fail-open)", () => {
    expect(decidePiDirectiveDelivery(FULL, undefined).suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FULL, undefined).suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FULL, "").suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FALLBACK, undefined).suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FALLBACK, undefined).suppressed).toBe(false);
  });

  it("suppresses an identical advisor-failure fallback without retaining a route line", () => {
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
    const repeated = decidePiDirectiveDelivery(FALLBACK, "s1");
    expect(repeated.suppressed).toBe(true);
    expect(repeated.reducedContext).toBe("");
  });

  it("assembles a suppressed headless repeat as user text plus the dispatch directive only", () => {
    decidePiDirectiveDelivery(FALLBACK, "s1");
    const repeated = decidePiDirectiveDelivery(FALLBACK, "s1");
    const text = assemblePiPromptText("run the task", repeated.reducedContext);
    expect(text).toBe(`run the task\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`);
    expect(text).not.toContain("Directives:");
    expect(text).not.toContain("Advisor:");
  });

  it("re-delivers a changed advisor-failure fallback before suppressing its repeat", () => {
    decidePiDirectiveDelivery(FALLBACK, "s1");
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(true);
    expect(decidePiDirectiveDelivery(FALLBACK_V2, "s1").suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FALLBACK_V2, "s1").suppressed).toBe(true);
  });

  it.each(["0", "false", "off", "no"])("honours the %s kill-switch value", (value) => {
    process.env[PI_DIRECTIVE_DEDUP_FLAG] = value;
    expect(isPiDirectiveDedupEnabled()).toBe(false);
    decidePiDirectiveDelivery(FALLBACK, "s1");
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
  });

  it("defaults enabled and isolates sessions from each other", () => {
    expect(isPiDirectiveDedupEnabled()).toBe(true);
    decidePiDirectiveDelivery(FALLBACK, "s1");
    // s2's first turn is unaffected by s1's delivery.
    expect(decidePiDirectiveDelivery(FALLBACK, "s2").suppressed).toBe(false);
    // s1's own repeat still suppresses.
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(true);
  });
});

describe("lifecycle handlers reset the dedup state", () => {
  it("session_compact re-arms full delivery for the session", async () => {
    const { api, handlers } = makeApi();
    promptAdvisor(api);
    const compact = handlers.get("session_compact")?.[0];
    expect(typeof compact).toBe("function");

    decidePiDirectiveDelivery(FALLBACK, "s1");
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(true);
    await compact!({}, ctxFor("s1"));
    // After a compaction the guardrail block is delivered in full again.
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
  });

  it("session_start (resume) re-arms full delivery for the session", async () => {
    const { api, handlers } = makeApi();
    promptAdvisor(api);
    const start = handlers.get("session_start")?.[0];
    expect(typeof start).toBe("function");

    decidePiDirectiveDelivery(FALLBACK, "s1");
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(true);
    await start!({ reason: "resume" }, ctxFor("s1"));
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
  });
});
