---
title: "Tasks: sk-code Surface-Nested Router"
description: "Task breakdown for implementing the surface-nested RESOURCE_MAP + overlay + ranking + asset deferral behind the regression guard."
trigger_phrases:
  - "sk-code surface-nested router tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
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

- [ ] T-101 Re-key §11 `RESOURCE_MAP[intent]` → `RESOURCE_MAP[surface][intent]` in `smart_routing.md`.
- [ ] T-102 Add a `UNIVERSAL` tier for `references/universal/*` and a `MOTION_DEV_OVERLAY`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-201 Update `routeSkillResources` for surface-aware lookup + UNIVERSAL merge.
- [ ] T-202 Add the full unranked cross-surface overlay + intra-surface intent-score ranking + `assets/*` deferral.
- [ ] T-203 Update `d5-connectivity.cjs` coverage to count the nested + UNIVERSAL cells.
- [ ] T-204 Update `sk-code-router-sync.vitest.ts` to read the nested structure.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-301 Run the deterministic replay over SD-001/LS-001/CS-001; assert D2 floors + surfaceMatch + D3 target.
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
