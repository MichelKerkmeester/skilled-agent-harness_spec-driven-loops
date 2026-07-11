---
title: "212 -- Mutation hook result contract expansion"
description: "This scenario validates Mutation hook result contract expansion for `212`. It focuses on Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details."
version: 3.6.0.13
---

# 212 -- Mutation hook result contract expansion

## 1. OVERVIEW

This scenario validates Mutation hook result contract expansion for `212`. It focuses on Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details.
- Real user request: `` Please validate Mutation hook result contract expansion against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts and tell me whether the expected signals are present: Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints. ``
- Prompt: `Validate mutation hook result contract expansion across mutation hook wiring and UX feedback tests.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the suites pass and the assertions prove the expanded hook-result contract is present and consumable end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts. Verify hook and UX feedback suites pass, hook results include latencyMs, cache-clear booleans, toolCacheInvalidated, and errors, and UX feedback assertions reflect those values in response hints. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts`
2. inspect assertions covering `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`
3. inspect assertions proving UX feedback/hint builders surface the contract fields without dropping error context

### Expected

Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts
```

Observed test transcript:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  3 passed (3)
      Tests  13 passed (13)
   Start at  01:03:31
   Duration  889ms (transform 384ms, setup 19ms, import 682ms, tests 11ms, environment 0ms)
```

Highlighted assertion snippets observed in `tests/mutation-hooks.vitest.ts`:

```text
60:   it('returns success status flags when all hooks succeed', () => {
63:     expect(result.latencyMs).toBeGreaterThanOrEqual(0);
64:     expect(result.triggerCacheCleared).toBe(true);
65:     expect(result.toolCacheInvalidated).toBe(3);
66:     expect(result.constitutionalCacheCleared).toBe(true);
67:     expect(result.graphSignalsCacheCleared).toBe(true);
68:     expect(result.coactivationCacheCleared).toBe(true);
69:     expect(result.errors).toEqual([]);
79:   it('continues running remaining hooks when one hook fails', () => {
88:     expect(result.triggerCacheCleared).toBe(false);
89:     expect(result.toolCacheInvalidated).toBe(1);
90:     expect(result.constitutionalCacheCleared).toBe(true);
91:     expect(result.graphSignalsCacheCleared).toBe(true);
92:     expect(result.coactivationCacheCleared).toBe(true);
93:     expect(result.errors).toEqual(['trigger-cache: trigger cache failure']);
107:   it('reports graph cache invalidation failures when degree cache clearing throws', () => {
115:     expect(result.graphSignalsCacheCleared).toBe(false);
116:     expect(result.errors).toContain('graph-cache: degree cache failure');
123:   it('treats automated audit append failures as non-fatal hook warnings', () => {
133:     expect(result.triggerCacheCleared).toBe(true);
134:     expect(result.toolCacheInvalidated).toBe(3);
135:     expect(result.errors.some((error) => error.startsWith('automated-audit:'))).toBe(true);
```

Highlighted assertion snippets observed in `tests/hooks-mutation-wiring.vitest.ts`:

```text
52: function assertMutationHookResultShape(result: MutationHookResult): void {
53:   expect(typeof result.latencyMs).toBe('number');
54:   expect(result.latencyMs).toBeGreaterThanOrEqual(0);
55:   expect(typeof result.triggerCacheCleared).toBe('boolean');
56:   expect(typeof result.constitutionalCacheCleared).toBe('boolean');
57:   expect(typeof result.graphSignalsCacheCleared).toBe('boolean');
58:   expect(typeof result.coactivationCacheCleared).toBe('boolean');
59:   expect(typeof result.toolCacheInvalidated).toBe('number');
60:   expect(Array.isArray(result.errors)).toBe(true);
77:   it('runs post-mutation hooks for save/update/delete/bulk-delete/atomic-save with full MutationHookResult contract', () => {
96:   it('captures thrown hook error details in errors and marks the failing hook status false', () => {
104:     assertMutationHookResultShape(result);
105:     expect(result.coactivationCacheCleared).toBe(false);
106:     expect(result.errors).toEqual(
107:       expect.arrayContaining([expect.stringContaining('coactivation hook blew up')])
```

Highlighted assertion snippets observed in `tests/hooks-ux-feedback.vitest.ts`:

```text
7:   it('buildMutationHookFeedback returns data and expected hints', () => {
8:     const feedback = buildMutationHookFeedback('save', {
9:       latencyMs: 9,
10:       triggerCacheCleared: true,
11:       constitutionalCacheCleared: false,
12:       graphSignalsCacheCleared: true,
13:       coactivationCacheCleared: true,
14:       toolCacheInvalidated: 3,
15:       errors: [],
18:     expect(feedback.data).toEqual({
20:       latencyMs: 9,
21:       triggerCacheCleared: true,
22:       constitutionalCacheCleared: false,
23:       graphSignalsCacheCleared: true,
24:       coactivationCacheCleared: true,
25:       toolCacheInvalidated: 3,
26:       errors: [],
29:     expect(feedback.hints.some((hint) => hint.includes('Post-mutation subscribers'))).toBe(true);
30:     expect(feedback.hints.some((hint) => hint.includes('constitutional=failed'))).toBe(true);
31:     expect(feedback.hints.some((hint) => hint.includes('Tool cache invalidation'))).toBe(true);
32:     expect(feedback.hints.some((hint) => hint.includes('non-fatal'))).toBe(true);
49:   it('buildMutationHookFeedback surfaces error messages in hints and data', () => {
57:       errors: ['hook failed: xyz'],
60:     expect(feedback.data.errors).toEqual(['hook failed: xyz']);
61:     expect(feedback.hints.some((hint) => hint.includes('Post-mutation hook errors: hook failed: xyz'))).toBe(true);
```

### Pass / Fail

- **PASS**: the suites passed and the assertions prove the expanded hook-result contract is present and consumable end to end.

### Failure Triage

Inspect `handlers/memory-crud-types.ts`, `handlers/mutation-hooks.ts`, and `hooks/mutation-feedback.ts` if any field disappears or changes type

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux-hooks/mutation-hook-result-contract-expansion.md](../../feature_catalog/ux-hooks/mutation-hook-result-contract-expansion.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 212
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux-hooks/mutation-hook-result-contract-expansion.md`
- audited_post_018: true
- Feature catalog back-ref: `ux-hooks/mutation-hook-result-contract-expansion.md`
