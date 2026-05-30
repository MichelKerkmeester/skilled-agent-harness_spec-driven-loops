---
title: "DLR-025 -- Fan-out CLI lineage driver spawn and isolation"
description: "Validate fanout-run.cjs creates per-lineage dirs with isolated .executor-state paths, saves stdout to logs/, writes orchestration summary and ledger, and returns early for native-only configs."
---

# DLR-025 -- Fan-out CLI lineage driver spawn and isolation

This document captures the validation contract, execution flow, and metadata for `DLR-025`.

---

## 1. OVERVIEW

Validates the CLI lineage pool driver `fanout-run.cjs` — specifically lineage dir creation,
per-kind state-dir isolation, stdout capture, and orchestration artifacts.

### Why This Matters

This is the script that dispatches all CLI executor fan-out lineages. If the per-kind
`SPECKIT_<KIND>_STATE_DIR` is not set per-lineage, same-kind replicas collide on lockfiles.
If stdout is not saved, the salvage sweep has nothing to recover from.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `fanout-run.cjs` creates distinct per-lineage dirs and state dirs, writes orchestration artifacts, and returns early for native-only configs.
- Layer partition: CLI lineage dispatch.
- Real user request: `Validate the fan-out CLI lineage driver and confirm the 5 integration tests pass, verifying lineage isolation and orchestration artifact creation.`
- Expected signals: `lineages/lineage-a/` and `lineages/lineage-b/` dirs created; `.executor-state/` paths distinct for same-kind replicas; `orchestration-summary.json` present with `total_cli_lineages=2`; `orchestration-status.log` has JSONL events; native-only config returns `{status:"ok", results:[]}`.
- Pass/fail: PASS if all 5 tests pass and source inspection confirms `SPECKIT_STATE_ENV_BY_KIND` usage; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-run.cjs` and `scripts/fanout-salvage.cjs` present.

### Steps

1. Inspect `scripts/fanout-run.cjs` — confirm `SPECKIT_STATE_ENV_BY_KIND` map, `computeLineageTimeoutMs` formula, `buildLineageCommand` per-kind branch.
2. Verify `extraEnv` in the worker sets both `SPECKIT_FANOUT_LINEAGE_ID` and the kind-specific state dir var.
3. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
4. Confirm 5 tests pass. Note: the 2-lineage stub test verifies dirs, ledger, and summary; the lockfile-isolation test verifies `.executor-state` paths are distinct for same-kind replicas.

### Expected Outcome

5/5 pass. Lineage dirs created, `.executor-state` dirs distinct, `orchestration-summary.json` with `total_cli_lineages=2`, JSONL ledger written, native-only config returns early without spawning.

### Failure Modes

- Missing `SPECKIT_<KIND>_STATE_DIR` in env: same-kind replicas use the same state dir and may trip the loop-lock.
- stdout not saved to `logs/fanout-lineage.out`: salvage sweep has no data to recover from.
- Pool worker throws instead of settling: pool fails entirely rather than reporting per-item status.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-run.cjs` | CLI arg parsing, pool orchestration, per-kind command construction, stdout capture, salvage call |
| `scripts/fanout-salvage.cjs` | Salvage called in worker after subprocess exits |
| `scripts/fanout-pool.cjs` | `runCappedPool` + ledger used by the driver |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | 5 integration tests with stub CLI binaries |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-025
- Feature catalog entry: `feature_catalog/09--fanout/03-fanout-run.md`
- Scenario file path: `manual_testing_playbook/09--fanout/025-fanout-run-cli-lineage-spawn.md`
- Expected verdict mode: GREEN when 5/5 pass and source anchors agree
- Wall-time estimate: 5-10 min
