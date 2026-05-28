---
title: "Verification Checklist: 027/004/002 Impact Analysis Library"
description: "Verification checklist for the deterministic impact-analysis library."
trigger_phrases:
  - "027 004 002 lib impl checklist"
  - "impact library checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/009-code-graph-impact-analysis/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 002-lib-impl"
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
# Verification Checklist: 027/004/002 Impact Analysis Library

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
- [ ] CHK-002 [P0] Existing impact-mode and detect-changes helpers are identified.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `analyzeImpact()` returns the contract output shape.
- [ ] CHK-011 [P0] Five deterministic risk signals are implemented.
- [ ] CHK-012 [P0] Symbol-level edges aggregate to files.
- [ ] CHK-013 [P0] TESTED_BY evidence uses incoming production-symbol edges.
- [ ] CHK-014 [P0] Missing coverage is unknown/missing.
- [ ] CHK-015 [P0] Traversal has an explicit visited set and depth cap.
- [ ] CHK-016 [P1] Layer fallback emits unavailable/null when Phase 002 data is absent.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Aggregation fixture passes.
- [ ] CHK-021 [P0] Coverage direction fixture passes.
- [ ] CHK-022 [P0] BFS depth/cycle fixture passes.
- [ ] CHK-023 [P0] `npm run check` passes.
- [ ] CHK-024 [P0] Child strict validation passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Implementation summary records analyzer file and fixture evidence after implementation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Analyzer returns structured errors and does not throw raw MCP errors for malformed inputs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Implementation summary includes file and test evidence after implementation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Library file follows existing code graph layout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 3 | 0/3 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
