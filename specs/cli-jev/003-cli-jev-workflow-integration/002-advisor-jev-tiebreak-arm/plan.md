---
title: "Implementation Plan: Offline Advisor Jev Tie-Break Arm"
description: "One new read-only script beside the routing-accuracy evals: a zero-call census and baseline column by default, and a --jev arm gated on jev 0.6.2 and jev auth status that asks a Python jev-cli choice over the advisor's near-tie cluster and scores both orders on identical held-out rows."
trigger_phrases:
  - "advisor jev tie-break plan"
  - "score-jev-tiebreak plan"
  - "jev census baseline column"
  - "jev arm key gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`.mjs`), no new dependency |
| **Framework** | The advisor's built `dist` scorer, imported the way `score-outcome-rerank.mjs:35-38` imports it; the Python `jev-cli` 0.6.2 spawned as a child process for the arm only |
| **Storage** | None in the repository. `report.json` and `calls.jsonl` go to a directory the operator names with `--out` |
| **Testing** | Stub-`jev` runs for the gate and zero-call paths, one keyed run for the arm, `git status --porcelain` for read-only proof |

### Overview

The script scores every held-out row with the built scorer under the baseline capture's deterministic env, finds each row's near-tie cluster from `ambiguousWith`, and counts eligible and movable rows. That census and the scorer's own metrics are the default output, with zero Jev calls. With `--jev` and every gate passing, it asks one `jev choice` per eligible row per pass over the cluster keys plus `none`, moves Jev's pick first inside the cluster and scores both orders on the same rows over three passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A standalone offline eval script: read the corpus, score it, print a report. It shares the split and metric logic of `score-outcome-rerank.mjs` by copying `:85-121`, about 40 lines, because that script exports nothing and runs its eval on import (`:159`). A separate file keeps the rerank eval's read-only meaning and deletes cleanly.

### Key Components

- **Deterministic env**: set before the `dist` import, as `capture-scorer-eval-baseline.mjs:35-46` does: `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, a fresh empty `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, and the lane-weight overrides deleted.
- **Split and metrics**: the rerank eval's deterministic 50/50 split by sorted id (`score-outcome-rerank.mjs:118-121`) and its MRR, right@1 and right@3 (`:85-112`). Holdout top-1 uses the capture's alias-aware match (`capture-scorer-eval-baseline.mjs:49`, `:70-76`).
- **Cluster reader**: the passing top plus its `ambiguousWith` members, as `applyAmbiguity` writes them (`ambiguity.ts:44-58`, margins at `:7-8`). A row is eligible when the cluster has two or more keys, and movable when the gold skill is in the cluster but not first. Frozen tau 0.03 membership comes from `ambiguity-prompts.jsonl`.
- **Key gate**: runs only when `--jev` is set, in order, stopping at the first failure:
  1. `command -v jev`. Missing: `jev arm skipped: jev not on PATH`.
  2. `jev --version` prints exactly `jev 0.6.2`, the Python `jev-cli` that `.skilled/skills/cli-jev/cli-usage/` wraps. Anything else, such as the npm `jevctl` that also installs `jev`: `jev arm refused: expected jev 0.6.2`.
  3. `jev auth status` exits 0. It exits 0 for a stored key or an exported `TYPESAFE_API_KEY`, exits 3 with none, never prints the key and spends no quota. Exit 3: `jev arm skipped: no credential`.
  Each failure leaves the census and baseline exactly as the default run prints them, and the script exits 0.
- **Jev arm**: prints the payload class and planned call count, runs one `jev auth test` to record the model (one billed call), then per eligible row per pass spawns `jev choice -q <fixed question> -o '<skill>=<projection description>' ... -o 'none=<none of these fits>'` with an argument array and no shell, the prompt text on stdin and stdin closed. The skill description comes from the projection (`types.ts:43`, `projection.ts:49`). The script never reads or passes a key.
- **Exit handler**: 0 with a submitted key is a pick, `none` an abstention, 1 or an unknown key `unmeasured`, 2 `unmeasured` and stop, 3 stop and `partial`, 4 one backoff retry then `unmeasured`, 130 stop and `interrupted`. No path writes a default score.
- **Reporter**: both columns on identical rows, unmeasured counts beside each metric, the `keep` verdict by the rule at `score-outcome-rerank.mjs:149-150`, the tau 0.03 split of the gain and the stability coefficient over three passes (1 minus stddev over mean, threshold 0.95, from `benchmark-stability.cjs`).

### Data Flow

Corpus rows go through the scorer to a fused order and a cluster. The census counts clusters. The baseline column scores the fused order. With `--jev`, each eligible row's cluster and prompt go to `jev choice`, the answer reorders the cluster, and the Jev column scores that order. Rows that are not eligible keep the fused order in both columns. Every call appends one line to `calls.jsonl`, and the totals go to `report.json` and stdout.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. Build the advisor `dist` and confirm the H1 ratchet is green at HEAD, so the baseline column has a known scorer.
2. Write the census and baseline column with no Jev code path at all. Run it and read the eligible and movable counts and holdout top-1.
3. Stop if the census prints `no headroom` or the baseline is not 53/70, and record why in `implementation-summary.md`.
4. Add the key gate, then prove each gate branch with a stub `jev` before any real call.
5. Add the arm, the exit handler and the per-call JSONL.
6. Run the arm once with a real key and `--out` outside the repository, and read the report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`. The stub is a temporary directory holding an executable `jev` script that appends its arguments to a log and answers as the case needs.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Default run, zero calls | `PATH="$STUB:$PATH" node $S` | Eligible and movable counts for both splits at 0.05 and tau 0.03, the baseline column with holdout top-1 `53/70`, exit 0, and an empty stub log |
| No credential | stub `auth status` exits 3; `PATH="$STUB:$PATH" node $S --jev` | `jev arm skipped: no credential`, census and baseline identical to the default run, exit 0, the stub log holds only `--version` and `auth status` |
| Wrong package | stub `--version` prints `jevctl 1.0.0` | `jev arm refused: expected jev 0.6.2`, exit 0, the stub log holds only `--version` |
| No `jev` | `PATH=/usr/bin:/bin node $S --jev` | `jev arm skipped: jev not on PATH`, exit 0 |
| Exit handling | stub `choice` exits 4, then 1, then 2, then 3 on successive rows | Row `unmeasured` after one retry, row `unmeasured`, arm stops, arm stops with `partial` |
| No key on a command line | `grep -n API_KEY $S` | No match, exit 1 |
| Keyed arm | `node $S --jev --out <dir outside repo>` with a real key | Payload class and planned call count before the first call, both columns with MRR, right@1 and right@3, unmeasured counts, `keep` verdict, stability coefficient, and a wall time on every `calls.jsonl` line |
| Read-only | `git status --porcelain` | Only `score-jev-tiebreak.mjs` |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor `dist` must be built. The arm needs the Python `jev-cli` 0.6.2 on PATH and a credential that `jev auth status` resolves; the default run needs neither. No package is installed by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `score-jev-tiebreak.mjs` and the report directory the operator named. No other file changes, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
