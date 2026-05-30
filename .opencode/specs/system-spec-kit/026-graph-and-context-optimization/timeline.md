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
    last_updated_at: "2026-05-30T06:10:46Z"
    recent_action: "Regenerated chronological timeline from git history"
    next_safe_action: "Use this file to find the most recent / oldest spec folder"
    completion_pct: 100
---
# 026 Chronological Timeline

<!-- GENERATED FILE — do not hand-edit. Regenerate: `python3 scratch/gen-timeline.py > timeline.md` (run from the 026 root). -->

> **Generated:** 2026-05-30T06:10:46Z — regenerate before relying on intra-day ordering; same-day commits made
> after this stamp are not reflected until the next run.
> **Sort key:** git last-commit timestamp touching each folder subtree, **newest → oldest** (the
> recency view). The last-active column shows `YYYY-MM-DD HH:MM` (UTC-offset local) because most
> folders share one commit day — the time is what orders them. The `born` column is the folder's
> recorded `created_at` (or first git commit of its `spec.md`), shown at day granularity.
>
> **Folder numbers are NOT chronology.** Numbers (`000`–`007`, child `NNN-`) encode topical/structural
> identity assigned across reorg waves. This file is the *only* surface that orders by when work happened.
> Phase identity → home mapping lives in [`context-index.md`](./context-index.md); the live track map lives
> in [`spec.md`](./spec.md).
>
> **Most recent live spec folder:** `007-mcp-daemon-reliability/013-standalone-save-second-writer-guard`
> **Oldest live spec folder:** `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs`
> **Counts:** 604 live spec folders · 34 archived (`z_archive/`).

---

## 0. Most recent 15 (quick answer to "what was worked on last")

```
 1. 2026-05-29 22:47  007-mcp-daemon-reliability/013-standalone-save-second-writer-guard
 2. 2026-05-29 22:47  007-mcp-daemon-reliability/012-boot-integrity-retention-probe
 3. 2026-05-29 22:47  007-mcp-daemon-reliability/010-at-rest-wal-durability
 4. 2026-05-29 22:47  007-mcp-daemon-reliability/009-shutdown-durability
 5. 2026-05-29 22:47  007-mcp-daemon-reliability
 6. 2026-05-29 22:35  006-operator-tooling
 7. 2026-05-29 22:35  005-graph-impact-and-affordance
 8. 2026-05-29 22:35  003-memory-and-causal-runtime
 9. 2026-05-29 22:35  002-spec-kit-internals
10. 2026-05-29 22:35  000-release-and-program-cleanup
11. 2026-05-29 22:35  004-code-graph
12. 2026-05-29 22:35  001-research-and-baseline
13. 2026-05-29 18:21  004-code-graph/013-owner-lease-election-race
14. 2026-05-29 18:21  004-code-graph/011-source-bug-and-misalignment-audit
15. 2026-05-29 15:36  007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph
```

---

## A. Tracks — newest activity → oldest

The eight top-level themed tracks, ordered by most recent git activity. `Born` uses `--follow` so it
traces through the reorg `git mv` history to each track's true origin.

| Rank | Last active | Born | Track |
|------|------------------|------------|-------|
| 1 | 2026-05-29 22:47 | 2026-05-28 | `007-mcp-daemon-reliability/` |
| 2 | 2026-05-29 22:35 | 2026-05-26 | `006-operator-tooling/` |
| 3 | 2026-05-29 22:35 | 2026-05-26 | `005-graph-impact-and-affordance/` |
| 4 | 2026-05-29 22:35 | 2026-05-26 | `003-memory-and-causal-runtime/` |
| 5 | 2026-05-29 22:35 | 2026-05-26 | `002-spec-kit-internals/` |
| 6 | 2026-05-29 22:35 | 2026-04-27 | `000-release-and-program-cleanup/` |
| 7 | 2026-05-29 22:35 | 2026-04-21 | `004-code-graph/` |
| 8 | 2026-05-29 22:35 | 2026-04-07 | `001-research-and-baseline/` |

> Note: `000-release-and-program-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint).

```
2026-05-29 22:47  born:2026-05-29  impl  007-mcp-daemon-reliability/013-standalone-save-second-writer-guard
2026-05-29 22:47  born:2026-05-29  impl  007-mcp-daemon-reliability/012-boot-integrity-retention-probe
2026-05-29 22:47  born:2026-05-29  impl  007-mcp-daemon-reliability/010-at-rest-wal-durability
2026-05-29 22:47  born:2026-05-29  impl  007-mcp-daemon-reliability/009-shutdown-durability
2026-05-29 22:47  born:2026-05-28        007-mcp-daemon-reliability
2026-05-29 22:35  born:2026-05-26        006-operator-tooling
2026-05-29 22:35  born:2026-05-26        005-graph-impact-and-affordance
2026-05-29 22:35  born:2026-05-26        003-memory-and-causal-runtime
2026-05-29 22:35  born:2026-05-26        002-spec-kit-internals
2026-05-29 22:35  born:2026-04-27        000-release-and-program-cleanup
2026-05-29 22:35  born:2026-04-21        004-code-graph
2026-05-29 22:35  born:2026-04-12        001-research-and-baseline
2026-05-29 18:21  born:2026-05-29  impl  004-code-graph/013-owner-lease-election-race
2026-05-29 18:21  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit
2026-05-29 15:36  born:2026-05-29  impl  007-mcp-daemon-reliability/011-deep-review-shutdown-and-codegraph
2026-05-29 14:06  born:2026-05-29  impl  007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close
2026-05-29 13:54  born:2026-05-29  impl  004-code-graph/012-empty-graph-first-time-auto-scan
2026-05-29 12:50  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local
2026-05-29 12:50  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings
2026-05-29 12:50  born:2026-05-29  impl  004-code-graph/011-source-bug-and-misalignment-audit/001-applied-source-and-doc-fixes
2026-05-28 23:37  born:2026-05-28  impl  007-mcp-daemon-reliability/007-bridge-liveness-reap
2026-05-28 23:01  born:2026-05-28  impl  007-mcp-daemon-reliability/006-graceful-exit-watchdog
2026-05-28 22:24  born:2026-05-28  impl  007-mcp-daemon-reliability/005-provider-dispose
2026-05-28 20:52  born:2026-05-28  impl  007-mcp-daemon-reliability/004-nondestructive-build
2026-05-28 20:52  born:2026-05-28  impl  007-mcp-daemon-reliability/003-daemon-reliability-research
2026-05-28 20:52  born:2026-05-28  impl  007-mcp-daemon-reliability/002-code-graph-initial-scan
2026-05-28 20:52  born:2026-05-28  impl  007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize
2026-05-28 18:34  born:2026-05-26  impl  003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation
2026-05-28 11:14  born:2026-05-27  impl  003-memory-and-causal-runtime/009-embedder-auto-resolution-fix
2026-05-28 11:14  born:2026-05-27  impl  003-memory-and-causal-runtime/008-embedder-provider-auto-resolution
2026-05-28 11:14  born:2026-05-27        002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation
2026-05-28 11:14  born:2026-05-27  impl  003-memory-and-causal-runtime/007-success-vector-coverage-hygiene
2026-05-28 11:14  born:2026-05-27  impl  003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool
2026-05-28 11:14  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag
2026-05-28 11:14  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022
2026-05-28 11:14  born:2026-05-27  impl  003-memory-and-causal-runtime/005-embedding-status-integrity
2026-05-28 11:14  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery
2026-05-28 11:14  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/005-db-binding-cleanup
2026-05-28 11:14  born:2026-05-27  impl  004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes
2026-05-28 11:14  born:2026-05-27  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning
2026-05-28 11:14  born:2026-05-27  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/006-playbook-vitest-path-fix
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/005-opencode-bridge-native-route
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/003-pc005-bench-doc-and-gates
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/004-shell-python-daemon
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/002-mcp-native-scenarios
2026-05-28 11:14  born:2026-05-26  impl  002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build
2026-05-28 11:14  born:2026-05-26        002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation
2026-05-28 11:14  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/003-release-readiness-synthesis
2026-05-28 11:14  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios
2026-05-28 11:14  born:2026-05-26  impl  004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios
2026-05-28 11:14  born:2026-05-26        004-code-graph/010-playbook-validation-and-hardening
2026-05-28 11:14  born:2026-05-26        004-code-graph/007-docs-and-readmes
2026-05-28 11:14  born:2026-05-26        004-code-graph/006-extraction-and-isolation
2026-05-28 11:14  born:2026-05-26        004-code-graph/005-resilience-and-advisor
2026-05-28 11:14  born:2026-05-26        004-code-graph/004-runtime-and-scan
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode
2026-05-28 11:14  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2
2026-05-28 11:14  born:2026-05-26  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability
2026-05-28 11:14  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper
2026-05-28 11:14  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design
2026-05-28 11:14  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode
2026-05-28 11:14  born:2026-05-26        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes
2026-05-28 11:14  born:2026-05-26  impl  004-code-graph/003-code-graph-workspace-root-fix
2026-05-28 11:14  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/004-deferred-followups-and-cleanup
2026-05-28 11:14  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment
2026-05-28 11:14  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/002-operator-surface-realignment
2026-05-28 11:14  born:2026-05-26  impl  006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor
2026-05-28 11:14  born:2026-05-26        006-operator-tooling/003-install-scripts-doctor-realignment
2026-05-28 11:14  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr
2026-05-28 11:14  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/016-remediate-residue-tail
2026-05-28 11:14  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/015-remediate-cross-surface-residue
2026-05-28 11:14  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/014-remediate-codegraph-naming
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/008-runtime-artifacts-cleanup
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/007-docs-readme-search-routing
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/006-runtime-configs-4runtime-mirror
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/005-remove-coco-index-skill
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/004-remove-rerank-sidecar-skill
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/003-remove-memory-rerank-path
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/002-decouple-code-graph
2026-05-28 11:14  born:2026-05-25  impl  004-code-graph/002-deprecate-coco-index/001-touchpoint-research
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/013-post-deprecation-deep-review
2026-05-28 11:14  born:2026-05-25        004-code-graph/002-deprecate-coco-index/010-remove-memory-coco-integration
2026-05-28 11:14  born:2026-05-24  impl  004-code-graph/007-docs-and-readmes/006-reference-template-alignment
2026-05-28 11:14  born:2026-05-24  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/007-reference-template-alignment
2026-05-28 11:14  born:2026-05-24  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/007-code-graph-p1-config-extraction
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix
2026-05-28 11:14  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit
2026-05-28 11:14  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder
2026-05-28 11:14  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair
2026-05-28 11:14  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/021-hardcoded-default-audit-deep-research
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation
2026-05-28 11:14  born:2026-05-23  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack
2026-05-28 11:14  born:2026-05-23        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map
2026-05-28 11:14  born:2026-05-22        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation
2026-05-28 11:14  born:2026-05-22  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization
2026-05-28 11:14  born:2026-05-21  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory
2026-05-28 11:14  born:2026-05-20  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment
2026-05-28 11:14  born:2026-05-20  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/008-vec0-migration-fix-deferred
2026-05-28 11:14  born:2026-05-20        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/019-lineage-and-metadata-repair-runner
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing
2026-05-28 11:14  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction
2026-05-28 11:14  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/017-fix-deep-review-p1-findings-for-package-extraction
2026-05-28 11:14  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/016-fix-deep-review-p2-findings-for-package-extraction
2026-05-28 11:14  born:2026-05-19  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/013-remove-spec-kit-references
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit
2026-05-28 11:14  born:2026-05-19  impl  002-spec-kit-internals/004-literal-spec-folder-names
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability
2026-05-28 11:14  born:2026-05-19  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal
2026-05-28 11:14  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/014-manual-testing-playbook-validation
2026-05-28 11:14  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment
2026-05-28 11:14  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction
2026-05-28 11:14  born:2026-05-18  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap
2026-05-28 11:14  born:2026-05-18  impl  004-code-graph/006-extraction-and-isolation/004-three-way-isolation-finalize
2026-05-28 11:14  born:2026-05-18  impl  004-code-graph/008-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/005-stress-test/005-stress-test-expansion-alignment
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/022-cli-skills-baseline-overlay-contract
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/021-sk-doc-conformance-template-sweep
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/020-cocoindex-feature-catalog
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/019-feature-catalog-shape-realignment
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/018-matrix-runner-snake-case-rename
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/002-audit/007-runtime-command-agent-alignment-audit
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/005-fix-remaining-priority-findings
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/004-fix-release-readiness-findings-synthesis
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/010-upgrade-safety-operability-audit
2026-05-28 11:14  born:2026-05-18  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/009-documentation-truth-audit
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality
2026-05-28 11:14  born:2026-05-18        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/004-launcher-diagnostics-and-signal-coverage
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/008-chunking-strategy-tuning
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration
2026-05-28 11:14  born:2026-05-18  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/002-tool-coverage-audit
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/001-fairness-audit
2026-05-28 11:14  born:2026-05-17        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema
2026-05-28 11:14  born:2026-05-17  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface
2026-05-28 11:14  born:2026-05-17        003-memory-and-causal-runtime/003-embedder-testing-and-architecture
2026-05-28 11:14  born:2026-05-16  impl  004-code-graph/007-docs-and-readmes/005-cross-skill-doc-polish
2026-05-28 11:14  born:2026-05-16  impl  000-release-and-program-cleanup/005-stress-test/008-spec-memory-mcp-stress-test
2026-05-28 11:14  born:2026-05-16  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/011-z-archive-memory-indexing
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/006-skill-readme-refinement-survey
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling
2026-05-28 11:14  born:2026-05-16  impl  004-code-graph/009-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite
2026-05-28 11:14  born:2026-05-16  impl  004-code-graph/009-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish
2026-05-28 11:14  born:2026-05-16  impl  004-code-graph/001-mcp-shared-dependency-startup-fix
2026-05-28 11:14  born:2026-05-16        004-code-graph/009-system-code-graph-uplift-phase-parent
2026-05-28 11:14  born:2026-05-16  impl  004-code-graph/007-docs-and-readmes/004-doc-drift-alignment
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/001-skill-graph
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/006-research
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/005-stress-test
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/004-followup-post-program
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/003-cross-cutting-cleanup-pass
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/002-audit
2026-05-28 11:14  born:2026-05-16        000-release-and-program-cleanup/001-release-readiness
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/008-tier-d-documentation-execution
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/007-finalize-documentation-quality-refactor
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/005-content-additions-hvr-polish
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/004-sk-doc-type-validation-alignment
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/002-fix-documentation-bugs
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/001-documentation-quality-audit-research
2026-05-28 11:14  born:2026-05-16        002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor
2026-05-28 11:14  born:2026-05-16  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift
2026-05-28 11:14  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/055-cli-devin-deep-loop-alignment
2026-05-28 11:14  born:2026-05-15  impl  000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/007-cross-skill-enhancement-edge-propagation
2026-05-28 11:14  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/004-devin-advisor-hook-integration
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/030-any-type-justification-sweep
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/029-python-package-header-policy
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/028-generated-js-declaration-alignment
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/027-typescript-header-normalization
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/002-code-folder-readme-coverage
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/025-parent-documentation-drift-refresh
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/024-dfidf-cold-start-cache
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/022-plugin-bridge-unit-test-isolation
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface
2026-05-28 11:14  born:2026-05-15  impl  004-code-graph/007-docs-and-readmes/003-code-folder-readmes-poc
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling
2026-05-28 11:14  born:2026-05-15  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling
2026-05-28 11:14  born:2026-05-15  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/053-mk-spec-memory-rename-remediation
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep
2026-05-28 11:14  born:2026-05-14  impl  004-code-graph/007-docs-and-readmes/002-system-code-graph-readmes-update
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple
2026-05-28 11:14  born:2026-05-14        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover
2026-05-28 11:14  born:2026-05-14  impl  004-code-graph/006-extraction-and-isolation/003-standalone-mcp-topology-pivot
2026-05-28 11:14  born:2026-05-14  impl  004-code-graph/006-extraction-and-isolation/002-extraction-design-and-decision-record
2026-05-28 11:14  born:2026-05-14        004-code-graph/006-extraction-and-isolation/001-system-code-graph-extraction
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr
2026-05-28 11:14  born:2026-05-14        002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/005-intent-signals-and-skill-relationships
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/003-skill-metadata-embedding-quality-audit
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry
2026-05-28 11:14  born:2026-05-14  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/006-seeded-corpus-evaluation-sweep
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/009-fix-script-filesystem-scope
2026-05-28 11:14  born:2026-05-14  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration
2026-05-28 11:14  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/005-routing-weight-sweep-harness
2026-05-28 11:14  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion
2026-05-28 11:14  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring
2026-05-28 11:14  born:2026-05-13  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/002-semantic-routing-lane
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-post-027-findings-remediation
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/023-post-remediation-re-review
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/018-llama-cpp-auto-migration
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/014-onnx-cross-platform-backend
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification
2026-05-28 11:14  born:2026-05-13  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/008-finalize-and-commit
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/005-q4-quantization
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat
2026-05-28 11:14  born:2026-05-12  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture
2026-05-28 11:14  born:2026-05-12        003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation
2026-05-28 11:14  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files
2026-05-28 11:14  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/003-consolidate-doctor-router-implementations
2026-05-28 11:14  born:2026-05-11        003-memory-and-causal-runtime/002-causal-graph-channel-routing
2026-05-28 11:14  born:2026-05-11  impl  006-operator-tooling/002-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator
2026-05-28 11:14  born:2026-05-11  impl  002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts
2026-05-28 11:14  born:2026-05-10  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate
2026-05-28 11:14  born:2026-05-10        006-operator-tooling/002-doctor-update-orchestrator
2026-05-28 11:14  born:2026-05-09  impl  004-code-graph/005-resilience-and-advisor/004-iteration-quality-meta-research
2026-05-28 11:14  born:2026-05-09  impl  004-code-graph/004-runtime-and-scan/005-broader-excludes-and-granular-skills
2026-05-28 11:14  born:2026-05-09  impl  006-operator-tooling/002-doctor-update-orchestrator/001-implement-initial-doctor-command-set
2026-05-28 11:14  born:2026-05-09  impl  000-release-and-program-cleanup/004-followup-post-program/002-vitest-baseline-recovery-followup
2026-05-28 11:14  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery
2026-05-28 11:14  born:2026-05-08  impl  004-code-graph/005-resilience-and-advisor/005-doctor-apply-mode-implementation
2026-05-28 11:14  born:2026-05-08  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability
2026-05-28 11:14  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep
2026-05-28 11:14  born:2026-05-08  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal
2026-05-28 11:14  born:2026-05-08  impl  000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes
2026-05-28 11:14  born:2026-05-07  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in
2026-05-28 11:14  born:2026-05-07  impl  003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/005-scope-change-scan-guard
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/004-fix-zero-node-and-parser-issues
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/003-code-graph-bug-surface-research
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/002-native-deferred-trial-rerun
2026-05-28 11:14  born:2026-05-06  impl  004-code-graph/008-real-world-usefulness-test-planning/001-sandbox-usefulness-trials
2026-05-28 11:14  born:2026-05-05  impl  004-code-graph/008-real-world-usefulness-test-planning
2026-05-28 11:14  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/027-missing-code-readme-resource-map
2026-05-28 11:14  born:2026-05-02  impl  004-code-graph/004-runtime-and-scan/004-end-user-scope-default-and-opt-in
2026-05-28 11:14  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/026-readme-code-template-governance
2026-05-28 11:14  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/008-archive-fleet-marker-validation-scaffold
2026-05-28 11:14  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/007-sweep-fleet-marker-validation
2026-05-28 11:14  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/006-command-markdown-yaml-workflow-alignment
2026-05-28 11:14  born:2026-05-02  impl  002-spec-kit-internals/003-template-levels/005-skill-reference-asset-doc-alignment
2026-05-28 11:14  born:2026-05-02  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/025-readme-architecture-diagrams-topology
2026-05-28 11:14  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/004-fix-template-deferred-followups
2026-05-28 11:14  born:2026-05-01        002-spec-kit-internals/003-template-levels
2026-05-28 11:14  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan
2026-05-28 11:14  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/002-manifest-driven-template-design
2026-05-28 11:14  born:2026-05-01  impl  002-spec-kit-internals/003-template-levels/001-template-level-consolidation-research
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/010-fix-cli-orchestrator-doc-drift
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/009-fix-test-reliability
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/008-fix-search-quality-tuning
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/007-fix-topology-build-boundary
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/006-fix-architecture-cleanup-followups
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/005-resource-leaks-silent-errors
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/003-fix-skill-advisor-quality
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/002-fix-deep-loop-workflow-state
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/001-fix-code-graph-consistency
2026-05-28 11:14  born:2026-05-01        000-release-and-program-cleanup/006-research/004-fix-deep-research-findings
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/024-daemon-concurrency-fixes
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/023-fix-baseline-test-failures
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/006-research/003-system-bug-improvement-research
2026-05-28 11:14  born:2026-05-01  impl  000-release-and-program-cleanup/002-audit/008-fix-audit-drift-findings
2026-05-28 11:14  born:2026-04-30  impl  000-release-and-program-cleanup/001-release-readiness/006-fix-stress-test-coverage-gap
2026-05-28 11:14  born:2026-04-30  impl  000-release-and-program-cleanup/005-stress-test/007-fix-stress-test-coverage-gap-followup
2026-05-28 11:14  born:2026-04-30  impl  000-release-and-program-cleanup/005-stress-test/006-stress-coverage-audit-and-run
2026-05-28 11:14  born:2026-04-29        000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/017-hook-test-sandbox-fix
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/006-mcp-tool-schema-governance-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/007-deep-loop-workflow-integrity-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/005-cross-runtime-hook-parity-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/001-workflow-correctness-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/013-evergreen-doc-packet-id-removal
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/004-code-graph-readiness-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/008-validator-spec-document-integrity-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/015-root-readme-refresh
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/004-stress-test-folder-completion
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/014-resource-map-memory-finalization
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/012-code-graph-catalog-and-playbook
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/011-cli-matrix-adapter-runners
2026-05-28 11:14  born:2026-04-29        000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/006-readme-cascade-refresh
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/005-stress-test-folder-migration
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/004-sk-doc-template-alignment
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/003-testing-playbook-trio-alignment
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/002-feature-catalog-trio-alignment
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/001-sk-code-opencode-standards-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/006-runtime-matrix-execution-validation
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/006-research/002-automation-reality-supplemental-research
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/010-half-auto-upgrade-doc-alignment
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/005-memory-retention-policy-sweep
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/004-code-graph-watcher-claim-retraction
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/003-documentation-truth-validation
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/006-research/001-automation-self-management-research
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/029-clean-infrastructure-stress-test
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/007-vitest-broad-suite-honesty
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/006-stale-documentation-readme-fixes
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/028-deep-review-research-skill-contract-fixes
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/027-memory-context-structural-channel-research
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/026-remove-readiness-scaffolding
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/025-memory-search-degraded-readiness-wiring
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/024-harness-telemetry-export-mode
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/023-live-handler-envelope-capture-interface
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/005-vestigial-embedding-readiness-gate-removal
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/022-stress-test-results-deep-research
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/002-stress-test-pattern-documentation
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/020-enterprise-readiness-verification-expansion-research
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/002-audit/002-runtime-wiring-enterprise-readiness-audit
2026-05-28 11:14  born:2026-04-29  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/004-search-rag-measurement-implementation
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/002-search-query-rag-optimization
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/019-search-query-rag-optimization-research
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/004-followup-post-program/001-post-program-doc-and-state-cleanup
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/001-release-readiness/002-fix-additional-release-readiness-findings
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/005-stress-test/001-fix-mcp-stress-cycle-doc-observability
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/001-fix-memory-indexer-storage-boundary
2026-05-28 11:14  born:2026-04-28  impl  000-release-and-program-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/018-feature-catalog-playbook-degraded-alignment
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/016-degraded-readiness-envelope-parity
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/012-copilot-target-authority-gate-helper
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/013-code-graph-degraded-stress-cell
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/015-cocoindex-seed-telemetry-passthrough
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/014-code-graph-status-readiness-snapshot
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/011-research-post-stress-finding-followups
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/017-cli-copilot-dispatch-test-parity
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/010-stress-test-close-loop-measurement-rerun
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/003-phase-parent-reference-readme-sync
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/002-phase-parent-generator-pointer-polish
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/001-phase-parent-validator-docs
2026-05-28 11:14  born:2026-04-27        000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/007-intent-classifier-stability-telemetry
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/006-causal-graph-relation-window-metrics
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/009-memory-search-citation-response-policy
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/005-code-graph-fail-fast-routing
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/004-cocoindex-overfetch-dedup-rerank
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/003-memory-context-truncation-telemetry-contract
2026-05-28 11:14  born:2026-04-27  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/002-mcp-runtime-improvement-research
2026-05-28 11:14  born:2026-04-27        000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings
2026-05-28 11:14  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-execution
2026-05-28 11:14  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-search-scenario-design
2026-05-28 11:14  born:2026-04-26  impl  000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook
2026-05-28 11:14  born:2026-04-26  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/005-memory-search-runtime-bugs
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/006-deep-research-review
2026-05-28 11:14  born:2026-04-25  impl  004-code-graph/005-resilience-and-advisor/003-code-graph-backend-resilience-implementation
2026-05-28 11:14  born:2026-04-25  impl  004-code-graph/007-docs-and-readmes/001-doctor-diagnostic-command-phase-a
2026-05-28 11:14  born:2026-04-25  impl  004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research
2026-05-28 11:14  born:2026-04-25  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/005-advisor-setup-command
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/005-deep-review-findings
2026-05-28 11:14  born:2026-04-25  impl  000-release-and-program-cleanup/008-docs-and-catalogs-rollup
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/004-memory-causal-trust-display
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/002-edge-explanation-impact-uplift
2026-05-28 11:14  born:2026-04-25  impl  005-graph-impact-and-affordance/001-code-graph-phase-runner
2026-05-28 11:14  born:2026-04-25  impl  000-release-and-program-cleanup/007-clean-room-license-audit
2026-05-28 11:14  born:2026-04-24  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/010-memory-indexer-invariants
2026-05-28 11:14  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders
2026-05-28 11:14  born:2026-04-24  impl  004-code-graph/004-runtime-and-scan/003-resolver-and-hook-improvements
2026-05-28 11:14  born:2026-04-24  impl  002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/001-advisor-hook-brief-improvements
2026-05-28 11:14  born:2026-04-24  impl  004-code-graph/005-resilience-and-advisor/001-code-graph-advisor-refinement
2026-05-28 11:14  born:2026-04-24        002-spec-kit-internals/001-resource-map-deep-loop-fix
2026-05-28 11:14  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration
2026-05-28 11:14  born:2026-04-24  impl  002-spec-kit-internals/001-resource-map-deep-loop-fix/002-resource-map-template-creation
2026-05-28 11:14  born:2026-04-23  impl  004-code-graph/004-runtime-and-scan/002-fix-stale-highlights-and-scan-scope
2026-05-28 11:14  born:2026-04-23  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/003-advisor-standards-alignment
2026-05-28 11:14  born:2026-04-23  impl  006-operator-tooling/001-hook-parity/004-fix-claude-freshness-schema-harness
2026-05-28 11:14  born:2026-04-23  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/002-advisor-plugin-hardening
2026-05-28 11:14  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge
2026-05-28 11:14  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/003-codex-native-startup-advisor-hooks
2026-05-28 11:14  born:2026-04-22  impl  006-operator-tooling/001-hook-parity/002-copilot-custom-instructions-hook-parity
2026-05-28 11:14  born:2026-04-21        006-operator-tooling/001-hook-parity
2026-05-28 11:14  born:2026-04-21        003-memory-and-causal-runtime/001-continuity-memory-runtime
2026-05-28 11:14  born:2026-04-21        002-spec-kit-internals/002-skill-advisor
2026-05-28 11:14  born:2026-04-21  impl  006-operator-tooling/001-hook-parity/001-fix-runtime-hook-parity-findings
2026-05-28 11:14  born:2026-04-21  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/002-skill-graph-daemon-native-advisor-tools
2026-05-28 11:14  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/001-documentation-code-alignment
2026-05-28 11:14  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/001-deferred-remediation-telemetry-run
2026-05-28 11:14  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/004-advisor-hook-surface-integration
2026-05-28 11:14  born:2026-04-19  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/003-smart-remediation-opencode-plugin
2026-05-28 11:14  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/009-system-hardening
2026-05-28 11:14  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/007-foundational-runtime
2026-05-28 11:14  born:2026-04-18  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/008-sk-deep-cli-runtime-execution
2026-05-28 11:14  born:2026-04-15  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning
2026-05-28 11:14  born:2026-04-15  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/004-memory-save-rewrite
2026-05-28 11:14  born:2026-04-13  impl  002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/001-memory-search-routing-tuning
2026-05-28 11:14  born:2026-04-13  impl  002-spec-kit-internals/002-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts
2026-05-28 11:14  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/003-continuity-refactor-gates
2026-05-28 11:14  born:2026-04-12  impl  004-code-graph/004-runtime-and-scan/001-code-graph-runtime-upgrades
2026-05-28 11:14  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/002-fix-memory-quality
2026-05-28 11:14  born:2026-04-12  impl  003-memory-and-causal-runtime/001-continuity-memory-runtime/001-cache-warning-hooks
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/006-research-memory-redundancy
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/005-claudest
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/004-graphify
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/003-contextador
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/002-codesight
2026-05-28 11:14  born:2026-04-12  impl  001-research-and-baseline/001-claude-optimization-settings
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
2026-05-28 11:14  born:2026-05-26  impl  z_archive/wave-3-deep-archives/007-038-system-code-graph-deep-review-remediation
2026-05-28 11:14  born:2026-05-26        z_archive/wave-3-deep-archives/007-037-system-code-graph-comprehensive-deep-review
2026-05-28 11:14  born:2026-05-26        z_archive/wave-4-2026-05-26-reorg/017-phase-reorg-and-renumber
2026-05-28 11:14  born:2026-05-18  impl  z_archive/wave-3-deep-archives/007-030-manual-testing-verification
2026-05-28 11:14  born:2026-05-18  impl  z_archive/wave-3-deep-archives/007-031-deep-review-campaign-010-016
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-3-deep-archives/007-039-system-code-graph-deferred-followon
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-2-merges/014-057-root-readme-deeper-rewrite
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-2-shallow-medium/007-036-cli-devin-code-graph-hook
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-055-root-readme-realignment
2026-05-28 11:14  born:2026-05-15  impl  z_archive/wave-2-merges/014-local-embeddings-migration-054-code-folder-readmes
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-034-mcp-namespace-operational-sweep
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-033-deferred-fix-followup
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-032-deep-review-remediation
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-code-graph-029-public-readme-update
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-025-skill-docs-sk-doc-alignment
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-028-architecture-md
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-026-system-spec-kit-codegraph-residue-audit
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-023-tsconfig-references-restructure
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-shallow-medium/014-041-llama-cpp-metal-investigation
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-3-deep-archives/007-022-orphan-code-graph-db-cleanup
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-020-validation-and-cleanup
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-019-doc-and-runtime-migration
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-017-physical-move-and-database
2026-05-28 11:14  born:2026-05-14  impl  z_archive/wave-2-merges/007-016-scaffold-skill
2026-05-28 11:14  born:2026-05-09  impl  z_archive/wave-2-merges/013-002-sandbox-testing-playbook
2026-05-28 11:14  born:2026-04-25        z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved
2026-05-28 11:14  born:2026-04-23  impl  z_archive/wave-2-merges/009-hook-parity-008-docs-impact-remediation
2026-05-28 11:14  born:2026-04-22  impl  z_archive/wave-2-merges/009-007-copilot-writer-wiring
2026-05-28 11:14  born:2026-04-22  impl  z_archive/wave-2-merges/009-006-copilot-wrapper-schema-fix
2026-05-28 11:14  born:2026-04-21        z_archive/wave-2-merges/004-runtime-executor-hardening
2026-05-28 11:14  born:2026-04-21  impl  z_archive/wave-2-merges/007-002-code-graph-self-contained-package
```

