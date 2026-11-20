---
title: "DLR-025 -- Fan-out CLI lineage driver spawn and isolation"
description: "Validate fanout-run.cjs creates per-lineage dirs with isolated .executor-state paths, saves stdout to logs/, writes orchestration summary and ledger, returns early for native-only configs, and that its --status table and --stop control behave as documented."
version: 1.4.6.0
---

# DLR-025 -- Fan-out CLI lineage driver spawn and isolation

This document captures the validation contract, execution flow, and metadata for `DLR-025`.

---

## 1. OVERVIEW

Validates the CLI lineage pool driver `fanout-run.cjs` — specifically lineage dir creation,
per-kind state-dir isolation, stdout capture, and orchestration artifacts. It also covers the
two operator controls on a run: the read-only `--status` table and `--stop`, which ends a live
run from a second process.

### Why This Matters

This is the script that dispatches all CLI executor fan-out lineages. If the per-kind
`SPECKIT_<KIND>_STATE_DIR` is not set per-lineage, same-kind replicas collide on lockfiles.
If stdout is not saved, the salvage sweep has nothing to recover from.
If `--status` writes, it can disturb the run it reports on. If `--stop` misses a lineage
group, that lineage keeps spending after the operator ended the run.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `fanout-run.cjs` creates distinct per-lineage dirs and state dirs, writes orchestration artifacts, and returns early for native-only configs.
- Layer partition: CLI lineage dispatch.
- Real user request: `Validate the fan-out CLI lineage driver and confirm the selected lineage-isolation and orchestration cases pass, verifying lineage isolation and orchestration artifact creation.`
- Expected signals: `lineages/lineage-a/` and `lineages/lineage-b/` dirs created; `.executor-state/` paths distinct for same-kind replicas; `orchestration-summary.json` present with `total_cli_lineages=2`; `orchestration-status.log` has JSONL events; native-only config returns `{status:"ok", results:[]}`; `--status` prints a header naming, in order, `lineage`, `status`, `iterations`, `last commit`, `nodes answered/open/total`, `flagged passes` and `updated` (columns padded to the widest cell), one row per lineage, exits 0 and leaves the ledger byte-identical; `--status` on a directory with no ledger exits 3; `--stop` prints `{status, stopped, survivors, refused, spared}`, writes a `stopped` row with a `rerun_command` per stopped lineage, and exits 0 when no lineage survives.
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
6. `bash: cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-status.vitest.ts tests/unit/fanout-stop.vitest.ts`. Confirm every case passes, among them `prints one row per lineage from the ledger and writes nothing`, `refuses a directory with no fan-out ledger and creates nothing there`, `stops its lineages and exits 129 when the bootstrap gets SIGHUP` and `--stop ends a live run from a second process and records a rerun for each stopped lineage`.
7. While the step 5 lineage runs, run `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs --status --base-artifact-dir <base>` from a second shell and confirm the table header and one row for that lineage. Then rerun the step 5 command with `--stop` added, and confirm it prints `{status, stopped, survivors, refused, spared}` with the lineage under `stopped` and `refused` and `spared` empty, exits 0, and that `orchestration-status.log` gains a `stopped` row whose `rerun_command` ends `--only-lineage <label>`.

### Expected Outcome

Every selected case passes. Lineage dirs created, `.executor-state` dirs distinct, `orchestration-summary.json` with `total_cli_lineages=2`, JSONL ledger written, native-only config returns early without spawning. Step 5 exits 3 with no side effect, and the `--only-lineage` rerun starts its one lineage. Step 6 passes every status and stop case. Step 7 prints the status table without changing the ledger, and `--stop` ends the lineage with exit 0 and records its `stopped` row and rerun command.

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
- `--status` changes the ledger or creates a file: the status branch no longer returns before the run's setup.
- `--stop` exits 2 with the lineage under `survivors`: the lineage's process group did not end within the 10-second confirm window, or its `spawned` row names a stale pid. A lineage under `refused` was not signalled because its pid's start time no longer matches the `process_start` its `spawned` row recorded, or none was recorded.
- `--stop` exits 3 with a validation error: it was run without the run's own arguments, which it needs to validate the run and build each rerun command.

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
| `tests/unit/fanout-status.vitest.ts` | Progress-row fields and the read-only `--status` table |
| `tests/unit/fanout-stop.vitest.ts` | SIGHUP and parent-death stops and the `--stop` control |

---

## 5. SOURCE METADATA

- Group: Fan-Out
- Playbook ID: DLR-025
- Feature catalog entry: `feature-catalog/fanout/fanout-run.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when every selected case passes and source anchors agree
- Wall-time estimate: 5-10 min
