---
title: "Spec 032 Changelog Index"
description: "Packet-level index of the five phase changelogs for spec 032 (relocate-specs-folder) — the specs-root topology relocation."
trigger_phrases:
  - "032 changelog index"
  - "relocate specs folder changelog"
  - "specs root migration changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 032 Changelog Index

Spec 032 moved the canonical spec-kit tree from `.opencode/specs/` to a top-level `specs/` directory, with `.opencode/specs` left as a relative symlink for backward compatibility. Single track, five phases, flat — one changelog per phase, named `changelog-032-<phase>-<slug>.md`.

## Phases

| Phase | Changelog | Summary |
|-------|-----------|---------|
| 001 relocation-implications-research | [changelog-032-001-relocation-implications-research.md](./changelog-032-001-relocation-implications-research.md) | Go/no-go research — 4 lineages, CONDITIONAL-GO on a back-symlink flip |
| 002 migration-plan | [changelog-032-002-migration-plan.md](./changelog-032-002-migration-plan.md) | Two Accepted ADRs — reuse existing primitives, atomic flip + `.gitignore` rebase in one commit |
| 003 migration-execution | [changelog-032-003-migration-execution.md](./changelog-032-003-migration-execution.md) | The atomic flip itself — 49,891 renames, one commit, 11-step runbook |
| 004 code-graph-index-flag-deprecation | [changelog-032-004-code-graph-index-flag-deprecation.md](./changelog-032-004-code-graph-index-flag-deprecation.md) | Self-contained cleanup discovered mid-flight — dead maintainer-mode flag mechanism removed |
| 005 readme-migration-audit | [changelog-032-005-readme-migration-audit.md](./changelog-032-005-readme-migration-audit.md) | Post-flip doc-drift audit, an independent review, and a 3-way fix swarm — 32 findings total, all fixed |

## How to read these

Each phase changelog follows the canonical template: Summary, Added/Changed/Removed/Fixed, Verification, Notes. Phase 005's is the longest — it covers three passes (the original review, an independent second-opinion review, and self-caught gaps in that review's own fix pass) rather than one linear build.

## Whole-packet context

For the full before/after picture across all five phases (not phase-by-phase), see [../relocation-before-after.md](../relocation-before-after.md). For phase 005's finding-level before/after specifically, see [../005-readme-migration-audit/before-after.md](../005-readme-migration-audit/before-after.md).

## Conventions

- File names: `changelog-032-<phase>-<slug>.md`, matching the parent packet number plus the phase folder name, per every phase's own `spec.md` "Changelog" note.
- One changelog per phase. Voice rules: no em-dashes, no semicolons in narrative, no Oxford commas.
- The directory layout is proportionate to this packet's size (single track, 5 phases) — see `026-graph-and-context-optimization/changelog/` or `027-xce-research-based-refinement/changelog/` for the multi-track version of this same convention at larger scale.
