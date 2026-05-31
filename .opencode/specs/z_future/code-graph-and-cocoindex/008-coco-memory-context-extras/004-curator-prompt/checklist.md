---
title: "Verification Checklist: 004 Curator Prompt"
description: "Verification checklist for memory curator prompt child phase."
trigger_phrases:
  - "027 011 004 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/004-curator-prompt"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child checklist"
    next_safe_action: "Use checklist during implementation"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-004-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 004 Curator Prompt

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] LLM cache precedent read
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Parser rejects invented IDs
- [ ] CHK-011 [P0] Cache hits are revalidated
- [ ] CHK-012 [P1] Prompt constrains output to candidate set
- [ ] CHK-013 [P1] Timeout path is fail-open
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Invalid JSON test passes
- [ ] CHK-021 [P0] Invented ID test passes
- [ ] CHK-022 [P1] Cache key test passes
- [ ] CHK-023 [P1] Prompt snapshot test passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class documented for any implementation bug fixed during this phase
- [ ] CHK-FIX-002 [P0] Same-class LLM helpers inventoried
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for cache key changes
- [ ] CHK-FIX-004 [P0] Parser fixes include adversarial invalid JSON and invented-ID tests
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed for model/provider settings
- [ ] CHK-FIX-007 [P1] Evidence is pinned to explicit file paths and commands
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Curator cannot surface invented paths
- [ ] CHK-031 [P0] Candidate ID validation is mandatory
- [ ] CHK-032 [P1] No prompt includes secrets or raw database internals
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, and tasks stay synchronized
- [ ] CHK-041 [P1] Curator schema documented near implementation
- [ ] CHK-042 [P2] ENV docs updated if flags are introduced here
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Curator module stays under `mcp_server/lib/search`
- [ ] CHK-051 [P1] Tests stay under `mcp_server/__tests__/search`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
