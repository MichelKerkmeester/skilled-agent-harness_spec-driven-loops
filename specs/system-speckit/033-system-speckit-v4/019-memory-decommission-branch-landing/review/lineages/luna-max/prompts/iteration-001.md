---
title: "Iteration 1: D1 Correctness — retrieval coverage and CLI boundaries"
trigger_phrases: []
---

# Iteration 1: D1 Correctness — retrieval coverage and CLI boundaries

## Setup bindings

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- iteration: `1`
- mode: `review`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Review prompt

Review the first bounded retrieval slice for correctness. Compare the free-text recipes and their documentation, the trigger-index reader/generator boundary, the zvec hidden-path handling, and the adjacent focused tests. Check whether the advertised roots are searched exhaustively, whether malformed artifacts and execution statuses fail safely, and whether public CLI values obey their stated grammar. Use exact source-line evidence and at least one negative control for each suspected defect. Do not modify review targets or run repository generators, validators, tests, graph upserts, or continuity writers. Continue to the next iteration regardless of convergence telemetry because the stop policy is `max-iterations`.

