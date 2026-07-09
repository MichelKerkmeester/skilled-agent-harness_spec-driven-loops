---
title: "Plan: sk-code Surface-Nested Router"
description: "Implementation plan for the 011 research recommendation: surface-nested RESOURCE_MAP + UNIVERSAL tier + full cross-surface overlay + intra-surface ranking + asset deferral, behind a baseline-floor D2 regression guard."
trigger_phrases:
  - "sk-code surface-nested router plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Drafted the build plan from the 011 recommendation"
    next_safe_action: "Implement the surface-nested map behind the regression guard"
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
# Plan: sk-code Surface-Nested Router

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the 011 recommendation verbatim: re-key the §11 `RESOURCE_MAP` to surface-nested with a shared `UNIVERSAL` tier, add a full unranked cross-surface overlay, apply intra-surface intent-score ranking to references, and defer `assets/*`.

### Technical Context
The change touches sk-code's `references/smart_routing.md` §11 (the machine-readable router) and the skill-benchmark route builder `router-replay.cjs`, plus the two guards (`d5-connectivity.cjs`, `sk-code-router-sync.vitest.ts`). Research is complete (011, 3 native-Opus iterations).

### Overview
Load only the detected surface's slice (plus a shared universal tier and a full cross-surface overlay when a task spans surfaces), ranked intra-surface, with assets deferred — verified against the baseline-floor D2 guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
The 011 recommendation is converged, the baseline D2/D1/D3 are snapshotted from `live-final/`, and the route order + overlay contract are confirmed.

### Definition of Done
D2 per-scenario ≥ {SD-001 0.727, LS-001 1.0, CS-001 0.60}; `surfaceMatch` true; CS-001 keeps all 4 `motion_dev/*` refs; drift test green; D3 rises with no D2 floor breach; full vitest suite green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surface-nested resource map with a shared universal tier and an additive, unranked cross-surface overlay.

### Key Components
`RESOURCE_MAP[surface][intent]` + `RESOURCE_MAP["UNIVERSAL"][intent]` + `MOTION_DEV_OVERLAY`; the `routeSkillResources` builder; the `d5-connectivity` coverage check; the `sk-code-router-sync` drift test.

### Data Flow
`base (DEFAULT_RESOURCE) + ranked(primary surface slice + UNIVERSAL) + overlay(full secondary surface, unranked)`. H4 ranks only the single-surface primary; the overlay is appended after ranking, never ranked or capped; `assets/*` move out of the first slice.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- sk-code OpenCode surface (the `.cjs` route builder + the markdown router doc).
- The skill-benchmark harness (`router-replay.cjs`, `d5-connectivity.cjs`, the drift-guard test).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Restructure §11 `RESOURCE_MAP` to `[surface][intent]` + `UNIVERSAL` + `MOTION_DEV_OVERLAY`.

### Phase 2: Core Implementation
Update `routeSkillResources` for surface-aware lookup + crossSurface overlay + intra-surface ranking + asset deferral; update `d5-connectivity` coverage + the `sk-code-router-sync` drift test.

### Phase 3: Verification
Run the regression guard (replay over SD-001/LS-001/CS-001) + the full vitest suite; sweep AMBIGUITY_DELTA.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Deterministic router-replay over the 3 positive scenarios (D2 floors, surfaceMatch, D3 target); `sk-code-router-sync.vitest.ts` green; full deep-improvement vitest suite green; AMBIGUITY_DELTA ∈ {0,1} sweep on SD-001 (multi-intent).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 011 research recommendation (the design) and the live benchmark baseline (`sk-code/benchmark/live-final/`) for the D2 floors.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the §11 `RESOURCE_MAP` + `router-replay.cjs` changes; the flat-union map is the prior good state. The benchmark baseline is frozen in `live-final/` for comparison.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 → 2 (the builder reads the new shape) → 3 (verify). Phase 3 gates the ship.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small-to-medium: one router-doc restructure + one route-builder change + two guard updates + a verification pass. Research already done (011).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
Baseline snapshot taken; drift test green pre-change; suite green pre-change.

### Rollback Procedure
Single-commit revert of the §11 map + `router-replay.cjs`; re-run the replay to confirm D2 back to baseline.

### Data Reversal
None — the change is pure routing logic with no persisted state or migration.
<!-- /ANCHOR:enhanced-rollback -->
