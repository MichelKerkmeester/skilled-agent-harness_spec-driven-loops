---
title: "Verification Checklist: Numeric Design Laws Index"
description: "Verification items for the shared numeric_design_laws.md index + numeric_law_check.py completeness gate, including existence, source-consistency, completeness/tamper, evergreen, and scope-lock acceptance."
trigger_phrases:
  - "numeric design laws checklist"
  - "numeric law index design build"
  - "numeric_law_check completeness gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/001-numeric-law-index"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified all 23 checklist items against the delivered index and gate"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
      - ".opencode/skills/sk-design/shared/cognitive_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Numeric Design Laws Index

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

- [x] CHK-001 [P0] Live source values re-read before authoring (`token_starter.md`, `contrast_pair_inventory.md`, `oklch_workflow.md`, `motion_strategy.md` §Timing scale, `register.md` Motion budget)
  - **Acceptance**: each seeded value in the index traces to a value present in one of these owner files
- [x] CHK-002 [P0] Scope frozen to the two NEW files; no existing craft doc/script/asset/registry edited
  - **Acceptance**: `git status --porcelain` adds only `numeric_design_laws.md` and `numeric_law_check.py` under `.opencode/skills/sk-design/`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `numeric_design_laws.md` exists with the fixed 6-column table `[Law ID, Value/Range, Owner Mode, Enforcement Target, Source, Caveat]`
  - **Acceptance**: the index renders one table with the six columns in that order, plus Overview and Application Notes blocks
- [x] CHK-011 [P0] Every seeded law row is fully populated — no blank/placeholder cell in any of the six columns
  - **Acceptance**: a manual scan plus `numeric_law_check.py` report zero incomplete cells
- [x] CHK-012 [P0] `numeric_law_check.py` parses the law table and FAILS on any incomplete required cell (not merely on a missing table)
  - **Acceptance**: blanking one cell yields a non-zero exit naming the offending `law_id` + column
- [x] CHK-013 [P1] Owner Mode values are one of `foundations` / `interface` / `motion` / `audit`; Enforcement Target is a real script path or the explicit `advisory (no script)` label
  - **Acceptance**: every row's owner is a valid mode and every enforcement target is either a resolvable script or `advisory (no script)`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: `numeric_law_check.py numeric_design_laws.md` exits 0 on the complete index
  - **Acceptance**: deterministic exit 0 on the fully populated index
- [x] CHK-021 [P0] ACCEPTANCE: an incomplete row (one required cell blanked) exits non-zero
  - **Acceptance**: non-zero exit + a message identifying the law_id and the empty column
- [x] CHK-022 [P0] ACCEPTANCE: a table with no data rows exits non-zero (`rows missing`)
  - **Acceptance**: presence guard fires before the per-row scan
- [x] CHK-023 [P1] CONSISTENCY: each indexed value/range equals its cited owner source (no invented or contradictory numbers)
  - **Acceptance**: a row-by-row diff against the live owner files finds every value present and unchanged; the NL-009 register-vs-motion drift is recorded as a caveat, not a contradiction

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Acceptance**: instance-only — this phase adds one shared index plus one stdlib gate and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Acceptance**: instance-only; the change set is the two new files and an evergreen grep over both finds no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Acceptance**: the only consumer of the law table is `numeric_law_check.py`; no existing mode doc, registry, or checker reads it, so nothing downstream changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Acceptance**: adversarial matrix executed — incomplete cell, placeholder-only cell, no-rows table, malformed/ragged row, and a fully complete no-op all behave deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Acceptance**: matrix is 3 gate rows (complete / incomplete / no-rows) plus the consistency diff over all seeded law rows
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Acceptance**: not applicable; the gate reads only the target file text and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Acceptance**: evidence pins to the `## ... law` table block in `numeric_design_laws.md` and the completeness function in `numeric_law_check.py`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Integrity: the index is reference-only — it points at owner docs/scripts and does not copy or relocate any law's logic
  - **Acceptance**: each row's Source names the owner that holds the value; no owned logic is moved into the index
- [x] CHK-031 [P1] No false trust signal: most rows are honestly labeled `advisory (no script)`; only contrast cites a real calculator (`contrast_check.py`)
  - **Acceptance**: the Enforcement Target column never implies automated enforcement that does not exist

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the index or the gate script
  - **Acceptance**: an evergreen grep over both files returns no `specs/` paths and no packet-phase IDs
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the 6-column contract and the deterministic completeness acceptance
  - **Acceptance**: all four docs carry the same column set and the same complete/incomplete/no-rows acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `numeric_design_laws.md` and `numeric_law_check.py` added; no existing sk-design file modified
  - **Acceptance**: `git status --porcelain` lists exactly those two new files under `.opencode/skills/sk-design/`
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Acceptance**: any acceptance fixtures live only in the session scratchpad; the working tree carries only the two new files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered index + completeness gate (exit 0 populated, exit 1 on a blanked cell, exit 2 usage)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
