---
title: "Changelog: CLI-Executor Fan-out Parity [007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity]"
description: "Phase parent for a six-phase program that audits the full executor/provider/model matrix, wires the gaps, and proves every combination dispatches through the fan-out."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity` (Level 3)

### Summary

This phase parent runs the six-phase program that makes the deep-loop fan-out honest: the config advertises seven executor kinds, but they were not uniformly reachable end-to-end — cli-pi's lineage builder was a hard stub, cli-devin's default permission mode auto-denied exec, per-mode executor availability was uneven, and nothing tested each cli/provider/model combination end-to-end. The program audits the full matrix, wires the gaps, and proves the result with an end-to-end combination test. The spec records all six phases as delivered and the packet reconciled to Complete.

### Included Phases

| Phase | Summary |
|---|---|
| `001-executor-matrix-audit` | Freeze the authoritative executor/provider/model support matrix and produce a gap register with a disposition for every gap; read-only, changes no runtime code. |
| `002-cli-pi-fanout-wiring` | Implement the real `buildPiLineageCommand` so cli-pi dispatches through the fan-out, and forward `--thinking` via `reasoningEffort`. |
| `003-devin-cursor-exec-hardening` | Re-map the devin and cursor lineage builders from live-verified CLI behavior so read-only leaves are genuinely read-only and workspace-write leaves never stall. |
| `004-per-mode-executor-parity` | Give model-benchmark, skill-benchmark, and ai-council cli-cursor/cli-devin/cli-pi parity by delegating to the shared `buildLineageCommand`. |
| `005-combo-test-matrix` | Prove every cli/provider/model/mode combination end-to-end, log every credentials-gated skip, and close the ambient-config isolation boundary. |
| `006-docs-and-closeout` | Reconcile the parent to Complete, record each phase's delivered outcome, and point executor docs at the frozen support matrix. |
