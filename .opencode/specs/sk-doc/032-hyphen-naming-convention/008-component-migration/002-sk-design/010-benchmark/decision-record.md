---
title: "Decision Record: sk-design benchmark artifact labels (032 phase 010)"
description: "Phase decision record for preserving benchmark snapshot identity while changing underscore-bearing run-label directories to kebab-case."
trigger_phrases:
  - "sk-design benchmark naming decision"
  - "benchmark snapshot path labels"
  - "032 phase 010 decision record"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/010-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded benchmark label decision"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/benchmark/README.md"
      - ".opencode/skills/sk-design/benchmark/baseline/"
      - ".opencode/skills/sk-design/benchmark/after_009/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: sk-design Benchmark Artifact Labels

<!-- ANCHOR:context -->
## Context

The benchmark surface stores historical run snapshots in directories such as `after_009`, `after_012_routing_rigor`, and `after_d3_proxy`. These names are filesystem labels, while the reports inside carry scenario IDs, scores, schema keys, and frozen baseline semantics. A path rename must not rewrite the report's semantic identity or renderer-owned content.

The phase needs one consistent label policy across all saved snapshots and the benchmark README.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Hyphenate run-label directories and preserve report identity

Rename the six underscore-bearing after directories to `after-009`, `after-012-routing-rigor`, `after-016-hub-routing`, `after-018-transport-integration`, `after-022-coverage-fill`, and `after-d3-proxy`. Keep `baseline/`, `report.json`, `report.md`, and `skill-benchmark-report.*` unchanged where their names are already canonical or renderer-owned.

Update only path-valued README/changelog/storage references. Preserve report JSON keys, scenario IDs, scores, schema versions, and the baseline comparison role.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Historical snapshots remain distinct and discoverable under canonical filesystem labels.
- Report content remains comparable because semantic IDs, scores, and schemas are not rewritten.
- The verifier must compare the pre/post report trees and reject any content change outside path-context references.
- Rollback is a git revert of the phase-scoped directory/reference commit; no benchmark rerun is required to undo the naming change.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `.opencode/skills/sk-design/benchmark/README.md` (storage and comparison guidance)
- `.opencode/skills/sk-design/benchmark/baseline/` (frozen comparison anchor)
- `001-convention-policy-and-scope/decision-record.md` (semantic map and exemption boundary)
<!-- /ANCHOR:references -->

