---
title: "Checklist: Lane evidence damping"
description: "QA gates."
trigger_phrases:
  - "lane damping checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/008-routing-confidence-calibration"
    last_updated_at: "2026-05-14T02:15:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Lane evidence damping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict validate this packet.
- [ ] CHK-201 [P0] Strict validate parent 015.
- [ ] CHK-202 [P0] typecheck PASS.
- [ ] CHK-203 [P0] Vitest skill_advisor: only plugin-bridge baseline fails.
- [ ] CHK-204 [P1] Dist rebuilt.
- [ ] CHK-205 [P1] Damping markdown report present.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] Fusion damping insertion point identified.
- [ ] CHK-211 [P0] lane-registry layout understood.
- [ ] CHK-212 [P1] Existing sweep harness reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Lint/format clean.
- [ ] CHK-011 [P0] No console errors.
- [ ] CHK-012 [P1] Damping function pure + unit-tested.
- [ ] CHK-013 [P1] Default-off invariant preserved.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] Acceptance criteria met (REQ-001..006).
- [ ] CHK-021 [P0] Damping math unit-tested.
- [ ] CHK-022 [P1] today-correct floor (>= 0.95) held by chosen config.
- [ ] CHK-023 [P1] No new regressions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Damping config layout shipped in lane-registry OR via override.
- [ ] CHK-FIX-002 [P0] Sweep extension exercises ≥4 damping configs.
- [ ] CHK-FIX-003 [P1] Per-(weight, damping) matrix in report.
- [ ] CHK-FIX-004 [P1] Recommendation cites specific deltas.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No secrets introduced.
- [ ] CHK-221 [P0] No external network beyond configured provider.
- [ ] CHK-222 [P1] Edits restricted to scorer + tests + packet docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Damping JSDoc explains shape + default-off.
- [ ] CHK-042 [P2] Sweep report explains the chosen config.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Damping math in `scorer/fusion.ts`.
- [ ] CHK-231 [P0] Damping config in `scorer/lane-registry.ts` (default-off).
- [ ] CHK-232 [P1] Report at `010-advisor-routing-calibration/research/damping-sweep-results.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pending |
| All P1 items | Pending |
| Strict validation | Pending |
| Vitest clean | Pending |
| today-correct floor | Pending |
| Recommendation cited | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Damping math < 1ms per recommend call.
- [ ] CHK-111 [P1] Combined sweep under 180s warm cache.
<!-- /ANCHOR:perf-verify -->
