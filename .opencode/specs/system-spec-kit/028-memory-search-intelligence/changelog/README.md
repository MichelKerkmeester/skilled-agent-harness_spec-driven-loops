---
title: "Spec 028 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 028 (memory-search-intelligence), organized under the five subsystem and release-readiness tracks, a data-quality track that shipped its later phases and a review-remediation track. Each track links to its top rollup."
trigger_phrases:
  - "028 changelog index"
  - "028 changelog history"
  - "memory search intelligence changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 028 Changelog Index

Spec 028 (memory-search-intelligence) turned a long external memory-system research campaign into shipped retrieval intelligence across four subsystems plus a release-readiness track. A sixth track, 005-spec-data-quality, began as a research scaffold and then shipped. It holds forty phase changelogs spanning the tiered go or no-go research, the generated-metadata build, the full-repo JSON migration and the flag-graduation benchmark that kept twelve flags and deleted one. A seventh track, 006-review-remediation, holds the six-child remediation of the epic deep review. An eighth track, 007-dark-flag-graduation, holds the twelve-child dark-flag graduation program that benchmarked eight default-off flag families on the production path and returned four graduates, three cuts and one refine, then cleaned up flag names, validated byte-identity and closed a follow-up deep review. The changelog mirrors the spec tree: one directory per track, flat per track, with phase changelogs named `changelog-<track>-<leaf>-<short-name>.md` and one per-track rollup named `changelog-<track>-root.md`. The packet root rollup is [changelog-028-root.md](./changelog-028-root.md) in this directory. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md). The flat Wave-0 done-evidence is recorded separately under the Wave-0 implementation record.

## Tracks

| Track | Leaf changelogs | Top rollup |
|-------|-----------------|------------|
| 000 release cleanup | 12 | [changelog-000-root.md](./000-release-cleanup/changelog-000-root.md) |
| 001 speckit memory | 28 | [changelog-001-root.md](./001-speckit-memory/changelog-001-root.md) |
| 002 code graph | 8 | [changelog-002-root.md](./002-code-graph/changelog-002-root.md) |
| 003 skill advisor | 7 | [changelog-003-root.md](./003-skill-advisor/changelog-003-root.md) |
| 004 deep loop | 6 | [changelog-004-root.md](./004-deep-loop/changelog-004-root.md) |
| 005 spec data quality | 40 | [changelog-005-root.md](./005-spec-data-quality/changelog-005-root.md) |
| 006 review remediation | 6 | [changelog-006-root.md](./006-review-remediation/changelog-006-root.md) |
| 007 dark flag graduation | 12 | [changelog-007-root.md](./007-dark-flag-graduation/changelog-007-root.md) |

## How to read these

Each track's top rollup is its phase parent's Included Phases table, listing every child phase with its status and a one-line summary. Each leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed and Follow-Ups. The data-quality track carries the most phases at forty and the memory track is next at twenty-eight, because the campaign weighted the Memory MCP heaviest and the data-quality lineage then grew a shipped build. The release-cleanup track carries nine executed documentation-surface cleanups plus three later validation phases, the coverage audit, the daemon-skills playbook validation and the playbook-findings remediation. The 005-spec-data-quality track began research only. Its first twenty-eight phases are the scaffolded go or no-go program an official multi-lineage deep-research produced, and its phases 029 through 040 are the shipped generated-JSON quality build, the full-repo migration and the flag-graduation benchmark that kept twelve flags and deleted one. A phase whose leaf Summary reads as planning-only may have been superseded by a later build commit, so the Added, Changed and Fixed evidence rows and the per-track rollup are the authoritative shipped state. The memory track's two closing leaves record cross-cutting milestones rather than single phase builds. `changelog-001-022-keep-off-flag-reinvestigation.md` is the keep-off flag-resolution reckoning that kept 5 default-on, deleted 10 along with their code and validated the disposition across three deep-review rounds after the build program closed, with the full per-flag method in `007-kept-off-flag-resolution/`. `changelog-001-023-new-feature-research-build.md` is the TRACK B new-feature arc that followed it, where the deleted-10 teachings drove research that found 4 candidates, eval-v2 was built and kept as the measurability gate and 3 features were built default-off and fresh-Opus held, with the full method in `008-new-feature-research-build/`.

## Conventions

- File names use the pattern `changelog-<track>-<leaf>-<short-name>.md`. Per-track rollups use the `-root.md` suffix and the packet rollup is `changelog-028-root.md`. Numbers reflect the current eight-track spec-tree position.
- One changelog per shipped phase. Multi-candidate phases collapse their candidates into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- PENDING and gated phases are shown as planned with their gate named, never disguised as shipped.
- The directory layout mirrors `027-xce-research-based-refinement/changelog/` (flat per track, one rollup per track).
