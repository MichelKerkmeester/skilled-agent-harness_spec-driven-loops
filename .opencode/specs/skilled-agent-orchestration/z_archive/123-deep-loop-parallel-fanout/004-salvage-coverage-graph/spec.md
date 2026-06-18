---
title: "Phase 004: Salvage sweep + coverage-graph per-sessionId"
description: "Salvage fallback in fanout-pool.cjs (reuse post-dispatch-validate; recover executor stdout reply -> missing iteration md + salvaged event) + confirm per-lineage session_id isolates the shared coverage-graph SQLite (no schema change)."
trigger_phrases:
  - "123 phase 004 salvage"
  - "coverage-graph per-session isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/004-salvage-coverage-graph"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 4 complete — fanout-salvage.cjs + 11 tests (salvage + coverage isolation) green; 187/187 full suite"
    next_safe_action: "Phase 5: fanout-merge.cjs + step_fanout_merge in phase_synthesis of all 4 YAMLs (005-consumer-merges-synthesis)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 004 — Salvage sweep + coverage-graph per-sessionId

## Purpose
Make every iteration yield a usable artifact even when an executor doesn't write its file (weak CLIs / sandboxed writes), and ensure parallel lineages don't collide on the shared coverage SQLite.

## Scope
- `fanout-pool.cjs` salvage step: after each lineage sub-loop, sweep with `post-dispatch-validate.ts#validateIterationOutputs`; on `iteration_file_missing/empty`, parse `{sub-packet}/logs/iter-NNN.out` (opencode `--format json` text parts, else raw) → write missing `iterations/iteration-NNN.md` + append `salvaged_from_stdout` event; re-validate; still-missing ⇒ failed marker (loop's stuck-recovery handles persistence).
- Coverage-graph: confirm each lineage's own `session_id` scopes `convergence.cjs` + coverage writes (PK/UNIQUE already include session_id) — no schema change; rely on WAL + existing writer lock.

## Success
- Unit: missing-md+stdout ⇒ salvaged; still-missing ⇒ failed marker.
- Integration: two lineages, distinct sessionIds, shared `deep-loop-graph.sqlite`, explicit no-collision assertion.

## Out of scope
Merge (005); docs (006).
