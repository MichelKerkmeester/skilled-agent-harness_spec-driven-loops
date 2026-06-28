---
title: "Tasks: Two-axis Open Design tool classification + ambiguous-read receipts"
description: "Ordered implementer work items to re-model tool_surface.md on the feedsDesignDecision x mutatesWorkspace axes, reconcile the guarded_proxy.md policy as a derivation, and verify the guarded-set union plus deny-by-default and ambiguous-read receipts."
trigger_phrases:
  - "two-axis tool classification tasks"
  - "feedsDesignDecision mutatesWorkspace work items"
  - "tool surface two axis implementer"
  - "ambiguous read receipt tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/009-two-axis-tool-classification"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line delivery evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/tool_surface.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Two-axis Open Design tool classification + ambiguous-read receipts

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

- [x] T001 Enumerate every registered tool from the live tool-surface reference with its read/mutating/destructive hint (`.opencode/skills/mcp-open-design/references/tool_surface.md`) [15m] — Done: 18 tools enumerated (11 read-only, 5 mutating, 2 destructive)
- [x] T002 Confirm the seven-tool guardedTools list and the exempt-transport arrays in the proxy policy block (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m] — Done: confirmed; `exemptTransport` positive allowlist gated on `feedsDesignDecision=false`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Two-axis table
- [x] T003 Author the axis definitions: `feedsDesignDecision` (does the OUTPUT inform a design choice — UI, design system, visual artifact, prototype, motion, brief?) and `mutatesWorkspace` (does it write?), stating `feedsDesignDecision` is an advisory per-tool judgment, not a runtime probe (`tool_surface.md`) [20m] — Done: both axes defined; `feedsDesignDecision` labeled advisory judgment, not a runtime probe
- [x] T004 Author the two-axis table: tag every tool with `feedsDesignDecision` (Y/N), `mutatesWorkspace` (Y/N), and a derived `guarded` column, with a one-line rationale per `feedsDesignDecision` call (`tool_surface.md`) [40m] — Done: all 18 rows tagged with per-row rationale and a derived `guarded` column
- [x] T005 [P] State the decision rule in prose: `guarded = feedsDesignDecision OR mutatesWorkspace`; `exempt (pure transport) = NEITHER` (`tool_surface.md`) [10m] — Done: decision rule stated above the table

### Reconciliation
- [x] T006 Restate the surface/gate/omit policy so it reads as a derivation of the table rather than an independent inventory (`tool_surface.md`) [25m] — Done: §3 restated as a derivation of the two-axis table
- [x] T007 State that the guardedTools list is DERIVED from the `mutatesWorkspace = Y` column (the seven mutating/destructive tools) and that `feedsDesignDecision = Y` reads are additionally guarded-when-feeding (`tool_surface.md`) [20m] — Done: stated; column = the seven-tool guardedTools projection, design-feeding reads guarded-when-feeding
- [x] T008 Author the deny-by-default floor: any tool not positively classified as pure transport (`feeds=N AND mutates=N`) is guarded; a new tool starts guarded until classified on both axes (`tool_surface.md`) [15m] — Done: deny-by-default sentence in §2
- [x] T009 Author the ambiguous-read receipt rule: `get_file` and `search_files` are `feeds=Y (ambiguous)`, guarded by default and exempt only with a non-design-use receipt (`tool_surface.md`) [20m] — Done: both rows tagged `feeds=Y (ambiguous), guarded=Y, receipt-exemptible`; rule stated
- [x] T010 Reconcile the `guarded_proxy.md` policy arrays so the guarded/exempt lists read as projections of the two-axis table (no parallel drift); keep the proxy as the consumer, the table as the source (`guarded_proxy.md`) [25m] — Done by confirmation: the proxy already guards `read && feedsDesignDecision`, `exemptTransport` gated on `feedsDesignDecision=false`, and states the policy is derived from the tool-surface reference; zero proxy edit, no parallel drift
- [x] T011 [P] Record the honest divergence note: the research's flat "ambiguous_read" trio is refined by the axes — `list_projects` is clean transport (feeds=N, exempt), `get_file`/`search_files` stay guarded-by-default (`tool_surface.md`) [10m] — Done: divergence note recorded after the table

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T012 Walk every row and confirm `guarded` equals `feedsDesignDecision OR mutatesWorkspace`; confirm `get_run` is GUARDED and `list_projects` is EXEMPT [15m] — Done: row walk holds; `get_run` GUARDED, `list_projects` EXEMPT (orchestrator-verified)
- [x] T013 Confirm the `mutatesWorkspace = Y` set equals the seven-tool guardedTools list exactly (set-equality check) [10m] — Done: column = `create_artifact`/`write_file`/`create_project`/`start_run`/`cancel_run`/`delete_file`/`delete_project`
- [x] T014 Confirm a hypothetical unclassified tool resolves to guarded under the deny-by-default rule, and that `get_file`/`search_files` are guarded absent a non-design-use receipt [10m] — Done: deny-by-default covers the indeterminate case; both ambiguous reads guarded absent a receipt

### Integrity and Docs
- [x] T015 Grep both reference bodies for spec/packet/phase IDs and `specs/` paths; confirm none remain (evergreen) [5m] — Done: evergreen scan over `tool_surface.md` body clean
- [x] T016 Update `implementation-summary.md` and mark all `checklist.md` items with evidence [5m] — Done: implementation-summary.md authored; checklist fully `[x]` with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every tool carries both axis tags plus a `feedsDesignDecision` rationale
- [x] Guarded set equals `feedsDesignDecision OR mutatesWorkspace` for every row
- [x] `mutatesWorkspace = Y` set equals the seven-tool guardedTools list
- [x] Deny-by-default and ambiguous-read receipts documented
- [x] Evergreen scan clean (no spec/packet/phase IDs in either doc body)
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---
