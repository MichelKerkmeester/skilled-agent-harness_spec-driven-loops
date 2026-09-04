---
title: "Iteration 2: D2 Security — embedding and IPC perimeters"
trigger_phrases: []
---

# Iteration 2: D2 Security — embedding and IPC perimeters

## Setup bindings

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- iteration: `2`
- mode: `review`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Review prompt

Review the bounded security slice covering the preserved local embedding server, its client, model-server supervision, and the Unix/TCP IPC bridge. Trace every trust-boundary claim from bind configuration through the actual request or socket handler. Check remote-bind authorization, secret use, path ownership, symlink and stale-socket handling, and whether the client sends the credentials the server claims to require. Use exact source-line evidence and a negative-control or source-level absence check for each suspected defect. Do not modify review targets or run repository generators, validators, tests, graph upserts, or continuity writers. Convergence is telemetry only; continue to the next iteration under the `max-iterations` stop policy.
