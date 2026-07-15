---
title: "Memory Causal Trust Display: display-only trust badges on MemoryResultEnvelope"
description: "Trust badges (confidence, extraction age, last-access age, lineage-orphan flag, weight-history) now attach to each memory search result by reading existing causal-edge columns at format time. No schema change. No new relation types. No Code Graph facts stored in Memory."
trigger_phrases:
  - "memory causal trust display"
  - "trust badges memory search"
  - "MemoryTrustBadges"
  - "causal edge freshness display"
  - "trustBadges result envelope"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/004-memory-causal-trust-display` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Memory search results exposed `confidence` and `trace.graphContribution` but gave callers no unified surface to judge the freshness or lineage trust of a specific memory claim. The existing causal-edge schema already stored `strength`, `extracted_at`, `last_accessed` plus a weight-history table, so all the data existed. The display did not.

The formatter in `mcp_server/formatters/search-results.ts` was extended to derive an additive `MemoryTrustBadges` payload from those existing columns and attach it to each `MemoryResultEnvelope` result at response time. The response-profile layer in `profile-formatters.ts` was updated to preserve that payload through `quick`, `research` plus `resume` profile shaping. The result is a per-claim trust read that operators and callers can inspect without any schema change, no new relation types or Code Graph facts entering Memory storage.

Ship commit: `a25b3bad` (2026-04-25), Wave-3 verification commit: `d4a53288` (2026-04-25, T-B sync).

### Added

- Additive `MemoryTrustBadges` output on `MemoryResultEnvelope` derived from `strength`, `extracted_at`, `last_accessed` plus the `weight_history` columns
- Lineage-orphan detection flag derived from the absence of inbound causal edges
- Fail-open path when the DB handle or history table is unavailable
- Explicit caller-supplied `trustBadges` preservation so precomputed payloads are not overwritten
- `mcp_server/tests/memory/trust-badges.test.ts` (NEW) covering badge derivation, age rendering, lineage-orphan detection plus explicit payload preservation
- Feature catalog entry `feature_catalog/13--memory-quality-and-indexing/28-memory-causal-trust-display.md` (NEW)
- Manual testing playbook entry `manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` (NEW)

### Changed

- `mcp_server/formatters/search-results.ts` now batch-derives trust badges from connected causal-edge records and attaches them to each result envelope
- `mcp_server/lib/response/profile-formatters.ts` now carries `trustBadges` in its result typing so the badge payload survives output profile shaping

### Fixed

- None.

### Verification

- `tsc --noEmit`: exit 0 (Wave-3 canonical, commit `d4a53288`, 2026-04-25, clean after type-widening fix in `c6e766dc5`)
- Vitest run (10 files): 9 passed, 1 skipped (10 total), 90 passed, 3 skipped (93 tests), 1.34s. The `tests/response-profile-formatters.vitest.ts` file is in the 9 PASSED files, confirming badge round-trip through all three profile views.
- `tests/memory/trust-badges.test.ts` SQL-mock describe block: 3 tests SKIPPED pending T-E remediation (R-007-13: rewrite SQL-mock resolution via DI override or real-DB fixture). The trust-badge pure-function paths pass. The SQL-routed badge-derivation paths are the ones deferred.
- Protected-file static diff: `causal-edges.ts` and `causal-boost.ts` unchanged (PASS).
- Relation vocabulary review: source still declares only `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` (PASS).
- Strict packet validation (`validate.sh --strict`): FAILED on template-section conformance only (extra or non-canonical section headers from per-sub-phase scaffold). Not a contract violation: required Level-2 files present, anchors balanced, no `[TBD]` placeholders. Tracked as deferred P2 cleanup.
- Feature catalog DQI: OPERATOR-PENDING. Original score 87 was captured outside the canonical Wave-3 channel. Re-run `python3 .opencode/skills/sk-doc/scripts/validate_document.py` to attest the score.
- Manual testing playbook DQI: OPERATOR-PENDING (reported 91 outside the canonical Wave-3 channel, same re-attestation required).

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/formatters/search-results.ts` | Modified | Batch-derives `MemoryTrustBadges` from causal-edge columns and attaches payload to each result envelope |
| `mcp_server/lib/response/profile-formatters.ts` | Modified | Carries `trustBadges` in result typing to preserve badges through profile shaping |
| `mcp_server/tests/memory/trust-badges.test.ts` | Created (NEW) | Covers badge derivation, age rendering, lineage-orphan detection plus explicit payload preservation |
| `mcp_server/tests/response-profile-formatters.vitest.ts` | Modified | Covers `trustBadges` preservation through `quick`, `research` plus `resume` profiles |
| `.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/28-memory-causal-trust-display.md` | Created (NEW) | Packet-local feature catalog entry |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` | Created (NEW) | Packet-local manual testing playbook entry |

### Follow-Ups

- Re-attest feature catalog DQI by running `python3 .opencode/skills/sk-doc/scripts/validate_document.py` on `28-memory-causal-trust-display.md` via the canonical Wave-3 channel.
- Re-attest playbook DQI by running the same validator on `203-memory-causal-trust-display.md`.
- Unskip the 3 SQL-mock tests in `tests/memory/trust-badges.test.ts` once T-E remediation (R-007-13 DI override or real-DB fixture) lands.
- Fix template-section conformance warnings in `spec.md`, `plan.md`, `tasks.md` plus `checklist.md` to bring strict packet validation to exit 0.
