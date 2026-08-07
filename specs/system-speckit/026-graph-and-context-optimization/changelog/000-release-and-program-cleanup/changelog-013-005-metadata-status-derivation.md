---
title: "013/005 Metadata Status Derivation"
description: "deriveStatus now honors spec.md metadata-table Status values before falling back to implementation-summary presence and cited 026/027 metadata files were reconciled to disk and spec reality."
trigger_phrases:
  - "013/005 metadata status derivation"
  - "table status fallback changelog"
  - "deriveStatus draft fix"
  - "026 027 metadata reconciliation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

Status derivation no longer marks Draft or Placeholder specs complete merely because an implementation-summary file exists. The graph metadata parser now reads the `| **Status** | ... |` row from `spec.md` when YAML frontmatter has no status, then feeds that value into the existing precedence chain. The cited 026 and 027 metadata data files were also reconciled to actual disk state, actual spec status and corrected changelog counts in the scope owned by this phase.

### Added

- `extractMetadataTableStatus()` helper for reading the markdown metadata-table Status row
- Draft and Placeholder fixture coverage in `graph-metadata-schema.vitest.ts`

### Changed

- `collectPacketDocs` now sets spec.md status from YAML when present, otherwise from the metadata table before status derivation falls through to implementation-summary heuristics
- 026 and 027 metadata files were reconciled for last-active child pointers, completion contradictions, placeholder child removal, renumbered child titles and triggers, draft derived statuses, missing-on-disk resource-map honesty and lean-parent notes
- Track-000 changelog counts were corrected in the 026 changelog root and README

### Fixed

- Draft and Placeholder specs that declare status in the spec metadata table no longer derive as `complete` because an implementation-summary exists
- Two cited complete-but-contradictory packets were reconciled to Complete after verification of actual shipped state

### Verification

- Typecheck parser against the project tsconfig: PASS for `graph-metadata-parser.ts`, with unrelated pre-existing errors in `handlers/memory-search.ts`
- Typecheck test file: PASS for `graph-metadata-schema.vitest.ts`
- Draft and Placeholder fixture tests authored: PASS by authoring, vitest deferred to central
- `validate.sh --strict` on edited 026 and 027 packets: PASS, Errors 0
- `JSON.parse` on every edited JSON metadata file: PASS
- E5 stale-id grep: PASS, only the correct current `027 phase 008` remains

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Table-status helper and status fallback |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Draft and Placeholder fixture tests |
| `026 graph-metadata.json` and `026 spec.md` | Modified | Last-active pointer and prose |
| `026 track-000 changelog root` and `changelog README.md` | Modified | Leaf count correction to 129 |
| `026 009-readme-and-references-accuracy/{spec,graph-metadata,checklist,implementation-summary}` | Modified | Reconciled to Complete |
| `026 016-embedding-provider-local-first/{spec,graph-metadata,checklist,implementation-summary}` | Modified | Reconciled to Complete |
| `027 description.json` and `027 graph-metadata.json` | Modified | Placeholder child de-listed |
| `027 {002,007,008}/description.json` | Modified | Title and trigger renumbering |
| `027 {003,006}/graph-metadata.json` | Modified | Derived status set to draft |
| `026 resource-map.md` | Modified | Missing-on-disk honesty |
| `027 spec.md` and `026 spec.md` | Modified | Lean-parent note and 026 surface pin |
| `026 context-index.md` | Modified | Existing narrative field compacted to unblock strict validation |

### Follow-Ups

- Global backfill was not run. Central owns the mcp_server dist rebuild and `backfill-graph-metadata.ts` run that regenerates derived statuses across all 026 and 027 packets.
- Tracks 003 and 004 changelog rollup drift was explicitly left as a follow-up by this phase.
