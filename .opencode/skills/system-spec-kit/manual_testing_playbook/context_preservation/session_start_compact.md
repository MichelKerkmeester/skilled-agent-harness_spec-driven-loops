---
title: "249 -- SessionStart injects post-compact context"
description: "This scenario validates SessionStart priming (compact) for 249. It focuses on SessionStart reads cached payload and injects via stdout."
audited_post_018: true
phase_018_change: "Updated the fallback recovery instruction to point at /speckit:resume and the canonical packet continuity chain."
version: 3.6.0.16
---

# 249 -- SessionStart injects post-compact context

## 1. OVERVIEW

This scenario validates SessionStart priming (compact).

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the SessionStart hook, when triggered with `source=compact`, reads the cached PreCompact payload from hook state, injects it to stdout with "Recovered Context (Post-Compaction)" and "Recovery Instructions" sections, includes the last spec folder if known, clears the `pendingCompactPrime` from state after injection, points recovery back to `/speckit:resume` when the cache is missing, and stays within the 4000-token budget (COMPACTION_TOKEN_BUDGET).
- Real user request: `` Please validate SessionStart injects post-compact context against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts and tell me whether the expected signals are present: All vitest tests in `hook-session-start.vitest.ts` pass for compact source; `loadState(sessionId)` returns object with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`; Stdout contains `## Recovered Context (Post-Compaction)` followed by the cached payload text; Stdout contains `## Recovery Instructions` mentioning "3-source merge (Memory + Code Graph + Code Graph)" and `/speckit:resume`; After injection, `updateState()` sets `pendingCompactPrime: null`; When `state.lastSpecFolder` is set, stdout includes `## Active Spec Folder` with the path; When no cached payload exists, fallback output instructs calling `/speckit:resume`. ``
- Prompt: `Validate SessionStart post-compact context injection with the hook-session-start vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `hook-session-start.vitest.ts` pass for compact source; `loadState(sessionId)` returns object with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`; Stdout contains `## Recovered Context (Post-Compaction)` followed by the cached payload text; Stdout contains `## Recovery Instructions` mentioning "3-source merge (Memory + Code Graph + Code Graph)" and `/speckit:resume`; After injection, `updateState()` sets `pendingCompactPrime: null`; When `state.lastSpecFolder` is set, stdout includes `## Active Spec Folder` with the path; When no cached payload exists, fallback output instructs calling `/speckit:resume`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Cached payload injected to stdout, sections correctly formatted, state cleared after injection, budget respected; FAIL: Payload not found in stdout, pendingCompactPrime not cleared, or output exceeds 4000 tokens

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Cached payload read from hook state and injected to stdout against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify stdout includes "Recovered Context (Post-Compaction)" with payload text, "Recovery Instructions" mentioning 3-source merge. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Stdout includes "Recovered Context (Post-Compaction)" with payload text, "Recovery Instructions" mentioning 3-source merge

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:30
   Duration  244ms (transform 113ms, setup 13ms, import 73ms, tests 99ms, environment 0ms)
```

The observed output does not include `Recovered Context (Post-Compaction)` or `Recovery Instructions`.

### Pass / Fail

- **FAIL**: cached payload headers were not present in the observed stdout.

### Failure Triage

Verify hook state fixture has valid `pendingCompactPrime` object

---

### Prompt

```
As a context-and-code-graph validation operator, validate pendingCompactPrime cleared from state after injection against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify updateState() called with pendingCompactPrime: null after successful injection. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

`updateState()` called with `pendingCompactPrime: null` after successful injection

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:30
   Duration  244ms (transform 113ms, setup 13ms, import 73ms, tests 99ms, environment 0ms)
```

The observed output does not show `updateState()` called with `pendingCompactPrime: null`.

### Pass / Fail

- **FAIL**: state-clearing evidence was not present in the observed stdout.

### Failure Triage

Check `hook-state.ts` updateState logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Fallback when no cached payload exists against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify stdout contains "Context Recovery" section instructing /speckit:resume. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Stdout contains "Context Recovery" section instructing `/speckit:resume`

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:30
   Duration  244ms (transform 113ms, setup 13ms, import 73ms, tests 99ms, environment 0ms)
```

The observed output does not include `Context Recovery` or `/speckit:resume`.

### Pass / Fail

- **FAIL**: fallback recovery message was not present in the observed stdout.

### Failure Triage

Verify test fixture simulates missing cache state

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [context_preservation/session_start_priming.md](../../feature_catalog/context_preservation/session_start_priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 249
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `context_preservation/session_start_compact.md`
