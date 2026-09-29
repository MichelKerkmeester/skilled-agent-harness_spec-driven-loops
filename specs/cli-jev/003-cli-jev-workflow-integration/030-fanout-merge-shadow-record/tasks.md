---
title: "Tasks: Phase 30: fanout-merge-shadow-record"
description: "Ordered build and verification tasks for the offline fan-out pair replay: runs and pairs, the two candidate classes, the merge oracle, pair sheet and label gate, both model arms, the Keep Rule, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "fanout pair replay tasks"
  - "score-fanout-pairs tasks"
  - "pair label gate tasks"
  - "merge oracle tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 30: fanout-merge-shadow-record

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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` (proposed) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` (proposed). Every task is Pending. The phase is Planned and was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`)
- [ ] T002 [P] Reopen `runtime/scripts/fanout-merge.cjs:345-354`, `:358-392`, `:399-402`, `:504-510` and `:1404`, and log any drift (`goal.md`)
- [ ] T003 [P] Build fixture runs inside `V`: a two-lineage research run and a two-lineage review run holding a near-line pair, a cross-body pair, a pair outside both bands and a one-lineage run (`V`)
- [ ] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case, including a Deem stub whose two orders disagree (`V`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the run walker and pairer of REQ-002 over tracked lineage registries (`S`)
- [ ] T006 Write the selection classifier of REQ-002, both bands and the title-or-text fallback (`S`)
- [ ] T007 Write the merge oracle of REQ-003: the exported merge on a two-registry copy per pair, dedup on and off, and the baseline pick with dedup off on a tie (`S`)
- [ ] T008 Write the pair sheet and label reader of REQ-005, both gate counts and `no headroom` (`S`)
- [ ] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, the published-only check, three `jev noul` calls per pair (AB, BA, AB), the 90 s cap and REQ-009's Jev exits (`S`)
- [ ] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, two `cli-deem noul` calls per pair (AB, BA), `unstable` on disagreement and REQ-009's Deem exits with the exit-4 recheck (`S`)
- [ ] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line with `reader=none named` on stdout and in `report.json`, the requalify lines and the `--out` refusal before any call (`S`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: run walker, both classes in and out of band, selection parity with the merge, merge oracle, pair sheet inside and outside, both gate stops, `no headroom`, both gates passing and skipping, a Deem `unstable` pair, an unpublished pair withheld from Jev and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`)
- [ ] T013 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, each census line and two absent stub logs (`goal.md`)
- [ ] T014 Proof steps 2 and 3 on fixtures: the pair sheet inside and outside the repository, both gate stops and the Deem stub-backend skip (`goal.md`)
- [ ] T015 Proof step 5: `git diff --stat` on `fanout-merge.cjs` is empty, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing and `git status --porcelain` is the same before and after each run (`goal.md`)
- [ ] T016 Write the real pair sheet to a path the operator names outside the repository and hand it over (`goal.md`)
- [ ] T017 [B] Only when the operator's labels pass the gate: one `--deem --out` run and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's labels (`goal.md`)
- [ ] T018 Write the parent D6 docs through sk-doc: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the fanout catalog entry and the fanout playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`)
- [ ] T019 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`)
- [ ] T020 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T017 left `[B]` with the gate stop line recorded as the phase's result
- [ ] No other `[B]` blocked tasks remaining
- [ ] Manual verification passed: the census, the pair sheet and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
