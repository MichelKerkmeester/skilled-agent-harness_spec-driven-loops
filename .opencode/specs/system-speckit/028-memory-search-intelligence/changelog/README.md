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

Spec 028 (memory-search-intelligence) turned a long external memory-system research campaign into shipped retrieval intelligence across four subsystems plus a release-readiness track. A sixth track, 003-spec-data-quality, began as a research scaffold and then shipped. It holds forty phase changelogs spanning the tiered go or no-go research, the generated-metadata build, the full-repo JSON migration and the flag-graduation benchmark that kept twelve flags and deleted one. A seventh track, 004-review-remediation, holds the six-child remediation of the epic deep review. An eighth track, 005-dark-flag-graduation, holds the twelve-child dark-flag graduation program that benchmarked eight default-off flag families on the production path and returned four graduates, three cuts and one refine, then cleaned up flag names, validated byte-identity and closed a follow-up deep review. A further program, 016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory (nested under `001-speckit-memory/031`), holds the deep-dive remediation work, thirteen phases that fixed the mk-spec-memory P0 through P2 findings and shipped end to end. The spec tree also grew sub-packets 008 through 015 between the dark-flag work and that program; on 2026-07-04 the data-quality ones (008 through 012) were re-nested under `003-spec-data-quality` as phases 045 through 049, and 013 through 015 were subsequently re-nested under their subject parents as well. Those carry their own spec-folder docs rather than changelog tracks here. The changelog mirrors the spec tree: one directory per track, flat per track, with phase changelogs named `changelog-<track>-<leaf>-<short-name>.md` and one per-track rollup named `changelog-<track>-root.md`. The packet root rollup is [changelog-028-root.md](./changelog-028-root.md) in this directory. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md). The flat Wave-0 done-evidence is recorded separately under the Wave-0 implementation record.

## Tracks

Current 028 top-level tracks with shipped changelog rollups (contiguous 000-006; track 002 skill-advisor is in-progress with no shipped rollup yet — see the note below):

| Track | Leaf changelogs | Top rollup |
|-------|-----------------|------------|
| 000 release cleanup | 12 | [changelog-000-root.md](./000-release-cleanup/changelog-000-root.md) |
| 001 speckit memory | 28 | [changelog-001-root.md](./001-speckit-memory/changelog-001-root.md) |
| 003 spec data quality | 40 | [changelog-003-root.md](./003-spec-data-quality/changelog-003-root.md) |
| 004 review remediation | 6 | [changelog-004-root.md](./004-review-remediation/changelog-004-root.md) |
| 005 dark flag graduation | 12 | [changelog-005-root.md](./005-dark-flag-graduation/changelog-005-root.md) |
| 006 speckit surface alignment | 1 | [changelog-006-speckit-surface-alignment.md](./changelog-006-speckit-surface-alignment.md) |

Track 002 skill advisor holds only the in-progress `001-hard-rule-and-dispatch-preflight-hardening` and has no shipped changelog track yet. The 016 deep-dive remediation program (13 phases) shipped nested under `001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`; its rollup is [changelog-016-root.md](./016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/changelog-016-root.md).

Extracted to sibling packets on 2026-07-06 (their changelogs moved with them):

| Former 028 track | Leaf changelogs | Top rollup |
|------------------|-----------------|------------|
| code graph → system-code-graph | 8 | [changelog-002-root.md](../../../system-code-graph/changelog/001-code-graph-core/changelog-002-root.md) |
| skill-advisor runtime → system-skill-advisor | 7 | [changelog-003-root.md](../../../system-skill-advisor/changelog/002-skill-advisor-runtime/changelog-003-root.md) |
| deep loop → system-deep-loop | 6 | [changelog-004-root.md](../../../system-deep-loop/changelog/038-deep-loop-runtime/changelog-004-root.md) |

## How to read these

Each track's top rollup is its phase parent's Included Phases table, listing every child phase with its status and a one-line summary. Each leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed and Follow-Ups. The data-quality track carries the most phases at forty and the memory track is next at twenty-eight, because the campaign weighted the Memory MCP heaviest and the data-quality lineage then grew a shipped build. The release-cleanup track carries nine executed documentation-surface cleanups plus three later validation phases, the coverage audit, the daemon-skills playbook validation and the playbook-findings remediation. The 003-spec-data-quality track began research only. Its first twenty-eight phases are the scaffolded go or no-go program an official multi-lineage deep-research produced, and its phases 029 through 040 are the shipped generated-JSON quality build, the full-repo migration and the flag-graduation benchmark that kept twelve flags and deleted one. A phase whose leaf Summary reads as planning-only may have been superseded by a later build commit, so the Added, Changed and Fixed evidence rows and the per-track rollup are the authoritative shipped state. The memory track's two closing leaves record cross-cutting milestones rather than single phase builds. `changelog-001-022-keep-off-flag-reinvestigation.md` is the keep-off flag-resolution reckoning that kept 5 default-on, deleted 10 along with their code and validated the disposition across three deep-review rounds after the build program closed, with the full per-flag method in `001-speckit-memory/022-kept-off-flag-resolution/`. `changelog-001-023-new-feature-research-build.md` is the TRACK B new-feature arc that followed it, where the deleted-10 teachings drove research that found 4 candidates, eval-v2 was built and kept as the measurability gate and 3 features were built default-off and fresh-Opus held, with the full method in `001-speckit-memory/023-new-feature-research-build/`.

## Conventions

- File names use the pattern `changelog-<track>-<leaf>-<short-name>.md`. Per-track rollups use the `-root.md` suffix and the packet rollup is `changelog-028-root.md`. Numbers reflect each track's spec-tree position. The current top-level tracks are the contiguous 000 through 006, joined by the later 016 deep-dive remediation program nested under `001-speckit-memory/031`. The earlier 008 through 012 sub-packets were re-nested under `003-spec-data-quality` as phases 045 through 049 on 2026-07-04, and 013 through 015 were re-nested under their subject parents.
- One changelog per shipped phase. Multi-candidate phases collapse their candidates into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- PENDING and gated phases are shown as planned with their gate named, never disguised as shipped.
- The directory layout mirrors `027-xce-research-based-refinement/changelog/` (flat per track, one rollup per track).
