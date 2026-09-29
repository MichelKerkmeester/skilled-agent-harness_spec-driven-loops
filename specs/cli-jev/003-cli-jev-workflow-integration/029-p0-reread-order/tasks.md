---
title: "Tasks: Phase 29: p0-reread-order"
description: "Ordered build and verification tasks for the offline severity replay: census, label sheet, the 20-negative label gate, both model arms, the Keep Rule, the reread order and validity funnel, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "severity replay tasks"
  - "score-severity-replay tasks"
  - "p0 label gate tasks"
  - "validity funnel tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: p0-reread-order

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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` (proposed) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` (proposed). Every task is Pending. The phase is Planned and was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`)
- [ ] T002 [P] Reopen `deep-review/references/protocol/completion-criteria.md:61-63`, `:75`, `deep-review/references/convergence/convergence.md:398-400`, `runtime/lib/blinded-adjudication/mode-adapters.ts:59`, `:63-72` and grok-04's phrase list, and log any drift (`goal.md`)
- [ ] T003 [P] Build fixture registries and iteration files inside `V`: P0 rows in one and in several registries, a transition into P0, a planted rejected-P0 phrase and a finding id of the `P2-001` shape (`V`)
- [ ] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case (`V`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the census of REQ-002: registries, findings by severity, the transitions matrix, P0 rows per registry, the phrase counts over tracked review iteration files and the `labels needed:` line (`S`)
- [ ] T006 Write the label sheet and reader of REQ-005: `--write-label-sheet` outside the repository with exit 2 inside, `--labels` with per-row label validation and the 20-negative gate line (`S`)
- [ ] T007 Write the baseline and headroom of REQ-003 (`S`)
- [ ] T008 Write the state builder of REQ-007 without the finding id, and the published-only check with `git cat-file -e origin/main:<path>` (`S`)
- [ ] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, three `jev choice` calls per row in the orders of REQ-008, the 90 s cap and REQ-009's Jev exits (`S`)
- [ ] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, three `cli-deem choice` calls per row and REQ-009's Deem exits with the exit-4 recheck (`S`)
- [ ] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines and the `--out` refusal before any call (`S`)
- [ ] T012 Add the report-only lines of REQ-010: reread order, validity funnel with one `noul` per measured row and the exact-class line (`S`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: census counts, phrase counter, label sheet inside and outside, unknown label, gate at 19 and 20, `no headroom`, no finding id in a logged call, both gates passing and skipping, Deem exit 4 with a new pair, an unpublished row withheld from Jev and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`)
- [ ] T014 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, each census line and two absent stub logs, and match the P0 and transition counts with an independent `node` count (`goal.md`)
- [ ] T015 Proof steps 2 and 3 on fixtures: the label sheet inside and outside the repository, the gate stop at 19 negatives and the Deem stub-backend skip at 20 (`goal.md`)
- [ ] T016 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, and `git status --porcelain` is the same before and after each run (`goal.md`)
- [ ] T017 Write the real label sheet to a path the operator names outside the repository and hand it over (`goal.md`)
- [ ] T018 [B] Only when the operator's labels hold 20 negatives: one `--deem --out` run and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's labels (`goal.md`)
- [ ] T019 Write the parent D6 docs through sk-doc: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`)
- [ ] T020 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`)
- [ ] T021 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T018 left `[B]` with the gate stop line recorded as the phase's result
- [ ] No other `[B]` blocked tasks remaining
- [ ] Manual verification passed: the census, the label sheet and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
