---
title: "Changelog: cli devin executor wiring [007-executor-and-cli-hardening/047-executor-wiring-and-parity/002-cli-devin-executor-wiring]"
description: "Add cli-devin as a wired deep-loop executor kind so fan-out lineages can dispatch through Devin CLI, with an enforced model allowlist and a live-verified flag mapping."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/002-cli-devin-executor-wiring` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity`

### Summary

This phase adds `cli-devin` as a wired deep-loop executor kind so fan-out lineages can dispatch through the Devin CLI. Previously `EXECUTOR_KINDS` shipped five kinds with no `cli-devin`, so the config parser rejected the kind before a lineage was ever expanded — blocking any multi-model run wanting a Devin-hosted model. The change gives cli-devin the same shape as the other CLI kinds: an enforced model allowlist, a flag mapping derived from the live CLI, audit-table entries, and unit coverage mirroring the cli-cursor adapter tests. The spec records its status as In Progress, with handoff criteria that a cli-devin lineage dispatches end to end and the runtime suite is green.
