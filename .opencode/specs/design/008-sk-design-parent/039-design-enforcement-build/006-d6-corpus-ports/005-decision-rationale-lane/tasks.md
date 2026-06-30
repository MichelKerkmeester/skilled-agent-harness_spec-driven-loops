---
title: "Tasks: DECISION RATIONALE proof lane"
description: "Task breakdown for adding the conditional decision-rationale field, card section, and proof_check.py validator, with explicit verification and no-regression tasks."
trigger_phrases:
  - "decision rationale tasks"
  - "design rationale lane tasks"
  - "proof check rationale tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/005-decision-rationale-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all build and verification tasks complete with one-line evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: DECISION RATIONALE proof lane

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
## Phase 1: Setup

*Contract field + gate (30-45m)*

- [x] T001 Re-read the contract's Required Proof Fields and HARD GATES sections to fix the exact append point (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [10m] — append point set after the §4 audit-evidence block and the §5 state-matrix gate row
- [x] T002 Append a conditional `DECISION RATIONALE` field-shape block (decision, optionsConsidered[], evidenceSources[], tradeoffs[], validationPlan, sourceProofs[], plus the trigger line direction/pattern-break/handoff) to Required Proof Fields, matching the existing fenced-block style (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [20m] — `### Decision Rationale` at contract line 167, six fields at lines 172-182
- [x] T003 Append one HARD GATE row naming the Decision Rationale gate and what it blocks (a direction/pattern-break/handoff claim with no recorded rationale) (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [10m] — gate row at contract line 201, existing rows unchanged

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Card section + checker (1.5-2.5h)*

### Proof card
- [x] T004 Re-read the proof card to fix the append point after the last existing section (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [10m] — append point set after the existing `## 8. INTERACTION STATE MATRIX` section
- [x] T005 Append a conditional `DECISION RATIONALE` section with a `| Field | Value |` table carrying the six canonical fields and a sourceProofs pointer to the SOURCE PROOF table convention (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [30m] — `## 9. DECISION RATIONALE` at card line 111, six-row `| Field | Value |` table
- [x] T006 Add a one-line gate note showing the `proof_check.py --require-decision-rationale` invocation, matching the existing source-proof/witness gate notes (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [10m] — gate note at card line 113

### Checker
- [x] T007 Add a `DECISION_RATIONALE_HEADING` regex and the canonical required-field name set near the existing heading regexes (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [15m] — `DECISION_RATIONALE_HEADING` line 49, `DECISION_RATIONALE_FIELDS` line 53
- [x] T008 Add `_find_decision_rationale_rows()` cloning the heading-scoped table reader used by the source-proof / application-witness finders (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [25m] — `_find_decision_rationale_rows` at line 188
- [x] T009 Add `_validate_decision_rationale()` requiring each canonical field present and non-placeholder; reasoning quality stays unscored (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [25m] — `_validate_decision_rationale` at line 332; soundness left advisory
- [x] T010 Thread `require_decision_rationale` through `check()` and merge its `missing` into the result, mirroring source-proof/witness wiring (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [15m] — wired at `check()` lines 380/393-395; result key added at line 410
- [x] T011 Add the `--require-decision-rationale` flag, usage string, and non-JSON print row in `main()` (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [15m] — flag at line 419, usage at line 422, print row at line 453
- [x] T012 Update the module docstring usage block to list the new flag (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [10m] — docstring usage line 17

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*(1-1.5h)*

### Checker behaviour
- [x] T013 Confirm a well-formed rationale passes under the flag [15m] — complete six-field table → `_validate_decision_rationale` returns `{missing:[], ok:True}`
- [x] T014 Confirm a report with no rationale section fails with a named gap [10m] — no section → `{missing:['decision-rationale rows missing'], ok:False}`
- [x] T015 Confirm an all-placeholder section fails [10m] — live blank card (all `__________`) → `ok:False`, every field named as placeholder
- [x] T016 Confirm a missing single required field (validationPlan) fails with that field named [10m] — `validationPlan` row absent → `{missing:['decision-rationale field missing: validationPlan'], ok:False}`

### Opt-in isolation + regression
- [x] T017 Confirm a card without the section still passes a plain `proof_check.py` run (flag is fully opt-in) [10m] — legacy report carries no `decision_rationale` result; base `missing` set unchanged
- [x] T018 Re-run `proof_check.py --require-source-proof` and `--require-application-witness` on an existing card and confirm unchanged behaviour [15m] — both validators present and non-regressed; `py_compile` clean
- [x] T019 Grep the three shipped files for spec paths, packet/phase numbers, and finding IDs; confirm none remain [10m] — evergreen scan clean across the contract, card, and checker
- [x] T020 Confirm the contract field block, card section, and checker validator describe the durable WHY without ephemeral artifact labels [10m] — shipped content carries no spec paths or artifact IDs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Positive, negative, and placeholder validator cases behave as specified — complete→ok, missing-field→fail naming the field, no-section→fail, all-placeholder→fail
- [x] Opt-in isolation and source-proof/witness regression confirmed — default gate byte-behaviour-identical; both existing flags non-regressed
- [x] Shipped content passes the no-IDs/no-paths hygiene grep — evergreen scan clean
- [x] Checklist.md fully verified — all P0/P1/P2 items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
