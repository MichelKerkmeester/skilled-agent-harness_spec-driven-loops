---
title: "Implementation Summary: sk-code Surface-Nested Router (planned)"
description: "Progress record for the surface-nested router build. Phase opened and planned from the 011 research recommendation; no router change made yet."
trigger_phrases:
  - "sk-code surface-nested router summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opened + planned the build phase from the 011 recommendation"
    next_safe_action: "Phase 1 — restructure the §11 RESOURCE_MAP to surface-nested"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-surface-nested-router"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-code Surface-Nested Router (planned)

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Planned — build pending |
| **Date** | 2026-06-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing in sk-code yet — this phase is opened and planned only. The build implements the 011 research recommendation: a surface-nested `RESOURCE_MAP` with a shared `UNIVERSAL` tier, a full unranked cross-surface overlay, intra-surface intent-score ranking (references only), and `assets/*` deferral.

### Files Changed (this build)
None yet (planned). The build will modify `smart_routing.md` §11, `router-replay.cjs`, `d5-connectivity.cjs`, and `sk-code-router-sync.vitest.ts`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Spec + plan + tasks + checklist authored from the converged 011 research (3 native-Opus iterations). The implementation is a four-phase build (restructure → route builder → guards → verify) gated on the baseline-floor D2 regression guard.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- H1 surface-nesting is the primary fix; the cross-surface overlay is full + unranked (non-negotiable for CS-001 recall).
- H4 ranks intra-surface references only (no count cap — recall is exact/all-or-nothing). H3 folded into H4; H2 deferred.
- D2 regression guard floors at the measured baseline (0.727 / 1.0 / 0.60), not 1.0, because recall was never 1.0.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Regression guard | `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router` over SD-001/LS-001/CS-001 | defined (D2 floors, surfaceMatch, D3 ≥ 0.6) — to run after the build |
| Drift guard | `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` | must stay PASS |
| Full suite | `npx vitest run` (from `deep-improvement/scripts`) | to run after the build |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- D4 signal is n=2, directional only; a synthetic third routine scenario is a pre-generalization step.
- D2 = 1.0 may be unreachable without a gold↔map reconciliation (the sub-1.0 baselines are genuine misses).
- `assets/*` deferral improves scored D3 partly because assets are never scored gold (a benchmark-fidelity seam, tracked separately).
<!-- /ANCHOR:limitations -->
