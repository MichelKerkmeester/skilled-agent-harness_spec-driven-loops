---
title: "Chronological Timeline [system-spec-kit/026-graph-and-context-optimization/timeline]"
description: "GENERATED chronological index of 026 live-tree spec folders, newest to oldest by git activity. The recency view that is separate from folder numbers."
trigger_phrases:
  - "026 timeline"
  - "026 newest phase"
  - "026 most recent spec folder"
  - "026 chronological order"
  - "which 026 phase is newest"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-06-05T09:53:07Z"
    recent_action: "Regenerated chronological timeline from git history"
    next_safe_action: "Use this file to find the most recent / oldest spec folder"
    completion_pct: 100
---
# 026 Chronological Timeline

<!-- GENERATED FILE — do not hand-edit. Regenerate: `python3 scratch/gen-timeline.py > timeline.md` (run from the 026 root). -->

> **Generated:** 2026-06-05T09:53:07Z — regenerate before relying on intra-day ordering; same-day commits made
> after this stamp are not reflected until the next run.
> **Sort key:** git last-commit timestamp touching each folder subtree, **newest → oldest** (the
> recency view), taken from one atomic `git log` snapshot. The last-active column shows
> `YYYY-MM-DD HH:MM` (committer local offset) because most folders share one commit day — the time
> is what orders them. The `born` column is the folder's recorded `created_at` (or first git commit
> of its `spec.md`), shown at day granularity.
>
> **Folder numbers are NOT chronology.** Numbers (`000`–`007`, child `NNN-`) encode topical/structural
> identity assigned across reorg waves. This file is the *only* surface that orders by when work happened.
> Phase identity → home mapping lives in [`context-index.md`](./context-index.md); the live track map lives
> in [`spec.md`](./spec.md).
>
> **Changelog links:** §D maps every live spec folder to its packet changelog(s). Folders with none
> (docs-only, research, or work consolidated into a parent rollup) show `(none)`. Phase parents link
> their `-root.md` rollup, which indexes the child phase changelogs.
>
> **Most recent live spec folder:** `000-release-and-program-cleanup/015-docs-drift-review`
> **Oldest live spec folder:** `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs`
> **Counts:** 695 live spec folders · 34 archived (`z_archive/`).

---

## 0. Most recent 15 (quick answer to "what was worked on last")

```
 1. 2026-06-05 09:58  000-release-and-program-cleanup/015-docs-drift-review
 2. 2026-06-05 09:58  000-release-and-program-cleanup
 3. 2026-06-05 08:31  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening
 4. 2026-06-05 08:31  003-memory-and-causal-runtime
 5. 2026-06-05 08:31  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency
 6. 2026-06-05 08:31  003-memory-and-causal-runtime/003-embedder-testing-and-architecture
 7. 2026-06-05 08:31  000-release-and-program-cleanup/014-pre-existing-failure-remediation
 8. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix
 9. 2026-06-05 07:34  000-release-and-program-cleanup/009-readme-and-references-accuracy
10. 2026-06-05 07:34  003-memory-and-causal-runtime/016-embedding-provider-local-first
11. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper
12. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design
13. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode
14. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle
15. 2026-06-05 07:34  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation
```

---

## A. Tracks — newest activity → oldest

The eight top-level themed tracks, ordered by most recent git activity. `Born` uses `--follow` so it
traces through the reorg `git mv` history to each track's true origin.

| Rank | Last active | Born | Track |
|------|------------------|------------|-------|
| 1 | 2026-06-05 09:58 | 2026-04-27 | `000-release-and-program-cleanup/` |
| 2 | 2026-06-05 08:31 | 2026-05-26 | `003-memory-and-causal-runtime/` |
| 3 | 2026-06-04 14:37 | 2026-05-28 | `007-mcp-daemon-reliability/` |
| 4 | 2026-06-04 14:37 | 2026-05-26 | `006-operator-tooling/` |
| 5 | 2026-06-04 14:37 | 2026-05-26 | `005-graph-impact-and-affordance/` |
| 6 | 2026-06-04 14:37 | 2026-04-21 | `004-code-graph/` |
| 7 | 2026-06-02 07:56 | 2026-05-26 | `002-spec-kit-internals/` |
| 8 | 2026-06-01 06:49 | 2026-04-07 | `001-research-and-baseline/` |

> Note: `000-release-and-program-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint). Folders with no committed git history (uncommitted) show `??????????` and sort last.

```
2026-06-05 09:58  born:2026-06-05  impl  000-release-and-program-cleanup/015-docs-drift-review
2026-06-05 09:58  born:2026-04-27        000-release-and-program-cleanup
2026-06-05 08:31  born:2026-06-05  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening
2026-06-05 08:31  born:2026-05-26        003-memory-and-causal-runtime
2026-06-05 08:31  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency
2026-06-05 08:31  born:2026-05-17        003-memory-and-causal-runtime/003-embedder-testing-and-architecture
2026-06-05 08:31  born:2026-06-05  impl  000-release-and-program-cleanup/014-pre-existing-failure-remediation
2026-06-05 07:34  born:2026-06-04  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix
2026-06-05 07:34  born:2026-06-03  impl  000-release-and-program-cleanup/009-readme-and-references-accuracy
2026-06-05 07:34  born:2026-06-02  impl  003-memory-and-causal-runtime/016-embedding-provider-local-first
2026-06-05 07:34  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper
2026-06-05 07:34  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design
2026-06-05 07:34  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode
2026-06-05 07:34  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle
2026-06-05 07:34  born:2026-05-22        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/006-catalog-playbook-accuracy
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening
2026-06-05 07:33  born:2026-06-04  impl  000-release-and-program-cleanup/013-comprehensive-audit-remediation/001-deep-loop-fanout-reliability
2026-06-05 07:33  born:2026-06-04        000-release-and-program-cleanup/013-comprehensive-audit-remediation
2026-06-05 07:33  born:2026-06-04  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening
2026-06-04 23:03  born:2026-06-04        003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal
2026-06-04 20:59  born:2026-06-04        000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core
2026-06-04 20:59  born:2026-06-04  impl  000-release-and-program-cleanup/012-comprehensive-deep-review-audit
2026-06-04 17:09  born:2026-06-04  impl  003-memory-and-causal-runtime/021-relation-inference-backfill
2026-06-04 17:09  born:2026-06-01        000-release-and-program-cleanup/008-docs-and-catalogs-rollup
2026-06-04 17:09  born:??????????        000-release-and-program-cleanup/008-docs-and-catalogs-rollup/003-changelog-accuracy-reaudit
2026-06-04 16:05  born:2026-06-04  impl  003-memory-and-causal-runtime/026-relation-backfill-review-remediation
2026-06-04 14:44  born:2026-06-04  impl  003-memory-and-causal-runtime/020-lease-socket-path
2026-06-04 14:37  born:2026-06-04  impl  003-memory-and-causal-runtime/023-semantic-relation-inference
2026-06-04 14:37  born:2026-06-03        000-release-and-program-cleanup/010-scouted-bugfix-train
2026-06-04 14:37  born:2026-05-30  impl  007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn
2026-06-04 14:37  born:2026-05-28        007-mcp-daemon-reliability
2026-06-04 14:37  born:2026-05-26        006-operator-tooling
2026-06-04 14:37  born:2026-05-26        005-graph-impact-and-affordance
2026-06-04 14:37  born:2026-05-26        004-code-graph/006-extraction-and-isolation
2026-06-04 14:37  born:2026-05-26        004-code-graph/005-resilience-and-advisor
2026-06-04 14:37  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr
2026-06-04 14:37  born:2026-05-25        004-code-graph/002-deprecate-coco-index
2026-06-04 14:37  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack
2026-06-04 14:37  born:2026-05-18  impl  004-code-graph/006-extraction-and-isolation/004-three-way-isolation-finalize
2026-06-04 14:37  born:2026-05-16        004-code-graph/009-system-code-graph-uplift-phase-parent
2026-06-04 14:37  born:2026-05-14        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups
2026-06-04 14:37  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map
2026-06-04 14:37  born:2026-05-12        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation
2026-06-04 14:37  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/003-consolidate-doctor-router-implementations
2026-06-04 14:37  born:2026-05-10        006-operator-tooling/002-doctor-update-orchestrator
2026-06-04 14:37  born:2026-04-25  impl  005-graph-impact-and-affordance/005-deep-review-findings
2026-06-04 14:37  born:2026-04-24  impl  004-code-graph/005-resilience-and-advisor/001-code-graph-advisor-refinement
2026-06-04 14:37  born:2026-04-21        004-code-graph
2026-06-04 13:49  born:2026-06-04  impl  003-memory-and-causal-runtime/025-tool-layer-map-unlink
2026-06-04 13:49  born:2026-06-04  impl  003-memory-and-causal-runtime/024-launcher-lease-integration-test
2026-06-04 13:06  born:2026-06-04  impl  003-memory-and-causal-runtime/022-readme-doc-sync
2026-06-04 11:47  born:2026-06-04  impl  003-memory-and-causal-runtime/018-front-proxy-recycle-hardening
2026-06-04 11:22  born:2026-06-04  impl  003-memory-and-causal-runtime/019-causal-relation-coverage-honesty
2026-06-04 08:48  born:2026-06-04  impl  003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on
2026-06-03 14:22  born:2026-06-03  impl  000-release-and-program-cleanup/011-analytics-and-learning-remediation
2026-06-03 13:42  born:2026-06-03  impl  000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5
2026-06-03 13:36  born:2026-06-02  impl  003-memory-and-causal-runtime/015-opus-review-runtime-remediation
2026-06-03 13:36  born:2026-06-02        003-memory-and-causal-runtime/014-docs-and-stress-test-refresh
2026-06-03 13:36  born:2026-06-02  impl  003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update
2026-06-03 13:36  born:2026-06-02  impl  003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update
2026-06-03 13:36  born:2026-06-02  impl  003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update
2026-06-03 13:36  born:2026-06-02  impl  003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair
2026-06-03 13:36  born:2026-06-01  impl  003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot
2026-06-03 13:36  born:2026-05-31  impl  003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index
2026-06-03 13:36  born:2026-05-31        003-memory-and-causal-runtime/013-memory-index-scan-implementation
2026-06-03 11:31  born:2026-06-03  impl  000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4
2026-06-03 10:18  born:2026-06-03  impl  000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3
2026-06-03 10:18  born:2026-06-03  impl  000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2
2026-06-03 10:18  born:2026-06-03  impl  000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1
2026-06-03 10:18  born:2026-06-02  impl  006-operator-tooling/006-doctor-install-alignment
2026-06-03 08:08  born:2026-05-16        000-release-and-program-cleanup/003-cross-cutting-cleanup-pass
2026-06-03 08:08  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing
2026-06-02 17:05  born:2026-06-02  impl  003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain
2026-06-02 12:13  born:2026-06-02  impl  003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel
2026-06-02 12:12  born:2026-06-01  impl  003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy
2026-06-02 07:56  born:2026-05-31  impl  000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit
2026-06-02 07:56  born:2026-05-31  impl  003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening
2026-06-02 07:56  born:2026-05-31  impl  007-mcp-daemon-reliability/016-substrate-harness-hardening
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/002-substrate-codegraph-scenarios
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test
2026-06-02 07:56  born:2026-05-30        007-mcp-daemon-reliability/015-infra-followup-hardening
2026-06-02 07:56  born:2026-05-30  impl  007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing
2026-06-02 07:56  born:2026-05-30  impl  006-operator-tooling/005-worktree-per-session-automation
2026-06-02 07:56  born:2026-05-30  impl  006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/008-deep-review-correctness-edges
2026-06-02 07:56  born:2026-05-29  impl  007-mcp-daemon-reliability/010-at-rest-wal-durability
2026-06-02 07:56  born:2026-05-29  impl  002-spec-kit-internals/006-orchestrator-placeholder-parity
2026-06-02 07:56  born:2026-05-29  impl  002-spec-kit-internals/005-validate-recursive-orchestrator-fix
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/004-perf-instrumentation-batching
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch
2026-06-02 07:56  born:2026-05-29        003-memory-and-causal-runtime/011-embedding-stack-hardening
2026-06-02 07:56  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings
2026-06-02 07:56  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring
2026-06-02 07:56  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar
2026-06-02 07:56  born:2026-05-29        003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server
2026-06-02 07:56  born:2026-05-26        002-spec-kit-internals
2026-06-02 07:56  born:2026-04-25  impl  000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup
2026-06-01 07:45  born:2026-05-16        000-release-and-program-cleanup/005-stress-test
2026-06-01 07:45  born:2026-04-27        000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings
2026-06-01 07:45  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook
2026-06-01 07:45  born:2026-04-21        006-operator-tooling/001-hook-parity
2026-06-01 07:37  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation
2026-06-01 07:37  born:2026-05-01        002-spec-kit-internals/003-template-levels
2026-06-01 07:37  born:2026-04-24        002-spec-kit-internals/001-resource-map-deep-loop-fix
2026-06-01 07:37  born:2026-04-21        003-memory-and-causal-runtime/001-continuity-memory-runtime
2026-06-01 07:37  born:2026-04-21        002-spec-kit-internals/002-skill-advisor
2026-06-01 07:24  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack
2026-06-01 07:06  born:2026-05-19  impl  003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp
2026-06-01 07:06  born:2026-05-16        000-release-and-program-cleanup/004-followup-post-program
2026-06-01 07:06  born:2026-05-11        003-memory-and-causal-runtime/002-causal-graph-channel-routing
2026-06-01 07:06  born:2026-05-09  impl  000-release-and-program-cleanup/004-followup-post-program/002-vitest-baseline-recovery-followup
2026-06-01 07:06  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery
2026-06-01 07:06  born:2026-05-08  impl  004-code-graph/005-resilience-and-advisor/005-doctor-apply-mode-implementation
2026-06-01 07:06  born:2026-05-08  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability
2026-06-01 06:53  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/001-skill-graph
2026-06-01 06:53  born:2026-05-14        002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction
2026-06-01 06:49  born:2026-05-27        002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation
2026-06-01 06:49  born:2026-05-26        002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation
2026-06-01 06:49  born:2026-05-26        004-code-graph/010-playbook-validation-and-hardening
2026-06-01 06:49  born:2026-05-26        004-code-graph/007-docs-and-readmes
2026-06-01 06:49  born:2026-05-26        004-code-graph/004-runtime-and-scan
2026-06-01 06:49  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2
2026-06-01 06:49  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes
2026-06-01 06:49  born:2026-05-26        006-operator-tooling/003-install-scripts-doctor-realignment
2026-06-01 06:49  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc
2026-06-01 06:49  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc
2026-06-01 06:49  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc
2026-06-01 06:49  born:2026-05-20        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots
2026-06-01 06:49  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion
2026-06-01 06:49  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack
2026-06-01 06:49  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment
2026-06-01 06:49  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality
2026-06-01 06:49  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack
2026-06-01 06:49  born:2026-05-17        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit
2026-06-01 06:49  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening
2026-06-01 06:49  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine
2026-06-01 06:49  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine
2026-06-01 06:49  born:2026-05-16        000-release-and-program-cleanup/006-research
2026-06-01 06:49  born:2026-05-16        000-release-and-program-cleanup/002-audit
2026-06-01 06:49  born:2026-05-16        000-release-and-program-cleanup/001-release-readiness
2026-06-01 06:49  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor
2026-06-01 06:49  born:2026-05-05  impl  004-code-graph/008-real-world-usefulness-test-planning
2026-06-01 06:49  born:2026-05-01        000-release-and-program-cleanup/006-research/004-fix-deep-research-findings
2026-06-01 06:49  born:2026-04-29        000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits
2026-06-01 06:49  born:2026-04-29        000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass
2026-06-01 06:49  born:2026-04-27        000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation
2026-06-01 06:49  born:2026-04-12        001-research-and-baseline
2026-05-31 22:25  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/004-fix-release-readiness-findings-synthesis
2026-05-31 22:25  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion
2026-05-31 22:25  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/014-resource-map-memory-finalization
2026-05-31 22:25  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/011-cli-matrix-adapter-runners
2026-05-31 22:25  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/022-stress-test-results-deep-research
2026-05-31 22:25  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/020-enterprise-readiness-verification-expansion-research
2026-05-31 22:25  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/016-degraded-readiness-envelope-parity
2026-05-31 22:25  born:2026-04-12  impl  001-research-and-baseline/005-claudest
2026-05-31 22:25  born:2026-04-12  impl  001-research-and-baseline/003-contextador
2026-05-31 20:51  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename
2026-05-31 20:51  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner
2026-05-31 20:51  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/009-fix-script-filesystem-scope
2026-05-31 15:23  born:2026-05-29  impl  007-mcp-daemon-reliability/013-standalone-save-second-writer-guard
2026-05-31 12:16  born:2026-05-31  impl  007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/002-server-liveness-supervision
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server
2026-05-31 12:16  born:2026-05-29  impl  003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/001-nomic-only-consolidation
2026-05-31 10:53  born:2026-05-29  impl  004-code-graph/013-owner-lease-election-race
2026-05-31 10:53  born:2026-05-29  impl  007-mcp-daemon-reliability/012-boot-integrity-retention-probe
2026-05-31 10:53  born:2026-05-29  impl  007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph
2026-05-31 10:53  born:2026-05-29  impl  007-mcp-daemon-reliability/009-shutdown-durability
2026-05-31 10:53  born:2026-05-29  impl  007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close
2026-05-31 10:53  born:2026-05-29  impl  004-code-graph/012-empty-graph-first-time-auto-scan
2026-05-31 10:53  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local
2026-05-31 10:53  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/001-applied-source-and-doc-fixes
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/007-bridge-liveness-reap
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/006-graceful-exit-watchdog
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/005-provider-dispose
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/004-nondestructive-build
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/003-daemon-reliability-research
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/002-code-graph-initial-scan
2026-05-31 10:53  born:2026-05-28  impl  007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize
2026-05-31 10:53  born:2026-05-27  impl  003-memory-and-causal-runtime/009-embedder-auto-resolution-fix
2026-05-31 10:53  born:2026-05-27  impl  003-memory-and-causal-runtime/008-embedder-provider-auto-resolution
2026-05-31 10:53  born:2026-05-27  impl  003-memory-and-causal-runtime/007-success-vector-coverage-hygiene
2026-05-31 10:53  born:2026-05-27  impl  003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool
2026-05-31 10:53  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag
2026-05-31 10:53  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022
2026-05-31 10:53  born:2026-05-27  impl  003-memory-and-causal-runtime/005-embedding-status-integrity
2026-05-31 10:53  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery
2026-05-31 10:53  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/005-db-binding-cleanup
2026-05-31 10:53  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes
2026-05-31 10:53  born:2026-05-27  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning
2026-05-31 10:53  born:2026-05-27  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/006-playbook-vitest-path-fix
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/003-pc005-bench-doc-and-gates
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/004-shell-python-daemon
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/002-mcp-native-scenarios
2026-05-31 10:53  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build
2026-05-31 10:53  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/003-release-readiness-synthesis
2026-05-31 10:53  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios
2026-05-31 10:53  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode
2026-05-31 10:53  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability
2026-05-31 10:53  born:2026-05-26  impl  004-code-graph/003-code-graph-workspace-root-fix
2026-05-31 10:53  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/004-deferred-followups-and-cleanup
2026-05-31 10:53  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment
2026-05-31 10:53  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/002-operator-surface-realignment
2026-05-31 10:53  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor
2026-05-31 10:53  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/016-remediate-residue-tail
2026-05-31 10:53  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/015-remediate-cross-surface-residue
2026-05-31 10:53  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/014-remediate-codegraph-naming
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/008-runtime-artifacts-cleanup
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/007-docs-readme-search-routing
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/006-runtime-configs-4runtime-mirror
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/005-remove-coco-index-skill
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/004-remove-rerank-sidecar-skill
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/003-remove-memory-rerank-path
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/002-decouple-code-graph
2026-05-31 10:53  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/001-touchpoint-research
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/013-post-deprecation-deep-review
2026-05-31 10:53  born:2026-05-25        004-code-graph/002-deprecate-coco-index/010-remove-memory-coco-integration
2026-05-31 10:53  born:2026-05-24  impl  004-code-graph/007-docs-and-readmes/006-reference-template-alignment
2026-05-31 10:53  born:2026-05-24  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/007-reference-template-alignment
2026-05-31 10:53  born:2026-05-24  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/007-code-graph-p1-config-extraction
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair
2026-05-31 10:53  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/021-hardcoded-default-audit-deep-research
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle
2026-05-31 10:53  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map
2026-05-31 10:53  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization
2026-05-31 10:53  born:2026-05-21  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory
2026-05-31 10:53  born:2026-05-20  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment
2026-05-31 10:53  born:2026-05-20  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/008-vec0-migration-fix-deferred
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing
2026-05-31 10:53  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction
2026-05-31 10:53  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/017-fix-deep-review-p1-findings-for-package-extraction
2026-05-31 10:53  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction
2026-05-31 10:53  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit
2026-05-31 10:53  born:2026-05-19  impl  002-spec-kit-internals/004-literal-spec-folder-names
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability
2026-05-31 10:53  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal
2026-05-31 10:53  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation
2026-05-31 10:53  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment
2026-05-31 10:53  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction
2026-05-31 10:53  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap
2026-05-31 10:53  born:2026-05-18  impl  004-code-graph/008-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/005-stress-test/005-stress-test-expansion-alignment
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/020-cocoindex-feature-catalog
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/019-feature-catalog-shape-realignment
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/018-matrix-runner-snake-case-rename
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/002-audit/007-runtime-command-agent-alignment-audit
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/005-fix-remaining-priority-findings
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/010-upgrade-safety-operability-audit
2026-05-31 10:53  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/009-documentation-truth-audit
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/004-launcher-diagnostics-and-signal-coverage
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/008-chunking-strategy-tuning
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration
2026-05-31 10:53  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/002-tool-coverage-audit
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/001-fairness-audit
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema
2026-05-31 10:53  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface
2026-05-31 10:53  born:2026-05-16  impl  004-code-graph/007-docs-and-readmes/005-cross-skill-doc-polish
2026-05-31 10:53  born:2026-05-16  impl  000-release-and-program-cleanup/005-stress-test/008-spec-memory-mcp-stress-test
2026-05-31 10:53  born:2026-05-16  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/011-z-archive-memory-indexing
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/006-skill-readme-refinement-survey
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling
2026-05-31 10:53  born:2026-05-16  impl  004-code-graph/009-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite
2026-05-31 10:53  born:2026-05-16  impl  004-code-graph/009-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish
2026-05-31 10:53  born:2026-05-16  impl  004-code-graph/001-mcp-shared-dependency-startup-fix
2026-05-31 10:53  born:2026-05-16  impl  004-code-graph/007-docs-and-readmes/004-doc-drift-alignment
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/008-tier-d-documentation-execution
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/007-finalize-documentation-quality-refactor
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/005-content-additions-hvr-polish
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/004-sk-doc-type-validation-alignment
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/002-fix-documentation-bugs
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/001-documentation-quality-audit-research
2026-05-31 10:53  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift
2026-05-31 10:53  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/055-cli-devin-deep-loop-alignment
2026-05-31 10:53  born:2026-05-15  impl  000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/007-cross-skill-enhancement-edge-propagation
2026-05-31 10:53  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/004-devin-advisor-hook-integration
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/030-any-type-justification-sweep
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/029-python-package-header-policy
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/028-generated-js-declaration-alignment
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/027-typescript-header-normalization
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/002-code-folder-readme-coverage
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/025-parent-documentation-drift-refresh
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/024-dfidf-cold-start-cache
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/022-plugin-bridge-unit-test-isolation
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface
2026-05-31 10:53  born:2026-05-15  impl  004-code-graph/007-docs-and-readmes/003-code-folder-readmes-poc
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling
2026-05-31 10:53  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling
2026-05-31 10:53  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/053-mk-spec-memory-rename-remediation
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep
2026-05-31 10:53  born:2026-05-14  impl  004-code-graph/007-docs-and-readmes/002-system-code-graph-readmes-update
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover
2026-05-31 10:53  born:2026-05-14  impl  004-code-graph/006-extraction-and-isolation/003-standalone-mcp-topology-pivot
2026-05-31 10:53  born:2026-05-14  impl  004-code-graph/006-extraction-and-isolation/002-extraction-design-and-decision-record
2026-05-31 10:53  born:2026-05-14        004-code-graph/006-extraction-and-isolation/001-system-code-graph-extraction
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/005-intent-signals-and-skill-relationships
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/003-skill-metadata-embedding-quality-audit
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry
2026-05-31 10:53  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/006-seeded-corpus-evaluation-sweep
2026-05-31 10:53  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration
2026-05-31 10:53  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/005-routing-weight-sweep-harness
2026-05-31 10:53  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion
2026-05-31 10:53  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring
2026-05-31 10:53  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/002-semantic-routing-lane
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-post-027-findings-remediation
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/023-post-remediation-re-review
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification
2026-05-31 10:53  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/008-finalize-and-commit
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/005-q4-quantization
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat
2026-05-31 10:53  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture
2026-05-31 10:53  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files
2026-05-31 10:53  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator
2026-05-31 10:53  born:2026-05-11  impl  002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts
2026-05-31 10:53  born:2026-05-10  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate
2026-05-31 10:53  born:2026-05-09  impl  004-code-graph/005-resilience-and-advisor/004-iteration-quality-meta-research
2026-05-31 10:53  born:2026-05-09  impl  004-code-graph/004-runtime-and-scan/005-broader-excludes-and-granular-skills
2026-05-31 10:53  born:2026-05-09  impl  006-operator-tooling/002-doctor-update-orchestrator/001-implement-initial-doctor-command-set
2026-05-31 10:53  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep
2026-05-31 10:53  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal
2026-05-31 10:53  born:2026-05-08  impl  000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes
2026-05-31 10:53  born:2026-05-07  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in
2026-05-31 10:53  born:2026-05-07  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/005-scope-change-scan-guard
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/004-fix-zero-node-and-parser-issues
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/003-code-graph-bug-surface-research
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/002-native-deferred-trial-rerun
2026-05-31 10:53  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/001-sandbox-usefulness-trials
2026-05-31 10:53  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/027-missing-code-readme-resource-map
2026-05-31 10:53  born:2026-05-02  impl  004-code-graph/004-runtime-and-scan/004-end-user-scope-default-and-opt-in
2026-05-31 10:53  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/026-readme-code-template-governance
2026-05-31 10:53  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/008-archive-fleet-marker-validation-scaffold
2026-05-31 10:53  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/007-sweep-fleet-marker-validation
2026-05-31 10:53  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/006-command-markdown-yaml-workflow-alignment
2026-05-31 10:53  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/005-skill-reference-asset-doc-alignment
2026-05-31 10:53  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/025-readme-architecture-diagrams-topology
2026-05-31 10:53  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/004-fix-template-deferred-followups
2026-05-31 10:53  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan
2026-05-31 10:53  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/002-manifest-driven-template-design
2026-05-31 10:53  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/001-template-level-consolidation-research
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/010-fix-cli-orchestrator-doc-drift
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/009-fix-test-reliability
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/008-fix-search-quality-tuning
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/007-fix-topology-build-boundary
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/006-fix-architecture-cleanup-followups
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/005-resource-leaks-silent-errors
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/003-fix-skill-advisor-quality
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/002-fix-deep-loop-workflow-state
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/001-fix-code-graph-consistency
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/024-daemon-concurrency-fixes
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/023-fix-baseline-test-failures
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/003-system-bug-improvement-research
2026-05-31 10:53  born:2026-05-01  impl  000-release-and-program-cleanup/002-audit/008-fix-audit-drift-findings
2026-05-31 10:53  born:2026-04-30  impl  000-release-and-program-cleanup/001-release-readiness/006-fix-stress-test-coverage-gap
2026-05-31 10:53  born:2026-04-30  impl  000-release-and-program-cleanup/005-stress-test/007-fix-stress-test-coverage-gap-followup
2026-05-31 10:53  born:2026-04-30  impl  000-release-and-program-cleanup/005-stress-test/006-stress-coverage-audit-and-run
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/017-hook-test-sandbox-fix
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/006-mcp-tool-schema-governance-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/007-deep-loop-workflow-integrity-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/005-cross-runtime-hook-parity-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/001-workflow-correctness-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/013-evergreen-doc-packet-id-removal
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/004-code-graph-readiness-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/008-validator-spec-document-integrity-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/015-root-readme-refresh
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/012-code-graph-catalog-and-playbook
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/006-readme-cascade-refresh
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/005-stress-test-folder-migration
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/004-sk-doc-template-alignment
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/003-testing-playbook-trio-alignment
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/002-feature-catalog-trio-alignment
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/001-sk-code-opencode-standards-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/006-runtime-matrix-execution-validation
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/006-research/002-automation-reality-supplemental-research
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/010-half-auto-upgrade-doc-alignment
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/005-memory-retention-policy-sweep
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/004-code-graph-watcher-claim-retraction
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/003-documentation-truth-validation
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/006-research/001-automation-self-management-research
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/007-vitest-broad-suite-honesty
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/028-deep-review-research-skill-contract-fixes
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/027-memory-context-structural-channel-research
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/026-remove-readiness-scaffolding
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/025-memory-search-degraded-readiness-wiring
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/024-harness-telemetry-export-mode
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/023-live-handler-envelope-capture-interface
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/005-vestigial-embedding-readiness-gate-removal
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/002-stress-test-pattern-documentation
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit
2026-05-31 10:53  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/019-search-query-rag-optimization-research
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/001-release-readiness/002-fix-additional-release-readiness-findings
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/005-stress-test/001-fix-mcp-stress-cycle-doc-observability
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/001-fix-memory-indexer-storage-boundary
2026-05-31 10:53  born:2026-04-28  impl  000-release-and-program-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/018-feature-catalog-playbook-degraded-alignment
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/012-copilot-target-authority-gate-helper
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/013-code-graph-degraded-stress-cell
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/015-cocoindex-seed-telemetry-passthrough
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/014-code-graph-status-readiness-snapshot
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/011-research-post-stress-finding-followups
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/017-cli-copilot-dispatch-test-parity
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/010-stress-test-close-loop-measurement-rerun
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/003-phase-parent-reference-readme-sync
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/001-phase-parent-validator-docs
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/007-intent-classifier-stability-telemetry
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/006-causal-graph-relation-window-metrics
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/009-memory-search-citation-response-policy
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/005-code-graph-fail-fast-routing
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/004-cocoindex-overfetch-dedup-rerank
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/003-memory-context-truncation-telemetry-contract
2026-05-31 10:53  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/002-mcp-runtime-improvement-research
2026-05-31 10:53  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-execution
2026-05-31 10:53  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-search-scenario-design
2026-05-31 10:53  born:2026-04-26  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/005-memory-search-runtime-bugs
2026-05-31 10:53  born:2026-04-25  impl  005-graph-impact-and-affordance/006-deep-research-review
2026-05-31 10:53  born:2026-04-25  impl  004-code-graph/005-resilience-and-advisor/003-code-graph-backend-resilience-implementation
2026-05-31 10:53  born:2026-04-25  impl  004-code-graph/007-docs-and-readmes/001-doctor-diagnostic-command-phase-a
2026-05-31 10:53  born:2026-04-25  impl  004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research
2026-05-31 10:53  born:2026-04-25  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/005-advisor-setup-command
2026-05-31 10:53  born:2026-04-25  impl  005-graph-impact-and-affordance/004-memory-causal-trust-display
2026-05-31 10:53  born:2026-04-25  impl  005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence
2026-05-31 10:53  born:2026-04-25  impl  005-graph-impact-and-affordance/002-edge-explanation-impact-uplift
2026-05-31 10:53  born:2026-04-25  impl  005-graph-impact-and-affordance/001-code-graph-phase-runner
2026-05-31 10:53  born:2026-04-25  impl  000-release-and-program-cleanup/007-clean-room-license-audit
2026-05-31 10:53  born:2026-04-24  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/010-memory-indexer-invariants
2026-05-31 10:53  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders
2026-05-31 10:53  born:2026-04-24  impl  004-code-graph/004-runtime-and-scan/003-resolver-and-hook-improvements
2026-05-31 10:53  born:2026-04-24  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/001-advisor-hook-brief-improvements
2026-05-31 10:53  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration
2026-05-31 10:53  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/002-resource-map-template-creation
2026-05-31 10:53  born:2026-04-23  impl  004-code-graph/004-runtime-and-scan/002-fix-stale-highlights-and-scan-scope
2026-05-31 10:53  born:2026-04-23  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/003-advisor-standards-alignment
2026-05-31 10:53  born:2026-04-23  impl  006-operator-tooling/001-hook-parity/004-fix-claude-freshness-schema-harness
2026-05-31 10:53  born:2026-04-23  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/002-advisor-plugin-hardening
2026-05-31 10:53  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge
2026-05-31 10:53  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/003-codex-native-startup-advisor-hooks
2026-05-31 10:53  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/002-copilot-custom-instructions-hook-parity
2026-05-31 10:53  born:2026-04-21  impl  006-operator-tooling/001-hook-parity/001-fix-runtime-hook-parity-findings
2026-05-31 10:53  born:2026-04-21  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/002-skill-graph-daemon-native-advisor-tools
2026-05-31 10:53  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/001-documentation-code-alignment
2026-05-31 10:53  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/001-deferred-remediation-telemetry-run
2026-05-31 10:53  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/004-advisor-hook-surface-integration
2026-05-31 10:53  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin
2026-05-31 10:53  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/009-system-hardening
2026-05-31 10:53  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime
2026-05-31 10:53  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/008-sk-deep-cli-runtime-execution
2026-05-31 10:53  born:2026-04-15  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning
2026-05-31 10:53  born:2026-04-15  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite
2026-05-31 10:53  born:2026-04-13  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/001-memory-search-routing-tuning
2026-05-31 10:53  born:2026-04-13  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts
2026-05-31 10:53  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates
2026-05-31 10:53  born:2026-04-12  impl  004-code-graph/004-runtime-and-scan/001-code-graph-runtime-upgrades
2026-05-31 10:53  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/002-fix-memory-quality
2026-05-31 10:53  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/001-cache-warning-hooks
2026-05-31 10:53  born:2026-04-12  impl  001-research-and-baseline/006-research-memory-redundancy
2026-05-31 10:53  born:2026-04-12  impl  001-research-and-baseline/004-graphify
2026-05-31 10:53  born:2026-04-12  impl  001-research-and-baseline/002-codesight
2026-05-31 10:53  born:2026-04-12  impl  001-research-and-baseline/001-claude-optimization-settings
2026-05-26 19:29  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004b-skill-advisor-interface-and-env-vars
2026-05-26 19:29  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation
2026-05-26 19:29  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose
2026-05-26 19:29  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs
2026-05-26 19:29  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs
```

---

## C. Archived spec folders (`z_archive/`)

Superseded / merged packets, preserved for provenance. Same sort. Resolve their original phase
identities via [`context-index.md`](./context-index.md).

```
2026-06-01 08:15  born:2026-04-21        z_archive/wave-2-merges/004-runtime-executor-hardening
2026-06-01 07:37  born:2026-04-25        z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved
2026-05-31 20:51  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index
2026-05-31 10:53  born:2026-05-26  impl  z_archive/wave-3-deep-archives/007-038-system-code-graph-deep-review-remediation
2026-05-31 10:53  born:2026-05-26        z_archive/wave-3-deep-archives/007-037-system-code-graph-comprehensive-deep-review
2026-05-31 10:53  born:2026-05-26        z_archive/wave-4-2026-05-26-reorg/017-phase-reorg-and-renumber
2026-05-31 10:53  born:2026-05-18  impl  z_archive/wave-3-deep-archives/007-030-manual-testing-verification
2026-05-31 10:53  born:2026-05-18  impl  z_archive/wave-3-deep-archives/007-031-deep-review-campaign-010-016
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-3-deep-archives/007-039-system-code-graph-deferred-followon
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-2-merges/014-057-root-readme-deeper-rewrite
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-2-shallow-medium/007-036-cli-devin-code-graph-hook
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-055-root-readme-realignment
2026-05-31 10:53  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-054-code-folder-readmes
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-033-deferred-fix-followup
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-032-deep-review-remediation
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-code-graph-029-public-readme-update
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-025-skill-docs-sk-doc-alignment
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-028-architecture-md
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-026-system-spec-kit-codegraph-residue-audit
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-023-tsconfig-references-restructure
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-shallow-medium/014-041-llama-cpp-metal-investigation
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-022-orphan-code-graph-db-cleanup
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-020-validation-and-cleanup
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-019-doc-and-runtime-migration
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-017-physical-move-and-database
2026-05-31 10:53  born:2026-05-14  impl  z_archive/wave-2-merges/007-016-scaffold-skill
2026-05-31 10:53  born:2026-05-09  impl  z_archive/wave-2-merges/013-002-sandbox-testing-playbook
2026-05-31 10:53  born:2026-04-23  impl  z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation
2026-05-31 10:53  born:2026-04-22  impl  z_archive/wave-2-merges/009-007-copilot-writer-wiring
2026-05-31 10:53  born:2026-04-22  impl  z_archive/wave-2-merges/009-006-copilot-wrapper-schema-fix
2026-05-31 10:53  born:2026-04-21  impl  z_archive/wave-2-merges/007-002-code-graph-self-contained-package
```

---

## D. Spec folder → changelog (generated link index)

Every live spec folder linked to its packet changelog(s), in the same newest → oldest order as §B.
This is the connection between "what was worked on when" (§B) and "what shipped" (the changelogs).
Folders with `(none)` are docs-only, research, or work consolidated into a parent rollup. Phase
parents link their `-root.md` rollup, which indexes the child phase changelogs (`+N` = additional
changelogs the rollup covers). Links resolve relative to this file.

| Spec folder | impl | Changelog |
|-------------|------|-----------|
| `000-release-and-program-cleanup/015-docs-drift-review` | impl | [changelog-000-015-docs-drift-review.md](./changelog/000-release-and-program-cleanup/changelog-000-015-docs-drift-review.md) |
| `000-release-and-program-cleanup` |  | [changelog-000-release-and-program-cleanup-root.md](./changelog/000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/016-spec-memory-launcher-ownership-hardening` | impl | [changelog-006-016-spec-memory-launcher-ownership-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-006-016-spec-memory-launcher-ownership-hardening.md) |
| `003-memory-and-causal-runtime` |  | [changelog-003-memory-and-causal-runtime-root.md](./changelog/003-memory-and-causal-runtime/changelog-003-memory-and-causal-runtime-root.md) (rollup indexes +1) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency` |  | [changelog-006-mcp-launcher-concurrency-root.md](./changelog/003-memory-and-causal-runtime/changelog-006-mcp-launcher-concurrency-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture` |  | [changelog-003-embedder-testing-and-architecture-root.md](./changelog/003-memory-and-causal-runtime/changelog-003-embedder-testing-and-architecture-root.md) |
| `000-release-and-program-cleanup/014-pre-existing-failure-remediation` | impl | [changelog-000-014-pre-existing-failure-remediation.md](./changelog/000-release-and-program-cleanup/changelog-000-014-pre-existing-failure-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix` | impl | [changelog-006-014-launcher-overlap-spawn-and-bridge-fix.md](./changelog/003-memory-and-causal-runtime/changelog-006-014-launcher-overlap-spawn-and-bridge-fix.md) |
| `000-release-and-program-cleanup/009-readme-and-references-accuracy` | impl | [changelog-009-readme-and-references-accuracy.md](./changelog/000-release-and-program-cleanup/changelog-009-readme-and-references-accuracy.md) |
| `003-memory-and-causal-runtime/016-embedding-provider-local-first` | impl | [changelog-016-embedding-provider-local-first.md](./changelog/003-memory-and-causal-runtime/changelog-016-embedding-provider-local-first.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper` |  | [changelog-019-fix-rerank-sidecar-accumulation-with-three-layer-reaper-root.md](./changelog/003-memory-and-causal-runtime/changelog-019-fix-rerank-sidecar-accumulation-with-three-layer-reaper-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design` |  | [changelog-018-rerank-sidecar-accumulation-investigation-and-reaper-design-root.md](./changelog/003-memory-and-causal-runtime/changelog-018-rerank-sidecar-accumulation-investigation-and-reaper-design-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode` |  | [changelog-017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode-root.md](./changelog/003-memory-and-causal-runtime/changelog-017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle` |  | [changelog-016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle-root.md](./changelog/003-memory-and-causal-runtime/changelog-016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation` |  | [changelog-009-memory-leak-remediation-root.md](./changelog/003-memory-and-causal-runtime/changelog-009-memory-leak-remediation-root.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment` | impl | [changelog-013-007-governance-alignment.md](./changelog/000-release-and-program-cleanup/changelog-013-007-governance-alignment.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/006-catalog-playbook-accuracy` | impl | [changelog-013-006-catalog-playbook-accuracy.md](./changelog/000-release-and-program-cleanup/changelog-013-006-catalog-playbook-accuracy.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation` | impl | [changelog-013-005-metadata-status-derivation.md](./changelog/000-release-and-program-cleanup/changelog-013-005-metadata-status-derivation.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/004-mcp-contract-parity` | impl | [changelog-013-004-mcp-contract-parity.md](./changelog/000-release-and-program-cleanup/changelog-013-004-mcp-contract-parity.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness` | impl | [changelog-013-003-memory-write-correctness.md](./changelog/000-release-and-program-cleanup/changelog-013-003-memory-write-correctness.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening` | impl | [changelog-013-002-retrieval-scope-hardening.md](./changelog/000-release-and-program-cleanup/changelog-013-002-retrieval-scope-hardening.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation/001-deep-loop-fanout-reliability` | impl | [changelog-013-001-deep-loop-fanout-reliability.md](./changelog/000-release-and-program-cleanup/changelog-013-001-deep-loop-fanout-reliability.md) |
| `000-release-and-program-cleanup/013-comprehensive-audit-remediation` |  | [changelog-013-comprehensive-audit-remediation-root.md](./changelog/000-release-and-program-cleanup/changelog-013-comprehensive-audit-remediation-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening` | impl | [changelog-006-015-socket-server-reconvergence-and-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-006-015-socket-server-reconvergence-and-hardening.md) |
| `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation` |  | (none) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis` |  | [changelog-012-009-research-synthesis.md](./changelog/000-release-and-program-cleanup/changelog-012-009-research-synthesis.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state` |  | [changelog-012-008-027-launch-state.md](./changelog/000-release-and-program-cleanup/changelog-012-008-027-launch-state.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps` |  | [changelog-012-007-interconnected-mcps.md](./changelog/000-release-and-program-cleanup/changelog-012-007-interconnected-mcps.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode` |  | [changelog-012-006-governance-skdoc-skcode.md](./changelog/000-release-and-program-cleanup/changelog-012-006-governance-skdoc-skcode.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook` |  | [changelog-012-005-feature-catalog-playbook.md](./changelog/000-release-and-program-cleanup/changelog-012-005-feature-catalog-playbook.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity` |  | [changelog-012-004-026-integrity.md](./changelog/000-release-and-program-cleanup/changelog-012-004-026-integrity.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema` |  | [changelog-012-003-mcp-session-index-schema.md](./changelog/000-release-and-program-cleanup/changelog-012-003-mcp-session-index-schema.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal` |  | [changelog-012-002-mcp-retrieval-causal.md](./changelog/000-release-and-program-cleanup/changelog-012-002-mcp-retrieval-causal.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core` |  | [changelog-012-001-mcp-core.md](./changelog/000-release-and-program-cleanup/changelog-012-001-mcp-core.md) |
| `000-release-and-program-cleanup/012-comprehensive-deep-review-audit` | impl | [changelog-012-comprehensive-deep-review-audit-root.md](./changelog/000-release-and-program-cleanup/changelog-012-comprehensive-deep-review-audit-root.md) |
| `003-memory-and-causal-runtime/021-relation-inference-backfill` | impl | [changelog-021-relation-inference-backfill.md](./changelog/003-memory-and-causal-runtime/changelog-021-relation-inference-backfill.md) |
| `000-release-and-program-cleanup/008-docs-and-catalogs-rollup` |  | [changelog-008-docs-and-catalogs-rollup-root.md](./changelog/000-release-and-program-cleanup/changelog-008-docs-and-catalogs-rollup-root.md) |
| `000-release-and-program-cleanup/008-docs-and-catalogs-rollup/003-changelog-accuracy-reaudit` |  | (none) |
| `003-memory-and-causal-runtime/026-relation-backfill-review-remediation` | impl | [changelog-026-relation-backfill-review-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-026-relation-backfill-review-remediation.md) |
| `003-memory-and-causal-runtime/020-lease-socket-path` | impl | [changelog-020-lease-socket-path.md](./changelog/003-memory-and-causal-runtime/changelog-020-lease-socket-path.md) |
| `003-memory-and-causal-runtime/023-semantic-relation-inference` | impl | [changelog-023-semantic-relation-inference.md](./changelog/003-memory-and-causal-runtime/changelog-023-semantic-relation-inference.md) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train` |  | [changelog-010-scouted-bugfix-train-root.md](./changelog/000-release-and-program-cleanup/changelog-010-scouted-bugfix-train-root.md) |
| `007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn` | impl | [changelog-014-infra-memory-db-and-graph-churn-root.md](./changelog/007-mcp-daemon-reliability/changelog-014-infra-memory-db-and-graph-churn-root.md) (rollup indexes +1) |
| `007-mcp-daemon-reliability` |  | [changelog-007-mcp-daemon-reliability-root.md](./changelog/007-mcp-daemon-reliability/changelog-007-mcp-daemon-reliability-root.md) |
| `006-operator-tooling` |  | [changelog-006-operator-tooling-root.md](./changelog/006-operator-tooling/changelog-006-operator-tooling-root.md) |
| `005-graph-impact-and-affordance` |  | [changelog-005-graph-impact-and-affordance-root.md](./changelog/005-graph-impact-and-affordance/changelog-005-graph-impact-and-affordance-root.md) |
| `004-code-graph/006-extraction-and-isolation` |  | [changelog-006-extraction-and-isolation-root.md](./changelog/004-code-graph/changelog-006-extraction-and-isolation-root.md) |
| `004-code-graph/005-resilience-and-advisor` |  | [changelog-005-resilience-and-advisor-root.md](./changelog/004-code-graph/changelog-005-resilience-and-advisor-root.md) |
| `004-code-graph/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr` | impl | [changelog-002-017-remove-llm-reranking-keep-mmr.md](./changelog/004-code-graph/changelog-002-017-remove-llm-reranking-keep-mmr.md) |
| `004-code-graph/002-deprecate-coco-index` |  | [changelog-002-deprecate-coco-index-root.md](./changelog/004-code-graph/changelog-002-deprecate-coco-index-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack` | impl | [changelog-016-001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack.md](./changelog/003-memory-and-causal-runtime/changelog-016-001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack.md) |
| `004-code-graph/006-extraction-and-isolation/004-three-way-isolation-finalize` | impl | [changelog-006-004-three-way-isolation-finalize.md](./changelog/004-code-graph/changelog-006-004-three-way-isolation-finalize.md) |
| `004-code-graph/009-system-code-graph-uplift-phase-parent` |  | [changelog-009-system-code-graph-uplift-phase-parent-root.md](./changelog/004-code-graph/changelog-009-system-code-graph-uplift-phase-parent-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups` |  | [changelog-032-substrate-repair-followups-root.md](./changelog/003-memory-and-causal-runtime/changelog-032-substrate-repair-followups-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map` | impl | [changelog-001-019-readme-resource-map.md](./changelog/003-memory-and-causal-runtime/changelog-001-019-readme-resource-map.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation` |  | [changelog-001-local-embeddings-foundation-root.md](./changelog/003-memory-and-causal-runtime/changelog-001-local-embeddings-foundation-root.md) |
| `006-operator-tooling/002-doctor-update-orchestrator/003-consolidate-doctor-router-implementations` | impl | [changelog-002-003-consolidate-doctor-router-implementations.md](./changelog/006-operator-tooling/changelog-002-003-consolidate-doctor-router-implementations.md) |
| `006-operator-tooling/002-doctor-update-orchestrator` |  | [changelog-002-doctor-update-orchestrator-root.md](./changelog/006-operator-tooling/changelog-002-doctor-update-orchestrator-root.md) |
| `005-graph-impact-and-affordance/005-deep-review-findings` | impl | [changelog-005-005-deep-review-findings.md](./changelog/005-graph-impact-and-affordance/changelog-005-005-deep-review-findings.md) |
| `004-code-graph/005-resilience-and-advisor/001-code-graph-advisor-refinement` | impl | [changelog-005-001-code-graph-advisor-refinement.md](./changelog/004-code-graph/changelog-005-001-code-graph-advisor-refinement.md) |
| `004-code-graph` |  | [changelog-004-code-graph-root.md](./changelog/004-code-graph/changelog-004-code-graph-root.md) (rollup indexes +25) |
| `003-memory-and-causal-runtime/025-tool-layer-map-unlink` | impl | [changelog-025-tool-layer-map-unlink.md](./changelog/003-memory-and-causal-runtime/changelog-025-tool-layer-map-unlink.md) |
| `003-memory-and-causal-runtime/024-launcher-lease-integration-test` | impl | [changelog-024-launcher-lease-integration-test.md](./changelog/003-memory-and-causal-runtime/changelog-024-launcher-lease-integration-test.md) |
| `003-memory-and-causal-runtime/022-readme-doc-sync` | impl | [changelog-022-readme-doc-sync.md](./changelog/003-memory-and-causal-runtime/changelog-022-readme-doc-sync.md) |
| `003-memory-and-causal-runtime/018-front-proxy-recycle-hardening` | impl | [changelog-018-front-proxy-recycle-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-018-front-proxy-recycle-hardening.md) |
| `003-memory-and-causal-runtime/019-causal-relation-coverage-honesty` | impl | [changelog-019-causal-relation-coverage-honesty.md](./changelog/003-memory-and-causal-runtime/changelog-019-causal-relation-coverage-honesty.md) |
| `003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on` | impl | [changelog-017-enrichment-reconsolidation-default-on.md](./changelog/003-memory-and-causal-runtime/changelog-017-enrichment-reconsolidation-default-on.md) |
| `000-release-and-program-cleanup/011-analytics-and-learning-remediation` | impl | [changelog-011-analytics-and-learning-remediation.md](./changelog/000-release-and-program-cleanup/changelog-011-analytics-and-learning-remediation.md) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5` | impl | [changelog-010-005-scouted-bugfix-batch-5.md](./changelog/000-release-and-program-cleanup/changelog-010-005-scouted-bugfix-batch-5.md) |
| `003-memory-and-causal-runtime/015-opus-review-runtime-remediation` | impl | [changelog-015-opus-review-runtime-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-015-opus-review-runtime-remediation.md) |
| `003-memory-and-causal-runtime/014-docs-and-stress-test-refresh` |  | [changelog-014-docs-and-stress-test-refresh-root.md](./changelog/003-memory-and-causal-runtime/changelog-014-docs-and-stress-test-refresh-root.md) |
| `003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update` | impl | [changelog-014-003-readme-cluster-update.md](./changelog/003-memory-and-causal-runtime/changelog-014-003-readme-cluster-update.md) |
| `003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update` | impl | [changelog-014-002-feature-catalog-update.md](./changelog/003-memory-and-causal-runtime/changelog-014-002-feature-catalog-update.md) |
| `003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update` | impl | [changelog-014-001-manual-testing-playbook-update.md](./changelog/003-memory-and-causal-runtime/changelog-014-001-manual-testing-playbook-update.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair` | impl | [changelog-013-004-memory-save-enrichment-repair.md](./changelog/003-memory-and-causal-runtime/changelog-013-004-memory-save-enrichment-repair.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot` | impl | [changelog-013-002-checkpoint-v2-file-snapshot.md](./changelog/003-memory-and-causal-runtime/changelog-013-002-checkpoint-v2-file-snapshot.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index` | impl | [changelog-013-001-self-maintaining-index.md](./changelog/003-memory-and-causal-runtime/changelog-013-001-self-maintaining-index.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation` |  | [changelog-013-memory-index-scan-implementation-root.md](./changelog/003-memory-and-causal-runtime/changelog-013-memory-index-scan-implementation-root.md) (rollup indexes +1) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4` | impl | [changelog-010-004-scouted-bugfix-batch-4.md](./changelog/000-release-and-program-cleanup/changelog-010-004-scouted-bugfix-batch-4.md) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3` | impl | [changelog-010-003-scouted-bugfix-batch-3.md](./changelog/000-release-and-program-cleanup/changelog-010-003-scouted-bugfix-batch-3.md) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2` | impl | [changelog-010-002-scouted-bugfix-batch-2.md](./changelog/000-release-and-program-cleanup/changelog-010-002-scouted-bugfix-batch-2.md) |
| `000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1` | impl | [changelog-010-001-scouted-bugfix-batch-1.md](./changelog/000-release-and-program-cleanup/changelog-010-001-scouted-bugfix-batch-1.md) |
| `006-operator-tooling/006-doctor-install-alignment` | impl | [changelog-006-006-doctor-install-alignment.md](./changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass` |  | [changelog-003-cross-cutting-cleanup-pass-root.md](./changelog/000-release-and-program-cleanup/changelog-003-cross-cutting-cleanup-pass-root.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing` | impl | [changelog-003-016-runtime-hook-plugin-testing.md](./changelog/000-release-and-program-cleanup/changelog-003-016-runtime-hook-plugin-testing.md) |
| `003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain` | impl | [changelog-014-004-stress-test-durability-domain.md](./changelog/003-memory-and-causal-runtime/changelog-014-004-stress-test-durability-domain.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel` | impl | [changelog-013-005-checkpoint-needs-rebuild-sentinel.md](./changelog/003-memory-and-causal-runtime/changelog-013-005-checkpoint-needs-rebuild-sentinel.md) |
| `003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy` | impl | [changelog-013-003-front-proxy-in-place-recycle.md](./changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md)<br>[changelog-013-003-front-proxy-reconnect-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-reconnect-hardening.md) |
| `000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit` | impl | [changelog-008-002-changelog-backfill-and-audit.md](./changelog/000-release-and-program-cleanup/changelog-008-002-changelog-backfill-and-audit.md) |
| `003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening` | impl | [changelog-003-012-memory-index-scan-ux-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-003-012-memory-index-scan-ux-hardening.md) |
| `007-mcp-daemon-reliability/016-substrate-harness-hardening` | impl | [changelog-007-016-substrate-harness-hardening.md](./changelog/007-mcp-daemon-reliability/changelog-007-016-substrate-harness-hardening.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard` | impl | [changelog-015-006-sessionstart-worktree-guard.md](./changelog/007-mcp-daemon-reliability/changelog-015-006-sessionstart-worktree-guard.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation` | impl | [changelog-015-004-cli-child-marker-propagation.md](./changelog/007-mcp-daemon-reliability/changelog-015-004-cli-child-marker-propagation.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch` | impl | [changelog-015-003-worktree-child-marker-dispatch.md](./changelog/007-mcp-daemon-reliability/changelog-015-003-worktree-child-marker-dispatch.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/002-substrate-codegraph-scenarios` | impl | [changelog-015-002-substrate-codegraph-scenarios.md](./changelog/007-mcp-daemon-reliability/changelog-015-002-substrate-codegraph-scenarios.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test` | impl | [changelog-015-001-live-two-launcher-test.md](./changelog/007-mcp-daemon-reliability/changelog-015-001-live-two-launcher-test.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening` |  | [changelog-015-infra-followup-hardening-root.md](./changelog/007-mcp-daemon-reliability/changelog-015-infra-followup-hardening-root.md) (rollup indexes +2) |
| `007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing` | impl | [changelog-014-001-daemon-lifecycle-healing.md](./changelog/007-mcp-daemon-reliability/changelog-014-001-daemon-lifecycle-healing.md) |
| `006-operator-tooling/005-worktree-per-session-automation` | impl | [changelog-006-005-worktree-per-session-automation.md](./changelog/006-operator-tooling/changelog-006-005-worktree-per-session-automation.md) |
| `006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts` | impl | [changelog-006-004-runtime-agnostic-session-lifecycle-scripts.md](./changelog/006-operator-tooling/changelog-006-004-runtime-agnostic-session-lifecycle-scripts.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/008-deep-review-correctness-edges` | impl | [changelog-011-008-deep-review-correctness-edges.md](./changelog/003-memory-and-causal-runtime/changelog-011-008-deep-review-correctness-edges.md) |
| `007-mcp-daemon-reliability/010-at-rest-wal-durability` | impl | [changelog-007-010-at-rest-wal-durability.md](./changelog/007-mcp-daemon-reliability/changelog-007-010-at-rest-wal-durability.md) |
| `002-spec-kit-internals/006-orchestrator-placeholder-parity` | impl | [changelog-002-006-orchestrator-placeholder-parity.md](./changelog/002-spec-kit-internals/changelog-002-006-orchestrator-placeholder-parity.md) |
| `002-spec-kit-internals/005-validate-recursive-orchestrator-fix` | impl | [changelog-002-005-validate-recursive-orchestrator-fix.md](./changelog/002-spec-kit-internals/changelog-002-005-validate-recursive-orchestrator-fix.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening` | impl | [changelog-011-005-live-validation-bench-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-011-005-live-validation-bench-hardening.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/004-perf-instrumentation-batching` | impl | [changelog-011-004-perf-instrumentation-batching.md](./changelog/003-memory-and-causal-runtime/changelog-011-004-perf-instrumentation-batching.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch` | impl | [changelog-011-003-observability-model-switch.md](./changelog/003-memory-and-causal-runtime/changelog-011-003-observability-model-switch.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening` |  | [changelog-011-embedding-stack-hardening-root.md](./changelog/003-memory-and-causal-runtime/changelog-011-embedding-stack-hardening-root.md) |
| `004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings` | impl | [changelog-011-002-deferred-wip-overlapping-findings.md](./changelog/004-code-graph/changelog-011-002-deferred-wip-overlapping-findings.md) |
| `004-code-graph/011-source-bug-and-misalignment-audit` | impl | [changelog-011-source-bug-and-misalignment-audit-root.md](./changelog/004-code-graph/changelog-011-source-bug-and-misalignment-audit-root.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring` | impl | [changelog-010-006-skill-advisor-shared-wiring.md](./changelog/003-memory-and-causal-runtime/changelog-010-006-skill-advisor-shared-wiring.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar` | impl | [changelog-010-005-retire-sidecar.md](./changelog/003-memory-and-causal-runtime/changelog-010-005-retire-sidecar.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server` |  | [changelog-010-embedding-consolidation-hf-local-server-root.md](./changelog/003-memory-and-causal-runtime/changelog-010-embedding-consolidation-hf-local-server-root.md) |
| `002-spec-kit-internals` |  | [changelog-002-spec-kit-internals-root.md](./changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md) |
| `000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup` | impl | [changelog-008-001-docs-and-catalogs-rollup.md](./changelog/000-release-and-program-cleanup/changelog-008-001-docs-and-catalogs-rollup.md) |
| `000-release-and-program-cleanup/005-stress-test` |  | [changelog-005-stress-test-root.md](./changelog/000-release-and-program-cleanup/changelog-005-stress-test-root.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings` |  | [changelog-003-fix-mcp-runtime-stress-findings-root.md](./changelog/000-release-and-program-cleanup/changelog-003-fix-mcp-runtime-stress-findings-root.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook` | impl | [changelog-001-search-intelligence-stress-playbook-root.md](./changelog/000-release-and-program-cleanup/changelog-001-search-intelligence-stress-playbook-root.md) (rollup indexes +2) |
| `006-operator-tooling/001-hook-parity` |  | [changelog-001-hook-parity-root.md](./changelog/006-operator-tooling/changelog-001-hook-parity-root.md) (rollup indexes +7) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation` |  | [changelog-005-skill-advisor-documentation-root.md](./changelog/002-spec-kit-internals/changelog-005-skill-advisor-documentation-root.md) |
| `002-spec-kit-internals/003-template-levels` |  | [changelog-003-template-levels-root.md](./changelog/002-spec-kit-internals/changelog-003-template-levels-root.md) (rollup indexes +3) |
| `002-spec-kit-internals/001-resource-map-deep-loop-fix` |  | [changelog-001-resource-map-deep-loop-fix-root.md](./changelog/002-spec-kit-internals/changelog-001-resource-map-deep-loop-fix-root.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime` |  | [changelog-001-continuity-memory-runtime-root.md](./changelog/003-memory-and-causal-runtime/changelog-001-continuity-memory-runtime-root.md) (rollup indexes +1) |
| `002-spec-kit-internals/002-skill-advisor` |  | [changelog-002-skill-advisor-root.md](./changelog/002-spec-kit-internals/changelog-002-skill-advisor-root.md) (rollup indexes +13) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack` |  | [changelog-004-code-index-stack-root.md](./changelog/003-memory-and-causal-runtime/changelog-004-code-index-stack-root.md) |
| `003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp` | impl | [changelog-002-001-deliver-causal-graph-channel-routing-mvp.md](./changelog/003-memory-and-causal-runtime/changelog-002-001-deliver-causal-graph-channel-routing-mvp.md) |
| `000-release-and-program-cleanup/004-followup-post-program` |  | [changelog-004-followup-post-program-root.md](./changelog/000-release-and-program-cleanup/changelog-004-followup-post-program-root.md) |
| `003-memory-and-causal-runtime/002-causal-graph-channel-routing` |  | [changelog-002-causal-graph-channel-routing-root.md](./changelog/003-memory-and-causal-runtime/changelog-002-causal-graph-channel-routing-root.md) |
| `000-release-and-program-cleanup/004-followup-post-program/002-vitest-baseline-recovery-followup` | impl | [changelog-004-002-vitest-baseline-recovery-followup.md](./changelog/000-release-and-program-cleanup/changelog-004-002-vitest-baseline-recovery-followup.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery` | impl | [changelog-003-003-vitest-baseline-recovery.md](./changelog/000-release-and-program-cleanup/changelog-003-003-vitest-baseline-recovery.md) |
| `004-code-graph/005-resilience-and-advisor/005-doctor-apply-mode-implementation` | impl | [changelog-005-005-doctor-apply-mode-implementation.md](./changelog/004-code-graph/changelog-005-005-doctor-apply-mode-implementation.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability` | impl | [changelog-001-006-fix-memory-search-health-fallback-stability.md](./changelog/003-memory-and-causal-runtime/changelog-001-006-fix-memory-search-health-fallback-stability.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph` |  | [changelog-001-skill-graph-root.md](./changelog/002-spec-kit-internals/changelog-001-skill-graph-root.md) (rollup indexes +2) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction` |  | [changelog-006-system-skill-advisor-package-extraction-root.md](./changelog/002-spec-kit-internals/changelog-006-system-skill-advisor-package-extraction-root.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation` |  | [changelog-005-finding-remediation-root.md](./changelog/002-spec-kit-internals/changelog-005-finding-remediation-root.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation` |  | [changelog-006-playbook-run-and-remediation-root.md](./changelog/002-spec-kit-internals/changelog-006-playbook-run-and-remediation-root.md) |
| `004-code-graph/010-playbook-validation-and-hardening` |  | [changelog-010-playbook-validation-and-hardening-root.md](./changelog/004-code-graph/changelog-010-playbook-validation-and-hardening-root.md) |
| `004-code-graph/007-docs-and-readmes` |  | [changelog-007-docs-and-readmes-root.md](./changelog/004-code-graph/changelog-007-docs-and-readmes-root.md) |
| `004-code-graph/004-runtime-and-scan` |  | [changelog-004-runtime-and-scan-root.md](./changelog/004-code-graph/changelog-004-runtime-and-scan-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2` |  | [changelog-021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2-root.md](./changelog/003-memory-and-causal-runtime/changelog-021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes` |  | [changelog-020-fix-investigation-deferred-p2s-for-behavior-and-api-changes-root.md](./changelog/003-memory-and-causal-runtime/changelog-020-fix-investigation-deferred-p2s-for-behavior-and-api-changes-root.md) |
| `006-operator-tooling/003-install-scripts-doctor-realignment` |  | [changelog-003-install-scripts-doctor-realignment-root.md](./changelog/006-operator-tooling/changelog-003-install-scripts-doctor-realignment-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc` |  | [changelog-022-hardcoded-default-remediation-arc-root.md](./changelog/003-memory-and-causal-runtime/changelog-022-hardcoded-default-remediation-arc-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc` |  | [changelog-011-spec-memory-rerank-decision-arc-root.md](./changelog/003-memory-and-causal-runtime/changelog-011-spec-memory-rerank-decision-arc-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc` |  | [changelog-008-rerank-sidecar-arc-root.md](./changelog/003-memory-and-causal-runtime/changelog-008-rerank-sidecar-arc-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots` |  | [changelog-023-deep-research-arc-blind-spots-root.md](./changelog/003-memory-and-causal-runtime/changelog-023-deep-research-arc-blind-spots-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion` |  | [changelog-007-ollama-and-bge-promotion-root.md](./changelog/003-memory-and-causal-runtime/changelog-007-ollama-and-bge-promotion-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack` |  | [changelog-003-skill-advisor-stack-root.md](./changelog/003-memory-and-causal-runtime/changelog-003-skill-advisor-stack-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment` |  | [changelog-003-skill-docs-alignment-root.md](./changelog/003-memory-and-causal-runtime/changelog-003-skill-docs-alignment-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality` |  | [changelog-005-cross-cutting-quality-root.md](./changelog/003-memory-and-causal-runtime/changelog-005-cross-cutting-quality-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack` |  | [changelog-002-spec-memory-stack-root.md](./changelog/003-memory-and-causal-runtime/changelog-002-spec-memory-stack-root.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit` |  | [changelog-001-playbook-quality-audit-root.md](./changelog/003-memory-and-causal-runtime/changelog-001-playbook-quality-audit-root.md) |
| `002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening` |  | [changelog-004-skill-advisor-production-hardening-root.md](./changelog/002-spec-kit-internals/changelog-004-skill-advisor-production-hardening-root.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine` |  | [changelog-003-skill-advisor-routing-engine-root.md](./changelog/002-spec-kit-internals/changelog-003-skill-advisor-routing-engine-root.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine` |  | [changelog-002-skill-advisor-scoring-engine-root.md](./changelog/002-spec-kit-internals/changelog-002-skill-advisor-scoring-engine-root.md) |
| `000-release-and-program-cleanup/006-research` |  | [changelog-006-research-root.md](./changelog/000-release-and-program-cleanup/changelog-006-research-root.md) |
| `000-release-and-program-cleanup/002-audit` |  | [changelog-002-audit-root.md](./changelog/000-release-and-program-cleanup/changelog-002-audit-root.md) |
| `000-release-and-program-cleanup/001-release-readiness` |  | [changelog-001-release-readiness-root.md](./changelog/000-release-and-program-cleanup/changelog-001-release-readiness-root.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor` |  | [changelog-004-documentation-quality-refactor-root.md](./changelog/002-spec-kit-internals/changelog-004-documentation-quality-refactor-root.md) |
| `004-code-graph/008-real-world-usefulness-test-planning` | impl | [changelog-008-real-world-usefulness-test-planning-root.md](./changelog/004-code-graph/changelog-008-real-world-usefulness-test-planning-root.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings` |  | [changelog-004-fix-deep-research-findings-root.md](./changelog/000-release-and-program-cleanup/changelog-004-fix-deep-research-findings-root.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits` |  | [changelog-003-release-readiness-deep-review-audits-root.md](./changelog/000-release-and-program-cleanup/changelog-003-release-readiness-deep-review-audits-root.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass` |  | [changelog-003-post-program-quality-pass-root.md](./changelog/000-release-and-program-cleanup/changelog-003-post-program-quality-pass-root.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation` |  | [changelog-009-phase-parent-lean-trio-documentation-root.md](./changelog/000-release-and-program-cleanup/changelog-009-phase-parent-lean-trio-documentation-root.md) |
| `001-research-and-baseline` |  | [changelog-001-research-and-baseline-root.md](./changelog/001-research-and-baseline/changelog-001-research-and-baseline-root.md) |
| `000-release-and-program-cleanup/001-release-readiness/004-fix-release-readiness-findings-synthesis` | impl | [changelog-001-004-fix-release-readiness-findings-synthesis.md](./changelog/000-release-and-program-cleanup/changelog-001-004-fix-release-readiness-findings-synthesis.md) |
| `000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion` | impl | [changelog-005-004-stress-test-folder-completion.md](./changelog/000-release-and-program-cleanup/changelog-005-004-stress-test-folder-completion.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/014-resource-map-memory-finalization` | impl | [changelog-003-014-resource-map-memory-finalization.md](./changelog/000-release-and-program-cleanup/changelog-003-014-resource-map-memory-finalization.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/011-cli-matrix-adapter-runners` | impl | [changelog-003-011-cli-matrix-adapter-runners.md](./changelog/000-release-and-program-cleanup/changelog-003-011-cli-matrix-adapter-runners.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/022-stress-test-results-deep-research` | impl | [changelog-003-022-stress-test-results-deep-research.md](./changelog/000-release-and-program-cleanup/changelog-003-022-stress-test-results-deep-research.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/020-enterprise-readiness-verification-expansion-research` | impl | [changelog-003-020-enterprise-readiness-verification-expansion-research.md](./changelog/000-release-and-program-cleanup/changelog-003-020-enterprise-readiness-verification-expansion-research.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/016-degraded-readiness-envelope-parity` | impl | [changelog-003-016-degraded-readiness-envelope-parity.md](./changelog/000-release-and-program-cleanup/changelog-003-016-degraded-readiness-envelope-parity.md) |
| `001-research-and-baseline/005-claudest` | impl | [changelog-001-005-claudest.md](./changelog/001-research-and-baseline/changelog-001-005-claudest.md) |
| `001-research-and-baseline/003-contextador` | impl | [changelog-001-003-contextador.md](./changelog/001-research-and-baseline/changelog-001-003-contextador.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename` | impl | [changelog-006-015-mcp-server-mk-skill-advisor-rename.md](./changelog/002-spec-kit-internals/changelog-006-015-mcp-server-mk-skill-advisor-rename.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner` | impl | [changelog-001-046-shared-daemon-suite-runner.md](./changelog/003-memory-and-causal-runtime/changelog-001-046-shared-daemon-suite-runner.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/009-fix-script-filesystem-scope` | impl | [changelog-006-009-fix-script-filesystem-scope.md](./changelog/002-spec-kit-internals/changelog-006-009-fix-script-filesystem-scope.md) |
| `007-mcp-daemon-reliability/013-standalone-save-second-writer-guard` | impl | [changelog-007-013-standalone-save-second-writer-guard.md](./changelog/007-mcp-daemon-reliability/changelog-007-013-standalone-save-second-writer-guard.md) |
| `007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon` | impl | [changelog-015-005-substrate-codegraph-2nd-daemon.md](./changelog/007-mcp-daemon-reliability/changelog-015-005-substrate-codegraph-2nd-daemon.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster` | impl | [changelog-011-009-single-writer-durability-cluster.md](./changelog/003-memory-and-causal-runtime/changelog-011-009-single-writer-durability-cluster.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep` | impl | [changelog-011-007-ephemeral-pointer-guard-and-sweep.md](./changelog/003-memory-and-causal-runtime/changelog-011-007-ephemeral-pointer-guard-and-sweep.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup` | impl | [changelog-011-006-comment-ephemeral-pointer-cleanup.md](./changelog/003-memory-and-causal-runtime/changelog-011-006-comment-ephemeral-pointer-cleanup.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/002-server-liveness-supervision` | impl | [changelog-011-002-server-liveness-supervision.md](./changelog/003-memory-and-causal-runtime/changelog-011-002-server-liveness-supervision.md) |
| `003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket` | impl | [changelog-011-001-selector-and-shared-socket.md](./changelog/003-memory-and-causal-runtime/changelog-011-001-selector-and-shared-socket.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision` | impl | [changelog-010-004-launcher-supervision.md](./changelog/003-memory-and-causal-runtime/changelog-010-004-launcher-supervision.md)<br>[changelog-010-embedding-consolidation-hf-local-server.md](./changelog/003-memory-and-causal-runtime/changelog-010-embedding-consolidation-hf-local-server.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client` | impl | [changelog-010-003-hf-local-http-client.md](./changelog/003-memory-and-causal-runtime/changelog-010-003-hf-local-http-client.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server` | impl | [changelog-010-002-hf-model-server.md](./changelog/003-memory-and-causal-runtime/changelog-010-002-hf-model-server.md) |
| `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/001-nomic-only-consolidation` | impl | [changelog-010-001-nomic-only-consolidation.md](./changelog/003-memory-and-causal-runtime/changelog-010-001-nomic-only-consolidation.md) |
| `004-code-graph/013-owner-lease-election-race` | impl | [changelog-004-013-owner-lease-election-race.md](./changelog/004-code-graph/changelog-004-013-owner-lease-election-race.md) |
| `007-mcp-daemon-reliability/012-boot-integrity-retention-probe` | impl | [changelog-007-012-boot-integrity-retention-probe.md](./changelog/007-mcp-daemon-reliability/changelog-007-012-boot-integrity-retention-probe.md) |
| `007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph` | impl | [changelog-007-011-deep-review-shutdown-and-codegraph.md](./changelog/007-mcp-daemon-reliability/changelog-007-011-deep-review-shutdown-and-codegraph.md) |
| `007-mcp-daemon-reliability/009-shutdown-durability` | impl | [changelog-007-009-shutdown-durability.md](./changelog/007-mcp-daemon-reliability/changelog-007-009-shutdown-durability.md) |
| `007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close` | impl | [changelog-007-008-spec-memory-graceful-wal-checkpoint-on-close.md](./changelog/007-mcp-daemon-reliability/changelog-007-008-spec-memory-graceful-wal-checkpoint-on-close.md) |
| `004-code-graph/012-empty-graph-first-time-auto-scan` | impl | [changelog-004-012-empty-graph-first-time-auto-scan.md](./changelog/004-code-graph/changelog-004-012-empty-graph-first-time-auto-scan.md) |
| `004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local` | impl | [changelog-011-003-db-location-skill-local.md](./changelog/004-code-graph/changelog-011-003-db-location-skill-local.md) |
| `004-code-graph/011-source-bug-and-misalignment-audit/001-applied-source-and-doc-fixes` | impl | [changelog-011-001-applied-source-and-doc-fixes.md](./changelog/004-code-graph/changelog-011-001-applied-source-and-doc-fixes.md) |
| `007-mcp-daemon-reliability/007-bridge-liveness-reap` | impl | [changelog-007-007-bridge-liveness-reap.md](./changelog/007-mcp-daemon-reliability/changelog-007-007-bridge-liveness-reap.md) |
| `007-mcp-daemon-reliability/006-graceful-exit-watchdog` | impl | [changelog-007-006-graceful-exit-watchdog.md](./changelog/007-mcp-daemon-reliability/changelog-007-006-graceful-exit-watchdog.md) |
| `007-mcp-daemon-reliability/005-provider-dispose` | impl | [changelog-007-005-provider-dispose.md](./changelog/007-mcp-daemon-reliability/changelog-007-005-provider-dispose.md) |
| `007-mcp-daemon-reliability/004-nondestructive-build` | impl | [changelog-007-004-nondestructive-build.md](./changelog/007-mcp-daemon-reliability/changelog-007-004-nondestructive-build.md) |
| `007-mcp-daemon-reliability/003-daemon-reliability-research` | impl | [changelog-007-003-daemon-reliability-research.md](./changelog/007-mcp-daemon-reliability/changelog-007-003-daemon-reliability-research.md) |
| `007-mcp-daemon-reliability/002-code-graph-initial-scan` | impl | [changelog-007-002-code-graph-initial-scan.md](./changelog/007-mcp-daemon-reliability/changelog-007-002-code-graph-initial-scan.md) |
| `007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize` | impl | [changelog-007-001-ipc-socket-dir-canonicalize.md](./changelog/007-mcp-daemon-reliability/changelog-007-001-ipc-socket-dir-canonicalize.md) |
| `003-memory-and-causal-runtime/009-embedder-auto-resolution-fix` | impl | [changelog-003-009-embedder-auto-resolution-fix.md](./changelog/003-memory-and-causal-runtime/changelog-003-009-embedder-auto-resolution-fix.md) |
| `003-memory-and-causal-runtime/008-embedder-provider-auto-resolution` | impl | [changelog-003-008-embedder-provider-auto-resolution.md](./changelog/003-memory-and-causal-runtime/changelog-003-008-embedder-provider-auto-resolution.md) |
| `003-memory-and-causal-runtime/007-success-vector-coverage-hygiene` | impl | [changelog-003-007-success-vector-coverage-hygiene.md](./changelog/003-memory-and-causal-runtime/changelog-003-007-success-vector-coverage-hygiene.md) |
| `003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool` | impl | [changelog-003-006-memory-embedding-reconcile-tool.md](./changelog/003-memory-and-causal-runtime/changelog-003-006-memory-embedding-reconcile-tool.md) |
| `004-code-graph/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag` | impl | [changelog-010-008-blast-radius-transitive-flag.md](./changelog/004-code-graph/changelog-010-008-blast-radius-transitive-flag.md) |
| `004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022` | impl | [changelog-010-007-followup-hook-docs-and-022.md](./changelog/004-code-graph/changelog-010-007-followup-hook-docs-and-022.md) |
| `003-memory-and-causal-runtime/005-embedding-status-integrity` | impl | [changelog-003-005-embedding-status-integrity.md](./changelog/003-memory-and-causal-runtime/changelog-003-005-embedding-status-integrity.md) |
| `004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery` | impl | [changelog-010-006-parser-quarantine-recovery.md](./changelog/004-code-graph/changelog-010-006-parser-quarantine-recovery.md) |
| `004-code-graph/010-playbook-validation-and-hardening/005-db-binding-cleanup` | impl | [changelog-010-005-db-binding-cleanup.md](./changelog/004-code-graph/changelog-010-005-db-binding-cleanup.md) |
| `004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes` | impl | [changelog-010-004-hook-and-doc-fixes.md](./changelog/004-code-graph/changelog-010-004-hook-and-doc-fixes.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning` | impl | [changelog-006-006-p1-routing-tuning.md](./changelog/002-spec-kit-internals/changelog-006-006-p1-routing-tuning.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path` | impl | [changelog-005-007-harness-alias-and-stale-path.md](./changelog/002-spec-kit-internals/changelog-005-007-harness-alias-and-stale-path.md) |
| `003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation` | impl | [changelog-003-004-embedding-backlog-drain-investigation.md](./changelog/003-memory-and-causal-runtime/changelog-003-004-embedding-backlog-drain-investigation.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/006-playbook-vitest-path-fix` | impl | [changelog-005-006-playbook-vitest-path-fix.md](./changelog/002-spec-kit-internals/changelog-005-006-playbook-vitest-path-fix.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route` | impl | [changelog-005-005-opencode-bridge-native-route.md](./changelog/002-spec-kit-internals/changelog-005-005-opencode-bridge-native-route.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync` | impl | [changelog-005-004-semantic-shadow-doc-sync.md](./changelog/002-spec-kit-internals/changelog-005-004-semantic-shadow-doc-sync.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/003-pc005-bench-doc-and-gates` | impl | [changelog-005-003-pc005-bench-doc-and-gates.md](./changelog/002-spec-kit-internals/changelog-005-003-pc005-bench-doc-and-gates.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes` | impl | [changelog-005-002-scorer-p0-routing-fixes.md](./changelog/002-spec-kit-internals/changelog-005-002-scorer-p0-routing-fixes.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching` | impl | [changelog-005-001-advisor-validate-alias-matching.md](./changelog/002-spec-kit-internals/changelog-005-001-advisor-validate-alias-matching.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/004-shell-python-daemon` | impl | [changelog-006-004-shell-python-daemon.md](./changelog/002-spec-kit-internals/changelog-006-004-shell-python-daemon.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin` | impl | [changelog-006-003-cli-hooks-and-plugin.md](./changelog/002-spec-kit-internals/changelog-006-003-cli-hooks-and-plugin.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/002-mcp-native-scenarios` | impl | [changelog-006-002-mcp-native-scenarios.md](./changelog/002-spec-kit-internals/changelog-006-002-mcp-native-scenarios.md) |
| `002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build` | impl | [changelog-006-001-preconditions-and-build.md](./changelog/002-spec-kit-internals/changelog-006-001-preconditions-and-build.md) |
| `004-code-graph/010-playbook-validation-and-hardening/003-release-readiness-synthesis` | impl | [changelog-010-003-release-readiness-synthesis.md](./changelog/004-code-graph/changelog-010-003-release-readiness-synthesis.md) |
| `004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios` | impl | [changelog-010-002-devin-static-scenarios.md](./changelog/004-code-graph/changelog-010-002-devin-static-scenarios.md) |
| `004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios` | impl | [changelog-010-001-opencode-runtime-scenarios.md](./changelog/004-code-graph/changelog-010-001-opencode-runtime-scenarios.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2` | impl | [changelog-021-001-identify-and-close-3-remaining-deferred-p2.md](./changelog/003-memory-and-causal-runtime/changelog-021-001-identify-and-close-3-remaining-deferred-p2.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape` | impl | [changelog-020-004-fix-deferred-p2s-for-api-response-shape.md](./changelog/003-memory-and-causal-runtime/changelog-020-004-fix-deferred-p2s-for-api-response-shape.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate` | impl | [changelog-019-002-implement-layer-b-sidecar-self-check-and-in-flight-gate.md](./changelog/003-memory-and-causal-runtime/changelog-019-002-implement-layer-b-sidecar-self-check-and-in-flight-gate.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid` | impl | [changelog-019-001-implement-ledger-v2-schema-and-identity-verified-pid.md](./changelog/003-memory-and-causal-runtime/changelog-019-001-implement-ledger-v2-schema-and-identity-verified-pid.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture` | impl | [changelog-018-001-investigate-and-design-reaper-architecture.md](./changelog/003-memory-and-causal-runtime/changelog-018-001-investigate-and-design-reaper-architecture.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers` | impl | [changelog-017-003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers.md](./changelog/003-memory-and-causal-runtime/changelog-017-003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode` | impl | [changelog-017-001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode.md](./changelog/003-memory-and-causal-runtime/changelog-017-001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability` | impl | [changelog-020-003-fix-deferred-p2s-for-filesystem-durability.md](./changelog/003-memory-and-causal-runtime/changelog-020-003-fix-deferred-p2s-for-filesystem-durability.md) |
| `004-code-graph/003-code-graph-workspace-root-fix` | impl | [changelog-004-003-code-graph-workspace-root-fix.md](./changelog/004-code-graph/changelog-004-003-code-graph-workspace-root-fix.md) |
| `006-operator-tooling/003-install-scripts-doctor-realignment/004-deferred-followups-and-cleanup` | impl | [changelog-003-004-deferred-followups-and-cleanup.md](./changelog/006-operator-tooling/changelog-003-004-deferred-followups-and-cleanup.md) |
| `006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment` | impl | [changelog-003-003-advisor-adjacent-116-realignment.md](./changelog/006-operator-tooling/changelog-003-003-advisor-adjacent-116-realignment.md) |
| `006-operator-tooling/003-install-scripts-doctor-realignment/002-operator-surface-realignment` | impl | [changelog-003-002-operator-surface-realignment.md](./changelog/006-operator-tooling/changelog-003-002-operator-surface-realignment.md) |
| `006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor` | impl | [changelog-003-001-deep-research-install-scripts-doctor.md](./changelog/006-operator-tooling/changelog-003-001-deep-research-install-scripts-doctor.md) |
| `004-code-graph/002-deprecate-coco-index/016-remediate-residue-tail` | impl | [changelog-002-016-remediate-residue-tail.md](./changelog/004-code-graph/changelog-002-016-remediate-residue-tail.md) |
| `004-code-graph/002-deprecate-coco-index/015-remediate-cross-surface-residue` | impl | [changelog-002-015-remediate-cross-surface-residue.md](./changelog/004-code-graph/changelog-002-015-remediate-cross-surface-residue.md) |
| `004-code-graph/002-deprecate-coco-index/014-remediate-codegraph-naming` | impl | [changelog-002-014-remediate-codegraph-naming.md](./changelog/004-code-graph/changelog-002-014-remediate-codegraph-naming.md) |
| `004-code-graph/002-deprecate-coco-index/008-runtime-artifacts-cleanup` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/007-docs-readme-search-routing` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/006-runtime-configs-4runtime-mirror` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/005-remove-coco-index-skill` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/004-remove-rerank-sidecar-skill` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/003-remove-memory-rerank-path` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/002-decouple-code-graph` |  | (none) |
| `004-code-graph/002-deprecate-coco-index/001-touchpoint-research` | impl | [changelog-002-001-touchpoint-research.md](./changelog/004-code-graph/changelog-002-001-touchpoint-research.md) |
| `004-code-graph/002-deprecate-coco-index/013-post-deprecation-deep-review` |  | [changelog-002-013-post-deprecation-deep-review.md](./changelog/004-code-graph/changelog-002-013-post-deprecation-deep-review.md) |
| `004-code-graph/002-deprecate-coco-index/010-remove-memory-coco-integration` |  | [changelog-002-010-remove-memory-coco-integration.md](./changelog/004-code-graph/changelog-002-010-remove-memory-coco-integration.md) |
| `004-code-graph/007-docs-and-readmes/006-reference-template-alignment` | impl | [changelog-007-006-reference-template-alignment.md](./changelog/004-code-graph/changelog-007-006-reference-template-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/007-reference-template-alignment` | impl | [changelog-005-007-reference-template-alignment.md](./changelog/002-spec-kit-internals/changelog-005-007-reference-template-alignment.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention` | impl | [changelog-009-022-orphan-mcp-leak-prevention.md](./changelog/003-memory-and-causal-runtime/changelog-009-022-orphan-mcp-leak-prevention.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout` | impl | [changelog-022-014-deferred-closeout.md](./changelog/003-memory-and-causal-runtime/changelog-022-014-deferred-closeout.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue` | impl | [changelog-022-013-remove-voyage-cohere-residue.md](./changelog/003-memory-and-causal-runtime/changelog-022-013-remove-voyage-cohere-residue.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue` | impl | [changelog-022-012-remove-llama-cpp-residue.md](./changelog/003-memory-and-causal-runtime/changelog-022-012-remove-llama-cpp-residue.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons` | impl | [changelog-022-011-arc-022-followons.md](./changelog/003-memory-and-causal-runtime/changelog-022-011-arc-022-followons.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/007-code-graph-p1-config-extraction` | impl | [changelog-022-007-code-graph-p1-config-extraction.md](./changelog/003-memory-and-causal-runtime/changelog-022-007-code-graph-p1-config-extraction.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation` | impl | [changelog-022-005-spec-memory-p1-registry-consolidation.md](./changelog/003-memory-and-causal-runtime/changelog-022-005-spec-memory-p1-registry-consolidation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven` | impl | [changelog-022-009-cascade-thresholds-env-driven.md](./changelog/003-memory-and-causal-runtime/changelog-022-009-cascade-thresholds-env-driven.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup` | impl | [changelog-022-008-rerank-sidecar-p1-dedup.md](./changelog/003-memory-and-causal-runtime/changelog-022-008-rerank-sidecar-p1-dedup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup` | impl | [changelog-022-006-cocoindex-p1-dedup.md](./changelog/003-memory-and-causal-runtime/changelog-022-006-cocoindex-p1-dedup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill` | impl | [changelog-022-003-codex-agents-mirror-fill.md](./changelog/003-memory-and-causal-runtime/changelog-022-003-codex-agents-mirror-fill.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync` | impl | [changelog-022-002-cocoindex-embedder-doc-drift-resync.md](./changelog/003-memory-and-causal-runtime/changelog-022-002-cocoindex-embedder-doc-drift-resync.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator` | impl | [changelog-022-010-adr-writing-and-doc-validator.md](./changelog/003-memory-and-causal-runtime/changelog-022-010-adr-writing-and-doc-validator.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc` | impl | [changelog-021-003-align-arc-020-spec-docs-with-sk-doc.md](./changelog/003-memory-and-causal-runtime/changelog-021-003-align-arc-020-spec-docs-with-sk-doc.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix` | impl | [changelog-022-001-profile-ts-fallback-fix.md](./changelog/003-memory-and-causal-runtime/changelog-022-001-profile-ts-fallback-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code` | impl | [changelog-021-002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code.md](./changelog/003-memory-and-causal-runtime/changelog-021-002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure` | impl | [changelog-011-005-opt-in-only-closure.md](./changelog/003-memory-and-causal-runtime/changelog-011-005-opt-in-only-closure.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit` | impl | [changelog-011-004-retrieval-and-fixture-audit.md](./changelog/003-memory-and-causal-runtime/changelog-011-004-retrieval-and-fixture-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune` | impl | [changelog-011-003-domain-tuned-finetune.md](./changelog/003-memory-and-causal-runtime/changelog-011-003-domain-tuned-finetune.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial` | impl | [changelog-011-002-bge-v2-m3-trial.md](./changelog/003-memory-and-causal-runtime/changelog-011-002-bge-v2-m3-trial.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit` | impl | [changelog-011-001-off-baseline-audit.md](./changelog/003-memory-and-causal-runtime/changelog-011-001-off-baseline-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune` | impl | [changelog-008-010-domain-tuned-reranker-finetune.md](./changelog/003-memory-and-causal-runtime/changelog-008-010-domain-tuned-reranker-finetune.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank` | impl | [changelog-008-009-fp16-rerank.md](./changelog/003-memory-and-causal-runtime/changelog-008-009-fp16-rerank.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k` | impl | [changelog-008-008-cap-rerank-top-k.md](./changelog/003-memory-and-causal-runtime/changelog-008-008-cap-rerank-top-k.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion` | impl | [changelog-008-007-spec-memory-mps-rerank-promotion.md](./changelog/003-memory-and-causal-runtime/changelog-008-007-spec-memory-mps-rerank-promotion.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar` | impl | [changelog-008-006-cocoindex-dedup-from-shared-sidecar.md](./changelog/003-memory-and-causal-runtime/changelog-008-006-cocoindex-dedup-from-shared-sidecar.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default` | impl | [changelog-008-005-promote-qwen-as-default.md](./changelog/003-memory-and-causal-runtime/changelog-008-005-promote-qwen-as-default.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark` | impl | [changelog-008-004-spec-memory-rerank-benchmark.md](./changelog/003-memory-and-causal-runtime/changelog-008-004-spec-memory-rerank-benchmark.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers` | impl | [changelog-008-003-ensure-sidecar-from-launchers.md](./changelog/003-memory-and-causal-runtime/changelog-008-003-ensure-sidecar-from-launchers.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill` | impl | [changelog-008-002-system-rerank-sidecar-skill.md](./changelog/003-memory-and-causal-runtime/changelog-008-002-system-rerank-sidecar-skill.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder` | impl | [changelog-008-001-flag-routing-fix-for-cross-encoder.md](./changelog/003-memory-and-causal-runtime/changelog-008-001-flag-routing-fix-for-cross-encoder.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim` | impl | [changelog-006-013-launcher-lease-acquisition-reclaim.md](./changelog/003-memory-and-causal-runtime/changelog-006-013-launcher-lease-acquisition-reclaim.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index` | impl | [changelog-006-012-daemon-bridge-socket-for-skill-advisor-and-code-index.md](./changelog/003-memory-and-causal-runtime/changelog-006-012-daemon-bridge-socket-for-skill-advisor-and-code-index.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups` | impl | [changelog-006-011-sun-path-and-stale-lease-followups.md](./changelog/003-memory-and-causal-runtime/changelog-006-011-sun-path-and-stale-lease-followups.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair` | impl | [changelog-005-007-cocoindex-install-hygiene-pipx-repair.md](./changelog/003-memory-and-causal-runtime/changelog-005-007-cocoindex-install-hygiene-pipx-repair.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/021-hardcoded-default-audit-deep-research` |  | (none) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion` | impl | [changelog-001-029-local-llm-feature-test-suite-completion.md](./changelog/003-memory-and-causal-runtime/changelog-001-029-local-llm-feature-test-suite-completion.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix` | impl | [changelog-002-020-embedder-default-drift-fix.md](./changelog/003-memory-and-causal-runtime/changelog-002-020-embedder-default-drift-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign` | impl | [changelog-020-006-fix-deferred-p2s-for-provider-adapter-redesign.md](./changelog/003-memory-and-causal-runtime/changelog-020-006-fix-deferred-p2s-for-provider-adapter-redesign.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle` | impl | [changelog-020-005-fix-deferred-p2s-for-runtime-process-lifecycle.md](./changelog/003-memory-and-causal-runtime/changelog-020-005-fix-deferred-p2s-for-runtime-process-lifecycle.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior` | impl | [changelog-020-002-fix-deferred-p2s-for-env-and-config-behavior.md](./changelog/003-memory-and-causal-runtime/changelog-020-002-fix-deferred-p2s-for-env-and-config-behavior.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports` | impl | [changelog-020-001-fix-deferred-p2s-for-test-only-and-shared-exports.md](./changelog/003-memory-and-causal-runtime/changelog-020-001-fix-deferred-p2s-for-test-only-and-shared-exports.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs` | impl | [changelog-019-004-implement-env-knobs-and-skill-docs.md](./changelog/003-memory-and-causal-runtime/changelog-019-004-implement-env-knobs-and-skill-docs.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures` | impl | [changelog-019-003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures.md](./changelog/003-memory-and-causal-runtime/changelog-019-003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep` | impl | [changelog-017-005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep.md](./changelog/003-memory-and-causal-runtime/changelog-017-005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode` | impl | [changelog-017-004-fix-investigation-p1s-for-launcher-and-reindex-deadcode.md](./changelog/003-memory-and-causal-runtime/changelog-017-004-fix-investigation-p1s-for-launcher-and-reindex-deadcode.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks` | impl | [changelog-017-002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks.md](./changelog/003-memory-and-causal-runtime/changelog-017-002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity` | impl | [changelog-016-004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity.md](./changelog/003-memory-and-causal-runtime/changelog-016-004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle` | impl | [changelog-016-003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle.md](./changelog/003-memory-and-causal-runtime/changelog-016-003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation` | impl | [changelog-016-002-fix-investigation-p1s-for-resource-bounds-and-input-validation.md](./changelog/003-memory-and-causal-runtime/changelog-016-002-fix-investigation-p1s-for-resource-bounds-and-input-validation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification` | impl | [changelog-009-015-deep-research-drift-and-simplification.md](./changelog/003-memory-and-causal-runtime/changelog-009-015-deep-research-drift-and-simplification.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening` | impl | [changelog-009-014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-009-014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection` | impl | [changelog-009-013-owner-lease-heartbeat-staleness-detection.md](./changelog/003-memory-and-causal-runtime/changelog-009-013-owner-lease-heartbeat-staleness-detection.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark` | impl | [changelog-009-012-adapter-resident-memory-benchmark.md](./changelog/003-memory-and-causal-runtime/changelog-009-012-adapter-resident-memory-benchmark.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage` | impl | [changelog-009-011-system-code-graph-suite-triage.md](./changelog/003-memory-and-causal-runtime/changelog-009-011-system-code-graph-suite-triage.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook` | impl | [changelog-009-010-final-regression-and-operator-runbook.md](./changelog/003-memory-and-causal-runtime/changelog-009-010-final-regression-and-operator-runbook.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup` | impl | [changelog-009-009-spec-memory-runtime-retention-cleanup.md](./changelog/003-memory-and-causal-runtime/changelog-009-009-spec-memory-runtime-retention-cleanup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle` | impl | [changelog-009-008-sidecar-local-model-and-adapter-lifecycle.md](./changelog/003-memory-and-causal-runtime/changelog-009-008-sidecar-local-model-and-adapter-lifecycle.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle` | impl | [changelog-009-007-code-graph-launcher-and-db-lifecycle.md](./changelog/003-memory-and-causal-runtime/changelog-009-007-code-graph-launcher-and-db-lifecycle.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle` | impl | [changelog-009-006-cocoindex-remove-cancel-and-index-lifecycle.md](./changelog/003-memory-and-causal-runtime/changelog-009-006-cocoindex-remove-cancel-and-index-lifecycle.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep` | impl | [changelog-009-005-expected-daemon-classifier-and-process-sweep.md](./changelog/003-memory-and-causal-runtime/changelog-009-005-expected-daemon-classifier-and-process-sweep.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery` | impl | [changelog-009-004-deep-loop-locks-state-and-recovery.md](./changelog/003-memory-and-causal-runtime/changelog-009-004-deep-loop-locks-state-and-recovery.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards` | impl | [changelog-009-003-cli-dispatch-containment-and-recursion-guards.md](./changelog/003-memory-and-causal-runtime/changelog-009-003-cli-dispatch-containment-and-recursion-guards.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness` | impl | [changelog-009-002-telemetry-and-process-verification-harness.md](./changelog/003-memory-and-causal-runtime/changelog-009-002-telemetry-and-process-verification-harness.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map` | impl | [changelog-009-001-research-synthesis-and-remediation-map.md](./changelog/003-memory-and-causal-runtime/changelog-009-001-research-synthesis-and-remediation-map.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization` | impl | [changelog-005-008-spec-memory-vitest-stabilization.md](./changelog/003-memory-and-causal-runtime/changelog-005-008-spec-memory-vitest-stabilization.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory` | impl | [changelog-003-006-shared-embedder-logic-with-spec-memory.md](./changelog/003-memory-and-causal-runtime/changelog-003-006-shared-embedder-logic-with-spec-memory.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment` | impl | [changelog-023-010-public-repo-docs-alignment.md](./changelog/003-memory-and-causal-runtime/changelog-023-010-public-repo-docs-alignment.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/008-vec0-migration-fix-deferred` | impl | [changelog-023-008-vec0-migration-fix-deferred.md](./changelog/003-memory-and-causal-runtime/changelog-023-008-vec0-migration-fix-deferred.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry` | impl | [changelog-023-006-prompt-license-registry.md](./changelog/003-memory-and-causal-runtime/changelog-023-006-prompt-license-registry.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint` | impl | [changelog-023-004-metadata-fingerprint.md](./changelog/003-memory-and-causal-runtime/changelog-023-004-metadata-fingerprint.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux` | impl | [changelog-023-005-doctor-model-swap-ux.md](./changelog/003-memory-and-causal-runtime/changelog-023-005-doctor-model-swap-ux.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike` | impl | [changelog-023-003-upstream-rebase-spike.md](./changelog/003-memory-and-causal-runtime/changelog-023-003-upstream-rebase-spike.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening` | impl | [changelog-023-001-request-budget-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-023-001-request-budget-hardening.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner` | impl | [changelog-002-019-lineage-and-metadata-repair-runner.md](./changelog/003-memory-and-causal-runtime/changelog-002-019-lineage-and-metadata-repair-runner.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption` | impl | [changelog-002-018-constitutional-quality-gate-exemption.md](./changelog/003-memory-and-causal-runtime/changelog-002-018-constitutional-quality-gate-exemption.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation` | impl | [changelog-002-013-bm25-fts5-rag-fusion-investigation.md](./changelog/003-memory-and-causal-runtime/changelog-002-013-bm25-fts5-rag-fusion-investigation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split` | impl | [changelog-002-012-canonical-vector-shard-split.md](./changelog/003-memory-and-causal-runtime/changelog-002-012-canonical-vector-shard-split.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge` | impl | [changelog-002-007-auto-embedder-selection-and-llama-cpp-purge.md](./changelog/003-memory-and-causal-runtime/changelog-002-007-auto-embedder-selection-and-llama-cpp-purge.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default` | impl | [changelog-002-015-cascade-reorder-and-nomic-hf-local-default.md](./changelog/003-memory-and-causal-runtime/changelog-002-015-cascade-reorder-and-nomic-hf-local-default.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails` | impl | [changelog-002-014-fts5-default-lexical-with-guardrails.md](./changelog/003-memory-and-causal-runtime/changelog-002-014-fts5-default-lexical-with-guardrails.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai` | impl | [changelog-002-017-factory-shard-fallback-for-hf-voyage-openai.md](./changelog/003-memory-and-causal-runtime/changelog-002-017-factory-shard-fallback-for-hf-voyage-openai.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table` | impl | [changelog-002-016-reindex-populates-vec-memories-knn-table.md](./changelog/003-memory-and-causal-runtime/changelog-002-016-reindex-populates-vec-memories-knn-table.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation` | impl | [changelog-004-020-deep-review-p1-p2-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-004-020-deep-review-p1-p2-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging` | impl | [changelog-004-016-query-expansion-identifier-bridging.md](./changelog/003-memory-and-causal-runtime/changelog-004-016-query-expansion-identifier-bridging.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench` | impl | [changelog-004-018-rerank-matrix-rebench.md](./changelog/003-memory-and-causal-runtime/changelog-004-018-rerank-matrix-rebench.md) |
| `003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing` | impl | [changelog-002-002-fix-deep-review-findings-for-causal-graph-channel-routing.md](./changelog/003-memory-and-causal-runtime/changelog-002-002-fix-deep-review-findings-for-causal-graph-channel-routing.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction` | impl | [changelog-006-018-fix-followup-p2-findings-for-package-extraction.md](./changelog/002-spec-kit-internals/changelog-006-018-fix-followup-p2-findings-for-package-extraction.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/017-fix-deep-review-p1-findings-for-package-extraction` | impl | [changelog-006-017-fix-deep-review-p1-findings-for-package-extraction.md](./changelog/002-spec-kit-internals/changelog-006-017-fix-deep-review-p1-findings-for-package-extraction.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction` | impl | [changelog-006-016-fix-deep-review-p2-findings-for-package-extraction.md](./changelog/002-spec-kit-internals/changelog-006-016-fix-deep-review-p2-findings-for-package-extraction.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references` | impl | [changelog-006-013-remove-spec-kit-references.md](./changelog/002-spec-kit-internals/changelog-006-013-remove-spec-kit-references.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration` | impl | [changelog-004-017-hybrid-fusion-empirical-recalibration.md](./changelog/003-memory-and-causal-runtime/changelog-004-017-hybrid-fusion-empirical-recalibration.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference` | impl | [changelog-004-014-mirror-dedup-canonical-preference.md](./changelog/003-memory-and-causal-runtime/changelog-004-014-mirror-dedup-canonical-preference.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter` | impl | [changelog-004-015-code-aware-chunking-tree-sitter.md](./changelog/003-memory-and-causal-runtime/changelog-004-015-code-aware-chunking-tree-sitter.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit` | impl | [changelog-004-013-bench-harness-and-fixture-audit.md](./changelog/003-memory-and-causal-runtime/changelog-004-013-bench-harness-and-fixture-audit.md) |
| `002-spec-kit-internals/004-literal-spec-folder-names` | impl | [changelog-002-004-literal-spec-folder-names.md](./changelog/002-spec-kit-internals/changelog-002-004-literal-spec-folder-names.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc` | impl | [changelog-005-006-benchmark-format-to-sk-doc.md](./changelog/003-memory-and-causal-runtime/changelog-005-006-benchmark-format-to-sk-doc.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge` | impl | [changelog-006-010-multi-client-stdio-socket-bridge.md](./changelog/003-memory-and-causal-runtime/changelog-006-010-multi-client-stdio-socket-bridge.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration` | impl | [changelog-023-007-fixture-calibration.md](./changelog/003-memory-and-causal-runtime/changelog-023-007-fixture-calibration.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability` | impl | [changelog-023-002-retrieval-observability.md](./changelog/003-memory-and-causal-runtime/changelog-023-002-retrieval-observability.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution` | impl | [changelog-002-010-embedder-sidecar-execution.md](./changelog/003-memory-and-causal-runtime/changelog-002-010-embedder-sidecar-execution.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey` | impl | [changelog-007-004-newer-text-embedders-survey.md](./changelog/003-memory-and-causal-runtime/changelog-007-004-newer-text-embedders-survey.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating` | impl | [changelog-002-011-lazy-startup-gating.md](./changelog/003-memory-and-causal-runtime/changelog-002-011-lazy-startup-gating.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache` | impl | [changelog-002-009-byte-bounded-embedding-cache.md](./changelog/003-memory-and-causal-runtime/changelog-002-009-byte-bounded-embedding-cache.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry` | impl | [changelog-002-008-byte-aware-health-telemetry.md](./changelog/003-memory-and-causal-runtime/changelog-002-008-byte-aware-health-telemetry.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix` | impl | [changelog-006-009-launcher-eperm-parity-fix.md](./changelog/003-memory-and-causal-runtime/changelog-006-009-launcher-eperm-parity-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes` | impl | [changelog-004-012-fixture-audit-10-probes.md](./changelog/003-memory-and-causal-runtime/changelog-004-012-fixture-audit-10-probes.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation` | impl | [changelog-004-011-rerank-model-fit-investigation.md](./changelog/003-memory-and-causal-runtime/changelog-004-011-rerank-model-fit-investigation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring` | impl | [changelog-002-006-ollama-encode-path-wiring.md](./changelog/003-memory-and-causal-runtime/changelog-002-006-ollama-encode-path-wiring.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene` | impl | [changelog-005-005-cocoindex-install-hygiene.md](./changelog/003-memory-and-causal-runtime/changelog-005-005-cocoindex-install-hygiene.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene` | impl | [changelog-006-008-launcher-race-window-and-debug-log-hygiene.md](./changelog/003-memory-and-causal-runtime/changelog-006-008-launcher-race-window-and-debug-log-hygiene.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter` | impl | [changelog-007-002-cocoindex-ollama-adapter.md](./changelog/003-memory-and-causal-runtime/changelog-007-002-cocoindex-ollama-adapter.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format` | impl | [changelog-005-004-skill-local-benchmarks-format.md](./changelog/003-memory-and-causal-runtime/changelog-005-004-skill-local-benchmarks-format.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix` | impl | [changelog-006-007-skill-advisor-zombie-launcher-fix.md](./changelog/003-memory-and-causal-runtime/changelog-006-007-skill-advisor-zombie-launcher-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation` | impl | [changelog-007-001-indexer-surface-investigation.md](./changelog/003-memory-and-causal-runtime/changelog-007-001-indexer-surface-investigation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote` | impl | [changelog-007-003-bge-code-v1-confirmation-and-promote.md](./changelog/003-memory-and-causal-runtime/changelog-007-003-bge-code-v1-confirmation-and-promote.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack` | impl | [changelog-005-002-deep-review-stack.md](./changelog/003-memory-and-causal-runtime/changelog-005-002-deep-review-stack.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering` | impl | [changelog-006-006-lease-canonicalization-and-cleanup-ordering.md](./changelog/003-memory-and-causal-runtime/changelog-006-006-lease-canonicalization-and-cleanup-ordering.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability` | impl | [changelog-006-005-lease-correctness-and-arc-traceability.md](./changelog/003-memory-and-causal-runtime/changelog-006-005-lease-correctness-and-arc-traceability.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal` | impl | [changelog-003-032-public-doc-internal-spec-reference-removal.md](./changelog/000-release-and-program-cleanup/changelog-003-032-public-doc-internal-spec-reference-removal.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation` | impl | [changelog-006-014-manual-testing-playbook-validation.md](./changelog/002-spec-kit-internals/changelog-006-014-manual-testing-playbook-validation.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment` | impl | [changelog-006-012-sk-doc-documentation-alignment.md](./changelog/002-spec-kit-internals/changelog-006-012-sk-doc-documentation-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction` | impl | [changelog-006-011-mcp-server-package-extraction.md](./changelog/002-spec-kit-internals/changelog-006-011-mcp-server-package-extraction.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename` | impl | [changelog-006-010-skill-id-field-rename.md](./changelog/002-spec-kit-internals/changelog-006-010-skill-id-field-rename.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture` | impl | [changelog-004-002-baseline-fixture.md](./changelog/003-memory-and-causal-runtime/changelog-004-002-baseline-fixture.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry` | impl | [changelog-004-005-declarative-registry.md](./changelog/003-memory-and-causal-runtime/changelog-004-005-declarative-registry.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure` | impl | [changelog-004-003-comparison-measure.md](./changelog/003-memory-and-causal-runtime/changelog-004-003-comparison-measure.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates` | impl | [changelog-004-006-install-guide-updates.md](./changelog/003-memory-and-causal-runtime/changelog-004-006-install-guide-updates.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap` | impl | [changelog-004-001-cocoindex-swap.md](./changelog/003-memory-and-causal-runtime/changelog-004-001-cocoindex-swap.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish` | impl | [changelog-008-006-readiness-hooks-advisor-polish.md](./changelog/004-code-graph/changelog-008-006-readiness-hooks-advisor-polish.md) |
| `000-release-and-program-cleanup/005-stress-test/005-stress-test-expansion-alignment` | impl | [changelog-005-005-stress-test-expansion-alignment.md](./changelog/000-release-and-program-cleanup/changelog-005-005-stress-test-expansion-alignment.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract` | impl | [changelog-003-022-cli-skills-baseline-overlay-contract.md](./changelog/000-release-and-program-cleanup/changelog-003-022-cli-skills-baseline-overlay-contract.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep` | impl | [changelog-003-021-sk-doc-conformance-template-sweep.md](./changelog/000-release-and-program-cleanup/changelog-003-021-sk-doc-conformance-template-sweep.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/020-cocoindex-feature-catalog` | impl | [changelog-003-020-cocoindex-feature-catalog.md](./changelog/000-release-and-program-cleanup/changelog-003-020-cocoindex-feature-catalog.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/019-feature-catalog-shape-realignment` | impl | [changelog-003-019-feature-catalog-shape-realignment.md](./changelog/000-release-and-program-cleanup/changelog-003-019-feature-catalog-shape-realignment.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/018-matrix-runner-snake-case-rename` | impl | [changelog-003-018-matrix-runner-snake-case-rename.md](./changelog/000-release-and-program-cleanup/changelog-003-018-matrix-runner-snake-case-rename.md) |
| `000-release-and-program-cleanup/002-audit/007-runtime-command-agent-alignment-audit` | impl | [changelog-002-007-runtime-command-agent-alignment-audit.md](./changelog/000-release-and-program-cleanup/changelog-002-007-runtime-command-agent-alignment-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/005-fix-remaining-priority-findings` | impl | [changelog-001-005-fix-remaining-priority-findings.md](./changelog/000-release-and-program-cleanup/changelog-001-005-fix-remaining-priority-findings.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/010-upgrade-safety-operability-audit` | impl | [changelog-003-010-upgrade-safety-operability-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-010-upgrade-safety-operability-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/009-documentation-truth-audit` | impl | [changelog-003-009-documentation-truth-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-009-documentation-truth-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative` | impl | [changelog-003-003-embedder-pluggability-narrative.md](./changelog/003-memory-and-causal-runtime/changelog-003-003-embedder-pluggability-narrative.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update` | impl | [changelog-003-002-root-readme-update.md](./changelog/003-memory-and-causal-runtime/changelog-003-002-root-readme-update.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit` | impl | [changelog-003-001-skill-mds-audit.md](./changelog/003-memory-and-causal-runtime/changelog-003-001-skill-mds-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs` | impl | [changelog-003-003-install-guide-docs.md](./changelog/003-memory-and-causal-runtime/changelog-003-003-install-guide-docs.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture` | impl | [changelog-003-001-pluggable-architecture.md](./changelog/003-memory-and-causal-runtime/changelog-003-001-pluggable-architecture.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex` | impl | [changelog-003-002-jina-swap-and-reindex.md](./changelog/003-memory-and-causal-runtime/changelog-003-002-jina-swap-and-reindex.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/004-launcher-diagnostics-and-signal-coverage` | impl | [changelog-006-004-launcher-diagnostics-and-signal-coverage.md](./changelog/003-memory-and-causal-runtime/changelog-006-004-launcher-diagnostics-and-signal-coverage.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening` | impl | [changelog-006-003-launcher-race-and-error-surface-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-006-003-launcher-race-and-error-surface-hardening.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation` | impl | [changelog-006-002-cross-launcher-lease-propagation.md](./changelog/003-memory-and-causal-runtime/changelog-006-002-cross-launcher-lease-propagation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off` | impl | [changelog-004-004-extended-bake-off.md](./changelog/003-memory-and-causal-runtime/changelog-004-004-extended-bake-off.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion` | impl | [changelog-004-009-hybrid-search-bm25-fusion.md](./changelog/003-memory-and-causal-runtime/changelog-004-009-hybrid-search-bm25-fusion.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/008-chunking-strategy-tuning` | impl | [changelog-004-008-chunking-strategy-tuning.md](./changelog/003-memory-and-causal-runtime/changelog-004-008-chunking-strategy-tuning.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration` | impl | [changelog-004-007-reranker-integration.md](./changelog/003-memory-and-causal-runtime/changelog-004-007-reranker-integration.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix` | impl | [changelog-006-001-concurrent-daemon-corruption-fix.md](./changelog/003-memory-and-causal-runtime/changelog-006-001-concurrent-daemon-corruption-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire` | impl | [changelog-003-004-skill-graph-db-writer-cross-wire.md](./changelog/003-memory-and-causal-runtime/changelog-003-004-skill-graph-db-writer-cross-wire.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion` | impl | [changelog-001-003-scenario-expansion.md](./changelog/003-memory-and-causal-runtime/changelog-001-003-scenario-expansion.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/002-tool-coverage-audit` | impl | [changelog-001-002-tool-coverage-audit.md](./changelog/003-memory-and-causal-runtime/changelog-001-002-tool-coverage-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/001-fairness-audit` | impl | [changelog-001-001-fairness-audit.md](./changelog/003-memory-and-causal-runtime/changelog-001-001-fairness-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off` | impl | [changelog-002-004-spec-memory-embedder-bake-off.md](./changelog/003-memory-and-causal-runtime/changelog-002-004-spec-memory-embedder-bake-off.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex` | impl | [changelog-002-003-mcp-tools-and-reindex.md](./changelog/003-memory-and-causal-runtime/changelog-002-003-mcp-tools-and-reindex.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema` | impl | [changelog-002-002-ollama-backend-and-multi-dim-schema.md](./changelog/003-memory-and-causal-runtime/changelog-002-002-ollama-backend-and-multi-dim-schema.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface` | impl | [changelog-002-001-adapter-interface.md](./changelog/003-memory-and-causal-runtime/changelog-002-001-adapter-interface.md) |
| `004-code-graph/007-docs-and-readmes/005-cross-skill-doc-polish` | impl | [changelog-007-005-cross-skill-doc-polish.md](./changelog/004-code-graph/changelog-007-005-cross-skill-doc-polish.md) |
| `000-release-and-program-cleanup/005-stress-test/008-spec-memory-mcp-stress-test` | impl | [changelog-005-008-spec-memory-mcp-stress-test.md](./changelog/000-release-and-program-cleanup/changelog-005-008-spec-memory-mcp-stress-test.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/011-z-archive-memory-indexing` | impl | [changelog-001-011-z-archive-memory-indexing.md](./changelog/003-memory-and-causal-runtime/changelog-001-011-z-archive-memory-indexing.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/006-skill-readme-refinement-survey` | impl | [changelog-005-006-skill-readme-refinement-survey.md](./changelog/002-spec-kit-internals/changelog-005-006-skill-readme-refinement-survey.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling` | impl | [changelog-005-005-cross-skill-documentation-decoupling.md](./changelog/002-spec-kit-internals/changelog-005-005-cross-skill-documentation-decoupling.md) |
| `004-code-graph/009-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite` | impl | [changelog-009-002-readme-problem-first-rewrite.md](./changelog/004-code-graph/changelog-009-002-readme-problem-first-rewrite.md) |
| `004-code-graph/009-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish` | impl | [changelog-009-001-skill-docs-install-guide-and-readmes-polish.md](./changelog/004-code-graph/changelog-009-001-skill-docs-install-guide-and-readmes-polish.md) |
| `004-code-graph/001-mcp-shared-dependency-startup-fix` | impl | [changelog-004-001-mcp-shared-dependency-startup-fix.md](./changelog/004-code-graph/changelog-004-001-mcp-shared-dependency-startup-fix.md) |
| `004-code-graph/007-docs-and-readmes/004-doc-drift-alignment` | impl | [changelog-007-004-doc-drift-alignment.md](./changelog/004-code-graph/changelog-007-004-doc-drift-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/008-tier-d-documentation-execution` | impl | [changelog-004-008-tier-d-documentation-execution.md](./changelog/002-spec-kit-internals/changelog-004-008-tier-d-documentation-execution.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/007-finalize-documentation-quality-refactor` | impl | [changelog-004-007-finalize-documentation-quality-refactor.md](./changelog/002-spec-kit-internals/changelog-004-007-finalize-documentation-quality-refactor.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation` | impl | [changelog-004-006-clean-deferred-documentation.md](./changelog/002-spec-kit-internals/changelog-004-006-clean-deferred-documentation.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/005-content-additions-hvr-polish` | impl | [changelog-004-005-content-additions-hvr-polish.md](./changelog/002-spec-kit-internals/changelog-004-005-content-additions-hvr-polish.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/004-sk-doc-type-validation-alignment` | impl | [changelog-004-004-sk-doc-type-validation-alignment.md](./changelog/002-spec-kit-internals/changelog-004-004-sk-doc-type-validation-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite` | impl | [changelog-004-003-readme-problem-first-rewrite.md](./changelog/002-spec-kit-internals/changelog-004-003-readme-problem-first-rewrite.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/002-fix-documentation-bugs` | impl | [changelog-004-002-fix-documentation-bugs.md](./changelog/002-spec-kit-internals/changelog-004-002-fix-documentation-bugs.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/001-documentation-quality-audit-research` | impl | [changelog-004-001-documentation-quality-audit-research.md](./changelog/002-spec-kit-internals/changelog-004-001-documentation-quality-audit-research.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift` | impl | [changelog-005-003-fix-documentation-config-drift.md](./changelog/002-spec-kit-internals/changelog-005-003-fix-documentation-config-drift.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/055-cli-devin-deep-loop-alignment` | impl | [changelog-001-055-cli-devin-deep-loop-alignment.md](./changelog/003-memory-and-causal-runtime/changelog-001-055-cli-devin-deep-loop-alignment.md) |
| `000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit` | impl | [changelog-002-001-dependency-security-supply-chain-audit.md](./changelog/000-release-and-program-cleanup/changelog-002-001-dependency-security-supply-chain-audit.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/007-cross-skill-enhancement-edge-propagation` | impl | [changelog-001-007-cross-skill-enhancement-edge-propagation.md](./changelog/002-spec-kit-internals/changelog-001-007-cross-skill-enhancement-edge-propagation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research` | impl | [changelog-001-054-root-readme-deep-research.md](./changelog/003-memory-and-causal-runtime/changelog-001-054-root-readme-deep-research.md) |
| `002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/004-devin-advisor-hook-integration` | impl | [changelog-004-004-devin-advisor-hook-integration.md](./changelog/002-spec-kit-internals/changelog-004-004-devin-advisor-hook-integration.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/030-any-type-justification-sweep` | impl | [changelog-006-030-any-type-justification-sweep.md](./changelog/002-spec-kit-internals/changelog-006-030-any-type-justification-sweep.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/029-python-package-header-policy` | impl | [changelog-006-029-python-package-header-policy.md](./changelog/002-spec-kit-internals/changelog-006-029-python-package-header-policy.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/028-generated-js-declaration-alignment` | impl | [changelog-006-028-generated-js-declaration-alignment.md](./changelog/002-spec-kit-internals/changelog-006-028-generated-js-declaration-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/027-typescript-header-normalization` | impl | [changelog-006-027-typescript-header-normalization.md](./changelog/002-spec-kit-internals/changelog-006-027-typescript-header-normalization.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/002-code-folder-readme-coverage` | impl | [changelog-005-002-code-folder-readme-coverage.md](./changelog/002-spec-kit-internals/changelog-005-002-code-folder-readme-coverage.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit` | impl | [changelog-006-026-sk-code-readme-audit.md](./changelog/002-spec-kit-internals/changelog-006-026-sk-code-readme-audit.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/025-parent-documentation-drift-refresh` | impl | [changelog-006-025-parent-documentation-drift-refresh.md](./changelog/002-spec-kit-internals/changelog-006-025-parent-documentation-drift-refresh.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/024-dfidf-cold-start-cache` | impl | [changelog-006-024-dfidf-cold-start-cache.md](./changelog/002-spec-kit-internals/changelog-006-024-dfidf-cold-start-cache.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist` | impl | [changelog-006-023-subprocess-environment-whitelist.md](./changelog/002-spec-kit-internals/changelog-006-023-subprocess-environment-whitelist.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/022-plugin-bridge-unit-test-isolation` | impl | [changelog-006-022-plugin-bridge-unit-test-isolation.md](./changelog/002-spec-kit-internals/changelog-006-022-plugin-bridge-unit-test-isolation.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface` | impl | [changelog-006-021-codegraph-rpc-surface.md](./changelog/002-spec-kit-internals/changelog-006-021-codegraph-rpc-surface.md) |
| `004-code-graph/007-docs-and-readmes/003-code-folder-readmes-poc` | impl | [changelog-007-003-code-folder-readmes-poc.md](./changelog/004-code-graph/changelog-007-003-code-folder-readmes-poc.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling` | impl | [changelog-006-020-spec-kit-codegraph-decoupling.md](./changelog/002-spec-kit-internals/changelog-006-020-spec-kit-codegraph-decoupling.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling` | impl | [changelog-006-019-spec-kit-advisor-decoupling.md](./changelog/002-spec-kit-internals/changelog-006-019-spec-kit-advisor-decoupling.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/053-mk-spec-memory-rename-remediation` | impl | [changelog-001-053-mk-spec-memory-rename-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-001-053-mk-spec-memory-rename-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage` | impl | [changelog-001-049-substrate-stress-coverage.md](./changelog/003-memory-and-causal-runtime/changelog-001-049-substrate-stress-coverage.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings` | impl | [changelog-001-051-runtime-config-mk-code-index-parity-plus-findings.md](./changelog/003-memory-and-causal-runtime/changelog-001-051-runtime-config-mk-code-index-parity-plus-findings.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep` | impl | [changelog-001-050-all-skills-alignment-sweep.md](./changelog/003-memory-and-causal-runtime/changelog-001-050-all-skills-alignment-sweep.md) |
| `004-code-graph/007-docs-and-readmes/002-system-code-graph-readmes-update` | impl | [changelog-007-002-system-code-graph-readmes-update.md](./changelog/004-code-graph/changelog-007-002-system-code-graph-readmes-update.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation` | impl | [changelog-001-048-v8-dominates-relaxation.md](./changelog/003-memory-and-causal-runtime/changelog-001-048-v8-dominates-relaxation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming` | impl | [changelog-001-047-handover-anchor-naming.md](./changelog/003-memory-and-causal-runtime/changelog-001-047-handover-anchor-naming.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence` | impl | [changelog-001-045-template-contract-divergence.md](./changelog/003-memory-and-causal-runtime/changelog-001-045-template-contract-divergence.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split` | impl | [changelog-001-043-cocoindex-refresh-split.md](./changelog/003-memory-and-causal-runtime/changelog-001-043-cocoindex-refresh-split.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation` | impl | [changelog-001-044-suite-revalidation.md](./changelog/003-memory-and-causal-runtime/changelog-001-044-suite-revalidation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability` | impl | [changelog-001-042-cocoindex-ipc-observability.md](./changelog/003-memory-and-causal-runtime/changelog-001-042-cocoindex-ipc-observability.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size` | impl | [changelog-001-034-query-expansion-context-size.md](./changelog/003-memory-and-causal-runtime/changelog-001-034-query-expansion-context-size.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup` | impl | [changelog-001-033-system-code-graph-import-path-cleanup.md](./changelog/003-memory-and-causal-runtime/changelog-001-033-system-code-graph-import-path-cleanup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows` | impl | [changelog-001-040-reset-stuck-embedding-rows.md](./changelog/003-memory-and-causal-runtime/changelog-001-040-reset-stuck-embedding-rows.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation` | impl | [changelog-001-038-embedding-error-propagation.md](./changelog/003-memory-and-causal-runtime/changelog-001-038-embedding-error-propagation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking` | impl | [changelog-001-039-token-aware-chunking.md](./changelog/003-memory-and-causal-runtime/changelog-001-039-token-aware-chunking.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive` | impl | [changelog-001-037-llama-cpp-embedding-worker-deep-dive.md](./changelog/003-memory-and-causal-runtime/changelog-001-037-llama-cpp-embedding-worker-deep-dive.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename` | impl | [changelog-006-007-skill-advisor-db-rename.md](./changelog/002-spec-kit-internals/changelog-006-007-skill-advisor-db-rename.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code` | impl | [changelog-006-006-clean-validation-and-remove-deprecated-code.md](./changelog/002-spec-kit-internals/changelog-006-006-clean-validation-and-remove-deprecated-code.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs` | impl | [changelog-006-004-standalone-mcp-launcher-runtime-configs.md](./changelog/002-spec-kit-internals/changelog-006-004-standalone-mcp-launcher-runtime-configs.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation` | impl | [changelog-032-005-stability-instrumentation.md](./changelog/003-memory-and-causal-runtime/changelog-032-005-stability-instrumentation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup` | impl | [changelog-032-004-failed-embedding-cleanup.md](./changelog/003-memory-and-causal-runtime/changelog-032-004-failed-embedding-cleanup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix` | impl | [changelog-032-003-mcp-server-build-fix.md](./changelog/003-memory-and-causal-runtime/changelog-032-003-mcp-server-build-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite` | impl | [changelog-032-002-rerun-24-scenarios-suite.md](./changelog/003-memory-and-causal-runtime/changelog-032-002-rerun-24-scenarios-suite.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple` | impl | [changelog-032-001-governance-retention-decouple.md](./changelog/003-memory-and-causal-runtime/changelog-032-001-governance-retention-decouple.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration` | impl | [changelog-006-003-advisor-source-db-tests-migration.md](./changelog/002-spec-kit-internals/changelog-006-003-advisor-source-db-tests-migration.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover` | impl | [changelog-006-005-hook-compatibility-consumer-cutover.md](./changelog/002-spec-kit-internals/changelog-006-005-hook-compatibility-consumer-cutover.md) |
| `004-code-graph/006-extraction-and-isolation/003-standalone-mcp-topology-pivot` | impl | [changelog-006-003-standalone-mcp-topology-pivot.md](./changelog/004-code-graph/changelog-006-003-standalone-mcp-topology-pivot.md) |
| `004-code-graph/006-extraction-and-isolation/002-extraction-design-and-decision-record` | impl | [changelog-006-002-extraction-design-and-decision-record.md](./changelog/004-code-graph/changelog-006-002-extraction-design-and-decision-record.md) |
| `004-code-graph/006-extraction-and-isolation/001-system-code-graph-extraction` |  | [changelog-006-001-system-code-graph-extraction.md](./changelog/004-code-graph/changelog-006-001-system-code-graph-extraction.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold` | impl | [changelog-006-002-system-skill-advisor-package-scaffold.md](./changelog/002-spec-kit-internals/changelog-006-002-system-skill-advisor-package-scaffold.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration` | impl | [changelog-002-008-routing-confidence-calibration.md](./changelog/002-spec-kit-internals/changelog-002-008-routing-confidence-calibration.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr` | impl | [changelog-006-001-extraction-design-and-adr.md](./changelog/002-spec-kit-internals/changelog-006-001-extraction-design-and-adr.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep` | impl | [changelog-002-007-hard-intent-corpus-resweep.md](./changelog/002-spec-kit-internals/changelog-002-007-hard-intent-corpus-resweep.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/005-intent-signals-and-skill-relationships` | impl | [changelog-001-005-intent-signals-and-skill-relationships.md](./changelog/002-spec-kit-internals/changelog-001-005-intent-signals-and-skill-relationships.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun` | impl | [changelog-001-004-metadata-fixes-and-seeded-sweep-rerun.md](./changelog/002-spec-kit-internals/changelog-001-004-metadata-fixes-and-seeded-sweep-rerun.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/003-skill-metadata-embedding-quality-audit` | impl | [changelog-001-003-skill-metadata-embedding-quality-audit.md](./changelog/002-spec-kit-internals/changelog-001-003-skill-metadata-embedding-quality-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach` | impl | [changelog-001-041-v-rule-cross-spec-overreach.md](./changelog/003-memory-and-causal-runtime/changelog-001-041-v-rule-cross-spec-overreach.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry` | impl | [changelog-001-036-failed-embedding-cleanup-retry.md](./changelog/003-memory-and-causal-runtime/changelog-001-036-failed-embedding-cleanup-retry.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability` | impl | [changelog-001-035-cocoindex-mcp-reliability.md](./changelog/003-memory-and-causal-runtime/changelog-001-035-cocoindex-mcp-reliability.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/006-seeded-corpus-evaluation-sweep` | impl | [changelog-002-006-seeded-corpus-evaluation-sweep.md](./changelog/002-spec-kit-internals/changelog-002-006-seeded-corpus-evaluation-sweep.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration` | impl | [changelog-006-008-skill-graph-tools-advisor-migration.md](./changelog/002-spec-kit-internals/changelog-006-008-skill-graph-tools-advisor-migration.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/005-routing-weight-sweep-harness` | impl | [changelog-002-005-routing-weight-sweep-harness.md](./changelog/002-spec-kit-internals/changelog-002-005-routing-weight-sweep-harness.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion` | impl | [changelog-002-004-ablation-sweep-and-weight-promotion.md](./changelog/002-spec-kit-internals/changelog-002-004-ablation-sweep-and-weight-promotion.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring` | impl | [changelog-002-003-embedding-cache-cosine-wiring.md](./changelog/002-spec-kit-internals/changelog-002-003-embedding-cache-cosine-wiring.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/002-semantic-routing-lane` | impl | [changelog-002-002-semantic-routing-lane.md](./changelog/002-spec-kit-internals/changelog-002-002-semantic-routing-lane.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-post-027-findings-remediation` | impl | [changelog-001-029-post-027-findings-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-001-029-post-027-findings-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite` | impl | [changelog-001-028-local-llm-feature-test-suite.md](./changelog/003-memory-and-causal-runtime/changelog-001-028-local-llm-feature-test-suite.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory` | impl | [changelog-001-025-llm-model-runtime-inventory.md](./changelog/003-memory-and-causal-runtime/changelog-001-025-llm-model-runtime-inventory.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/023-post-remediation-re-review` | impl | [changelog-001-023-post-remediation-re-review.md](./changelog/003-memory-and-causal-runtime/changelog-001-023-post-remediation-re-review.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation` | impl | [changelog-001-022-local-llm-legacy-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-001-022-local-llm-legacy-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit` | impl | [changelog-001-020-catalog-playbook-alignment-audit.md](./changelog/003-memory-and-causal-runtime/changelog-001-020-catalog-playbook-alignment-audit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review` | impl | [changelog-001-021-local-llm-legacy-review.md](./changelog/003-memory-and-causal-runtime/changelog-001-021-local-llm-legacy-review.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration` | impl | [changelog-001-018-llama-cpp-auto-migration.md](./changelog/003-memory-and-causal-runtime/changelog-001-018-llama-cpp-auto-migration.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip` | impl | [changelog-001-017-llama-cpp-default-flip.md](./changelog/003-memory-and-causal-runtime/changelog-001-017-llama-cpp-default-flip.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe` | impl | [changelog-001-016-llama-cpp-retrieval-quality-probe.md](./changelog/003-memory-and-causal-runtime/changelog-001-016-llama-cpp-retrieval-quality-probe.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend` | impl | [changelog-001-014-onnx-cross-platform-backend.md](./changelog/003-memory-and-causal-runtime/changelog-001-014-onnx-cross-platform-backend.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation` | impl | [changelog-001-015-node-llama-cpp-evaluation.md](./changelog/003-memory-and-causal-runtime/changelog-001-015-node-llama-cpp-evaluation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup` | impl | [changelog-001-013-v4-cleanup.md](./changelog/003-memory-and-causal-runtime/changelog-001-013-v4-cleanup.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename` | impl | [changelog-001-052-mk-spec-memory-rename.md](./changelog/003-memory-and-causal-runtime/changelog-001-052-mk-spec-memory-rename.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation` | impl | [changelog-001-012-v3-remediation.md](./changelog/003-memory-and-causal-runtime/changelog-001-012-v3-remediation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification` | impl | [changelog-001-011-embeddinggemma-unification.md](./changelog/003-memory-and-causal-runtime/changelog-001-011-embeddinggemma-unification.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns` | impl | [changelog-001-010-cocoindex-code-only-patterns.md](./changelog/003-memory-and-causal-runtime/changelog-001-010-cocoindex-code-only-patterns.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix` | impl | [changelog-001-009-cocoindex-ipc-fix.md](./changelog/003-memory-and-causal-runtime/changelog-001-009-cocoindex-ipc-fix.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/008-finalize-and-commit` | impl | [changelog-001-008-finalize-and-commit.md](./changelog/003-memory-and-causal-runtime/changelog-001-008-finalize-and-commit.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring` | impl | [changelog-001-007-voyage-cleanup-and-egress-monitoring.md](./changelog/003-memory-and-causal-runtime/changelog-001-007-voyage-cleanup-and-egress-monitoring.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation` | impl | [changelog-001-006-bge-m3-hybrid-evaluation.md](./changelog/003-memory-and-causal-runtime/changelog-001-006-bge-m3-hybrid-evaluation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/005-q4-quantization` | impl | [changelog-001-005-q4-quantization.md](./changelog/003-memory-and-causal-runtime/changelog-001-005-q4-quantization.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild` | impl | [changelog-001-004-vec-store-rebuild.md](./changelog/003-memory-and-causal-runtime/changelog-001-004-vec-store-rebuild.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout` | impl | [changelog-001-003-mcp-config-rollout.md](./changelog/003-memory-and-causal-runtime/changelog-001-003-mcp-config-rollout.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat` | impl | [changelog-001-002-model-installation-and-compat.md](./changelog/003-memory-and-causal-runtime/changelog-001-002-model-installation-and-compat.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture` | impl | [changelog-001-001-prefix-registry-architecture.md](./changelog/003-memory-and-causal-runtime/changelog-001-001-prefix-registry-architecture.md) |
| `006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files` | impl | [changelog-002-004-cutover-doctor-router-from-legacy-files.md](./changelog/006-operator-tooling/changelog-002-004-cutover-doctor-router-from-legacy-files.md) |
| `006-operator-tooling/002-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator` | impl | [changelog-002-002-fix-deep-review-findings-for-doctor-update-orchestrator.md](./changelog/006-operator-tooling/changelog-002-002-fix-deep-review-findings-for-doctor-update-orchestrator.md) |
| `002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts` | impl | [changelog-003-009-harden-deep-review-iteration-prompts.md](./changelog/002-spec-kit-internals/changelog-003-009-harden-deep-review-iteration-prompts.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate` | impl | [changelog-003-031-cocoindex-local-voyage-embeddings-gate.md](./changelog/000-release-and-program-cleanup/changelog-003-031-cocoindex-local-voyage-embeddings-gate.md) |
| `004-code-graph/005-resilience-and-advisor/004-iteration-quality-meta-research` | impl | [changelog-005-004-iteration-quality-meta-research.md](./changelog/004-code-graph/changelog-005-004-iteration-quality-meta-research.md) |
| `004-code-graph/004-runtime-and-scan/005-broader-excludes-and-granular-skills` | impl | [changelog-004-005-broader-excludes-and-granular-skills.md](./changelog/004-code-graph/changelog-004-005-broader-excludes-and-granular-skills.md) |
| `006-operator-tooling/002-doctor-update-orchestrator/001-implement-initial-doctor-command-set` | impl | [changelog-002-001-implement-initial-doctor-command-set.md](./changelog/006-operator-tooling/changelog-002-001-implement-initial-doctor-command-set.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep` | impl | [changelog-003-030-test-fixture-singular-to-plural-sweep.md](./changelog/000-release-and-program-cleanup/changelog-003-030-test-fixture-singular-to-plural-sweep.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal` | impl | [changelog-003-029-autoclean-orphan-file-removal.md](./changelog/000-release-and-program-cleanup/changelog-003-029-autoclean-orphan-file-removal.md) |
| `000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes` | impl | [changelog-004-004-runtime-root-memory-cleanup-followup-fixes.md](./changelog/000-release-and-program-cleanup/changelog-004-004-runtime-root-memory-cleanup-followup-fixes.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in` | impl | [changelog-003-028-documentation-alignment-readme-fill-in.md](./changelog/000-release-and-program-cleanup/changelog-003-028-documentation-alignment-readme-fill-in.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` | impl | [changelog-004-010-daemon-resilience.md](./changelog/003-memory-and-causal-runtime/changelog-004-010-daemon-resilience.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience` | impl | [changelog-008-007-tree-sitter-parser-crash-resilience.md](./changelog/004-code-graph/changelog-008-007-tree-sitter-parser-crash-resilience.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/005-scope-change-scan-guard` | impl | [changelog-008-005-scope-change-scan-guard.md](./changelog/004-code-graph/changelog-008-005-scope-change-scan-guard.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/004-fix-zero-node-and-parser-issues` | impl | [changelog-008-004-fix-zero-node-and-parser-issues.md](./changelog/004-code-graph/changelog-008-004-fix-zero-node-and-parser-issues.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/003-code-graph-bug-surface-research` | impl | [changelog-008-003-code-graph-bug-surface-research.md](./changelog/004-code-graph/changelog-008-003-code-graph-bug-surface-research.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/002-native-deferred-trial-rerun` | impl | [changelog-008-002-native-deferred-trial-rerun.md](./changelog/004-code-graph/changelog-008-002-native-deferred-trial-rerun.md) |
| `004-code-graph/008-real-world-usefulness-test-planning/001-sandbox-usefulness-trials` | impl | [changelog-008-001-sandbox-usefulness-trials.md](./changelog/004-code-graph/changelog-008-001-sandbox-usefulness-trials.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/027-missing-code-readme-resource-map` | impl | [changelog-003-027-missing-code-readme-resource-map.md](./changelog/000-release-and-program-cleanup/changelog-003-027-missing-code-readme-resource-map.md) |
| `004-code-graph/004-runtime-and-scan/004-end-user-scope-default-and-opt-in` | impl | [changelog-004-004-end-user-scope-default-and-opt-in.md](./changelog/004-code-graph/changelog-004-004-end-user-scope-default-and-opt-in.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/026-readme-code-template-governance` | impl | [changelog-003-026-readme-code-template-governance.md](./changelog/000-release-and-program-cleanup/changelog-003-026-readme-code-template-governance.md) |
| `002-spec-kit-internals/003-template-levels/008-archive-fleet-marker-validation-scaffold` | impl | [changelog-003-008-archive-fleet-marker-validation-scaffold.md](./changelog/002-spec-kit-internals/changelog-003-008-archive-fleet-marker-validation-scaffold.md) |
| `002-spec-kit-internals/003-template-levels/007-sweep-fleet-marker-validation` | impl | [changelog-003-007-sweep-fleet-marker-validation.md](./changelog/002-spec-kit-internals/changelog-003-007-sweep-fleet-marker-validation.md) |
| `002-spec-kit-internals/003-template-levels/006-command-markdown-yaml-workflow-alignment` | impl | [changelog-003-006-command-markdown-yaml-workflow-alignment.md](./changelog/002-spec-kit-internals/changelog-003-006-command-markdown-yaml-workflow-alignment.md)<br>[changelog-006-command-md-yaml-alignment.md](./changelog/002-spec-kit-internals/changelog-006-command-md-yaml-alignment.md) |
| `002-spec-kit-internals/003-template-levels/005-skill-reference-asset-doc-alignment` | impl | [changelog-003-005-skill-reference-asset-doc-alignment.md](./changelog/002-spec-kit-internals/changelog-003-005-skill-reference-asset-doc-alignment.md)<br>[changelog-005-skill-references-assets-alignment.md](./changelog/002-spec-kit-internals/changelog-005-skill-references-assets-alignment.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/025-readme-architecture-diagrams-topology` | impl | [changelog-003-025-readme-architecture-diagrams-topology.md](./changelog/000-release-and-program-cleanup/changelog-003-025-readme-architecture-diagrams-topology.md) |
| `002-spec-kit-internals/003-template-levels/004-fix-template-deferred-followups` | impl | [changelog-003-004-fix-template-deferred-followups.md](./changelog/002-spec-kit-internals/changelog-003-004-fix-template-deferred-followups.md) |
| `002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan` | impl | [changelog-003-003-manifest-template-implementation-plan.md](./changelog/002-spec-kit-internals/changelog-003-003-manifest-template-implementation-plan.md)<br>[changelog-003-template-greenfield-impl.md](./changelog/002-spec-kit-internals/changelog-003-template-greenfield-impl.md) |
| `002-spec-kit-internals/003-template-levels/002-manifest-driven-template-design` | impl | [changelog-002-template-greenfield-redesign.md](./changelog/002-spec-kit-internals/changelog-002-template-greenfield-redesign.md)<br>[changelog-003-002-manifest-driven-template-design.md](./changelog/002-spec-kit-internals/changelog-003-002-manifest-driven-template-design.md) |
| `002-spec-kit-internals/003-template-levels/001-template-level-consolidation-research` | impl | [changelog-001-template-consolidation-investigation.md](./changelog/002-spec-kit-internals/changelog-001-template-consolidation-investigation.md)<br>[changelog-003-001-template-level-consolidation-research.md](./changelog/002-spec-kit-internals/changelog-003-001-template-level-consolidation-research.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/010-fix-cli-orchestrator-doc-drift` | impl | [changelog-004-010-fix-cli-orchestrator-doc-drift.md](./changelog/000-release-and-program-cleanup/changelog-004-010-fix-cli-orchestrator-doc-drift.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/009-fix-test-reliability` | impl | [changelog-004-009-fix-test-reliability.md](./changelog/000-release-and-program-cleanup/changelog-004-009-fix-test-reliability.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/008-fix-search-quality-tuning` | impl | [changelog-004-008-fix-search-quality-tuning.md](./changelog/000-release-and-program-cleanup/changelog-004-008-fix-search-quality-tuning.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/007-fix-topology-build-boundary` | impl | [changelog-004-007-fix-topology-build-boundary.md](./changelog/000-release-and-program-cleanup/changelog-004-007-fix-topology-build-boundary.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/006-fix-architecture-cleanup-followups` | impl | [changelog-004-006-fix-architecture-cleanup-followups.md](./changelog/000-release-and-program-cleanup/changelog-004-006-fix-architecture-cleanup-followups.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/005-resource-leaks-silent-errors` | impl | [changelog-004-005-resource-leaks-silent-errors.md](./changelog/000-release-and-program-cleanup/changelog-004-005-resource-leaks-silent-errors.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory` | impl | [changelog-004-004-fix-validation-memory.md](./changelog/000-release-and-program-cleanup/changelog-004-004-fix-validation-memory.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/003-fix-skill-advisor-quality` | impl | [changelog-004-003-fix-skill-advisor-quality.md](./changelog/000-release-and-program-cleanup/changelog-004-003-fix-skill-advisor-quality.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/002-fix-deep-loop-workflow-state` | impl | [changelog-004-002-fix-deep-loop-workflow-state.md](./changelog/000-release-and-program-cleanup/changelog-004-002-fix-deep-loop-workflow-state.md) |
| `000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/001-fix-code-graph-consistency` | impl | [changelog-004-001-fix-code-graph-consistency.md](./changelog/000-release-and-program-cleanup/changelog-004-001-fix-code-graph-consistency.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/024-daemon-concurrency-fixes` | impl | [changelog-003-024-daemon-concurrency-fixes.md](./changelog/000-release-and-program-cleanup/changelog-003-024-daemon-concurrency-fixes.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/023-fix-baseline-test-failures` | impl | [changelog-003-023-fix-baseline-test-failures.md](./changelog/000-release-and-program-cleanup/changelog-003-023-fix-baseline-test-failures.md) |
| `000-release-and-program-cleanup/006-research/003-system-bug-improvement-research` | impl | [changelog-006-003-system-bug-improvement-research.md](./changelog/000-release-and-program-cleanup/changelog-006-003-system-bug-improvement-research.md) |
| `000-release-and-program-cleanup/002-audit/008-fix-audit-drift-findings` | impl | [changelog-002-008-fix-audit-drift-findings.md](./changelog/000-release-and-program-cleanup/changelog-002-008-fix-audit-drift-findings.md) |
| `000-release-and-program-cleanup/001-release-readiness/006-fix-stress-test-coverage-gap` | impl | [changelog-001-006-fix-stress-test-coverage-gap.md](./changelog/000-release-and-program-cleanup/changelog-001-006-fix-stress-test-coverage-gap.md) |
| `000-release-and-program-cleanup/005-stress-test/007-fix-stress-test-coverage-gap-followup` | impl | [changelog-005-007-fix-stress-test-coverage-gap-followup.md](./changelog/000-release-and-program-cleanup/changelog-005-007-fix-stress-test-coverage-gap-followup.md) |
| `000-release-and-program-cleanup/005-stress-test/006-stress-coverage-audit-and-run` | impl | [changelog-005-006-stress-coverage-audit-and-run.md](./changelog/000-release-and-program-cleanup/changelog-005-006-stress-coverage-audit-and-run.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/017-hook-test-sandbox-fix` | impl | [changelog-003-017-hook-test-sandbox-fix.md](./changelog/000-release-and-program-cleanup/changelog-003-017-hook-test-sandbox-fix.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/006-mcp-tool-schema-governance-audit` | impl | [changelog-003-006-mcp-tool-schema-governance-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-006-mcp-tool-schema-governance-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit` | impl | [changelog-003-002-memory-data-integrity-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-002-memory-data-integrity-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/007-deep-loop-workflow-integrity-audit` | impl | [changelog-003-007-deep-loop-workflow-integrity-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-007-deep-loop-workflow-integrity-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/005-cross-runtime-hook-parity-audit` | impl | [changelog-003-005-cross-runtime-hook-parity-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-005-cross-runtime-hook-parity-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/001-workflow-correctness-audit` | impl | [changelog-003-001-workflow-correctness-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-001-workflow-correctness-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit` | impl | [changelog-003-003-skill-advisor-freshness-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-003-skill-advisor-freshness-audit.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/013-evergreen-doc-packet-id-removal` | impl | [changelog-003-013-evergreen-doc-packet-id-removal.md](./changelog/000-release-and-program-cleanup/changelog-003-013-evergreen-doc-packet-id-removal.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/004-code-graph-readiness-audit` | impl | [changelog-003-004-code-graph-readiness-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-004-code-graph-readiness-audit.md) |
| `000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/008-validator-spec-document-integrity-audit` | impl | [changelog-003-008-validator-spec-document-integrity-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-008-validator-spec-document-integrity-audit.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/015-root-readme-refresh` | impl | [changelog-003-015-root-readme-refresh.md](./changelog/000-release-and-program-cleanup/changelog-003-015-root-readme-refresh.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/012-code-graph-catalog-and-playbook` | impl | [changelog-003-012-code-graph-catalog-and-playbook.md](./changelog/000-release-and-program-cleanup/changelog-003-012-code-graph-catalog-and-playbook.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/006-readme-cascade-refresh` | impl | [changelog-003-006-readme-cascade-refresh.md](./changelog/000-release-and-program-cleanup/changelog-003-006-readme-cascade-refresh.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/005-stress-test-folder-migration` | impl | [changelog-003-005-stress-test-folder-migration.md](./changelog/000-release-and-program-cleanup/changelog-003-005-stress-test-folder-migration.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/004-sk-doc-template-alignment` | impl | [changelog-003-004-sk-doc-template-alignment.md](./changelog/000-release-and-program-cleanup/changelog-003-004-sk-doc-template-alignment.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/003-testing-playbook-trio-alignment` | impl | [changelog-003-003-testing-playbook-trio-alignment.md](./changelog/000-release-and-program-cleanup/changelog-003-003-testing-playbook-trio-alignment.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/002-feature-catalog-trio-alignment` | impl | [changelog-003-002-feature-catalog-trio-alignment.md](./changelog/000-release-and-program-cleanup/changelog-003-002-feature-catalog-trio-alignment.md) |
| `000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/001-sk-code-opencode-standards-audit` | impl | [changelog-003-001-sk-code-opencode-standards-audit.md](./changelog/000-release-and-program-cleanup/changelog-003-001-sk-code-opencode-standards-audit.md) |
| `000-release-and-program-cleanup/002-audit/006-runtime-matrix-execution-validation` | impl | [changelog-002-006-runtime-matrix-execution-validation.md](./changelog/000-release-and-program-cleanup/changelog-002-006-runtime-matrix-execution-validation.md) |
| `000-release-and-program-cleanup/006-research/002-automation-reality-supplemental-research` | impl | [changelog-006-002-automation-reality-supplemental-research.md](./changelog/000-release-and-program-cleanup/changelog-006-002-automation-reality-supplemental-research.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/010-half-auto-upgrade-doc-alignment` | impl | [changelog-003-010-half-auto-upgrade-doc-alignment.md](./changelog/000-release-and-program-cleanup/changelog-003-010-half-auto-upgrade-doc-alignment.md) |
| `000-release-and-program-cleanup/002-audit/005-memory-retention-policy-sweep` | impl | [changelog-002-005-memory-retention-policy-sweep.md](./changelog/000-release-and-program-cleanup/changelog-002-005-memory-retention-policy-sweep.md) |
| `000-release-and-program-cleanup/002-audit/004-code-graph-watcher-claim-retraction` | impl | [changelog-002-004-code-graph-watcher-claim-retraction.md](./changelog/000-release-and-program-cleanup/changelog-002-004-code-graph-watcher-claim-retraction.md) |
| `000-release-and-program-cleanup/002-audit/003-documentation-truth-validation` | impl | [changelog-002-003-documentation-truth-validation.md](./changelog/000-release-and-program-cleanup/changelog-002-003-documentation-truth-validation.md) |
| `000-release-and-program-cleanup/006-research/001-automation-self-management-research` | impl | [changelog-006-001-automation-self-management-research.md](./changelog/000-release-and-program-cleanup/changelog-006-001-automation-self-management-research.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test` | impl | [changelog-003-029-clean-infrastructure-stress-test.md](./changelog/000-release-and-program-cleanup/changelog-003-029-clean-infrastructure-stress-test.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design` | impl | [changelog-003-030-clean-infrastructure-full-matrix-stress-design.md](./changelog/000-release-and-program-cleanup/changelog-003-030-clean-infrastructure-full-matrix-stress-design.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt` | impl | [changelog-003-008-remove-sk-doc-legacy-template-debt.md](./changelog/000-release-and-program-cleanup/changelog-003-008-remove-sk-doc-legacy-template-debt.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/007-vitest-broad-suite-honesty` | impl | [changelog-003-007-vitest-broad-suite-honesty.md](./changelog/000-release-and-program-cleanup/changelog-003-007-vitest-broad-suite-honesty.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes` | impl | [changelog-003-006-stale-documentation-readme-fixes.md](./changelog/000-release-and-program-cleanup/changelog-003-006-stale-documentation-readme-fixes.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/028-deep-review-research-skill-contract-fixes` | impl | [changelog-003-028-deep-review-research-skill-contract-fixes.md](./changelog/000-release-and-program-cleanup/changelog-003-028-deep-review-research-skill-contract-fixes.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/027-memory-context-structural-channel-research` | impl | [changelog-003-027-memory-context-structural-channel-research.md](./changelog/000-release-and-program-cleanup/changelog-003-027-memory-context-structural-channel-research.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/026-remove-readiness-scaffolding` | impl | [changelog-003-026-remove-readiness-scaffolding.md](./changelog/000-release-and-program-cleanup/changelog-003-026-remove-readiness-scaffolding.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/025-memory-search-degraded-readiness-wiring` | impl | [changelog-003-025-memory-search-degraded-readiness-wiring.md](./changelog/000-release-and-program-cleanup/changelog-003-025-memory-search-degraded-readiness-wiring.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/024-harness-telemetry-export-mode` | impl | [changelog-003-024-harness-telemetry-export-mode.md](./changelog/000-release-and-program-cleanup/changelog-003-024-harness-telemetry-export-mode.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/023-live-handler-envelope-capture-interface` | impl | [changelog-003-023-live-handler-envelope-capture-interface.md](./changelog/000-release-and-program-cleanup/changelog-003-023-live-handler-envelope-capture-interface.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/005-vestigial-embedding-readiness-gate-removal` | impl | [changelog-003-005-vestigial-embedding-readiness-gate-removal.md](./changelog/000-release-and-program-cleanup/changelog-003-005-vestigial-embedding-readiness-gate-removal.md) |
| `000-release-and-program-cleanup/005-stress-test/002-stress-test-pattern-documentation` | impl | [changelog-005-002-stress-test-pattern-documentation.md](./changelog/000-release-and-program-cleanup/changelog-005-002-stress-test-pattern-documentation.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion` | impl | [changelog-003-021-stress-test-enterprise-wiring-expansion.md](./changelog/000-release-and-program-cleanup/changelog-003-021-stress-test-enterprise-wiring-expansion.md) |
| `000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit` | impl | [changelog-002-002-runtime-wiring-enterprise-readiness-audit.md](./changelog/000-release-and-program-cleanup/changelog-002-002-runtime-wiring-enterprise-readiness-audit.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation` | impl | [changelog-003-004-search-rag-measurement-implementation.md](./changelog/000-release-and-program-cleanup/changelog-003-004-search-rag-measurement-implementation.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization` | impl | [changelog-003-002-search-query-rag-optimization.md](./changelog/000-release-and-program-cleanup/changelog-003-002-search-query-rag-optimization.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/019-search-query-rag-optimization-research` | impl | [changelog-003-019-search-query-rag-optimization-research.md](./changelog/000-release-and-program-cleanup/changelog-003-019-search-query-rag-optimization-research.md) |
| `000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup` | impl | [changelog-004-001-post-program-doc-and-state-cleanup.md](./changelog/000-release-and-program-cleanup/changelog-004-001-post-program-doc-and-state-cleanup.md) |
| `000-release-and-program-cleanup/001-release-readiness/002-fix-additional-release-readiness-findings` | impl | [changelog-001-002-fix-additional-release-readiness-findings.md](./changelog/000-release-and-program-cleanup/changelog-001-002-fix-additional-release-readiness-findings.md) |
| `000-release-and-program-cleanup/005-stress-test/001-fix-mcp-stress-cycle-doc-observability` | impl | [changelog-005-001-fix-mcp-stress-cycle-doc-observability.md](./changelog/000-release-and-program-cleanup/changelog-005-001-fix-mcp-stress-cycle-doc-observability.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/001-fix-memory-indexer-storage-boundary` | impl | [changelog-003-001-fix-memory-indexer-storage-boundary.md](./changelog/000-release-and-program-cleanup/changelog-003-001-fix-memory-indexer-storage-boundary.md) |
| `000-release-and-program-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback` | impl | [changelog-001-001-fix-skill-advisor-fail-open-fallback.md](./changelog/000-release-and-program-cleanup/changelog-001-001-fix-skill-advisor-fail-open-fallback.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/018-feature-catalog-playbook-degraded-alignment` | impl | [changelog-003-018-feature-catalog-playbook-degraded-alignment.md](./changelog/000-release-and-program-cleanup/changelog-003-018-feature-catalog-playbook-degraded-alignment.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/012-copilot-target-authority-gate-helper` | impl | [changelog-003-012-copilot-target-authority-gate-helper.md](./changelog/000-release-and-program-cleanup/changelog-003-012-copilot-target-authority-gate-helper.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/013-code-graph-degraded-stress-cell` | impl | [changelog-003-013-code-graph-degraded-stress-cell.md](./changelog/000-release-and-program-cleanup/changelog-003-013-code-graph-degraded-stress-cell.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/015-cocoindex-seed-telemetry-passthrough` | impl | [changelog-003-015-cocoindex-seed-telemetry-passthrough.md](./changelog/000-release-and-program-cleanup/changelog-003-015-cocoindex-seed-telemetry-passthrough.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/014-code-graph-status-readiness-snapshot` | impl | [changelog-003-014-code-graph-status-readiness-snapshot.md](./changelog/000-release-and-program-cleanup/changelog-003-014-code-graph-status-readiness-snapshot.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/011-research-post-stress-finding-followups` | impl | [changelog-003-011-research-post-stress-finding-followups.md](./changelog/000-release-and-program-cleanup/changelog-003-011-research-post-stress-finding-followups.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/017-cli-copilot-dispatch-test-parity` | impl | [changelog-003-017-cli-copilot-dispatch-test-parity.md](./changelog/000-release-and-program-cleanup/changelog-003-017-cli-copilot-dispatch-test-parity.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/010-stress-test-close-loop-measurement-rerun` | impl | [changelog-003-010-stress-test-close-loop-measurement-rerun.md](./changelog/000-release-and-program-cleanup/changelog-003-010-stress-test-close-loop-measurement-rerun.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration` | impl | [changelog-009-004-legacy-phase-parent-migration.md](./changelog/000-release-and-program-cleanup/changelog-009-004-legacy-phase-parent-migration.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/003-phase-parent-reference-readme-sync` | impl | [changelog-009-003-phase-parent-reference-readme-sync.md](./changelog/000-release-and-program-cleanup/changelog-009-003-phase-parent-reference-readme-sync.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish` | impl | [changelog-009-002-phase-parent-generator-pointer-polish.md](./changelog/000-release-and-program-cleanup/changelog-009-002-phase-parent-generator-pointer-polish.md) |
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/001-phase-parent-validator-docs` | impl | [changelog-009-001-phase-parent-validator-docs.md](./changelog/000-release-and-program-cleanup/changelog-009-001-phase-parent-validator-docs.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol` | impl | [changelog-003-008-mcp-daemon-rebuild-protocol.md](./changelog/000-release-and-program-cleanup/changelog-003-008-mcp-daemon-rebuild-protocol.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/007-intent-classifier-stability-telemetry` | impl | [changelog-003-007-intent-classifier-stability-telemetry.md](./changelog/000-release-and-program-cleanup/changelog-003-007-intent-classifier-stability-telemetry.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/006-causal-graph-relation-window-metrics` | impl | [changelog-003-006-causal-graph-relation-window-metrics.md](./changelog/000-release-and-program-cleanup/changelog-003-006-causal-graph-relation-window-metrics.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/009-memory-search-citation-response-policy` | impl | [changelog-003-009-memory-search-citation-response-policy.md](./changelog/000-release-and-program-cleanup/changelog-003-009-memory-search-citation-response-policy.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/005-code-graph-fail-fast-routing` | impl | [changelog-003-005-code-graph-fail-fast-routing.md](./changelog/000-release-and-program-cleanup/changelog-003-005-code-graph-fail-fast-routing.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/004-cocoindex-overfetch-dedup-rerank` | impl | [changelog-003-004-cocoindex-overfetch-dedup-rerank.md](./changelog/000-release-and-program-cleanup/changelog-003-004-cocoindex-overfetch-dedup-rerank.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/003-memory-context-truncation-telemetry-contract` | impl | [changelog-003-003-memory-context-truncation-telemetry-contract.md](./changelog/000-release-and-program-cleanup/changelog-003-003-memory-context-truncation-telemetry-contract.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/002-mcp-runtime-improvement-research` | impl | [changelog-003-002-mcp-runtime-improvement-research.md](./changelog/000-release-and-program-cleanup/changelog-003-002-mcp-runtime-improvement-research.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-execution` | impl | [changelog-001-002-search-scenario-execution.md](./changelog/000-release-and-program-cleanup/changelog-001-002-search-scenario-execution.md) |
| `000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-search-scenario-design` | impl | [changelog-001-001-search-scenario-design.md](./changelog/000-release-and-program-cleanup/changelog-001-001-search-scenario-design.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/005-memory-search-runtime-bugs` | impl | [changelog-005-memory-search-runtime-bugs.md](./changelog/003-memory-and-causal-runtime/changelog-005-memory-search-runtime-bugs.md) |
| `005-graph-impact-and-affordance/006-deep-research-review` | impl | [changelog-005-006-deep-research-review.md](./changelog/005-graph-impact-and-affordance/changelog-005-006-deep-research-review.md) |
| `004-code-graph/005-resilience-and-advisor/003-code-graph-backend-resilience-implementation` | impl | [changelog-005-003-code-graph-backend-resilience-implementation.md](./changelog/004-code-graph/changelog-005-003-code-graph-backend-resilience-implementation.md) |
| `004-code-graph/007-docs-and-readmes/001-doctor-diagnostic-command-phase-a` | impl | [changelog-007-001-doctor-diagnostic-command-phase-a.md](./changelog/004-code-graph/changelog-007-001-doctor-diagnostic-command-phase-a.md) |
| `004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research` | impl | [changelog-005-002-code-graph-resilience-research.md](./changelog/004-code-graph/changelog-005-002-code-graph-resilience-research.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/005-advisor-setup-command` | impl | [changelog-003-005-advisor-setup-command.md](./changelog/002-spec-kit-internals/changelog-003-005-advisor-setup-command.md) |
| `005-graph-impact-and-affordance/004-memory-causal-trust-display` | impl | [changelog-005-004-memory-causal-trust-display.md](./changelog/005-graph-impact-and-affordance/changelog-005-004-memory-causal-trust-display.md) |
| `005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence` | impl | [changelog-005-003-skill-advisor-affordance-evidence.md](./changelog/005-graph-impact-and-affordance/changelog-005-003-skill-advisor-affordance-evidence.md) |
| `005-graph-impact-and-affordance/002-edge-explanation-impact-uplift` | impl | [changelog-005-002-edge-explanation-impact-uplift.md](./changelog/005-graph-impact-and-affordance/changelog-005-002-edge-explanation-impact-uplift.md) |
| `005-graph-impact-and-affordance/001-code-graph-phase-runner` | impl | [changelog-005-001-code-graph-phase-runner.md](./changelog/005-graph-impact-and-affordance/changelog-005-001-code-graph-phase-runner.md) |
| `000-release-and-program-cleanup/007-clean-room-license-audit` | impl | [changelog-000-007-clean-room-license-audit.md](./changelog/000-release-and-program-cleanup/changelog-000-007-clean-room-license-audit.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/010-memory-indexer-invariants` | impl | [changelog-001-010-memory-indexer-invariants.md](./changelog/003-memory-and-causal-runtime/changelog-001-010-memory-indexer-invariants.md) |
| `002-spec-kit-internals/001-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders` | impl | [changelog-001-001-reverse-parent-research-review-folders.md](./changelog/002-spec-kit-internals/changelog-001-001-reverse-parent-research-review-folders.md)<br>[changelog-001-reverse-parent-research-review-folders.md](./changelog/002-spec-kit-internals/changelog-001-reverse-parent-research-review-folders.md) |
| `004-code-graph/004-runtime-and-scan/003-resolver-and-hook-improvements` | impl | [changelog-004-003-resolver-and-hook-improvements.md](./changelog/004-code-graph/changelog-004-003-resolver-and-hook-improvements.md) |
| `002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/001-advisor-hook-brief-improvements` | impl | [changelog-002-001-advisor-hook-brief-improvements.md](./changelog/002-spec-kit-internals/changelog-002-001-advisor-hook-brief-improvements.md) |
| `002-spec-kit-internals/001-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration` | impl | [changelog-001-003-resource-map-deep-loop-integration.md](./changelog/002-spec-kit-internals/changelog-001-003-resource-map-deep-loop-integration.md)<br>[changelog-003-resource-map-deep-loop-integration.md](./changelog/002-spec-kit-internals/changelog-003-resource-map-deep-loop-integration.md) |
| `002-spec-kit-internals/001-resource-map-deep-loop-fix/002-resource-map-template-creation` | impl | [changelog-001-002-resource-map-template-creation.md](./changelog/002-spec-kit-internals/changelog-001-002-resource-map-template-creation.md)<br>[changelog-002-resource-map-template-creation.md](./changelog/002-spec-kit-internals/changelog-002-resource-map-template-creation.md) |
| `004-code-graph/004-runtime-and-scan/002-fix-stale-highlights-and-scan-scope` | impl | [changelog-004-002-fix-stale-highlights-and-scan-scope.md](./changelog/004-code-graph/changelog-004-002-fix-stale-highlights-and-scan-scope.md) |
| `002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/003-advisor-standards-alignment` | impl | [changelog-004-003-advisor-standards-alignment.md](./changelog/002-spec-kit-internals/changelog-004-003-advisor-standards-alignment.md) |
| `006-operator-tooling/001-hook-parity/004-fix-claude-freshness-schema-harness` | impl | [changelog-001-004-fix-claude-freshness-schema-harness.md](./changelog/006-operator-tooling/changelog-001-004-fix-claude-freshness-schema-harness.md) |
| `002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/002-advisor-plugin-hardening` | impl | [changelog-004-002-advisor-plugin-hardening.md](./changelog/002-spec-kit-internals/changelog-004-002-advisor-plugin-hardening.md) |
| `006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge` | impl | [changelog-001-005-fix-opencode-plugin-loader-bridge.md](./changelog/006-operator-tooling/changelog-001-005-fix-opencode-plugin-loader-bridge.md)<br>[changelog-005-opencode-plugin-loader-remediation-review-pt-01.md](./changelog/006-operator-tooling/changelog-005-opencode-plugin-loader-remediation-review-pt-01.md) |
| `006-operator-tooling/001-hook-parity/003-codex-native-startup-advisor-hooks` | impl | [changelog-001-003-codex-native-startup-advisor-hooks.md](./changelog/006-operator-tooling/changelog-001-003-codex-native-startup-advisor-hooks.md)<br>[changelog-003-codex-hook-parity-remediation.md](./changelog/006-operator-tooling/changelog-003-codex-hook-parity-remediation.md) |
| `006-operator-tooling/001-hook-parity/002-copilot-custom-instructions-hook-parity` | impl | [changelog-001-002-copilot-custom-instructions-hook-parity.md](./changelog/006-operator-tooling/changelog-001-002-copilot-custom-instructions-hook-parity.md)<br>[changelog-002-copilot-hook-parity-remediation.md](./changelog/006-operator-tooling/changelog-002-copilot-hook-parity-remediation.md) |
| `006-operator-tooling/001-hook-parity/001-fix-runtime-hook-parity-findings` | impl | [changelog-001-001-fix-runtime-hook-parity-findings.md](./changelog/006-operator-tooling/changelog-001-001-fix-runtime-hook-parity-findings.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/002-skill-graph-daemon-native-advisor-tools` | impl | [changelog-001-002-skill-graph-daemon-native-advisor-tools.md](./changelog/002-spec-kit-internals/changelog-001-002-skill-graph-daemon-native-advisor-tools.md) |
| `002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/001-documentation-code-alignment` | impl | [changelog-005-001-documentation-code-alignment.md](./changelog/002-spec-kit-internals/changelog-005-001-documentation-code-alignment.md) |
| `002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/001-deferred-remediation-telemetry-run` | impl | [changelog-004-001-deferred-remediation-telemetry-run.md](./changelog/002-spec-kit-internals/changelog-004-001-deferred-remediation-telemetry-run.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/004-advisor-hook-surface-integration` | impl | [changelog-003-004-advisor-hook-surface-integration.md](./changelog/002-spec-kit-internals/changelog-003-004-advisor-hook-surface-integration.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin` | impl | [changelog-003-003-smart-remediation-opencode-plugin.md](./changelog/002-spec-kit-internals/changelog-003-003-smart-remediation-opencode-plugin.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/009-system-hardening` | impl | [changelog-001-009-system-hardening.md](./changelog/003-memory-and-causal-runtime/changelog-001-009-system-hardening.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime` | impl | [changelog-001-007-foundational-runtime.md](./changelog/003-memory-and-causal-runtime/changelog-001-007-foundational-runtime.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/008-sk-deep-cli-runtime-execution` | impl | [changelog-001-008-sk-deep-cli-runtime-execution.md](./changelog/003-memory-and-causal-runtime/changelog-001-008-sk-deep-cli-runtime-execution.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning` | impl | [changelog-003-002-advisor-phrase-booster-tuning.md](./changelog/002-spec-kit-internals/changelog-003-002-advisor-phrase-booster-tuning.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite` | impl | [changelog-001-004-memory-save-rewrite.md](./changelog/003-memory-and-causal-runtime/changelog-001-004-memory-save-rewrite.md)<br>[changelog-004-memory-save-rewrite.md](./changelog/003-memory-and-causal-runtime/changelog-004-memory-save-rewrite.md) |
| `002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/001-memory-search-routing-tuning` | impl | [changelog-003-001-memory-search-routing-tuning.md](./changelog/002-spec-kit-internals/changelog-003-001-memory-search-routing-tuning.md) |
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts` | impl | [changelog-001-001-skill-graph-metadata-routing-boosts.md](./changelog/002-spec-kit-internals/changelog-001-001-skill-graph-metadata-routing-boosts.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates` | impl | [changelog-001-003-continuity-refactor-gates.md](./changelog/003-memory-and-causal-runtime/changelog-001-003-continuity-refactor-gates.md)<br>[changelog-003-continuity-refactor-gates.md](./changelog/003-memory-and-causal-runtime/changelog-003-continuity-refactor-gates.md) |
| `004-code-graph/004-runtime-and-scan/001-code-graph-runtime-upgrades` | impl | [changelog-004-001-code-graph-runtime-upgrades.md](./changelog/004-code-graph/changelog-004-001-code-graph-runtime-upgrades.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/002-fix-memory-quality` | impl | [changelog-001-002-fix-memory-quality.md](./changelog/003-memory-and-causal-runtime/changelog-001-002-fix-memory-quality.md) |
| `003-memory-and-causal-runtime/001-continuity-memory-runtime/001-cache-warning-hooks` | impl | [changelog-001-001-cache-warning-hooks.md](./changelog/003-memory-and-causal-runtime/changelog-001-001-cache-warning-hooks.md)<br>[changelog-001-cache-warning-hooks.md](./changelog/003-memory-and-causal-runtime/changelog-001-cache-warning-hooks.md) |
| `001-research-and-baseline/006-research-memory-redundancy` | impl | [changelog-001-006-research-memory-redundancy.md](./changelog/001-research-and-baseline/changelog-001-006-research-memory-redundancy.md) |
| `001-research-and-baseline/004-graphify` | impl | [changelog-001-004-graphify.md](./changelog/001-research-and-baseline/changelog-001-004-graphify.md) |
| `001-research-and-baseline/002-codesight` | impl | [changelog-001-002-codesight.md](./changelog/001-research-and-baseline/changelog-001-002-codesight.md) |
| `001-research-and-baseline/001-claude-optimization-settings` | impl | [changelog-001-001-claude-optimization-settings.md](./changelog/001-research-and-baseline/changelog-001-001-claude-optimization-settings.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004b-skill-advisor-interface-and-env-vars` | impl | [changelog-022-004b-skill-advisor-interface-and-env-vars.md](./changelog/003-memory-and-causal-runtime/changelog-022-004b-skill-advisor-interface-and-env-vars.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation` | impl | [changelog-022-004a-skill-advisor-compat-contract-consolidation.md](./changelog/003-memory-and-causal-runtime/changelog-022-004a-skill-advisor-compat-contract-consolidation.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose` | impl | [changelog-022-002b-cocoindex-reranker-doc-prose.md](./changelog/003-memory-and-causal-runtime/changelog-022-002b-cocoindex-reranker-doc-prose.md) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs` | impl | (none) |
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs` | impl | (none) |

