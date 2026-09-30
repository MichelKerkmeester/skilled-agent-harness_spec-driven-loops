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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` (built at 1,826 lines) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` (built at 42 tests). The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds ran in number order. Closure (2026-09-30): built and committed as `fe84dd1899`, 16 files, and closed at its label gate. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the briefs in `scratch/w4-build/briefs/` and the session facts in `scratch/w4-session/docs/facts.txt`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`). Evidence: the baseline row is in `goal.md`'s Progress; after 029 the runtime suite held 127 files and 2,489 tests, and the final suite holds 128 files and 2,531 tests, this phase's one file and its 42 tests more (`SE` section 2)
- [x] T002 [P] Reopen `runtime/scripts/fanout-merge.cjs:345-354`, `:358-392`, `:399-402`, `:504-510` and `:1404`, and log any drift (`goal.md`). Evidence: design section 1 rechecked every cited site; all five resolve, with no new drift beyond the seam-drift row already in `goal.md` (`../w4-build/design.md` section 1; `SE` section 1)
- [x] T003 [P] Build fixture runs inside `V`: a two-lineage research run and a two-lineage review run holding a near-line pair, a cross-body pair, a pair outside both bands and a one-lineage run (`V`). Evidence: `V` builds those fixtures and all 42 cases pass (`SE` section 2; `../w4-build/design.md` section 3)
- [x] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case, including a Deem stub whose two orders disagree (`V`). Evidence: the stub binaries mount first on `PATH`, the default run writes no stub log, and `deem arm marks a disagreeing pair unstable` reads its own stub (`SE` section 2; `../w4-build/design.md` section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the run walker and pairer of REQ-002 over tracked lineage registries (`S`). Spec REQ-002. Evidence: the final-state default run exits 0 with `runs: research=57 review=46` and `pairs: research=19 review=105`; `V` covers the walker over both research registry names, a one-lineage run and the review findings field (`SE` section 2; `facts.txt`)
- [x] T006 Write the selection classifier of REQ-002, both bands and the title-or-text fallback (`S`). Spec REQ-002. Evidence: the census prints `class near-line: research=0 review=0` and `class cross-body: research=19 review=105`; `V` covers both bands inside, below and at the upper edge plus the text fallback (`SE` section 2; `../w4-build/design.md` section 3)
- [x] T007 Write the merge oracle of REQ-003: the exported merge on a two-registry copy per pair, dedup on and off, and the baseline pick with dedup off on a tie (`S`). Spec REQ-003. Evidence: the final run prints the four `merge decisions:` lines and `merge undecidable: 12`; `V` covers both decisions, today's default, an unreadable pair and both baseline picks; fixes c11f and c11g settled the one-side-drop case (`SE` sections 1 to 3)
- [x] T008 Write the pair sheet and label reader of REQ-005, both gate counts and `no headroom` (`S`). Spec REQ-005. Evidence: a sheet path inside the repository exits 2 with `refusing to write the pair sheet inside the repository` and writes no file, and outside it holds 60 rows; `V` covers both stop lines, an unknown label, a dropped key and `no headroom` (`SE` section 2; `facts.txt`)
- [x] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, the published-only check, three `jev noul` calls per pair (AB, BA, AB), the 90 s cap and REQ-009's Jev exits (`S`). Spec REQ-006 to REQ-009. Evidence: below the gate `--jev --out <dir>` adds only `jev arm skipped: label gate` and calls no stub; `V` covers the gate pass carrying `--provider official`, a version skip, `no credential` on exit 3, an unpublished pair withheld and a `keep` verdict (`SE` sections 2 and 3; `facts.txt`)
- [x] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, two `cli-deem noul` calls per pair (AB, BA), `unstable` on disagreement and REQ-009's Deem exits with the exit-4 recheck (`S`). Spec REQ-006, REQ-008 and REQ-009. Evidence: below the gate `--deem --out <dir>` adds only `deem arm skipped: label gate` and writes only `report.json`; `V` covers a fake health, the stub-backend skip, an unreachable server and a pair whose two orders disagree (`SE` sections 2 and 3; `facts.txt`)
- [x] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line with `reader=none named` on stdout and in `report.json`, the requalify lines and the `--out` refusal before any call (`S`). Spec REQ-004 and REQ-010. Evidence: `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call and with no stdout; `V` covers `keep`, `kill`, `stop (coverage)`, `stop (flips)` and one requalify case per arm (fixes c11h and c11i); no real run printed a verdict (`SE` section 2; `facts.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: run walker, both classes in and out of band, selection parity with the merge, merge oracle, pair sheet inside and outside, both gate stops, `no headroom`, both gates passing and skipping, a Deem `unstable` pair, an unpublished pair withheld from Jev and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`). Spec REQ-011. Evidence: `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` prints `Tests 42 passed (42)`, against the floor of 22 (`SE` section 2)
- [x] T013 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, each census line and two absent stub logs (`goal.md`). Evidence: the final-state default run exits 0 in 1 s with `runs: research=57 review=46`, `pairs: research=19 review=105`, both `class` lines, the four `merge decisions:` lines, the `title rule:` and `body fields:` lines, `merge undecidable: 12` and `stop: fewer than 40 labeled pairs`, and the stub log was never written (`SE` section 2; `facts.txt`)
- [x] T014 Proof steps 2 and 3 on fixtures: the pair sheet inside and outside the repository, both gate stops and the Deem stub-backend skip (`goal.md`). Evidence: the inside refusal and the 60-row outside sheet are session runs; the 39-row stop, the 40-row cross-body stop, `deem arm skipped: stub backend` and the exit-3 `no credential` skip are `V` cases, since the session writes no label file (parent D4; `SE` sections 2 and 6)
- [x] T015 Proof step 5: `git diff --stat` on `fanout-merge.cjs` is empty, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing and `git status --porcelain` is the same before and after each run (`goal.md`). Evidence: the key grep exits 1 with no match, `git status --porcelain` was equal before and after each run, and `fanout-merge.cjs` has no diff (`SE` section 2)
- [B] T016 Write the real pair sheet to a path the operator names outside the repository and hand it over (`goal.md`). Blocked on the operator: the session wrote a 60-row sheet with empty labels outside the repository as the proof of the write path, but no operator-named path exists, so the handover waits (parent D4; `SE` sections 2 and 6)
- [B] T017 Only when the operator's labels pass the gate: one `--deem --out` run and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's labels (`goal.md`). The zero-call runs stopped at the gate, so no arm ran, no `calls.jsonl` exists and no verdict line printed (parent D4; `SE` sections 2 and 6)
- [x] T018 Write the parent D6 docs through sk-doc: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the fanout catalog entry and the fanout playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`). Evidence: eight docs landed in `fe84dd1899`: the hub `SKILL.md` sentence, `runtime/README.md`, `runtime/scripts/README.md`, `changelog/v1.9.0.0.md`, the catalog leaf `feature-catalog/fanout/fanout-pair-replay.md` with its index block, and the playbook leaf `manual-testing-playbook/fanout/fanout-pair-replay.md` (DLR-059) with its index rows; `validate_document.py` exits 0 on each, and fix f1 rewrote the hub sentence and the scripts README row after the docs review's two P1 (`SE` sections 1, 3 and 4; `facts.txt`)
- [x] T019 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`). Evidence: the final-state suite run prints `Test Files 128 passed (128)` and `Tests 2531 passed (2531)`, the baseline's 127 files and 2,489 tests plus this phase's one file and 42 tests, with no failure; the closure pass ran `validate.sh --strict` and `check-goal.cjs` and both pass (`SE` section 2; `implementation-summary.md` Verification)
- [x] T020 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`). Evidence: this closure pass recorded the census, the 60-row sheet, `stop: fewer than 40 labeled pairs` and the absence of any verdict line in both (`implementation-summary.md`; `goal.md` Progress and Deviations)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T016 and T017 left `[B]` with the gate stop line recorded as the phase's result (parent D4; amended at close, logged in `goal.md`)
- [x] No `[B]` blocked tasks remaining other than T016 and T017, which wait on the operator's pair-sheet path and labels (parent D4)
- [x] Manual verification passed: the census, the pair sheet and the gate runs were read by the orchestrator session, and `goal.md`'s log carries `stop: fewer than 40 labeled pairs` (`SE` sections 2 and 6)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
