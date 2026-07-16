---
title: "Implementation Summary: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery"
description: "Summary of the touchpoint-research subphase: a 12-iteration deep-research run producing the classified touchpoint resource map + deprecation phase DAG."
trigger_phrases:
  - "touchpoint research summary"
  - "deprecation discovery summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/002-deprecate-coco-index/001-touchpoint-research"
    last_updated_at: "2026-05-25T08:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Research complete: 12 iters, resource-map promoted to 014 root"
    next_safe_action: "Plan/execute deprecation phases 002-008"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014001"
      session_id: "014-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-touchpoint-research |
| **Completed** | 2026-05-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 12-iteration deep-research run mapped every LIVE touchpoint of `mcp-coco-index`, `system-rerank-sidecar`, and the `system-code-graph`↔CocoIndex coupling into a classified resource map (`../resource-map.md`) + a dependency-ordered 7-phase deprecation DAG. The synthesized findings live in `research/research.md` and the 12 `research/iterations/iteration-0NN.md` files [SOURCE: research/research.md].
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Iterations 1-10 ran via `cli-devin`/`swe-1.6` (breadth + classified inventory); iterations 11-12 ran via `cli-opencode`/`deepseek-v4` (`--variant high`, adversarial cross-model validation). Each iteration was dispatched one at a time with kill-between, post-validated, and folded via `reduce-state.cjs` [SOURCE: research/deep-research-config.json]. The deepseek closers caught 3 CRITICAL gaps the swe-1.6 passes missed (doctor `_routes.yaml` zombie window, 27 YAML assets hardcoding the coco MCP tool, a false "no port-8765 probes" claim) [SOURCE: research/iterations/iteration-012.md].
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Research-first before any deletion: a classified touchpoint map gates the deprecation phases.
- Historical spec docs under `.opencode/specs/**` stay frozen; only the live surface is in scope.
- D1: memory loses opt-in cross-encoder rerank (default path unaffected; positional fallback). D2: HYBRID semantic-search policy (Grep + code-graph structural).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

12/12 iterations completed with a clean append-only state log (`research/deep-research-state.jsonl`); final verdict COMPLETE+CORRECT [SOURCE: research/iterations/iteration-012.md]. Validate command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <014>/001-touchpoint-research --strict`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Research reports findings only; it does not implement deletions. The deprecation phases (002-008) are scaffolded from this research and executed separately, gated by operator confirmation of D1 + D2.
<!-- /ANCHOR:limitations -->
