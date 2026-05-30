---
title: "Phase 005: Consumer-specific merges + synthesis hooks"
description: "New deep-loop-runtime/scripts/fanout-merge.cjs (research: dedup + cross-model attribution; review: severity rollup + strongest-restriction any-lineage-P0-blocks) + step_fanout_merge atop both phase_synthesis; fanout-attribution.md."
trigger_phrases:
  - "123 phase 005 merge"
  - "fanout-merge.cjs synthesis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/005-consumer-merges-synthesis"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 5 complete — fanout-merge.cjs + step_fanout_merge in all 4 YAMLs + 10 tests; 196/197 (loop-lock flake only)"
    next_safe_action: "Phase 6: command surface + docs + final parity gate (006-command-surface-docs-parity)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 005 — Consumer-specific merges + synthesis hooks

## Purpose
Consolidate the N isolated lineage packets into ONE canonical output per consumer, reusing the existing synthesis compilers.

## Scope
- New `deep-loop-runtime/scripts/fanout-merge.cjs` (`--loop-type research|review`), reads every `{artifact_dir}/lineages/{label}/` registry + iterations + state log.
- New `step_fanout_merge` at the TOP of each `phase_synthesis` (4 YAMLs), gated on `config.fanout`:
  - research: dedup (reuse reducer content-hash) + cross-model attribution → consolidated `deep-research-findings-registry.json` → existing `step_compile_research` emits canonical 17-section `research.md`.
  - review: severity rollup, **strongest-restriction** (any-lineage active P0 ⇒ merged FAIL) → consolidated `deep-review-findings-registry.json` → existing synthesis emits 9-section `review-report.md` + verdict.
  - Both write `{artifact_dir}/fanout-attribution.md` (per-lineage convergence, iters, salvage events, model attribution).

## Success
- Unit: research dedup/attribution; review rollup + strongest-restriction (A clean, B P0 ⇒ merged FAIL).
- Integration: 2-lineage fixture → merged registry → existing synthesis → canonical report unchanged in shape.

## Out of scope
Command flags + docs + final parity (006).
