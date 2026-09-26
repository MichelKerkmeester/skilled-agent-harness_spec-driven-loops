---
title: "Tasks: Offline Advisor Jev Tie-Break Arm"
description: "Ordered tasks for the zero-call census and baseline column, the jev key gate, the --jev arm with its per-call record, and the stub and keyed verification runs."
trigger_phrases:
  - "advisor jev tie-break tasks"
  - "score-jev-tiebreak tasks"
  - "jev key gate tasks"
  - "jev arm verification tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the advisor `dist` and confirm the H1 ratchet is green at HEAD (`.skilled/skills/system-skill-advisor/runtime/dist/`)
- [ ] T002 [P] Reopen the cluster rule, the split and metric functions and the capture env before copying them (`ambiguity.ts:7-8`, `:44-58`; `score-outcome-rerank.mjs:85-121`; `capture-scorer-eval-baseline.mjs:35-49`, `:70-76`)
- [ ] T003 [P] Write a stub `jev` in a temporary directory that logs its arguments and answers per case, for the gate and exit-code runs (outside the repository)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Set the deterministic env before the `dist` import and load the corpus, the holdout file and the frozen tau 0.03 slice (`routing-accuracy/score-jev-tiebreak.mjs`)
- [ ] T005 Write the census: eligible and movable counts per split at the live 0.05 cluster and within the tau 0.03 slice, and `no headroom` at zero movable held-out rows (`score-jev-tiebreak.mjs`)
- [ ] T006 Write the baseline column: MRR, right@1 and right@3 on the held-out half and alias-aware top-1 on the holdout file, with `baseline mismatch: comparison void` when holdout top-1 is not 53/70 (`score-jev-tiebreak.mjs`)
- [ ] T007 Stop here and record the reason if the census prints `no headroom` or the baseline mismatches (`implementation-summary.md`)
- [ ] T008 Add the `--jev` key gate in order: `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status` exit 0, each failure printing its line and exiting 0 with census and baseline intact (`score-jev-tiebreak.mjs`)
- [ ] T009 Add the arm: payload class and planned call count, one `jev auth test` for the model, one `jev choice` per eligible row per pass over the cluster keys plus `none`, argument array, prompt on stdin, stdin closed, no key read or passed (`score-jev-tiebreak.mjs`)
- [ ] T010 Add the exit handler for 0, `none`, 1, 2, 3, 4 with one backoff retry, 130 and a key outside the submitted set, with no default score (`score-jev-tiebreak.mjs`)
- [ ] T011 Write `calls.jsonl` and `report.json` to the `--out` directory: both columns on identical rows, unmeasured counts, `keep` verdict, tau 0.03 split of the gain and the stability coefficient over three passes (`score-jev-tiebreak.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the default run with the stub first on PATH: census, baseline 53/70, exit 0 and an empty stub log
- [ ] T013 Run `--jev` against the stub for no credential, the wrong version and no `jev` on PATH, and read each printed line, exit status and stub log
- [ ] T014 Run `--jev` against the stub for exits 4, 1, 2 and 3 and a key outside the submitted set, and read each row's status
- [ ] T015 Run `grep -n API_KEY` on the script and expect no match
- [ ] T016 Run the arm once with a real key and `--out` outside the repository, and read the report and every `calls.jsonl` line for a wall time
- [ ] T017 Run `git status --porcelain` and confirm only `score-jev-tiebreak.mjs` changed
- [ ] T018 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T019 Fill `implementation-summary.md` with the census counts, both columns, the verdict and the latency figures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
