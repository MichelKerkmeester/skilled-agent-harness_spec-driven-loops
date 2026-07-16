---
title: "Memory Store, Search and Save Write-Path Remediation"
description: "Remediation of the 34 fresh-regression findings in the mk-spec-memory write path, search and save: 28 fixed including four Round-2-confirmed data-integrity bugs, 2 refuted, 2 deferred to the consolidation packet, 2 partial."
trigger_phrases:
  - "005/005/001 memory write-path remediation changelog"
  - "fresh regression memory store fixes"
  - "save mutex liveness causal generation bump"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/001-memory-storage-and-search` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase remediated the 34 memory store, search and save findings from the fresh-regression deep-review. Outcome: 28 fixed, 2 refuted, 2 deferred to the dedicated consolidation packet (007) and 2 partial. Every cited file and line was re-opened and confirmed real before editing, fixes mirror the named correct sibling pattern, and the four highest-value bugs were mutation-checked RED then GREEN.

### Added

- Two new regression suites: `spec-folder-mutex-liveness.vitest.ts` and `history-migration-atomicity.vitest.ts`.
- Extended coverage in `memory-delete-cascade`, `pe-gating-provenance`, `canonical-fingerprint`, `statediff`, `bm25-packed-inmemory`, `generate-context-save-lock` and `memory-idempotency-and-near-duplicate`.

### Changed

- Twenty-four P2 robustness and maintainability fixes across the write path: causal-table-scoped catch regex, frontmatter-promoter generation bump, save-lock reap tests, Hebbian counters gated on a successful edge update, checkpoint v2 restore correctness (null-embedder refuse, true restored count, catalog reconcile), access-tracker retain-on-flush-failure, canonical-fingerprint non-JSON contract, incremental-index memo-miss on fingerprint failure, vector-store clear purging the dim shard, advisor lexical denominator and trusted-edge handling, bm25 numericId free-list, idempotency prune on indexed created_at, and graph-search LIKE using the shared escaper.

### Fixed

- Stale causal-boost search results after a memory delete: `vector-index-mutations.ts` now bumps the causal-edges generation before invalidating caches (Round-2 confirmed).
- Live save owner wrongly reaped: `spec-folder-mutex.ts` gained a pid-liveness reap (reap dead or unknown-and-stale owners, never an alive one) plus a heartbeat (Round-2 confirmed).
- Audit log stranded by a mid-rebuild crash: the legacy `memory_history` rebuild in `history.ts` now runs inside a transaction so it rolls back cleanly (Round-2 confirmed).
- Human rows relabelled to agent on version append: `pe-gating.ts` and `save/create-record.ts` now carry the retired predecessor's manual source_kind and tier onto the successor (Round-2 confirmed).

### Verification

| Check | Result |
|-------|--------|
| Touched-area vitest | 288 pass / 0 fail across 23 files |
| Typecheck (mcp_server, scripts, skill-advisor) | PASS (tsc --noEmit exit 0) |
| Mutation RED then GREEN | Confirmed for the four priority bugs (generation bump, human carry, within-window refuse, created_at prune) |
| Comment hygiene | PASS (0 violations on 24 modified files) |
| Spec validation | `validate.sh --strict` PASSED (0 errors, 0 warnings) |
| Pre-existing out-of-scope failures | Unchanged: reconsolidation 9 fail (untouched executeMerge) and causal-edges 1 fail (stale skippedManual assertion) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/storage/vector-index-mutations.ts` | Modified | Bump causal generation before cache invalidation on delete sweep |
| `mcp_server/lib/continuity/spec-folder-mutex.ts` | Modified | Pid-liveness reap plus heartbeat for the save mutex |
| `mcp_server/lib/storage/history.ts` | Modified | Wrap legacy history rebuild in a transaction |
| `mcp_server/lib/save/pe-gating.ts` + `save/create-record.ts` | Modified | Carry manual source_kind and tier onto the version successor |
| Twenty further write-path and search sources | Modified | P2 robustness and maintainability fixes (see What Was Built in the source impl-summary) |
| Two new test files plus eight extended suites | Created/Modified | Regression coverage for the fixes |

### Follow-Ups

- T013 and T014 (consolidation lock-ordering and handle consistency) were deferred to the dedicated consolidation packet (sub-phase 007) because they touch a default-ON path and warranted their own concurrency gate.
- T031: the retention-reducer helper is documented as staged. Wiring it into the sweep and correcting the sibling impl-summary claim was handled in the edge-tier honesty fix.
- T004 and T032 were refuted with reason and intentionally not changed (re-stamping a system-merged row would mislabel it, and `codeHash()` is a correct used utility).
