---
title: "037 -- Dynamic token budget allocation (FUT-7)"
description: "This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets."
audited_post_018: true
version: 3.6.0.15
id: query-intelligence-dynamic-token-budget-allocation-fut-7
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 037 -- Dynamic token budget allocation (FUT-7)

## 1. OVERVIEW

This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm complexity-tier budgets.
- Real user request: `Please validate Dynamic token budget allocation (FUT-7) against the documented validation surface and tell me whether the expected signals are present: Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Dynamic token budget allocation (FUT-7) against the documented validation surface. Verify token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm complexity-tier budgets against the documented validation surface. Verify token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run classed queries
2. Inspect budgets
3. Disable flag fallback

### Expected

Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget

### Evidence

Preconditions: no explicit Preconditions section is present in this scenario. The linked feature catalog exists at `../../feature-catalog/query-intelligence/dynamic-token-budget-allocation.md` and names these validation files: `mcp-server/tests/dynamic-token-budget.vitest.ts`, `mcp-server/tests/query-classifier.vitest.ts`, and `mcp-server/tests/token-budget.vitest.ts`.

Command run from `.opencode/skills/system-spec-kit/mcp-server`:

```bash
npx vitest run tests/dynamic-token-budget.vitest.ts tests/query-classifier.vitest.ts tests/token-budget.vitest.ts --reporter verbose
```

Observed output excerpts:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp-server/tests/token-budget.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp-server/tests/token-budget.vitest.ts > CHK-023: adjustedBudget formula (header overhead deduction) > T5: truncateToBudget respects the adjusted budget when passed
[hybrid-search] Token budget overflow: 1034 tokens > 980 budget, truncated 2 → 1 results (1 deferred to progressive disclosure)

 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-02: Flag Disabled — Default Budget (4000) > T6: simple tier returns DEFAULT_BUDGET (4000) when disabled 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-02: Flag Disabled — Default Budget (4000) > T7: moderate tier returns DEFAULT_BUDGET (4000) when disabled 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-02: Flag Disabled — Default Budget (4000) > T8: complex tier returns DEFAULT_BUDGET (4000) when disabled 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-02: Flag Disabled — Default Budget (4000) > T9: applied=false when flag is disabled 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-03: Budget Per Tier (Flag Enabled) > T10: simple tier returns 1500 tokens 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-03: Budget Per Tier (Flag Enabled) > T11: moderate tier returns 2500 tokens 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-03: Budget Per Tier (Flag Enabled) > T12: complex tier returns 4000 tokens 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-03: Budget Per Tier (Flag Enabled) > T13: budgets increase with tier complexity 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-03: Budget Per Tier (Flag Enabled) > T14: applied=true when flag is enabled 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-05: Default Config Constants > T16: DEFAULT_BUDGET is 4000 0ms
 ✓ mcp-server/tests/dynamic-token-budget.vitest.ts > T030-05: Default Config Constants > T17: DEFAULT_TOKEN_BUDGET_CONFIG has correct values 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-02: Simple Tier Classification > classifies all simple queries as "simple" (≤3 terms or trigger match) 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-03: Moderate Tier Classification > classifies all moderate queries as "moderate" (4-8 terms, no trigger) 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-04: Complex Tier Classification > classifies all complex queries as "complex" (>8 terms, no trigger) 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-12: Comprehensive Accuracy > 100% accuracy on simple tier (10+ queries) 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-12: Comprehensive Accuracy > 100% accuracy on moderate tier (10+ queries) 0ms
 ✓ mcp-server/tests/query-classifier.vitest.ts > T022-12: Comprehensive Accuracy > 100% accuracy on complex tier (10+ queries) 0ms
 ✓ mcp-server/tests/token-budget.vitest.ts > CHK-023: adjustedBudget formula (header overhead deduction) > T1: produces expected values for typical inputs 0ms
 ✓ mcp-server/tests/token-budget.vitest.ts > CHK-023: adjustedBudget formula (header overhead deduction) > T2: budget never goes below 200 (the floor) 0ms
 ✓ mcp-server/tests/token-budget.vitest.ts > CHK-023: adjustedBudget formula (header overhead deduction) > T5: truncateToBudget respects the adjusted budget when passed 0ms

 Test Files  3 passed (3)
      Tests  113 passed (113)
   Start at  11:41:44
   Duration  761ms (transform 406ms, setup 19ms, import 536ms, tests 19ms, environment 0ms)
```

Additional direct probe attempt from `.opencode/skills/system-spec-kit/mcp-server`:

```bash
npx tsx -e "import { classifyQueryComplexity } from './lib/search/query-classifier.ts'; import { getDynamicTokenBudget } from './lib/search/dynamic-token-budget.ts'; const queries = ['fix bug','refactor the database connection module','explain how the authentication module integrates with the external OAuth provider and handles token refresh']; process.env.SPECKIT_COMPLEXITY_ROUTER = 'true'; process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true'; const enabled = queries.map((query) => { const classification = classifyQueryComplexity(query); const budget = getDynamicTokenBudget(classification.tier); return { query, tier: classification.tier, termCount: classification.features.termCount, confidence: classification.confidence, budget: budget.budget, applied: budget.applied }; }); process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'false'; const disabled = ['simple','moderate','complex'].map((tier) => ({ tier, ...getDynamicTokenBudget(tier) })); console.log(JSON.stringify({ enabled, disabled }, null, 2));"
```

Observed output:

```text
sh: tsx: command not found
```

Follow-up loader checks found no built TS loader or built `dist/` modules in this checkout:

```text
No files found
```

### Pass / Fail

- **Verdict**: PASS
- **Pass**: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits
- **Fail**: All tiers get same budget or flag-disabled produces error

### Failure Triage

Verify budget allocation formula → Check complexity tier detection → Inspect system budget limits

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [query-intelligence/dynamic-token-budget-allocation.md](../../feature-catalog/query-intelligence/dynamic-token-budget-allocation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 037
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `query-intelligence/dynamic-token-budget-allocation-fut-7.md`
