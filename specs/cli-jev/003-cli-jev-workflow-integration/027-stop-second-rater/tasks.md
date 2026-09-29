---
title: "Tasks: Phase 27: stop-second-rater"
description: "Ordered build and verification tasks for the offline stop second-rater replay: lineage set, gold, zero-call methods, label gate, both model arms, the Keep Rule, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "stop rater tasks"
  - "score-stop-rater tasks"
  - "stop gold label gate tasks"
  - "novelty score arm tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 27: stop-second-rater

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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (proposed) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` (proposed). Every task is Pending. The phase is Planned and was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel. Code tasks go to the CLI executors of parent D5 as single-change briefs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the runtime vitest baseline at HEAD: from `.skilled/skills/system-deep-loop/runtime`, `npx vitest run` pass, fail and skip counts, in `goal.md`'s log (`goal.md`)
- [ ] T002 [P] Reopen every cited seam before the first brief and log any drift: `runtime/scripts/convergence.cjs:480-486`, `:506-549`, `:618-631`, `:805-808`, `runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19`, `deep-research/scripts/reduce-state.cjs:950-990`, `deep-research/references/convergence/convergence-signals.md:41-73` and `.skilled/commands/deep/assets/deep-research-confirm.yaml:637-661` (`goal.md`)
- [ ] T003 [P] Build a fixture lineage corpus in a temp directory inside `V`: a movable lineage with a known gold, a `max-iterations` lineage, a `convergenceMode` `off` lineage, a lineage with no cited source, an inert-window lineage and a lineage whose `legacy` stop lands on its gold (`V`)
- [ ] T004 [P] Write stub `jev` and `cli-deem` binaries inside `V` that log each call and answer per case, for the gate, exit-code and verdict cases (`V`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the lineage walker: tracked `deep-research-state.jsonl` files, the config beside each, REQ-002's movable rule, the `deltas/` check and the sample order (inert window first, then SHA-256 of the lineage path), K at most 25 (`S`)
- [ ] T006 Write the gold deriver: first-appearance sources from `type: finding` delta records, g as the last iteration with one, `no gold` counted (`S`)
- [ ] T007 Write the vote replayer for REQ-003: rolling average, MAD noise floor, question coverage where counts exist, weight redistribution, the 0.60 bar, `minIterations` and a recorded `STOP_BLOCKED` graph event. One function takes the ratio series as input (`S`)
- [ ] T008 Write the three zero-call methods (`recorded`, `legacy`, `sources`), the right-on-lineage test, the baseline pick with its tie order and the census lines, ending in `no headroom` above 90 percent or `planned calls:` (`S`)
- [ ] T009 Write the label gate of REQ-006: `--gold-reads`, the five lineages the census names, `stop: fewer than 5 confirmed lineages` and `stop: derived gold disagrees on <k> of 5 lineages` (`S`)
- [ ] T010 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the payload notice, the published-only check with `git cat-file -e origin/main:<path>`, three `jev score` calls per iteration with the median level, the 90 s cap and REQ-009's Jev exits (`S`)
- [ ] T011 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, one `cli-deem score` per iteration, the 24,000-character bound and REQ-009's Deem exits with the exit-4 recheck (`S`)
- [ ] T012 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines of REQ-010 and the `--out` refusal before any call (`S`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Write `V` with a happy path and one edge case per surface: movable filter, gold deriver, each zero-call method with `minIterations`, `no headroom`, both label-gate stops, Jev gate pass and `no credential` skip, Deem gate pass and stub-backend skip with byte-identical output, a Deem exit 4 with a new pair, an unpublished lineage withheld from Jev, `keep`, `kill` and `stop (coverage)` on scripted answers and one `--provider` on every logged `jev` call. Expect at least 20 passed tests (`V`)
- [ ] T014 Proof step 1: the default run on the real tree with logging stubs first on `PATH`. Read exit 0, the census lines, the headroom line and two absent stub logs (`goal.md`)
- [ ] T015 Proof steps 2 and 3: the label-gate stop with `--jev --deem --out <tmp>`, then each gate skip on stubs, each exit 0 with the census unchanged (`goal.md`)
- [ ] T016 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, and `git status --porcelain` is the same before and after each run (`goal.md`)
- [ ] T017 [B] Only when the operator's reads file exists and the gate passes: one `--deem --out` run against the local server and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line for a status and wall time. Blocked on the operator's five-lineage read (`goal.md`)
- [ ] T018 Write the parent D6 docs through sk-doc after the runs: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`)
- [ ] T019 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`)
- [ ] T020 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T017 left `[B]` with the label-gate stop line recorded as the phase's result
- [ ] No other `[B]` blocked tasks remaining
- [ ] Manual verification passed: the default run and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
