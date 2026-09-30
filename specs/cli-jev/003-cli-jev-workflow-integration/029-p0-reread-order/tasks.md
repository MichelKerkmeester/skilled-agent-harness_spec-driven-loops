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

`S` is `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` (built at 1,817 lines) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` (built at 1,048 lines and 33 cases). The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds ran in number order. Closure (2026-09-30): built and committed as `2239858286`, 16 files, and closed at its label gate. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the briefs in `scratch/w4-build/briefs/` and the session facts in `scratch/w4-session/docs/facts.txt`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`). Evidence: the baseline row is in `goal.md`'s Progress; after 028 the runtime suite held 126 files and 2,456 tests, and the final suite holds 127 files and 2,489 tests, this phase's one file and its 33 tests more (`SE` section 2)
- [x] T002 [P] Reopen `deep-review/references/protocol/completion-criteria.md:61-63`, `:75`, `deep-review/references/convergence/convergence.md:398-400`, `runtime/lib/blinded-adjudication/mode-adapters.ts:59`, `:63-72` and grok-04's phrase list, and log any drift (`goal.md`). Evidence: design section 1 rechecked every citation; all resolve, and the one drift, `convergence.md:398-400` to `:399-401`, is logged in `goal.md`'s Deviations table and corrected in `spec.md` REQ-008 (`../w4-build/design.md` section 1; `SE` section 1)
- [x] T003 [P] Build fixture registries and iteration files inside `V`: P0 rows in one and in several registries, a transition into P0, a planted rejected-P0 phrase and a finding id of the `P2-001` shape (`V`). Evidence: `V` builds those fixtures and all 33 cases pass (`SE` section 2; `../w4-build/design.md` section 3)
- [x] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case (`V`). Evidence: the stub binaries mount first on `PATH`, the default run writes no stub log, and each gate case reads its own stub log (`SE` section 2; `../w4-build/design.md` section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the census of REQ-002: registries, findings by severity, the transitions matrix, P0 rows per registry, the phrase counts over tracked review iteration files and the `labels needed:` line (`S`). Spec REQ-002. Evidence: the final-state default run exits 0 with `registries: 413`, `findings: 2771 (P0 96, P1 1298, P2 1377, other 0)`, the transition lines, `p0 rows: 95 in 37 registries (one 21, two or more 16)`, the `phrases:` line and `labels needed: 20 P0 negatives among 95 P0 rows`; `V` covers the counts, two transitions, a duplicate row and the phrase counter (`SE` section 2; `facts.txt`)
- [x] T006 Write the label sheet and reader of REQ-005: `--write-label-sheet` outside the repository with exit 2 inside, `--labels` with per-row label validation and the 20-negative gate line (`S`). Spec REQ-005. Evidence: `--write-label-sheet specs/inside-sheet.jsonl` exits 2 with `refusing to write the label sheet inside the repository` and writes no file; outside the repository the sheet holds 95 rows, every `label` empty; `V` covers the sheet, an unknown label, a dropped empty label and the gate at 19 and 20 (`SE` section 2; `facts.txt`)
- [x] T007 Write the baseline and headroom of REQ-003 (`S`). Spec REQ-003. Evidence: the default run prints `baseline: right 0 of 0` at zero labels; `V` covers the K 201, 20-negative, 181-real `no headroom` case that fix c2f set (`SE` sections 1 and 2; `../w4-build/briefs/c2f.md`)
- [x] T008 Write the state builder of REQ-007 without the finding id, and the published-only check with `git cat-file -e origin/main:<path>` (`S`). Spec REQ-007. Evidence: `V` covers the finding id never entering the row state and an unpublished row withheld from Jev; the code review met REQ-001 to REQ-010 (`SE` sections 1 and 3)
- [x] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, three `jev choice` calls per row in the orders of REQ-008, the 90 s cap and REQ-009's Jev exits (`S`). Spec REQ-006, REQ-008, REQ-009. Evidence: with `--jev --deem --out <dir>` below the gate the run adds only `jev arm skipped: label gate` and calls nothing; `V` covers the gate pass, no credential, a wrong version, an unpublished row and exit 3 after the gate (`SE` section 2; `notes.md`)
- [x] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, three `cli-deem choice` calls per row and REQ-009's Deem exits with the exit-4 recheck (`S`). Spec REQ-006, REQ-009. Evidence: the same run adds only `deem arm skipped: label gate` and calls nothing; `V` covers the fake health, the stub-backend skip, exit 4 with a changed pair and the funnel count (`SE` section 2; `notes.md`)
- [x] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines and the `--out` refusal before any call (`S`). Spec REQ-004. Evidence: `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call and with no stdout; `--jev --deem --out <dir>` writes only `report.json`; `V` covers `keep`, `kill` and `stop (coverage)`, and no real run printed a verdict (`SE` section 2; `facts.txt`)
- [x] T012 Add the report-only lines of REQ-010: reread order, validity funnel with one `noul` per measured row and the exact-class line (`S`). Spec REQ-010. Evidence: `V` covers the reread order, the funnel count and the exact-class line without moving the verdict; no real run reached them, since the gate stopped (`SE` sections 2 and 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: census counts, phrase counter, label sheet inside and outside, unknown label, gate at 19 and 20, `no headroom`, no finding id in a logged call, both gates passing and skipping, Deem exit 4 with a new pair, an unpublished row withheld from Jev and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`). Evidence: `npx vitest run tests/unit/score-severity-replay.vitest.ts` prints `Tests 33 passed (33)`, against the floor of 22 (`SE` section 2)
- [x] T014 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, each census line and two absent stub logs, and match the P0 and transition counts with an independent `node` count (`goal.md`). Evidence: the final-state default run exits 0 in 3 s with every census line and the stub log was never written; design section 1's independent count matches the run at 413 registries, 95 P0 rows in 37 registries and 47 transitions into P0 (`SE` section 2; `../w4-build/design.md` section 1)
- [x] T015 Proof steps 2 and 3 on fixtures: the label sheet inside and outside the repository, the gate stop at 19 negatives and the Deem stub-backend skip at 20 (`goal.md`). Evidence: the inside refusal and the 95-row outside sheet are session runs; the 19-negative stop, the 20-negative pass, `deem arm skipped: stub backend` and `jev arm skipped: no credential` are `V` cases, since no labels file exists (parent D4; `SE` sections 2 and 6)
- [x] T016 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, and `git status --porcelain` is the same before and after each run (`goal.md`). Evidence: the key grep exits 1 with no match, and `git status --porcelain` was equal before and after each run (`SE` section 2)
- [B] T017 Write the real label sheet to a path the operator names outside the repository and hand it over (`goal.md`). Blocked on the operator: the session wrote a 95-row sheet with empty labels outside the repository as the proof of the write path, but no operator-named path exists, so the handover waits (parent D4; `SE` sections 2 and 6)
- [B] T018 Only when the operator's labels hold 20 negatives: one `--deem --out` run and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's labels (`goal.md`). The zero-call run stopped at the gate, so no arm ran, no `calls.jsonl` exists and no verdict line printed (parent D4; `SE` sections 2 and 6)
- [x] T019 Write the parent D6 docs through sk-doc: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`). Evidence: eight docs landed in `2239858286`: the hub `SKILL.md` sentence, `runtime/README.md`, `runtime/scripts/README.md`, `changelog/v1.8.0.0.md`, the catalog leaf `feature-catalog/scoring/severity-replay.md` with its index block, and the playbook leaf `manual-testing-playbook/scoring/severity-replay.md` (DLR-058) with its index rows; `validate_document.py` exits 0 on each, and fix f1 rewrote the hub sentence after the docs review's P1 (`SE` sections 1, 3 and 4; `facts.txt`)
- [x] T020 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`). Evidence: the final-state suite run prints `Test Files 127 passed (127)` and `Tests 2489 passed (2489)`, the baseline's 126 files and 2,456 tests plus this phase's one file and 33 tests, with no failure; the closure pass ran `validate.sh --strict` and `check-goal.cjs` and both pass (`SE` section 2; `implementation-summary.md` Verification)
- [x] T021 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`). Evidence: this closure pass recorded the census, the 95-row sheet, `stop: fewer than 20 labeled P0 negatives` and the absence of any verdict line in both (`implementation-summary.md`; `goal.md` Progress and Deviations)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T017 and T018 left `[B]` with the gate stop line recorded as the phase's result (parent D4; amended at close, logged in `goal.md`)
- [x] No `[B]` blocked tasks remaining other than T017 and T018, which wait on the operator's label-sheet path and labels (parent D4)
- [x] Manual verification passed: the census, the label sheet and the gate runs were read by the orchestrator session, and `goal.md`'s log carries `stop: fewer than 20 labeled P0 negatives` (`SE` sections 2 and 6)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
