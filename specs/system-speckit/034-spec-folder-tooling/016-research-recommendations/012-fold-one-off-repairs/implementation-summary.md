---
title: "Implementation Summary"
description: "Phase 12: fold one-off repairs is complete. The fill step takes each document class's template literal before the runtime tables, and upgrade-legacy prints its failures grouped by rule with a detail count."
trigger_phrases:
  - "fold one off repairs implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs"
    last_updated_at: "2026-10-10T09:47:20Z"
    last_updated_by: "closeout"
    recent_action: "CHK-FIX-006 closed: cache removed, same-instance case added (uncommitted)"
    next_safe_action: "Operator decides T011 (real-corpus --apply)"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/frontmatter-template-literals.vitest.ts"
    completion_pct: 100
    open_questions:
      - "Run the manual --apply on the real corpus (T011), which plans 8 packet changes?"
    answered_questions:
      - "Pin the four classes that now take template values (CHK-FIX-002)? Pinned by 012-T1 in the value-source case at upgrade-legacy.vitest.ts:365."
      - "Fix the same-instance template cache in lib/frontmatter-migration.ts (CHK-FIX-006)? Yes. The cache is removed, so each call reads the template, and the same-instance case in frontmatter-template-literals.vitest.ts pins the re-read. Receipts in scratch/evidence/frontmatter-template-cache-same-instance-red-green.txt. The change is uncommitted."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-fold-one-off-repairs |
| **Status** | Complete |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 12 is complete. The frontmatter fill step now takes a document class's template literal before the runtime tables, and `upgrade-legacy` prints its failures grouped by rule with a detail count. Both behaviors have cases in `upgrade-legacy.vitest.ts`. The value-source case pins all ten entries of the template map, and a second case covers a template that cannot be read.

### Value source for a missing tier or context

For a missing `importance_tier` or `contextType`, the order is:

1. The value the document already carries. A fill never rewrites a key that is present.
2. The template literal for the document class, read by `readTemplateLiterals` (`lib/frontmatter-migration.ts:919`). The option is opt-in, and the fill is the only caller that sets it.
3. For memory documents, the MEMORY METADATA block and its tables.
4. The runtime tables, `DOC_DEFAULT_IMPORTANCE` and `DOC_DEFAULT_CONTEXT`.

Before this phase the order was 1, 3, 4. Every fill-eligible class has a template that defines both fields, so the tables are reached during a fill only when a template cannot be read. The research named a spec.md copy as the fallback. The code does not copy from spec.md, and the tables fill that role for the classes with no template literal.

### Grouped detail

`printGroupedDetail` (`spec/upgrade-legacy.mjs:520`) writes one heading per failing rule for each packet, in the form `### <folder> / x <RULE> (<count>)`, with the detail lines under it, sorted by rule. It runs on every dry run and every apply, after the failing lines and before the Downgrades section. A packet whose report cannot be read gets `### <folder> / unreadable`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Fill step sets the template option, grouped-detail section |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | Template map, `readTemplateLiterals` (reads the template on every call, no cache), opt-in option and precedence |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Value-source case at `:365`, grouped-detail case at `:541`, template-missing fallback case at `:504` (line numbers as of 08:41 CEST, see the note under the test matrix) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/frontmatter-template-literals.vitest.ts` | Create (fourth pass) | Fresh-run isolation case for the template literal cache (CHK-FIX-006), and a same-instance case added later for the same item |

These three modified files also carry changes from phases 003, 009, 011 and 015. They ship in commit `124e11c883d4f955fe097f8af6c308f9c33a841c` under parent decision D6, which is an ancestor of `origin/main`. The new test file is not in that commit. The same-instance change, the cache removal in `lib/frontmatter-migration.ts` and the same-instance case, is uncommitted and not in that commit either.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran on the opencode-go route with DeepSeek V4.1 Flash max, in five briefs (A1 to A5) and one fix brief (F1). The review ran on the other route as one read-only pass with no command execution, so the reviewer checked the suite and the compiler by reading the code and the build artifacts. The closeout ran the gates itself.

### Review

**Round 1: one finding, P2, applied.** The extended fill case wrote only spec.md, goal.md and tasks.md, so the acceptance-criteria.md and resource-map.md fills were unpinned. Fix F1 extended the same case to both. The builder confirmed on throwaway copies that the case fails when either addon entry is removed. That confirmation is the builder's record and was not repeated in the closeout.

**Round 2: not run.** The build record does not show a request for a second round.

**Final review, fresh Opus high.** The build record's summary of that review names findings for phases 015, 003, 011, 009 and 013. Its checked-clean list does not name this phase, so no final review of phase 012 is recorded. Closeout 3: the later fresh Opus high alignment and overengineering review (Deviations, item 11) raised finding O6 on this phase's `frontmatter-migration.ts`.

### Test round after the first closeout

A later test round added the four missing pins and the fallback case. Builder 012-T1 ran on route DSL after the opencode-go route ran out of quota. The builder reports 39 of 39 passing. A read-only Luna review of that round (TR-R1) returned three P1 findings. The review could not start Vitest (the sandbox denied Vite's cache write), so it judged the tests by reading them. F1 belongs to phase 015 and was accepted there. F3, a phase identifier in a comment of the doctor tests, was rejected because the identifier is a workflow key the test reads. The finding for this phase is F2: the value-source case leaves its `specs/fm-track/001-authored` packet in the shared sandbox, so a case that runs after it can depend on order. The accepted fix was brief 012-T2 on route DSC. At 08:41 CEST, before the verbose run, the test file gained an `afterEach(resetSandbox)` hook at `:220` that resets the shared sandbox after each case. That hook matches the F2 fix. At the first closeout the 012-T2 dispatch had no report in the logs, so its author was not confirmed. Closeout 3: the evidence log attributes the edit to 012-T2, whose dispatch was killed at the 40-minute watchdog before it reported. Order independence is checked by shuffled runs, seeds 101 and 202, at 39 of 39 each (`gates/tests-after-tr/`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The template literal comes before the runtime tables, for fills only | The spec and the research ruled the template first, and the tables predate the current templates. The option is opt-in, so other callers keep their output |
| The grouped-detail section prints on every dry run and apply, with no flag | It reads the validator report that both paths already compute, and it costs no extra validation pass |
| The grouped-detail heading carries the count in parentheses after the rule | The spec asked for counts, and the parentheses keep the `### folder / x RULE` form the spec gives |
| Remove the template cache rather than key it by mtime and size | A template read costs 37 to 44 microseconds, and the cache saved 36 to 43 of them per repeat call, which does not show in a migration run. A stat key still reads stale after a same-size edit inside one timestamp tick |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Value-source, fallback and grouped-detail cases | From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run tests/upgrade-legacy.vitest.ts --config ../vitest.config.ts --root . --reporter verbose` printed `Tests 39 passed (39)`, exit 0, with the three named cases listed as passed (second pass, `gates/closeout2-012/upgrade-legacy-verbose.log`). The first pass printed `Tests 38 passed (38)` before the test round |
| Grouped detail on real packets | A read-only dry run on the parent folder printed the section with real headings and counts (AC-002) |
| Whole CLI suite | Tree4, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` exit 0: `Test Files 171 passed, 3 skipped (174)`, `Tests 1775 passed, 19 skipped (1794)`. The chained legacy and validation sub-steps passed with it. Baseline before wave 1: 161 files and 1639 passed. Tree4 read the test file as it stood before 012-T2 |
| Check and typecheck | Tree4: `check` exit 0, `typecheck` and `typecheck-cli` exit 0. `typecheck:tests` exit 2 with 95 `error TS` lines, the same count as tree3, and none in the phase's three files |
| Hook tests | Tree4: `tests 184, pass 181, fail 0` |
| Doctor suites | Tree4: `run-all.sh` exit 0, `7 suite(s) passed, 0 failed`. The doctor-update compatibility tests printed `pass 22, fail 0` |
| Test validation | Tree4: `RESULT: PASSED`, 31 of 31 |
| Root test | Tree4: `npm --prefix .skilled/skills/system-spec-kit test` exit 124, stopped at the 600000 ms harness bound while the runtime workspace suite was still running. The log has 237 passing markers and no failure marker, and no total. This is not a pass. The script is not the one AC-004 names, so it is recorded here and not re-run |
| Goal verification command | The command as the goal first wrote it printed nothing, because the default reporter does not list test names. The goal now adds `--reporter verbose` |
| Fresh-run template cache case (fourth pass) | From `runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/frontmatter-template-literals.vitest.ts --reporter verbose`: repo file exit 0, `Tests 1 passed (1)`. Scratch copy with the cache held on `globalThis`: exit 1, `expected 'critical' to be 'normal'`. Receipts in `scratch/evidence/frontmatter-template-cache-red-green.txt` |
| Same-instance template case (CHK-FIX-006) | From `runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/frontmatter-template-literals.vitest.ts`: on the unmodified code exit 1, `expected 'critical' to be 'normal'`, 1 of 2 passed. After the cache removal exit 0, 2 of 2 passed. Receipts in `scratch/evidence/frontmatter-template-cache-same-instance-red-green.txt` |
| CLI build after the fix | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run build`: exit 0. The compiled `dist/lib/frontmatter-migration.js` has no cache reference |
| Dependent CLI tests after the fix | The target file and the two `memory-quality` suites that import the module: `Test Files 3 passed (3)`, `Tests 7 passed (7)`, exit 0. `tests/test-frontmatter-backfill.js` run with node: `Summary: pass=15, fail=0`, exit 0 |
| Lint and typecheck of the new test file (fourth pass) | `npx eslint` on the file: 0 errors, with the runtime config applied. `npx tsc -p tsconfig.tests.json --noEmit` in `runtime/`: exit 2 with 95 `error TS` lines, the same count as before, none in the new file or in `upgrade-legacy.vitest.ts` |
| Real-corpus dry run (fourth pass) | `upgrade-legacy.mjs --roots specs`, no `--apply`: exit 1, inspected 2202 active, passing 2194, failing 8. No upgrade-baseline.json and no reversibility manifest were written. Receipts in `scratch/evidence/upgrade-legacy-dry-run-real-corpus.txt` |

The gate outputs are in the closeout's build scratchpad, and the raw logs back every row above. The tree4 logs are under `gates/tree4/`.

### Third pass, tree5 (closeout 3, 2026-10-09)

The whole-tree gate in `gates/tree5/` ran after the Opus alignment fixes. Git HEAD moved to `c2a0a667e9` at 10:37, during the root-test window, because another session committed the working tree. That commit does not touch this folder.

- Focused run of eight files, including `upgrade-legacy.vitest.ts`: exit 0, 152 tests passed (`gates/tree5/focused-vitest.log`).
- CLI test: exit 0, Test Files 171 passed, 3 skipped (174), Tests 1775 passed, 19 skipped (1794), the same as tree4 (`gates/tree5/cli-test.log`).
- Cli-check (lint, boundary and AST checks): exit 0. Typecheck and typecheck-cli: exit 0. Typecheck:tests: exit 2, report only, 95 `error TS` lines, as in tree4.
- Hooks: 184 run, 181 pass, 0 fail, 3 skipped. Doctor suites: 7 passed, 0 failed. Doctor-update compatibility: 22 of 22.
- Drift guards: exit 0, all 2 guards PASSED. Tree4 did not run this step.
- Root test: exit 0, its first tree5 verdict. Its cli sub-step reports the same counts as the cli test (`gates/tree5/root-test.log`). It ran from 10:31 to 11:15, across the commit above.
- Shuffled runs of this file, seeds 101 and 202, 39 of 39 each (`gates/tests-after-tr/`), added in this closeout.

The `validate.sh --strict` and `check-goal.cjs` runs on this folder were repeated after these edits, and their logs are in `gates/closeout3-012/`.

### Test matrix

| Document class | Template literal | Pinned by a case |
|----------------|------------------|------------------|
| spec.md | normal, general | Yes, at `:365` |
| plan.md | normal, general | Yes, at `:365` |
| tasks.md | normal, general, with an authored tier kept | Yes, at `:365` |
| goal.md | important, planning | Yes, at `:365` |
| acceptance-criteria.md | important, implementation | Yes, at `:365` |
| resource-map.md | normal, general, with an authored tier kept | Yes, at `:365` |
| implementation-summary.md | normal, general | Yes, at `:365` (second pass) |
| decision-record.md | normal, general | Yes, at `:365` (second pass) |
| research.md | normal, general | Yes, at `:365` (second pass) |
| handover.md | normal, general | Yes, at `:365` (second pass) |

The missing-template fallback is pinned at `:504`. That case renames the decision-record.md template for one `--apply` run, exits 0, and expects the table defaults `important` and `planning`.

The line numbers in this table and in the first-pass rows above it are from the file as it stood at 08:41 CEST. Before that change the value-source case sat at `:312`, the grouped case at `:398` and the fallback had not yet been added. The evidence rows that cite the older numbers are left as recorded.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Fill eligibility widened.** The spec names goal.md. acceptance-criteria.md and resource-map.md also fill now, because they are in the template map. The spec does not name them.
2. **No spec.md copy.** The spec's second source is a copy from spec.md. The code uses the runtime tables instead, as described above.
3. **Four classes now take template values.** implementation-summary.md, decision-record.md and research.md were already fill-eligible. A fill of a missing `contextType` now yields the template value, and a missing importance in decision-record.md now yields `normal` where the table gave `important`. The concrete changes are: implementation-summary.md contextType from `implementation` to `general`, decision-record.md importance from `important` to `normal` and contextType from `planning` to `general`, and research.md contextType from `research` to `general`. handover.md is the same either way. These changes follow decision D1. The second pass pins all four in the value-source case at `:365`.
4. **Grouped detail is a section, not a mode.** The spec asked for a report mode. The section is always on, and no flag controls it.
5. **Citations corrected.** AC-001 and T008 pointed at `upgrade-legacy.vitest.ts:151+`, which is fixture setup, and the case is at `:312`. T003 cited `research.md:6, 7.4`, and the fill ruling is in section 6 of `014-spec-auto-healing-research/research/research.md`. Section 7.4 is the archive decision.
6. **Goal verification command corrected.** The completion command in goal.md printed nothing, so it now uses `--reporter verbose` and greps for the test name and the totals.
7. **Precedence comment matches the code.** The brief asked for "never overwritten" and "tables last". The code lets memory metadata supersede an existing tier for memory documents, as it did before this phase, so the comment states that instead.
8. **Shared files.** `upgrade-legacy.mjs`, `frontmatter-migration.ts` and `upgrade-legacy.vitest.ts` also carry phases 003, 009, 011 and 015, and ship in one combined commit under D6.
9. **Route.** The goal's D3 names the LLM Gateway route, and D4 names Luna. The build ran on the opencode-go route with DeepSeek, and the review on the other route, under parent D1 and D7. The test round ran on route DSL and the fix brief 012-T2 on route DSC. The decisions are frozen, so the text stays and the goal log records the difference.
10. **Retired one-offs.** `add-fm-fields.mjs` is not in the repo, so nothing was deleted for it. `fix-specfolder.mjs` and `fix-dup-anchors.mjs` are outside this phase, as the spec says.
11. **Module-private exports (closeout 3).** The fresh Opus alignment review found two exports with no consumer. `TemplateLiteralDefaults` and `readTemplateLiterals` are module-private now (OC-O6). `TEMPLATE_DOC_FILES` stays exported.
12. **Cache case in its own file (fourth pass).** The cache lives in `lib/frontmatter-migration.ts`, not in the upgrade tool, so the isolation case sits in `tests/frontmatter-template-literals.vitest.ts` rather than in `upgrade-legacy.vitest.ts`. It is the one test file this pass added.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:open-items -->
## Open Items

- **T011 and CHK-021, real-corpus `--apply`.** Not run. The fourth pass ran the read-only dry run over the real corpus, and it plans 8 changes: 2202 active packets were inspected, 2194 pass and 8 fail. Three failing packets sit in folders another lane is editing (016-research-recommendations, 019-epic-follow-up-fixes and 020-deep-review-remediation), and five sit under 026-graph-and-context-optimization. The evidence log records a full-corpus `--apply` in a throwaway clone as skipped, with the operator not objecting, and lists it as a follow-up. Needs an operator decision. Receipts: `scratch/evidence/upgrade-legacy-dry-run-real-corpus.txt`.
- **Test isolation, RLUNA F2 (brief 012-T2).** The value-source case leaves its fm-track packet in the shared sandbox. The file now has an `afterEach(resetSandbox)` hook, which the verbose run at 08:44 CEST passed with. Closed in closeout 3. The evidence log records 012-T2 killed at the watchdog with no RESULT line, and its edit landed at 08:41. Shuffled runs (seeds 101 and 202, 39 of 39 each) and a normal run pass on the file as it stands.
- **CHK-FIX-006, process-wide cache.** Closed. The module-level cache is removed from `lib/frontmatter-migration.ts`, so each call reads the template. The same-instance case in `tests/frontmatter-template-literals.vitest.ts` exits 1 on the unmodified code (`expected 'critical' to be 'normal'`) and exits 0 after the fix. The change is uncommitted in the working tree. Receipts: `scratch/evidence/frontmatter-template-cache-same-instance-red-green.txt`.
- **CHK-FIX-007, evidence pin.** Closed in the fourth pass. The evidence is pinned to `124e11c883`, the combined commit under D6, which is an ancestor of `origin/main`.
- **Root test.** The root `npm test` in the system-spec-kit folder did not finish in tree4 (exit 124). The CLI test named by AC-004 passed. The root script is outside this phase.
- **README (CHK-042, P2).** Closed in the fourth pass. `spec/README.md` line 118 describes the grouped section, and commit `46bd3afd0f` added it.
- **Changelog refresh.** The spec asks for a file under `../changelog/`, and no changelog folder exists under the parent. This is outside the closeout write set.
<!-- /ANCHOR:open-items -->
