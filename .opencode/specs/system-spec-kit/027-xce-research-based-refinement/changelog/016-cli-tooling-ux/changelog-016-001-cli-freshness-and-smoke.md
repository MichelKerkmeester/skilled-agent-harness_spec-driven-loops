---
title: "Changelog: 001-cli-freshness-and-smoke"
description: "Implemented content-hash CLI freshness gates, stale-dist plugin status, and a daemon-free offline 37/8/9 CLI smoke command."
trigger_phrases:
  - "016 001 CLI freshness changelog"
  - "offline CLI smoke"
  - "dist stale rebuild required"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/001-cli-freshness-and-smoke` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux`

### Summary

The three daemon CLI shims now use content-hash freshness checks so mtime-only source touches no longer trigger false stale-dist failures. Plugin status surfaces stale dist as an actionable classified state, and a daemon-free offline smoke command verifies the three CLI surfaces at 37/8/9 commands.

### Added

- `.opencode/bin/cli-offline-smoke.cjs` plus tests for daemon-free CLI count and freshness checks.
- Build-time source fingerprint writing for spec-memory dist finalization.

### Changed

- `spec-memory.cjs`, `code-index.cjs`, and `skill-advisor.cjs` freshness gates compare content hashes before falling back to conservative mtime checks.
- Plugin bridges classify stale dist as `dist_stale_rebuild_required` with sanitized stderr markers.

### Fixed

- Source mtime-only changes no longer produce false stale exit `69` after a normal build.

### Verification

| Check | Result |
|-------|--------|
| Reproduce mtime-only stale-69 | PASS |
| Plain rebuild restores freshness | PASS |
| Offline smoke | PASS: 37/37, 8/8, 9/9, fresh, daemon-free |
| Plugin stale-dist status | PASS: actionable state plus `[stderr-present]` marker |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs` | Modified | Hash freshness gates |
| `.opencode/bin/cli-offline-smoke.cjs` | Created | Offline CLI smoke |
| `plugin_bridges/*` | Modified | Stale-dist status classification |
| `001-cli-freshness-and-smoke/**` | Updated | Phase docs and evidence |

### Follow-Ups

- Broad alignment verifier still reported unrelated existing issues outside this sub-phase scope.
