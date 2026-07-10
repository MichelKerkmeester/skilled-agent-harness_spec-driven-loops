---
title: "Implementation Summary"
description: "Feature catalog updated for the shipped 013 roadmap and 128 sk-git convention: checkpoint-v2 VACUUM-INTO snapshots added to the create/restore files, new front-proxy / schema-version-history / unified-error-code / post-insert-enrichment files authored and registered, and an sk-git worktree cross-reference added. Docs-only; every behavioral claim traced to a verified source anchor."
trigger_phrases:
  - "feature catalog update implementation summary"
  - "catalog v2 front proxy error codes shipped"
  - "feature catalog registered validated"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored and registered six feature-catalog deltas; packet validated"
    next_safe_action: "None binding; sibling 003-readme-cluster-update can link these files"
    blockers: []
    key_files:
      - "feature_catalog/feature_catalog.md"
      - "feature_catalog/05--lifecycle/checkpoint-creation-checkpointcreate.md"
      - "feature_catalog/14--pipeline-architecture/mcp-launcher-front-proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "feature-catalog-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-feature-catalog-update |
| **Completed** | 2026-06-02 — catalog deltas authored, registered, validated |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six feature-catalog deltas that bring the `system-spec-kit` feature catalog up to the shipped 013 memory-index-scan roadmap and the 128 sk-git worktree convention. The work is documentation-only, edited under `.opencode/skills/system-spec-kit/feature_catalog/`. Every behavioral claim traces to a source anchor read during authoring.

### Delta Status

| Delta | File | Action | Status |
|-------|------|--------|--------|
| Checkpoint-v2 create | `05--lifecycle/checkpoint-creation-checkpointcreate.md` | Expand | Done |
| Checkpoint-v2 restore | `05--lifecycle/checkpoint-restore-checkpointrestore.md` | Expand | Done |
| MCP front-proxy | `14--pipeline-architecture/mcp-launcher-front-proxy.md` | Create + register | Done |
| Schema version history | `08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md` | Create + register | Done |
| Error-code reference | `08--bug-fixes-and-data-integrity/error-code-reference.md` | Create + register | Done |
| Post-insert enrichment marker | `13--memory-quality-and-indexing/post-insert-enrichment-marker.md` | Create + register | Done |
| sk-git worktree convention | `16--tooling-and-scripts/sk-git-worktree-convention.md` | Create + register | Done |

### Shipped content

- **Checkpoint v2 (038/040).** The create file now documents the v2 selection branch (unscoped full-DB → v2), `VACUUM main INTO` / `VACUUM active_vec INTO` snapshots, schema v29 columns `snapshot_format`/`snapshot_path`, the per-snapshot manifest, dir-aware `MAX_CHECKPOINTS` pruning, and the `.needs-rebuild` sentinel. The restore file documents the whole-file swap through `reopenActiveDatabase`, the two-phase restore journal (`swap-pending` → `swap-done`) with boot crash-recovery, and the `.needs-rebuild` sentinel for post-`swap-done` derived staleness. Both keep the v1 JSON-BLOB path documented.
- **Front-proxy (189).** Documents the launcher-owned reconnecting session proxy (`bridgeStdioThroughSessionProxy`), in-place daemon recycle on RSS breach, the `SPECKIT_BACKEND_ONLY=1` backend-only mode, the retryable `-32001` recycle error, and the non-retryable `-32002` protocol fail-closed (terminal CLOSED state).
- **Schema history (069).** Documents `SCHEMA_VERSION = 30` and what migrations 28 (active-row partial unique index), 29 (checkpoint v2 columns), and 30 (post-insert enrichment markers) added.
- **Error codes (070).** Unifies `E429` (scan rate-limit), `-32001` (STILL-LIVE retryable recycle), and `-32002` (non-retryable protocol fail-closed) with retry semantics and source anchors.
- **Enrichment marker (162).** Makes `post_insert_enrichment_status` and its sibling columns discoverable with a `post_insert_enrichment` trigger phrase.
- **sk-git (241).** Cross-references the sk-git skill's `wt/{NNNN}-{name}` branch / `.worktrees/{NNNN}-{name}` directory convention (4-digit global max+1 counter).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deltas were authored directly against `feature_catalog/` in the existing feature-file format, with each behavioral claim verified against a read source anchor before it was written. Two accuracy traps were avoided deliberately: `-32001` is documented as still-live (the launcher `RETRYABLE_RECYCLE_ERROR`; only the index vector-drain outage path stopped surfacing its own `-32001` class), and the README "36-tool" mk-spec-memory count was left unchanged (the 43 figure is the cross-server `layer-definitions.ts` count, not the live server's tool count). The final gate was `validate.sh --strict` on this packet. The orchestrator owns all git writes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Expand `038`/`040` in place over forking v2-only files | A tool's catalog entry is the single place an operator reads; the v2 path is an extension of the same tool. |
| One new file per new capability | The catalog convention is one capability per numbered file, each registered in the index. |
| A single unified error-code reference | The operator question "which code is retryable?" is best answered on one page, not three. |
| Document `-32001` as still-live; preserve the 36-tool count | Wrong claims fail the packet; both figures are pinned to verified source anchors. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS | This packet folder |
| Checkpoint v2 claims traced | PASS | `lib/storage/checkpoints.ts`: `createCheckpointV2` (~L2181), `VACUUM main INTO` (~L2217), `VACUUM active_vec INTO` (~L2220), `restoreCheckpointV2` (~L2489), restore journal phases `swap-pending`/`swap-done` (L385, ~L2587/L2639), `NEEDS_REBUILD_SENTINEL_NAME` (L118), `repairNeedsRebuildSentinel` (~L1930) |
| Schema v30 claim traced | PASS | `lib/search/vector-index-schema.ts`: `SCHEMA_VERSION = 30` (L438), `migrations[28]` (~L1336), `migrations[29]` snapshot columns (~L1367), `migrations[30]` enrichment columns + `idx_post_insert_enrichment_incomplete` (~L1385) |
| Front-proxy claims traced | PASS | `.opencode/bin/lib/launcher-session-proxy.cjs`: `RETRYABLE_RECYCLE_ERROR` -32001 (L18-22), `PROTOCOL_MISMATCH_ERROR` -32002 (L23-26), terminal `CLOSED` fail-closed (~L617-620); `.opencode/bin/mk-spec-memory-launcher.cjs`: `bridgeStdioThroughSessionProxy` (L198), `recycleDaemonInPlace` (~L701), `SPECKIT_BACKEND_ONLY: '1'` (~L835) |
| serverInfo / backend-only traced | PASS | `context-server.ts`: serverInfo `version: '1.7.2'` (L1014), `SPECKIT_BACKEND_ONLY === '1'` read (L2126) |
| Error-code claims traced | PASS | `lib/errors/core.ts`: `RATE_LIMITED: 'E429'` (L101); launcher `-32001`/`-32002` as above |
| `post_insert_enrichment_status` traced | PASS | `vector-index-schema.ts` migration 30 marker columns |
| `-32001` documented as still-live (not removed) | PASS | `error-code-reference.md` |
| 36-tool count preserved (no 36→43 bump) | PASS | No tool-count number changed in the catalog |
| Every new file registered in `feature_catalog.md` | PASS | Index entries for `189`, `069`, `070`, `162`, `241` |
| `validate.sh --strict` on this packet | PASS | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **sk-git detail is cross-referenced, not duplicated.** The `241` file points at the sk-git skill for the worktree convention rather than copying skill-owned mechanics, to avoid drift. Non-blocking.
2. **README / ENV_REFERENCE edits are out of scope.** Adding `SPECKIT_BACKEND_ONLY` to `mcp_server/ENV_REFERENCE.md` is owned by sibling `003-readme-cluster-update`; this packet only documents the variable's runtime behavior in the front-proxy catalog file.
3. **Section 188 was already unregistered in the index.** The pre-existing `188-routing-telemetry` file is not linked from `feature_catalog.md`; that gap predates this packet and is out of scope.
<!-- /ANCHOR:limitations -->
