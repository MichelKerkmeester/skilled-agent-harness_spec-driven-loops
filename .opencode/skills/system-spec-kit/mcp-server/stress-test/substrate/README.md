---
title: "Substrate Stress Tests"
description: "Canonical Vitest gate for local substrate stress coverage, sandbox cleanup, and the shared-daemon runner."
trigger_phrases:
  - "substrate stress"
  - "vitest substrate gate"
---

# Substrate Stress Tests

## 1. OVERVIEW

`stress-test/substrate/` promotes the shared-daemon runner into a canonical Vitest gate and adds pure-logic stress coverage for the local LLM substrate. This slice is provider-aware where it must be and pure logic where daemon startup would add noise.

## 2. SCOPE

| File | Coverage |
|---|---|
| `run-substrate-stress-harness.mjs` | Direct MCP runner adapted to run from `mcp-server/stress-test/substrate/`. |
| `substrate-runner-harness.vitest.ts` | Subprocess smoke for scenarios 403, 404, 407, and 410 through shared Memory and Code Graph MCP daemons. |
| `substrate-harness-hardening.vitest.ts` | Owner-identity hardening for the harness lease: accepts the current process when the lease start time matches and rejects a recycled PID whose start time does not. |
| `idempotency-receipt-race-stress.vitest.ts` | Idempotency receipt race coverage under concurrent save pressure. |
| `query-expansion-bound-stress.vitest.ts` | Bounded combined-query construction for 100 expansion-eligible queries. |
| `secret-scrub-save-flood-stress.vitest.ts` | Secret scrub behavior under save-flood stress. |
| `v-rule-save-flood-stress.vitest.ts` | V8 cross-spec contamination rules under a 50-save canonical-doc flood. |

## 3. RUN RECIPE

Run the substrate gate from `.opencode/skills/system-spec-kit/mcp-server`:

```bash
npm run stress:substrate
```

Run only the pure-logic substrate checks:

```bash
npx vitest run --config vitest.stress.config.ts \
  stress-test/substrate/query-expansion-bound-stress.vitest.ts \
  stress-test/substrate/v-rule-save-flood-stress.vitest.ts
```

Run only the promoted daemon harness:

```bash
npx vitest run --config vitest.stress.config.ts stress-test/substrate/substrate-runner-harness.vitest.ts
```

Run the standalone harness and remove all regenerated sandbox evidence after it exits:

```bash
node stress-test/substrate/run-substrate-stress-harness.mjs --clean
```

## 4. SCENARIO BOUNDARY

The harness writes TSV evidence to `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` and regenerates its sandbox from scratch inputs. The sandbox also holds a throwaway hermetic Code Graph database at `.tmp-cg-db/`; `cleanupSandbox()` always removes that DB after daemon connections close.

The standalone runner supports `--clean`. When set, it removes the whole `_sandbox/24--local-llm-query-intelligence/` run directory and then attempts to remove the now-empty `_sandbox/` parent. The Vitest wrapper intentionally omits `--clean` because it must read the TSV after the child process exits, then its `afterAll` block removes the same run directory and best-effort parent. A successful `npm run stress:substrate` should not leave sandbox evidence behind.
