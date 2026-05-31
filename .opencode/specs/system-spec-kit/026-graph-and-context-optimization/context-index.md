---
title: "Context Index [system-spec-kit/026-graph-and-context-optimization/context-index]"
description: "Migration bridge for the 026 phase parent: maps every historical phase identity to its current home across all reorganization waves."
trigger_phrases:
  - "026 context index"
  - "026 phase migration bridge"
  - "026 phase renumbering"
  - "where did 026 phase go"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored wave-6 bridge: folded 8 sibling packets (029-036) into existing tracks"
    next_safe_action: "Resolve old phase paths via this bridge"
    blockers: []
    key_files:
      - "context-index.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

This file is the navigation bridge for the 026 phase parent. The packet has been reorganized
across several waves; old phase identities still appear in historical evidence (research
iterations, changelogs, memory rows, other packets). Use the tables below to resolve any old
phase label or path to its current home. The root `spec.md` intentionally carries no migration
history — all of it lives here.
<!-- /ANCHOR:when-to-use -->

---

## Latest — Wave 6 (2026-05-31): 8 sibling packets folded in (029–036)

Eight top-level `system-spec-kit/` sibling packets were renested into their best-fit existing
tracks (in-store `git mv`; each keeps its internal child numbering). The two `032-*` ids no longer
collide — they landed in different tracks. Historical references to the old top-level paths
(deep-review / deep-research iteration logs, changelogs in other packets, the global
`descriptions.json` excepted) are NOT rewritten; resolve them via the bridge below.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `029-embedding-consolidation-hf-local-server` | `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/` | active | Renumbered 029→010; predecessor of 031 |
| `031-embedding-stack-hardening` | `003-memory-and-causal-runtime/011-embedding-stack-hardening/` | active | Renumbered 031→011; carries its `review/` deep-review tree |
| `032-infra-memory-db-and-graph-churn` | `007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/` | active | Renumbered 032→014; daemon-lifecycle / memory-DB |
| `036-infra-followup-hardening` | `007-mcp-daemon-reliability/015-infra-followup-hardening/` | active | Renumbered 036→015; continues 032 + 035 follow-ups |
| `032-validate-recursive-orchestrator-fix` | `002-spec-kit-internals/005-validate-recursive-orchestrator-fix/` | active | Renumbered 032→005; resolves the duplicate `032` id |
| `033-orchestrator-placeholder-parity` | `002-spec-kit-internals/006-orchestrator-placeholder-parity/` | active | Renumbered 033→006; validator/shell parity |
| `034-runtime-agnostic-session-lifecycle-scripts` | `006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts/` | active | Renumbered 034→004 |
| `035-worktree-per-session-automation` | `006-operator-tooling/005-worktree-per-session-automation/` | active | Renumbered 035→005 |

Folder numbers remain topical identity; `timeline.md` is the separate recency view.

---

## Wave 5 (2026-05-29): 8th track adopted + chronology surfaced

No phase folders moved in this wave. Two changes only:

1. **`007-mcp-daemon-reliability/` adopted as the 8th top-level track.** It was created 2026-05-28
   (MCP daemon lifecycle reliability: IPC socket canonicalization, WAL checkpoint-on-close, graceful
   shutdown + watchdog, provider dispose, at-rest durability) but had been absent from the parent
   `spec.md` Phase Documentation Map. The map and `graph-metadata.json` now list eight tracks (`000`–`007`).
2. **Chronological recency surfaced.** Added `timeline.md` (every spec folder, newest→oldest by git
   activity) and reconciled `graph-metadata.json` `derived.status` + `derived.last_active_child_id`
   pointers (root → `004-code-graph`, the most recently active track). The daemon had previously left
   these as `status: "planned"` / `last_active_child_id: null` across all tracks.

Folder numbers remain topical identity; `timeline.md` is the separate recency view.

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge — Wave 4 (2026-05-26): 17 top-level phases → 7 themed parents

Wave 4's active surface was seven themed phase parents (`000`–`006`); an eighth track
(`007-mcp-daemon-reliability`) was added later — see "Latest — Wave 5" above. The table below maps
each pre-wave-4 top-level phase to its current home.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `000-release-cleanup` | `000-release-and-program-cleanup/` | active | Renamed; gained 2 children from the dissolved external-adoption track |
| `001-research-and-baseline` | `001-research-and-baseline/` | active | Unchanged |
| `002-resource-map-deep-loop-fix` | `002-spec-kit-internals/001-resource-map-deep-loop-fix/` | active | Nested under spec-kit-internals |
| `003-continuity-memory-runtime` | `003-memory-and-causal-runtime/001-continuity-memory-runtime/` | active | Nested under memory-and-causal-runtime |
| `004-external-project-adoption` | dissolved → `005-graph-impact-and-affordance/` + `000-.../007,008`; shell at `z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved/` | replaced | 8 children split by theme (see sub-table) |
| `005-code-graph` | `004-code-graph/` | active | Renamed; 22 children regrouped (see sub-table) |
| `006-skill-advisor` | `002-spec-kit-internals/002-skill-advisor/` | active | Nested |
| `007-hook-parity` | `006-operator-tooling/001-hook-parity/` | active | Nested |
| `008-template-levels` | `002-spec-kit-internals/003-template-levels/` | active | Nested |
| `009-causal-graph-channel-routing` | `003-memory-and-causal-runtime/002-causal-graph-channel-routing/` | active | Nested |
| `010-doctor-update-orchestrator` | `006-operator-tooling/002-doctor-update-orchestrator/` | active | Nested |
| `011-mcp-shared-dependency-startup-fix` | `004-code-graph/001-mcp-shared-dependency-startup-fix/` | active | Nested (leaf) |
| `012-literal-spec-folder-names` | `002-spec-kit-internals/004-literal-spec-folder-names/` | active | Deferred (0%) — stays in place |
| `013-embedder-testing-and-architecture` | `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/` | active | Nested |
| `014-deprecate-coco-index` | `004-code-graph/002-deprecate-coco-index/` | active | Nested |
| `015-install-scripts-doctor-realignment` | `006-operator-tooling/003-install-scripts-doctor-realignment/` | active | Deferred (0%) — stays in place |
| `016-code-graph-workspace-root-fix` | `004-code-graph/003-code-graph-workspace-root-fix/` | active | Nested (leaf) |

### Sub-bridge — former `005-code-graph/` 22 children → `004-code-graph/` sub-wrappers

| Original (under 005-code-graph) | New Home (under 004-code-graph) |
|----------------|----------|
| `001-code-graph-runtime-upgrades` | `004-runtime-and-scan/001-code-graph-runtime-upgrades` |
| `002-fix-stale-highlights-and-scan-scope` | `004-runtime-and-scan/002-fix-stale-highlights-and-scan-scope` |
| `003-resolver-and-hook-improvements` | `004-runtime-and-scan/003-resolver-and-hook-improvements` |
| `008-end-user-scope-default-and-opt-in` | `004-runtime-and-scan/004-end-user-scope-default-and-opt-in` |
| `010-broader-excludes-and-granular-skills` | `004-runtime-and-scan/005-broader-excludes-and-granular-skills` |
| `004-research-and-fix-code-graph-advisor-refinement` | `005-resilience-and-advisor/001-code-graph-advisor-refinement` |
| `006-code-graph-resilience-research` | `005-resilience-and-advisor/002-code-graph-resilience-research` |
| `007-code-graph-backend-resilience-implementation` | `005-resilience-and-advisor/003-code-graph-backend-resilience-implementation` |
| `009-fix-iteration-quality-meta-research` | `005-resilience-and-advisor/004-iteration-quality-meta-research` |
| `012-doctor-apply-mode-implementation` | `005-resilience-and-advisor/005-doctor-apply-mode-implementation` |
| `013-system-code-graph-extraction` | `006-extraction-and-isolation/001-system-code-graph-extraction` |
| `014-extraction-design-and-decision-record` | `006-extraction-and-isolation/002-extraction-design-and-decision-record` |
| `015-standalone-mcp-topology-pivot` | `006-extraction-and-isolation/003-standalone-mcp-topology-pivot` |
| `018-three-way-isolation-finalize` | `006-extraction-and-isolation/004-three-way-isolation-finalize` |
| `005-doctor-diagnostic-command-phase-a` | `007-docs-and-readmes/001-doctor-diagnostic-command-phase-a` |
| `016-system-code-graph-readmes-update` | `007-docs-and-readmes/002-system-code-graph-readmes-update` |
| `017-code-folder-readmes-poc` | `007-docs-and-readmes/003-code-folder-readmes-poc` |
| `020-doc-drift-alignment` | `007-docs-and-readmes/004-doc-drift-alignment` |
| `021-cross-skill-doc-polish` | `007-docs-and-readmes/005-cross-skill-doc-polish` |
| `022-reference-template-alignment` | `007-docs-and-readmes/006-reference-template-alignment` |
| `011-real-world-usefulness-test-planning` | `008-real-world-usefulness-test-planning` (kept as direct child) |
| `019-system-code-graph-uplift-phase-parent` | `009-system-code-graph-uplift-phase-parent` (kept as direct child) |

### Sub-bridge — former `004-external-project-adoption/` 8 children → split by theme

| Original (under 004-external-project-adoption) | New Home | Status |
|----------------|----------|--------|
| `001-clean-room-license-audit` | `000-release-and-program-cleanup/007-clean-room-license-audit` | deferred |
| `006-docs-and-catalogs-rollup` | `000-release-and-program-cleanup/008-docs-and-catalogs-rollup` | deferred |
| `002-code-graph-phase-runner-and-detect-changes` | `005-graph-impact-and-affordance/001-code-graph-phase-runner` | deferred |
| `003-code-graph-edge-explanation-and-impact-uplift` | `005-graph-impact-and-affordance/002-edge-explanation-impact-uplift` | deferred |
| `004-skill-advisor-affordance-evidence` | `005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence` | deferred |
| `005-memory-causal-trust-display` | `005-graph-impact-and-affordance/004-memory-causal-trust-display` | deferred |
| `007-fix-external-project-adoption-deep-review-findings` | `005-graph-impact-and-affordance/005-deep-review-findings` | abandoned |
| `008-deep-research-review` | `005-graph-impact-and-affordance/006-deep-research-review` | abandoned |
<!-- /ANCHOR:migration-bridge -->

---

## Prior Waves (pre-2026-05-26) — archived

Earlier reorganization waves are preserved under `z_archive/`. Resolve very old phase labels there:

| Wave | When | Outcome | Archive Location |
|------|------|---------|------------------|
| First consolidation | 2026-04-21 | 29 chronological phases → 9 thematic wrappers (originals kept as children) | child packets + `z_archive/wave-2-merges/` |
| Second topical pass | 2026-04-25 | advisor + hook-package work redistributed across wrappers | `z_archive/wave-2-merges/` |
| Post-push adjustment | 2026-04-25 | hook-parity wrapper renumbered; post-hoc causal-graph doc packet removed | `z_archive/wave-2-merges/` |
| Stress-findings carve-out | 2026-04-27 | v1.0.1 MCP-runtime stress→research→remediation cycle separated | child packets |
| Restructure waves 1–3 | 2026-05-16 | 000 recatalog (59→6 sub-phases), 008 sub-phasing, shallow/medium + deep archives | `z_archive/wave-2-shallow-medium/`, `z_archive/wave-3-deep-archives/` |
| Wave 4 (this index) | 2026-05-26 | 17 top-level → 7 themed parents; clean renumber; defer-in-place | this file + `z_archive/wave-4-2026-05-26-reorg/` |

The wave-4 mechanics (move contract, ref classification, baselines) are recorded in
`017-phase-reorg-and-renumber/` (archived to `z_archive/wave-4-2026-05-26-reorg/` at close).

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Rows are scoped to phase-folder movement or identity changes only.
- `New Home` paths are relative to the 026 packet root.
- Detailed rationale lives in child `decision-record.md` / `implementation-summary.md`, not here.
- Keep this file as a navigation bridge; do not grow it into a second parent plan.
<!-- /ANCHOR:author-instructions -->
