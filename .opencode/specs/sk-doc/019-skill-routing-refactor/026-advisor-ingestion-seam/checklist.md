---
title: "Verification Checklist: Advisor Ingestion Seam"
description: "Planned verification for the mechanism decision, warm-daemon discovery proof, journey docs, and routing-evidence guidance."
trigger_phrases:
  - "advisor ingestion seam checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Design phase after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Advisor Ingestion Seam

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Items marked only with command output or diff evidence at execution time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] Startup-only discovery re-verified at watcher source on the execution tip
- [ ] CHK-002 [P1] Decision record accepted before any daemon code changes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Mechanism change bounded and isolated in its own commits
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-004 [P1] Integration test proves create → discover on a warm daemon, no restart
- [ ] CHK-005 [P1] Advisor daemon suite green; no watcher-latency regression on existing roots
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-006 [P1] Both journeys document the same refresh step
- [ ] CHK-007 [P1] Routing-evidence guidance + smoke test landed per the open-question resolution
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-008 [P1] No new privileged paths; any fs-watch widening scoped to top-level roots with debounce
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-009 [P1] Decision record and edited docs version-bumped and cross-linked
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-010 [P2] Daemon changes stay under system-skill-advisor/mcp-server; doc changes under their owning skills
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending execution.
<!-- /ANCHOR:summary -->
