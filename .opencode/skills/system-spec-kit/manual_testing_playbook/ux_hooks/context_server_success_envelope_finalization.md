---
title: "105 -- Context-server success-envelope finalization"
description: "This scenario validates Context-server success-envelope finalization for `105`. It focuses on Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract."
version: 3.6.0.16
id: ux-hooks-context-server-success-envelope-finalization
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 105 -- Context-server success-envelope finalization

## 1. OVERVIEW

This scenario validates Context-server success-envelope finalization for `105`. It focuses on Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract.
- Real user request: `` Please validate Context-server success-envelope finalization against npx vitest run tests/context-server.vitest.ts and tell me whether the expected signals are present: Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata. ``
- Prompt: `Validate context-server success-envelope finalization against tests/context-server.vitest.ts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm appendAutoSurfaceHints() runs before budget enforcement and preserves the finalized envelope contract against npx vitest run tests/context-server.vitest.ts. Verify context-server suite passes with end-to-end assertions for appended hints, preserved autoSurfacedContext, and finalized token metadata. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `npx vitest run tests/context-server.vitest.ts`
2. inspect assertions covering appended success hints
3. inspect assertions covering preserved `autoSurfacedContext`
4. inspect assertions covering final token metadata after hint append and before budget enforcement

### Expected

Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
$ npx vitest run tests/context-server.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  391 passed (391)
   Start at  00:50:37
   Duration  725ms (transform 379ms, setup 13ms, import 89ms, tests 564ms, environment 0ms)
```

Assertion output observed in `tests/context-server.vitest.ts`:

```text
1711:     it('T000i: successful responses append auto-surface hints and keep autoSurfacedContext inside the envelope', async () => {
1730:       actualAppendAutoSurfaceHints(response, surfaced)
1731:       actualSyncEnvelopeTokenCount(response)
1733:       expect(response.autoSurfacedContext).toBeUndefined()
1736:       expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories'))).toBe(true)
1737:       expect(parsed.meta.autoSurface).toEqual({
1738:         constitutionalCount: 1,
1739:         triggeredCount: 1,
1740:         surfaced_at: '2026-03-06T12:00:00.000Z',
1741:         latencyMs: 7,
1742:       })
1743:       expect(parsed.meta.autoSurfacedContext).toBeUndefined()
1744:       expect(parsed.meta.tokenBudget).toBe(1000)
1745:       expect(parsed.meta.tokenCount).toBeGreaterThan(0)
1748:     it('T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection', async () => {
1767:       actualAppendAutoSurfaceHints(response, surfaced)
1768:       actualSyncEnvelopeTokenCount(response)
1773:       expect(finalText).toContain('"tokenBudget": 1000')
1774:       expect(parsed.hints).toContain('Initial hint')
1775:       expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories (11ms)'))).toBe(true)
1776:       expect(parsed.meta.tokenCount).toBe(estimateTokenCount(finalText))
```

Source ordering observed in `context-server.ts`:

```text
1424:     // Inject auto-surface hints before token-budget enforcement so
1425:     // The final envelope metadata reflects the fully decorated response.
1426:     if (autoSurfacedContext && result && !result.isError) {
1427:       appendAutoSurfaceHints(result, autoSurfacedContext);
1428:     }
1430:     // Token Budget Hybrid: Inject tokenBudget into response metadata
1454:           const budget = getTokenBudget(name);
1455:           meta.tokenBudget = budget;
1456:           syncEnvelopeTokenCount(envelope);
1458:           if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
```

Additional envelope-preservation assertion observed in `tests/context-server.vitest.ts`:

```text
2665:     // autoSurfacedContext injected into successful response envelope metadata
2666:     it('T58: Auto-surfaced context injected into response envelope metadata', () => {
2667:       expect(sourceCode).toMatch(/meta\.autoSurfacedContext\s*=\s*autoSurfacedContext/)
2668:     })
```

### Pass / Fail

- **Verdict**: PASS
- **Reason**: `tests/context-server.vitest.ts` passed with `391 passed (391)`, and observed assertions cover appended auto-surface hints, envelope-contained auto-surface metadata, tokenBudget preservation, and final tokenCount recalculation after hint append.

### Failure Triage

Inspect `context-server.ts` success-path assembly and expected envelope fields

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux_hooks/context_server_success_hint_append.md](../../feature_catalog/ux_hooks/context_server_success_hint_append.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 105
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/context_server_success_envelope_finalization.md`
- audited_post_018: true
