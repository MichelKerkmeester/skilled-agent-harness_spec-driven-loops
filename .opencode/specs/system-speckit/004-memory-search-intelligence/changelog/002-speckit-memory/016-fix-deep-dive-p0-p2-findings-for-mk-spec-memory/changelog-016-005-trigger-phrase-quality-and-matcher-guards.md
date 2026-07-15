---
title: "Changelog: Trigger-Phrase Quality and Matcher Guards [016/005-trigger-phrase-quality-and-matcher-guards]"
description: "Retired legacy word-soup trigger phrases, added matcher stopword and IDF guards and made trigger writes merge instead of clobber user-authored phrases."
trigger_phrases:
  - "trigger phrase quality changelog"
  - "matcher stopword idf guard"
  - "constitutional row dedup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

`memory_match_triggers` stops surfacing noise. Legacy rows stored word-soup phrases that matched almost anything and the matcher ranked them on single-token hits. A batched, resumable, checkpoint-gated migration regenerated 48 legacy rows through the quality extractor. The matcher now applies a stopword, minimum-length and IDF guard to single-token matches and dedupes phrases per memory. The phrase cache is keyed on path and mtime instead of re-reading the whole corpus every 60 seconds. Trigger writes merge extracted phrases with user-authored ones instead of clobbering them. A gated migration deduped the constitutional rows from 30 to 19 distinct. Shipped in `23f5583ad3`.

### Added

- A dry-run-default, before-scoped, resumable migration that regenerated 48 legacy trigger rows.
- A dry-run-default, baseline-gated migration that deduped 11 duplicate constitutional rows.
- A write guard that rejects a constitutional save originating from a `/tmp` or sandbox path.

### Changed

- The matcher applies a stopword, minimum-length and IDF guard on single-token matches and dedupes phrases per memory.
- The phrase cache is keyed on path and mtime with a batched record fetch.
- Trigger writes merge extracted and user-authored phrases, deduped case-insensitively and capped.
- `memory_match_triggers` matches a specFolder by path segment, consistent with every other read surface, instead of a bare substring.
- Frontmatter parsing handles apostrophes and multi-line YAML phrase lists.

### Fixed

- The trigger backfill keeps failed rows failed behind an attempt cap and backoff while cleaning up phrases for deleted memories.
- The trigger-cache loader excludes archived, deprecated, tombstoned and constitutional rows through the phase-002 shared predicate, verified here rather than re-implemented.

### Verification

- `npm run build` clean.
- 005 vitest 54 of 54 across 5 files.
- REQ-001 through REQ-010 xhigh review pass after remediation, 9 of 10 on the first pass.
- Trigger regen migration ran on live under backup, 48 rows.
- Constitutional dedup migration ran on live, 11 deleted, 30 to 19 distinct, integrity ok.
- Active-key invariant zero violations.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/parsing/trigger-matcher.ts` adds the guards and the path-and-mtime cache.
- `mcp_server/handlers/memory-save.ts` merges triggers and adds the /tmp-origin write guard.
- `mcp_server/scripts/migrations/regenerate-legacy-trigger-phrases.mjs` and `dedup-constitutional-trigger-rows.mjs` are the two migrations.

### Follow-Ups

- Matcher-side effects need the daemon running this code.
- Rollback is `context-index.sqlite.pre-005-trigger-quality-20260703`.
