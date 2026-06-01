---
title: "Verification Checklist: sk-code Surface-Nested Router"
description: "QA checklist for the surface-nested RESOURCE_MAP build: nesting, overlay, ranking, asset deferral, and the baseline-floor D2 regression guard."
trigger_phrases:
  - "sk-code surface-nested router checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Implement, then verify each item"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-surface-nested-router"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-code Surface-Nested Router

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- Replay: `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router --outputs-dir <dir>` over SD-001/LS-001/CS-001.
- Suite: `cd .opencode/skills/deep-improvement/scripts && npx vitest run`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-01 [P1] Baseline D2/D1/D3 snapshotted from `sk-code/benchmark/live-final/skill-benchmark-report.json`.
- [ ] CHK-02 [P1] 011 recommendation re-read; route order + overlay contract confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-03 [P1] Nested map keeps every doc reachable under ≥1 (surface,intent) or UNIVERSAL cell (no duplication).
- [ ] CHK-04 [P1] No spec-folder paths / packet ids in code comments (hygiene clean).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-05 [P0] Full vitest suite green.
- [ ] CHK-06 [P1] AMBIGUITY_DELTA ∈ {0,1} sweep on SD-001 (multi-intent) shows no D2 regression.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-07 [P0] **REQ-001** surface-nested map; route returns surface slice + UNIVERSAL only.
- [ ] CHK-08 [P0] **REQ-002** cross-surface overlay full + unranked; CS-001 keeps all 4 motion_dev refs.
- [ ] CHK-09 [P0] **REQ-003** D2 per-scenario ≥ {0.727, 1.0, 0.60}; surfaceMatch true.
- [ ] CHK-10 [P1] **REQ-004** references-only ranking, no count cap; assets deferred.
- [ ] CHK-11 [P1] **REQ-005** D3 rises toward ≥ 0.6 with no D2 floor breach.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-12 [P2] No new exec paths; the route builder stays pure (no network, no shell).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-13 [P2] §11 preamble updated to describe the surface-nested shape + the overlay contract.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-14 [P2] Changes confined to `smart_routing.md` §11 + the skill-benchmark route builder/guards.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
- Pending build. Gate: D2 floors hold, surfaceMatch true, drift green, D3 up, suite green.
<!-- /ANCHOR:summary -->
