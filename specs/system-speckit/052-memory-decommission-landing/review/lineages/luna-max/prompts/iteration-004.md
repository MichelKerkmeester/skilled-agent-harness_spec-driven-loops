---
title: "Iteration 4: D4 Maintainability — mirrors and executor contracts"
trigger_phrases: []
---

# Iteration 4: D4 Maintainability — mirrors and executor contracts

## Setup bindings

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- iteration: `4`
- mode: `review`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Review prompt

Review the bounded maintainability slice for runtime agent mirrors, the cli-codex/cli-opencode executor documentation, and the shared deep-loop executor audit/config surfaces. Compare canonical and translated runtime contracts, identify stale or self-contradictory operator guidance, and distinguish documentation-only drift from a runtime safety defect by following the actual process-construction path. Use exact source-line evidence. Do not modify review targets or run repository generators, validators, tests, graph upserts, or continuity writers. Continue despite convergence telemetry.
