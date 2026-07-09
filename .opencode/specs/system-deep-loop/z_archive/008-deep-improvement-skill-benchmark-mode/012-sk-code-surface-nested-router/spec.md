---
title: "Feature Specification: sk-code Surface-Nested Router (D3/D4 remediation build)"
description: "Implement the 011 research recommendation: re-key sk-code's RESOURCE_MAP from intent-only to surface-nested with a UNIVERSAL tier, add a full unranked cross-surface overlay, intra-surface intent-score ranking, and asset deferral, to cut D3 over-routing and lift D4 routine-task usefulness without regressing D1 routing or D2 discovery. Gated on a baseline-floor D2 regression guard and a green drift test."
trigger_phrases:
  - "sk-code surface-nested router"
  - "RESOURCE_MAP surface nesting"
  - "sk-code D3 D4 build"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opened the build phase from the 011 research recommendation"
    next_safe_action: "Implement the surface-nested RESOURCE_MAP + overlay behind the regression guard"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
      - ".opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-surface-nested-router"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Does the AMBIGUITY_DELTA sweep keep multi-intent SD-001 (IMPLEMENTATION+ANIMATION) at its D2 floor?"
    answered_questions: []
---
# Feature Specification: sk-code Surface-Nested Router (D3/D4 remediation build)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

Phase 011's 3-iteration deep research recommended a concrete remediation for sk-code's over-routing (D3 42) and task-dependent usefulness (D4 ~49): the `RESOURCE_MAP` keys on intent only and unions resources across all surfaces, so a single-surface task pulls the cross-surface half too. This phase implements the fix — a surface-nested `RESOURCE_MAP` with a shared `UNIVERSAL` tier, a full unranked cross-surface overlay, intra-surface intent-score ranking, and asset deferral — and proves it holds D1/D2 via a baseline-floor regression guard.

**Critical Dependencies**: the 011 research (`011-.../research/research.md`), the §11 machine-readable router, the `router-replay.cjs` route builder + the `sk-code-router-sync.vitest.ts` drift guard, and the live benchmark baseline (`sk-code/benchmark/live-final/`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — build pending |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code routes to the correct surface (`surfaceMatch` true 3/3 live) but over-loads: the `RESOURCE_MAP[intent]` value unions Webflow + Motion.dev + OpenCode + universal resources, so the detected surface's slice arrives bundled with the other surfaces' resources. The cross-surface half is the waste, and the D4 ablation shows it is net-negative on routine tasks (LS-001 0.82 on vs 0.95 off) while helping domain-pattern tasks (CS-001 0.88 vs 0.78).

### Purpose
Cut D3 over-routing and lift routine-task usefulness by loading only the detected surface's slice (plus a shared universal tier and a full cross-surface overlay when a task genuinely spans surfaces), without dropping any gold resource (no D1/D2 regression).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-key `RESOURCE_MAP[intent]` to `RESOURCE_MAP[surface][intent]` plus a `UNIVERSAL` tier for surface-agnostic refs.
- A full, unranked cross-surface overlay (fires on mixed-marker tasks and Motion-on-Webflow) + the Motion.dev peer overlay.
- Intra-surface intent-score ranking (references only) and `assets/*` deferral.
- The route builder (`router-replay.cjs`) + the drift guard test updated for the nested shape; the regression guard run.

### Out of Scope
- H2 phase-gating (deferred by the research — weak signal, hard implementation-trio contract).
- Folding `expectedAssets` into scored gold (a separate benchmark-fidelity follow-on).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code/references/smart_routing.md` | Modify | §11 RESOURCE_MAP → surface-nested + UNIVERSAL tier + Motion overlay |
| `scripts/skill-benchmark/router-replay.cjs` | Modify | surface-aware lookup + cross-surface overlay + intra-surface ranking + asset deferral |
| `scripts/skill-benchmark/d5-connectivity.cjs` | Modify | coverage check counts the nested + UNIVERSAL cells |
| `scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` | Modify | drift guard reads the nested structure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Surface-nested RESOURCE_MAP | route returns only the detected surface's slice + UNIVERSAL; drift guard green |
| REQ-002 | Cross-surface overlay (full, unranked) | crossSurface tasks keep every secondary-surface gold ref (CS-001 keeps all 4 motion_dev refs) |
| REQ-003 | No D1/D2 regression | per-scenario D2 ≥ baseline floor {SD-001 0.727, LS-001 1.0, CS-001 0.60}; surfaceMatch stays true |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Intra-surface ranking + asset deferral | references-only ranking; no count cap; assets out of the first slice |
| REQ-005 | D3 improves | per-scenario D3 rises toward ≥ 0.6 with no D2 floor breach |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-run the deterministic router-replay over SD-001/LS-001/CS-001 — D3 up from {0.40, 0.312, 0.375}, D2 at-or-above floor, surfaceMatch true, drift test green.
- **SC-002**: Full deep-improvement vitest suite stays green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Nesting orphans a doc (drift test red) | High | UNIVERSAL tier holds shared refs; every doc reachable under ≥1 cell |
| Risk | Ranking drops a gold ref (D2 breach) | High | references-only, intra-surface, no count cap; AMBIGUITY_DELTA sweep |
| Risk | Overlay capped → CS-001 D2 breach | High | overlay is full + unranked by contract |
| Dependency | 011 research recommendation | — | this phase implements it verbatim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are the SD-001/CS-001 sub-1.0 D2 baselines gold-authoring errors or real map coverage gaps? (Reconciliation pass may let D2 exceed the floor.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A correctly-detected single-surface task must route fewer resources than today (the whole point).

### Security
- **NFR-S01**: The route builder stays pure — no network, no shell, no file writes; the change is routing logic only.

### Reliability
- **NFR-R01**: The D5 connectivity hard gate stays at pass (no orphaned or dead routes) after nesting.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Mixed-surface task (a `.opencode/` page shipping Webflow animation libs): single-surface pick wins, overlay restores the secondary slice.

### Error Scenarios
- UNKNOWN surface: fall back to the universal tier + DEFAULT_RESOURCE preamble, never the full union.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | router restructure + route builder + drift guard + verification |
| Risk | 19/25 | recall regression risk on a live-routing skill |
| Research | 6/20 | research already done in 011 |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
