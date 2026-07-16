---
title: "Checklist: Ablation sweep and promote semantic lane to live"
description: "QA gates for the ablation sweep + lane promotion."
trigger_phrases:
  - "ablation sweep checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Wait for 001"
    blockers:
      - "Depends on 001"
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Ablation sweep and promote semantic lane to live

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict spec validation executed on this packet.
- [ ] CHK-201 [P0] Ablation results documented in implementation-summary.md.
- [ ] CHK-202 [P0] `npm exec -- vitest run skill_advisor` clean after promotion.
- [ ] CHK-203 [P0] Dist rebuilt.
- [ ] CHK-204 [P1] Live probe via cli-opencode confirms lane is live.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] Child 001 shipped with cosine lane in dist.
- [ ] CHK-211 [P0] Candidate weight vectors committed to spec.md.
- [ ] CHK-212 [P1] eval_run_ablation tool confirmed functional.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Code passes lint/format checks.
- [ ] CHK-011 [P0] No console errors or warnings.
- [ ] CHK-012 [P1] Error handling implemented.
- [ ] CHK-013 [P1] Code follows project patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria met.
- [ ] CHK-021 [P0] Ablation results tabulated.
- [ ] CHK-022 [P1] Weights sum to 1.0 enforced by test.
- [ ] CHK-023 [P1] No-regression on today-correct fixtures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Same-class producer identified.
- [ ] CHK-FIX-002 [P0] Consumer inventory completed.
- [ ] CHK-FIX-003 [P1] Matrix axes listed (5 lanes x N candidates).
- [ ] CHK-FIX-004 [P1] Evidence pinned to explicit paths.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No new credentials.
- [ ] CHK-221 [P0] No cross-DB writes.
- [ ] CHK-222 [P1] Weight edit affects only the existing fusion math.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] ADR-001 written in decision-record.md.
- [ ] CHK-041 [P1] Implementation-summary contains results table.
- [ ] CHK-042 [P2] README updated if applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Registry edit in `lane-registry.ts`.
- [ ] CHK-231 [P0] ADR-001 in `decision-record.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All CHK-* P0 items checked | Pending |
| All CHK-* P1 items checked | Pending |
| Strict spec validation passes | Pending |
| Vitest clean | Pending |
| Live probe confirms live lane | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Recommend latency does not regress.
<!-- /ANCHOR:perf-verify -->
