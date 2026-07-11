---
title: "Changelog: 016 Deep-Dive Remediation Program [016-root]"
description: "Program rollup for the 016 deep-dive remediation of mk-spec-memory. Thirteen shipped phases fixing the P0 through P2 deep-dive findings across corpus identity, read-exclusions, save-dedup, embeddings, trigger quality, ranking, causal-graph hygiene, the learning loop, search performance, daemon health, envelope presentation and the review-remediation closeout."
trigger_phrases:
  - "016 deep-dive remediation program"
  - "016 program changelog rollup"
  - "mk-spec-memory deep dive findings"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/` (Phase Parent, 13 children)

### Summary

The 016 deep-dive remediation program fixed the P0 through P2 findings from the mk-spec-memory deep dive across 13 shipped phases. The arc runs from corpus identity and read-exclusions through save-dedup, embedding coverage, trigger quality, the eval-production parity harness, ranking gates and score scales, causal-graph hygiene, the learning loop, search hot-path performance, daemon freshness, envelope and command-doc alignment and a doc-only closeout. Every phase followed the same pipeline: an implement pass, an independent adversarial xhigh review, a remediation of the gaps and an Opus final-verify. Six phases ran live data migrations under atomic backups. All 13 are complete, committed and pushed.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-orphan-sweep-cursor-and-corpus-identity-repair` | Completed | Persisted the orphan-sweep cursor and ran the corpus-repair migration that drained 11,129 dead rows, healed 4,313 track-renamed rows and deprecated about 5,000 duplicate or old-track rows. [Leaf](./changelog-016-001-orphan-sweep-cursor-and-corpus-identity-repair.md). |
| `002-archived-tier-and-tombstone-read-exclusions` | Completed | Routed all eleven read channels through one shared active-row predicate, added the archived tier behind a live memory_index rebuild and made tombstones hide rows. [Leaf](./changelog-016-002-archived-tier-and-tombstone-read-exclusions.md). |
| `003-content-hash-normalization-and-save-dedup-lanes` | Completed | Normalized content-hash input and repaired the save-dedup lanes so an unchanged re-save returns unchanged instead of minting a deprecated snapshot. [Leaf](./changelog-016-003-content-hash-normalization-and-save-dedup-lanes.md). |
| `004-embedding-coverage-and-vector-shard-consistency` | Completed | Closed the embedding coverage and vector-shard consistency gaps and ran a model-provenance backfill under backup. [Leaf](./changelog-016-004-embedding-coverage-and-vector-shard-consistency.md). |
| `005-trigger-phrase-quality-and-matcher-guards` | Completed | Regenerated 48 legacy trigger rows, added matcher stopword and IDF guards and deduped the constitutional rows from 30 to 19. [Leaf](./changelog-016-005-trigger-phrase-quality-and-matcher-guards.md). |
| `006-rescue-layer-ranking-authority-decision` | Completed | Built the eval-production parity harness and benchmarkable rescue modes. ADR-002 authority was deferred by the operator on confounded data. [Leaf](./changelog-016-006-rescue-layer-ranking-authority-decision.md). |
| `007-ranking-filter-bypass-and-score-scale-fixes` | Completed | Re-gated trigger-promoted and rescue-injected rows, unified the score scales and fixed a db-state circular-import crash. [Leaf](./changelog-016-007-ranking-filter-bypass-and-score-scale-fixes.md). |
| `008-causal-graph-hygiene-and-entity-linker-noise` | Completed | Down-weighted 31,644 entity-linker supports edges from 0.7 to 0.05, regenerated 3,787 surrogate titles and fixed the community lifecycle. [Leaf](./changelog-016-008-causal-graph-hygiene-and-entity-linker-noise.md). |
| `009-learning-feedback-loop-repair` | Completed | Repaired sixteen learning-loop bugs and added two gated /memory:manage maintenance tools. [Leaf](./changelog-016-009-learning-feedback-loop-repair.md). |
| `010-search-hot-path-performance` | Completed | Batched, cached and gated the twelve measured hot spots with rank parity and FTS token-equivalence proven. Live p50 is a daemon-side capture. [Leaf](./changelog-016-010-search-hot-path-performance.md). |
| `011-daemon-freshness-and-health-truthfulness` | Completed | Broke the dist-freshness deadlock, exempted help and version from the freshness gate and fixed the health exclusion-audit column. [Leaf](./changelog-016-011-daemon-freshness-and-health-truthfulness.md). |
| `012-envelope-presentation-and-command-doc-alignment` | Completed | Collapsed the envelope to a single casing, closed a cursor tenant leak and aligned both command trees behind a new byte-parity gate. Live envelope bytes are a daemon-side capture. [Leaf](./changelog-016-012-envelope-presentation-and-command-doc-alignment.md). |
| `013-absorb-028-004-review-remediation-closeout` | Completed | Doc-only closeout. Absorbed the 006/002, 006/004 and ex-031 trackers, reconstructed the 91-item P2 map and rolled up both parents. [Leaf](./changelog-016-013-absorb-028-004-review-remediation-closeout.md). |

### Changed

- One shared active-row predicate now governs every read channel. The archived tier and soft-delete tombstones are honored end to end.
- Content-hash identity, the save-dedup lanes and embedding coverage stop the save-path churn and the success-without-vector gap.
- Ranking is gated and single-scaled, the rescue authority is benchmarkable and the causal band is de-noised.
- The learning loop, the search hot path and the response envelope are corrected, cached and compacted.
- The command trees are re-aligned behind a byte-parity gate. The program's trackers and parents are rolled up to their accurate state.

### Verification

- Recursive `validate.sh --strict` across the 016 tree passed with 14 folders clean and 0 errors (14/0).
- About 2,500 tests passed across the phases, from the phase suites through the integrated-main sweeps.
- Six phases ran live data migrations under atomic backups, each with integrity and foreign-key checks clean.

### Follow-Ups

Several daemon-side captures are pending a daemon restart.

- Live p50 under 800ms from phase 010.
- Live 5-result envelope bytes under 6KB from phase 012.
- The embedding reconcile of the 12,226 vector-missing rows from phase 004.
- The eval-delta before and after numbers from phases 006 and 007.
- `trackAccess` production enablement from phase 009.
- The memory-index of the phase 013 closeout.
