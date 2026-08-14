---
title: "Changelog: devin fan-out allowlist parity with the curated catalog [007-executor-and-cli-hardening/002-executor-wiring-and-parity/004-devin-fanout-allowlist-parity]"
description: "Bring the deep-loop runtime's enforced cli-devin allowlist and default model into parity with the curated catalog."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/004-devin-fanout-allowlist-parity` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity`

### Summary

This phase brings the deep-loop runtime's enforced cli-devin allowlist and default model into parity with the curated catalog. The runtime allowlist predated the curation and hard-rejected catalog-featured models — Grok 4.5, SWE-1.7 Lightning, and the GLM `-max-1m`/`-none`/`-none-1m` variants — even though the docs feature them and live `devin models list` confirms them, and a dispatch omitting a model still got the `adaptive` router the catalog dropped. The change makes the runtime dispatch surface a superset of the curated catalog and matches the omitted-model default to the catalog's `swe`. The spec records its status as Complete with both vitest suites passing.
