---
title: "Verification Checklist: 027/004/003 Impact Analysis Handler"
description: "Verification checklist for MCP handler and optional enrichment adapter."
trigger_phrases:
  - "027 004 003 handler checklist"
  - "impact handler checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/003-code-graph-impact-analysis/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 003-handler"
    next_safe_action: "Implement this child phase when its dependencies are available"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/004/003 Impact Analysis Handler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim child complete until verified |
| **[P1]** | Required | Must complete or defer with evidence |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `001-contract` dependency is satisfied.
- [ ] CHK-002 [P0] Handler patterns are reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Handler validates changed-file input.
- [ ] CHK-011 [P0] Handler returns MCP success/error envelopes.
- [ ] CHK-012 [P0] `code_graph_impact_analysis` is registered.
- [ ] CHK-013 [P1] Optional enrichment adapter is gated by explicit provider/env config.
- [ ] CHK-014 [P1] Adapter budgets are enforced if adapter ships.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Handler integration test passes.
- [ ] CHK-021 [P0] Default provider-none behavior is tested.
- [ ] CHK-022 [P0] Child strict validation passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Implementation summary records handler, registration, and optional adapter evidence after implementation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Enrichment input size and timeout protections exist if provider code ships.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Implementation summary records whether optional adapter shipped or was deferred.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Handler and optional adapter follow existing code graph layout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 4 | 0/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
