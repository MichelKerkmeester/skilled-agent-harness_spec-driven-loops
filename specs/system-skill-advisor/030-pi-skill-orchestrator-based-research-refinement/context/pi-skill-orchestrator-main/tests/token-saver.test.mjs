import test from "node:test";
import assert from "node:assert/strict";
import {
  TOKEN_RETRIEVE_TOOL,
  TOKEN_SAVER_GUIDANCE,
  TokenSaverEngine,
  clampRoutineProviderEffort,
  compactProviderToolDescriptions,
  isRoutineToolContinuation,
  rankDeferredTools,
  sanitizeToolMetadataText,
  updateRoutineContinuationState,
} from "../src/token-saver.ts";

function longLines(prefix, count, suffix = "") {
  return Array.from({ length: count }, (_, index) => `${prefix} ${index} ${suffix}`.trim()).join("\n");
}

test("token saver is deterministic and leaves short tool output alone", () => {
  const engine = new TokenSaverEngine();
  const result = engine.compress("bash", { command: "echo hello" }, "hello\n", false);
  assert.equal(result.changed, false);
  assert.equal(result.text, "hello\n");
  assert.equal(engine.stats().compressions, 0);
});

test("skill tool output is never compacted because loaded instructions must remain exact", () => {
  const engine = new TokenSaverEngine();
  const body = longLines("skill instruction line", 300);
  assert.equal(engine.compress("skill", {}, body).changed, false);
  assert.equal(engine.compress("skill_search", {}, body).changed, false);
  assert.equal(engine.compress(TOKEN_RETRIEVE_TOOL, {}, body).changed, false);
});

test("JSON smart crushing keeps boundaries, errors, relevance, outliers, and factors constants", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("database latency customer 77");
  const rows = Array.from({ length: 140 }, (_, index) => ({
    host: "prod-1",
    service: "api",
    index,
    customer: index === 77 ? 77 : index,
    latency_ms: index === 93 ? 9900 : 42 + (index % 3),
    status: index === 61 ? "ERROR database timeout" : "ok",
    message: index === 77 ? "customer 77 database latency" : `normal sample ${index}`,
  }));
  const original = JSON.stringify({ results: rows }, null, 2);
  const result = engine.compress("api_query", {}, original);
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "json");
  assert.match(result.text, /"host": "prod-1"/);
  assert.match(result.text, /ERROR database timeout/);
  assert.match(result.text, /customer 77 database latency/);
  assert.match(result.text, /9900/);
  assert.match(result.text, /original_items/);
  assert.match(result.text, /full=[0-9a-f]{24}/);
  assert.ok(result.savedChars > 0);
});

test("reversible recovery returns exact original lines and supports paging", () => {
  const engine = new TokenSaverEngine();
  const original = longLines("repeated build output", 260, "same diagnostic payload padding padding padding");
  const compressed = engine.compress("bash", { command: "npm test" }, original);
  assert.equal(compressed.changed, true);
  assert.ok(compressed.id);
  const first = engine.retrieve(compressed.id, 1, 17);
  assert.ok(first);
  assert.equal(first.startLine, 1);
  assert.equal(first.endLine, 17);
  assert.equal(first.hasMore, true);
  assert.equal(first.nextStartLine, 18);
  assert.equal(first.text, original.split("\n").slice(0, 17).join("\n"));
  const second = engine.retrieve(compressed.id, first.nextStartLine, 17);
  assert.equal(second.text, original.split("\n").slice(17, 34).join("\n"));
  assert.equal(engine.stats().retrievals, 2);
});

test("exact repeated tool output collapses to a reversible cross-turn reference", () => {
  const engine = new TokenSaverEngine();
  const text = Array.from({ length: 180 }, (_, index) => `INFO worker heartbeat id=${index % 3} stable stable stable stable`).join("\n");
  const first = engine.compress("bash", { command: "docker logs app" }, text);
  const second = engine.compress("bash", { command: "docker logs app" }, text);
  assert.equal(first.changed, true);
  assert.equal(second.changed, true);
  assert.equal(second.strategy, "dedupe");
  assert.match(second.text, /exact bash output already appeared/i);
  assert.ok(second.text.length < first.text.length);
  assert.ok(engine.retrieve(second.id));
  assert.equal(engine.stats().byStrategy.dedupe.count, 1);
});

test("same large output with a different query still deduplicates instead of paying again", () => {
  const engine = new TokenSaverEngine();
  const text = Array.from({ length: 200 }, (_, index) => `src/file.ts:${index}: repeated searchable result padding padding`).join("\n");
  engine.setQuery("first question");
  const first = engine.compress("grep", { pattern: "result" }, text);
  assert.equal(first.changed, true);
  engine.setQuery("completely different question");
  const second = engine.compress("grep", { pattern: "result" }, text);
  assert.equal(second.strategy, "dedupe");
  assert.ok(engine.retrieve(second.id));
});

test("log compression strips ANSI/progress noise and collapses repeated patterns", () => {
  const engine = new TokenSaverEngine();
  const lines = [];
  for (let index = 0; index < 120; index += 1) {
    lines.push(`\u001b[32mINFO\u001b[0m worker ready request ${10000 + index}`);
    if (index % 20 === 0) lines.push("[==========>        ] 50%");
  }
  lines.splice(73, 0, "ERROR database connection refused");
  const result = engine.compress("bash", { command: "docker logs api" }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "log");
  assert.doesNotMatch(result.text, /\u001b/);
  assert.match(result.text, /ERROR database connection refused/);
  assert.match(result.text, /×/);
});

test("test compression focuses on failures and summary instead of passing-test spam", () => {
  const engine = new TokenSaverEngine();
  const lines = Array.from({ length: 130 }, (_, index) => `PASS tests/unit-${index}.test.ts`);
  lines.splice(70, 0,
    "FAIL tests/database.test.ts",
    "AssertionError: expected 200 but got 500",
    "    at tests/database.test.ts:44:3",
    "Test Suites: 1 failed, 129 passed, 130 total",
  );
  const result = engine.compress("bash", { command: "npm test" }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "test");
  assert.match(result.text, /FAIL tests\/database/);
  assert.match(result.text, /AssertionError/);
  assert.match(result.text, /1 failed, 129 passed/);
  assert.ok(result.text.length < lines.join("\n").length);
});

test("search compression groups matches by file and preserves query-relevant/error lines", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("authentication token validation");
  const lines = [];
  for (let file = 0; file < 10; file += 1) {
    for (let line = 1; line <= 45; line += 1) {
      const message = file === 4 && line === 33
        ? "authentication token validation failed"
        : `ordinary match ${line}`;
      lines.push(`src/file${file}.ts:${line}:${message}`);
    }
  }
  const result = engine.compress("grep", { pattern: "token" }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "search");
  assert.match(result.text, /src\/file4\.ts/);
  assert.match(result.text, /authentication token validation failed/);
  assert.match(result.text, /matches; showing/);
});

test("diff compression keeps file and hunk headers plus changed lines", () => {
  const engine = new TokenSaverEngine();
  const chunks = ["diff --git a/src/a.ts b/src/a.ts", "--- a/src/a.ts", "+++ b/src/a.ts", "@@ -1,120 +1,120 @@"];
  for (let index = 0; index < 120; index += 1) {
    if (index === 55) chunks.push("-const timeout = 1000;", "+const timeout = 5000;");
    else chunks.push(` context line ${index}`);
  }
  const result = engine.compress("bash", { command: "git diff" }, chunks.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "diff");
  assert.match(result.text, /diff --git/);
  assert.match(result.text, /@@ -1,120/);
  assert.match(result.text, /-const timeout = 1000/);
  assert.match(result.text, /\+const timeout = 5000/);
});

test("long source reads become an explicit outline that preserves imports and signatures", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("validateOrder");
  const lines = ["import { db } from './db.js';", "export interface Order { id: string }", ""];
  for (let fn = 0; fn < 18; fn += 1) {
    lines.push(`export function helper${fn}(value: string) {`);
    for (let line = 0; line < 18; line += 1) lines.push(`  const local${line} = value + '${line}';`);
    lines.push("  return value;", "}", "");
  }
  lines.push("export function validateOrder(order: Order) {", "  if (!order.id) throw new Error('missing id');", "  return true;", "}");
  const result = engine.compress("read", { path: "src/orders.ts" }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "code");
  assert.match(result.text, /source outline/);
  assert.match(result.text, /import \{ db \}/);
  assert.match(result.text, /function helper0/);
  assert.match(result.text, /function validateOrder/);
  assert.match(result.text, /lines omitted/);
});

test("large directory listings keep useful edges while dropping bulk inventory", () => {
  const engine = new TokenSaverEngine();
  const lines = ["project/"];
  for (let index = 0; index < 220; index += 1) lines.push(`  tmp/generated-${index}.dat`);
  lines.splice(100, 0, "  src/main.ts", "  tests/main.test.ts", "  package.json");
  const result = engine.compress("ls", { path: "." }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "tree");
  assert.match(result.text, /src\/main\.ts/);
  assert.match(result.text, /package\.json/);
});

test("markdown tables preserve headers, relevant rows, and edge rows", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("critical invoice");
  const lines = ["| id | state | note |", "|---|---|---|"];
  for (let index = 0; index < 100; index += 1) {
    lines.push(`| ${index} | ok | ${index === 64 ? "critical invoice needs review" : "normal"} |`);
  }
  const result = engine.compress("read", { path: "report.md" }, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "table");
  assert.match(result.text, /\| id \| state \| note \|/);
  assert.match(result.text, /critical invoice needs review/);
});

test("generic text keeps headings, warnings, and query-relevant lines", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("renew certificate production");
  const lines = ["# Operations Guide"];
  for (let index = 0; index < 180; index += 1) lines.push(`background explanation paragraph ${index} filler filler filler`);
  lines.splice(90, 0, "## Certificate Rotation", "WARNING production certificate expires Friday", "Run renew certificate after approval");
  const result = engine.compress("web_search", {}, lines.join("\n"));
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "text");
  assert.match(result.text, /# Operations Guide/);
  assert.match(result.text, /Certificate Rotation/);
  assert.match(result.text, /WARNING production certificate/);
  assert.match(result.text, /renew certificate/);
});

test("large error output preserves fatal and assertion detail", () => {
  const engine = new TokenSaverEngine();
  const lines = Array.from({ length: 200 }, (_, index) => `debug step ${index} filler filler filler`);
  lines.splice(100, 0, "FATAL database migration failed", "AssertionError: schema mismatch", "at migrate.ts:99:7");
  const result = engine.compress("bash", { command: "npm run migrate" }, lines.join("\n"), true);
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "error");
  assert.match(result.text, /FATAL database migration failed/);
  assert.match(result.text, /AssertionError: schema mismatch/);
});

test("session stats report only actual compacted content and estimated token savings", () => {
  const engine = new TokenSaverEngine();
  engine.compress("bash", { command: "echo" }, "small");
  const text = Array.from({ length: 180 }, () => "INFO same same same same same same").join("\n");
  const result = engine.compress("bash", { command: "docker logs x" }, text);
  assert.equal(result.changed, true);
  const stats = engine.stats();
  assert.equal(stats.compressions, 1);
  assert.equal(stats.originalChars, result.originalChars);
  assert.equal(stats.compressedChars, result.compressedChars);
  assert.equal(stats.savedChars, result.savedChars);
  assert.equal(stats.estimatedTokensSaved, Math.ceil(result.savedChars / 4));
  assert.equal(stats.byStrategy.log.count, 1);
});

test("clear drops recovery data, feedback, and counters without throwing", () => {
  const engine = new TokenSaverEngine();
  const text = Array.from({ length: 180 }, () => "INFO duplicate output padding padding padding").join("\n");
  const result = engine.compress("bash", { command: "docker logs x" }, text);
  assert.equal(result.changed, true);
  assert.ok(engine.retrieve(result.id));
  engine.clear();
  assert.equal(engine.retrieve(result.id), null);
  assert.equal(engine.stats().compressions, 0);
  assert.equal(engine.stats().storedEntries, 0);
});

test("routine continuation detection is conservative and never reduces effort after errors", () => {
  assert.equal(isRoutineToolContinuation("read", { path: "x.ts" }, "contents"), true);
  assert.equal(isRoutineToolContinuation("grep", { pattern: "x" }, "match"), true);
  assert.equal(isRoutineToolContinuation("bash", { command: "git status" }, "clean"), true);
  assert.equal(isRoutineToolContinuation("bash", { command: "npm test" }, "PASS 10 tests"), true);
  assert.equal(isRoutineToolContinuation("bash", { command: "deploy production" }, "done"), false);
  assert.equal(isRoutineToolContinuation("read", {}, "ERROR permission denied"), false);
  assert.equal(isRoutineToolContinuation("read", {}, "contents", true), false);
});

test("provider effort routing is clamp-only and does not invent provider fields", () => {
  const untouched = { model: "x", messages: [] };
  const noFields = clampRoutineProviderEffort(untouched);
  assert.equal(noFields.changed, false);
  assert.equal(noFields.payload, untouched);

  const input = {
    model: "x",
    reasoning_effort: "high",
    reasoning: { effort: "medium", summary: "auto" },
    output_config: { effort: "max", format: "text" },
    thinking: { type: "enabled", budget_tokens: 8000 },
  };
  const result = clampRoutineProviderEffort(input);
  assert.equal(result.changed, true);
  assert.equal(result.payload.reasoning_effort, "low");
  assert.equal(result.payload.reasoning.effort, "low");
  assert.equal(result.payload.reasoning.summary, "auto");
  assert.equal(result.payload.output_config.effort, "low");
  assert.equal(result.payload.output_config.format, "text");
  assert.equal(result.payload.thinking.budget_tokens, 1024);
  assert.equal(input.reasoning_effort, "high", "input payload must not be mutated");
});

test("provider effort routing never raises already-low effort", () => {
  const payload = { reasoning_effort: "minimal", reasoning: { effort: "low" }, output_config: { effort: "low" }, thinking: { budget_tokens: 512 } };
  const result = clampRoutineProviderEffort(payload);
  assert.equal(result.changed, false);
  assert.equal(result.payload, payload);
});

test("token saver guidance is constant and points to reversible recovery", () => {
  assert.match(TOKEN_SAVER_GUIDANCE, /concise/i);
  assert.match(TOKEN_SAVER_GUIDANCE, /token_retrieve/);
  assert.match(TOKEN_SAVER_GUIDANCE, /compacted/i);
});

test("prompt-prefix observation reports drift without rewriting prompt content", () => {
  const engine = new TokenSaverEngine();
  engine.observePromptPrefix("stable prompt");
  engine.observePromptPrefix("stable prompt");
  engine.observePromptPrefix("changed prompt");
  const stats = engine.stats();
  assert.equal(stats.prefixObservations, 3);
  assert.equal(stats.prefixChanges, 1);
  assert.match(stats.lastPrefixHash, /^[0-9a-f]{24}$/);
});

// Headroom-style schema savings and RTK-style exact-output protection.

test("deferred tool search ranks a small metadata subset by capability", () => {
  const tools = [
    { name: "calendar_lookup", description: "Read calendar events and schedules" },
    { name: "db_query", description: "Run database queries" },
    { name: "send_mail", description: "Send email messages" },
  ];
  assert.deepEqual(
    rankDeferredTools(tools, "find calendar schedule", 2).map((tool) => tool.name),
    ["calendar_lookup"],
  );
});

test("provider tool-description compaction leaves parameter schemas exact", () => {
  const long = "Read a file carefully. ".repeat(40);
  const parameters = { type: "object", properties: { path: { type: "string", description: "Exact file path to read" } } };
  const payload = {
    tools: [
      { name: "read", description: long, input_schema: parameters },
      { type: "function", function: { name: "search", description: long, parameters } },
    ],
  };
  const result = compactProviderToolDescriptions(payload, 160);
  assert.equal(result.changed, true);
  assert.ok(result.savedChars > 0);
  const tools = result.payload.tools;
  assert.ok(tools[0].description.length <= 160);
  assert.deepEqual(tools[0].input_schema, parameters);
  assert.ok(tools[1].function.description.length <= 160);
  assert.deepEqual(tools[1].function.parameters, parameters);
  assert.equal(payload.tools[0].description, long, "input payload must not be mutated");
});

test("explicit machine-readable output requests pass through unchanged", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("inspect the data");
  const text = JSON.stringify(Array.from({ length: 180 }, (_, i) => ({ i, status: "ok", value: i })));
  const result = engine.compress("bash", { command: "some-tool --json" }, text, false);
  assert.equal(result.changed, false);
  assert.equal(result.text, text);
});

test("code reads stay byte-exact during edit and repair tasks", () => {
  const engine = new TokenSaverEngine();
  engine.setQuery("fix this parser and update the implementation");
  const text = Array.from({ length: 260 }, (_, i) => `export function fn${i}() { return ${i}; }`).join("\n");
  const result = engine.compress("read", { path: "/tmp/parser.ts" }, text, false);
  assert.equal(result.changed, false);
  assert.equal(result.text, text);

  const quotedBashRead = engine.compress("bash", { command: 'cat "/tmp/parser source.ts"' }, text, false);
  assert.equal(quotedBashRead.changed, false);
  assert.equal(quotedBashRead.text, text);
});


test("oversized originals fail open instead of emitting an unrecoverable recovery id", () => {
  const engine = new TokenSaverEngine();
  const text = "repetitive-output\n".repeat(Math.ceil((16 * 1024 * 1024 + 1) / 18));
  assert.ok(text.length > 16 * 1024 * 1024);
  const result = engine.compress("bash", { command: "tool --verbose" }, text, false);
  assert.equal(result.changed, false);
  assert.equal(result.text, text);
  assert.equal(result.id, undefined);
  assert.equal(engine.stats().storedEntries, 0);
});

test("large diff compaction never drops required changed lines or diff metadata under cap pressure", () => {
  const engine = new TokenSaverEngine();
  const lines = [
    "diff --git a/old.ts b/new.ts",
    "index 1111111..2222222 100644",
    "similarity index 95%",
    "rename from old.ts",
    "rename to new.ts",
    "new file mode 100644",
    "deleted file mode 100644",
    "Binary files a/blob.bin and b/blob.bin differ",
    "--- a/old.ts",
    "+++ b/new.ts",
    "@@ -1,500 +1,500 @@",
  ];
  for (let index = 0; index < 500; index += 1) lines.push(`+added line ${index}`);
  for (let index = 0; index < 700; index += 1) lines.push(` unchanged context ${index}`);
  const original = lines.join("\n");
  const result = engine.compress("bash", { command: "git diff" }, original, false);
  assert.equal(result.changed, true);
  assert.equal(result.strategy, "diff");
  for (const required of [
    "similarity index 95%",
    "rename from old.ts",
    "rename to new.ts",
    "new file mode 100644",
    "deleted file mode 100644",
    "Binary files a/blob.bin and b/blob.bin differ",
    "+added line 0",
    "+added line 499",
  ]) assert.match(result.text, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("routine continuation state is blocked by any error or non-routine tool result in a multi-tool turn", () => {
  let state = "none";
  state = updateRoutineContinuationState(state, true);
  assert.equal(state, "eligible");
  state = updateRoutineContinuationState(state, true);
  assert.equal(state, "eligible");
  state = updateRoutineContinuationState(state, false);
  assert.equal(state, "blocked");
  state = updateRoutineContinuationState(state, true);
  assert.equal(state, "blocked");
});

test("deferred tool metadata is single-line and terminal-control-safe before model display", () => {
  const text = sanitizeToolMetadataText("\u001b[31mDanger\u001b[0m\nsecond\u0000line\tvalue", 180);
  assert.equal(text, "Danger second line value");
  assert.doesNotMatch(text, /[\u0000-\u001f\u007f-\u009f]/);
});

test("tool-description compaction obeys small explicit character limits", () => {
  const payload = { tools: [{ name: "x", description: "abcdefghijklmnopqrstuvwxyz" }] };
  const result = compactProviderToolDescriptions(payload, 8);
  assert.equal(result.changed, true);
  assert.ok(result.payload.tools[0].description.length <= 8);
});

test("recovery preserves the exact original newline bytes instead of normalizing CRLF", () => {
  const engine = new TokenSaverEngine();
  const text = Array.from({ length: 180 }, (_, index) => `INFO repeated record ${index % 3} padding padding`).join("\r\n") + "\r\n";
  const compacted = engine.compress("bash", { command: "docker logs app" }, text, false);
  assert.equal(compacted.changed, true);
  const recovered = engine.retrieve(compacted.id, 1, 1000);
  assert.ok(recovered);
  assert.equal(recovered.text, text);
});
