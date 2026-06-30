---
title: "Verification Checklist: Baseline Rhythm Token"
description: "Verification items for the baseline rhythm row in token_starter.md §4, the layout_responsive.md §2 link, and design-foundations/scripts/baseline_rhythm_check.py, covering existence, deterministic accept/fail/exception acceptance, fluid + presence edges, numeric reconciliation with the shared laws, additive scope-lock, and evergreen."
trigger_phrases:
  - "baseline rhythm token checklist"
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
    recent_action: "Verified all 26 checklist items against the delivered row, link, and validator"
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
# Verification Checklist: Baseline Rhythm Token

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

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

- [x] CHK-001 [P0] Live craft surfaces re-read before authoring (`token_starter.md` §3 Type Scale + §4 Spacing Scale, `layout_responsive.md` §2 Spacing System)
  - **Acceptance**: the baseline base and the linked section names match what is actually on disk, not assumed structure
- [x] CHK-002 [P0] Scope frozen to the two additive craft edits + one new validator, plus the orchestrator-approved scope amendment reconciling one `numeric_design_laws.md` row; no other sibling doc touched
  - **Acceptance**: `git status --porcelain` shows only `token_starter.md`, `layout_responsive.md`, `baseline_rhythm_check.py`, and the one scope-amended `numeric_design_laws.md` row under `.opencode/skills/sk-design/`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `token_starter.md` §4 carries a `baseline rhythm` row naming the rhythm base plus a rule line stating the multiple/fraction-or-exception relation
  - **Acceptance**: §4 renders the new `--baseline` row and the rule sentence; no existing spacing value or the section order changed
- [x] CHK-011 [P0] The doc's exception convention and the validator's marker are the same literal token
  - **Acceptance**: the marker described in the §4 rule line is exactly what `baseline_rhythm_check.py` scans for; a marked row passes for the same reason the doc says it should
- [x] CHK-012 [P0] `baseline_rhythm_check.py` parses the §4 table and FAILS an unrelated unmarked spacing value (not merely a missing table)
  - **Acceptance**: a planted in-block non-baseline value (`24px`->`25px`) with no marker yields a non-zero exit (1) naming the offending token, scoped to the §4 Spacing Scale block
- [x] CHK-013 [P1] Validator mirrors the foundations convention: stdlib only, WHY-docstring, exit 0/1/2, optional `--json`
  - **Acceptance**: `py_compile` is clean and the interface matches `contrast_check.py`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: `baseline_rhythm_check.py token_starter.md` exits 0 on the live scale
  - **Acceptance**: deterministic exit 0 because every current value (`4,8,12,16,24,32,48,96`) is a 4px multiple
- [x] CHK-021 [P0] ACCEPTANCE: a planted one-off value with no exception marker exits non-zero
  - **Acceptance**: non-zero exit + a message identifying the token and its unrelated value
- [x] CHK-022 [P0] ACCEPTANCE: the same planted value, marked an exception, exits 0
  - **Acceptance**: the marked row is accepted; the exception path is honored deterministically
- [x] CHK-023 [P1] EDGE: `clamp()`/fluid, missing-`--baseline`, no-spacing-rows, and a half-step fraction each return a defined verdict
  - **Acceptance**: `clamp(48px, 8vw, 96px)` passes on its fixed-px anchors; the two presence guards fire by name; `2px` passes as a ½ fraction; nothing crashes

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Acceptance**: matrix/evidence — this phase adds one rhythm rule, one link, and one validator and produces no code-defect findings; the deliverable is the accept/fail/exception/edge matrix
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Acceptance**: the spacing-rhythm rule is foundations-local; grep confirms no other mode doc restates a competing baseline relation that would also need this row
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Acceptance**: the §4 row's only programmatic consumer is `baseline_rhythm_check.py`; the §2 link is the only doc pointer added; `numeric_design_laws.md` is the one downstream consumer, reconciled by approved scope amendment so its spacing-scale row cites the checker (`numeric_law_check.py` still exit 0)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Acceptance**: adversarial matrix executed — unrelated unmarked value, marked exception, `clamp()`/fluid row, missing-baseline, no-rows, ragged/malformed row, and a clean no-op all behave deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Acceptance**: axes are {multiple, ½/¼ fraction, marked exception, fluid clamp, unrelated unmarked, missing baseline, no rows}; counted and recorded in the verification notes
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Acceptance**: not applicable; the validator reads only the target file text and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Acceptance**: evidence pins to the §4 baseline row in `token_starter.md`, the §2 link in `layout_responsive.md`, and the classification function in `baseline_rhythm_check.py`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:reconciliation -->
## Reconciliation

- [x] CHK-060 [P0] Numeric consistency: the baseline base (4px) and the validated values do not contradict the `spacing-scale`, `type-modular-ratio`, or `type-body-size` rows in `numeric_design_laws.md`
  - **Acceptance**: a row-by-row diff shows the same 4px base and a 16px-body line-height that resolves to a clean multiple; no invented or conflicting number
- [x] CHK-061 [P1] Enforcement-status drift named, then reconciled, not silently patched or silently left
  - **Acceptance**: the drift was named (the `spacing-scale` row's `advisory (no script)` label and "no checker currently rejects one-off spacing values" caveat are superseded by the new validator) and then reconciled in-phase by an orchestrator-approved scope amendment: the row now cites `baseline_rhythm_check.py`, and `numeric_law_check.py` still exits 0

<!-- /ANCHOR:reconciliation -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Integrity: the baseline row codifies the existing 4px rhythm — it does not relocate spacing logic out of §4 or change any listed value
  - **Acceptance**: the spacing scale's values are byte-identical to before; only the additive `--baseline` row and the rule line are new
- [x] CHK-031 [P1] No false trust signal: the validator's scope is honestly the populated spacing tokens; the §3 type line-height column (fill-in blanks) stays advisory and is not claimed as hard-checked
  - **Acceptance**: the docstring and rule line state that line-height is governed by the rule but not hard-validated while the type table ships as blanks

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the baseline row, the §2 link, or the validator
  - **Acceptance**: an evergreen grep over the two edits and the new file returns no `specs/` paths and no packet-phase IDs
- [x] CHK-041 [P1] Link resolves: the `layout_responsive.md` §2 relative path opens `token_starter.md` §4 on disk
  - **Acceptance**: following `../../assets/token_starter.md` from `references/layout/` reaches the baseline rhythm row
- [x] CHK-042 [P1] spec/plan/tasks/checklist synchronized on the multiple/fraction-or-exception contract and the deterministic accept/fail/exception acceptance
  - **Acceptance**: all four docs carry the same relation rule and the same exit 0 / non-zero / exception-pass acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] The change set is the two additive craft edits, `baseline_rhythm_check.py`, and the one scope-amended `numeric_design_laws.md` row; no existing sk-design file rewritten or removed
  - **Acceptance**: `git status --porcelain` lists exactly those edits/additions under `.opencode/skills/sk-design/`; `contrast_check.py` and `numeric_law_check.py` are untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Acceptance**: any planted-value fixtures live only in the session scratchpad; the working tree carries only the intended change set

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered §4 baseline row, the §2 link, and `baseline_rhythm_check.py` (exit 0 live scale, exit 1 on `24px`->`25px`, exit 2 usage); `numeric_law_check.py` still exit 0 after the scope-amended row

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
