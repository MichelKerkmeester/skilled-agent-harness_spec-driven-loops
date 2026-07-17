---
title: "250 -- SessionStart primes fresh session"
description: "This scenario validates SessionStart priming (startup) for 250. It focuses on SessionStart outputs Spec Kit Memory overview on fresh startup."
audited_post_018: true
phase_018_change: "Updated startup recovery wording so the resume instruction points at /speckit:resume and the canonical packet continuity chain."
version: 3.6.0.19
id: context-preservation-session-start-startup
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 250 -- SessionStart primes fresh session

## 1. OVERVIEW

This scenario validates SessionStart priming (startup).

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs the current startup contract: a `Session Context` startup surface, `Recovery Tools`, `Structural Context`, and `Startup Payload Contract` sections when the startup brief is available; Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`); Code Graph Code availability status; Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`); graph-quality context sourced from `graphQualitySummary`; and resume instructions that point to `/speckit:resume` and the packet continuity chain; Output must stay within `SESSION_PRIME_TOKEN_BUDGET` (2000 tokens).
- Real user request: `` Please validate SessionStart primes fresh session against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts and tell me whether the expected signals are present: All vitest tests in `hook-session-start.vitest.ts` pass for startup source; Startup output contains `Session Context` and `Recovery Tools`; Recovery tools mention `memory_context`, `memory_match_triggers`, `memory_search`; Recovery tools mention `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`; Code Graph status line shows either "available" or "missing" based on code-graph readiness; Startup output contains `Structural Context` when the startup brief is available; Startup output contains `Startup Payload Contract` when the startup brief is available; Startup payload transport identifies startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`; Startup brief fixture includes `graphQualitySummary`, and the startup formatter keeps graph-quality information on the structural-context path; Resume instruction: `/speckit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain; Output length stays within 2000 tokens (8000 chars). ``
- Prompt: `Validate SessionStart fresh-session priming with the hook-session-start vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `hook-session-start.vitest.ts` pass for startup source; Startup output contains `Session Context` and `Recovery Tools`; Recovery tools mention `memory_context`, `memory_match_triggers`, `memory_search`; Recovery tools mention `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`; Code Graph status line shows either "available" or "missing" based on code-graph readiness; Startup output contains `Structural Context` when the startup brief is available; Startup output contains `Startup Payload Contract` when the startup brief is available; Startup payload transport identifies startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`; Startup brief fixture includes `graphQualitySummary`, and the startup formatter keeps graph-quality information on the structural-context path; Resume instruction: `/speckit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain; Output length stays within 2000 tokens (8000 chars)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Startup sections, payload contract, tool references, graph-quality evidence, Code Graph status, and token budget all match the live startup contract; FAIL: Missing startup sections, missing payload or graph-quality evidence, incorrect Code Graph status, or output exceeds 2000 tokens

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate fresh startup recovery surfaces against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the startup output includes Session Context and Recovery Tools, and that Recovery Tools list memory_context, memory_match_triggers, memory_search, and the code graph tools. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup output includes `Session Context` and `Recovery Tools`, and `Recovery Tools` lists `memory_context`, `memory_match_triggers`, `memory_search`, and the code graph tools

### Evidence

Command run serially after the scenario command was invoked in a normal operator shape:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:53
   Duration  252ms (transform 109ms, setup 12ms, import 73ms, tests 95ms, environment 0ms)
```

Source evidence from `mcp_server/tests/hook-session-start.vitest.ts` and `mcp_server/hooks/claude/session-prime.ts`:

```text
expect(sections[0]?.title).toBe('Session Context');
expect(sections.map((section) => section.title)).toContain('Recovery Tools');
title: 'Recovery Tools',
content: [
  '- `memory_context({ input, mode })` — unified context retrieval',
  '- `memory_match_triggers({ prompt })` — fast trigger matching',
  '- `memory_search({ query })` — semantic search',
  '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
].join('\n'),
```

Operator note: an earlier accidental parallel duplicate invocation of the same suite produced one shared-temp collision while four duplicate invocations passed:

```text
Error: ENOENT: no such file or directory, open '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-claude-hooks/c6b35a74608a/a32c9a795710066c.json'
 Test Files  1 failed (1)
      Tests  1 failed | 9 passed | 1 skipped (11)
```

### Pass / Fail

- **PASS**: Serial scenario command passed, and the startup surface contains `Session Context`, `Recovery Tools`, `memory_context`, `memory_match_triggers`, `memory_search`, `code_graph_scan`, `code_graph_query`, `code_graph_context`, and `code_graph_status`.

### Failure Triage

Check `session-prime.ts` handleStartup() for expected tool names

---

### Prompt

```
As a context-and-code-graph validation operator, validate startup payload transport against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify startup output includes a Startup Payload Contract section when the startup brief is available, and that the payload transport shows startup status, producer=startup_brief, and sectionKeys including structural-context. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup output includes `Startup Payload Contract` with startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`

### Evidence

Command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:53
   Duration  252ms (transform 109ms, setup 12ms, import 73ms, tests 95ms, environment 0ms)
```

Source evidence from `mcp_server/tests/hook-session-start.vitest.ts`:

```text
sharedPayloadTransport: JSON.stringify({
  kind: 'startup',
  provenance: { producer: 'startup_brief', trustState: 'live' },
  sectionKeys: ['structural-context'],
}, null, 2),
expect(sections.map((section) => section.title)).toContain('Startup Payload Contract');
expect(sections.find((section) => section.title === 'Startup Payload Contract')?.content).toContain(
  '"producer": "startup_brief"',
);
```

### Pass / Fail

- **PASS**: The passing suite asserts `Startup Payload Contract`, startup kind, `"producer": "startup_brief"`, and `sectionKeys: ['structural-context']`.

### Failure Triage

Check `hooks/claude/session-prime.ts` payload-section wiring and `code-graph/lib/startup-brief.ts` shared payload transport formatting

---

### Prompt

```
As a context-and-code-graph validation operator, validate startup graph-quality context against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the startup path preserves graph-quality evidence by exposing Structural Context when the startup brief is available, carrying graphQualitySummary in the startup brief fixture, and keeping graph-quality formatting on the structural-context path. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup path preserves graph-quality evidence through `Structural Context`, `graphQualitySummary`, and the structural-context formatter path

### Evidence

Command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:53
   Duration  252ms (transform 109ms, setup 12ms, import 73ms, tests 95ms, environment 0ms)
```

Source evidence from `mcp_server/tests/hook-session-start.vitest.ts` and `mcp_server/hooks/claude/session-prime.ts`:

```text
graphQualitySummary: {
  detectorProvenanceSummary: { dominant: 'structured', counts: { structured: 1 } },
  graphEdgeEnrichmentSummary: { edgeEvidenceClass: 'direct_call', numericConfidence: 0.92 },
},
expect(sections.map((section) => section.title)).toContain('Structural Context');
if (startupBrief?.graphOutline) {
  sections.push({
    title: 'Structural Context',
    content: startupBrief.graphOutline,
  });
}
```

### Pass / Fail

- **PASS**: The passing suite includes a startup fixture with `graphQualitySummary` and asserts `Structural Context`; the formatter path emits `Structural Context` from the startup brief graph outline.

### Failure Triage

Check `tests/hook-session-start.vitest.ts` startup fixture plus `code-graph/lib/startup-brief.ts` graph-quality formatting

---

### Prompt

```
As a context-and-code-graph validation operator, validate Code Graph availability check returns correct status against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the Code Graph line shows "available" when the binary exists or "missing"/fallback state when the startup brief is unavailable. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Code Graph line reflects runtime availability or fallback startup behavior

### Evidence

Command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:53
   Duration  252ms (transform 109ms, setup 12ms, import 73ms, tests 95ms, environment 0ms)
```

Source evidence from `mcp_server/tests/hook-session-start.vitest.ts`:

```text
expect(sections[0]?.content).toContain('- Code Graph: ready');
graphState: 'missing',
startupSurface: [
  'Session context received. Current state:',
  '',
  '- Memory: startup summary only (resume on demand)',
  '- Code Graph: unavailable',
].join('\n'),
expect(sections[0]?.content).toContain('- Code Graph: unavailable');
```

### Pass / Fail

- **PASS**: The passing suite verifies the startup-brief path reports `- Code Graph: ready` and the fallback/missing path reports `- Code Graph: unavailable`.

### Failure Triage

Verify code-graph readiness detection and `buildFallbackStartupSurface(...)`

---

### Prompt

```
As a context-and-code-graph validation operator, validate Startup output within SESSION_PRIME_TOKEN_BUDGET against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify output length <= 8000 chars (2000 tokens x 4 chars/token). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Output length <= 8000 chars (2000 tokens x 4 chars/token)

### Evidence

Command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  10 passed | 1 skipped (11)
   Start at  02:20:53
   Duration  252ms (transform 109ms, setup 12ms, import 73ms, tests 95ms, environment 0ms)
```

Source evidence from `mcp_server/tests/hook-session-start.vitest.ts` and `mcp_server/hooks/claude/shared.ts`:

```text
const truncated = truncateToTokenBudget(output, SESSION_PRIME_TOKEN_BUDGET);
expect(truncated.length / 4).toBeLessThanOrEqual(SESSION_PRIME_TOKEN_BUDGET);
export const SESSION_PRIME_TOKEN_BUDGET = 2000;
```

Observed budget value: `SESSION_PRIME_TOKEN_BUDGET = 2000`, so the asserted limit is `2000 * 4 = 8000` chars.

### Pass / Fail

- **PASS**: The passing suite asserts `truncated.length / 4 <= SESSION_PRIME_TOKEN_BUDGET`, and `SESSION_PRIME_TOKEN_BUDGET` is `2000`.

### Failure Triage

Check `shared.ts` SESSION_PRIME_TOKEN_BUDGET constant

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [context_preservation/session_start_priming.md](../../feature_catalog/context_preservation/session_start_priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 250
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `context_preservation/session_start_startup.md`
