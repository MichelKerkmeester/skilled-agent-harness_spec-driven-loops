---
title: "Changelog: Read-Only cli-codex Deep-Alignment Audit Leaf [007-executor-and-cli-hardening/047-executor-wiring-and-parity/001-cli-codex-read-only-audit-leaf]"
description: "Run the cli-codex deep-alignment leaf under --sandbox read-only and move iteration-artifact writing to the dispatch wrapper so the leaf can never reach for apply_patch."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/001-cli-codex-read-only-audit-leaf` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity`

### Summary

This phase makes a `cli-codex` deep-alignment leaf structurally incapable of writing so it can never use `apply_patch` and never trip the loop's tool-mediated-write halt. The leaf runs under `--sandbox read-only` and emits its audit result as a single structured final message, and the dispatch wrapper authors the three iteration artifacts from that message while injecting the route-proof fields itself; the written artifacts stay schema-identical. The motivating incident was a LUNA alignment run halting at iteration 3 with an `executor_contract_violation` after `apply_patch` wrote to a wrong-path artifact. The spec records its status as In Progress (~90%).
