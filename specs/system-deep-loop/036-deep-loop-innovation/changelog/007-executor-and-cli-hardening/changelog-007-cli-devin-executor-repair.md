---
title: "Changelog: cli-devin Executor Repair [007-executor-and-cli-hardening/007-cli-devin-executor-repair]"
description: "Repair the cli-devin deep-loop executor adapter so cli-devin lineages run again on the current installed devin CLI."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair` (Level 1)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening`

### Summary

This phase repairs the cli-devin deep-loop executor adapter so cli-devin lineages run again on the installed devin CLI. The primary defect: installed `devin 3000.4.16` added a non-interactive workspace-trust gate that refuses to run in any untrusted directory, so every fresh fan-out lineage died before work started because `buildDevinLineageCommand` never passed the documented `--respect-workspace-trust false` mitigation. The secondary defect: the adapter's default and allowed/supported model lists drifted off devin's live catalog. The fix passes the mitigation flag unconditionally and reconciles the model lists, backed by a hermetic unit test and a live red-before/green-after reproduction. The spec records the fix as landed and verified in commit `dfdd41f531`, with the packet reconciled to Complete.
