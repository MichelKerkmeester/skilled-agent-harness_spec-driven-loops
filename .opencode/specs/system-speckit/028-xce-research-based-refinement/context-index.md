---
title: "Context Index [system-spec-kit/027-xce-research-based-refinement/context-index]"
description: "Migration bridge for the 027 phase parent: maps every historical phase identity to its current home across all reorganization waves, newest first."
trigger_phrases:
  - "027 context index"
  - "027 phase migration bridge"
  - "027 phase renumbering"
  - "where did 027 phase go"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Rebuilt context-index to the 026 gold-standard wave-bridge format"
    next_safe_action: "Resolve any old phase path via the wave tables below"
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

This file is the navigation bridge for the 027 phase parent. The packet has been reorganized
across several waves; old phase identities still appear in historical evidence (research
iterations, changelogs, memory rows, review lineages, other packets). Use the tables below to
resolve any old phase label, path, or relocated root doc to its current home. Waves are ordered
newest first. The root `spec.md` intentionally carries no migration history — all of it lives
here. Folder numbers are topical identity; `timeline.md` is the separate newest→oldest recency view.

> **Authoritative mapping:** the **2026-06-14 six-track grouping** (the Migration Bridge wave
> below) is the authoritative old-number → current-path map for the thirty prior top-level phases.
> The "Prior Waves" sections beneath it predate that grouping; where they name a
> `027-…/0NN-` child, that child was regrouped again by the 2026-06-14 wave — resolve such paths
> through the Migration Bridge table first.
<!-- /ANCHOR:when-to-use -->

---

## Latest — Wave (2026-06-20b): merged search-and-output-intelligence research + implementation

Per operator request, the separate research and implementation phases for search-and-output
intelligence were combined into one phase — research and implementation should not live as separate
sibling phases. They merged into `002-memory-store-and-search/016-search-and-output-intelligence`:
the implementation phases stay as its numbered children (`001`–`007`) and the deep-research moved
into its `research/` subfolder. The 002 track's later children renumbered down by one to stay
contiguous (20 children total). History preserved via `git mv`.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `002-memory-store-and-search/016-search-and-output-intelligence-research` | `002-memory-store-and-search/016-search-and-output-intelligence/research/` | active | Research folded into the unified phase's `research/` subdir |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation` | `002-memory-store-and-search/016-search-and-output-intelligence` | active | Became the unified phase; implementation kept as children `001`–`007` |
| `002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation` | `002-memory-store-and-search/017-reindex-scan-responsiveness-and-cancellation` | active | Renumbered 018→017 |
| `002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection` | `002-memory-store-and-search/018-maintenance-grace-daemon-survives-reelection` | active | Renumbered 019→018 |
| `002-memory-store-and-search/020-maintenance-grace-background-embedding` | `002-memory-store-and-search/019-maintenance-grace-background-embedding` | active | Renumbered 020→019 |
| `002-memory-store-and-search/021-cooperative-heavy-phases` | `002-memory-store-and-search/020-cooperative-heavy-phases` | active | Renumbered 021→020 |

Folder numbers remain topical identity; `timeline.md` is the separate recency view.

---

## Wave (2026-06-20a): root optimized for historic context retrieval

The 027 root was brought to the 026 gold-standard "lean root" shape to optimize historic context
retrieval. **This root-optimization pass moved no phase folders** — an exhaustive per-track audit
found the six-track grouping already optimal (every track is thematically clean and every child is
a substantial shipped phase or a legitimate nested parent); the later 2026-06-20b wave above then
merged the one research+implementation pair on operator request. The changes here were doc-surface and
metadata only: the root doc set was trimmed to the lean nav layer, this context-index was rebuilt
to the gold-standard wave format, the root `graph-metadata.json` was de-polluted (key_files/entities/
source_docs collapsed to `spec.md`; the stale `last_active_child_id` advanced to the genuinely
active track), per-track phase maps were reconciled to their real children, and status vocabulary
was normalized. The relocated/removed root docs:

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `resource-map.md` (root) | (removed) | replaced | Frozen 0%-completion snapshot and the source of the graph `key_files` pollution; live inventory lives in `spec.md` + `graph-metadata.json` |
| `handover.md` (root) | (removed) | replaced | Stale epic-continuation lane narrative (its own banner marked it historical); live next-step folded into `spec.md` `_memory.continuity` |
| `before-vs-after.md` (root) | `changelog/before-vs-after.md` | active | Epic before/after rollup moved off the lean root; still the program-level narrative, cross-referenced from `spec.md` |
| `external/` (root, vendored sources) | `research/external/` | active | 14MB gitignored vendored repos relocated under their research consumer |

No spec-folder numbering changed in this wave. Folder numbers remain topical identity; `timeline.md`
is the separate recency view.

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge — Wave (2026-06-14): thirty top-level phases → six themed tracks

The thirty prior top-level phases (`001` through `030`) were grouped under six themed parent tracks,
mirroring how `027-graph-and-context-optimization` organizes its work and how
`changelog/before-vs-after.md` narrates the epic by system. `000-release-cleanup` kept its position
and also hosts the regrouping task at `000-release-cleanup/000-spec-tree-consolidation`. Children
were renumbered contiguously within each new parent. Per-phase changelog files keep their original
paths; see `changelog/README.md` for the changelog bridge. This is the authoritative current mapping.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `001-peck-teachings-adoption` | `001-research-and-doctrine/001-peck-teachings-adoption` | active | grouped under research-and-doctrine |
| `006-gem-team-adoption` | `001-research-and-doctrine/002-gem-team-adoption` | active | renumbered 006→002 |
| `002-memory-write-safety` | `002-memory-store-and-search/001-memory-write-safety` | active | renumbered 002→001 |
| `003-memory-index-causal-lifecycle` | `002-memory-store-and-search/002-memory-index-causal-lifecycle` | active | renumbered 003→002 |
| `004-semantic-trigger-fallback` | `002-memory-store-and-search/003-semantic-trigger-fallback` | active | renumbered 004→003 |
| `005-learning-feedback-reducers` | `002-memory-store-and-search/004-learning-feedback-reducers` | active | renumbered 005→004 |
| `007-memclaw-derived-memory-hardening` | `002-memory-store-and-search/005-memclaw-derived-memory-hardening` | active | renumbered 007→005 |
| `008-openltm-retrieval-observability` | `002-memory-store-and-search/006-openltm-retrieval-observability` | active | renumbered 008→006 |
| `009-openltm-continuity-resilience` | `002-memory-store-and-search/007-openltm-continuity-resilience` | active | renumbered 009→007 |
| `013-vector-read-path-resilience` | `002-memory-store-and-search/008-vector-read-path-resilience` | active | renumbered 013→008 |
| `014-packed-bm25-field-weights` | `002-memory-store-and-search/009-packed-bm25-field-weights` | active | renumbered 014→009 |
| `017-bm25-warmup-churn-reduction` | `002-memory-store-and-search/010-bm25-warmup-churn-reduction` | active | renumbered 017→010 |
| `020-vector-resilience-durability` | `002-memory-store-and-search/011-vector-resilience-durability` | active | renumbered 020→011 |
| `021-hybrid-search-scope-then-limit` | `002-memory-store-and-search/012-hybrid-search-scope-then-limit` | active | renumbered 021→012 |
| `022-provenance-injection` | `002-memory-store-and-search/013-provenance-injection` | active | renumbered 022→013 |
| `023-idempotency-flag-on-correctness` | `002-memory-store-and-search/014-idempotency-flag-on-correctness` | active | renumbered 023→014 |
| `012-causal-traversal-bfs` | `003-advisor-and-codegraph/001-causal-traversal-bfs` | active | renumbered 012→001 |
| `018-xce-feature-adoption-advisor-codegraph` | `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph` | active | renumbered 018→002 |
| `019-skill-advisor-cross-session-reconnect` | `003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` | active | renumbered 019→003 |
| `010-mcp-to-cli-tool-transition` | `004-shared-infrastructure/001-mcp-to-cli-tool-transition` | active | renumbered 010→001 |
| `011-command-presentation-workflow-separation` | `004-shared-infrastructure/002-command-presentation-workflow-separation` | active | renumbered 011→002 |
| `015-storage-adapter-ports` | `004-shared-infrastructure/003-storage-adapter-ports` | active | renumbered 015→003 |
| `016-cli-tooling-ux` | `004-shared-infrastructure/004-cli-tooling-ux` | active | renumbered 016→004 |
| `024-autonomous-dependency-patching` | `004-shared-infrastructure/005-autonomous-dependency-patching` | active | renumbered 024→005 |
| `025-code-mode-orphan-lifecycle` | `004-shared-infrastructure/006-code-mode-orphan-lifecycle` | active | renumbered 025→006 |
| `026-ipc-client-cap-hardening` | `004-shared-infrastructure/007-ipc-client-cap-hardening` | active | renumbered 026→007 |
| `027-finding-remediation` | `005-verification-and-remediation/001-finding-remediation` | active | renumbered 027→001 |
| `028-tri-system-deep-research` | `005-verification-and-remediation/002-tri-system-deep-research` | active | renumbered 028→002 |
| `029-deep-research-remediation` | `005-verification-and-remediation/003-deep-research-remediation` | active | renumbered 029→003 |
| `030-residual-design-units` | `005-verification-and-remediation/004-residual-design-units` | active | renumbered 030→004 |

> **Children created after this grouping** (no old→new row needed, born in place under their track):
> `004-shared-infrastructure/008-mcp-config-alignment-reelection-default`, `004-…/009-code-graph-code-only-indexing`,
> `002-memory-store-and-search/015-…` through `021-cooperative-heavy-phases`,
> `003-advisor-and-codegraph/004-skill-advisor-suite-repair`, `003-…/005-advisor-state-spec-folder-leak`,
> `005-verification-and-remediation/005-fresh-regression-remediation`, `005-…/006-deep-review-017-021-remediation`,
> `005-…/007-release-alignment-review`.

Folder numbers remain topical identity; `timeline.md` is the separate recency view.
<!-- /ANCHOR:migration-bridge -->

---

## Prior Waves (pre-2026-06-14) — superseded by the six-track grouping

The waves below predate the 2026-06-14 grouping and are retained for provenance. Where a "New Home"
value names a `027-…/0NN-` child, that child was regrouped again by the Migration Bridge table above
— resolve through that table first.

### Wave (2026-06-11): epic-close infrastructure placement

Two standalone track-root packets were relocated under `028-xce-research-based-refinement/` as
epic-close child phases (025 via history-preserving git mv; 024 was uncommitted and landed directly
at its new path). Track-level registries were repointed and the dangling track children removed.
Both were regrouped again under `004-shared-infrastructure/` by the 2026-06-14 wave.

| Original Phase | New Home (then) | Status | Notes |
|----------------|-----------------|--------|-------|
| `028-autonomous-dependency-patching/` | `027-…/024-autonomous-dependency-patching/` → now `004-shared-infrastructure/005-autonomous-dependency-patching` | active | npm audit detection + lockfile-only remediation |
| `029-code-mode-orphan-lifecycle/` | `027-…/025-code-mode-orphan-lifecycle/` → now `004-shared-infrastructure/006-code-mode-orphan-lifecycle` | active | mcp-code-mode stdio server exits with its session; PPID-1 orphan reap |

### Wave (2026-06-04): peck teachings placement + first-slot renumber

The planned peck-derived improvements were placed under 027 as a feature phase, then renumbered to
the first active child slot so the memory phases kept a contiguous sequence. All of these were
regrouped again by the 2026-06-14 wave (peck → `001-research-and-doctrine/001-peck-teachings-adoption`).

| Original Phase | New Home (then) | Status | Notes |
|----------------|-----------------|--------|-------|
| `028-peck-teachings-adoption/` | `027-…/008-peck-teachings-adoption/` → `027-…/001-peck-teachings-adoption/` → now `001-research-and-doctrine/001-peck-teachings-adoption` | active | low-risk peck teachings T3/T4/T2; T1 deferred |
| `001-memory-write-safety/` | `002-memory-write-safety/` → now `002-memory-store-and-search/001-memory-write-safety` | active | renumbered then grouped |
| `002-incremental-index-foundation/` | `003-memory-index-causal-lifecycle/001-incremental-index-foundation/` → now under `002-memory-store-and-search/002-…` | active | nested under index/causal lifecycle |
| `003-causal-edge-tombstones/` | `003-memory-index-causal-lifecycle/002-causal-edge-tombstones/` → now under `002-memory-store-and-search/002-…` | active | causal edge tombstone lifecycle |
| `004-metadata-edge-promoter/` | `003-memory-index-causal-lifecycle/003-metadata-edge-promoter/` → now under `002-memory-store-and-search/002-…` | active | deterministic metadata edge promotion |
| `005-write-path-reconciliation/` | `003-memory-index-causal-lifecycle/004-write-path-reconciliation/` → now under `002-memory-store-and-search/002-…` | active | desired/prior statediff reconciliation |
| `006-semantic-trigger-fallback/` | `004-semantic-trigger-fallback/` → now `002-memory-store-and-search/003-semantic-trigger-fallback` | active | hybrid lexical + semantic trigger matching |
| `007-learning-feedback-reducers/` | `005-learning-feedback-reducers/` → now `002-memory-store-and-search/004-learning-feedback-reducers` | active | learning feedback reducers |

### Wave (2026-05-28 onward): MCP-to-CLI workstream placement

`028-mcp-to-cli-tool-transition` was relocated here as child phase `010` (history-preserving git mv);
the dual-stack CLI transition became a 027 workstream. It was regrouped again by the 2026-06-14 wave
to `004-shared-infrastructure/001-mcp-to-cli-tool-transition`.

---

## Archived / historical event records

### 027 → 028 split (2026-05-28) — historical; current homes NOT resolvable here

> **Historical event record (not live guidance).** The sibling packet `028-code-graph-and-cocoindex`
> named below no longer exists at any depth under `.opencode/specs`. The track's current `028` packet
> is `029-memory-search-intelligence` (unrelated to the Code Graph / CocoIndex work). The fate of the
> extracted phases after this split is not recorded here; treat the rows below as a point-in-time
> snapshot, not as resolvable current homes.

On 2026-05-28, the Code Graph phases formerly in disk folders `007`-`010` and the CocoIndex phases
formerly in disk folders `013`-`017` were extracted to the then-sibling packet
`028-code-graph-and-cocoindex` and renumbered to `001`-`009`. The `external/cocoindex-main`,
`external/cocoindex-code-main`, and `backup/` assets moved with that packet; the `external/xce-mcp`
source material and the memory-topic research remained in this 027 packet (now under `research/external/`).

| Original Phase | New Home (then, now dangling) | Status | Notes |
|----------------|------------------------------|--------|-------|
| `007-code-graph-hld-lld` | `028-code-graph-and-cocoindex/001-code-graph-hld-lld` | replaced | packet no longer on disk |
| `008-code-graph-trace` | `028-code-graph-and-cocoindex/002-code-graph-trace` | replaced | packet no longer on disk |
| `009-code-graph-impact-analysis` | `028-code-graph-and-cocoindex/003-code-graph-impact-analysis` | replaced | packet no longer on disk |
| `010-code-graph-adoption-eval` | `028-code-graph-and-cocoindex/004-code-graph-adoption-eval` | replaced | packet no longer on disk |
| `013-cocoindex-complete-fork` | `028-code-graph-and-cocoindex/005-cocoindex-complete-fork` | replaced | packet no longer on disk |
| `014-coco-intent-steering` | `028-code-graph-and-cocoindex/006-coco-intent-steering` | replaced | packet no longer on disk |
| `015-retrieval-rerank-clients` | `028-code-graph-and-cocoindex/007-retrieval-rerank-clients` | replaced | packet no longer on disk |
| `016-coco-memory-context-extras` | `028-code-graph-and-cocoindex/008-coco-memory-context-extras` | replaced | packet no longer on disk |
| `017-cocoindex-memory-port-research` | `028-code-graph-and-cocoindex/009-cocoindex-memory-port-research` | replaced | packet no longer on disk |

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Rows are scoped to phase-folder movement / identity changes, and to relocated root docs.
- `New Home` paths are relative to the 027 packet root.
- Append new waves newest-first at the top; never rewrite an existing wave's table — add a new wave instead.
- Detailed rationale lives in child `decision-record.md` / `implementation-summary.md`, not here.
- Keep this file as a navigation bridge; do not grow it into a second parent plan.
<!-- /ANCHOR:author-instructions -->
