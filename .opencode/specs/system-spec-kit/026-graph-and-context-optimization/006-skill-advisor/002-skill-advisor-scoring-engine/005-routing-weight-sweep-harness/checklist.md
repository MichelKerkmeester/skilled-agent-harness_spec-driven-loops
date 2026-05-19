---
title: "Checklist: Lane weight sweep harness and intent-prompt corpus"
description: "QA gates for the sweep harness + corpus."
trigger_phrases:
  - "weight sweep harness checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-routing-weight-sweep-harness"
    last_updated_at: "2026-05-13T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Lane weight sweep harness and intent-prompt corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict spec validation executed on this packet.
- [ ] CHK-201 [P0] Strict spec validation executed on parent 015 packet.
- [ ] CHK-202 [P0] `npm run typecheck` executed from `mcp_server/`.
- [ ] CHK-203 [P0] `npm exec -- vitest run skill_advisor` executed.
- [ ] CHK-204 [P1] Dist rebuilt via `npx tsc --build`.
- [ ] CHK-205 [P1] Sweep markdown artifact present under `research/`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] Existing `scoreAdvisorPrompt` reviewed.
- [ ] CHK-211 [P0] Existing `runLaneAblation` reviewed.
- [ ] CHK-212 [P1] Existing corpus locations inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Code passes lint/format checks.
- [ ] CHK-011 [P0] No console errors or warnings.
- [ ] CHK-012 [P1] Override merge logic handles partial vectors gracefully.
- [ ] CHK-013 [P1] Sweep function returns a stable shape regardless of vector count.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria from spec.md met.
- [ ] CHK-021 [P0] Sweep test passes and emits the markdown report.
- [ ] CHK-022 [P1] Override unit test covers single-lane change.
- [ ] CHK-023 [P1] No-regression on existing scorer tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Type extension is purely additive; existing call sites compile unchanged.
- [ ] CHK-FIX-002 [P0] Corpus split documented (today-correct vs intent-described counts).
- [ ] CHK-FIX-003 [P1] Matrix: N vectors x M corpus entries listed in sweep output.
- [ ] CHK-FIX-004 [P1] Recommendation cites specific accuracy numbers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No credentials in corpus.
- [ ] CHK-221 [P0] No external network calls during sweep.
- [ ] CHK-222 [P1] Override does not bypass any validation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Override JSDoc explains semantics and non-renormalization rule.
- [ ] CHK-042 [P2] Research artifact emitted as expected.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Corpus in `skill_advisor/tests/scorer/fixtures/`.
- [ ] CHK-231 [P0] Sweep test in `skill_advisor/tests/scorer/`.
- [ ] CHK-232 [P1] Research artifact in `003-weight-sweep-harness/research/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All CHK-* P0 items | Pending |
| All CHK-* P1 items | Pending |
| Strict validation | Pending |
| Vitest clean | Pending |
| Recommendation justified | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Sweep test runs under 30s.
<!-- /ANCHOR:perf-verify -->
