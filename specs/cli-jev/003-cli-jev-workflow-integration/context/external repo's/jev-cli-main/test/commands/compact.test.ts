import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { askerFrom, compactFailed, runCompact } from "../../src/core/compact.js";
import { parseTranscript, sessionRecordToMessage } from "../../src/core/transcript.js";
import type { AskFn } from "../../src/provider.js";
import type { Message } from "../../src/vendor/compaction/types.js";
import { cliHarness } from "../helpers/cli.js";
import { fakeAsk, USAGE, yes } from "../helpers/fake-ask.js";

// ── fixtures ────────────────────────────────────────────────────────────────

function message(role: Message["role"], text: string, extra: Partial<Message> = {}): Message {
  return { role, text, toolUses: [], ...extra };
}
function call(id: string, tool: string, input: Record<string, unknown>, text?: string): Message {
  return message("assistant", "", {
    toolUses: [{ tool_use_id: id, tool, input, ...(text === undefined ? {} : { text }) }],
  });
}
function result(id: string, text: string, isError = false): Message {
  return message("user", "", { toolResults: [{ tool_use_id: id, text, isError }] });
}
const fileA = "export const a = 1;\n".repeat(50);
const fileB = "export const b = 2;\n".repeat(50);

/** 10 messages, 3 tool calls; with preserveRecent 4 the first two calls are candidates. */
function transcript(): Message[] {
  return [
    message("user", "Never edit anything under src/generated. Fix the failing test."),
    call("tool-1", "Read", { file_path: "src/a.ts" }),
    result("tool-1", fileA),
    message("assistant", "a.ts looks fine; checking b.ts"),
    call("tool-2", "Read", { file_path: "src/b.ts" }),
    result("tool-2", fileB),
    call("tool-3", "Bash", { command: "npm test" }),
    result("tool-3", "FAIL b.test.ts: expected 2 to be 3", true),
    message("assistant", "The failure is in b.test.ts; fixing now."),
    message("user", "go ahead"),
  ];
}

/** A Claude Code session record. */
function record(type: "user" | "assistant", content: unknown, extra: Record<string, unknown> = {}) {
  return JSON.stringify({ type, uuid: "u", sessionId: "s", message: { role: type, content }, ...extra });
}

const sessionJsonl = [
  JSON.stringify({ type: "mode", mode: "normal" }),
  record("user", "Fix the failing test."),
  record("assistant", [
    { type: "thinking", thinking: "..." },
    { type: "text", text: "Reading a.ts" },
    { type: "tool_use", id: "toolu_1", name: "Read", input: { file_path: "src/a.ts" } },
  ]),
  record("user", [{ type: "tool_result", tool_use_id: "toolu_1", content: fileA, is_error: false }], {
    toolUseResult: { stdout: "" },
  }),
  record("assistant", [{ type: "tool_use", id: "toolu_2", name: "Bash", input: { command: "npm test" } }]),
  record("user", [
    {
      type: "tool_result",
      tool_use_id: "toolu_2",
      content: [{ type: "text", text: "FAIL" }],
      is_error: true,
    },
  ]),
  record("assistant", [{ type: "text", text: "side" }], { isSidechain: true }),
  record("assistant", [{ type: "text", text: "Fixing." }]),
  record("user", "go ahead"),
].join("\n");

// ── core: transcript adapter ────────────────────────────────────────────────

describe("compact: transcript adapter", () => {
  test("maps Claude Code session records, skipping non-messages and sidechains", () => {
    const t = parseTranscript(sessionJsonl);
    expect(t.format).toBe("claude-code-jsonl");
    expect(t.skipped).toBe(2);
    expect(t.messages).toHaveLength(7);
    expect(t.messages[1]).toEqual({
      role: "assistant",
      text: "Reading a.ts",
      toolUses: [{ tool_use_id: "toolu_1", tool: "Read", input: { file_path: "src/a.ts" } }],
    });
    expect(t.messages[2]!.toolResults).toEqual([{ tool_use_id: "toolu_1", text: fileA, isError: false }]);
    expect(t.messages[4]!.toolResults).toEqual([{ tool_use_id: "toolu_2", text: "FAIL", isError: true }]);
  });

  test("messages JSON may omit text and toolUses; they default to empty", () => {
    const t = parseTranscript(
      JSON.stringify([
        { role: "user", text: "go" },
        { role: "assistant", toolUses: [{ tool_use_id: "t1", tool: "Read", input: {} }] },
        { role: "user", toolResults: [{ tool_use_id: "t1", text: "result" }] },
      ]),
    );
    expect(t.format).toBe("messages-json");
    expect(t.messages[0]!.toolUses).toEqual([]);
    expect(t.messages[2]!.text).toBe("");
    expect(t.messages[2]!.toolResults).toHaveLength(1);
  });

  test("accepts a messages JSON array and rejects other shapes", () => {
    const t = parseTranscript(JSON.stringify(transcript()));
    expect(t.format).toBe("messages-json");
    expect(t.messages).toHaveLength(10);
    expect(() => parseTranscript("[1,2]")).toThrow(/array of \{role/);
    expect(() => parseTranscript("")).toThrow(/empty/);
    expect(() => parseTranscript("{nope")).toThrow(/line 1 is not valid JSON/);
    expect(() => parseTranscript(JSON.stringify({ type: "mode" }))).toThrow(/no user or assistant/);
    expect(
      sessionRecordToMessage({ type: "assistant", message: { content: [{ type: "thinking" }] } }),
    ).toBeNull();
  });
});

// ── core: compaction through our AskFn ──────────────────────────────────────

describe("compact: core", () => {
  test("askerFrom adapts AskFn and accumulates usage across requests", async () => {
    const { ask } = fakeAsk({ x: yes(0.3) });
    const { asker, usage, meta } = askerFrom(ask);
    await asker.ask("s", { x: { type: "noul", instructions: "q" } });
    await asker.ask("s", { x: { type: "noul", instructions: "q" } });
    expect(usage).toEqual({ input_tokens: 20, output_tokens: 4 });
    expect(meta()).toEqual({ model: "jev-1.13.0", provider: "typesafe" });
  });

  test("keeps, truncates, or drops based on the two probabilities; pinned calls untouched", async () => {
    // t1 (Read a.ts): call stays, result stale -> truncate. t2 (Read b.ts): both stale -> drop. t3 is pinned.
    const { ask, calls } = fakeAsk({
      call_t1: yes(0.9),
      result_t1: yes(0.1),
      call_t2: yes(0.1),
      result_t2: yes(0.1),
    });
    const out = await runCompact(ask, {
      messages: transcript(),
      preserveRecentMessages: 4,
      truncateHeadChars: 40,
      minReduction: 0.25,
    });
    expect(calls).toHaveLength(1);
    expect(out.decisions.map((d) => [d.id, d.action, d.reason])).toEqual([
      ["t1", "drop_result", "result_dropped"],
      ["t2", "drop_call", "call_dropped"],
      ["t3", "keep", "pinned"],
    ]);
    expect(out.stats).toMatchObject({
      messagesBefore: 10,
      messagesAfter: 8,
      calls: 3,
      kept: 0,
      resultsDropped: 1,
      callsDropped: 1,
      pinned: 1,
      requests: 1,
    });
    expect(out.messages.map((m) => m.text || m.toolUses[0]?.tool || m.toolResults?.[0]?.tool_use_id)).toEqual(
      [
        "Never edit anything under src/generated. Fix the failing test.",
        "Read",
        "tool-1",
        "a.ts looks fine; checking b.ts",
        "Bash",
        "tool-3",
        "The failure is in b.test.ts; fixing now.",
        "go ahead",
      ],
    );
    const truncated = out.messages[2]!.toolResults![0]!.text;
    expect(truncated.startsWith(fileA.slice(0, 40))).toBe(true);
    expect(truncated).toMatch(/truncated \d+ chars/);
    expect(out.messages[0]).toBe(transcript()[0] === out.messages[0] ? out.messages[0] : out.messages[0]); // untouched objects are returned as-is
    expect(out.reduction).toBeGreaterThan(0.5);
    expect(out.worth_it).toBe(true);
    expect(compactFailed(out, ["low-reduction"])).toBe(false);
  });

  test("the state sent to Jev omits tool outputs and carries the goal", async () => {
    const { ask, calls } = fakeAsk((q) => Object.fromEntries(Object.keys(q).map((k) => [k, yes(1)])));
    await runCompact(ask, { messages: transcript(), preserveRecentMessages: 4, minReduction: 0.25 });
    const state = calls[0]!.state as {
      goal: string;
      history: Array<{ tool_calls?: Array<{ result: string }> }>;
    };
    expect(state.goal).toContain("Fix the failing test");
    expect(JSON.stringify(state)).not.toContain("export const a = 1");
    expect(state.history.find((h) => h.tool_calls)?.tool_calls?.[0]?.result).toMatch(
      /ok, \d+ chars \(omitted\)/,
    );
    expect(Object.keys(calls[0]!.questions).sort()).toEqual(["call_t1", "call_t2", "result_t1", "result_t2"]);
  });

  test("everything wanted kept means a tiny reduction, flagged not worth it", async () => {
    const { ask } = fakeAsk((q) => Object.fromEntries(Object.keys(q).map((k) => [k, yes(0.99)])));
    const out = await runCompact(ask, {
      messages: transcript(),
      preserveRecentMessages: 4,
      minReduction: 0.25,
    });
    expect(out.stats.kept).toBe(2);
    expect(out.reduction).toBe(0);
    expect(out.worth_it).toBe(false);
    expect(compactFailed(out, ["low-reduction"])).toBe(true);
  });

  test("no candidate calls means no request at all", async () => {
    const { ask, calls } = fakeAsk({});
    const out = await runCompact(ask, {
      messages: transcript(),
      preserveRecentMessages: 20,
      minReduction: 0.25,
    });
    expect(calls).toHaveLength(0);
    expect(out.stats.requests).toBe(0);
    expect(out.messages).toHaveLength(10);
  });

  test("malformed answers and empty transcripts throw", async () => {
    const { ask } = fakeAsk({ call_t1: { type: "noul", noul: "no" } });
    await expect(
      runCompact(ask, { messages: transcript(), preserveRecentMessages: 4, minReduction: 0.25 }),
    ).rejects.toThrow(/Invalid Jev answer/);
    await expect(runCompact(ask, { messages: [], minReduction: 0.25 })).rejects.toThrow(/no messages/);
  });

  test("question batches run bounded, not all at once", async () => {
    // 12 candidate calls and a request budget that leaves room for one call's
    // questions per request: the library awaits every batch together, so
    // without a limit all 12 would be in flight, each resending the state.
    const messages: Message[] = [message("user", "fix the failing test")];
    for (let i = 1; i <= 12; i++) {
      messages.push(call(`t${i}`, "Read", { file_path: `src/f${i}.ts` }), result(`t${i}`, "x".repeat(200)));
    }
    messages.push(message("assistant", "done"), message("user", "go ahead"));

    const track = () => {
      let inFlight = 0;
      let peak = 0;
      const ask: AskFn = async (_state, questions) => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await new Promise((resolve) => setTimeout(resolve, 1));
        inFlight -= 1;
        const answers = Object.fromEntries(Object.keys(questions).map((id) => [id, yes(0.9)]));
        return { answers, usage: USAGE, provider: "typesafe" as const, model: "jev-1.13.0" };
      };
      return { ask, peak: () => peak };
    };

    const options = { messages, minReduction: 0.25, preserveRecentMessages: 2, maxRequestTokens: 1500 };
    const limited = track();
    const out = await runCompact(limited.ask, { ...options, concurrency: 2 });
    expect(out.stats.requests).toBeGreaterThan(2);
    expect(limited.peak()).toBe(2);
    expect(out.decisions).toHaveLength(12);

    const wide = track();
    await runCompact(wide.ask, { ...options, concurrency: 64 });
    expect(wide.peak()).toBe(out.stats.requests);
  });
});

// ── cli ─────────────────────────────────────────────────────────────────────

describe("compact: cli", () => {
  // noul -> 0.05 by default: every candidate call and result is dropped
  const h = cliHarness({ call_t1: yes(0.9) });

  test("session JSONL in, decision table out, --out writes messages JSON", async () => {
    const file = join(h.dir(), "session.jsonl");
    writeFileSync(file, sessionJsonl);
    const out = join(h.dir(), "compacted.json");
    const r = await h.run(["compact", `@${file}`, "--preserve-recent", "2", "--out", out]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/^\d+% smaller/);
    expect(r.stdout).toMatch(/t1\s+Read\s+truncate\s+0\.90\s+0\.05/);
    expect(r.stdout).toMatch(/t2\s+Bash\s+drop/);
    expect(r.stdout).toContain("compacted messages written to");
    const written = JSON.parse(readFileSync(out, "utf8"));
    expect(Array.isArray(written)).toBe(true);
    expect(written.some((m: Message) => m.toolUses.some((t) => t.tool === "Bash"))).toBe(false);
  });

  test("--json includes stats, decisions, and messages; --fail-on low-reduction exits 2 when nothing changes", async () => {
    const r = await h.run(["compact", "-", "--preserve-recent", "4", "--json"], {
      stdin: JSON.stringify(transcript()),
    });
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.command).toBe("compact");
    expect(out.stats.calls).toBe(3);
    expect(out.decisions).toHaveLength(3);
    expect(out.messages.length).toBeLessThan(10);
    expect(out.usage.input_tokens).toBe(42);

    const same = await h.run(["compact", "-", "--preserve-recent", "20", "--fail-on", "low-reduction"], {
      stdin: JSON.stringify(transcript()),
    });
    expect(same.code).toBe(2);
    expect(same.stdout).toContain("below 25% minimum");
    expect(h.api().requests).toHaveLength(1); // only the first run asked Jev
  });

  test("--dry-run reports counts and the fitted state without calling the API", async () => {
    const r = await h.run(["compact", "-", "--dry-run", "--preserve-recent", "4"], {
      stdin: JSON.stringify(transcript()),
    });
    const d = JSON.parse(r.stdout);
    expect(d).toMatchObject({
      format: "messages-json",
      messages: 10,
      tool_calls: 3,
      candidates: 2,
      pinned: 1,
      state_stage: "full",
    });
    expect(d.state.history).toBeInstanceOf(Array);
    expect(h.api().requests).toHaveLength(0);
  });

  test("usage errors", async () => {
    expect((await h.run(["compact", "-"], { stdin: "[1]" })).stderr).toMatch(/array of \{role/);
    expect((await h.run(["compact", "-", "--keep-threshold", "2"], { stdin: "[]" })).stderr).toMatch(
      /--keep-threshold/,
    );
    expect((await h.run(["compact", "-", "--preserve-recent", "-1"], { stdin: "[]" })).stderr).toMatch(
      /--preserve-recent/,
    );
    expect((await h.run(["compact", "-", "--concurrency", "0"], { stdin: "[]" })).stderr).toMatch(
      /--concurrency must be an integer from 1 to 64/,
    );
    expect((await h.run(["compact", "-", "--concurrency", "65"], { stdin: "[]" })).stderr).toMatch(
      /--concurrency/,
    );
  });
});
