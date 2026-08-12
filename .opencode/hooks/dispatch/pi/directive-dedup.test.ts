import { afterEach, describe, expect, it } from "vitest";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import promptAdvisor, {
  PI_ADVISOR_DEBUG_FLAG,
  PI_DIRECTIVE_DEDUP_FLAG,
  decidePiDirectiveDelivery,
  formatPiAdvisorDebug,
  isPiAdvisorDebugEnabled,
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
  delete process.env[PI_ADVISOR_DEBUG_FLAG];
});

describe("decidePiDirectiveDelivery", () => {
  it("delivers the full brief on the first turn of a session", () => {
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d).toEqual({ suppressed: false });
  });

  it("suppresses the complete extension contribution on an identical repeat", () => {
    decidePiDirectiveDelivery(FULL, "s1");
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d).toEqual({ suppressed: true });
  });

  it("re-delivers full after a per-session lifecycle reset (resume/compact)", () => {
    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
    resetPiDirectiveDedupForSession("s1");
    const d = decidePiDirectiveDelivery(FULL, "s1");
    expect(d).toEqual({ suppressed: false });
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
  });

  it("dedups the advisor-failure fallback (directives-only) to once per boundary", () => {
    // The directives-only fallback has no advisor head, but its guardrail block
    // is still deduped: shown once, suppressed on identical repeats, and
    // re-armed by a lifecycle boundary. This keeps the operator-visible
    // directives off every headless-brief turn (the reported symptom) while a
    // compaction/resume still re-shows them.
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(true);
    resetPiDirectiveDedupForSession("s1");
    expect(decidePiDirectiveDelivery(FALLBACK, "s1").suppressed).toBe(false);
  });

  it("honours the kill-switch flag (fail-open to full)", () => {
    process.env[PI_DIRECTIVE_DEDUP_FLAG] = "0";
    expect(isPiDirectiveDedupEnabled()).toBe(false);
    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(false);
  });

  it("defaults enabled and isolates sessions from each other", () => {
    expect(isPiDirectiveDedupEnabled()).toBe(true);
    decidePiDirectiveDelivery(FULL, "s1");
    // s2's first turn is unaffected by s1's delivery.
    expect(decidePiDirectiveDelivery(FULL, "s2").suppressed).toBe(false);
    // s1's own repeat still suppresses.
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
  });
});

describe("lifecycle handlers reset the dedup state", () => {
  it("session_compact re-arms full delivery for the session", async () => {
    const { api, handlers } = makeApi();
    promptAdvisor(api);
    const compact = handlers.get("session_compact")?.[0];
    expect(typeof compact).toBe("function");

    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
    await compact!({}, ctxFor("s1"));
    // After a compaction the guardrail block is delivered in full again.
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(false);
  });

  it("session_start (resume) re-arms full delivery for the session", async () => {
    const { api, handlers } = makeApi();
    promptAdvisor(api);
    const start = handlers.get("session_start")?.[0];
    expect(typeof start).toBe("function");

    decidePiDirectiveDelivery(FULL, "s1");
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(true);
    await start!({ reason: "resume" }, ctxFor("s1"));
    expect(decidePiDirectiveDelivery(FULL, "s1").suppressed).toBe(false);
  });
});

describe("advisor-debug (opt-in cli-pi diagnostic)", () => {
  it("is disabled by default and honours the flag", () => {
    expect(isPiAdvisorDebugEnabled()).toBe(false);
    process.env[PI_ADVISOR_DEBUG_FLAG] = "1";
    expect(isPiAdvisorDebugEnabled()).toBe(true);
  });

  it("classifies the directives-only fallback as unavailable", () => {
    const line = formatPiAdvisorDebug(FALLBACK, false, 2503);
    expect(line).toContain("brief=fallback(unavailable)");
    expect(line).toContain("durationMs=2503");
  });

  it("classifies a live advisor head and its freshness", () => {
    // FULL begins with "Advisor: live; …" — the head case, advisor working.
    expect(formatPiAdvisorDebug(FULL, false, 118)).toContain("brief=head(live)");
  });

  it("classifies an import/throw advisor failure and an empty brief", () => {
    expect(formatPiAdvisorDebug(undefined, true, 5)).toContain("brief=failed");
    expect(formatPiAdvisorDebug("", false, 5)).toContain("brief=empty");
  });
});
