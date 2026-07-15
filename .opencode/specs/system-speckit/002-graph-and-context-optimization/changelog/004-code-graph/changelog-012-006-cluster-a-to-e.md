---
title: "Code Graph Phase 012/006: Cluster A to E polish"
description: "Five medium-priority findings closed in one pass. F-008 scan metadata, F-011 parse_diagnostics surfacing, F-018 auto-rescan policy, F-019 informational scope mismatch, and v3 fingerprint with sorted globs. Plus a follow-up that fixed the verify endpoint's broken default path."
trigger_phrases:
  - "phase 012/006 changelog"
  - "cluster A to E remediation"
  - "F-008 F-011 F-018 F-019"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

Five P1 findings (medium priority, must-fix soon) from the deep-research at phase 012/003 landed together in this phase. They are individually small but collectively close most of the day-to-day friction operators were hitting.

**F-008: scan metadata gating.** When a scan was rejected by the F-002 guard, the rejection details (reason, file count, parse errors) were not persisted to status responses. Operators had to scrape logs to figure out why a scan failed.

**F-011: parse_diagnostics surfacing.** Per-file parser errors were stored in a SQL table but never exposed to the MCP boundary. There was no way to see which files were problematic without direct database access.

**F-018: auto-rescan policy.** The readiness contract used to block all reads when the stored and active scopes drifted. That was over-cautious for small benign drifts.

**F-019: informational scope mismatch on verify.** The `code_graph_verify` endpoint hard-blocked on scope mismatch even though verify is a read-only check. Verify should report the mismatch and proceed.

**v3 fingerprint with sorted globs.** Two scans with the same scope but differently ordered include or exclude globs produced different fingerprints, leading to false drift detection.

A follow-up commit closed two leftover caveats from this same cluster, and a separate fix corrected a path bug in the verify endpoint's default battery file location (the path had an extra `skill/` segment that did not exist on disk because of a refactor that updated only the source-relative walk and not the compiled-relative walk).

### Added

- `lastFailedScan` block in status responses. Surfaces `reason`, `totalFiles`, `totalNodes`, `parseErrorCount`, `parseErrorRatio`, `previousGitHead`, `currentGitHead`, `scopeFingerprint`, `scopeLabel`, `errors[]`, `recordedAt` for every blocked or failed scan.
- `parseDiagnostics` block in status responses. Surfaces `affectedFiles` count and `recentErrors[]` (file path, error message, error count, last seen at) for the five most recent parser errors.
- `auto-rescan-policy.ts` module with `shouldAutoRescan({ storedScope, activeScope, parseDiagnosticsBacklog, parseDiagnosticsBacklogThreshold? })`. Returns an `{ allowed, blockReason? }` envelope. The readiness contract now consults this policy before blocking.
- `scopeMismatch` field on the `code_graph_verify` response when stored and active scopes differ. Returns `{ stored, active, recommendation }`. Verify proceeds normally instead of failing.

### Changed

- Fingerprint version bumped from v2 to v3. The v3 hash includes sorted `includeGlobs` and `excludeGlobs` so glob ordering does not produce false drift.
- Verify endpoint refactored to treat scope mismatch as informational. The legacy block branch was removed.
- Default battery path resolution in `gold-query-verifier.ts` now uses a semantic-anchor walker that climbs the tree looking for `.opencode/specs/`, instead of a fixed five-up relative path that broke when the module was loaded from `dist/`.

### Fixed

- F-008: Operators can now see why a scan was rejected without scraping logs.
- F-011: Parser-error visibility from the MCP boundary closed.
- F-018: Read paths no longer block on minor benign scope drifts.
- F-019: Verify is no longer falsely blocked by scope mismatch.
- v3 fingerprint: Two semantically equivalent scans with different glob ordering now produce the same fingerprint and do not trigger false drift detection.
- Verify default path: The gold-battery file was failing to resolve because the post-refactor relative walk was correct from source but landed at `.opencode/skills/specs/` from compiled output (a path that does not exist).

### Verification

- Vitest suite added or expanded for each finding. Cluster A through E all pass.
- Live driver run after the cluster shipped: status response shows `lastFailedScan` and `parseDiagnostics` blocks populated as expected. Verify against a scope-mismatched index returns `status: ok` with the new informational `scopeMismatch` field.
- Strict packet validation passed.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/handlers/scan.ts` | Records full `lastFailedScan` metadata when the F-002 guard fires. |
| `code_graph/handlers/status.ts` | New `lastFailedScan` and `parseDiagnostics` response fields. |
| `code_graph/handlers/verify.ts` | Removed the legacy block-on-scope-mismatch branch. Added the informational `scopeMismatch` field. |
| `code_graph/lib/auto-rescan-policy.ts` | New module that decides whether scope drift should auto-rescan or block. |
| `code_graph/lib/ensure-ready.ts` | Reads `auto-rescan-policy` and acts on its envelope. |
| `code_graph/lib/index-scope-policy.ts` | Bumped fingerprint to v3 with sorted globs. |
| `code_graph/lib/gold-query-verifier.ts` | Replaced the brittle five-up relative path with a `resolveProjectRoot()` walker. |

Commits: `bf98a38d5` (cluster A-E), `944e8a06a` (caveats), `ee2e84400` (verify path fix).

### Follow-Ups

- Phase 012/007 caught one more class of issue that this cluster did not surface: the bash WASM grammar's missing `external_scanner_reset` symbol caused a different cascade entirely. That phase shipped the skip-list workaround.
- The `parse_diagnostics.recentErrors` field is currently capped at five most recent. A future packet can add pagination if operators need historical data.
