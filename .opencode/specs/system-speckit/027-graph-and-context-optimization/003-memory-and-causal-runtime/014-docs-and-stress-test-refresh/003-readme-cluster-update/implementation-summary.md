---
title: "Implementation Summary: README cluster update [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary]"
description: "Shipped summary for the README cluster refresh: SPECKIT_BACKEND_ONLY documented, schema v28->v30 + .needs-rebuild narrative, MCP front-proxy recycle + E429/-32001/-32002 error codes, sk-git worktree cross-ref, footer bump, mcp_server README deep-reference parity. Docs-only; 36-tool count preserved."
trigger_phrases:
  - "readme cluster update summary"
  - "003 readme cluster update status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped README cluster refresh; validate.sh --strict Errors: 0"
    next_safe_action: "None binding; sibling 004 stress-test durability domain"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-readme-cluster-update |
| **Status** | Shipped — README cluster refreshed to the deployed runtime (docs-only); `validate.sh --strict` Errors: 0. |
| **Level** | 2 |
| **Created** | 2026-06-02 |
| **Source Roadmap** | 013 memory-index-scan roadmap (phases 001-005) + sk-git worktree convention |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A documentation-only refresh of the system-spec-kit README cluster so operator-facing docs match the deployed runtime. Three artifact files were edited; no source, schema, or behavior changed.

### `.opencode/skills/system-spec-kit/README.md`
- **`SPECKIT_BACKEND_ONLY` env row** added to the Environment Variables table (near the existing env rows around L625), describing the backend-only stdio gate read at `context-server.ts:2126` (`process.env.SPECKIT_BACKEND_ONLY === '1'`).
- **Schema v28->v30 + `.needs-rebuild` sentinel subsection** added under §3.2 Memory System: mig 28 active-row partial unique index `idx_memory_logical_key_active_unique`; mig 29 checkpoint-v2 metadata cols `snapshot_format`/`snapshot_path`; mig 30 `post_insert_enrichment_*` marker cols + `idx_post_insert_enrichment_incomplete`; plus the post-restore `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME`, `repairNeedsRebuildSentinel()`).
- **MCP front-proxy subsection** added: in-place daemon recycle / RSS-recycle transparency via `bridgeStdioThroughSessionProxy` (`mk-spec-memory-launcher.cjs`) and the typed error contract in `launcher-session-proxy.cjs`.
- **Error-code note** added: `E429` (legacy index rate-limit, replaced by the coalescing `coalesced:true` envelope); `-32001` (LIVE launcher retryable recycle error — `RETRYABLE_RECYCLE_ERROR`, `launcher-session-proxy.cjs:18-22` — explicitly NOT removed; only the index vector-drain outage path stopped surfacing its own `-32001` class); `-32002` (non-retryable protocol fail-closed — `PROTOCOL_MISMATCH_ERROR`, terminal CLOSED).
- **sk-git cross-reference** to the `wt/{NNNN}-{name}` branch + `.worktrees/{NNNN}-{name}` directory convention (4-digit zero-padded global `max+1` counter).
- **Footer bump**: Documentation version, Skill version, "Last updated" 2026-06-02, and the "Current docs cover" line updated to include the new behaviors.

### `.opencode/skills/system-spec-kit/mcp_server/README.md`
- Deep-reference parity rows/subsection added for checkpoint-v2 (`createCheckpoint`/`restoreCheckpoint`/`restoreCheckpointV2`, `VACUUM ... INTO`, `.needs-rebuild` sentinel), the `post_insert_enrichment_*` enrichment marker columns, the front-proxy recycle contract, and schema v30. The `36`-tool API reference is preserved.

### `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `SPECKIT_BACKEND_ONLY` row added to §2 Infrastructure, sourced to `context-server.ts`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored by claude-opus-4-8. Every behavioral claim was traced to a deployed source anchor before writing: `SCHEMA_VERSION = 30` and migrations 28-30 in `lib/search/vector-index-schema.ts`; the serverInfo version at `context-server.ts:1014` (`'1.7.2'` was the pre-fix value captured as historical evidence at authoring time; the current deployed value is `'1.8.0'`, matching `package.json:3`) and the `SPECKIT_BACKEND_ONLY` read at `:2126`; the checkpoint symbols and `.needs-rebuild` sentinel in `lib/storage/checkpoints.ts`; the `index` health-block fields in `handlers/memory-crud-health.ts`; the `-32001`/`-32002` error objects in `.opencode/bin/lib/launcher-session-proxy.cjs` and `bridgeStdioThroughSessionProxy` in `mk-spec-memory-launcher.cjs`; the `wt/{NNNN}-{name}` convention in `sk-git/SKILL.md`. The `36`-tool count was confirmed from `TOOL_DEFINITIONS` in `tool-schemas.ts` (exactly 36 entries) and left unchanged. Edits were additive and surgical in the existing document format.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why | ADR |
|----------|-----|-----|
| Documentation-only scope (no runtime change) | Shipped behavior already exists; only docs were stale | ADR-001 |
| Preserve the verified 36-tool mk-spec-memory count | `TOOL_DEFINITIONS` is 36; `layer-definitions.ts` 43 counts a different surface | ADR-002 |
| Document -32001 as the LIVE retryable recycle error (not removed) | The launcher still freezes `RETRYABLE_RECYCLE_ERROR`; only the index outage path narrowed | ADR-003 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source anchors verified against deployed code | DONE — schema v30/migs 28-30, context-server:1014/:2126, checkpoints symbols + `.needs-rebuild`, health block, front-proxy error codes, sk-git convention |
| `36`-tool count confirmed and preserved | DONE — `TOOL_DEFINITIONS` = 36 entries; number unchanged |
| `SPECKIT_BACKEND_ONLY` documented (README + ENV_REFERENCE) | DONE — README env row + ENV_REFERENCE §2 row, both → `context-server.ts:2126` |
| Schema v28->v30 + `.needs-rebuild` subsection | DONE — names migs 28/29/30 + sentinel |
| Front-proxy subsection + error-code note (E429/-32001/-32002) | DONE — `-32001` stated precisely as LIVE retryable recycle |
| `mcp_server/README.md` deep-reference parity | DONE — checkpoint-v2, enrichment marker, front-proxy, schema v30 |
| Footer bump (version + 2026-06-02 + cover line) | DONE |
| sk-git `wt/{NNNN}-{name}` cross-ref | DONE |
| `validate.sh <folder> --strict` | PASSED — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Docs-only packet** — no runtime, schema, or behavior change; the edits are markdown prose plus one ENV table row.
2. **Accuracy depends on the cited anchors** — if the runtime changes again (e.g. a v31 migration or a new front-proxy error code), the prose must be re-verified against source. Inline file:line citations make the re-verification mechanical.
3. **Sibling dependency** — the README cluster links/summarizes the feature catalog owned by sibling `002-feature-catalog-update`; the parent Phase Handoff Criteria require those feature files to exist before the README references them.
<!-- /ANCHOR:limitations -->
