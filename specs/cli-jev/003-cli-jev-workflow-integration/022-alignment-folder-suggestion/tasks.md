---
title: "Tasks: Phase 22: alignment-folder-suggestion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "alignment suggestion tasks"
  - "below-50 census tasks"
  - "alignment label gate verification"
  - "save path replay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: alignment-folder-suggestion

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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` and `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`, both created by this build. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel. Tasks marked "past the gate" are outside this phase's completion. Closure (2026-09-29): built and committed as `ba70806077`. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where the two disagree, `SE` wins, because it reran the gates from the final state.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the `cli` vitest project's pass and fail counts as the baseline, and confirm no other build is changing system-spec-kit's `SKILL.md`, README or changelog (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Evidence: `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli` before any change printed `Test Files 157 passed | 3 skipped (160)`, `Tests 1602 passed | 19 skipped (1621)`, 485 s, exit 0 (`BE` section 1). The baseline `git status --porcelain` held only the four parallel lanes' untracked `scratch/w4-build/` folders (019, 020, 022, 024), so no other build held changes to those files (`BE` section 1)
- [x] T002 Read the owners' contracts before writing: `alignment-validator.ts:477-712`, `folder-detector.ts:1011-1052` and `:1136-1170`, and `evals/check-architecture-boundaries.ts` for whether an eval may import `spec-folder/`. Route the code write through sk-code's OpenCode route. Evidence: every code brief points at the build contract `scratch/w4-build/briefs/ref/design.md`, which names `alignment-validator.ts` read only with its exports and the two call sites, and the code persona block routes the write through sk-code. `check-no-mcp-lib-imports-ast.ts` `AST import policy check passed`, `check-no-mcp-lib-imports.ts` `Import policy check passed` and `check-architecture-boundaries.ts` `Architecture boundary check passed`, all exit 0 at baseline and again after the build, so the read-only validator import passes the policy and no subprocess fallback was needed (`BE` sections 1 and 2, `SE` section 2)
- [x] T003 [P] Build the test fixtures: synthetic logs of both paths in every band, a synthetic transcript directory with a paired and an unpaired event, a synthetic specs tree with numbered siblings, and rows files with 29 and 30 labeled rows (`T`). Evidence: briefs 01b to 08 built those fixtures with logging `jev` and `cli-deem` stubs and temp-dir outputs, and `Tests 42 passed (42)` runs them from the final state (`BE` section 3, `SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Line scan: the decision, hard-block, alternative and pick lines of both paths, banded by decision line (`S`). Evidence: briefs 01b, 01c and 03b. The scan bands by the decision line, not the printed percentage; 01c made the header rules match anywhere on a line after a JSON log line opening with the header lost its target, and 03b matched the decision rules to the validator's whole printed line after a smoke run counted a quoted template. The focused file reached `Tests 5 passed (5)` after 01c, `Tests 12 passed (12)` after 03b and `Tests 42 passed (42)` at the end (`BE` section 3)
- [x] T005 Committed-text census over the repository's text files, skipping source code, with the per-path report (`S`). Evidence: briefs 02 and 02b. The real-tree census prints `census source: tracked files via git grep, source code skipped`, `committed: files=6 events=3 skipped_source=1`, `committed path cli: aligned=0 moderate=1 low=2 infrastructure=0 below50=2 with_alternatives=0 without_alternatives=2 hard_blocks=2 picks=0` and an all-zero `committed path data:` (`SE` section 2). The smoke rerun after 03b prints `events=3`, the two archived 0% hard blocks and the 60% moderate event (`BE` section 3, `W/runs/smoke-03b.txt`)
- [x] T006 Path replay: both validator functions run non-interactively on synthetic save data, the CLI path against the real specs root and the data path against the synthetic tree, logs captured (`S`). Evidence: `replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0` and `replay data: validateFolderAlignment root=synthetic numbered_folders=3 decision=low alternatives listed: 2`, both without a prompt, TTY flags restored (`SE` section 2)
- [x] T007 Transcript census behind `--transcripts <dir>`, counts only, and `transcript events: not measured` without the flag (`S`). Evidence: brief 04; `--transcripts <empty dir> --rows-out <file>` exits 0 with `rows written: 0`, the synthetic transcript directory with a paired and an unpaired event is counted without printing text in `T`, and the default run prints `transcript events: not measured` (`BE` section 3, `SE` section 2)
- [x] T008 Rows writer behind `--rows-out <file>`: id, path, target, alternatives, `state` or `null`, `gold` from a pick and `label` empty. A path inside the repository exits 2 (`S`). Evidence: brief 04. `T`'s rows-writer cases leave every `label` empty and set `state` to `null` when no save call pairs, and `--transcripts <dir> --rows-out` under `SKILL.md`, a file, exits 2 with `refused: --rows-out path is inside the repository` before any output (`T:323-335`), inside the passing 42-case run (`SE` section 2)
- [x] T009 Scorer: label validation with exit 2 on a foreign label, the 30-row gate, the baseline choice and `no headroom` above 90 percent (`S`). Evidence: briefs 05 and 06. The gate case writes 29 labeled rows and one empty label, runs `--score` with `--deem --out` and asserts `rows: total=30 labeled=29 callable=29 state_null=0` then `stop: fewer than 30 labeled rows (29 labeled)` with exit 0 and no stub log (`T:349-383`); the gate passes at 30, a foreign label exits 2 by row id, the baseline picks the target on a tie and `no headroom` prints above 90 percent (`BE` section 3, `SE` section 3)
- [x] T010 Gates, arms and verdict per `spec.md` section 4: identity line, `--accept-payload`, both skip line sets, the `--out` refusal before output, the payload and cost lines, three rotations, exit handling, `calls.jsonl` without row text and the verdict line on stdout and in `report.json` (`S`). Evidence: briefs 07 and 08. Both gates with logging stubs print every skip line including `jev arm skipped: payload not accepted` (`T:606-610`, `T:740`), the verdict cases print `verdict deem: keep` (`T:505`) and `stop (margin)` (`T:522`, `T:705`), and from the final state `--score <rows> --deem --out <dir>` exits 0 at the label gate with the `--out` folder not created and 0 stub calls (`SE` section 2). The reviews confirm the call shape, the record fields and the cost lines (`SE` section 3)
- [x] T011 [P] One row each in `runtime/cli/evals/README.md` and `runtime/cli/tests/README.md`. Evidence: briefs d07 and d08 added one row each, `validate_document.py` exits 0 on both, and fix brief `f4` added the script to the evals README tree (`SE` sections 2 and 3)
- [x] T012 The system-spec-kit docs through sk-doc: `SKILL.md`, README, the next changelog file, the catalog entry `feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` and the playbook entry `manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md`, each with its index row. Then regenerate the Hermes copy. Regenerate the trigger index when its `--check` reports stale docs. Evidence: briefs d01 to d09 wrote the nine docs (the catalog entry and its `feature-catalog.md` row, the playbook entry and its index row, `SKILL.md`, `README.md`, `changelog/v4.4.0.0.md` and the two T011 rows) and `validate_document.py` exits 0 on all nine. Fix briefs `f1` to `f4` closed four review findings, and `sync-skills-hermes.cjs --check` prints `PASS: 72 Hermes skill copies in sync` with the `system-spec-kit` copy regenerated (`SE` sections 1, 2 and 3). The trigger index follows in its own commit, rebuilt by the session (`SE` section 4, P2 finding 5); `generate-trigger-index.mjs --check` exit 1 still lists the new docs as stale at this closure pass, along with another lane's docs (this closure pass)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 The vitest file exits 0 with at least 18 passing tests: the happy path and edge case of each REQ-009 surface (`T`). Evidence: `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` from `runtime/cli` prints `Tests 42 passed (42)`, exit 0, against the 18-case floor, both arms stubbed (`SE` sections 2 and 3)
- [x] T014 One census run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record the per-path band counts and the path replay's alternative counts in `goal.md`'s log. Evidence: `PATH="$STUB:$PATH" npx tsx evals/score-alignment-suggestion.ts --report <dir>` exits 0 with 0 stub calls and prints `committed: files=6 events=3 skipped_source=1`, the per-path band counts above at T005, both `alternatives listed:` lines and `transcript events: not measured` (`SE` section 2). The counts are in `goal.md`'s log, recorded by this closure pass
- [x] T015 Run the scorer on the synthetic rows file with 29 labels and record the `stop: fewer than 30 labeled rows` line in `goal.md`'s log. The phase closes here. Evidence: the gate case runs `--score` on a synthetic rows file with 29 labeled rows and asserts `stop: fewer than 30 labeled rows (29 labeled)` (`T:349-383`, `SE` section 2 G3), and the session's direct run from the final state prints `stop: fewer than 30 labeled rows (0 labeled)`, exit 0, no arm and no `--out` folder (`SE` section 2 G2). Both stop lines are in `goal.md`'s log, recorded by this closure pass
- [x] T016 `git status --porcelain` is identical before and after T014 and T015, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1. Evidence: `SE` section 2 G4: the grep exits 1 with no match and `git status --porcelain` on the skill is equal before and after the G1 and G2 runs
- [x] T017 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T011 and T012 changed (parent D6). Evidence: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc>` exits 0 on all nine changed docs, the catalog index with `--type feature_catalog` and the playbook index with `--type playbook`, and the comment hygiene checker exits 0 on the script and its test (`SE` section 2 G5)
- [x] T018 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the `cli` project fails nothing beyond T001's baseline. Then the parent orchestrator commits with path-scoped commits (parent D5). Evidence: cross-family, read only: Pi MiMo on the code `VERDICT: PASS` with REQ-001 to REQ-009 met and 3 P2, Devin DeepSeek on the docs `VERDICT: PASS` with REQ-001 to REQ-010 met and 5 P2, and the Devin recheck after the fixes `VERDICT: PASS`. The `cli` project suite ends `Test Files 158 passed | 3 skipped (161)`, `Tests 1644 passed | 19 skipped (1663)` against the baseline's 157 files and 1,602 tests (+1 file, +42 tests), with `npm run typecheck`, both import policy checks and the architecture boundary check exit 0 and the code route `Findings: 0` (`SE` sections 2 and 3). The parent session committed `ba70806077`, 12 files, not pushed (`SE` section 4)
- [B] T019 Past the gate, outside this phase: the operator runs `--transcripts` and `--rows-out` on their session directory, labels at least 30 rows, then asks for one `--deem --out <dir>` run and, on their flag and after stripping secrets, one `--jev --accept-payload --out <dir>` run. Each verdict line goes into `goal.md`'s log. Open for the operator: no label exists, so the scorer stops at `stop: fewer than 30 labeled rows (0 labeled)` and no arm runs. The live runs wait on those labels, and the Jev run on the operator's yes. Not part of this phase's completion (parent D4, `SE` section 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 to T018 marked `[x]`. T019 is past the label gate. Evidence: this closure pass; T019 stays `[B]` and is listed in `implementation-summary.md` as waiting on the operator
- [x] No `[B]` blocked tasks remaining other than T019. Amended 2026-09-29 from "No `[B]` blocked tasks remaining", because parent D4 closes phases 019 to 035 at their label gate and keeps the labels and the model runs as operator items (reason in `goal.md`'s log). Evidence: this closure pass
- [x] Manual verification passed: the census, the path replay and the gate ran on the real tree. Evidence: the G1 and G2 runs rerun by the session from the final state (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Label-gate precedent**: See `../003-goal-verifier-jev-shadow/spec.md` and `../006-goal-criteria-lint/spec.md`
<!-- /ANCHOR:cross-refs -->

---
