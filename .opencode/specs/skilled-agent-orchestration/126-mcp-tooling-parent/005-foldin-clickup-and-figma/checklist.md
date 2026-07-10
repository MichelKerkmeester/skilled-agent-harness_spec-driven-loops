---
title: "Verification Checklist: Phase 5 foldin-clickup-and-figma"
description: "Planned Level-2 verification checklist for the clickup and figma fold-in; items are pending until the phase executes."
trigger_phrases:
  - "clickup figma fold-in checklist"
  - "phase 005 verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Verified and checked off the fold-in checklist"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-clickup-and-figma"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5 foldin-clickup-and-figma

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Both trees' self-path inventories captured before the move — inventoried via `rg` against `.opencode/skills/mcp-click-up/` and `.opencode/skills/mcp-figma/` before the `git mv`
- [x] CHK-002 [P0] figma's current `allowed-tools` recorded for post-move diff — recorded as `Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain` (no `Write`/`Edit`)
- [x] CHK-003 [P1] Phase 004 confirmed complete before starting — `004-onboard-chrome-devtools` validated 0/0 before this phase began
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Moved trees resolve with no broken internal self-paths — `rg "\.opencode/skills/mcp-click-up/|\.opencode/skills/mcp-figma/" .opencode/skills/mcp-tooling/mcp-click-up .opencode/skills/mcp-tooling/mcp-figma` returns zero live hits
- [x] CHK-011 [P0] `git status` shows renames, not deletes-plus-adds — `git status --short` shows 153 click-up + 39 figma `R`/`RM` entries, 0 plain add/delete pairs
- [x] CHK-012 [P1] figma `allowed-tools` unchanged (no Write/Edit, `mutatesWorkspace:false`) — `mode-registry.json`'s `mcp-figma` `toolSurface.forbidden` still lists `Write, Edit, Task`; `mutatesWorkspace: false`
- [x] CHK-013 [P1] Both packets keep their own version and changelog — both `SKILL.md` files read `version: 1.0.0.0`; each keeps its single-entry `changelog/v1.0.0.0.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria (REQ-001..005) met — REQ-001 (both trees relocated), REQ-002 (self-paths rewritten), REQ-003 (figma transport preserved), REQ-004 (identities preserved), REQ-005 (click-up drift documented); see `implementation-summary.md` Verification table for the 5/5 breakdown
- [x] CHK-021 [P0] Self-path grep on both moved trees returns zero live hits — `rg` sweep of both trees confirms zero hits outside `changelog/`
- [x] CHK-022 [P1] figma `sk-design` pairing content intact for phase 006 graph union — `mode-registry.json`'s `extensions.transport-axis.crossHubPairing.mcp-figma` still reads `"sk-design"`
- [x] CHK-023 [P1] Pre-existing click-up config drift left untouched and noted as a follow-up — `mcp-click-up/SKILL.md` still documents OAuth 2.1 + PKCE via `mcp-remote`, unchanged by this move
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A — this phase is a scoped two-tree move via `git mv`, not a bug-fix
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the move — the move is a `git mv` plus path-string rewrites only, confirmed via `git status --short`
- [x] CHK-031 [P0] N/A — no runtime input to validate; the only operation is `git mv`
- [x] CHK-032 [P1] N/A — no auth/authz surface changed; figma's `allowed-tools` and click-up's OAuth config are both unchanged by `git mv`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized on the two moves — `spec.md`, `plan.md`, and `tasks.md` all record Status: Complete with matching evidence
- [x] CHK-041 [P1] Internal doc self-paths rewritten to the nested locations — confirmed via the `ripgrep` sweep documented in CHK-010/CHK-021
- [x] CHK-042 [P2] External README catalogs left for phase 006
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files were created outside `scratch/` during the move
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the tracked `.gitkeep` placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
