// The Claude Code compaction hook, driven without an engine.

import type { SessionMessage } from "claude-code";
import { describe, expect, test } from "vitest";
import { applyDecisions, collectToolCalls, decideCall } from "../../plugin/hooks/compaction/index.ts";
import type { Message } from "../../plugin/hooks/compaction/types.ts";
import {
  compactSession,
  decisionLog,
  decisionLogLines,
  type HookFetch,
  limitAsker,
  resolveHookConfig,
  summarize,
  toSessionMessages,
} from "../../plugin/hooks/fast-jev.ts";

function message(role: Message["role"], text: string, extra: Partial<SessionMessage> = {}): SessionMessage {
  return { role, text, toolUses: [], ...extra };
}
function call(id: string, tool: string, input: Record<string, unknown>, text: string): SessionMessage {
  return message("assistant", "", { toolUses: [{ tool_use_id: id, tool, input, text }], handle: `h-${id}` });
}
function result(id: string, text: string, isError = false): SessionMessage {
  return message("user", "", { toolResults: [{ tool_use_id: id, text, isError }], handle: `r-${id}` });
}
const fileA = "export const a = 1;\n".repeat(50);

function transcript(): SessionMessage[] {
  return [
    message("user", "Fix the failing test.", { handle: "h-0" }),
    call("tool-1", "Read", { file_path: "src/a.ts" }, fileA),
    result("tool-1", fileA),
    call("tool-2", "Bash", { command: "npm test" }, "FAIL"),
    result("tool-2", "FAIL b.test.ts: expected 2 to be 3", true),
    message("assistant", "Fixing now.", { handle: "h-5" }),
    message("user", "go ahead", { handle: "h-6" }),
  ];
}

/** A fetch that answers every question with the given probability and records the calls. */
function fetchAnswering(p: number, seen: Array<{ url: string; body: unknown }> = []): HookFetch {
  return async (url, init) => {
    const body = JSON.parse(init?.body ?? "{}");
    seen.push({ url, body });
    const answers = Object.fromEntries(
      Object.keys(body.questions).map((k) => [k, { type: "noul", noul: p }]),
    );
    return {
      status: 200,
      ok: true,
      text: JSON.stringify({ model: "jev-1.13.0", answers, usage: { input_tokens: 1, output_tokens: 0 } }),
    };
  };
}

describe("hook config", () => {
  test("reads userConfig values, defaults the rest, honors the master switch", () => {
    const c = resolveHookConfig({
      keepThreshold: 0.7,
      compactAtPercent: 80,
      model: "jev-1.13.0",
      apiKey: "k",
      goal: "g",
    });
    expect(c).toMatchObject({
      enabled: true,
      keepThreshold: 0.7,
      compactAtPercent: 80,
      minReductionRatio: 0.25,
      model: "jev-1.13.0",
      apiKey: "k",
      goal: "g",
    });
    expect(c.preserveRecentMessages).toBeUndefined();
    expect(resolveHookConfig({ compaction: false }).enabled).toBe(false);
    expect(resolveHookConfig({ keepThreshold: Number.NaN }).keepThreshold).toBeUndefined();
  });
});

describe("session message mapping", () => {
  test("returns engine objects for untouched messages and handle-less copies for rebuilt ones", () => {
    const input = transcript();
    const calls = collectToolCalls(input, 2);
    const decisions = calls.map((c) =>
      decideCall(c, c.id === "t1" ? { keepCall: 1, keepResult: 0 } : { keepCall: 0, keepResult: 0 }, {
        keepThreshold: 0.5,
      }),
    );
    const output = applyDecisions(input, decisions, calls, 50);
    const mapped = toSessionMessages(input, output);
    expect(mapped[0]).toBe(input[0]);
    expect(mapped[0]!.handle).toBe("h-0");
    const rebuiltResult = mapped.find((m) => m.toolResults?.[0]?.tool_use_id === "tool-1")!;
    expect(rebuiltResult.handle).toBeUndefined();
    expect(rebuiltResult.toolResults![0]!.text).toMatch(/truncated/);
    expect(mapped.some((m) => m.toolUses.some((t) => t.tool_use_id === "tool-2"))).toBe(false);
    expect(mapped.at(-1)).toBe(input.at(-1));
  });
});

describe("compactSession", () => {
  test("runs the library over the engine fetch and reports the outcome", async () => {
    const seen: Array<{ url: string; body: { model: string } }> = [];
    const config = { ...resolveHookConfig({ preserveRecentMessages: 2 }), apiKey: "k" };
    const { result, messages } = await compactSession(transcript(), config, fetchAnswering(0.05, seen));
    expect(seen).toHaveLength(1);
    expect(seen[0]!.url).toContain("api.typesafe.ai");
    expect(seen[0]!.body.model).toBe("jev-latest");
    expect(result.stats.callsDropped).toBe(2);
    expect(messages).toHaveLength(3);
    expect(summarize(result)).toMatch(
      /^\d+% reduction; 2 calls dropped; state ~\d+ tokens \(full\) in 1 request\(s\)$/,
    );
    expect(decisionLog(result)).toMatch(/^t1:Read:drop_call\/call=0\.05\/result=0\.05 t2:Bash:drop_call/);
  });

  test("splits a long decision log into lines under the host limit", async () => {
    const config = { ...resolveHookConfig({ preserveRecentMessages: 2 }), apiKey: "k" };
    const { result } = await compactSession(transcript(), config, fetchAnswering(0.9));
    const lines = decisionLogLines(result, 80);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toMatch(/^jev compact decisions \(1\/\d+\): /);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(80);
  });

  test("limitAsker keeps at most `concurrency` requests in flight", async () => {
    let inFlight = 0;
    let peak = 0;
    const asker = limitAsker(
      {
        async ask() {
          inFlight += 1;
          peak = Math.max(peak, inFlight);
          // No timers here: the hook tsconfig has no host types.
          await Promise.resolve();
          await Promise.resolve();
          inFlight -= 1;
          return { answers: {}, model: "jev-1.13.0", usage: { input_tokens: 1, output_tokens: 0 } };
        },
      },
      2,
    );
    await Promise.all(Array.from({ length: 7 }, () => asker.ask("s", {})));
    expect(peak).toBe(2);
    expect(resolveHookConfig({}).concurrency).toBe(4);
    expect(resolveHookConfig({ concurrency: 0 }).concurrency).toBe(1);
    expect(resolveHookConfig({ concurrency: 500 }).concurrency).toBe(64);
  });

  test("throws on a missing key and on failed requests so the hook falls back", async () => {
    const config = resolveHookConfig({});
    await expect(compactSession(transcript(), config, fetchAnswering(0.5))).rejects.toThrow(
      /TYPESAFE_API_KEY/,
    );
    const failing: HookFetch = async () => ({ status: 500, ok: false, text: "boom" });
    // preserveRecentMessages must leave a candidate, otherwise no request is made and nothing can fail
    const withCandidates = { ...config, apiKey: "k", preserveRecentMessages: 2 };
    await expect(compactSession(transcript(), withCandidates, failing)).rejects.toThrow(
      /Jev request failed \(500\)/,
    );
  });
});
