---
title: "Implementation Summary: sk-code Surface-Nested Router"
description: "Surface-aware routing implemented as a route-time filter + §11 rule and live-validated: aggregate 71 to 79, D3 42 to 50, no recall regression."
trigger_phrases:
  - "sk-code surface-nested router summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/012-sk-code-surface-nested-router"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Surface-aware routing live-validated: aggregate 71 to 79, D3 42 to 50, D2 held"
    next_safe_action: "None blocking; optional intra-surface ranking if more D3 wanted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-surface-nested-router"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-code Surface-Nested Router

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Implemented and live-validated |
| **Date** | 2026-06-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the 011 recommendation as a route-time surface-aware filter (not a map re-key — see Key Decisions). After surface detection, a route loads the `DEFAULT_RESOURCE` preamble + the `references/universal/*` tier + only the detected surface's slice + the Motion.dev overlay, drops the other surface's resources, and defers `assets/*`. A MIXED task keeps both surfaces; UNKNOWN falls back to universal + Motion. Within OpenCode it slices once more by **detected language** (a TypeScript task loads `opencode/typescript/*` + `shared/`, not the Python/shell/config/JavaScript folders); Webflow has no language sub-slice.

### Files Changed (this build)
`scripts/skill-benchmark/router-replay.cjs` (`detectSurface`, `resourceSurface`, `detectOpencodeLanguage`, and the gated surface + language filter in `routeSkillResources`); `sk-code/references/smart_routing.md` §11 (the surface-aware loading rule incl. OpenCode language sub-slicing; removed the now-resolved "surface is flattened" caveat).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Spec + plan + tasks + checklist authored from the converged 011 research (3 native-Opus iterations). The implementation is a four-phase build (restructure → route builder → guards → verify) gated on the baseline-floor D2 regression guard.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Implemented as a route-time surface filter, not a map re-key.** Resources already live under per-surface path prefixes (`references/{webflow,opencode,motion_dev,universal}/`), so filtering the routed output by detected surface achieves H1's effect without re-sorting ~94 paths or rewriting the parser — and the drift guard stays green because the `RESOURCE_MAP` itself is unchanged (only per-route output is sliced). The filter is gated to skills with a per-surface layout, so it is a no-op for every other skill.
- The cross-surface overlay is full + unranked (non-negotiable for CS-001 recall); H4 ranks intra-surface references only (no count cap); H3 folded into H4; H2 deferred; `assets/*` deferred (never the routing gold).
- The router-mode regression guard is "D2 must not drop below the router baseline" (44), not the live floors; the live floors (0.727 / 1.0 / 0.60) are re-measured by a live rerun.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Router regression guard | `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router` | PASS — D2 held at 44, D1-intra 57, D5 100 (no regression); D3 19 → 33 (surface slice + language sub-slice); orphans 0 |
| Drift guard | `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` | PASS |
| Full suite | `npx vitest run` (from `deep-improvement/scripts`) | PASS — 251 tests |
| Live re-measure | `--trace-mode live` over the critical-path subset | PASS — aggregate 71 → 79, D3 42 → 50, D2 87 → 95, D1-intra 92 → 97; no recall regression (CS-001 D2 0.60 → 1.0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- D4 signal is n=2, directional only; a synthetic third routine scenario is a pre-generalization step.
- D2 = 1.0 may be unreachable without a gold↔map reconciliation (the sub-1.0 baselines are genuine misses).
- `assets/*` deferral improves scored D3 partly because assets are never scored gold (a benchmark-fidelity seam, tracked separately).
<!-- /ANCHOR:limitations -->
