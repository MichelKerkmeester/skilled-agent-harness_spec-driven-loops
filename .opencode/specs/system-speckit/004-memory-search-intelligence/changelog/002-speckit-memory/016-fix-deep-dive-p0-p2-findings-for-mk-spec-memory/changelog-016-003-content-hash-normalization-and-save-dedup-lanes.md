---
title: "Changelog: Content-Hash Normalization and Save-Dedup Lanes [016/003-content-hash-normalization-and-save-dedup-lanes]"
description: "Normalized content-hash input and repaired the broken save-dedup lanes so an unchanged re-save returns unchanged instead of minting a deprecated snapshot."
trigger_phrases:
  - "content hash normalization changelog"
  - "save dedup lanes repair"
  - "unchanged re-save churn fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

Saving an unchanged document no longer churns the corpus. `content_hash` used to be a raw sha256 of the file bytes, so a CRLF flip, a trailing space or a bumped continuity timestamp read as new content. Every same-path re-save then retired its predecessor to deprecated and inserted a fresh row, accumulating snapshots without bound. `normalizeContentHashInput` now folds CRLF to LF, strips trailing whitespace and zeros the continuity fingerprint and timestamp lines before hashing. The dedup match path is dual-compare, so it accepts the normalized hash or the legacy raw hash without any stored-hash rewrite. The broken save-dedup lanes that should have absorbed re-saves work again. Shipped in `b9400b1d56`.

### Added

- `normalizeContentHashInput` for a content identity that ignores non-durable churn.
- A dual-compare dedup match path that accepts the normalized hash or the legacy raw hash at runtime.

### Changed

- The full-auto canonical save no longer structurally self-rejects. POST_SAVE_FINGERPRINT validates against the rendered content and the apply follow-up dispatches a real canonical writer.
- The PE-gate UPDATE and REINFORCE lanes are reachable again because the same-path exclusion was dropped from the similar-memory lookup.
- The two `buildContinuityFingerprint` builders are unified onto one exported implementation, so CONTINUITY_FRESHNESS cannot mismatch by construction.
- Recon conflict handling retires the predecessor before inserting the successor, so it no longer collides with the active-uniqueness index.

### Fixed

- The transactional complement recheck is gated on reconsolidation-enabled and non-force, so a same-path re-save stops aborting with E088.
- The quality-gate semantic dedup excludes a document's own predecessor instead of rejecting a re-save as a near-duplicate of itself.
- The cross-file canonical-path guard now covers SUPERSEDE, so a cross-file regex match cannot deprecate a sibling document.
- The content-router transcript-wrapper drop is anchored to line-start speaker cues, so a chunk that mentions `tool:` or `user:` mid-line is no longer dropped.
- Six hybrid-search test failures were traced to stale phase-002 DB mocks. The mock was repaired to match the current query.

### Verification

- `npm run build` clean.
- 003 vitest 315 of 315 across 9 files.
- REQ-001 through REQ-010 xhigh review pass after remediation, 8 of 10 on the first pass.
- Content-hash dual-compare is runtime and non-destructive.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/content-id.ts` normalizes the content-hash input.
- `mcp_server/handlers/memory-save.ts` carries the dedup-lane repairs.
- `mcp_server/handlers/save/pe-orchestration.ts` unblocks the PE-gate lanes.

### Follow-Ups

- No batch migration ships. Legacy raw-hash rows match on the fly and store the normalized hash only on their next real re-save.
- Search-level effects depend on the daemon running this code.
