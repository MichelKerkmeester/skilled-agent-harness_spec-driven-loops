---
title: "Tasks: Recommended fix-shape column for the hardening matrix"
description: "Additive task list to add a recommend-only fix-shape + owner column to every probe table in the audit hardening matrix."
trigger_phrases:
  - "harden fix shape column tasks"
  - "hardening matrix fix shape owner tasks"
  - "audit fix shape recommend tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/009-harden-fix-shapes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence; set canonical phase headers"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships content only: the spec names no validator, so the column shape is grep-checkable but no checker is bundled"
      - "The Overlays prose fix line folded into the column with no content loss; ordering stayed §8A to §8B to §9"
---
# Tasks: Recommended fix-shape column for the hardening matrix

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

**Single target file** for every task below: `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [15m]

- [x] T001 Map the eight probe tables and their three current columns (`hardening_edge_cases.md`) [10m] — nine tables mapped including §8B Device and Constrained Context; the three columns Probe/Symptom/Finding confirmed
- [x] T002 [P] Confirm the owner vocabulary from the routing summary and audit findings schema (`hardening_edge_cases.md`) [5m] — routing summary point 3 confirms `foundations`/`interface`/`sk-code` plus the named a11y and evidence routes

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [1-1.5h]

### Add the column header per table
- [x] T003 Add `Fix shape to recommend` as a fourth column to Extreme Inputs (`hardening_edge_cases.md`) [5m] — column header present
- [x] T004 Add the column to API and Network Errors (`hardening_edge_cases.md`) [5m] — column header present
- [x] T005 Add the column to Permissions and Rate Limits (`hardening_edge_cases.md`) [5m] — column header present
- [x] T006 Add the column to Concurrency (`hardening_edge_cases.md`) [5m] — column header present
- [x] T007 Add the column to Internationalization and RTL (`hardening_edge_cases.md`) [5m] — column header present
- [x] T008 Add the column to Text Expansion (`hardening_edge_cases.md`) [3m] — column header present
- [x] T009 Add the column to CJK and Emoji (`hardening_edge_cases.md`) [3m] — column header present
- [x] T010 Add the column to Overlays and Top Layer (`hardening_edge_cases.md`) [3m] — column header present; §8B Device and Constrained Context table also carries the column (9 headers total)

### Write the recommended fix shape + owner per row
- [x] T011 Write fix shape + owner for every Extreme Inputs row, recommend-only (`hardening_edge_cases.md`) [10m] — 5 rows filled
- [x] T012 Write fix shape + owner for every API and Network Errors row (`hardening_edge_cases.md`) [12m] — 8 rows filled
- [x] T013 Write fix shape + owner for every Permissions and Rate Limits row (`hardening_edge_cases.md`) [8m] — 4 rows filled, a11y half routed to `assets/a11y_quick_fixes.md`
- [x] T014 Write fix shape + owner for every Concurrency row (`hardening_edge_cases.md`) [8m] — 4 rows filled
- [x] T015 Write fix shape + owner for every Internationalization and RTL row (`hardening_edge_cases.md`) [8m] — 3 rows filled
- [x] T016 Write fix shape + owner for every Text Expansion row (`hardening_edge_cases.md`) [5m] — 2 rows filled
- [x] T017 Write fix shape + owner for every CJK and Emoji row (`hardening_edge_cases.md`) [5m] — 3 rows filled
- [x] T018 Normalize the existing Overlays prose `Fix shape:` line into the column for every row (`hardening_edge_cases.md`) [5m] — Overlays prose folded into the column, no content lost

### Reinforce the boundary
- [x] T019 Reinforce the recommend-only boundary in the intro or routing summary so the new column reads as a recommendation, not an instruction to harden (`hardening_edge_cases.md`) [8m] — routing summary point 4 states the fix-shape column is advisory

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [30m]

### Fix-completeness
- [x] T020 Confirm every probe row in every table has a non-empty fix-shape cell (`hardening_edge_cases.md`) [8m] — all 35 rows filled (5+8+4+4+3+2+3+1+5)
- [x] T021 Confirm every fix-shape cell names an owner from the allowed vocabulary (`hardening_edge_cases.md`) [5m] — 9 `foundations` + 9 `interface` + 17 `sk-code` = 35

### Boundary and house style
- [x] T022 Confirm no row carries implementation code or step-by-step instructions; shapes are remedy patterns only (`hardening_edge_cases.md`) [5m] — cells are remedy directions plus owner, no code
- [x] T023 Confirm no spec IDs, packet numbers or ephemeral paths in the new content (`hardening_edge_cases.md`) [3m] — evergreen grep clean
- [x] T024 Confirm copy is content-first and consistent with the file's existing voice (`hardening_edge_cases.md`) [3m] — column reads in the file's recommend-and-route voice

### No-regression
- [x] T025 Confirm existing Probe / Symptom / Finding columns and surrounding prose are unchanged (`hardening_edge_cases.md`) [3m] — 35 rows reformatted, 0 lost, symptoms/findings verbatim, §8A to §8B to §9 ordering intact
- [x] T026 Confirm only the target file changed; no sibling reference touched (`git diff --stat`) [3m] — only `hardening_edge_cases.md` modified

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every probe row carries a fix shape and an allowed owner — 35/35 rows, owners in the named set
- [x] Recommend-only boundary intact, no implementation introduced — routing summary point 4 names the column advisory
- [x] Evergreen: no IDs or paths in the new content — evergreen grep clean
- [x] Checklist.md fully verified — all P0/P1/P2 items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
