---
title: "Implementation Summary: Compiled-Route Sync Authored-Root Repair"
description: "Live delivery record for reproducible compiled-route closure promotion with bound rollback, conflict-safe activation reconciliation, and verified seven-hub serving."
trigger_phrases:
  - "compiled route sync repair summary"
  - "promoted closure repair"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T07:59:02Z"
    last_updated_by: "opencode"
    recent_action: "Completed live publication, backup cleanup, metadata reconciliation, and strict validation."
    next_safe_action: "No packet-local work remains."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-arch | v2.2 -->
# Implementation Summary: Compiled-Route Sync Authored-Root Repair

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Reconnected closure tracing to the flattened authored topology and added `cli-cursor` to the CLI rollout inputs.
- Added one coherent runtime-layout selector so resolver, engine, compiler, and activation paths cannot mix generations.
- Implemented verified sibling staging, atomic publication, retained rollback, post-publish restoration, and fail-closed validation of the prior serving closure.
- Bound finalize and revert to one publication through a shared sibling lease, publication identity, expected rollback basename, and fingerprints over every closure path, mode, and file hash.
- Replaced unconditional external-manifest copy-forward with baseline-aware three-way reconciliation: preserve one-sided updates, reject two-sided divergence, and never propagate deletion automatically.
- Serialized canonical manifest writers and publication through one atomic lease.
- Added retryable terminal cleanup receipts, remove-before-unlock ordering, and inode-sensitive status rebinding.
- Added compensating staging and rollback recovery; persistent rename failure retains both verified candidates and the lease.
- Refreshed the authored CLI, design, and documentation selected-policy identities and published the fresh CLI manifest into the stable serving root.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was first exercised against authored inputs and isolated sibling runtime roots. Hostile lifecycle fixtures covered incomplete prior roots, staging and post-publish verification failures, writer/publication interleaving, closure-byte tampering, arbitrary and symlinked rollback paths, stale publication binding, concurrent one-sided and divergent activation updates, interrupted terminal cleanup, immediate nested publication after unlock, long-lived generation rebinding, persistent rename failures, and CLI mode exclusivity.

The first authorized live attempt published successfully, but an incorrectly repeated writer lifecycle suite ran while the retained publication lease was active. The expected writer failures exposed an unsafe fixture cleanup that removed the real lease. The intact publication state and both closure fingerprints were used to reconstruct the lease, and the guarded revert restored the exact prior closure. The fixture was changed to reject a pre-existing publication lease before monkeypatching and to remove only a writer lease owned by its process; the 35-case lifecycle suite and independent review then passed. Publication `62958-1785049921029` subsequently passed the contract's read-only status, parity, kill-switch, scorer, and no-spec gates and finalized with zero external-manifest reconciliations.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the serving root stable while following current authored internal names | External entry points remain stable and future source-tree checks become reproducible. |
| Verify staging before publication | A broken authored closure cannot replace healthy serving code. |
| Retain the prior closure through post-publish checks | Rollback is a directory rename rather than reconstruction. |
| Bind rollback and lock state to one publication | Finalize or revert cannot target an arbitrary, renamed, symlinked, stale, or changed closure. |
| Reconcile against a captured baseline | One-sided external changes survive while divergent changes stop cleanup with both roots retained. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old authored-root failure | PASS: reproduced; target path does not exist |
| Authored closure check | PASS: 55 closure files; all seven hubs resolve |
| Manifest and publication lifecycle | PASS: `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` (35/35) |
| Runtime foundation | PASS: from `.opencode`, `npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` (25/25) |
| Flag propagation | PASS: from `.opencode`, `npx vitest run --config vitest.config.bin.ts bin/compiled-routing-flag-propagation.vitest.ts` (9/9) |
| Broad bin suite | BASELINE-UNCHANGED: 63/65; only the two pre-existing WAL fixture failures return `no-wal` instead of `truncated`/`under-threshold` |
| No-spec-import guard | PASS: 71 runtime files |
| sk-code drift guards | PASS: alignment drift 70 files/0 findings, six stack folders, router sync 10/10 |
| Frozen scorer SHA-256 | PASS: `d5e13d...`, `d5a9cc...`, and `5029f2...` remain exact |
| Independent findings-first review | PASS: final re-review reports no P0, P1, or P2 findings |
| Strict packet validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
| Live publication and post-publish verify | PASS: publication `62958-1785049921029`; 7/7 fresh compiled-serving; 0 spec reads; post-publish suites 34/34; finalized with 0 external manifests reconciled |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broad bin suite retains two unrelated WAL-hygiene fixture failures captured before this work.
2. If all three serving-path renames fail persistently, automated publication cannot restore the stable pathname; verified staging, rollback, terminal state, and the lease are retained for manual recovery.
<!-- /ANCHOR:limitations -->
