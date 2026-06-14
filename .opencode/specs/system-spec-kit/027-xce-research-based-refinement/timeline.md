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
    last_updated_at: "2026-06-14T06:45:23Z"
    recent_action: "Regenerated chronological timeline from git history"
    next_safe_action: "Use this file to find the most recent / oldest spec folder"
    completion_pct: 100
---
# 027 Chronological Timeline

<!-- GENERATED FILE — do not hand-edit. Regenerate: `python3 scratch/gen-timeline.py > timeline.md` (run from the 027 root). -->

> **Generated:** 2026-06-14T06:45:23Z — regenerate before relying on intra-day ordering; same-day commits made
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
> **Most recent live spec folder:** `000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit`
> **Oldest live spec folder:** `005-verification-and-remediation/001-finding-remediation/sandbox-test`
> **Counts:** 158 live spec folders · 0 archived (`z_archive/`).

---

## 0. Most recent 15 (quick answer to "what was worked on last")

```
 1. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit
 2. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor
 3. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph
 4. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model
 5. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt
 6. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git
 7. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc
 8. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review
 9. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code
10. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode
11. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up
12. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools
13. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/010-deep-review
14. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research
15. 2026-06-14 08:03  000-release-cleanup/009-skill-frontmatter-alignment/008-deep-loop-runtime
```

---

## A. Tracks — newest activity → oldest

The eight top-level themed tracks, ordered by most recent git activity. `Born` uses `--follow` so it
traces through the reorg `git mv` history to each track's true origin.

| Rank | Last active | Born | Track |
|------|------------------|------------|-------|
| 1 | 2026-06-14 08:03 | 2026-06-10 | `000-release-cleanup/` |
| 2 | ??????????      | 2026-06-14 | `005-verification-and-remediation/` |
| 3 | ??????????      | 2026-06-14 | `004-shared-infrastructure/` |
| 4 | ??????????      | 2026-06-14 | `003-advisor-and-codegraph/` |
| 5 | ??????????      | 2026-06-14 | `002-memory-store-and-search/` |
| 6 | ??????????      | 2026-06-14 | `001-research-and-doctrine/` |

> Note: `000-release-and-program-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint). Folders with no committed git history (uncommitted) show `??????????` and sort last.

```
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/010-deep-review
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/008-deep-loop-runtime
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/007-deep-improvement
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code
2026-06-14 08:03  born:2026-06-11  impl  000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation
2026-06-14 08:03  born:2026-06-11        000-release-cleanup/009-skill-frontmatter-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/008-agents-md-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/007-agent-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/006-command-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/005-mcp-cli-stress-tests
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/004-skill-manual-playbook
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/003-skill-feature-catalog
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/002-skill-docs-alignment
2026-06-14 08:03  born:2026-06-10  impl  000-release-cleanup/001-public-root-readme
2026-06-14 08:03  born:2026-06-10        000-release-cleanup
??????????       born:2026-06-14        005-verification-and-remediation
??????????       born:2026-06-14        004-shared-infrastructure
??????????       born:2026-06-14        003-advisor-and-codegraph
??????????       born:2026-06-14        002-memory-store-and-search
??????????       born:2026-06-14        001-research-and-doctrine
??????????       born:2026-06-14  impl  000-release-cleanup/000-spec-tree-consolidation
??????????       born:2026-06-13  impl  005-verification-and-remediation/004-residual-design-units
??????????       born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening
??????????       born:2026-06-12  impl  005-verification-and-remediation/003-deep-research-remediation
??????????       born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format
??????????       born:2026-06-12  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research
??????????       born:2026-06-12  impl  005-verification-and-remediation/002-tri-system-deep-research
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/008-doc-truth-and-test-fidelity
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/007-continuity-and-save-concurrency
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/006-launchers-and-cli
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/005-bm25-indexing-fidelity
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/004-vector-and-checkpoint-durability
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/003-search-and-triggers
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/002-causal-and-memo
??????????       born:2026-06-11  impl  005-verification-and-remediation/001-finding-remediation/001-write-safety-and-guards
??????????       born:2026-06-11        005-verification-and-remediation/001-finding-remediation
??????????       born:2026-06-11  impl  004-shared-infrastructure/007-ipc-client-cap-hardening
??????????       born:2026-06-11  impl  004-shared-infrastructure/006-code-mode-orphan-lifecycle
??????????       born:2026-06-11  impl  002-memory-store-and-search/014-idempotency-flag-on-correctness
??????????       born:2026-06-11  impl  002-memory-store-and-search/013-provenance-injection
??????????       born:2026-06-11  impl  004-shared-infrastructure/005-autonomous-dependency-patching
??????????       born:2026-06-11  impl  002-memory-store-and-search/012-hybrid-search-scope-then-limit
??????????       born:2026-06-11  impl  002-memory-store-and-search/011-vector-resilience-durability
??????????       born:2026-06-11  impl  003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect
??????????       born:2026-06-11  impl  002-memory-store-and-search/010-bm25-warmup-churn-reduction
??????????       born:2026-06-11  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands
??????????       born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion
??????????       born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge
??????????       born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs
??????????       born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors
??????????       born:2026-06-10        004-shared-infrastructure/004-cli-tooling-ux
??????????       born:2026-06-10  impl  004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability
??????????       born:2026-06-10        003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph
??????????       born:2026-06-10  impl  004-shared-infrastructure/003-storage-adapter-ports
??????????       born:2026-06-10  impl  002-memory-store-and-search/009-packed-bm25-field-weights
??????????       born:2026-06-10  impl  002-memory-store-and-search/008-vector-read-path-resilience
??????????       born:2026-06-10  impl  003-advisor-and-codegraph/001-causal-traversal-bfs
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract
??????????       born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/004-verify-and-ux
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/002-author-presentation-md
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract
??????????       born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/004-verify-and-ux
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract
??????????       born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/004-verify-and-ux
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/002-author-presentation-md
??????????       born:2026-06-10  impl  004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract
??????????       born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands
??????????       born:2026-06-10        004-shared-infrastructure/002-command-presentation-workflow-separation
??????????       born:2026-06-10  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/004-release-and-program-cleanup
??????????       born:2026-06-08  impl  002-memory-store-and-search/007-openltm-continuity-resilience
??????????       born:2026-06-08  impl  002-memory-store-and-search/006-openltm-retrieval-observability
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research
??????????       born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research
??????????       born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli
??????????       born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval
??????????       born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler
??????????       born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher
??????????       born:2026-06-06  impl  002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill
??????????       born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate
??????????       born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate
??????????       born:2026-06-06  impl  001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline
??????????       born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint
??????????       born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates
??????????       born:2026-06-06  impl  001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter
??????????       born:2026-06-06        001-research-and-doctrine/002-gem-team-adoption
??????????       born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership
??????????       born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion
??????????       born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe
??????????       born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate
??????????       born:2026-06-06  impl  002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit
??????????       born:2026-06-06        002-memory-store-and-search/005-memclaw-derived-memory-hardening
??????????       born:2026-06-06  impl  004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research
??????????       born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli
??????????       born:2026-06-06        004-shared-infrastructure/001-mcp-to-cli-tool-transition
??????????       born:2026-06-06        002-memory-store-and-search/002-memory-index-causal-lifecycle
??????????       born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review
??????????       born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline
??????????       born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates
??????????       born:2026-06-02        001-research-and-doctrine/001-peck-teachings-adoption
??????????       born:2026-06-02  impl  001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit
??????????       born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation
??????????       born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter
??????????       born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones
??????????       born:2026-05-13  impl  002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation
??????????       born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration
??????????       born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer
??????????       born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer
??????????       born:2026-05-12  impl  002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator
??????????       born:2026-05-11  impl  002-memory-store-and-search/001-memory-write-safety
??????????       born:2026-05-09        002-memory-store-and-search/004-learning-feedback-reducers
??????????       born:2026-05-09        002-memory-store-and-search/003-semantic-trigger-fallback
??????????       born:??????????        005-verification-and-remediation/001-finding-remediation/sandbox-test
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
| `000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/010-deep-review` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/008-deep-loop-runtime` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/007-deep-improvement` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/003-cli-codex` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation` | impl | (none) |
| `000-release-cleanup/009-skill-frontmatter-alignment` |  | [changelog-000-009-skill-frontmatter-alignment.md](./changelog/000-release-cleanup/changelog-000-009-skill-frontmatter-alignment.md) |
| `000-release-cleanup/008-agents-md-alignment` | impl | [changelog-000-008-agents-md-alignment.md](./changelog/000-release-cleanup/changelog-000-008-agents-md-alignment.md) |
| `000-release-cleanup/007-agent-alignment` | impl | [changelog-000-007-agent-alignment.md](./changelog/000-release-cleanup/changelog-000-007-agent-alignment.md) |
| `000-release-cleanup/006-command-alignment` | impl | [changelog-000-006-command-alignment.md](./changelog/000-release-cleanup/changelog-000-006-command-alignment.md) |
| `000-release-cleanup/005-mcp-cli-stress-tests` | impl | [changelog-000-005-mcp-cli-stress-tests.md](./changelog/000-release-cleanup/changelog-000-005-mcp-cli-stress-tests.md) |
| `000-release-cleanup/004-skill-manual-playbook` | impl | [changelog-000-004-skill-manual-playbook.md](./changelog/000-release-cleanup/changelog-000-004-skill-manual-playbook.md) |
| `000-release-cleanup/003-skill-feature-catalog` | impl | [changelog-000-003-skill-feature-catalog.md](./changelog/000-release-cleanup/changelog-000-003-skill-feature-catalog.md) |
| `000-release-cleanup/002-skill-docs-alignment` | impl | [changelog-000-002-skill-docs-alignment.md](./changelog/000-release-cleanup/changelog-000-002-skill-docs-alignment.md) |
| `000-release-cleanup/001-public-root-readme` | impl | [changelog-000-001-public-root-readme.md](./changelog/000-release-cleanup/changelog-000-001-public-root-readme.md) |
| `000-release-cleanup` |  | [changelog-000-release-cleanup-root.md](./changelog/000-release-cleanup/changelog-000-release-cleanup-root.md) |
| `005-verification-and-remediation` |  | (none) |
| `004-shared-infrastructure` |  | (none) |
| `003-advisor-and-codegraph` |  | (none) |
| `002-memory-store-and-search` |  | (none) |
| `001-research-and-doctrine` |  | (none) |
| `000-release-cleanup/000-spec-tree-consolidation` | impl | (none) |
| `005-verification-and-remediation/004-residual-design-units` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/008-router-consistency-hardening` | impl | (none) |
| `005-verification-and-remediation/003-deep-research-remediation` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research` | impl | (none) |
| `005-verification-and-remediation/002-tri-system-deep-research` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/008-doc-truth-and-test-fidelity` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/007-continuity-and-save-concurrency` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/006-launchers-and-cli` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/005-bm25-indexing-fidelity` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/004-vector-and-checkpoint-durability` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/003-search-and-triggers` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/002-causal-and-memo` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation/001-write-safety-and-guards` | impl | (none) |
| `005-verification-and-remediation/001-finding-remediation` |  | (none) |
| `004-shared-infrastructure/007-ipc-client-cap-hardening` | impl | (none) |
| `004-shared-infrastructure/006-code-mode-orphan-lifecycle` | impl | (none) |
| `002-memory-store-and-search/014-idempotency-flag-on-correctness` | impl | (none) |
| `002-memory-store-and-search/013-provenance-injection` | impl | (none) |
| `004-shared-infrastructure/005-autonomous-dependency-patching` | impl | (none) |
| `002-memory-store-and-search/012-hybrid-search-scope-then-limit` | impl | (none) |
| `002-memory-store-and-search/011-vector-resilience-durability` | impl | (none) |
| `003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` | impl | (none) |
| `002-memory-store-and-search/010-bm25-warmup-churn-reduction` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands` | impl | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion` | impl | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge` | impl | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs` | impl | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors` | impl | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux` |  | (none) |
| `004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability` | impl | (none) |
| `003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph` |  | (none) |
| `004-shared-infrastructure/003-storage-adapter-ports` | impl | (none) |
| `002-memory-store-and-search/009-packed-bm25-field-weights` | impl | (none) |
| `002-memory-store-and-search/008-vector-read-path-resilience` | impl | (none) |
| `003-advisor-and-codegraph/001-causal-traversal-bfs` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/003-router-rewire` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands` |  | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/004-verify-and-ux` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/003-router-rewire` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/002-author-presentation-md` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/001-inventory-extract` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands` |  | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/004-verify-and-ux` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/003-router-rewire` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/001-inventory-extract` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands` |  | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/004-verify-and-ux` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/002-author-presentation-md` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract` | impl | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands` |  | (none) |
| `004-shared-infrastructure/002-command-presentation-workflow-separation` |  | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/004-release-and-program-cleanup` | impl | (none) |
| `002-memory-store-and-search/007-openltm-continuity-resilience` | impl | (none) |
| `002-memory-store-and-search/006-openltm-retrieval-observability` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli` |  | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli` |  | (none) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval` | impl | (none) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler` | impl | (none) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher` | impl | (none) |
| `002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline` | impl | (none) |
| `001-research-and-doctrine/002-gem-team-adoption/003-planner-review-focus-and-drift-hint` | impl | (none) |
| `001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates` | impl | (none) |
| `001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter` | impl | (none) |
| `001-research-and-doctrine/002-gem-team-adoption` |  | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership` | impl | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion` | impl | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe` | impl | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate` | impl | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit` | impl | (none) |
| `002-memory-store-and-search/005-memclaw-derived-memory-hardening` |  | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research` | impl | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli` |  | (none) |
| `004-shared-infrastructure/001-mcp-to-cli-tool-transition` |  | (none) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle` |  | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates` | impl | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption` |  | (none) |
| `001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit` | impl | (none) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation` | impl | (none) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter` | impl | (none) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones` | impl | (none) |
| `002-memory-store-and-search/002-memory-index-causal-lifecycle/001-incremental-index-foundation` | impl | (none) |
| `002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration` | impl | (none) |
| `002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer` | impl | (none) |
| `002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer` | impl | (none) |
| `002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator` | impl | (none) |
| `002-memory-store-and-search/001-memory-write-safety` | impl | (none) |
| `002-memory-store-and-search/004-learning-feedback-reducers` |  | (none) |
| `002-memory-store-and-search/003-semantic-trigger-fallback` |  | (none) |
| `005-verification-and-remediation/001-finding-remediation/sandbox-test` |  | (none) |

