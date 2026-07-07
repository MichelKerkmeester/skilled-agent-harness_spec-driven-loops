---
title: "Phase 003: Per-lineage spawn + sub-packet isolation"
description: "Pool spawn path (Option B: shell existing command per lineage into {artifact_dir}/lineages/{label}/) + --artifact-dir-override branch in step_resolve_artifact_root across all 4 deep-loop YAMLs; recursion-guard verification."
trigger_phrases:
  - "123 phase 003 spawn isolation"
  - "artifact-dir-override lineages"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/024-deep-loop-parallel-fanout/003-per-lineage-spawn-isolation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 3 complete — decision-record.md + fanout-run.cjs + all 4 YAML overrides + 5 integration tests green (176/176 excl. known loop-lock flake)"
    next_safe_action: "Phase 4: salvage sweep + per-lineage session_id in coverage-graph (004-salvage-coverage-graph)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 003 — Per-lineage spawn + sub-packet isolation

## Purpose
Run each lineage as the existing command (verbatim loop) into its own isolated sub-packet.

## Scope
- `fanout-pool.cjs` spawn path: existing deep-loop command, single synthesized `config.executor` per lineage, `--max-iterations {lineage.iterations ?? default}`, env `SPECKIT_FANOUT_LINEAGE_ID={label}`, capture stdout to `{sub-packet}/logs/iter-NNN.out`.
- `--artifact-dir-override` branch in `step_resolve_artifact_root` for all 4 YAMLs: `deep_start-{research,review}-loop_{auto,confirm}.yaml` (override → use it; else `resolveArtifactRoot`). Sub-packets at `{artifact_dir}/lineages/{label}/`.
- Recursion-guard check: distinct kinds safe; same-kind replicas verify loop-lock/ancestry (`SPECKIT_<KIND>_STATE_DIR`).

## Success
- Integration: pool spawns a stub command twice into two `lineages/{label}/` trees; distinct trees + distinct sessionIds + no lock contention.

## Out of scope
Salvage (004); merge (005).
