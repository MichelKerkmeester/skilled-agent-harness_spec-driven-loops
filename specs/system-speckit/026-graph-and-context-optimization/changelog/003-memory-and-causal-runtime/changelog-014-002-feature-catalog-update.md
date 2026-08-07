---
title: "014/002 Feature Catalog Update"
description: "Feature catalog documentation was updated for checkpoint v2, the MCP front proxy, schema history, error codes, enrichment markers and the sk-git worktree convention."
trigger_phrases:
  - "feature catalog checkpoint front proxy schema"
  - "014 002 feature catalog changelog"
  - "error code enrichment sk-git catalog update"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh`

### Summary

Updated the `system-spec-kit` feature catalog for shipped 013 memory-index-scan behavior and the 128 sk-git worktree convention. The phase expanded checkpoint create and restore entries, created new catalog entries for the front proxy, schema version history, error codes, enrichment markers and sk-git then registered the new files in the catalog index.

This was documentation-only. The packet records that every behavioral claim was checked against source anchors before authoring.

### Added

- New MCP front-proxy catalog file covering reconnecting session proxy behavior, in-place daemon recycle, backend-only mode, `-32001` retryable recycle and `-32002` protocol fail-closed.
- New schema history catalog file covering migrations 28, 29 and 30.
- New unified error-code reference for `E429`, `-32001` and `-32002`.
- New post-insert enrichment marker catalog file with the `post_insert_enrichment` trigger phrase.
- New sk-git worktree convention catalog file that points to the skill-owned worktree rules.

### Changed

- Expanded checkpoint creation and restore catalog entries to cover checkpoint v2 file snapshots, v29 metadata columns, shard attach, restore journals and the `.needs-rebuild` sentinel.
- Registered new catalog files in `feature_catalog/feature_catalog.md`.
- Preserved the verified 36-tool count instead of mixing it with a different cross-server count.

### Fixed

- Closed feature catalog gaps for shipped checkpoint v2, front-proxy, schema v30, enrichment and sk-git behavior.
- Kept `-32001` documented as still live rather than describing it as removed.

### Verification

| Check | Result |
|-------|--------|
| Packet docs | PASS - spec, plan, tasks, checklist, decision record and implementation summary authored |
| Checkpoint v2 claims | PASS - traced to checkpoint and vector schema source anchors |
| Schema v30 claims | PASS - traced to vector schema migration source anchors |
| Front-proxy claims | PASS - traced to launcher proxy and launcher source anchors |
| Error-code claims | PASS - traced to error registry and launcher proxy source anchors |
| Catalog registration | PASS - new files registered in `feature_catalog.md` |
| Strict validation | PASS - packet records `validate.sh --strict` with 0 errors |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Registered new feature files and synced index descriptions |
| `.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/checkpoint-creation-checkpointcreate.md` | Modified | Added checkpoint v2 create path, manifest, snapshot columns and sentinel behavior |
| `.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/checkpoint-restore-checkpointrestore.md` | Modified | Added checkpoint v2 file-swap restore, restore journal and sentinel behavior |
| `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/mcp-launcher-front-proxy.md` | Added | Documented front-proxy reconnect and error semantics |
| `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md` | Added | Documented schema migration history for v28 through v30 |
| `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/error-code-reference.md` | Added | Documented `E429`, `-32001` and `-32002` |
| `.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/post-insert-enrichment-marker.md` | Added | Documented enrichment marker columns and repair behavior |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/sk-git-worktree-convention.md` | Added | Cross-referenced sk-git worktree convention |

### Follow-Ups

- Deep review later flagged catalog accuracy drift around the tool count, `E429` coalescing and replay-boundary terminology. Reconcile those in the follow-up remediation packet.
- The pre-existing unregistered routing telemetry file remained out of scope.
- README and ENV_REFERENCE coverage was owned by sibling phase 003.
