---
title: "Code Graph Phase 012/005: Scope changes need explicit consent"
description: "F-002 broadened from a zero-node guard to a full scope-fingerprint guard. Any scan whose scope differs from the stored scope is rejected unless the caller explicitly passes forceScopeChange:true."
trigger_phrases:
  - "phase 012/005 changelog"
  - "scope-fingerprint guard"
  - "forceScopeChange"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

Phase 012/004 closed the obvious zero-node wipe case. This phase closed the sneakier case underneath it.

**The remaining hole.** F-002's original zero-node guard only triggered when a scan produced exactly zero nodes against a populated index. But here is a more common failure: you build a 56k-node index with `includeSkills: true`, then run a default-scope scan (no skills) by accident. The default scan is small but non-zero. The zero-node guard does not fire, and the smaller scan silently overwrites the larger index. You lose 90 percent of your data and nothing tells you why.

After this phase, F-002 was broadened to a scope-fingerprint guard. Every scan now computes a fingerprint of its scope (which folders are included, which globs are applied). When a new scan's fingerprint does not match the stored fingerprint, the scan is rejected with `reason: 'scope_change_scan_rejected'`. The prior index is preserved unchanged. To intentionally change scope, the caller must pass `forceScopeChange: true` as an explicit acknowledgment.

This is "Option B" in the spec: a stricter contract than the zero-node guard alone, deliberately chosen because scope mismatches were the single most common cause of accidental data loss in live testing.

### Added

- Scope-fingerprint guard at the scan promotion site. The guard compares `activeScope.fingerprint` against `storedScope.fingerprint` from the previous scan.
- `forceScopeChange: true` argument on `code_graph_scan` for intentional scope migrations.
- `lastFailedScan.reason: 'scope_change_scan_rejected'` populated when the guard fires, with full diagnostic detail (totalFiles, totalNodes, parseErrorCount, previousGitHead, scopeFingerprint).

### Changed

- F-002 widened: it now blocks any scope mismatch, not just zero-node scans.
- Scan rejection path returns `status: blocked` with a structured reason and preserves the prior node and edge counts.
- Console warnings name the previous scope label and the new scope label so the operator can see exactly what changed.

### Fixed

- The narrow-scope-overwrites-broad-scope case that bypassed the original zero-node guard. Live testing produced this scenario routinely, and it was the single largest source of accidental data loss.

### Verification

- Vitest cases simulate scope-mismatch scans against populated indexes and assert the blocked path.
- Live driver: a default-scope scan against a populated index returned `lastFailedScan.reason: 'scope_change_scan_rejected'`, totalFiles: 137, totalNodes: 5. Status query after rejection confirmed the prior 55,978-node graph was intact.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/handlers/scan.ts` | Scope-mismatch branch added before the zero-node branch. The guard compares stored vs active fingerprints. |
| `code_graph/lib/index-scope-policy.ts` | Fingerprint computation extended to v3 with sorted include and exclude globs. |
| `code_graph/lib/code-graph-db.ts` | `lastFailedScan` schema extended to record the scope diff. |

Commit: `2895f0eb4`.

### Follow-Ups

- Phase 012/006 added the F-019 contract that makes scope mismatch informational on read paths (verify and status), so reads do not block on drift while writes still respect the guard.
- The `parse_diagnostics` table was added in phase 012/006 to expose blocked-scan details to status responses.
