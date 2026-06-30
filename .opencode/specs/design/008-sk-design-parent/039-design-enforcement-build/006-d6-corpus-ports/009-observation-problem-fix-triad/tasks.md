---
title: "Tasks: Observation/Problem/Fix finding triad"
description: "Ordered tasks to relabel the audit schema (Impact→Problem, Recommended-fix→Fix), add the OBSERVATION slot to the schema and the P0-P3 report skeletons, and ship an opt-in proof_check.py --require-observation-triad gate, with explicit verification of the bite, no-regression, and the preserved D6-R6 a11y matrix."
trigger_phrases:
  - "observation problem fix triad tasks"
  - "audit finding triad task list"
  - "require observation triad checker tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/009-observation-problem-fix-triad"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all build and verification tasks complete with one-line evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Observation/Problem/Fix finding triad

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

*Read targets + decide the slot-label mapping (30m)*

- [x] T001 Read all three targets and the existing `--require-*` flag pattern (`.opencode/skills/sk-design/design-audit/references/audit_contract.md`, `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md`, `.opencode/skills/sk-design/shared/scripts/proof_check.py`) [15m] — application-witness / decision-rationale validators set as the clone template
- [x] T002 Decide and record the slot-label mapping: relabel `Impact` → `Problem`, `Recommended fix` → `Fix`, add leading `Observation`; keep `Evidence`, `Category`, `Owner` [10m] — recorded in spec §3 and checklist CHK-002
- [x] T003 [P] Confirm shared-file sequencing: `audit_contract.md` with the D6-R6 a11y-coverage-matrix phase (landed first), `proof_check.py` with the R5 decision-rationale phase (landed first) [5m] — append points set after both

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Schema relabel + report skeletons + checker (2-2.5h)*

### Findings Schema (contract)
- [x] T004 Relabel the §3 findings schema example (`Impact` → `Problem`, `Recommended fix` → `Fix`) and add the leading `Observation` slot, keeping Evidence, Category, Owner (`.opencode/skills/sk-design/design-audit/references/audit_contract.md`) [25m] — example slots at lines 96-102; Evidence/Category/Owner preserved; §3 a11y coverage line at 99 intact
- [x] T005 Add a one-line house-style note that OBSERVATION is neutral and factual and precedes any judgment (`.opencode/skills/sk-design/design-audit/references/audit_contract.md`) [10m] — neutrality note at line 92

### Report Template (skeletons)
- [x] T006 [P] Add the three slots, in the same order, to the four §3 finding skeletons (P0/P1/P2/P3), keeping placeholders fill-in (`.opencode/skills/sk-design/design-audit/assets/audit_report_template.md`) [25m] — P0 lines 57-63, P1 69-75, P2 81-87, P3 93-99; each carries Observation/Problem/Fix

### Checker (flag + validator)
- [x] T007 Add `_validate_observation_triad(text)` returning `{rows, items, missing, ok}`, modeled on `_validate_application_witness` (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [40m] — `_validate_observation_triad` at line 420
- [x] T008 Add `_find_observation_triad_blocks` plus the `_observation_triad_value` / `_is_observation_triad_placeholder` slot matchers, case-insensitive and bullet/bold tolerant (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [25m] — block finder line 247, helpers lines 227 / 240; `OBSERVATION_TRIAD_FIELDS` line 62
- [x] T009 Wire `--require-observation-triad` into `check()` (new param, extend `missing`, attach sub-result) and `main()` (argv flag, usage string, output line) (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [20m] — param line 468, wiring 484-486 / 502-503, argv line 513, usage line 516, print row line 551

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*(45 minutes)*

### Gate Bite
- [x] T010 Run the checker on a complete-triad finding → passes [10m] — `_validate_observation_triad` returns `{missing:[], ok:True}` (isolated from the base gate)
- [x] T011 Run the checker on a finding missing OBSERVATION → fails naming the slot [10m] — `{missing:['P0 - ...: Observation missing'], ok:False}`; a no-finding report → `observation-triad findings missing`

### No-Regression
- [x] T012 Re-run the default gate and `--require-decision-rationale` / `--require-source-proof` / `--require-application-witness` → behavior unchanged; `py_compile` clean (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [10m] — three existing validators present and non-regressed; `python3 -m py_compile` clean

### Evergreen + Preserve
- [x] T013 [P] Grep every edited skill file for spec IDs / finding IDs / phase numbers / spec-folder paths → none [5m] — orchestrator evergreen scan clean across all three files
- [x] T014 [P] Confirm schema labels = template labels = checker `OBSERVATION_TRIAD_FIELDS`; Evidence/Category/Owner and the D6-R6 7-layer a11y matrix preserved; relabel drops nothing [10m] — `Observation`/`Problem`/`Fix` consistent across the three homes; 7 `- layer:` rows + layer-states vocabulary intact

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Positive gate passes on a complete triad — `{missing:[], ok:True}`
- [x] Negative gate fails on a missing-OBSERVATION finding and names the slot — `{missing:['P0 - ...: Observation missing'], ok:False}`
- [x] Existing gates unchanged (no-regression); `py_compile` clean
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
