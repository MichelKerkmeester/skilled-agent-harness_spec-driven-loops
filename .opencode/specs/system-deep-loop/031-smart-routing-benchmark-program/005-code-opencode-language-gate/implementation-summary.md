---
title: "Implementation Summary: code-opencode Language-Slice Intent Gate"
description: "Shipped the deferred code-opencode intent-gate: split LANGUAGE_STANDARDS into per-language intents so a single-language task loads only its own trio (TypeScript task 18→9, language files 12→3); mirrored into the sk-code parent projection with all three drift guards green and no hub regression."
trigger_phrases:
  - "code-opencode language gate summary"
  - "language slice split results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/005-code-opencode-language-gate"
    last_updated_at: "2026-07-09T10:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Split shipped + verified: 3 drift guards 20/20, child 84->87, hub 85->85"
    next_safe_action: "Commit code + packet via scratch-index onto origin/skilled/v4"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Split code-opencode only; code-webflow spans css+html+js by design"
      - "Residual IMPLEMENTATION/CODE_QUALITY co-activation is a separate keyword collision, out of scope"
---
# Implementation Summary: code-opencode Language-Slice Intent Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 005-code-opencode-language-gate |
| **Completed** | Router split shipped + verified; packet committed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
The deferred code-opencode intent-gate from the cross-skill sweep (`../004-cross-skill-routing-sweep`).
code-opencode's single `LANGUAGE_STANDARDS` intent (which loaded all four languages' guides for any
single-language task) is split into `JAVASCRIPT` / `TYPESCRIPT` / `PYTHON` / `SHELL`, each keyed to its
own language keywords and mapped to its own `references/<lang>/` trio. The sk-code parent
`smart_routing.md` machine block mirrors the split (the 12 code-opencode language files move into the
four new intents; code-webflow's css/html/js stay in `LANGUAGE_STANDARDS` — Webflow legitimately spans
all three, per the surface's documented design). The prose per-language rows already existed, so this
realizes a documented-but-unimplemented design rather than inventing one.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Authored directly (correctness-critical), one atomic change across child + parent, verified end-to-end:

- **Routing fixed:** a TypeScript task routed **18 → 9** resources (language files **12 → 3**, TypeScript
  only); Python and shell tasks **14 → 5** (3 language files each). The cross-language waste is gone.
- **Drift guards:** all three sk-code guards green — **20/20** (`sk-code-router-sync` proves
  parent == union(children) + tier; `surface-slice-sync` proves no cross-surface leak;
  `parent-hub-vocab-sync` clean).
- **Benchmarks:** code-opencode child **PASS 84 → 87** (D5 100, D1intra 100); sk-code hub
  **PASS 85 → 85** (no regression — the routing delta is the intended per-language reduction).
- **Gold:** the three language scenarios' `expected_intent` now names the specific language; each
  routes exactly its trio (gold-lang-match 3/3).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Split code-opencode only. code-webflow keeps a lumped `LANGUAGE_STANDARDS` because a frontend task
legitimately spans CSS + HTML + JavaScript together (the smart-router's own documented rationale).
The parent keeps a `LANGUAGE_STANDARDS` intent (now code-webflow-only in RESOURCE_MAP) with its generic
keywords; on the OpenCode surface those webflow files are sliced out and the new language intents win.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Drift guards `npx vitest run` (3 files, 20 tests, all pass); before/after benchmarks via
`loop-host.cjs --mode=skill-benchmark`; per-scenario routing recomputed with `routeSkillResources`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
- **Residual co-activation (out of scope, documented):** the TypeScript scenario's prompt ("…before I
  implement a feature") also fires `IMPLEMENTATION`, and the Python/shell prompts fire `CODE_QUALITY`
  on "standards", so D3 lands at 59, not 100. This is a keyword collision, not cross-language waste;
  narrowing those keywords risks the real `IMPLEMENTATION`/`CODE_QUALITY` scenarios and is a separate
  concern.
- **code-webflow language keywords** remain the generic ts/py/shell set over css/html/js files — a
  pre-existing mismatch left untouched (Webflow's no-sub-slice design makes it low-impact).
- **Advisor projection** carries no `LANGUAGE_STANDARDS` keys, so no advisor vocab update was needed.
<!-- /ANCHOR:limitations -->
