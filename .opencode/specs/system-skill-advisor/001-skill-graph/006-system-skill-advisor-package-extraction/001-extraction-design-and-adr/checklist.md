---
title: "Checklist: Design + ADR for skill advisor extraction"
description: "QA gates."
trigger_phrases:
  - "advisor extraction design checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T02:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Design + ADR for skill advisor extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict validate this packet.
- [ ] CHK-201 [P0] Strict validate parent 016.
- [ ] CHK-202 [P1] Survey + ADR present.
- [ ] CHK-203 [P1] Parent phase spec updated.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] Advisor source tree fully inventoried.
- [ ] CHK-211 [P0] All consumers identified via grep.
- [ ] CHK-212 [P1] Tool registrations identified in tool-schemas.ts + context-server.ts.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] No code changes (research-only invariant).
- [ ] CHK-011 [P0] Survey markdown well-formed.
- [ ] CHK-012 [P1] ADR follows L3-style decision-record template structure.
- [ ] CHK-013 [P1] Alternatives table includes ≥ 3 candidates.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..006).
- [ ] CHK-021 [P0] Strict validation passes.
- [ ] CHK-022 [P1] Survey count matches actual repo consumer count.
- [ ] CHK-023 [P1] No new test files added.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Every advisor consumer call site listed in survey.
- [ ] CHK-FIX-002 [P0] Every architectural shape scored on all 6 criteria.
- [ ] CHK-FIX-003 [P1] Chosen shape rationale references specific consumer counts.
- [ ] CHK-FIX-004 [P1] Subsequent migration sequence implied by ADR.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No secrets surfaced in survey.
- [ ] CHK-221 [P0] No external network calls.
- [ ] CHK-222 [P1] No production code or metadata modified.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] ADR-001 written.
- [ ] CHK-042 [P2] Research artifact present.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] ADR in `decision-record.md`.
- [ ] CHK-231 [P0] Survey under `research/extraction-survey.md`.
- [ ] CHK-232 [P1] No files outside this packet + parent 016 spec.md were modified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pending |
| All P1 items | Pending |
| Strict validation | Pending |
| ADR locks shape | Pending |
| Parent phase spec updated | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Codex dispatch under 30 min wall clock.
<!-- /ANCHOR:perf-verify -->
