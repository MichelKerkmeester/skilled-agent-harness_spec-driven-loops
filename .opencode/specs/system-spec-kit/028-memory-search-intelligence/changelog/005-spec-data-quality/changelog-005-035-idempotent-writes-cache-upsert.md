---
title: "Changelog: Idempotent Writes Cache Upsert [005-spec-data-quality/006-generated-metadata-build/035-idempotent-writes-cache-upsert]"
description: "Chronological changelog for the idempotent writes cache upsert phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/035-idempotent-writes-cache-upsert` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Shipped the description-side idempotent writes and a targeted global-cache upsert behind the default-OFF `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` flag. A content fingerprint that excludes the volatile `lastUpdated` stamp drives a per-folder no-op skip and an aggregate-cache content gate so a write whose only delta is the timestamp is skipped. A new `upsertDescriptionCacheEntry` replaces only the target row instead of rebuilding the whole tree. The canonical-save escape hatch still bumps `lastUpdated` on demand. Vitest green at 9 cases. The flag later GRADUATED to default-ON.

### Added

- A deterministic content fingerprint over a stable key-sorted serialization with `lastUpdated` removed, so two derivations of identical content hash equal even when their timestamps differ.
- `upsertDescriptionCacheEntry`, a targeted helper that loads the aggregate `descriptions.json`, replaces or inserts only the one folder row whose `specFolder` matches, carries sibling rows through byte-identical, re-sorts to the rebuild layout, and writes only when the row actually changed. A missing cache bootstraps a single-entry file rather than rescanning the tree.
- The default-OFF `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` flag and its reader in `capability-flags.ts`, env-only and mirroring the sibling `SPECKIT_IDENTITY_MERGE_SAFETY` pattern.
- A `{ canonicalSave: true }` option on `savePerFolderDescription` that bypasses the no-op skip so a deliberate canonical save still advances `lastUpdated` on unchanged content.
- `tests/folder-discovery-idempotent.vitest.ts` proving the no-op skip, the real-delta write, the escape hatch, the targeted upsert, the no-op upsert, the insert, the bootstrap, the aggregate gate, and the flag-OFF legacy path.

### Changed

- `savePerFolderDescription` compares the incoming fingerprint against the on-disk file and, when the flag is on and the content matches, returns without writing so the prior `lastUpdated` survives and the working tree stays clean.
- `saveDescriptionCache` gained an opt-in content gate that fingerprints the member rows ignoring the top-level `generated` stamp and skips the write when only that stamp would move, with `ensureDescriptionCache` routing its rebuild save through that gate.
- The whole-tree `generateFolderDescriptions` plus `ensureDescriptionCache` rebuild is reserved for structural changes such as a folder delete or rename.

### Fixed

- `workflow-canonical-save-metadata.vitest.ts` carried a test asserting the pre-idempotency contract that a second `refreshGraphMetadata` on unchanged content advances `derived.last_save_at`, which the already-shipped graph idempotency skip turned red. The test was reconciled to the idempotent contract so a no-op re-derive preserves the stamp and a real content change still advances it.

### Verification

- `npx vitest run tests/folder-discovery-idempotent.vitest.ts` - PASS, 9 tests covering the no-op skip, real-delta write, escape hatch, targeted upsert, no-op upsert, insert, bootstrap, aggregate gate, and flag-OFF legacy path.
- `npx vitest run ../scripts/tests/workflow-canonical-save-metadata.vitest.ts` - PASS, 5 passed 1 skipped, reconciled graph idempotency test plus existing canonical-save coverage.
- Existing folder-discovery, integration, memory-tracking, and description suites - PASS, no regression.
- Graph idempotency suites - PASS, unaffected.
- `npm run typecheck` - PASS, clean tsc.
- `bash scripts/spec/validate.sh <035> --strict` - Exit 0.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: added the default-OFF flag and its reader.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`: added the content fingerprints, the per-folder no-op skip with the canonical-save escape hatch, the aggregate-cache content gate, and `upsertDescriptionCacheEntry`, all behind the flag.
- `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts`: proving the skip, the delta write, the escape hatch, and the upsert paths.
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts`: reconciled the graph idempotency test to the no-op-preserves contract.

### Follow-Ups

- `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` GRADUATED to default-ON after a scoped migration restamped the legacy wall-clock files.
- Live callers that currently rebuild were not yet rewired to prefer `upsertDescriptionCacheEntry` at ship time, that routing was part of graduation.
- A dedicated would-rewrite grandfather reporter was folded into the graduation follow-on rather than built here.
