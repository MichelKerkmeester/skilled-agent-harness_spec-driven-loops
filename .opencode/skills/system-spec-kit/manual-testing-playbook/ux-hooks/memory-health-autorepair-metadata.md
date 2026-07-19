---
title: "210 -- Memory health autoRepair metadata"
description: "This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting."
version: 3.6.0.13
id: ux-hooks-memory-health-autorepair-metadata
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 210 -- Memory health autoRepair metadata

## 1. OVERVIEW

This scenario validates Memory health autoRepair metadata for `210`. It focuses on Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting.
- Real user request: `` Please validate Memory health autoRepair metadata against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts and tell me whether the expected signals are present: The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds. ``
- Prompt: `Validate memory health autoRepair metadata and confirmation-only repair behavior against the health and CRUD edge suites.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts. Verify the health suites pass, unconfirmed autoRepair:true requests return confirmation-only guidance, confirmed repairs emit structured repair.actions, and mixed outcomes report repair.repaired: false with repair.partialSuccess: true when only part of the repair succeeds. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts`
2. inspect assertions covering confirmation-only responses for `autoRepair:true` without `confirmed:true`
3. inspect assertions covering FTS rebuild, orphan cleanup, and partial-success repair metadata

### Expected

The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds

### Evidence

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp-server`:

```text
npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  68 passed | 23 skipped (91)
   Start at  01:03:03
   Duration  1.59s (transform 839ms, setup 21ms, import 331ms, tests 1.10s, environment 0ms)
```

Assertion snippets inspected from `tests/handler-memory-health-edge.vitest.ts`:

```text
223:   it('T007b-H8b: autoRepair without confirmed returns confirmation-only payload', async () => {
224:     const result = await handler.handleMemoryHealth({ autoRepair: true });
227:     expect(result.isError).toBe(false);
228:     expect(parsed.summary).toMatch(/Confirmation required before auto-repair actions are executed/);
229:     expect(parsed.data).toMatchObject({
230:       reportMode: 'full',
231:       autoRepairRequested: true,
232:       needsConfirmation: true,
233:     });
234:     expect(parsed.data.actions).not.toContain('temp_fixture_memory_cleanup');
235:     expect(parsed.hints).toEqual(
236:       expect.arrayContaining([
237:         'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
238:       ])
239:     );
240:   });
```

Assertion snippets inspected from `tests/memory-crud-extended.vitest.ts`:

```text
1404:   it('EXT-H12: autoRepair rebuilds FTS drift and records repair metadata', async (ctx) => {
1450:       const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
1453:       expect(execMock).toHaveBeenCalledTimes(1);
1454:       expect(refreshSpy).toHaveBeenCalledTimes(1);
1455:       expect(parsed?.data?.repair).toEqual(expect.objectContaining({
1456:         requested: true,
1457:         attempted: true,
1458:         repaired: true,
1459:         partialSuccess: false,
1460:       }));
1461:       expect(parsed?.data?.repair?.actions).toContain('fts_rebuild');
1462:       expect(parsed?.data?.repair?.actions).toContain('trigger_cache_refresh');
1463:       expect(parsed?.hints?.some((hint: string) => hint.includes('Auto-repair completed'))).toBe(true);

1469:   it('EXT-H12a: autoRepair without confirmation returns planned actions and does not execute cleanup', async (ctx) => {
1511:       const result = await handler.handleMemoryHealth({ reportMode: 'full', autoRepair: true });
1514:       expect(parsed?.summary).toContain('Confirmation required');
1515:       expect(parsed?.data).toMatchObject({
1516:         autoRepairRequested: true,
1517:         needsConfirmation: true,
1518:       });
1519:       expect(parsed?.data?.actions).toEqual(expect.arrayContaining([
1520:         'fts_rebuild',
1521:         'trigger_cache_refresh',
1522:         'orphan_edges_cleanup',
1523:         'orphan_vector_cleanup',
1524:         'orphan_chunks_cleanup',
1525:       ]));
1526:       expect(parsed?.hints?.some((hint: string) => hint.includes('confirmed:true'))).toBe(true);
1527:       expect(execMock).not.toHaveBeenCalled();
1528:       expect(refreshSpy).not.toHaveBeenCalled();

1534:   it('EXT-H13: autoRepair marks partial success when FTS mismatch remains but orphan cleanup succeeds', async (ctx) => {
1589:       const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
1592:       expect(execMock).toHaveBeenCalledTimes(1);
1593:       expect(refreshSpy).toHaveBeenCalledTimes(1);
1594:       expect(parsed?.data?.repair).toEqual(expect.objectContaining({
1595:         requested: true,
1596:         attempted: true,
1597:         repaired: false,
1598:         partialSuccess: true,
1599:       }));
1600:       expect(parsed?.data?.repair?.warnings).toEqual(
1601:         expect.arrayContaining([expect.stringContaining('Post-repair mismatch persists')])
1602:       );
1603:       expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:3');

1609:   it('EXT-H14: autoRepair marks partial success when FTS consistency check throws but orphan cleanup succeeds', async (ctx) => {
1653:     const result = await handler.handleMemoryHealth({ reportMode: 'full', autoRepair: true, confirmed: true });
1656:     expect(parsed?.data?.repair).toEqual(expect.objectContaining({
1657:       requested: true,
1658:       attempted: true,
1659:       repaired: false,
1660:       partialSuccess: true,
1661:     }));
1662:     expect(parsed?.data?.repair?.errors).toEqual(
1663:       expect.arrayContaining([expect.stringContaining('Consistency check failed before repair')])
1664:     );
1665:     expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:2');

1742:   it('EXT-H16: autoRepair with cleanFiles=true cleans orphaned file rows', async (ctx) => {
1801:     const result = await handler.handleMemoryHealth({
1802:       autoRepair: true,
1803:       confirmed: true,
1804:       cleanFiles: true,
1805:     });
1808:     expect(parsed?.data?.repair?.actions).toEqual(
1809:       expect.arrayContaining(['orphan_files_cleaned:2'])
1810:     );
1811:     expect(parsed?.hints).toEqual(
1812:       expect.arrayContaining([
1813:         expect.stringContaining('removed 2 orphaned file row(s)'),
1814:       ])
1815:     );
```

### Pass / Fail

- **PASS**: The health suites passed (`Test Files  2 passed (2)`, `Tests  68 passed | 23 skipped (91)`), and inspected assertions prove confirmation-only gating, structured `repair.actions`, FTS rebuild, orphan cleanup, and partial-success semantics (`repaired: false`, `partialSuccess: true`).

### Failure Triage

Inspect `handlers/memory-crud-health.ts`, `handlers/memory-crud-types.ts`, and response-envelope shaping for `repair` payload regressions

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/memory-health-autorepair-metadata.md](../../feature-catalog/ux-hooks/memory-health-autorepair-metadata.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 210
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/memory-health-autorepair-metadata.md`
- audited_post_018: true
- Feature catalog back-ref: `ux-hooks/memory-health-autorepair-metadata.md`
