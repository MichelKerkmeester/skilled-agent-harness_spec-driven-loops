---
title: "226 -- Memory health auto-repair"
description: "This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the confirmed `memory_health` repair path and its transparent repair bookkeeping."
version: 3.6.0.13
---

# 226 -- Memory health auto-repair

## 1. OVERVIEW

This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.
- Real user request: `Please validate Memory health auto-repair against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts and tell me whether the expected signals are present: Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings.`
- Prompt: `Validate memory_health auto-repair against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_health auto-repair against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts`
2. inspect assertions covering `memory_health` with `autoRepair: true` and missing `confirmed: true` to verify confirmation-required behavior
3. inspect assertions covering confirmed FTS rebuild, trigger-cache refresh, orphan-edge cleanup, and vector or chunk cleanup
4. inspect assertions covering `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.warnings`, and `repair.errors` in success and partial-success paths

### Expected

Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings

### Evidence

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  113 passed | 23 skipped (136)
   Start at  01:49:21
   Duration  1.19s (transform 745ms, setup 15ms, import 117ms, tests 936ms, environment 0ms)
```

Inspected assertion evidence:

```text
tests/memory-crud-extended.vitest.ts:1404:   it('EXT-H12: autoRepair rebuilds FTS drift and records repair metadata', async (ctx) => {
tests/memory-crud-extended.vitest.ts:1450:       const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
tests/memory-crud-extended.vitest.ts:1455:       expect(parsed?.data?.repair).toEqual(expect.objectContaining({
tests/memory-crud-extended.vitest.ts:1456:         requested: true,
tests/memory-crud-extended.vitest.ts:1457:         attempted: true,
tests/memory-crud-extended.vitest.ts:1458:         repaired: true,
tests/memory-crud-extended.vitest.ts:1459:         partialSuccess: false,
tests/memory-crud-extended.vitest.ts:1461:       expect(parsed?.data?.repair?.actions).toContain('fts_rebuild');
tests/memory-crud-extended.vitest.ts:1462:       expect(parsed?.data?.repair?.actions).toContain('trigger_cache_refresh');
tests/memory-crud-extended.vitest.ts:1463:       expect(parsed?.hints?.some((hint: string) => hint.includes('Auto-repair completed'))).toBe(true);

tests/memory-crud-extended.vitest.ts:1469:   it('EXT-H12a: autoRepair without confirmation returns planned actions and does not execute cleanup', async (ctx) => {
tests/memory-crud-extended.vitest.ts:1511:       const result = await handler.handleMemoryHealth({ reportMode: 'full', autoRepair: true });
tests/memory-crud-extended.vitest.ts:1514:       expect(parsed?.summary).toContain('Confirmation required');
tests/memory-crud-extended.vitest.ts:1515:       expect(parsed?.data).toMatchObject({
tests/memory-crud-extended.vitest.ts:1516:         autoRepairRequested: true,
tests/memory-crud-extended.vitest.ts:1517:         needsConfirmation: true,
tests/memory-crud-extended.vitest.ts:1519:       expect(parsed?.data?.actions).toEqual(expect.arrayContaining([
tests/memory-crud-extended.vitest.ts:1520:         'fts_rebuild',
tests/memory-crud-extended.vitest.ts:1521:         'trigger_cache_refresh',
tests/memory-crud-extended.vitest.ts:1522:         'orphan_edges_cleanup',
tests/memory-crud-extended.vitest.ts:1523:         'orphan_vector_cleanup',
tests/memory-crud-extended.vitest.ts:1524:         'orphan_chunks_cleanup',
tests/memory-crud-extended.vitest.ts:1526:       expect(parsed?.hints?.some((hint: string) => hint.includes('confirmed:true'))).toBe(true);
tests/memory-crud-extended.vitest.ts:1527:       expect(execMock).not.toHaveBeenCalled();
tests/memory-crud-extended.vitest.ts:1528:       expect(refreshSpy).not.toHaveBeenCalled();

tests/memory-crud-extended.vitest.ts:1534:   it('EXT-H13: autoRepair marks partial success when FTS mismatch remains but orphan cleanup succeeds', async (ctx) => {
tests/memory-crud-extended.vitest.ts:1589:       const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
tests/memory-crud-extended.vitest.ts:1594:       expect(parsed?.data?.repair).toEqual(expect.objectContaining({
tests/memory-crud-extended.vitest.ts:1595:         requested: true,
tests/memory-crud-extended.vitest.ts:1596:         attempted: true,
tests/memory-crud-extended.vitest.ts:1597:         repaired: false,
tests/memory-crud-extended.vitest.ts:1598:         partialSuccess: true,
tests/memory-crud-extended.vitest.ts:1600:       expect(parsed?.data?.repair?.warnings).toEqual(
tests/memory-crud-extended.vitest.ts:1601:         expect.arrayContaining([expect.stringContaining('Post-repair mismatch persists')])
tests/memory-crud-extended.vitest.ts:1603:       expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:3');

tests/memory-crud-extended.vitest.ts:1609:   it('EXT-H14: autoRepair marks partial success when FTS consistency check throws but orphan cleanup succeeds', async (ctx) => {
tests/memory-crud-extended.vitest.ts:1653:     const result = await handler.handleMemoryHealth({ reportMode: 'full', autoRepair: true, confirmed: true });
tests/memory-crud-extended.vitest.ts:1656:     expect(parsed?.data?.repair).toEqual(expect.objectContaining({
tests/memory-crud-extended.vitest.ts:1657:       requested: true,
tests/memory-crud-extended.vitest.ts:1658:       attempted: true,
tests/memory-crud-extended.vitest.ts:1659:       repaired: false,
tests/memory-crud-extended.vitest.ts:1660:       partialSuccess: true,
tests/memory-crud-extended.vitest.ts:1662:     expect(parsed?.data?.repair?.errors).toEqual(
tests/memory-crud-extended.vitest.ts:1663:       expect.arrayContaining([expect.stringContaining('Consistency check failed before repair')])
tests/memory-crud-extended.vitest.ts:1665:     expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:2');

tests/memory-crud-extended.vitest.ts:1742:   it('EXT-H16: autoRepair with cleanFiles=true cleans orphaned file rows', async (ctx) => {
tests/memory-crud-extended.vitest.ts:1801:     const result = await handler.handleMemoryHealth({
tests/memory-crud-extended.vitest.ts:1802:       autoRepair: true,
tests/memory-crud-extended.vitest.ts:1803:       confirmed: true,
tests/memory-crud-extended.vitest.ts:1804:       cleanFiles: true,
tests/memory-crud-extended.vitest.ts:1808:     expect(parsed?.data?.repair?.actions).toEqual(
tests/memory-crud-extended.vitest.ts:1809:       expect.arrayContaining(['orphan_files_cleaned:2'])
tests/memory-crud-extended.vitest.ts:1811:     expect(parsed?.hints).toEqual(
tests/memory-crud-extended.vitest.ts:1813:         expect.stringContaining('removed 2 orphaned file row(s)'),

tests/tool-input-schema.vitest.ts:569:   it('public schema accepts autoRepair confirmation payloads', () => {
tests/tool-input-schema.vitest.ts:571:       validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
tests/tool-input-schema.vitest.ts:572:     }).not.toThrow();
tests/tool-input-schema.vitest.ts:575:   it('runtime schema preserves confirmed for handler execution', () => {
tests/tool-input-schema.vitest.ts:576:     const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
tests/tool-input-schema.vitest.ts:577:     expect(parsed).toEqual({ autoRepair: true, confirmed: true });
```

### Pass / Fail

- **PASS**: the targeted suites passed (`2 passed (2)`, `113 passed | 23 skipped (136)`), and inspected assertions confirm confirmation gating, staged repair actions, confirmed repair execution, and transparent repair metadata for success and partial-success paths.

### Failure Triage

Inspect `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/lib/search/vector-index.ts`, and `mcp_server/lib/storage/causal-edges.ts` if repair staging, metadata, or cleanup coverage regresses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [remediation-revalidation/memory-health-auto-repair.md](../../feature_catalog/remediation-revalidation/memory-health-auto-repair.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 226
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `remediation-revalidation/memory-health-auto-repair.md`
