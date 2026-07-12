---
title: "Canonical continuity save substrate"
description: "Canonical continuity save substrate routes canonical saves through contentRouter, anchorMergeOperation, atomicIndexMemory and the thin _memory.continuity block while preserving the resume ladder."
trigger_phrases:
  - "canonical continuity save substrate"
  - "contentRouter anchorMergeOperation atomicIndexMemory"
  - "_memory.continuity block"
  - "canonical save routing"
  - "resume ladder preservation"
version: 3.6.0.8
---

# Canonical continuity save substrate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Canonical continuity save substrate routes canonical saves through contentRouter, anchorMergeOperation, atomicIndexMemory and the thin `_memory.continuity` block while preserving the resume ladder.

This is the writer-side substrate that replaced the older spec-doc record-file assumption. It classifies incoming content, merges only into legal anchors, writes atomically, and keeps the continuity payload compact enough to live inside the spec doc instead of a separate file.

## 2. HOW IT WORKS

### Core Behavior

The canonical continuity and phase-017 writer path is split across four core modules, one supporting resume helper, and the workflow-side metadata refresh pass.

- `contentRouter` classifies incoming session content into the correct routing tier.
- `anchorMergeOperation` applies the requested merge mode inside the existing `withSpecFolderLock` envelope.
- `atomicIndexMemory` replaces the old atomic save helper and promotes the canonical spec-doc result.
- `thinContinuityRecord` keeps `_memory.continuity` as a compact frontmatter sub-block rather than a separate persistence layer.
- `resumeLadder` resolves the recovery chain in the order `handover.md -> _memory.continuity -> spec docs`.

Together these modules make spec-doc writes canonical while leaving the continuity payload as thin supporting state instead of a separate memory-file feature.

### Post-Action Behavior

The generate-context save lane also refreshes `graph-metadata.json` for the packet. That derived surface is now checklist-aware and normalized: `status` falls back to `implementation-summary.md` presence plus checklist completion when explicit status is absent, stored values are lowercase, `trigger_phrases` are deduplicated and capped at 12, `key_files` are sanitized before storage, and entity rows are deduplicated with canonical-path preference. Direct MCP `memory_save({ filePath })` is the content-indexing lane; its success envelope reports `metadataRefresh.refreshed:false` when packet metadata was not refreshed there.

### Quality Gates & Validation

The implementation fixed the remaining metadata gap in the generate-context substrate. That workflow refreshes packet metadata instead of skipping the metadata write when the merge looks structurally unchanged, backfills missing iteration-pack metadata during the same workflow, and uses the continuity-freshness validator to warn when `_memory.continuity.last_updated_at` lags the packet metadata write by more than 10 minutes. The writer substrate is therefore responsible for both the canonical spec-doc write and the metadata freshness contract that hangs off it; the raw MCP content-indexing lane advertises when it did not refresh metadata.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/routing/content-router.ts` | Lib | Three-tier routing classifier for canonical continuity saves |
| `mcp_server/lib/merge/anchor-merge-operation.ts` | Lib | Five-mode anchor-aware merge engine |
| `mcp_server/handlers/save/atomic-index-memory.ts` | Handler | Atomic canonical save helper |
| `mcp_server/lib/continuity/thin-continuity-record.ts` | Lib | Thin `_memory.continuity` frontmatter reader/writer |
| `mcp_server/lib/resume/resume-ladder.ts` | Lib | `handover.md -> _memory.continuity -> spec docs` recovery ladder |
| `mcp_server/handlers/memory-save.ts` | Handler | Save pipeline that wires the substrate together |
| `scripts/memory/generate-context.ts` | Script | CLI save entrypoint that feeds canonical continuity writes |
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Lib | Derives refreshed packet metadata from canonical docs during save/backfill |
| `scripts/core/workflow.ts` | Script orchestrator | Canonical save workflow that now writes metadata on every successful invocation |
| `scripts/memory/backfill-research-metadata.ts` | Script | Repairs missing research-tree metadata during canonical save follow-up |
| `scripts/validation/continuity-freshness.ts` | Script | Warns when continuity timestamps lag the canonical metadata write |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/content-router.vitest.ts` | Automated test | Routing classification coverage |
| `mcp_server/tests/anchor-merge-operation.vitest.ts` | Automated test | Anchor merge mode coverage |
| `mcp_server/tests/atomic-index-memory.vitest.ts` | Automated test | Atomic canonical save coverage |
| `mcp_server/tests/thin-continuity-record.vitest.ts` | Automated test | `_memory.continuity` serialization coverage |
| `mcp_server/tests/resume-ladder.vitest.ts` | Automated test | Recovery ladder coverage |
| `scripts/tests/workflow-canonical-save-metadata.vitest.ts` | Automated test | Metadata-on-every-save regression coverage |
| `scripts/tests/continuity-freshness.vitest.ts` | Automated test | Continuity freshness warning coverage |

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `memory_quality_and_indexing/canonical_continuity_save_substrate.md`
Related references:
- [spec-doc-structure-validator.md](spec_doc_structure_validator.md) — Spec-doc structure validator
- [memory-causal-trust-display.md](memory_causal_trust_display.md) — Memory causal trust display
