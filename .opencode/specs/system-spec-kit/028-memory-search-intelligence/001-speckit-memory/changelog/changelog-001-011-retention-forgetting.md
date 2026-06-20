---
title: "Changelog: Memory Retention, Forgetting and Recall-Diversity Result Shaping [001-speckit-memory/011-retention-forgetting]"
description: "Chronological changelog for the Memory retention, forgetting and recall-diversity result-shaping phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/011-retention-forgetting` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped two retention candidates behind the default-off `SPECKIT_RETENTION_FORGETTING_V1` flag, alongside the candidate ledger for the remaining six. Spare-only retention eligibility and the live incoming-edge allowlist landed with deterministic tests, while the benchmark-gated, cascade and trust-gated candidates stay pending behind their real gates. Commit `5308341d95` carried the lib code with focused tests.

### Added

- Added the default-off spare-only retention eligibility axes in `lib/feedback/feedback-retention-reducer.ts`.
- Added the default-off live incoming-edge allowlist protection in `lib/governance/memory-retention-sweep.ts`.
- Added the retention trust column migration in `lib/search/vector-index-schema.ts` and the `SPECKIT_RETENTION_FORGETTING_V1` flag.
- Added the Level-2 candidate ledger and explicit deferrals for the remaining candidates.

### Changed

- Recorded each candidate with its seam, gate and status.
- Kept recall-ranking work separate from erasure-path governance.

### Fixed

- Corrected the threat-model framing for single-host work. Multi-writer controls stay deferred until the threat model exists.

### Verification

- Strict phase validation: PASS.
- Candidate status check against the Wave-0 record: PASS.
- Research traceability: PASS.
- Implementation tests: PASS. Deterministic reducer, sweep, migration, compatibility and flag-ceiling coverage.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `lib/feedback/feedback-retention-reducer.ts` | Modified | Default-off spare-only retention axes |
| `lib/governance/memory-retention-sweep.ts` | Modified | Default-off live incoming-edge allowlist protection |
| `lib/search/vector-index-schema.ts` | Modified | Retention trust column, backfill, incoming-edge index and rollback |
| `lib/search/search-flags.ts` | Modified | Added `SPECKIT_RETENTION_FORGETTING_V1` |
| `tests/*retention*.vitest.ts` | Modified | Deterministic reducer, sweep, migration and flag coverage |
| `spec.md` | Created | Captures scope, candidate status and acceptance criteria |
| `plan.md` | Created | Captures sequencing, affected surfaces and rollback |
| `tasks.md` | Created | Captures implementation and verification tasks |
| `checklist.md` | Created | Captures Level-2 verification gates |
| `implementation-summary.md` | Created | Captures the shipped-core and pending-candidate summary |

### Follow-Ups

- Resolve the feedback-learning and allowlist prerequisites before retention scoring.
- Keep each ranking tweak flag-gated until a measured recall delta exists.
- Move GDPR erasure behavior into its own packet.
