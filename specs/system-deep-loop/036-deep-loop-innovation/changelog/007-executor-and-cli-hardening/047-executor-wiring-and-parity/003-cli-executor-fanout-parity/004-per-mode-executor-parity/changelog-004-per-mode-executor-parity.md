---
title: "Changelog: Per-Mode Executor Parity [007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity]"
description: "Give model-benchmark, skill-benchmark, and ai-council cli-cursor/cli-devin/cli-pi parity by delegating command construction to the shared buildLineageCommand."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity`

### Summary

This phase gives the three deep modes that run their own dispatch scripts — model-benchmark, skill-benchmark, and ai-council — cli-cursor/cli-devin/cli-pi parity by delegating command construction for those CLIs to the shared `buildLineageCommand`, reusing the fan-out's hardened sandbox/permission/trust flags instead of forking, stubbing, or carrying stale copies. Those CLIs have no mode-specific arg divergence, so the fan-out command drops cleanly into each mode's spawn; cli-opencode, cli-claude-code, and cli-codex keep each mode's own arg contract, and ai-council keeps its deliberate cli-codex exclusion. The spec records its status as In Progress (~35%).
