---
title: "Chronological Timeline [system-spec-kit/027-xce-research-based-refinement/timeline]"
description: "GENERATED chronological index of 027 live-tree spec folders, newest to oldest by git activity. The recency view that is separate from folder numbers."
trigger_phrases:
  - "027 timeline"
  - "027 newest phase"
  - "027 most recent spec folder"
  - "027 chronological order"
  - "which 027 phase is newest"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-17T12:07:20Z"
    recent_action: "Regenerated chronological timeline from git history"
    next_safe_action: "Use this file to find the most recent / oldest spec folder"
    completion_pct: 100
---
# 027 Chronological Timeline

<!-- GENERATED FILE — do not hand-edit. Regenerate: `python3 scratch/gen-timeline.py > timeline.md` (run from the 027 root). -->

> **Generated:** 2026-06-17T12:07:20Z — regenerate before relying on intra-day ordering; same-day commits made
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
> **Most recent live spec folder:** `002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation`
> **Oldest live spec folder:** `000-release-cleanup/001-public-root-readme`
> **Counts:** 182 live spec folders · 0 archived (`z_archive/`).

---

## 0. Most recent 15 (quick answer to "what was worked on last")

```
 1. 2026-06-17 14:06  002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation
 2. 2026-06-17 14:06  002-memory-store-and-search
 3. 2026-06-17 12:39  002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set
 4. 2026-06-17 12:39  002-memory-store-and-search/017-search-and-output-intelligence-implementation
 5. 2026-06-17 09:32  002-memory-store-and-search/017-search-and-output-intelligence-implementation/007-output-surface-parity
 6. 2026-06-17 09:26  002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural
 7. 2026-06-17 09:18  002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder
 8. 2026-06-17 08:51  002-memory-store-and-search/017-search-and-output-intelligence-implementation/003-generic-query-deep-routing
 9. 2026-06-17 08:37  002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation
10. 2026-06-17 08:22  002-memory-store-and-search/016-search-and-output-intelligence-research/002-ai-output-command-vs-conversation
11. 2026-06-17 08:22  002-memory-store-and-search/016-search-and-output-intelligence-research/001-search-intelligence
12. 2026-06-17 08:22  002-memory-store-and-search/016-search-and-output-intelligence-research
13. 2026-06-17 08:22  005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening
14. 2026-06-17 08:22  005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors
15. 2026-06-17 08:22  005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation
```

---

## A. Tracks — newest activity → oldest

The six top-level themed tracks, ordered by most recent git activity. `Born` uses `--follow` so it
traces through the reorg `git mv` history to each track's true origin.

| Rank | Last active | Born | Track |
|------|------------------|------------|-------|
| 1 | 2026-06-17 14:06 | 2026-06-14 | `002-memory-store-and-search/` |
| 2 | 2026-06-17 08:22 | 2026-06-14 | `005-verification-and-remediation/` |
| 3 | 2026-06-17 08:22 | 2026-06-14 | `004-shared-infrastructure/` |
| 4 | 2026-06-17 08:22 | 2026-06-14 | `003-advisor-and-codegraph/` |
| 5 | 2026-06-17 08:22 | 2026-06-14 | `001-research-and-doctrine/` |
| 6 | 2026-06-17 08:22 | 2026-06-10 | `000-release-cleanup/` |

> Note: `000-release-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint). Folders with no committed git history (uncommitted) show `??????????` and sort last.

```
2026-06-17 14:06  born:2026-06-17  impl  002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation
2026-06-17 14:06  born:2026-06-14        002-memory-store-and-search
2026-06-17 12:39  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set
2026-06-17 12:39  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation
2026-06-17 09:32  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/007-output-surface-parity
2026-06-17 09:26  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural
2026-06-17 09:18  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder
2026-06-17 08:51  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/003-generic-query-deep-routing
2026-06-17 08:37  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation
2026-06-17 08:22  born:2026-06-17  impl  002-memory-store-and-search/016-search-and-output-intelligence-research/002-ai-output-command-vs-conversation
2026-06-17 08:22  born:2026-06-17  impl  002-memory-store-and-search/016-search-and-output-intelligence-research/001-search-intelligence
2026-06-17 08:22  born:2026-06-17  impl  002-memory-store-and-search/016-search-and-output-intelligence-research
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/004-cli-frontdoor-safety
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/003-code-graph-robustness
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle
2026-06-17 08:22  born:2026-06-16  impl  005-verification-and-remediation/005-fresh-regression-remediation/001-memory-storage-and-search
2026-06-17 08:22  born:2026-06-16        005-verification-and-remediation/005-fresh-regression-remediation
2026-06-17 08:22  born:2026-06-15  impl  003-advisor-and-codegraph/004-skill-advisor-suite-repair
2026-06-17 08:22  born:2026-06-14        005-verification-and-remediation
2026-06-17 08:22  born:2026-06-14        004-shared-infrastructure
2026-06-17 08:22  born:2026-06-14        003-advisor-and-codegraph
2026-06-17 08:22  born:2026-06-14        001-research-and-doctrine
2026-06-17 08:22  born:2026-06-13  impl  005-verification-and-remediation/004-residual-design-units
2026-06-17 08:22  born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening
2026-06-17 08:22  born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format
2026-06-17 08:22  born:2026-06-12  impl  005-verification-and-remediation/002-tri-system-deep-research
2026-06-17 08:22  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model
2026-06-17 08:22  born:2026-06-11        000-release-cleanup/009-skill-frontmatter-alignment
2026-06-17 08:22  born:2026-06-11  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands
2026-06-17 08:22  born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation
2026-06-17 08:22  born:2026-06-10  impl  000-release-cleanup/005-mcp-cli-stress-tests
2026-06-17 08:22  born:2026-06-10        000-release-cleanup
2026-06-17 08:22  born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate
2026-06-17 08:22  born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates
2026-06-17 08:22  born:2026-06-06        001-research-and-doctrine/002-gem-team-adoption
2026-06-17 08:22  born:2026-06-02        001-research-and-doctrine/001-peck-teachings-adoption
2026-06-17 08:19  born:2026-06-17  impl  002-memory-store-and-search/017-search-and-output-intelligence-implementation/001-token-budget-truncation-safety
2026-06-17 08:02  born:2026-06-16  impl  002-memory-store-and-search/015-retrieval-gating-and-recall-recovery
2026-06-16 16:59  born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer
2026-06-16 16:59  born:2026-05-09        002-memory-store-and-search/004-learning-feedback-reducers
2026-06-16 15:46  born:2026-06-11        005-verification-and-remediation/001-finding-remediation
2026-06-16 15:46  born:2026-06-11  impl  002-memory-store-and-search/014-idempotency-flag-on-correctness
2026-06-16 15:46  born:2026-06-11  impl  002-memory-store-and-search/013-provenance-injection
2026-06-16 15:46  born:2026-06-11  impl  002-memory-store-and-search/010-bm25-warmup-churn-reduction
2026-06-16 15:46  born:2026-06-10  impl  002-memory-store-and-search/009-packed-bm25-field-weights
2026-06-16 15:46  born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline
2026-06-15 18:28  born:2026-06-14  impl  004-shared-infrastructure/009-code-graph-code-only-indexing
2026-06-15 18:28  born:2026-06-14  impl  004-shared-infrastructure/008-mcp-config-alignment-reelection-default
2026-06-15 18:28  born:2026-06-14  impl  000-release-cleanup/000-spec-tree-consolidation
2026-06-15 18:28  born:2026-06-12  impl  005-verification-and-remediation/003-deep-research-remediation
2026-06-15 18:28  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review
2026-06-15 18:28  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/010-deep-review
2026-06-15 18:28  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research
2026-06-15 18:28  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context
2026-06-15 18:28  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council
2026-06-15 18:28  born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval
2026-06-15 18:28  born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate
2026-06-15 18:28  born:2026-05-09        002-memory-store-and-search/003-semantic-trigger-fallback
2026-06-14 11:25  born:2026-06-11  impl  002-memory-store-and-search/012-hybrid-search-scope-then-limit
2026-06-14 11:25  born:2026-06-11  impl  002-memory-store-and-search/011-vector-resilience-durability
2026-06-14 11:25  born:2026-06-11  impl  003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect
2026-06-14 11:25  born:2026-06-10        004-shared-infrastructure/004-cli-tooling-ux
2026-06-14 11:25  born:2026-06-10        003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph
2026-06-14 11:25  born:2026-06-10  impl  004-shared-infrastructure/003-storage-adapter-ports
2026-06-14 11:25  born:2026-06-10  impl  002-memory-store-and-search/008-vector-read-path-resilience
2026-06-14 11:25  born:2026-06-10  impl  003-advisor-and-codegraph/001-causal-traversal-bfs
2026-06-14 11:25  born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint
2026-06-14 11:25  born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter
2026-06-14 11:25  born:2026-06-06        002-memory-store-and-search/002-memory-index-causal-lifecycle
2026-06-14 11:25  born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation
2026-06-14 11:25  born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter
2026-06-14 11:25  born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones
2026-06-14 11:25  born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation
2026-06-14 11:25  born:??????????        005-verification-and-remediation/001-finding-remediation/sandbox-test
2026-06-14 08:55  born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/008-doc-truth-and-test-fidelity
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/007-continuity-and-save-concurrency
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/006-launchers-and-cli
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/005-bm25-indexing-fidelity
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/004-vector-and-checkpoint-durability
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/003-search-and-triggers
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/002-causal-and-memo
2026-06-14 08:55  born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/001-write-safety-and-guards
2026-06-14 08:55  born:2026-06-11  impl  004-shared-infrastructure/007-ipc-client-cap-hardening
2026-06-14 08:55  born:2026-06-11  impl  004-shared-infrastructure/006-code-mode-orphan-lifecycle
2026-06-14 08:55  born:2026-06-11  impl  004-shared-infrastructure/005-autonomous-dependency-patching
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard
2026-06-14 08:55  born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract
2026-06-14 08:55  born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/004-verify-and-ux
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/002-author-presentation-md
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract
2026-06-14 08:55  born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/004-verify-and-ux
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract
2026-06-14 08:55  born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/004-verify-and-ux
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/002-author-presentation-md
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract
2026-06-14 08:55  born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands
2026-06-14 08:55  born:2026-06-10  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/004-release-and-program-cleanup
2026-06-14 08:55  born:2026-06-08  impl  002-memory-store-and-search/007-openltm-continuity-resilience
2026-06-14 08:55  born:2026-06-08  impl  002-memory-store-and-search/006-openltm-retrieval-observability
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research
2026-06-14 08:55  born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research
2026-06-14 08:55  born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate
2026-06-14 08:55  born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit
2026-06-14 08:55  born:2026-06-06        002-memory-store-and-search/005-memclaw-derived-memory-hardening
2026-06-14 08:55  born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research
2026-06-14 08:55  born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli
2026-06-14 08:55  born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition
2026-06-14 08:55  born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review
2026-06-14 08:55  born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline
2026-06-14 08:55  born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates
2026-06-14 08:55  born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit
2026-06-14 08:55  born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration
2026-06-14 08:55  born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer
2026-06-14 08:55  born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator
2026-06-14 08:55  born:2026-05-11  impl  002-memory-store-and-search/001-memory-write-safety
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/008-deep-loop-runtime
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/007-deep-improvement
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/008-agents-md-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/007-agent-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/006-command-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/004-skill-manual-playbook
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/003-skill-feature-catalog
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/002-skill-docs-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/001-public-root-readme
```

---

## C. Archived spec folders (`z_archive/`)

Superseded / merged packets, preserved for provenance. Same sort. Resolve their original phase
identities via [`context-index.md`](./context-index.md).

```

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
| `002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation` | impl | [changelog-002-018-reindex-scan-responsiveness-and-cancellation.md](./changelog/002-memory-store-and-search/changelog-002-018-reindex-scan-responsiveness-and-cancellation.md) |
| `002-memory-store-and-search` |  | [changelog-002-memory-store-and-search-root.md](./changelog/002-memory-store-and-search/changelog-002-memory-store-and-search-root.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set` | impl | [changelog-002-017-004-confidence-calibration-labeled-set.md](./changelog/002-memory-store-and-search/changelog-002-017-004-confidence-calibration-labeled-set.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation` | impl | [changelog-002-017-search-and-output-intelligence-implementation-root.md](./changelog/002-memory-store-and-search/changelog-002-017-search-and-output-intelligence-implementation-root.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/007-output-surface-parity` | impl | [changelog-002-017-007-output-surface-parity.md](./changelog/002-memory-store-and-search/changelog-002-017-007-output-surface-parity.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural` | impl | [changelog-002-017-006-command-contract-structural.md](./changelog/002-memory-store-and-search/changelog-002-017-006-command-contract-structural.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder` | impl | [changelog-002-017-005-cosine-topn-reorder.md](./changelog/002-memory-store-and-search/changelog-002-017-005-cosine-topn-reorder.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/003-generic-query-deep-routing` | impl | [changelog-002-017-003-generic-query-deep-routing.md](./changelog/002-memory-store-and-search/changelog-002-017-003-generic-query-deep-routing.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation` | impl | [changelog-002-017-002-request-quality-aggregation.md](./changelog/002-memory-store-and-search/changelog-002-017-002-request-quality-aggregation.md) |
| `002-memory-store-and-search/016-search-and-output-intelligence-research/002-ai-output-command-vs-conversation` | impl | (none) |
| `002-memory-store-and-search/016-search-and-output-intelligence-research/001-search-intelligence` | impl | (none) |
| `002-memory-store-and-search/016-search-and-output-intelligence-research` | impl | [changelog-002-016-search-and-output-intelligence-research.md](./changelog/002-memory-store-and-search/changelog-002-016-search-and-output-intelligence-research.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening` | impl | [changelog-005-005-007-consolidation-hardening.md](./changelog/005-verification-and-remediation/changelog-005-005-007-consolidation-hardening.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors` | impl | [changelog-005-005-006-doc-truth-completion-and-mirrors.md](./changelog/005-verification-and-remediation/changelog-005-005-006-doc-truth-completion-and-mirrors.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation` | impl | [changelog-005-005-005-spec-folder-metadata-reconciliation.md](./changelog/005-verification-and-remediation/changelog-005-005-005-spec-folder-metadata-reconciliation.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/004-cli-frontdoor-safety` | impl | [changelog-005-005-004-cli-frontdoor-safety.md](./changelog/005-verification-and-remediation/changelog-005-005-004-cli-frontdoor-safety.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/003-code-graph-robustness` | impl | [changelog-005-005-003-code-graph-robustness.md](./changelog/005-verification-and-remediation/changelog-005-005-003-code-graph-robustness.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/002-daemon-launcher-lifecycle` | impl | [changelog-005-005-002-daemon-launcher-lifecycle.md](./changelog/005-verification-and-remediation/changelog-005-005-002-daemon-launcher-lifecycle.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation/001-memory-storage-and-search` | impl | [changelog-005-005-001-memory-storage-and-search.md](./changelog/005-verification-and-remediation/changelog-005-005-001-memory-storage-and-search.md) |
| `005-verification-and-remediation/005-fresh-regression-remediation` |  | [changelog-005-005-fresh-regression-remediation-root.md](./changelog/005-verification-and-remediation/changelog-005-005-fresh-regression-remediation-root.md) |
| `003-advisor-and-codegraph/004-skill-advisor-suite-repair` | impl | (none) |
| `005-verification-and-remediation` |  | [changelog-005-verification-and-remediation-root.md](./changelog/005-verification-and-remediation/changelog-005-verification-and-remediation-root.md) |
| `004-shared-infrastructure` |  | [changelog-004-shared-infrastructure-root.md](./changelog/004-shared-infrastructure/changelog-004-shared-infrastructure-root.md) |
| `003-advisor-and-codegraph` |  | [changelog-003-advisor-and-codegraph-root.md](./changelog/003-advisor-and-codegraph/changelog-003-advisor-and-codegraph-root.md) |
| `001-research-and-doctrine` |  | [changelog-001-research-and-doctrine-root.md](./changelog/001-research-and-doctrine/changelog-001-research-and-doctrine-root.md) |
| `005-verification-and-remediation/004-residual-design-units` | impl | [changelog-005-004-residual-design-units.md](./changelog/005-verification-and-remediation/changelog-005-004-residual-design-units.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening` | impl | [changelog-004-002-008-router-consistency-hardening.md](./changelog/004-shared-infrastructure/changelog-004-002-008-router-consistency-hardening.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format` | impl | [changelog-004-002-007-presentation-asset-format.md](./changelog/004-shared-infrastructure/changelog-004-002-007-presentation-asset-format.md) |
| `005-verification-and-remediation/002-tri-system-deep-research` | impl | [changelog-005-002-tri-system-deep-research-root.md](./changelog/005-verification-and-remediation/changelog-005-002-tri-system-deep-research-root.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model` | impl | [changelog-000-009-019-sk-prompt-small-model.md](./changelog/000-release-cleanup/changelog-000-009-019-sk-prompt-small-model.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment` |  | [changelog-000-009-skill-frontmatter-alignment.md](./changelog/000-release-cleanup/changelog-000-009-skill-frontmatter-alignment.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands` | impl | [changelog-004-002-005-deep-commands.md](./changelog/004-shared-infrastructure/changelog-004-002-005-deep-commands.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation` |  | [changelog-004-002-command-presentation-workflow-separation-root.md](./changelog/004-shared-infrastructure/changelog-004-002-command-presentation-workflow-separation-root.md) |
| `000-release-cleanup/005-mcp-cli-stress-tests` | impl | [changelog-000-005-mcp-cli-stress-tests.md](./changelog/000-release-cleanup/changelog-000-005-mcp-cli-stress-tests.md) |
| `000-release-cleanup` |  | [changelog-000-release-cleanup-root.md](./changelog/000-release-cleanup/changelog-000-release-cleanup-root.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate` | impl | [changelog-001-001-005-reviewer-prompt-benchmark-substrate.md](./changelog/001-research-and-doctrine/changelog-001-001-005-reviewer-prompt-benchmark-substrate.md) |
| `001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates` | impl | [changelog-001-002-002-scoped-preexec-and-handoff-gates.md](./changelog/001-research-and-doctrine/changelog-001-002-002-scoped-preexec-and-handoff-gates.md) |
| `001-research-and-doctrine/002-gem-team-adoption` |  | [changelog-001-002-gem-team-adoption-root.md](./changelog/001-research-and-doctrine/changelog-001-002-gem-team-adoption-root.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption` |  | [changelog-001-001-peck-teachings-adoption-root.md](./changelog/001-research-and-doctrine/changelog-001-001-peck-teachings-adoption-root.md) |
| `002-memory-store-and-search/017-search-and-output-intelligence-implementation/001-token-budget-truncation-safety` | impl | [changelog-002-017-001-token-budget-truncation-safety.md](./changelog/002-memory-store-and-search/changelog-002-017-001-token-budget-truncation-safety.md) |
| `002-memory-store-and-search/015-retrieval-gating-and-recall-recovery` | impl | [changelog-002-015-retrieval-gating-and-recall-recovery.md](./changelog/002-memory-store-and-search/changelog-002-015-retrieval-gating-and-recall-recovery.md) |
| `002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer` | impl | [changelog-002-004-004-feedback-retention-reducer.md](./changelog/002-memory-store-and-search/changelog-002-004-004-feedback-retention-reducer.md) |
| `002-memory-store-and-search/004-learning-feedback-reducers` |  | [changelog-002-004-learning-feedback-reducers-root.md](./changelog/002-memory-store-and-search/changelog-002-004-learning-feedback-reducers-root.md) |
| `005-verification-and-remediation/001-finding-remediation` |  | [changelog-005-001-finding-remediation-root.md](./changelog/005-verification-and-remediation/changelog-005-001-finding-remediation-root.md) |
| `002-memory-store-and-search/014-idempotency-flag-on-correctness` | impl | [changelog-002-014-idempotency-flag-on-correctness.md](./changelog/002-memory-store-and-search/changelog-002-014-idempotency-flag-on-correctness.md) |
| `002-memory-store-and-search/013-provenance-injection` | impl | [changelog-002-013-provenance-injection.md](./changelog/002-memory-store-and-search/changelog-002-013-provenance-injection.md) |
| `002-memory-store-and-search/010-bm25-warmup-churn-reduction` | impl | [changelog-002-010-bm25-warmup-churn-reduction.md](./changelog/002-memory-store-and-search/changelog-002-010-bm25-warmup-churn-reduction.md) |
| `002-memory-store-and-search/009-packed-bm25-field-weights` | impl | [changelog-002-009-packed-bm25-field-weights.md](./changelog/002-memory-store-and-search/changelog-002-009-packed-bm25-field-weights.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline` | impl | [changelog-001-001-006-peck-verification-discipline.md](./changelog/001-research-and-doctrine/changelog-001-001-006-peck-verification-discipline.md) |
| `004-shared-infrastructure/009-code-graph-code-only-indexing` | impl | [changelog-004-009-code-graph-code-only-indexing.md](./changelog/004-shared-infrastructure/changelog-004-009-code-graph-code-only-indexing.md) |
| `004-shared-infrastructure/008-mcp-config-alignment-reelection-default` | impl | [changelog-004-008-mcp-config-alignment-reelection-default.md](./changelog/004-shared-infrastructure/changelog-004-008-mcp-config-alignment-reelection-default.md) |
| `000-release-cleanup/000-spec-tree-consolidation` | impl | [changelog-000-000-spec-tree-consolidation.md](./changelog/000-release-cleanup/changelog-000-000-spec-tree-consolidation.md) |
| `005-verification-and-remediation/003-deep-research-remediation` | impl | [changelog-005-003-deep-research-remediation-root.md](./changelog/005-verification-and-remediation/changelog-005-003-deep-research-remediation-root.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review` | impl | [changelog-000-009-015-sk-code-review.md](./changelog/000-release-cleanup/changelog-000-009-015-sk-code-review.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/010-deep-review` | impl | [changelog-000-009-010-deep-review.md](./changelog/000-release-cleanup/changelog-000-009-010-deep-review.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research` | impl | [changelog-000-009-009-deep-research.md](./changelog/000-release-cleanup/changelog-000-009-009-deep-research.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context` | impl | [changelog-000-009-006-deep-context.md](./changelog/000-release-cleanup/changelog-000-009-006-deep-context.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council` | impl | [changelog-000-009-005-deep-ai-council.md](./changelog/000-release-cleanup/changelog-000-009-005-deep-ai-council.md) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval` | impl | [changelog-002-003-004-tests-goldens-shadow-eval.md](./changelog/002-memory-store-and-search/changelog-002-003-004-tests-goldens-shadow-eval.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate` | impl | [changelog-001-001-007-acceptance-coverage-gate.md](./changelog/001-research-and-doctrine/changelog-001-001-007-acceptance-coverage-gate.md) |
| `002-memory-store-and-search/003-semantic-trigger-fallback` |  | [changelog-002-003-semantic-trigger-fallback-root.md](./changelog/002-memory-store-and-search/changelog-002-003-semantic-trigger-fallback-root.md) |
| `002-memory-store-and-search/012-hybrid-search-scope-then-limit` | impl | [changelog-002-012-hybrid-search-scope-then-limit.md](./changelog/002-memory-store-and-search/changelog-002-012-hybrid-search-scope-then-limit.md) |
| `002-memory-store-and-search/011-vector-resilience-durability` | impl | [changelog-002-011-vector-resilience-durability.md](./changelog/002-memory-store-and-search/changelog-002-011-vector-resilience-durability.md) |
| `003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` | impl | [changelog-003-003-skill-advisor-cross-session-reconnect.md](./changelog/003-advisor-and-codegraph/changelog-003-003-skill-advisor-cross-session-reconnect.md) |
| `004-shared-infrastructure/004-cli-tooling-ux` |  | [changelog-004-004-cli-tooling-ux-root.md](./changelog/004-shared-infrastructure/changelog-004-004-cli-tooling-ux-root.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph` |  | [changelog-003-002-xce-feature-adoption-advisor-codegraph-root.md](./changelog/003-advisor-and-codegraph/changelog-003-002-xce-feature-adoption-advisor-codegraph-root.md) |
| `004-shared-infrastructure/003-storage-adapter-ports` | impl | [changelog-004-003-storage-adapter-ports.md](./changelog/004-shared-infrastructure/changelog-004-003-storage-adapter-ports.md) |
| `002-memory-store-and-search/008-vector-read-path-resilience` | impl | [changelog-002-008-vector-read-path-resilience.md](./changelog/002-memory-store-and-search/changelog-002-008-vector-read-path-resilience.md) |
| `003-advisor-and-codegraph/001-causal-traversal-bfs` | impl | [changelog-003-001-causal-traversal-bfs.md](./changelog/003-advisor-and-codegraph/changelog-003-001-causal-traversal-bfs.md) |
| `001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint` | impl | [changelog-001-002-003-planner-review-focus-and-drift-hint.md](./changelog/001-research-and-doctrine/changelog-001-002-003-planner-review-focus-and-drift-hint.md) |
| `001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter` | impl | [changelog-001-002-001-typed-agent-io-adapter.md](./changelog/001-research-and-doctrine/changelog-001-002-001-typed-agent-io-adapter.md) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle` |  | [changelog-002-002-memory-index-causal-lifecycle-root.md](./changelog/002-memory-store-and-search/changelog-002-002-memory-index-causal-lifecycle-root.md) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation` | impl | [changelog-002-002-004-write-path-reconciliation.md](./changelog/002-memory-store-and-search/changelog-002-002-004-write-path-reconciliation.md) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter` | impl | [changelog-002-002-003-metadata-edge-promoter.md](./changelog/002-memory-store-and-search/changelog-002-002-003-metadata-edge-promoter.md) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones` | impl | [changelog-002-002-002-causal-tombstone-sweep.md](./changelog/002-memory-store-and-search/changelog-002-002-002-causal-tombstone-sweep.md) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation` | impl | [changelog-002-002-001-incremental-index-foundation.md](./changelog/002-memory-store-and-search/changelog-002-002-001-incremental-index-foundation.md) |
| `005-verification-and-remediation/001-finding-remediation/sandbox-test` |  | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research` | impl | [changelog-004-002-006-presentation-adherence-research.md](./changelog/004-shared-infrastructure/changelog-004-002-006-presentation-adherence-research.md) |
| `005-verification-and-remediation/001-finding-remediation/008-doc-truth-and-test-fidelity` | impl | [changelog-005-001-008-doc-truth-and-test-fidelity.md](./changelog/005-verification-and-remediation/changelog-005-001-008-doc-truth-and-test-fidelity.md) |
| `005-verification-and-remediation/001-finding-remediation/007-continuity-and-save-concurrency` | impl | [changelog-005-001-007-continuity-and-save-concurrency.md](./changelog/005-verification-and-remediation/changelog-005-001-007-continuity-and-save-concurrency.md) |
| `005-verification-and-remediation/001-finding-remediation/006-launchers-and-cli` | impl | [changelog-005-001-006-launchers-and-cli.md](./changelog/005-verification-and-remediation/changelog-005-001-006-launchers-and-cli.md) |
| `005-verification-and-remediation/001-finding-remediation/005-bm25-indexing-fidelity` | impl | [changelog-005-001-005-bm25-indexing-fidelity.md](./changelog/005-verification-and-remediation/changelog-005-001-005-bm25-indexing-fidelity.md) |
| `005-verification-and-remediation/001-finding-remediation/004-vector-and-checkpoint-durability` | impl | [changelog-005-001-004-vector-and-checkpoint-durability.md](./changelog/005-verification-and-remediation/changelog-005-001-004-vector-and-checkpoint-durability.md) |
| `005-verification-and-remediation/001-finding-remediation/003-search-and-triggers` | impl | [changelog-005-001-003-search-and-triggers.md](./changelog/005-verification-and-remediation/changelog-005-001-003-search-and-triggers.md) |
| `005-verification-and-remediation/001-finding-remediation/002-causal-and-memo` | impl | [changelog-005-001-002-causal-and-memo.md](./changelog/005-verification-and-remediation/changelog-005-001-002-causal-and-memo.md) |
| `005-verification-and-remediation/001-finding-remediation/001-write-safety-and-guards` | impl | [changelog-005-001-001-write-safety-and-guards.md](./changelog/005-verification-and-remediation/changelog-005-001-001-write-safety-and-guards.md) |
| `004-shared-infrastructure/007-ipc-client-cap-hardening` | impl | [changelog-004-007-ipc-client-cap-hardening.md](./changelog/004-shared-infrastructure/changelog-004-007-ipc-client-cap-hardening.md) |
| `004-shared-infrastructure/006-code-mode-orphan-lifecycle` | impl | [changelog-004-006-code-mode-orphan-lifecycle.md](./changelog/004-shared-infrastructure/changelog-004-006-code-mode-orphan-lifecycle.md) |
| `004-shared-infrastructure/005-autonomous-dependency-patching` | impl | [changelog-004-005-autonomous-dependency-patching.md](./changelog/004-shared-infrastructure/changelog-004-005-autonomous-dependency-patching.md) |
| `004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion` | impl | [changelog-004-004-005-cli-automation-compact-completion.md](./changelog/004-shared-infrastructure/changelog-004-004-005-cli-automation-compact-completion.md) |
| `004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge` | impl | [changelog-004-004-004-cli-fallback-envelope-and-bridge.md](./changelog/004-shared-infrastructure/changelog-004-004-004-cli-fallback-envelope-and-bridge.md) |
| `004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs` | impl | [changelog-004-004-003-cli-reference-and-skill-docs.md](./changelog/004-shared-infrastructure/changelog-004-004-003-cli-reference-and-skill-docs.md) |
| `004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors` | impl | [changelog-004-004-002-cli-help-aliases-errors.md](./changelog/004-shared-infrastructure/changelog-004-004-002-cli-help-aliases-errors.md) |
| `004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke` | impl | [changelog-004-004-001-cli-freshness-and-smoke.md](./changelog/004-shared-infrastructure/changelog-004-004-001-cli-freshness-and-smoke.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver` | impl | [changelog-003-002-009-codegraph-bm25-symbol-resolver.md](./changelog/003-advisor-and-codegraph/changelog-003-002-009-codegraph-bm25-symbol-resolver.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included` | impl | [changelog-003-002-008-codegraph-why-included.md](./changelog/003-advisor-and-codegraph/changelog-003-002-008-codegraph-why-included.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation` | impl | [changelog-003-002-007-codegraph-bfs-consolidation.md](./changelog/003-advisor-and-codegraph/changelog-003-002-007-codegraph-bfs-consolidation.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit` | impl | [changelog-003-002-006-codegraph-tombstone-audit.md](./changelog/003-advisor-and-codegraph/changelog-003-002-006-codegraph-tombstone-audit.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration` | impl | [changelog-003-002-005-advisor-feedback-calibration.md](./changelog/003-advisor-and-codegraph/changelog-003-002-005-advisor-feedback-calibration.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation` | impl | [changelog-003-002-004-advisor-bfs-consolidation.md](./changelog/003-advisor-and-codegraph/changelog-003-002-004-advisor-bfs-consolidation.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical` | impl | [changelog-003-002-003-advisor-packed-bm25-lexical.md](./changelog/003-advisor-and-codegraph/changelog-003-002-003-advisor-packed-bm25-lexical.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard` | impl | [changelog-003-002-002-advisor-provenance-guard.md](./changelog/003-advisor-and-codegraph/changelog-003-002-002-advisor-provenance-guard.md) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability` | impl | [changelog-003-002-001-advisor-observability.md](./changelog/003-advisor-and-codegraph/changelog-003-002-001-advisor-observability.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux` | impl | [changelog-004-004-verify-and-ux.md](./changelog/004-shared-infrastructure/changelog-004-004-verify-and-ux.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire` | impl | [changelog-004-003-router-rewire.md](./changelog/004-shared-infrastructure/changelog-004-003-router-rewire.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md` | impl | [changelog-004-002-author-presentation-md.md](./changelog/004-shared-infrastructure/changelog-004-002-author-presentation-md.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract` | impl | [changelog-004-001-inventory-extract.md](./changelog/004-shared-infrastructure/changelog-004-001-inventory-extract.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands` |  | [changelog-004-002-004-doctor-commands.md](./changelog/004-shared-infrastructure/changelog-004-002-004-doctor-commands.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/004-verify-and-ux` | impl | [changelog-003-004-verify-and-ux.md](./changelog/004-shared-infrastructure/changelog-003-004-verify-and-ux.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire` | impl | [changelog-003-003-router-rewire.md](./changelog/004-shared-infrastructure/changelog-003-003-router-rewire.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/002-author-presentation-md` | impl | [changelog-003-002-author-presentation-md.md](./changelog/004-shared-infrastructure/changelog-003-002-author-presentation-md.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract` | impl | [changelog-003-001-inventory-extract.md](./changelog/004-shared-infrastructure/changelog-003-001-inventory-extract.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands` |  | [changelog-004-002-003-create-commands.md](./changelog/004-shared-infrastructure/changelog-004-002-003-create-commands.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/004-verify-and-ux` | impl | [changelog-002-004-verify-and-ux.md](./changelog/004-shared-infrastructure/changelog-002-004-verify-and-ux.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire` | impl | [changelog-002-003-router-rewire.md](./changelog/004-shared-infrastructure/changelog-002-003-router-rewire.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md` | impl | [changelog-002-002-author-presentation-md.md](./changelog/004-shared-infrastructure/changelog-002-002-author-presentation-md.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract` | impl | [changelog-002-001-inventory-extract.md](./changelog/004-shared-infrastructure/changelog-002-001-inventory-extract.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands` |  | [changelog-004-002-002-speckit-commands.md](./changelog/004-shared-infrastructure/changelog-004-002-002-speckit-commands.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/004-verify-and-ux` | impl | [changelog-001-004-verify-and-ux.md](./changelog/004-shared-infrastructure/changelog-001-004-verify-and-ux.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire` | impl | [changelog-001-003-router-rewire.md](./changelog/004-shared-infrastructure/changelog-001-003-router-rewire.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/002-author-presentation-md` | impl | [changelog-001-002-author-presentation-md.md](./changelog/004-shared-infrastructure/changelog-001-002-author-presentation-md.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract` | impl | [changelog-001-001-inventory-extract.md](./changelog/004-shared-infrastructure/changelog-001-001-inventory-extract.md) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands` |  | [changelog-004-002-001-memory-commands.md](./changelog/004-shared-infrastructure/changelog-004-002-001-memory-commands.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/004-release-and-program-cleanup` | impl | [changelog-004-001-004-release-and-program-cleanup.md](./changelog/004-shared-infrastructure/changelog-004-001-004-release-and-program-cleanup.md) |
| `002-memory-store-and-search/007-openltm-continuity-resilience` | impl | [changelog-002-007-openltm-continuity-resilience.md](./changelog/002-memory-store-and-search/changelog-002-007-openltm-continuity-resilience.md) |
| `002-memory-store-and-search/006-openltm-retrieval-observability` | impl | [changelog-002-006-openltm-retrieval-observability.md](./changelog/002-memory-store-and-search/changelog-002-006-openltm-retrieval-observability.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration` | impl | [changelog-004-001-003-003-skill-advisor-runtime-integration.md](./changelog/004-shared-infrastructure/changelog-004-001-003-003-skill-advisor-runtime-integration.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests` | impl | [changelog-004-001-003-002-skill-advisor-hardening.md](./changelog/004-shared-infrastructure/changelog-004-001-003-002-skill-advisor-hardening.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core` | impl | [changelog-004-001-003-001-skill-advisor-cli-core.md](./changelog/004-shared-infrastructure/changelog-004-001-003-001-skill-advisor-cli-core.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration` | impl | [changelog-004-001-002-003-code-index-runtime-integration.md](./changelog/004-shared-infrastructure/changelog-004-001-002-003-code-index-runtime-integration.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests` | impl | [changelog-004-001-002-002-code-index-hardening.md](./changelog/004-shared-infrastructure/changelog-004-001-002-002-code-index-hardening.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core` | impl | [changelog-004-001-002-001-code-index-cli-core.md](./changelog/004-shared-infrastructure/changelog-004-001-002-001-code-index-cli-core.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration` | impl | [changelog-004-001-001-003-spec-memory-runtime-integration.md](./changelog/004-shared-infrastructure/changelog-004-001-001-003-spec-memory-runtime-integration.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests` | impl | [changelog-004-001-001-002-spec-memory-hardening.md](./changelog/004-shared-infrastructure/changelog-004-001-001-002-spec-memory-hardening.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core` | impl | [changelog-004-001-001-001-spec-memory-cli-core.md](./changelog/004-shared-infrastructure/changelog-004-001-001-001-spec-memory-cli-core.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research` | impl | [changelog-004-001-003-000-skill-advisor-cli-research.md](./changelog/004-shared-infrastructure/changelog-004-001-003-000-skill-advisor-cli-research.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli` |  | [changelog-004-001-003-skill-advisor-cli-root.md](./changelog/004-shared-infrastructure/changelog-004-001-003-skill-advisor-cli-root.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research` | impl | [changelog-004-001-002-000-code-index-cli-research.md](./changelog/004-shared-infrastructure/changelog-004-001-002-000-code-index-cli-research.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli` |  | [changelog-004-001-002-code-index-cli-root.md](./changelog/004-shared-infrastructure/changelog-004-001-002-code-index-cli-root.md) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler` | impl | [changelog-002-003-003-hybrid-handler.md](./changelog/002-memory-store-and-search/changelog-002-003-003-hybrid-handler.md) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher` | impl | [changelog-002-003-002-semantic-matcher.md](./changelog/002-memory-store-and-search/changelog-002-003-002-semantic-matcher.md) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill` | impl | [changelog-002-003-001-schema-backfill.md](./changelog/002-memory-store-and-search/changelog-002-003-001-schema-backfill.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership` | impl | [changelog-002-005-005-stale-audit-and-tool-ownership.md](./changelog/002-memory-store-and-search/changelog-002-005-005-stale-audit-and-tool-ownership.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion` | impl | [changelog-002-005-004-tombstones-and-edge-promotion.md](./changelog/002-memory-store-and-search/changelog-002-005-004-tombstones-and-edge-promotion.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe` | impl | [changelog-002-005-003-feedback-log-and-005-reframe.md](./changelog/002-memory-store-and-search/changelog-002-005-003-feedback-log-and-005-reframe.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate` | impl | [changelog-002-005-002-idempotency-and-near-duplicate.md](./changelog/002-memory-store-and-search/changelog-002-005-002-idempotency-and-near-duplicate.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit` | impl | [changelog-002-005-001-provenance-and-audit.md](./changelog/002-memory-store-and-search/changelog-002-005-001-provenance-and-audit.md) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening` |  | [changelog-002-005-memclaw-derived-memory-hardening-root.md](./changelog/002-memory-store-and-search/changelog-002-005-memclaw-derived-memory-hardening-root.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research` | impl | [changelog-004-001-001-000-spec-memory-cli-research.md](./changelog/004-shared-infrastructure/changelog-004-001-001-000-spec-memory-cli-research.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli` |  | [changelog-004-001-001-spec-memory-cli-root.md](./changelog/004-shared-infrastructure/changelog-004-001-001-spec-memory-cli-root.md) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition` |  | [changelog-004-001-mcp-to-cli-tool-transition-root.md](./changelog/004-shared-infrastructure/changelog-004-001-mcp-to-cli-tool-transition-root.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review` | impl | [changelog-001-001-004-constitutional-rule-review.md](./changelog/001-research-and-doctrine/changelog-001-001-004-constitutional-rule-review.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline` | impl | [changelog-001-001-003-current-state-discipline.md](./changelog/001-research-and-doctrine/changelog-001-001-003-current-state-discipline.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates` | impl | [changelog-001-001-002-self-check-templates.md](./changelog/001-research-and-doctrine/changelog-001-001-002-self-check-templates.md) |
| `001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit` | impl | [changelog-001-001-001-peck-teachings-for-spec-kit.md](./changelog/001-research-and-doctrine/changelog-001-001-001-peck-teachings-for-spec-kit.md) |
| `002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration` | impl | [changelog-002-004-005-env-tests-integration.md](./changelog/002-memory-store-and-search/changelog-002-004-005-env-tests-integration.md) |
| `002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer` | impl | [changelog-002-004-003-session-trace-causal-reducer.md](./changelog/002-memory-store-and-search/changelog-002-004-003-session-trace-causal-reducer.md) |
| `002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator` | impl | [changelog-002-004-001-shared-feedback-aggregation.md](./changelog/002-memory-store-and-search/changelog-002-004-001-shared-feedback-aggregation.md) |
| `002-memory-store-and-search/001-memory-write-safety` | impl | [changelog-002-001-memory-write-safety.md](./changelog/002-memory-store-and-search/changelog-002-001-memory-write-safety.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit` | impl | [changelog-000-009-022-system-spec-kit.md](./changelog/000-release-cleanup/changelog-000-009-022-system-spec-kit.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` | impl | [changelog-000-009-021-system-skill-advisor.md](./changelog/000-release-cleanup/changelog-000-009-021-system-skill-advisor.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph` | impl | [changelog-000-009-020-system-code-graph.md](./changelog/000-release-cleanup/changelog-000-009-020-system-code-graph.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt` | impl | [changelog-000-009-018-sk-prompt.md](./changelog/000-release-cleanup/changelog-000-009-018-sk-prompt.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git` | impl | [changelog-000-009-017-sk-git.md](./changelog/000-release-cleanup/changelog-000-009-017-sk-git.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc` | impl | [changelog-000-009-016-sk-doc.md](./changelog/000-release-cleanup/changelog-000-009-016-sk-doc.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code` | impl | [changelog-000-009-014-sk-code.md](./changelog/000-release-cleanup/changelog-000-009-014-sk-code.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode` | impl | [changelog-000-009-013-mcp-code-mode.md](./changelog/000-release-cleanup/changelog-000-009-013-mcp-code-mode.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up` | impl | [changelog-000-009-012-mcp-click-up.md](./changelog/000-release-cleanup/changelog-000-009-012-mcp-click-up.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools` | impl | [changelog-000-009-011-mcp-chrome-devtools.md](./changelog/000-release-cleanup/changelog-000-009-011-mcp-chrome-devtools.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/008-deep-loop-runtime` | impl | [changelog-000-009-008-deep-loop-runtime.md](./changelog/000-release-cleanup/changelog-000-009-008-deep-loop-runtime.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/007-deep-improvement` | impl | [changelog-000-009-007-deep-improvement.md](./changelog/000-release-cleanup/changelog-000-009-007-deep-improvement.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode` | impl | [changelog-000-009-004-cli-opencode.md](./changelog/000-release-cleanup/changelog-000-009-004-cli-opencode.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex` | impl | [changelog-000-009-003-cli-codex.md](./changelog/000-release-cleanup/changelog-000-009-003-cli-codex.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code` | impl | [changelog-000-009-002-cli-claude-code.md](./changelog/000-release-cleanup/changelog-000-009-002-cli-claude-code.md) |
| `000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation` | impl | [changelog-000-009-001-frontmatter-benefit-investigation.md](./changelog/000-release-cleanup/changelog-000-009-001-frontmatter-benefit-investigation.md) |
| `000-release-cleanup/008-agents-md-alignment` | impl | [changelog-000-008-agents-md-alignment.md](./changelog/000-release-cleanup/changelog-000-008-agents-md-alignment.md) |
| `000-release-cleanup/007-agent-alignment` | impl | [changelog-000-007-agent-alignment.md](./changelog/000-release-cleanup/changelog-000-007-agent-alignment.md) |
| `000-release-cleanup/006-command-alignment` | impl | [changelog-000-006-command-alignment.md](./changelog/000-release-cleanup/changelog-000-006-command-alignment.md) |
| `000-release-cleanup/004-skill-manual-playbook` | impl | [changelog-000-004-skill-manual-playbook.md](./changelog/000-release-cleanup/changelog-000-004-skill-manual-playbook.md) |
| `000-release-cleanup/003-skill-feature-catalog` | impl | [changelog-000-003-skill-feature-catalog.md](./changelog/000-release-cleanup/changelog-000-003-skill-feature-catalog.md) |
| `000-release-cleanup/002-skill-docs-alignment` | impl | [changelog-000-002-skill-docs-alignment.md](./changelog/000-release-cleanup/changelog-000-002-skill-docs-alignment.md) |
| `000-release-cleanup/001-public-root-readme` | impl | [changelog-000-001-public-root-readme.md](./changelog/000-release-cleanup/changelog-000-001-public-root-readme.md) |

