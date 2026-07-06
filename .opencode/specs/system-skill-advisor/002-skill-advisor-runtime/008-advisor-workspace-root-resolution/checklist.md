---
title: "Quality Checklist: Advisor workspace-root resolution by walk-up [template:level_2/checklist.md]"
description: "QA checklist verifying the advisor root-resolution fix: deterministic resolver, two call sites routed, typecheck and dist green, strays cleaned, canonical state intact."
trigger_phrases:
  - "advisor root checklist"
  - "advisor-state qa"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-runtime/008-advisor-workspace-root-resolution"
    last_updated_at: "2026-06-21T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored quality checklist"
    next_safe_action: "Recycle advisor daemon to activate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-advisor-root-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Quality Checklist: Advisor workspace-root resolution by walk-up

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every item is checkable with evidence and carries a priority tag.
- Remove placeholders and items not backed by a real check.
FAILURE MODES:
- Items without evidence, missing priority tags, or untested completion claims.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P0] Root cause confirmed with file:line (`advisor-server.ts:134`, `:298` used `process.cwd()`).
- [x] CHK-002 [P1] Runtime depth verified (compiled file under `dist/mcp_server/`, so the old fixed-depth candidate was dead).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-003 [P1] Scope settled with the operator (full fix plus cleanup).
- [x] CHK-004 [P1] Stray inventory taken before any removal (13 found, 9 main-tree, 4 worktree).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Resolver is deterministic and self-documenting (comment explains source-vs-dist depth and the nesting cause).
- [x] CHK-006 [P1] No new public surface. Only internal root resolution changed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Typecheck rc=0 (0 errors).
- [x] CHK-008 [P1] dist rebuilt cleanly.
- [x] CHK-009 [P0] Walk-up returns the repo root from `cwd=tool/` (PASS true).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P0] Both write-path call sites routed through the resolver (not just one).
- [x] CHK-011 [P1] Pre-existing main-tree strays removed. Canonical state preserved.
- [ ] CHK-012 [P1] Live daemon activation pending operator reconnect / fresh session (T-010).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P1] No credential, path-disclosure or write-authority change. The fix narrows where the advisor writes to the canonical root only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P1] Spec packet authored (spec, plan, tasks, checklist, implementation-summary) plus metadata.
- [x] CHK-015 [P2] Commit message records root cause, fix and verification.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-016 [P2] Single source file changed. Dist is gitignored (rebuilt locally).
- [x] CHK-017 [P1] Stray cleanup touched only `.advisor-state` leaves in the main tree.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Code, cleanup and verification complete. One item (CHK-012 live daemon activation) remains as an operator deploy step.
<!-- /ANCHOR:summary -->
