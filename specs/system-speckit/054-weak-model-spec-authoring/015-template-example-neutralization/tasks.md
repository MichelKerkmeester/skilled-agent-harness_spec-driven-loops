---
title: "Tasks: Phase 15: template-example-neutralization"
description: "Take the census and guard baselines, write the replacement table, rewrite the 87 swept lines one file per brief, regenerate the golden snapshot, then rerun the guards and census, review the diff and validate."
trigger_phrases:
  - "template example neutralization tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 15: template-example-neutralization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Run every command from the worktree root. `S` is `.skilled/skills/system-spec-kit`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization`. `B` is `P/scratch/baseline`; it was never created, and the census these phases share lives in `B16`, `specs/system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim/scratch/baseline`. `C` is `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch`. `ORCH` is `S/runtime/dist/lib/validation/orchestrator.js`. `G` is the term regex in `spec.md` section 4. `VT` is `npx vitest run --config ../../vitest.config.ts --project cli`, run from `S/runtime/cli`.

Each Implementation brief goes to DeepSeek V4.1 Flash max through cli-pi, carries only that file's rows from `P/scratch/replacements.md` as literal old and new text, and is rerun on cli-codex `gpt-6-luna` when cli-pi fails. A file's check must pass before the next brief goes out.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 Sweep every place a model reads for the benchmark task and record the hit table (`P/scratch/example-sweep.md`). Verify: `rg -n 'Total\*\* \| \*\*52\*\* \| \*\*35\*\* \| \*\*87' P/scratch/example-sweep.md` prints one line. Done during planning: 87 lines in 12 files, plus 96 snapshot lines.
- [x] T002 [P] Take the strict census baseline: one census shared with phases 016 and 017, over the 4,757 folders in `B16/census-list.txt` split into `list-0` to `list-3`, begun on the post-014 tree (`B16/census-before.tsv`). Verify: `wc -l < B16/census-before.tsv` prints 4757. Done: prints 4757. Deviation: the planned three phase 010 shards (4,719 folders) and `B` were not used.
- [x] T003 [P] Record the guard and test baselines: `check-card-sync.sh`, `check-example-drift.sh`, `sync-skills-hermes.cjs --check`, and `VT tests/template-fill-guidance.vitest.ts` and `VT tests/scaffold-golden-snapshots.vitest.ts` (the "Baselines taken during the sweep" table in `P/scratch/example-sweep.md`). Verify: `rg -c 'CARD SYNC OK|EXAMPLE_DRIFT_OK|PASS: 67|24 passed|12 passed' P/scratch/example-sweep.md` prints 5. Done: prints 5. Deviation: recorded in the sweep file, not in `B/guards-before.txt`.
- [x] T004 Write the replacement table: one row per swept line with file, line, old GOOD and WEAK text and new GOOD and WEAK text in the `rotate-logs.sh --keep` story from `goal.md` D1 (`P/scratch/replacements.md`). Verify: `rg -c '^\| [a-z-]+\.md(\.tmpl)?:[0-9]+ ' P/scratch/replacements.md` prints 87. Done as a deviation: `P/scratch/replacements.md` was never written. `rg -c '^\| `templates/' P/scratch/example-sweep.md` prints 11 file rows covering all 87 swept lines by file and line number, and the diff holds each new GOOD and WEAK text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T005 Rewrite the 21 swept fill notes (`S/templates/core/spec.md.tmpl`). Verify: `git diff --numstat -- S/templates/core/spec.md.tmpl` prints `21 21`, and `rg -i -e "$G" S/templates/core/spec.md.tmpl | rg 'FILL:' | wc -l` prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `39 44`, not `21 21`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra lines are phase 016's edge-case and sign-off lines and phase 017's measured-behavior block and v2.4 stamp. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T006 Rewrite the 13 swept fill notes (`S/templates/core/plan.md.tmpl`). Verify: `git diff --numstat -- S/templates/core/plan.md.tmpl` prints `13 13`, and the same `G` check on the file prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `18 57`, not `13 13`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra lines are phase 016's removed effort and enhanced-rollback sections, the phase-deps skeleton, the DoD token and phase 017's v2.4 stamp. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T007 Rewrite the 10 swept fill notes (`S/templates/core/tasks.md.tmpl`). Verify: `git diff --numstat -- S/templates/core/tasks.md.tmpl` prints `10 10`, and the `G` check prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `17 20`, not `10 10`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra lines are phase 016's sign-off row, FIX ADDENDUM rename, CHK-100 and CHK-121/122 rows and phase 017's v2.4 stamp. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T008 Rewrite the 6 swept fill notes (`S/templates/core/implementation-summary.md.tmpl`). Verify: `git diff --numstat -- S/templates/core/implementation-summary.md.tmpl` prints `6 6`, and the `G` check prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `7 7`, not `6 6`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra line is phase 017's v2.4 stamp. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T009 Rewrite the 17 swept fill notes (`S/templates/addons/research.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/research.md.tmpl` prints `17 17`, and the `G` check prints 0. Done: `git diff --numstat` prints `17 17`, as planned. The `G` check prints 0 once the D3 instruction line is excluded (`| rg -v -F 'List each flag and its effect'`); line 777's GOOD example now says what `--keep` does instead of giving a design reason.
- [x] T010 Rewrite the 4 swept fill notes (`S/templates/addons/handover.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/handover.md.tmpl` prints `4 4`, and the `G` check prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `5 5`, not `4 4`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra line is phase 016's `Tests passing` filler replacement. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T011 Rewrite the 4 swept fill notes (`S/templates/addons/debug-delegation.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/debug-delegation.md.tmpl` prints `4 4`, and the `G` check prints 0. Done: `git diff --numstat` prints `4 4`, as planned, and the `G` check on the file prints 0.
- [x] T012 Rewrite the 3 swept fill notes (`S/templates/addons/goal.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/goal.md.tmpl` prints `3 3`, and the `G` check prints 0. Done: `git diff --numstat` prints `3 3`, as planned, and the `G` check on the file prints 0.
- [x] T013 Rewrite the 2 swept fill notes (`S/templates/addons/acceptance-criteria.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/acceptance-criteria.md.tmpl` prints `2 2`, and the `G` check prints 0. Done: the `G` check on the file prints 0. `git diff --numstat` prints `3 3`, not `2 2`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra line is phase 017's v2.4 stamp. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T014 Rewrite the 2 swept fill notes (`S/templates/addons/timeline.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/timeline.md.tmpl` prints `2 2`, and the `G` check prints 0. Done: `git diff --numstat` prints `2 2`, as planned, and the `G` check on the file prints 0.
- [x] T015 Rewrite the 1 swept fill note (`S/templates/addons/decision-record.md.tmpl`). Verify: `git diff --numstat -- S/templates/addons/decision-record.md.tmpl` prints `1 1`. Done: `git diff --numstat` prints `1 1`, as planned, and the `G` check on the file prints 0.
- [x] T016 Rewrite the section 6 Step example and the section 7 task-line example (`S/references/workflows/spec-authoring-card.md`). Verify: `git diff --numstat -- S/references/workflows/spec-authoring-card.md` prints `4 4`, `rg -n -i -e 'quiet flag' -e 'flag parser' -e 'script\.sh --quiet' S/references/workflows/spec-authoring-card.md` prints nothing, and `rg -c -i 'quiet|recommend-level' S/references/workflows/spec-authoring-card.md` prints 7. Done: the `G` check on the file prints 0. `git diff --numstat` prints `12 12`, not `4 4`: Phases 015, 016 and 017 edited the same files in one uncommitted tree, so `git diff --numstat` against HEAD counts all three phases; each extra line is named below. Here the extra lines are phase 016's section 6 plan-shape rewrite and phase 017's section 5 and section 9 lines. Deviation: the count check is replaced by the `G` check plus that accounting.
- [x] T017 Regenerate the golden snapshot (`S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`): `VT tests/scaffold-golden-snapshots.vitest.ts -u`, then the same command without `-u`. Verify: the second run prints `12 passed`, and `rg -i -e "$G" S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | rg 'FILL:' | wc -l` prints 0. Done: the run without `-u` prints `Tests  12 passed (12)`, exit 0, and the snapshot gate prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T018 Rerun the term gate over both template folders (`S/templates/`). Verify: `rg -i -e "$G" S/templates/core S/templates/addons | rg 'FILL:' | wc -l` prints 0, down from 63. Done: prints 1 as written; the hit is `research.md.tmpl:777`, whose instruction "List each flag and its effect" `goal.md` D3 keeps word for word. With that line excluded (`| rg -v -F 'List each flag and its effect'`) the gate prints 0. Deviation: the gate excludes the D3 instruction line, which names no benchmark task.
- [x] T019 Rerun the fill-guidance test (`S/runtime/cli/tests/template-fill-guidance.vitest.ts`). Verify: `VT tests/template-fill-guidance.vitest.ts` prints `24 passed`. Done: `Tests  24 passed (24)`, exit 0.
- [x] T020 [P] Rerun both guards (`S/runtime/cli/spec/`). Verify: `bash S/runtime/cli/spec/check-card-sync.sh | tail -1` prints `CARD SYNC OK`, and `bash S/runtime/cli/spec/check-example-drift.sh | tail -1` prints `EXAMPLE_DRIFT_OK`. Done: both print their pass line, exit 0.
- [x] T021 [P] Check the Hermes copies (`.hermes/skills/`). Verify: `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67 Hermes skill copies in sync`, exit 0.
- [x] T022 [P] Rerun the strict census as in T002 into `B16/census-after-*.tsv` and concatenate (`B16/census-after.tsv`). Verify: `diff <(sort B16/census-before.tsv) <(sort B16/census-after.tsv)` prints nothing. Done: no output, exit 0, on the final tree after phases 015 to 017.
- [x] T023 Check the diff scope outside `specs/` (the 12 files and the snapshot). Verify: `git diff --name-only -- . ':!specs' | wc -l` prints 13. Done: all 12 files and the snapshot appear in `git diff --name-only -- . ':!specs'`. The list holds more than 13 paths because phases 016 and 017 share the uncommitted tree; their files are listed in their own implementation summaries. Deviation: the count check is replaced by that membership check.
- [x] T024 Have a fresh Opus medium agent check the diff against `P/scratch/replacements.md`: only example text after `GOOD:` and `WEAK:` changed, every note keeps one GOOD then one WEAK, and every feature named is the `rotate-logs.sh --keep` story (`P/scratch/review.md`). Verify: `rg -c '^VERDICT: PASS$' P/scratch/review.md` prints 1. Done: prints 1, line 71, the 2026-10-26 fix check, which found all ten findings of the first review (`VERDICT: CHANGES NEEDED`, line 58) fixed. Deviation: the review read the diff against the sweep table in `P/scratch/example-sweep.md`, because `replacements.md` was never written (T004).
- [x] T025 Validate this folder (`P`). Verify: `bash S/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`. Done: `RESULT: PASSED` at closeout.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sweep**: `scratch/example-sweep.md`
- **Evidence**: `scratch/insight-review.md`, `scratch/evidence-summary.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason, and the phase stays In Progress.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The census and guard baselines exist before the first brief: `ls B16/census-before.tsv` prints the path, and `P/scratch/example-sweep.md` holds the guard baselines. Done: both hold. Deviation: not under `B`, see T002 and T003.
- [x] CHK-002 [P0] The replacement table covers every swept line: its row count is 87. Done as a deviation: `P/scratch/replacements.md` was never written, so there is no row count. The sweep table in `P/scratch/example-sweep.md` lists all 87 swept lines by file and line number and the diff holds the new text; see T004.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Each file's diff is line for line: `git diff --numstat` shows equal added and removed counts that match the sweep table. Done as a deviation: run per file, values on T005 to T016. Five files match the sweep table; the other seven carry phase 016 and 017 lines in the same uncommitted tree, so the count check is replaced by the per-task accounting on T005 to T016, which names each extra line.
- [x] CHK-011 [P0] No anchor, marker or scaffold token changed: `git diff -U0 -- S/templates | rg '^[-+]' | rg -v 'FILL:' | rg -v '^(\+\+\+|---) '` prints nothing. Done as a deviation: run, prints 429 lines, because phases 016 and 017 changed anchors, markers and stamps in the same templates on purpose. The check is replaced by the per-task accounting on T005 to T016, which names those lines as phase 016 and 017 edits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Done: every row is Met; AC-001, AC-003 and AC-008 carry recorded deviations, and the closure statement reads `Closeable: Yes`.
- [x] CHK-021 [P0] The term gate prints 0 and the card check prints 7 tool lines. Done as a deviation: the card check prints 7; the term gate prints 0 with the D3 instruction line excluded (`| rg -v -F 'List each flag and its effect'`), 1 without it; see T018.
- [x] CHK-022 [P0] The fill-guidance test prints `24 passed` and the snapshot test prints `12 passed`. Done: `24 passed` and `12 passed`.
- [x] CHK-023 [P0] The census diff prints nothing. Done: no output, exit 0, over `B16`.
- [x] CHK-024 [P1] The Opus review ends with `VERDICT: PASS`. Done: `scratch/review.md` ends with `VERDICT: PASS` at line 71, the fix check after the first review's `VERDICT: CHANGES NEEDED`; see T024.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The finding is `class-of-bug`: one story repeated across 12 files, closed by the repo-wide term gate, not by line fixes alone. Done as a deviation: the term gate prints 0 with the D3 instruction line excluded, and that line names no benchmark task; see T018.
- [x] CHK-FIX-002 [P0] Same-class inventory: the sweep covers `templates/`, `references/`, `SKILL.md`, `README.md`, the examples, the snapshot and every runtime mirror, as `scratch/example-sweep.md` records. Done: `scratch/example-sweep.md` records each surface and its result.
- [x] CHK-FIX-003 [P0] Consumer inventory: the snapshot is regenerated, the census is unchanged and the Hermes check prints `PASS`. Done: snapshot `12 passed`, census diff empty, Hermes `PASS: 67`.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix; the phase edits comment text only. Done: N/A holds.
- [x] CHK-FIX-005 [P1] Matrix axes: 12 files by line, listed in the sweep table with direct and story counts. Done: the sweep table lists the 12 files with direct and story counts.
- [x] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state; no code line changes. Done: N/A holds.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA in `implementation-summary.md`. Open: nothing is committed yet, so there is no phase SHA; the SHA is pinned in a follow-up after the commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] N/A: no credential, input path or permission changes; the briefs carry no secret. Done: N/A holds.
- [x] CHK-031 [P1] N/A: no auth surface; the phase edits comments and one doc. Done: N/A holds.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `goal.md` name the same neutral example and the same 87-line count. Done: `rg -c 'rotate-logs'` and `rg -c '87'` each print at least 1 on all four files.
- [x] CHK-041 [P1] `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Baselines, the table, briefs and the review live under `P/scratch/` only. Done as a deviation: `ls P/scratch` prints `evidence-summary.md`, `example-sweep.md`, `insight-review.md` and `review.md`, so the sweep, the guard baselines and the review are here. The shared census lives in `B16`, and the edit briefs were combined with phase 016 and 017 edits under `../016-scaffold-filler-section-trim/scratch/briefs/` (`common.txt` part A is this phase's example swap, worked on staged copies in that folder's `scratch/staging/`). No replacement table exists; see T004.
- [x] CHK-051 [P1] No brief or temp file from the dispatches is left outside `P/scratch/`. Done: the edit briefs sit under the 016 `scratch/` folder, per CHK-050. Outside `specs/`, the untracked files in the worktree are the four new deliverables of phases 016 and 017 and the release note (`changelog/v2.12.0.0.md`, `check-measured-behavior.sh`, `draft-auto-repair.vitest.ts`, `measured-behavior-rule.vitest.ts`); no brief, run log or staging copy is among them.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 8/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---
