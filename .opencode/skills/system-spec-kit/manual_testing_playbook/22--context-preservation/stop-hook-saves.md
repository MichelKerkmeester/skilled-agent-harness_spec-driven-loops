---
title: "251 -- Stop hook saves token usage"
description: "This scenario validates Stop hook token tracking for 251. It focuses on Transcript parsing, cost estimation, and snapshot storage."
audited_post_018: true
version: 3.6.0.14
---

# 251 -- Stop hook saves token usage

## 1. OVERVIEW

This scenario validates Stop hook token tracking.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the Stop hook (async, fires on session end) parses the Claude Code transcript JSONL for token usage data (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`), calculates USD cost estimates per model (Opus: $15/$75 per 1M, Sonnet: $3/$15 per 1M, Haiku: $0.25/$1.25 per 1M), stores metrics in hook state, supports incremental parsing via byte offset, auto-detects spec folder from transcript paths, and triggers auto-save when completion tokens exceed 1000.
- Real user request: `` Please validate Stop hook saves token usage against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts and tell me whether the expected signals are present: All vitest tests in `hook-stop-token-tracking.vitest.ts` pass; `parseTranscript()` correctly aggregates `input_tokens` and `output_tokens` from all assistant messages; `estimateCost()` uses correct per-model pricing: Opus ($15 prompt/$75 completion per 1M), Sonnet ($3/$15), Haiku ($0.25/$1.25); Incremental parsing skips lines before `startOffset` and returns `newOffset`; Hook state updated with `metrics.estimatedPromptTokens`, `metrics.estimatedCompletionTokens`, `metrics.lastTranscriptOffset`; When `estimatedCompletionTokens > 1000`, `pendingCompactPrime` is set with auto-save recommendation; `detectSpecFolder()` finds `.opencode/specs/` paths in transcript and returns the most frequent one. ``
- Prompt: `Validate Stop hook token tracking with the hook-stop-token-tracking vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `hook-stop-token-tracking.vitest.ts` pass; `parseTranscript()` correctly aggregates `input_tokens` and `output_tokens` from all assistant messages; `estimateCost()` uses correct per-model pricing: Opus ($15 prompt/$75 completion per 1M), Sonnet ($3/$15), Haiku ($0.25/$1.25); Incremental parsing skips lines before `startOffset` and returns `newOffset`; Hook state updated with `metrics.estimatedPromptTokens`, `metrics.estimatedCompletionTokens`, `metrics.lastTranscriptOffset`; When `estimatedCompletionTokens > 1000`, `pendingCompactPrime` is set with auto-save recommendation; `detectSpecFolder()` finds `.opencode/specs/` paths in transcript and returns the most frequent one
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Token counts match expected values, cost estimates accurate to 4 decimal places, incremental offset works, metrics stored in hook state; FAIL: Token counts incorrect, cost calculation wrong for any model tier, or incremental parsing re-parses already-processed lines

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Transcript JSONL parsing extracts token counts and model against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify parseTranscript() returns correct promptTokens, completionTokens, totalTokens, messageCount, model. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

parseTranscript()` returns correct `promptTokens`, `completionTokens`, `totalTokens`, `messageCount`, `model

### Evidence

Command output observed from `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts`:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:25:59
   Duration  95ms (transform 25ms, setup 12ms, import 22ms, tests 6ms, environment 0ms)
```

### Pass / Fail

PASS: The hook-stop-token-tracking Vitest suite passed with `Tests  8 passed (8)`, so no contradicting evidence appeared for parsed token aggregation.

### Failure Triage

Check `claude-transcript.ts` for JSONL field mapping (`input_tokens`, `output_tokens`)

---

### Prompt

```
As a context-and-code-graph validation operator, validate Cost estimation per model pricing tier against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify estimateCost() returns correct USD for Opus ($15/$75/1M), Sonnet ($3/$15/1M), Haiku ($0.25/$1.25/1M). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

`estimateCost()` returns correct USD for Opus ($15/$75/1M), Sonnet ($3/$15/1M), Haiku ($0.25/$1.25/1M)

### Evidence

Command output observed from `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts`:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:26:06
   Duration  99ms (transform 26ms, setup 13ms, import 23ms, tests 6ms, environment 0ms)
```

### Pass / Fail

PASS: The hook-stop-token-tracking Vitest suite passed with `Tests  8 passed (8)`, so no contradicting evidence appeared for per-model cost estimation.

### Failure Triage

Verify pricing constants in `claude-transcript.ts` estimateCost()

---

### Prompt

```
As a context-and-code-graph validation operator, validate Incremental parsing via byte offset and metric snapshot storage against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify parsing from startOffset skips prior lines, newOffset advances, metrics stored in hook state JSON. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

Parsing from `startOffset` skips prior lines, `newOffset` advances, metrics stored in hook state JSON

### Evidence

Command output observed from `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts`:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:26:15
   Duration  102ms (transform 27ms, setup 13ms, import 24ms, tests 6ms, environment 0ms)
```

### Pass / Fail

PASS: The hook-stop-token-tracking Vitest suite passed with `Tests  8 passed (8)`, so no contradicting evidence appeared for incremental offset parsing or metric snapshot storage.

### Failure Triage

Check byte offset calculation with `Buffer.byteLength` for UTF-8

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/stop-token-tracking.md](../../feature_catalog/22--context-preservation/stop-token-tracking.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 251
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/stop-hook-saves.md`
