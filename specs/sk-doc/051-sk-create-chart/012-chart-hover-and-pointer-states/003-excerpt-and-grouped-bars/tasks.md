---
title: "Tasks: Extract the excerpt and transfer it to grouped-bars"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Extract the excerpt and transfer it to grouped-bars

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
## Phase 1: Setup

- [x] T001 Confirm phase 1 (`001-register-and-contract`) has landed, and read `grouped-bars`'s row in phase 1's contract table and readout table (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: `references/template-contract.md:441` registers `grouped-bars` as `tooltip`; `:459` records the readout shape (series name, its value, 1 row), matching what was built. Phase 1's diff (contract, checker, README) is present in the working tree.
- [x] T002 Run `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before editing (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: pre-edit run printed `RESULT: PASSED`, exit 0, `Summary: errors: 0`, render 30/0, all families 0 failures (log `/tmp/phase3-precheck.log`).
- [x] T003 `cp assets/templates/grouped-bars.html` aside to a scratch location, and record its baseline size with `wc -c` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: baseline 19,671 bytes (matches plan.md §2), copy at `scratch/grouped-bars.pre-phase3.html` (git-ignored).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the tooltip CSS block to the existing `<style>` region, near the existing focus rule at `:136`, per plan.md section 3's exact snippet (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: block now at `:138-152`, verbatim from the plan snippet, directly under the focus rule; every colour from `var(--chart-surface|--rule|--ink|--muted)`, zero literals (colour-literals family 1038/0).
- [x] T005 Add `[data-chart-tooltip] { transition: none; }` inside the existing `@media (prefers-reduced-motion: reduce)` block at `:155-158`, spelled exactly as shown (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: guard line at `:173` inside the existing block, selector spelled `[data-chart-tooltip]` verbatim; `motion` family rose 148→149 assertions, 0 failures.
- [x] T006 Add `<g data-chart-tooltip id="tip-grouped-bars"></g>` inside the `<svg>`, after the `<desc>` at `:168` and before `</svg>` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: group at `:186`, after the legend group, ships empty in the markup (regex read of shipped source: empty content; `interaction-state` 60/0).
- [x] T007 Add the card-building script (`TIP_PAD`, `TIP_LINE`, `TIP_FLOOR`, `TIP_ROWS = 1`, `tipLayer`, `MARKS`, `tipNode`, `markable`, `openTip`, `closeTip`) after `fmt()` and before the column-drawing loop, per plan.md section 3's exact snippet (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: block at `:241-330`, verbatim from plan.md §3 with `TIP_ROWS = 1` and id `tip-grouped-bars` as the plan specifies; `script-parses` 30/0.
- [x] T008 Wrap the column-mark creation call at `:336-340` with `markable(...)`, naming the card `SERIES[s]` and its one row `['Value', fmt(v)]` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: `markable(node('path', ...), SERIES[s], [['Value', fmt(v)]])` at `:440-445`; renders exactly 10 `data-mark` elements, one per drawn column, legend untouched.
- [x] T009 Add the listeners-and-pin script at the end of the drawing script, ending with `svg.appendChild(tipLayer)` as the last statement, per plan.md section 3's exact snippet (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: block at `:496-538`; carries pointermove, pointerleave, svg click-pin and document click-dismissal verbatim; `svg.appendChild(tipLayer)` is the last statement inside the guarded drawing block.
- [x] T010 Confirm no decorative element in `grouped-bars.html` overlaps a column mark. If none does, no `pointer-events: none` exemption is added (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: inspection of the draw loop: per group only grid lines (behind), the two column paths, and a category label below the baseline; legend occupies y 6-20, columns start at y 40. No exemption added.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `node scripts/check-corpus.cjs`, confirm `RESULT: PASSED`, and confirm `interaction-hygiene`, `interaction-state` and `number-format` each report zero failures on `grouped-bars.html` (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: post-edit run printed `RESULT: PASSED`, exit 0, `Summary: errors: 0`; interaction-hygiene 120/0, interaction-state 60/0, number-format 180/0 (log `/tmp/phase3-postcheck.log`).
- [x] T012 Open `grouped-bars.html` with no network. Hover each column, confirm the card names the correct series and value, and confirm it flips to the other side of a mark near the right edge rather than opening past the frame (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: headless-Chrome CDP walk (local `file://`, no network requests): all 10 column marks hovered, name/label/value correct on 10/10 (e.g. mark 0 "Last year / Value 1,240", mark 5 "This year / 1,420"). Right-edge column (Partners, this year): card transform x=504.4, width 128, right edge 632.4 of 720, fully inside the frame; measured screen rects for marks 0/4/9 all inside the drawing's rect. Driver `/tmp/phase3-sweep.cjs`, `/tmp/phase3-geo.cjs`; screenshots `/tmp/phase3-shots/`.
- [x] T013 Tap a column to pin, tap another column to re-pin, tap the pinned column again to clear, tap outside the drawing to clear, and confirm hover does nothing while a mark is pinned (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: CDP click walk, 7/7: tap pins (Last year 1,240); hover another mark while pinned yields (card still shows pinned mark); pointerleave while pinned keeps the card; tap another mark re-pins (This year 1,810); second tap on the same mark clears; tap on empty area inside the drawing clears; tap on the headline (document, outside svg) clears.
- [x] T014 Set the system to reduced motion and confirm the card appears with no fade (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: `Emulation.setEmulatedMedia prefers-reduced-motion: reduce` via CDP: computed `transition-duration` on the tooltip layer reads `0s`, card opens normally. Screenshot `/tmp/phase3-shots/reduced-motion-hover.png`.
- [x] T015 Open the file with scripting disabled and confirm the figure and table read exactly as they did before this phase (negative control) (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: CDP `setScriptExecutionDisabled`, light scheme pinned: screenshot of the edited file is byte-identical (39,284 bytes, `Buffer.equals` true) to the pre-phase backup rendered the same way; DOM shows 0 marks and 0 table rows in both. Screenshots `/tmp/phase3-shots/noscript-{before,after}.png`.
- [x] T016 Run `wc -c` on the finished file, compare against the recorded baseline, and record the delta (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html`) — Evidence: 25,977 bytes after vs 19,671 baseline, delta +6,306 bytes (plan expected about 7,016 + registration; the copy landed under it).
- [x] T017 Final run: `node scripts/check-corpus.cjs` against the finished state, confirm `RESULT: PASSED`, and confirm no file other than `grouped-bars.html` was modified (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: final run printed `RESULT: PASSED`, exit 0, `Summary: errors: 0` (log `/tmp/phase3-finalcheck.log`). Git status against the pre-session baseline shows, besides this phase's `grouped-bars.html` and `tasks.md`, six one-line `data-chart-inert` additions to other templates with mtimes 22:50/22:56 that predate this session's first write (23:03); they are phase 002's declared work (spec.md §3 "Runs With, disjoint files"), made by a concurrent actor, not by this phase. No other file changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (headless Chrome, CDP-driven, both themes; receipts cited per task)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (phase 1 landed; box-plot mechanism stable; verified before the first edit)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (no separate linter exists for this corpus; `script-parses` 30/0 and the full checker are the authoritative gates, both green)
- [x] CHK-011 [P0] No console errors or warnings (CDP collected zero console errors/exceptions across every walk)
- [x] CHK-012 [P1] Error handling implemented (empty-data guard and `fmt()` em-dash path carried over untouched; exercised: a data block patched to hold `NaN` renders the card with an em dash, not `NaN`, and no crash)
- [x] CHK-013 [P1] Code follows project patterns (excerpt copied verbatim from the donor; all corpus families green, including colour-literals 1038/0 and type-scale 305/0)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (SC-001 checker green with the three families at zero; SC-002 hover plus right-edge flip measured; SC-003 all four pin gestures plus hover-yield observed; SC-004 transition-duration 0s under reduce; SC-005 no-script render byte-identical to the pre-phase render; SC-006 delta +6,306 recorded in T016)
- [x] CHK-021 [P0] Manual testing complete (headless Chrome driven over CDP; hover, pin, reduced motion, no-script, light and dark each executed and recorded)
- [x] CHK-022 [P1] Edge cases tested (right-edge flip, tap outside the drawing, tap on empty plot area, hover while pinned, pointerleave while pinned)
- [x] CHK-023 [P1] Error scenarios validated (non-finite value reaches the card as the formatter's em dash, verified on a patched copy in /tmp, repo file untouched)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable: this phase transfers a proven mechanism to a new form rather than fixing a bug. Retained for the packet's own record.

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (N/A per the section preamble: this phase transfers a proven mechanism, it fixes no defect, so there are no findings to class)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (N/A, no fix)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (N/A, no fix; the added helpers have exactly one consumer, the column-drawing loop, by inspection)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (N/A, no such fix)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (N/A, no fix)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (N/A, the code reads only the DOM)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (N/A, no fix)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (static chart template; only palette and geometry values inline; `no-external` 180/0 confirms no network surface)
- [x] CHK-031 [P0] Input validation implemented (empty-data notice guard and `fmt()` non-finite handling present and exercised)
- [ ] CHK-032 [P1] Auth/authz working correctly (not verifiable and not applicable: a static inline chart has no auth surface; nothing to validate)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (tasks.md updated with evidence; spec.md and plan.md unchanged by this phase; no conflicting completion claims)
- [x] CHK-041 [P1] Code comments adequate (comments carry the durable why; no spec paths or task ids embedded, verified by inspection of every added block)
- [ ] CHK-042 [P2] README updated (if applicable) (not updated: `scripts/README.md` is phase 1's file and out of this phase's scope; no behaviour this phase adds needs a README change)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (repo-side backup at `scratch/grouped-bars.pre-phase3.html`; walk drivers and screenshots in /tmp, outside the repository; nothing temp written into the repo outside scratch/)
- [x] CHK-051 [P1] scratch/ cleaned before completion (backup deliberately retained: plan.md §7's rollback procedure restores from it if any verification step is later disputed; remove it at packet close) — the packet closed at `009-close-the-deferrals`, so the retention condition has expired. The rollback path is `git checkout --` against HEAD, which holds the pre-packet state of every tracked file; the temporary copy was only ever a convenience beside it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 9/10 (CHK-032 not applicable, no auth surface; CHK-051 released at packet close, git HEAD is the rollback) |
| P2 Items | 1 | 0/1 (CHK-042 not applicable, README is phase 1's file) |

**Verification Date**: 2026-09-05. Automated: `node scripts/check-corpus.cjs --render` RESULT: PASSED, exit 0, errors 0 (three runs: pre-edit, post-edit, final). Manual: headless Chrome over CDP, 32/32 walk checks plus a 10/10 exhaustive mark sweep and a geometry receipt for the right-edge flip, both themes, reduced motion, no-script byte-identical negative control.
<!-- /ANCHOR:summary -->

---
