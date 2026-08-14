---
title: "Changelog: cli-pi Fan-out Lineage Wiring [007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring]"
description: "Implement the real cli-pi fan-out lineage builder and let the runtime forward reasoning, so cli-pi is a first-class fan-out executor for every model in its allowlist."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring` (Level 1)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/047-executor-wiring-and-parity/003-cli-executor-fanout-parity`

### Summary

This phase implements the real cli-pi fan-out lineage builder. Previously `buildPiLineageCommand` in `fanout-run.cjs` was a hard stub that threw, so although cli-pi appeared in `EXECUTOR_KINDS` with a model allowlist, no deep mode could dispatch through it — direct `pi -p` worked but the fan-out path did not. The fix implements command construction (`pi -p --offline --model <provider>/<id>` with `--thinking` for reasoning and a read-only tool allowlist), maps each allowlisted pi model to its provider, and adds `reasoningEffort` to the cli-pi flag-support table. The spec records its status as Complete, verified by unit tests over command construction and a live end-to-end dispatch of the builder's own output.
