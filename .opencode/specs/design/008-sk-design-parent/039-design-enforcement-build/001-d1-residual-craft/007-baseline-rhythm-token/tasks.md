---
title: "Tasks: Baseline Rhythm Token"
description: "Ordered implementer items to add a baseline rhythm row to token_starter.md §4, link it from layout_responsive.md §2, and create design-foundations/scripts/baseline_rhythm_check.py, with acceptance, exception, fluid-handling, reconciliation, and evergreen verification."
trigger_phrases:
  - "baseline rhythm token tasks"
  - "baseline rhythm design build"
  - "baseline_rhythm_check spacing validator"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/007-baseline-rhythm-token"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete with evidence after gate acceptance passed"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/contrast_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Baseline Rhythm Token

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Baseline row + responsive link]

- [x] T001 Re-read the live craft surfaces before editing: `token_starter.md` §3 Type Scale + §4 Spacing Scale (base step, line-height column, current values) and `layout_responsive.md` §2 Spacing System (the 4-point base rule) (`design-foundations/assets/token_starter.md`, `design-foundations/references/layout/layout_responsive.md`) [15m] — live surfaces re-read, 4px base confirmed
- [x] T002 Add the `baseline rhythm` row to `token_starter.md` §4: a `--baseline` token naming the rhythm base (the existing 4px step) with a Use cell stating that spacing tokens and the body line-height resolve to whole multiples or simple fractions of it; change no existing spacing value (`token_starter.md`) [20m] — `--baseline` `4px` row added, values unchanged
- [x] T003 Add the rule line beneath the §4 table — every spacing token and the body line-height is an integer multiple or a simple ½/¼ fraction of `--baseline`, or a labeled exception — and define the literal `exception` marker the validator will scan for (`token_starter.md`) [15m] — rule line added, `exception` marker defined as the literal the checker scans
- [x] T004 Add the cross-link in `layout_responsive.md` §2 to the baseline rhythm row, using a relative path to `../../assets/token_starter.md` §4; confirm the path resolves on disk before saving (`layout_responsive.md`) [10m] — cross-link added, relative path resolves on disk

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Spacing validator]

- [x] T005 [P] Create `design-foundations/scripts/baseline_rhythm_check.py` (Python 3 stdlib only) with a WHY-docstring, a `main()` arg parser accepting a target path and optional `--json`, mirroring `contrast_check.py` (`design-foundations/scripts/baseline_rhythm_check.py`) [15m] — created, stdlib only, mirrors `contrast_check.py`, `py_compile` clean
- [x] T006 Implement the §4 table parser: locate the Spacing Scale table, read each row's token, value, and Use/notes cell, and read the `--baseline` value as the rhythm base (`baseline_rhythm_check.py`) [25m] — parser scoped to the §4 Spacing Scale block, reads `--baseline` as the base
- [x] T007 Implement classification: pass an integer multiple or simple ½/¼ fraction of the baseline; pass a row whose Use/notes cell carries the `exception` marker; pass a `clamp()`/fluid value when its fixed-px anchors are baseline multiples (`vw`/`vh`/`%` exempt); fail an unrelated unmarked value, naming the token + value (`baseline_rhythm_check.py`) [30m] — classification implemented and verified across the matrix
- [x] T008 Add presence guards (no `--baseline` row → `baseline token missing`; no spacing rows → `spacing rows missing`) and a documented unit rule (resolve `rem`/`em` against a 16px root, or treat non-`px` as a marked exception) (`baseline_rhythm_check.py`) [15m] — presence guards fire by name, unit rule documented
- [x] T009 Wire the exit contract: 0 = all values relate or are marked; 1 = an unrelated unmarked value or missing baseline; 2 = usage/read error; emit a human summary and an optional `--json` payload (`baseline_rhythm_check.py`) [10m] — exit 0/1/2 verified, `--json` payload emitted

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T010 Run `baseline_rhythm_check.py token_starter.md` on the live scale; confirm exit 0 (every current value is a 4px multiple) [10m] — exit 0, all spacing resolves to the 4px baseline
- [x] T011 Fail test: plant a one-off value with no exception marker in a scratch copy; confirm non-zero exit naming the offending token; restore (owner untouched) [10m] — `24px`->`25px` scratch copy exits 1 naming the token, gate scoped to §4; owner untouched
- [x] T012 Exception test: mark that planted value an exception; confirm exit 0 [5m] — marked row exits 0

### Edge + presence
- [x] T013 Edge matrix: `clamp(48px, 8vw, 96px)` passes on its fixed-px anchors; a missing-`--baseline` table and a no-spacing-rows table both exit non-zero with the named guard; a half-step fraction (`2px`) passes [15m] — all verdicts defined, no crash

### Reconciliation
- [x] T014 Diff the baseline base (4px) and the validated values against the `spacing-scale`, `type-modular-ratio`, and `type-body-size` rows in `shared/numeric_design_laws.md`; confirm no contradictory numbers and record the enforcement-status drift note (the `spacing-scale` row's `advisory (no script)` superseded by a real checker, reconciled by approved scope amendment) [20m] — no contradiction; spacing-scale row updated to cite `baseline_rhythm_check.py`, `numeric_law_check.py` still exit 0

### Audits
- [x] T015 Link resolution: confirm the `layout_responsive.md` §2 relative link opens `token_starter.md` §4 on disk [5m] — link resolves to the baseline rhythm row
- [x] T016 Evergreen audit: grep the two edits and the validator for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — evergreen grep clean
- [x] T017 Scope-lock audit: confirm the change set is the additive craft edits plus `baseline_rhythm_check.py`, with no existing value/rule/section removed; the one numeric-law row is the approved scope amendment [5m] — change set confirmed; `contrast_check.py` and `numeric_law_check.py` untouched

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Live scale passes; a planted one-off fails; the exception path passes
- [x] `clamp()`/fluid, missing-baseline, and no-rows cases each return a defined verdict
- [x] Baseline base and values are consistent with the `spacing-scale` / `type-*` laws; enforcement drift reconciled by scope amendment
- [x] Additive only — no existing craft value/rule/section removed; the one numeric-law row is the approved scope amendment
- [x] Evergreen + scope-lock + link-resolution audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Validator convention**: `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py` (stdlib checker pattern)
- **Reconciliation surface**: `.opencode/skills/sk-design/shared/numeric_design_laws.md` (`spacing-scale` / `type-*` rows)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit acceptance + exception + edge + reconciliation tasks)
-->
