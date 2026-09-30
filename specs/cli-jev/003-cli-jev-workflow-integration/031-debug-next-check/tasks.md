---
title: "Tasks: Phase 31: debug-next-check"
description: "Ordered build and verification tasks for the offline debug next-check measurement: seam search, fixture reader, constant baselines, the label and payload gates, both model arms, the Keep Rule, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "debug next check tasks"
  - "score-debug-next-check tasks"
  - "next check payload gate tests"
  - "constant baseline tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 31: debug-next-check

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

`S` below is `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` and `V` is `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds ran in number order. Code tasks went to the CLI executors of parent D5 as single-change briefs. Closure (2026-09-29): built and committed as `ca40e3c2dc`. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the `system-spec-kit` runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`). Evidence: 026 left the root suite at 109 files and 1,328 tests, and this phase adds one file and 31 tests; the log row is in `goal.md`, recorded by this closure pass (`SE` section 2)
- [x] T002 [P] Reopen `../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:10-15`, `:41-45`, `.skilled/agents/debug.md:246-276` and `universal-debugging-methodology.md:79-94`, rerun the seam search by hand and log any change (`goal.md`). Evidence: design section 1 rechecked every cited `file:line` and found none moved or missing; the one drift is the seam-search claim, since the generated trigger-phrase fixture folder now names `next_check`, logged below and in `goal.md`'s "Seam drift" row (`design.md` section 1; `SE` section 3)
- [x] T003 [P] Build synthetic fixtures inside `V`: 29 and 30 labeled rows, one unknown label, rows with and without `jev_ok` and a set where `read_code` is right on 28 of 30 (`V`). Evidence: `V` holds 31 cases in 752 lines and builds each fixture in a temp directory, including the 29-row gate fixture, the 30-row fixtures, the unknown label, the withheld rows and the no-headroom set; it prints `Tests 31 passed (31)` (`SE` section 2; design section 3)
- [x] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case (`V`). Evidence: the stub table writes both binaries into a temp directory and puts it first on `PATH`; `V` covers the gate pass and skip, wrong version, stub backend and the exit-4 recheck, and the session's real runs left both stub logs absent (`SE` section 2; design section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the seam search of REQ-002: `git grep -l next_check -- ':!specs'`, tracked `debug-delegation.md` files outside `templates/` and tracked spec files with a `### Hypothesis <n>` heading (`S`). Evidence: brief c1's check exits 0 with `node --check`; ruling 6 narrowed the mined search to one `git grep -cE '^### Hypothesis [0-9]' -- 'specs/*.md'` pass, fix c2f; fix c9f adds the census's own files to the seam exclusion (`scratch/w4-build/logs/c1.status`, `c2f.status`, `c9f.status`; `SE` sections 1 and 3)
- [x] T006 Write the fixture reader of REQ-005: the path-inside-repository refusal, row and label validation and the 30-row gate line (`S`). Evidence: brief c2's check then c2f's; from the final state a fixture inside the repository exits 2 with `refused: fixture path inside the repository`, a bad row exits 2 naming its row and fault, and a 29-row fixture prints `stop: fewer than 30 labeled rows` at exit 0 (`scratch/w4-build/logs/c2.status`, `c2f.status`; `SE` section 2; `facts.txt`)
- [x] T007 Write the constant baselines and headroom of REQ-003 (`S`). Evidence: brief c3's check exits 0; `V` pins the four `constant` lines, the `baseline:` line, the tie to `read_code` and the `no headroom` case, and the census prints them in that order (`scratch/w4-build/logs/c3.status`; `SE` section 2; `facts.txt`)
- [x] T008 Write the payload gate of REQ-007: the `jev_ok` split, `unmeasured_withheld` and `jev arm skipped: payload not accepted` (`S`). Evidence: brief c4's check exits 0; a 30-row fixture with every `jev_ok` false printed `jev arm skipped: payload not accepted` with no stub call, and `V` pins the three withheld records per row (`scratch/w4-build/logs/c4.status`; `SE` section 2)
- [x] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, three `jev choice` calls per accepted row in the orders of REQ-008, the 90 s cap and REQ-009's Jev exits (`S`). Evidence: brief c5's check exits 0; `V` pins the gate pass, the `no credential` skip, the wrong version and the Jev K case, and no live Jev run happened, since that waits on the operator's fixture and yes (`scratch/w4-build/logs/c5.status`; `SE` sections 2 and 6)
- [x] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, three `cli-deem choice` calls per row and REQ-009's Deem exits with the exit-4 recheck (`S`). Evidence: brief c6's check exits 0; a 30-row fixture with a stub backend printed `deem arm skipped: stub backend` after one `cli-deem health`, and `V` pins the gate pass and the exit-4 pair change (`scratch/w4-build/logs/c6.status`; `SE` section 2)
- [x] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines, a `calls.jsonl` writer without row text and the `--out` refusal before any call (`S`). Evidence: brief c7's check exits 0 after fix c7f corrected the `verdict kill` test schedule, and c8's check exits 0; `--jev` or `--deem` without `--out` exits 2 with `--jev or --deem need --out <dir> so every call is recorded` before any call, and the no-row-text case is pinned in `V` (`scratch/w4-build/logs/c7.status`, `c7f.status`, `c8.status`; `SE` sections 1 and 2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: the default run with no stub call and `--jev` without `--out`, seam search clean and planted, fixture reader valid and rejected, gate at 29 and 30, constant baselines and the tie, `no headroom`, the payload split and skip, both gates passing and skipping, Deem exit 4 with a new pair, no row text in `calls.jsonl` and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`). Evidence: `V` holds 31 cases in 752 lines and prints `Tests 31 passed (31)`, exit 0, against the floor of 22; fix c9g adds the seam self-exclusion case (`SE` section 2)
- [x] T013 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, `seam: none`, `mined rows: 0` and two absent stub logs (`goal.md`). Evidence: the final-state default run printed `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0` at exit 0, and the stub logs were never written (`SE` section 2)
- [x] T014 Proof steps 2 and 3 on synthetic fixtures: the gate stop at 29 rows, the inside-repository refusal, the constant lines, `no headroom`, `jev arm skipped: payload not accepted` and the Deem stub-backend skip (`goal.md`). Evidence: proof 2 stands from the pre-fix scratch run, since the seam fix changed only the seam pathspec: a fixture inside the repository exits 2; a 29-row fixture with both switches prints `stop: fewer than 30 labeled rows` with no call; a 30-row fixture with every `jev_ok` false prints `jev arm skipped: payload not accepted`; a stub Deem backend prints `deem arm skipped: stub backend` after one `cli-deem health`; the constant lines and `no headroom` are pinned in `V` (`SE` section 2)
- [x] T015 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, `git status --porcelain` is the same before and after each run and `git diff --stat .skilled/agents/` is empty (`goal.md`). Evidence: the key grep exits 1, `git status --porcelain` was equal before and after, the Python comment hygiene checker exits 0 on `S` and `V`, and the build commit `ca40e3c2dc` touches only `system-spec-kit` paths and the Hermes copy (`SE` sections 2 and 5)
- [B] T016 Only when the operator's fixture holds 30 labeled rows: one `--deem --out` run and, on the operator's flag, one `--jev --out` run on the accepted rows. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's fixture (`goal.md`). The operator wrote no fixture, so the phase closed on `stop: fewer than 30 labeled rows` from a 29-row synthetic one; no verdict line exists (parent D4; `SE` sections 2 and 6)
- [x] T017 Write the parent D6 docs through sk-doc: `SKILL.md`, `README.md`, `runtime/scripts/README.md`, a new changelog file, the tooling-and-scripts catalog entry and the tooling-and-scripts playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-spec-kit/`). Evidence: the eight docs landed in `ca40e3c2dc` (`SKILL.md` at 4.6.0.0, `README.md`, `runtime/scripts/README.md`, `changelog/v4.6.0.0.md`, the catalog entry and index, playbook scenario 463 and its index row) and `validate_document.py` exits 0 on each; the docs review's P1 is closed by c9f, c9g and f1, each rechecked `VERDICT: PASS` (`SE` sections 2 and 3)
- [x] T018 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`). Evidence: the root suite printed `Test Files 110 passed | 3 skipped (113)` and `Tests 1359 passed | 13 skipped (1372)` in 442 s against 026's 109 files and 1,328 tests; this closure pass ran `validate.sh --strict` and `check-goal.cjs` from the final state (`SE` section 2)
- [x] T019 Record the census lines and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`). Evidence: the census lines and `stop: fewer than 30 labeled rows` are in `goal.md`'s log and `implementation-summary.md` Verification, recorded by this closure pass; no run printed a verdict line (`SE` section 2; `facts.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T016 left `[B]` with the gate stop line recorded as the phase's result
- [x] No other `[B]` blocked tasks remaining
- [x] Manual verification passed: the census and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
