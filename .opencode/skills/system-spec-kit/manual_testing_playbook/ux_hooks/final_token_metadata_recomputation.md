---
title: "215 -- Final token metadata recomputation"
description: "This scenario validates Final token metadata recomputation for `215`. It focuses on Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement."
version: 3.6.0.13
---

# 215 -- Final token metadata recomputation

## 1. OVERVIEW

This scenario validates Final token metadata recomputation for `215`. It focuses on Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement.
- Real user request: `` Please validate Final token metadata recomputation against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts and tell me whether the expected signals are present: Hook and context-server suites pass, `appendAutoSurfaceHints` recomputes `meta.tokenCount` from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload. ``
- Prompt: `Validate final token metadata recomputation after hint mutation and before budget enforcement.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Hook and context-server suites pass, `appendAutoSurfaceHints` recomputes `meta.tokenCount` from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the suites pass and the assertions prove final token-count recomputation happens after hint append and before budget enforcement

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm token counts are recomputed from the finalized envelope after hint mutation and before budget enforcement against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts. Verify hook and context-server suites pass, appendAutoSurfaceHints recomputes meta.tokenCount from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts`
2. inspect assertions covering final serialized-envelope token-count recomputation in `appendAutoSurfaceHints`
3. inspect assertions covering final token-count correctness after success-path hint append and token-budget injection

### Expected

Hook and context-server suites pass, `appendAutoSurfaceHints` recomputes `meta.tokenCount` from the finalized envelope, and end-to-end success-path assertions prove token-budget enforcement runs on the final serialized payload

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  397 passed (397)
   Start at  00:59:25
   Duration  1.11s (transform 477ms, setup 16ms, import 263ms, tests 692ms, environment 0ms)
```

Hook-level assertion inspected in `mcp_server/tests/hooks-ux-feedback.vitest.ts`:

```ts
it('appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON', () => {
```

Observed assertion snippets:

```ts
expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 2 constitutional and 1 triggered memories (6ms)'))).toBe(true);
expect(parsed.meta.autoSurface).toEqual({
  constitutionalCount: 2,
  triggeredCount: 1,
  surfaced_at: '2026-03-05T10:00:00.000Z',
  latencyMs: 6,
  tokenCount: 185,
});
expect(finalText).toBe(JSON.stringify(parsed, null, 2));
expect(parsed.meta.tokenCount).not.toBe(12);
expect(parsed.meta.tokenCount).toBe(estimateTokenCount(finalText));
```

Context-server success-path assertion inspected in `mcp_server/tests/context-server.vitest.ts`:

```ts
it('T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection', async () => {
```

Observed assertion snippets:

```ts
actualAppendAutoSurfaceHints(response, surfaced)
actualSyncEnvelopeTokenCount(response)

const finalText = response.content[0].text
const parsed = JSON.parse(finalText)

expect(finalText).toContain('"tokenBudget": 1000')
expect(parsed.hints).toContain('Initial hint')
expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories (11ms)'))).toBe(true)
expect(parsed.meta.tokenCount).toBe(estimateTokenCount(finalText))
```

Implementation ordering inspected in `mcp_server/context-server.ts`:

```ts
appendAutoSurfaceHints(result, autoSurfacedContext);
```

```ts
meta.tokenBudget = budget;
syncEnvelopeTokenCount(envelope);

if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
```

```ts
result.content[0].text = serializeEnvelopeWithTokenCount(envelope);
```

### Pass / Fail

- **PASS**: the suites passed (`2 passed`, `397 passed`), `appendAutoSurfaceHints` is asserted to recompute `meta.tokenCount` from `estimateTokenCount(finalText)`, and context-server assertions plus implementation ordering show token-budget metadata/enforcement uses the finalized serialized envelope after hint append.

### Failure Triage

Inspect `hooks/response-hints.ts`, `context-server.ts`, and token-estimation helpers if token metadata diverges from the serialized payload

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux_hooks/final_token_metadata_recomputation.md](../../feature_catalog/ux_hooks/final_token_metadata_recomputation.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 215
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/final_token_metadata_recomputation.md`
- audited_post_018: true
- Feature catalog back-ref: `ux_hooks/final_token_metadata_recomputation.md`
