---
title: "DLR-025 -- Fan-out CLI lineage driver spawn and isolation"
description: "Validate fanout-run.cjs creates per-lineage dirs with isolated .executor-state paths, saves stdout to logs/, writes orchestration summary and ledger, and returns early for native-only configs."
version: 1.4.3.0
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
- Real user request: `Validate the fan-out CLI lineage driver and confirm the selected lineage-isolation and orchestration cases pass, verifying lineage isolation and orchestration artifact creation.`
- Expected signals: `lineages/lineage-a/` and `lineages/lineage-b/` dirs created; `.executor-state/` paths distinct for same-kind replicas; `orchestration-summary.json` present with `total_cli_lineages=2`; `orchestration-status.log` has JSONL events; native-only config returns `{status:"ok", results:[]}`.
- Pass/fail: PASS only if every selected case passes with EXIT 0 and source inspection confirms `SPECKIT_STATE_ENV_BY_KIND` usage; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-run.cjs` and `scripts/fanout-salvage.cjs` present.

### Prompt

- Prompt: `Validate the fan-out CLI lineage driver and confirm the selected lineage-isolation and orchestration cases pass, verifying lineage isolation and orchestration artifact creation.`

### Commands

1. Inspect `scripts/fanout-run.cjs` — confirm `SPECKIT_STATE_ENV_BY_KIND` map, `computeLineageTimeoutMs` formula, `buildLineageCommand` per-kind branch.
2. Verify `extraEnv` in the worker sets both `SPECKIT_FANOUT_LINEAGE_ID` and the kind-specific state dir var.
3. `bash: cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts -t "creates two isolated lineage dirs|for each same-kind replica|emits ok JSON for native fanout"`
4. Confirm every selected case passes. The filter selects three cases: `creates two isolated lineage dirs and writes orchestration summary for 2 cli-opencode lineages`, `sets distinct SPECKIT_OPENCODE_STATE_DIR for each same-kind replica to prevent lockfile collisions` and `exits 0 and emits ok JSON for native fanout through opencode command dispatch`. The first verifies dirs, ledger and summary; the second verifies `.executor-state` paths are distinct for same-kind replicas; the third verifies the early return.
5. Run the runner on a one-lineage research matrix with a throwaway `--spec-folder` and `--base-artifact-dir` and no `--only-lineage`. Confirm exit 3, a message that names the single-executor `/deep:research` workflow, and no lineage directory, ledger or summary under the base directory. Rerun with `--only-lineage <label>`, naming the matrix entry's label, and confirm the lineage starts.

### Expected Outcome

Every selected case passes. Lineage dirs created, `.executor-state` dirs distinct, `orchestration-summary.json` with `total_cli_lineages=2`, JSONL ledger written, native-only config returns early without spawning. Step 5 exits 3 with no side effect, and the `--only-lineage` rerun starts its one lineage.

### Evidence

- Source excerpts from `scripts/fanout-run.cjs`, `scripts/fanout-salvage.cjs`, `scripts/fanout-pool.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/fanout-run.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Missing `SPECKIT_<KIND>_STATE_DIR` in env: same-kind replicas use the same state dir and may trip the loop-lock.
- stdout not saved to `logs/fanout-lineage.out`: salvage sweep has no data to recover from.
- Pool worker throws instead of settling: pool fails entirely rather than reporting per-item status.
- Step 5 starts a lineage without the opt-in: the one-lineage guard no longer runs before setup, so a chat session can again run every iteration in one process.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-run.cjs` | CLI arg parsing, pool orchestration, per-kind command construction, stdout capture, salvage call |
| `scripts/fanout-salvage.cjs` | Salvage called in worker after subprocess exits |
| `scripts/fanout-pool.cjs` | `runCappedPool` + ledger used by the driver |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | The selected lineage-spawn, lockfile-isolation and native early-return cases, run with `-t` |

---

## 5. SOURCE METADATA

- Group: Fan-Out
- Playbook ID: DLR-025
- Feature catalog entry: `feature-catalog/fanout/fanout-run.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when every selected case passes and source anchors agree
- Wall-time estimate: 5-10 min
