---
title: "Changelog: Executor Wiring & Fan-out Parity [007-executor-and-cli-hardening/002-executor-wiring-and-parity]"
description: "Group the deep-loop CLI fan-out executor work: wiring individual executor kinds and proving every cli/provider/model combination is reachable end-to-end."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity` (Level 2)

### Summary

This phase parent groups the executor-focused deep-loop fan-out work under one root, all touching the shared runtime surface (`executor-config.ts`, the `fanout-run.cjs` lineage builders, and the per-mode executor availability tables). Its handoff criterion is that every executor kind the deep-loop fan-out advertises dispatches through the real fan-out for the providers and models it claims, or is explicitly and enforceably scoped out. Each child owns its own plan, tasks, checklist, and continuity; this parent tracks only the shared purpose and the phase manifest.

### Included Phases

| Phase | Summary |
|---|---|
| `001-cli-codex-read-only-audit-leaf` | Run the `cli-codex` deep-alignment leaf under `--sandbox read-only` and move iteration-artifact writing to the dispatch wrapper, so the leaf can never reach for `apply_patch`. |
| `002-cli-devin-executor-wiring` | Add `cli-devin` as a wired deep-loop executor kind with an enforced model allowlist and a live-verified flag mapping. |
| `003-cli-executor-fanout-parity` | The six-phase parity program (own phase parent): audit the full executor/provider/model matrix, wire the gaps, and prove every combination dispatches through the fan-out. |
| `004-devin-fanout-allowlist-parity` | Bring the runtime `cli-devin` allowlist and default model into parity with the curated catalog. |
| `005-devin-allowlist-prune-and-deepseek` | Prune curated-out `cli-devin` aliases, add the missing DeepSeek ids, and add a CJS-mirror parity guard. |
