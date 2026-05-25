---
title: "Substrate Stress Tests"
description: "Canonical Vitest gate for local substrate stress coverage promoted from the 045 shared-daemon runner."
trigger_phrases:
  - "substrate stress"
  - "vitest substrate gate"
---

# Substrate Stress Tests

`stress_test/substrate/` promotes the 045 shared-daemon runner into a canonical Vitest gate and adds pure-logic stress coverage for the local LLM substrate. This slice is provider-aware where it must be and pure logic where daemon startup would add noise.

## Scope

| File | Coverage |
|---|---|
| `run-substrate-stress-harness.mjs` | Copy of the 045 direct MCP runner adapted to run from `mcp_server/stress_test/substrate/`. |
| `substrate-runner-harness.vitest.ts` | Subprocess smoke for scenarios 403, 404, 407, and 410 through shared Memory and Code Graph MCP daemons. |
| `query-expansion-bound-stress.vitest.ts` | Bounded combined-query construction for 100 expansion-eligible queries. |
| `v-rule-save-flood-stress.vitest.ts` | V8 cross-spec contamination rules under a 50-save canonical-doc flood. |

## Run Recipe

Run the substrate gate from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npm run stress:substrate
```

Run only the pure-logic substrate checks:

```bash
npx vitest run --config vitest.stress.config.ts \
  stress_test/substrate/query-expansion-bound-stress.vitest.ts \
  stress_test/substrate/v-rule-save-flood-stress.vitest.ts
```

Run only the promoted daemon harness:

```bash
npx vitest run --config vitest.stress.config.ts stress_test/substrate/substrate-runner-harness.vitest.ts
```

## Scenario Boundary

The harness still writes TSV evidence to `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv`. That preserves the 045 operator evidence path while making the same smoke a canonical Vitest gate. The sandbox runner remains in place as the operator-facing evidence tool; keep the two runner copies manually synchronized until an automated mirror exists.
