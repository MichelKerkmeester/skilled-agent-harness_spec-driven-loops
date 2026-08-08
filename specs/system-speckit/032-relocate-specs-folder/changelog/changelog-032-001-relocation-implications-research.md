---
title: "Changelog: Relocation Implications Research [032/001]"
description: "Chronological changelog for the specs-root relocation go/no-go research phase."
trigger_phrases:
  - "phase changelog"
  - "relocation implications research"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-06

> Spec folder: `specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research` (Level 1)
> Parent packet: `specs/system-speckit/032-relocate-specs-folder`

### Summary

Answered whether the canonical spec-kit tree could move from `.opencode/specs/` to a top-level `specs/` directory. Four independent research lineages across two rounds (`glm`/`grok` round 1, `sol`/`luna` round 2 after the operator asked for more depth) converged on **CONDITIONAL-GO**. Round 2's decisive finding, missed by round 1: the repo already had a substantial migration-safety subsystem (`spec-root-registry.ts`, `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`, a 15-test validation matrix) built for the opposite migration direction — inverting and reusing it was safer than hand-patching literals from scratch.

### Added

- `research/research.md` — the packet-level synthesis reconciling all four lineages, with a combined ranked implication list and an explicit recommendation.
- Per-lineage state under `research/lineages/glm/` and `research/lineages/grok/` (config, JSONL deltas, iteration markdown, per-lineage research.md).

### Findings

- The recommended shape: a **flip**, real tree at `specs/` with `.opencode/specs -> ../specs` as a back-symlink — neutralizes 99.6% of in-repo references at zero repointing cost.
- No runtime mirror (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) needed its own `specs` symlink; none carried one before the flip either.
- An internal Memory MCP inconsistency surfaced only from cross-reading multiple lineages' citations: the indexer was dual-root-aware, the discovery/identity layer was canonical-locked to one root.

### Notes

The `glm` lineage's first attempt failed on an org-policy restriction on autonomous mode; reproduced the real error directly against the CLI, then retried only after explicit operator approval for the elevated permission mode. Round 2's `sol` lineage was flagged by the orchestrator for an incidental write-containment violation (`.pi/modes.json`, cleanly reverted, zero residue) — investigated and confirmed benign before its findings were used.
