---
title: "Verification Checklist: Two-axis Open Design tool classification + ambiguous-read receipts"
description: "QA checklist for the two-axis tool_surface.md classification: both axis tags per tool, the guarded-set union, the get_run-guarded / list_projects-exempt anchors, the derived guardedTools parity, deny-by-default, ambiguous-read receipts, and the evergreen no-IDs rule."
trigger_phrases:
  - "two-axis tool classification checklist"
  - "feedsDesignDecision mutatesWorkspace verification"
  - "guarded set union acceptance"
  - "ambiguous read receipt QA"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/009-two-axis-tool-classification"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered two-axis table"
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
# Verification Checklist: Two-axis Open Design tool classification + ambiguous-read receipts

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

- [x] CHK-001 [P0] Both axes defined with a precise question each in plan.md
  - **Target**: `feedsDesignDecision` (output informs a design choice?) and `mutatesWorkspace` (writes?) are stated as independent axes
  - **Evidence**: plan.md §3 ARCHITECTURE defines both axes with a precise question each; `tool_surface.md` §2 restates them
- [x] CHK-002 [P0] Decision rule frozen as a union
  - **Target**: `guarded = feedsDesignDecision OR mutatesWorkspace`; `exempt = NEITHER`
  - **Evidence**: `tool_surface.md` §2 states `guarded = feedsDesignDecision OR mutatesWorkspace`, exempt = neither axis
- [x] CHK-003 [P1] Full tool set enumerated from the live tool-surface reference
  - **Target**: every registered Open Design tool (~18) appears in the two-axis table
  - **Evidence**: all 18 registered tools appear as rows in the two-axis table

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every tool carries both an explicit `feedsDesignDecision` (Y/N) and `mutatesWorkspace` (Y/N) tag
  - **Target**: no row is missing either axis tag
  - **Evidence**: all 18 rows carry both axis tags; no row missing either
- [x] CHK-011 [P0] Every `feedsDesignDecision` tag carries a one-line rationale
  - **Target**: the advisory per-tool judgment is documented, not implied
  - **Evidence**: each row's final column is a one-line `feedsDesignDecision` rationale
- [x] CHK-012 [P0] The derived `guarded` column equals `feedsDesignDecision OR mutatesWorkspace` for every row
  - **Target**: row-by-row boolean check passes
  - **Evidence**: row walk confirms `guarded = feeds OR mutates` for all 18 rows
- [x] CHK-013 [P1] The surface/gate/omit policy reads as a derivation of the table, not a parallel inventory
  - **Target**: `tool_surface.md` policy section references the two-axis table as its source
  - **Evidence**: §3 opens "It is derived from the two-axis table above" and restates surface/gate/omit as projections

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: a read-only-but-design-feeding tool is classified GUARDED
  - **Target**: `get_run` (returns the generated design) is `feeds=Y, mutates=N, guarded=Y`
  - **Evidence**: `get_run` row is `Y / N / Y (GUARDED)` — orchestrator-verified
- [x] CHK-021 [P0] ACCEPTANCE: a pure-transport tool is classified EXEMPT
  - **Target**: `list_projects` is `feeds=N, mutates=N, guarded=N`
  - **Evidence**: `list_projects` row is `N / N / N (EXEMPT)` — orchestrator-verified
- [x] CHK-022 [P0] ACCEPTANCE: the guarded set equals `feedsDesignDecision OR mutatesWorkspace`
  - **Target**: guarded = the 7 mutating/destructive tools + the 4 design-reads + the 2 ambiguous reads (13); exempt = the 5 inventory/capability reads
  - **Evidence**: resulting sets read 13 guarded + 5 exempt = 18 total, matching the rule
- [x] CHK-023 [P1] ACCEPTANCE: an ambiguous read is guarded by default and exempt only with a non-design-use receipt
  - **Target**: `get_file` and `search_files` are `feeds=Y (ambiguous), guarded=Y`, receipt-exemptible
  - **Evidence**: both rows tagged `Y (ambiguous) / N / Y (GUARDED, receipt-exemptible)`; receipt rule stated below the table

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded for the change
  - **Target**: instance-only — this phase re-models one classification table and reconciles one policy block; no code findings
  - **Evidence**: instance-only; one classification table re-modeled in `tool_surface.md`, no code findings
- [x] CHK-FIX-002 [P0] `mutatesWorkspace = Y` set reconciled with the derived guardedTools list
  - **Target**: the column equals the seven-tool guardedTools list exactly (`create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`)
  - **Evidence**: set-equality holds exactly against the seven-tool guardedTools list — orchestrator-verified
- [x] CHK-FIX-003 [P0] Consumer reconciliation completed
  - **Target**: `guarded_proxy.md` policy arrays read as projections of the table; the table is the single source
  - **Evidence**: the proxy guards `read && feedsDesignDecision`, `exemptTransport` gated on `feedsDesignDecision=false`, and states the policy is derived from the tool-surface reference; reconciled by confirmation, zero proxy edit
- [x] CHK-FIX-004 [P1] Deny-by-default floor documented
  - **Target**: an unclassified or axis-indeterminate tool resolves to guarded; a new tool starts guarded until classified
  - **Evidence**: `tool_surface.md` §2 — "A new, unclassified, or axis-indeterminate tool is guarded by default until both axes are explicitly tagged"
- [x] CHK-FIX-005 [P1] Honest divergence recorded
  - **Target**: the note that the research's flat "ambiguous_read" trio is refined — `list_projects` promoted to clean transport, `get_file`/`search_files` kept guarded-by-default
  - **Evidence**: divergence note after the table; recorded in spec OPEN QUESTIONS

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Read-then-launder path is closed by classification
  - **Target**: design-bearing reads (`get_active_context`, `get_project`, `get_artifact`, `get_run`) are guarded, not "always safe"
  - **Evidence**: all four design-bearing reads tagged `feeds=Y, guarded=Y` in the table
- [x] CHK-031 [P0] Receipt requirement specified for ambiguous reads
  - **Target**: a non-design-use receipt is the only path to exempt `get_file`/`search_files`
  - **Evidence**: §2 states `get_file`/`search_files` are exempt "only when the caller supplies a non-design-use receipt"
- [x] CHK-032 [P1] No tool is silently widened to exempt
  - **Target**: only `feeds=N AND mutates=N` rows are exempt; everything else is guarded
  - **Evidence**: only the 5 `feeds=N, mutates=N` rows are EXEMPT; the other 13 are guarded

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] EVERGREEN: neither reference body carries spec/packet/phase IDs or spec paths
  - **Target**: `rg` over both bodies returns no identifiers and no `specs/` paths
  - **Evidence**: evergreen scan over the `tool_surface.md` body clean; `guarded_proxy.md` unchanged this phase
- [x] CHK-041 [P1] The `feedsDesignDecision` axis is labeled an advisory judgment, not a runtime probe
  - **Target**: the doc states the axis is judgment-made-explicit per tool
  - **Evidence**: §2 — "This is an advisory per-tool judgment made explicit, not a runtime probe of a specific call"
- [x] CHK-042 [P1] spec/plan/tasks synchronized with the authored table
  - **Target**: the plan's derived table matches the delivered `tool_surface.md` classification
  - **Evidence**: the plan's ARCHITECTURE table matches the delivered table row-for-row (18 tools, identical axis tags)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the named reference is written; no live classifier/hook/CLI edited
  - **Target**: change set limited to `tool_surface.md` (`guarded_proxy.md` reconciled by confirmation, no edit)
  - **Evidence**: working-tree diff is +61/-9 on `tool_surface.md` alone; `guarded_proxy.md` has no uncommitted change; no hook/CLI/classifier touched
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Target**: no scratch artifacts left from this phase
  - **Evidence**: no scratch artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification against the delivered two-axis table in `tool_surface.md`)

<!-- /ANCHOR:summary -->

---
