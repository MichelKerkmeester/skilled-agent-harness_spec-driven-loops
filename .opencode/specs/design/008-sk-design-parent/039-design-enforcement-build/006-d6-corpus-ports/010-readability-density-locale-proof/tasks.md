---
title: "Tasks: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof"
description: "Task breakdown for adding measured readability/density and locale-stress conditional proof fields plus a static physical-property RTL lint to the sk-design context loading contract."
trigger_phrases:
  - "d6-r10 tasks"
  - "readability density locale proof tasks"
  - "rtl lint contract tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/010-readability-density-locale-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with as-built evidence for the readability/locale additions"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof

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

- [x] T001 Re-read latest `context_loading_contract.md`; confirm §4 + §5 anchors/structure unchanged (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [10m] — §4 REQUIRED PROOF FIELDS + §5 HARD GATES intact pre-edit
- [x] T002 Check sibling 004 / 005 / 006 write status on the same file; if any §4 edit landed, rebase before writing (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [5m] — R4/R5/R6 landed; rebased; R10 last in the lane
- [x] T003 [P] Draft both field shapes + the RTL lint rule, evergreen (no IDs, no spec paths, no provenance) [5m] — drafted from readable-measure / localization-design shapes; evergreen

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Readability / Density field
- [x] T004 Append `### Readability And Density` under §4 REQUIRED PROOF FIELDS with a `text` field block (measure / max-width `ch` / line-height / decision count) and a content-heavy trigger note; display type + short UI strings exempt (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [15m] — landed at line 216

### Locale Stress field
- [x] T005 Append `### Locale Stress` under §4 with a `text` field block (expansion proxy ~130% / RTL logical properties / mirrored directional icons) and a global-UI trigger note (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [15m] — landed at line 241

### Static RTL lint
- [x] T006 Document the static RTL lint in §5 (exact deterministic `rg` command flagging physical `margin-left`/`padding-left`; logical-property exemption: `margin-inline-start`/`padding-inline-start`/`text-align: start`); optionally add a HARD GATES row for the locale/RTL gate (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [10m] — `rg --pcre2` rule at 283-289 + "Locale Stress / RTL" gate row at 279

### Preservation
- [x] T007 Verify every pre-existing §4 field, §5 gate row, calculator reference, and anchor is unchanged (additive-only) (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [5m] — `git diff --numstat` reports `+57 / -0`; R4/R5/R6 lanes intact

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Lint bite
- [x] T008 Run the RTL lint on a physical-property CSS sample — must flag `margin-left`/`padding-left` [10m] — flagged `.physical { margin-left; padding-right; text-align: left }`
- [x] T009 Run the RTL lint on a logical-property CSS sample — must pass (no false positive) [5m] — `.logical { margin-inline-start; padding-inline-end; text-align: start }` clean

### Structural + evergreen
- [x] T010 [P] Confirm both §4 subsections present with the exact field shape and trigger notes [5m] — Readability And Density (216), Locale Stress (241), each with trigger + verdict
- [x] T011 [P] Evergreen scan: no phase IDs, spec paths, or provenance strings in the additions [5m] — scan clean

### No-regression
- [x] T012 Confirm existing fields/gates intact and `proof_check.py` / `contrast_check.py` references still resolve [5m] — R4/R5/R6 lanes intact; both calculator references resolve

### Documentation
- [x] T013 Update spec.md §7 STATUS and complete `implementation-summary.md` on execution [5m] — spec upgraded to Level 2, status complete; implementation-summary authored
- [x] T014 Mark all checklist items with evidence [5m] — checklist fully `[x]` with evidence; Verification Date 2026-06-29

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] RTL lint bites on physical properties, passes on logical
- [x] Both conditional fields present and additive-only verified
- [x] Evergreen + no-regression confirmed
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Shared-file siblings**: 004-interaction-state-matrix, 005-decision-rationale-lane, 006-accessibility-coverage-matrix (all append to `context_loading_contract.md` §4)

<!-- /ANCHOR:cross-refs -->
