---
title: "Tasks: sk-code Surface-Nested Router"
description: "Task breakdown for implementing the surface-nested RESOURCE_MAP + overlay + ranking + asset deferral behind the regression guard."
trigger_phrases:
  - "sk-code surface-nested router tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed build tasks"
    next_safe_action: "Start Phase 1 — restructure the §11 RESOURCE_MAP"
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
# Tasks: sk-code Surface-Nested Router

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done. Tasks map to the plan's phases and each names its primary file.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Add the surface-aware loading rule to `smart_routing.md` §11 (route loads detected surface slice + universal tier + Motion overlay, defers assets).
- [x] T-102 Implement via a route-time path-prefix filter (gated to per-surface-layout skills) rather than a map re-key — equivalent effect, drift guard unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Add `detectSurface` + `resourceSurface` + the gated surface filter to `routeSkillResources`.
- [x] T-202 Filter to detected-surface slice + universal + Motion overlay; MIXED keeps both, UNKNOWN falls back; defer `assets/*`.
- [x] T-203 Confirm `d5-connectivity` coverage is unaffected (filter is route-time; the map is unchanged).
- [x] T-204 Confirm the drift guard `sk-code-router-sync.vitest.ts` stays green (map unchanged).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Run the deterministic replay over SD-001/LS-001/CS-001; assert D2 floors + surfaceMatch + D3 target.
- [ ] T-302 Run the full vitest suite + the AMBIGUITY_DELTA sweep; ship only if all gates hold.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Done when all three phases pass and the regression guard (D2 floors, surfaceMatch, drift green, D3 up) holds with the full suite green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..005). Plan: `plan.md`. Research basis: `../011-sk-code-routing-efficiency-remediation/research/research.md`.
<!-- /ANCHOR:cross-refs -->
