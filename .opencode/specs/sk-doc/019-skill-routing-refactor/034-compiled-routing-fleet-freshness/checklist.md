---
title: "Verification Checklist: Compiled-Routing Fleet Freshness Repair"
description: "Verification checklist for the compiled-routing fleet freshness repair."
trigger_phrases:
  - "fleet freshness verification checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored packet from live guard evidence"
    next_safe_action: "Re-mint the four stale hubs first"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The guard verdict was re-confirmed against all three environments before any change
- [ ] CHK-002 [P1] The routing-gate baseline was captured before the first re-mint
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes stay within routing inputs, regenerated manifests, and this packet's docs — no engine/compiler/guard code touched
- [ ] CHK-004 [P2] No ephemeral artifact label appears in any code comment or authored input
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every gate was run by exit code, not by reading tail output
- [ ] CHK-006 [P1] Each compile failure's real exception was captured before its fix landed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-007 [P0] Every requirement in spec.md section 4 has a matching evidence line
- [ ] CHK-008 [P1] Anything deliberately not done (e.g. an engine-defect escalation) is recorded with a reason
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No credential, token or absolute personal path enters a committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P1] Status and completion fields agree with what the evidence supports
- [ ] CHK-011 [P2] Continuity frontmatter reflects the packet's real state at close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P2] Artifacts live under this packet folder and follow the naming convention
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-013 [P0] `validate.sh <folder> --strict` reports Errors:0
- [ ] CHK-014 [P0] No completion claim outruns its evidence
- [ ] CHK-015 [P1] Each item above carries evidence unique to itself
<!-- /ANCHOR:summary -->
