---
title: "Tasks: Fold one-off repairs"
description: "The task list for Fold one-off repairs, each task naming its file. Tasks are checked with their evidence, and T011 stays open for an operator decision."
trigger_phrases:
  - "fold one off repairs tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fold one-off repairs

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Audit and Documentation

- [x] T001 [P0] Audit fillMissingFrontmatter in upgrade-legacy.mjs and document current value-source order (.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs)
  - Evidence: fillMissingFrontmatter at `spec/upgrade-legacy.mjs:734` and the pre-phase version at HEAD were both read. Before this phase the order for a missing tier or context was the value already in the document, then memory metadata for memory documents, then the runtime tables. No version copies a value from spec.md into another document. The order now is in implementation-summary.md.
- [x] T002 [P0] Check document class templates to see which classes define alternative fields (e.g., goal.md with `important` and `planning`)
  - Evidence: `addons/goal.md.tmpl` declares `important` and `planning`, `addons/acceptance-criteria.md.tmpl` declares `important` and `implementation`, and `core/spec.md.tmpl` and `addons/resource-map.md.tmpl` declare `normal` and `general`, read on 2026-10-09.
- [x] T003 [P] [P0] Read research section 6 on fill-frontmatter value-source (`specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/research.md`, section 6 and the Divergence Map row "Frontmatter value source")
  - Evidence: the citation was `research.md:6, 7.4 table`. Section 7.4 is the archive decision, not the fill ruling, so the citation was corrected to the full path and section 6 with the Divergence Map row. Section 6 names the template literal first and the spec.md copy only where the template leaves the field to the author.
- [x] T004 [P0] Finalize grouped-detail report format: "### folder / x RULE" with rule counts
  - Evidence: `printGroupedDetail` (`spec/upgrade-legacy.mjs:520`) writes `### <folder> / x <RULE> (<count>)`, the count in parentheses after the rule.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Update fillMissingFrontmatter to ensure template literal per document class is the primary source before defaults (.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts and upgrade-legacy.mjs)
  - Evidence: the opt-in `templateLiteralDefaults` option and `readTemplateLiterals` (`lib/frontmatter-migration.ts:919`) run before the memory metadata and runtime tables. `fillMissingFrontmatter` sets the flag at `spec/upgrade-legacy.mjs:749`. No other caller sets it, checked by grep.
- [x] T006 [P0] Implement grouped-detail report in upgrade-legacy.mjs output (group failures by rule with count)
  - Evidence: `printGroupedDetail` runs on the dry-run path (`spec/upgrade-legacy.mjs:1558`) and the apply path (`:1536`), which were `:1590` and `:1568` before the closeout 3 edits. A dry run on the parent folder printed the section on real packets, see AC-002.
- [x] T007 [P1] Document the value-source order in frontmatter-migration.ts comments
  - Evidence: the comment block at `lib/frontmatter-migration.ts:125-158` states the order and why the option is opt-in.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Testing and Verification

- [x] T008 [P0] Extend existing "fills missing frontmatter" test with value-source assertion (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:365, was :312 before the test round)
  - Evidence: the citation was `:151+`, which is fixture setup. The test is `fills missing frontmatter keys and keeps an authored title as written` at `:312` in the 38 of 38 run, and at `:365` now. See AC-001.
  - Second pass (012-T1): the case now pins all ten template-map entries, see CHK-FIX-002. It passes in the upgrade-legacy verbose run recorded in AC-001.
- [x] T009 [P0] Add test case for grouped-detail report format and counts (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:541, was :398 before the test round)
  - Evidence: `groups each failing packet's errors by rule with a detail count` at `:398` passed in the same run, and is at `:541` now, see AC-002.
- [x] T010 [P0] Run suite with npm test and verify no regressions
  - Evidence: whole-tree gate (tree4) `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` exit 0, 171 files and 1775 tests passed, 19 skipped, 0 failed, against a pre-wave-1 baseline of 161 files and 1639 passed. Details in AC-004. Third pass: tree5 cli-test exits 0 with the same counts (gates/tree5/cli-test.rc), after the 012-T2 fix. Tree4 ran before the RLUNA test-isolation fix (012-T2), see implementation-summary.md.
- [ ] T011 [P1] Manually verify upgrade-legacy --apply output with grouped-detail report
  - Open: the dry run on the parent folder was run by hand and shows the grouped section (AC-002). A manual `--apply` on the real corpus was not run, because it would write to sibling packets that other closeout workers are still changing. The apply output with the grouped section is covered by the sandbox case at `:398`. Needs an operator decision on whether to run it.
- [x] T012 [P1] Review spec.md, plan.md, tasks.md for consistency
  - Evidence: after the edits in this closeout, spec.md Status Complete matches the four acceptance rows, and the open items here are named in implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (open: T011)
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (open: the real-corpus `--apply`, T011 and CHK-021)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005 in spec.md section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md names the audit, the value-source change, the grouped report and the tests, and T001 to T009 cover each one.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: spec.md names no dependency. The three shared files ship in the combined commit under parent D6, as the build record notes.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the whole-tree gate tree4 ran `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` (lint plus boundary checks) with exit 0, and its log ends with the boundary, allowlist, alignment and AST checks passing, see AC-004. Third pass: tree5 `cli-check` exits 0 (gates/tree5/cli-check.rc).
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the focused run's only warning is Vite's config notice (VITE_CONFIG_NATIVE_IGNORE_WARNING), printed by the runner before the first test. No error or warning from this phase's code appears in the run's output.
- [x] CHK-012 [P1] Error handling implemented. Evidence: `readTemplateLiterals` returns no literals when a template is missing or unreadable (try/catch in `lib/frontmatter-migration.ts`). The fill step counts a failed file and sets a non-zero exit in its child process. A malformed block is left as is with a named reason.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: lint and boundary checks pass, and the fill step keeps the existing FILL_SCRIPT child-process structure.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 to AC-004 are Met, see acceptance-criteria.md.
- [ ] CHK-021 [P0] Manual testing complete. Open, operator item: the dry run on the parent folder was done by hand (AC-002). The manual `--apply` on the real corpus is open (T011). The evidence log records the full-corpus `--apply` in a throwaway clone as skipped, with the operator not objecting, and lists it as a follow-up.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the value-source case at `upgrade-legacy.vitest.ts:365` keeps an authored title and tier as written. It fills acceptance-criteria.md from its template, a file with no frontmatter block at all. It fills only the missing `contextType` on resource-map.md and tasks.md, and their authored tier stays. It pins the goal.md fields (`important` and `planning`). Malformed frontmatter is pinned at `:818`. The missing-template fallback is pinned at `:504`, added in the second pass. Not applicable: the plan's edge case for a document with no spec.md, because `fillMissingFrontmatter` (`spec/upgrade-legacy.mjs:734`) fills only the file it reads and never copies from spec.md (implementation-summary.md, Deviations item 2).
- [x] CHK-023 [P1] Error scenarios validated. Evidence: a missing template falls back to the class defaults. The case at `upgrade-legacy.vitest.ts:504` renames the decision-record.md template for one `--apply` run, exits 0, and writes the table defaults `important` and `planning`. A frontmatter block the detector refuses is left byte-identical with a named reason, pinned at `:818`. Scope: the fallback case makes the read fail as a missing file. A permission-denied read takes the same catch branch in `readTemplateLiterals` (`lib/frontmatter-migration.ts:919`). That follows from reading the code, and no chmod variant was run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: the review finding F1 (addon fills unpinned) is `matrix/evidence`, and so is the four-class gap in CHK-FIX-002.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `TEMPLATE_DOC_FILES` in `lib/frontmatter-migration.ts` has 10 entries, and the value-source case at `upgrade-legacy.vitest.ts:312` now asserts the value the fill writes for all 10 against each template's literal. The second pass (012-T1) added implementation-summary.md, decision-record.md, research.md and handover.md to the case. tasks.md and resource-map.md keep their authored tier, so only their `contextType` is filled there, and the case checks that fill too. The value-source case is at `upgrade-legacy.vitest.ts:365` as of 08:41 CEST, and it passes in the upgrade-legacy verbose run recorded in AC-001.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: a grep shows `templateLiteralDefaults` is set only by `fillMissingFrontmatter` (`spec/upgrade-legacy.mjs:749`), so the other `buildFrontmatterContent` callers are unchanged. `readTemplateLiterals` and `TEMPLATE_DOC_FILES` have no consumer outside the fill list. Since closeout 3, `readTemplateLiterals` is module-private (OC-O6).
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not a security, path, parser or redaction fix. The template map is fixed in code and no user path reaches it.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: the axes are document class (10 map entries, 6 pinned) and the template option on and off. Listed in implementation-summary.md. Second pass: all 10 entries are pinned, see CHK-FIX-002.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Open: `readTemplateLiterals` keeps a module-level cache (`TEMPLATE_LITERAL_CACHE`) keyed by template path. The second-pass unreadable-template case runs the tool in a child process, which starts with an empty cache, as the case's own comment says. No run here puts a warm cache next to a changed template, and no in-process variant was written.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Open: the phase is not committed yet. Pin the evidence to the commit SHA when the combined commit lands under parent D6.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the phase's added lines match no key, secret, password, token or bearer pattern (grep).
- [x] CHK-031 [P0] Input validation implemented. Evidence: malformed frontmatter is detected before any write, and `readTemplateLiterals` reads only basenames in its fixed map, so an unknown name yields no literals.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, the phase adds no auth or access surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: checked in the closeout pass, see T012.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the order comment sits above the runtime tables in `lib/frontmatter-migration.ts` (lines 142-158), the option has a comment at its declaration (line 79), and `printGroupedDetail` (`spec/upgrade-legacy.mjs:520`) has a comment above it.
- [ ] CHK-042 [P2] README updated (if applicable). Deferred: `spec/README.md` does not describe the grouped section. Optional at P2, so it is left for a later pass.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the phase's scratch/ folder holds only `.gitkeep`. The closeout gate output went to the build scratchpad, as the closeout brief requires.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: nothing to remove, scratch/ holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 0/1 |

Open P0 items: CHK-021. Open P1 items: CHK-FIX-006 and CHK-FIX-007. Open P2 item: CHK-042, deferred.

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->

---



