---
title: "256 -- Budget allocator floors and overflow"
description: "This scenario validates Budget allocator for 256. It focuses on Floor distribution and overflow redistribution."
audited_post_018: true
version: 3.6.0.15
id: context-preservation-budget-allocator
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 256 -- Budget allocator floors and overflow

## 1. OVERVIEW

This scenario validates Budget allocator.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, codeGraph: 900, triggered: 400, overflow pool: 800) plus overflow redistribution; Empty sources release their floor to the overflow pool; Overflow is redistributed by priority order: constitutional > codeGraph > codeGraph > triggered; Total cap is enforced with deterministic trim in reverse priority order.
- Real user request: `` Please validate Budget allocator floors and overflow against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts and tell me whether the expected signals are present: All vitest tests in `budget-allocator.vitest.ts` pass; DEFAULT_FLOORS constants: constitutional=700, codeGraph=1200, codeGraph=900, triggered=400, overflow=800; When all sources have data: each gets at least its floor (capped at actual size); When a source is empty (actualSize=0): its full floor goes to overflow pool; Overflow redistribution follows priority: constitutional > codeGraph > codeGraph > triggered; `AllocationResult.totalUsed` never exceeds `totalBudget` (4000); When total exceeds budget, trim starts from triggered (lowest priority), then codeGraph, then codeGraph, then constitutional; Each `SourceAllocation` has correct `floor`, `requested`, `granted`, `dropped` values. ``
- Prompt: `Validate budget allocator floors, overflow redistribution, and total cap enforcement with the budget-allocator vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `budget-allocator.vitest.ts` pass; DEFAULT_FLOORS constants: constitutional=700, codeGraph=1200, codeGraph=900, triggered=400, overflow=800; When all sources have data: each gets at least its floor (capped at actual size); When a source is empty (actualSize=0): its full floor goes to overflow pool; Overflow redistribution follows priority: constitutional > codeGraph > codeGraph > triggered; `AllocationResult.totalUsed` never exceeds `totalBudget` (4000); When total exceeds budget, trim starts from triggered (lowest priority), then codeGraph, then codeGraph, then constitutional; Each `SourceAllocation` has correct `floor`, `requested`, `granted`, `dropped` values
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All allocation tests pass, total never exceeds 4000, overflow redistribution follows priority, empty sources release floors correctly; FAIL: Total exceeds 4000, priority order violated, or empty source floor not released to overflow pool

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Floor distribution: each source gets min(floor, actualSize) against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts. Verify each source.granted = min(source.floor, source.actualSize), unused floor added to overflow. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

Each source.granted = min(source.floor, source.actualSize), unused floor added to overflow

### Evidence

Command run:

```text
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:01:17
   Duration  81ms (transform 15ms, setup 12ms, import 8ms, tests 2ms, environment 0ms)
```

Observed test assertions from `.opencode/skills/system-spec-kit/mcp-server/tests/budget-allocator.vitest.ts`:

```text
expect(DEFAULT_FLOORS).toEqual({
  constitutional: 700,
  codeGraph: 1200,
  triggered: 400,
  overflow: 800,
});

const result = allocateBudget(createDefaultSources(500, 1500, 100), 4000);
expect(byName.constitutional).toMatchObject({
  floor: DEFAULT_FLOORS.constitutional,
  requested: 500,
  granted: 500,
  dropped: 0,
});
expect(result.totalUsed).toBeLessThanOrEqual(result.totalBudget);
```

Observed allocator logic from `.opencode/skills/system-spec-kit/shared/budget-allocator.ts`:

```text
const granted = Math.min(source.floor, source.actualSize);
overflowPool += source.floor - granted;
```

### Pass / Fail

- **PASS**: floor allocation matches `min(floor, actualSize)` for the asserted source, unused floor is added to overflow, and `budget-allocator.vitest.ts` passed 4/4 tests.

### Failure Triage

Check `allocateBudget()` Step 1 logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Overflow redistribution follows priority order (constitutional first) against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts. Verify when sources need more than floor, overflow given by priority: constitutional > codeGraph > codeGraph > triggered. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

When sources need more than floor, overflow given by priority: constitutional > codeGraph > codeGraph > triggered

### Evidence

Command run:

```text
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:01:17
   Duration  81ms (transform 15ms, setup 12ms, import 8ms, tests 2ms, environment 0ms)
```

Observed test assertions from `.opencode/skills/system-spec-kit/mcp-server/tests/budget-allocator.vitest.ts`:

```text
const result = allocateBudget(createDefaultSources(1200, 1800, 900), 4000);
expect(byName.constitutional.granted).toBe(1200);
expect(byName.codeGraph.granted).toBe(1800);
expect(byName.triggered.granted).toBe(900);
expect(result.totalUsed).toBe(3900);
```

Observed allocator priority order from `.opencode/skills/system-spec-kit/shared/budget-allocator.ts`:

```text
const PRIORITY_ORDER = ['constitutional', 'codeGraph', 'sessionState', 'triggered'] as const;
```

### Pass / Fail

- **PASS**: highest-priority sources receive overflow before lower-priority sources in the asserted scenario, and `budget-allocator.vitest.ts` passed 4/4 tests.

### Failure Triage

Verify PRIORITY_ORDER array in `budget-allocator.ts`

---

### Prompt

```
As a context-and-code-graph validation operator, validate Total cap enforcement: never exceeds 4000 tokens, trim in reverse priority against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts. Verify allocationResult.totalUsed <= 4000, excess trimmed from triggered first, then codeGraph, codeGraph, constitutional. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

`AllocationResult.totalUsed <= 4000`, excess trimmed from triggered first, then codeGraph, codeGraph, constitutional

### Evidence

Command run:

```text
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/budget-allocator.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:01:17
   Duration  81ms (transform 15ms, setup 12ms, import 8ms, tests 2ms, environment 0ms)
```

Observed test assertions from `.opencode/skills/system-spec-kit/mcp-server/tests/budget-allocator.vitest.ts`:

```text
const result = allocateBudget(createDefaultSources(10_000, 10_000, 10_000), 4000);
expect(result.totalUsed).toBeLessThanOrEqual(4000);
expect(result.allocations.every((allocation) => allocation.granted >= 0)).toBe(true);
```

Observed trim logic from `.opencode/skills/system-spec-kit/shared/budget-allocator.ts`:

```text
for (const name of [...PRIORITY_ORDER].reverse()) {
  if (totalUsed <= totalBudget) break;
  const allocation = allocations.find((entry) => entry.name === name);
  if (!allocation) continue;

  const trim = Math.min(totalUsed - totalBudget, allocation.granted);
  allocation.granted -= trim;
  allocation.dropped += trim;
  totalUsed -= trim;
}
```

### Pass / Fail

- **PASS**: `totalUsed <= 4000` is asserted for the over-cap scenario, trim iterates in reverse priority order, and `budget-allocator.vitest.ts` passed 4/4 tests.

### Failure Triage

Check Step 3 trim logic with reversed PRIORITY_ORDER

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [context-preservation/budget-allocator.md](../../feature-catalog/context-preservation/budget-allocator.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 256
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `context-preservation/budget-allocator.md`
