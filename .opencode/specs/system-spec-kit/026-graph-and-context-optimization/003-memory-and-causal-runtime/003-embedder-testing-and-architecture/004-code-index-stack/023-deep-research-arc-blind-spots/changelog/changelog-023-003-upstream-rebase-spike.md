---
title: "023F Upstream cocoindex-code Rebase Spike"
description: "Scoped upstream rebase spike for the local cocoindex-code fork: pinned sentence-transformers to 5.4.1, imported Svelte/Vue default include patterns from upstream v0.2.32. Produced a phased rebase plan with cross-packet handoff for 023A1 through 023B."
trigger_phrases:
  - "023F upstream rebase spike"
  - "cocoindex upstream drift"
  - "svelte vue include patterns"
  - "sentence-transformers pin"
  - "upstream cocoindex delta classification"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

The local `cocoindex-code` fork was approximately 30 releases behind upstream `v0.2.33`. Upstream shipped embedder parameter APIs (`indexing_params/query_params`) in `v0.2.29`, deliberately removed the per-side `dimensions` knob in `v0.2.30`. Svelte/Vue default include patterns arrived in `v0.2.32`. Without a concrete delta map, downstream 023A packets risked duplicating upstream API work or hardening incompatible abstractions.

023F turned the vague upstream drift warning into a concrete, phased rebase map. Two scoped wins landed in this packet: the optional embedding stack is now pinned to `sentence-transformers==5.4.1` (the active bench environment version). The default include pattern list now covers `**/*.svelte` and `**/*.vue`. A new regression test locks those patterns. Five research documents give 023A1 through 023B their upstream-aware starting points without performing a full module rebase.

### Added

- `**/*.svelte` and `**/*.vue` entries in `DEFAULT_INCLUDED_PATTERNS` in `settings.py`, matching upstream `cocoindex-code v0.2.32`
- `test_settings_patterns.py` regression test covering the new Svelte and Vue default patterns
- `research/upstream-sweep.md` enumerating every `cocoindex-code` release after `v0.2.3` with dates and notes
- `research/delta-classification.md` classifying each local/upstream file as `PRESERVE_LOCAL`, `MERGE_UPSTREAM`, `CONFLICT_RESOLVE` or `OBSOLETE_LOCAL`
- `research/rebase-plan.md` defining Phase A, B, C rebase work with surfaces, tests, risks, rollback notes
- `research/cross-packet-impact.md` mapping upstream findings to binding directives for 023A1, 023A2, 023A3, 023B

### Changed

- `pyproject.toml` local embedding extra: floating `sentence-transformers` replaced with explicit `sentence-transformers==5.4.1` pin
- `research/dimensions-knob-removal-impact.md` documenting why `dimensions` must remain a model-wide setting and must not be added as a per-side `indexing_params/query_params` key

### Fixed

- Finding `MED 002-C`: `sentence-transformers` was unpinned; active environment used `5.4.1` while latest was `5.5.0`, so runtime behavior could drift silently on a fresh install
- Finding `MED 017-D`: Svelte/Vue files were excluded from default indexing because the local fork never received the upstream language-coverage change from `v0.2.32`

### Verification

| Check | Result |
|-------|--------|
| Targeted pytest (`test_settings_patterns.py tests/test_config.py`) | PASS: 36 passed in 0.58s |
| Full pytest | PASS: 189 passed in 17.38s |
| Ruff | PASS: All checks passed |
| Strict spec validation (`validate.sh --strict`) | PASS: 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | Pin local embedding extra to `sentence-transformers==5.4.1` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modified | Add `**/*.svelte` and `**/*.vue` to `DEFAULT_INCLUDED_PATTERNS` |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_settings_patterns.py` | Created (NEW) | Regression test for Svelte and Vue default include patterns |
| `research/upstream-sweep.md` | Created (NEW) | Release sweep from `v0.2.3` to `v0.2.33` with per-release notes |
| `research/delta-classification.md` | Created (NEW) | File-level classification table for local vs upstream surfaces |
| `research/dimensions-knob-removal-impact.md` | Created (NEW) | Impact analysis for the upstream dimensions-knob removal |
| `research/rebase-plan.md` | Created (NEW) | Phased rebase plan (Phase A through C) with risk and rollback |
| `research/cross-packet-impact.md` | Created (NEW) | Binding handoff directives for 023A1, 023A2, 023A3, 023B |

### Follow-Ups

- Perform the `cocoindex[litellm]` SDK migration from `1.0.0a33` to `>=1.0.6,<1.1.0` in a dedicated Phase A compatibility packet before 023A1 starts.
- Import upstream `embedder_params.py` and `embedder_defaults.py` into the local fork in Phase B before any custom prompt-policy surface work lands in 023A1.
- Commit the three source-file changes (`pyproject.toml`, `settings.py`, `test_settings_patterns.py`) once the git metadata sandbox restriction is lifted.
- Verify that any future per-side embedder parameter work in 023A1 routes through the upstream `indexing_params/query_params` API rather than introducing a parallel prompt-policy schema.
