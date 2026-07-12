---
title: "248 -- PreCompact hook fires and caches context"
description: "This scenario validates PreCompact hook context caching for 248. It focuses on PreCompact hook precomputes context and caches to hook state."
audited_post_018: true
version: 3.6.0.14
---

# 248 -- PreCompact hook fires and caches context

## 1. OVERVIEW

This scenario validates PreCompact hook context caching.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the PreCompact hook reads the transcript tail, extracts file paths and topics, builds a compact context payload via the 3-source merge pipeline, truncates to the 4000-token budget, and caches the result in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`; Stdout must NOT be written (caching only).
- Real user request: `` Please validate PreCompact hook fires and caches context against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts and tell me whether the expected signals are present: All vitest tests in `hook-precompact.vitest.ts` pass; `tailFile()` extracts last 50 lines from transcript JSONL; `extractFilePaths()` returns up to 20 unique file paths matching `/path/file.ext` pattern; `extractTopics()` returns up to 10 spec folder and tool references; `buildMergedContext()` produces sections (Active Files, Semantic Context, Session State); `truncateToTokenBudget()` enforces the 4000-token cap (16000 chars); `updateState()` stores `{ pendingCompactPrime: { payload, cachedAt } }` in session state JSON; Process exits with code 0 even on errors (hooks must never block Claude). ``
- Prompt: `Validate PreCompact hook caching with the hook-precompact vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `hook-precompact.vitest.ts` pass; `tailFile()` extracts last 50 lines from transcript JSONL; `extractFilePaths()` returns up to 20 unique file paths matching `/path/file.ext` pattern; `extractTopics()` returns up to 10 spec folder and tool references; `buildMergedContext()` produces sections (Active Files, Semantic Context, Session State); `truncateToTokenBudget()` enforces the 4000-token cap (16000 chars); `updateState()` stores `{ pendingCompactPrime: { payload, cachedAt } }` in session state JSON; Process exits with code 0 even on errors (hooks must never block Claude)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All tests pass, cached payload is within budget, hook state file contains valid `pendingCompactPrime` object; FAIL: Any test fails, payload exceeds 4000 tokens, or stdout is written during PreCompact

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Transcript tail extraction produces file paths and topics from last 50 lines against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify tailFile() returns lines, extractFilePaths() returns paths, extractTopics() returns spec/tool refs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`tailFile()` returns lines, `extractFilePaths()` returns paths, `extractTopics()` returns spec/tool refs

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:11:03
   Duration  677ms (transform 425ms, setup 13ms, import 590ms, tests 7ms, environment 0ms)
```

Observed test source evidence:

```text
73:     it('extracts file paths from transcript lines', () => {
74:       const lines = [
75:         '{"message":{"content":"Reading /src/hooks/shared.ts"}}',
76:         '{"message":{"content":"Editing /src/lib/code-graph/indexer.ts"}}',
77:         'plain text with /some/path.js reference',
78:       ];
79:       const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
80:       const paths = new Set<string>();
81:       for (const line of lines) {
82:         const matches = line.match(pathRegex);
83:         if (matches) matches.forEach(m => paths.add(m));
84:       }
85:       expect(paths.size).toBeGreaterThan(0);
86:       expect([...paths]).toContain('/src/hooks/shared.ts');
```

No observed command output showed `tailFile()` returning lines or `extractTopics()` returning spec/tool refs, and `hook-precompact.vitest.ts` did not contain `tailFile` or `extractTopics` references in the file read.

### Pass / Fail

- **FAIL**: The vitest command passed, but the observed output/source did not show `tailFile()` returning lines or `extractTopics()` returning spec/tool refs, so the pass condition is not fully met.

### Failure Triage

Verify transcript fixture exists and contains paths matching `/path/file.ext` regex

---

### Prompt

```
As a context-and-code-graph validation operator, validate 3-source merge pipeline builds context within 4000-token budget against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify mergeCompactBrief() called, output length <= 16000 chars (4000 tokens x 4 chars). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`mergeCompactBrief()` called, output length <= 16000 chars (4000 tokens x 4 chars)

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:11:11
   Duration  634ms (transform 387ms, setup 14ms, import 550ms, tests 6ms, environment 0ms)
```

Observed test source evidence:

```text
57:   describe('token budget enforcement', () => {
58:     it('truncates payload exceeding budget', () => {
59:       const largePayload = 'a'.repeat(20000);
60:       const truncated = truncateToTokenBudget(largePayload, COMPACTION_TOKEN_BUDGET);
61:       expect(truncated.length).toBeLessThan(largePayload.length);
62:       expect(truncated).toContain('[...truncated');
63:     });
64: 
65:     it('keeps payload within budget', () => {
66:       const smallPayload = '## Context\n- file.ts';
67:       const result = truncateToTokenBudget(smallPayload, COMPACTION_TOKEN_BUDGET);
68:       expect(result).toBe(smallPayload);
69:     });
```

No observed command output showed `mergeCompactBrief()` being called or an output length/token estimate value, and `hook-precompact.vitest.ts` did not contain a `mergeCompactBrief` reference in the file read.

### Pass / Fail

- **FAIL**: The vitest command passed, but the observed output/source did not show `mergeCompactBrief()` being called or an output length `<= 16000 chars`, so the pass condition is not fully met.

### Failure Triage

Check `compact-merger.ts` for budget enforcement logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Hook state file written with pendingCompactPrime and no stdout produced against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify updateState() writes JSON with pendingCompactPrime.payload and pendingCompactPrime.cachedAt, no stdout. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`updateState()` writes JSON with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`, no stdout

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:11:18
   Duration  599ms (transform 368ms, setup 12ms, import 523ms, tests 6ms, environment 0ms)
```

Observed test source evidence:

```text
29:     it('caches payload in hook state', () => {
30:       const payload = '## Active Files\n- /src/main.ts\n- /src/utils.ts';
31:       updateState(testSessionId, {
32:         pendingCompactPrime: {
33:           payload,
34:           cachedAt: new Date().toISOString(),
35:         },
36:       });
37: 
38:       const state = loadPersistedState(testSessionId);
39:       expect(state).not.toBeNull();
40:       expect(state!.pendingCompactPrime).not.toBeNull();
41:       expect(state!.pendingCompactPrime!.payload).toBe(payload);
42:     });
```

No observed command output confirmed the written JSON value, `pendingCompactPrime.cachedAt`, or hook stdout behavior; the test source asserts `pendingCompactPrime.payload` but does not assert `pendingCompactPrime.cachedAt` or no stdout in the file read.

### Pass / Fail

- **FAIL**: The vitest command passed, but the observed output/source did not confirm `pendingCompactPrime.cachedAt` or empty stdout, so the pass condition is not fully met.

### Failure Triage

Check `hook-state.ts` for state directory path and atomic write logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [context_preservation/precompact_hook.md](../../feature_catalog/context_preservation/precompact_hook.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 248
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `context_preservation/precompact_hook.md`
