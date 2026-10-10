---
title: "Acceptance Criteria: Fold one-off repairs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fold one off repairs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs"
    last_updated_at: "2026-10-10T09:47:20Z"
    last_updated_by: "closeout"
    recent_action: "CHK-FIX-006 closed: template cache removed and a same-instance case added (uncommitted)"
    next_safe_action: "Operator decisions in implementation-summary Open Items"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fold one-off repairs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs
**Level:** 2
**Status:** Complete
**Date:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given fillMissingFrontmatter in upgrade-legacy, When it fills frontmatter, Then template literal per document class takes precedence | Test extends "fills missing frontmatter" at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:365` (line 312 before the 2026-10-09 test round; the planned citation `:151+` pointed at fixture setup, so it was corrected). Observed 2026-10-09: from `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run tests/upgrade-legacy.vitest.ts --config ../vitest.config.ts --root . --reporter verbose` printed the case as passed and `Tests 38 passed (38)`, exit 0. The case reads `importance_tier` and `contextType` from each class template and asserts that spec.md and plan.md take `normal` and `general`, goal.md takes `important` and `planning`, and acceptance-criteria.md takes `important` and `implementation`. Authored tiers in tasks.md and resource-map.md are kept. Code: `lib/frontmatter-migration.ts` `readTemplateLiterals` (line 919) is consulted before the memory metadata and the runtime tables, and `spec/upgrade-legacy.mjs` `fillMissingFrontmatter` (line 734) is the only caller that sets `templateLiteralDefaults: true`. Second pass (2026-10-09, after the 012-T1 test round): the file now has 39 cases. From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run tests/upgrade-legacy.vitest.ts --config ../vitest.config.ts --root . --reporter verbose` printed `Test Files 1 passed (1)`, `Tests 39 passed (39)` and exit 0, with the value-source case at `:365` listed as passed. Line numbers in this second-pass text are from the file as it stood at 08:41 CEST, after a change described under AC-003. The file's mtime was the same before and after that run. The value-source case now asserts the fill for all ten template-map entries (CHK-FIX-002). The log is `gates/closeout2-012/upgrade-legacy-verbose.log` in the build scratchpad. Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes upgrade-legacy.vitest.ts, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-002 | REQ-002 | Given upgrade-legacy with failures, When grouped-detail report runs, Then output shows failures grouped by rule with count | Test `groups each failing packet's errors by rule with a detail count` at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:541` (line 398 before the 2026-10-09 test round), passed in the 38 of 38 run above. The case builds the expected headings from the validator report and asserts `### <folder> / x <RULE> (<count>)` headings, sorted by rule, each owning its detail lines, placed before the Downgrades section, and that the apply output ends with `grouped detail:` followed by `none`. Real packets: a read-only dry run, `node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --roots specs/system-speckit/034-spec-folder-tooling/016-research-recommendations`, exit 1 as expected for failing packets, printed `### .../003-archive-path-follow-ups / x AC_CLOSURE (1)` with one detail line and `### .../011-anchor-repair-mode / x AC_CLOSURE (8)` with eight detail lines, both before its Downgrades section. Code: `spec/upgrade-legacy.mjs` `printGroupedDetail` (line 520), called on the dry-run path and the apply path. Second pass: the same case, `groups each failing packet's errors by rule with a detail count`, is listed as passed in the 39 of 39 verbose run above. Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes upgrade-legacy.vitest.ts, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-003 | REQ-003, REQ-004 | Given upgrade-legacy tests, When value-source order and grouped-detail are tested, Then tests pin both behaviors | Value-source is pinned at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:365` and grouped-detail at `:541` (lines 312 and 398 in the 38 of 38 run above), both with exit 0. The value-source case also covers acceptance-criteria.md and resource-map.md, added by the review fix 012-F1. The build record says the builder removed each addon entry from the fill map on throwaway copies and saw the case fail each time. That record is the builder's own and was not re-run here. Second pass: the value-source case now pins all ten template-map entries, and `fills from the class defaults when a template cannot be read` (`:504`) pins the class-default fallback. Both are listed as passed in the 39 of 39 verbose run. A read-only review of the test round (TR-R1) found that the value-source case leaves its `specs/fm-track/001-authored` packet in the shared sandbox, so later cases can depend on order (finding F2, P1). At 08:41 CEST, before the verbose run started, the file gained an `afterEach(resetSandbox)` hook (`:220`) that resets the shared sandbox after each case. That hook addresses F2. The dispatch that was meant to make this fix (brief 012-T2) had no report in the logs at closeout, so the author of the change was not confirmed at the first closeout. Closeout 3: the evidence log attributes the edit to 012-T2, whose dispatch was killed at the 40-minute watchdog before it reported. Closeout 3 added a shuffled check: the file passed 39 of 39 under shuffle seeds 101 and 202 (gates/tests-after-tr/shuffle1.log and shuffle2.log, both rc 0). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes upgrade-legacy.vitest.ts, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-004 | REQ-005 | Given the full suite, When npm test is run, Then no tests fail | The suite is the `test` script at `.skilled/skills/system-spec-kit/runtime/cli/package.json:19`, and its output in runtime/cli shows 0 failures. Observed 2026-10-09 on the whole-tree gate (tree4, git HEAD `02cc1fb948`), run as `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` on the working tree: exit 0, `Test Files 171 passed, 3 skipped (174)`, `Tests 1775 passed, 19 skipped (1794)`. The command chains the vitest step with the legacy and validation sub-steps using `&&`, so exit 0 covers both, and validation printed `Results: 12 passed, 0 failed (of 12)`. The same gate ran `check` (exit 0), the hook tests (`tests 184, pass 181, fail 0`), the doctor suites (`7 suite(s) passed, 0 failed`) and the doctor-update compatibility tests (`pass 22, fail 0`). Tree4 read `upgrade-legacy.vitest.ts` as it stood at 07:58, before the RLUNA isolation fix (012-T2), see AC-003. The pre-wave-1 baseline was 161 files and 1639 passed. Third pass 2026-10-09 (closeout 3): tree5 cli-test exited 0 with Test Files 171 passed, 3 skipped (174) and Tests 1775 passed, 19 skipped (1794) (gates/tree5/cli-test.log). The tree5 root-test exited 0 and its cli sub-step reports the same counts (gates/tree5/root-test.log). | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 to AC-004 carry the packet, each Met with the evidence in the table above. Still open, and outside these criteria: the manual `--apply` on the real corpus (T011 and CHK-021, an operator item. The read-only dry run plans 8 changes), and the changelog refresh under the parent, which needs an operator decision. The stale path inside one module instance of the template cache is closed (CHK-FIX-006): the cache is removed from `lib/frontmatter-migration.ts`, and a same-instance case pins the re-read. That change is uncommitted, so the ship commit pin does not cover it. The ship commit is pinned to `124e11c883` (CHK-FIX-007). The four value-source cases that the first pass left open are now pinned (CHK-FIX-002).
<!-- /ANCHOR:closure -->
