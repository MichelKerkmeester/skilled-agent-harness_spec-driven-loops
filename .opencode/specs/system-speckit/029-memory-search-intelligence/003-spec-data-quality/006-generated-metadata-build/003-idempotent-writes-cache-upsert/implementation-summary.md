---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Shipped the description-side idempotent writes and the targeted global-cache upsert behind the default-OFF SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES flag. A content fingerprint excluding the volatile lastUpdated drives a per-folder no-op skip and an aggregate-cache content gate, a new upsertDescriptionCacheEntry replaces only the target row, and the canonical-save escape hatch still bumps lastUpdated. The currently-failing graph idempotency test was reconciled to the no-op contract."
trigger_phrases:
  - "idempotent description writes"
  - "global cache upsert"
  - "content hash gated description"
  - "ensureDescriptionCache over-reach"
  - "description json no-op skip"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/003-idempotent-writes-cache-upsert"
    last_updated_at: "2026-07-06T18:49:37.666Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the skip, gate, and upsert behind the flag, reconciled the graph test"
    next_safe_action: "Graduation follow-on, route callers through upsert under a scoped migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-idempotent-writes-cache-upsert |
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The description-side write determinism and the targeted global-cache upsert shipped behind one default-OFF feature flag, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`. With the flag off the legacy unconditional-write behavior is byte-for-byte unchanged, so existing wall-clock-stamped files are never mass-rewritten.

### Content-hash gated description and global cache writes (rec 5)

A deterministic content fingerprint hashes the per-folder write payload with the volatile `lastUpdated` stamp removed, over a stable key-sorted serialization, so two derivations of identical content hash equal even when their timestamps differ. `savePerFolderDescription` now compares the incoming fingerprint against the on-disk file and, when the flag is on and the content matches, returns without writing so the prior `lastUpdated` survives and the working tree stays clean. `saveDescriptionCache` gained an opt-in content gate that fingerprints the member rows ignoring the top-level `generated` stamp and skips the write when only that stamp would move. `ensureDescriptionCache` routes its rebuild save through that gate so a content-identical full rebuild no longer restamps the cache.

### Targeted global-cache upsert split from rebuild (rec 8)

`upsertDescriptionCacheEntry` is a new targeted helper that loads the aggregate `descriptions.json`, replaces or inserts only the one folder row whose `specFolder` matches, and writes only when that row actually changed, comparing the row ignoring its volatile `lastUpdated`. Sibling rows are carried through byte-identical and the rows are re-sorted to match the rebuild layout, so a scoped per-folder update never pulls unrelated folders into the write and never scans another base path. A missing cache bootstraps a single-entry file rather than rescanning the tree. The whole-tree `generateFolderDescriptions` plus `ensureDescriptionCache` rebuild is left intact and reserved for structural changes such as a folder delete or rename, which a single-entry upsert cannot express.

### Default-OFF flag and canonical-save escape hatch

Both behaviors sit behind `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, env-only and default-OFF, mirroring the sibling `SPECKIT_IDENTITY_MERGE_SAFETY` pattern so an unset environment can never flip it on. The flag itself is the rollout guard, with it off the legacy files are untouched and cannot mass-fail. `savePerFolderDescription` takes a `{ canonicalSave: true }` option that bypasses the no-op skip, so a deliberate canonical save still advances `lastUpdated` on unchanged content.

### Reconciled failing test

`workflow-canonical-save-metadata.vitest.ts` carried a test asserting the pre-idempotency contract, that a second `refreshGraphMetadata` on unchanged content advances `derived.last_save_at`. The already-shipped graph idempotency skip suppresses that bump, so the test was red on the baseline. It was reconciled to the idempotent contract, the no-op re-derive preserves the stamp, and a real content change still advances it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Add the default-OFF `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` flag and its reader, export both |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Add the content fingerprints, the per-folder no-op skip with the canonical-save escape hatch, the aggregate-cache content gate, and `upsertDescriptionCacheEntry`, all behind the flag |
| `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts` | Create | Vitest proving the no-op skip, the real-delta write, the escape hatch, the targeted upsert, the no-op upsert, the insert, and the flag-OFF legacy path |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts` | Modify | Reconcile the graph idempotency test to the no-op-preserves contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The write-helper seams were confirmed at the cited lines, then the fingerprint helpers were added next to the existing payload builder, then the per-folder skip and the aggregate gate, then the targeted upsert. The flag was registered in the existing capability-flag set with rich inline documentation matching its siblings. The vitest exercises both flag states over temp fixtures. The reconciled graph test and the new vitest were run from `mcp_server` against its vitest config, and the existing folder-discovery, description, workflow-memory-tracking, and graph-metadata suites were re-run to confirm no regression.

### Deviations from the plan

- **Test path.** The spec named the new test at `mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts`, but the `mcp_server` vitest config includes only `mcp_server/tests/**` and the sibling `scripts/tests/**` roots, not a `mcp_server/scripts/tests/` path. The test was placed at `mcp_server/tests/folder-discovery-idempotent.vitest.ts`, co-located with the existing `folder-discovery.vitest.ts`, so the config actually runs it.
- **Grandfather report mode (REQ-007) deferred.** A dedicated would-rewrite reporter was not built. The default-OFF flag already guarantees the legacy wall-clock files are neither mutated nor mass-failed, which is the rollout-safety outcome REQ-007 protects. A standalone report tool that lists legacy files as would-rewrite is folded into the graduation follow-on alongside the scoped migration. This is a documented P1 deferral, not a blocker.
- **Live-caller routing deferred to graduation.** `upsertDescriptionCacheEntry` is added, tested, and reserved against the full rebuild, but live callers that currently rebuild are not yet rewired to prefer it. Routing them is part of graduating the flag and is gated behind it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fingerprint the payload with only `lastUpdated` stripped, not the canonical subset alone | A memory-tracking save changes non-canonical rows like `memorySequence`, hashing the full payload minus the volatile stamp keeps those real deltas writing while still skipping a pure timestamp churn |
| Ship behind one default-OFF flag | The existing files carry the wall-clock stamps the gate rejects, so a hard cutover would mass-rewrite them, per research theme 7 |
| Add the targeted upsert and reserve the full rebuild | A scoped per-folder update must not scan unrelated base paths, while a delete or rename still needs the whole-tree rebuild |
| Compare cache rows ignoring `lastUpdated` in the upsert | A row whose content matches but whose stamp moved is not a real delta, so the upsert writes only on a genuine change |
| Leave the graph side untouched and reconcile its test | Research confirms graph metadata is already idempotent, so the only graph-side work here is fixing a test that encoded the old non-idempotent contract |
| Keep the canonical-save escape hatch | A deliberate canonical save must still bump `lastUpdated` even on unchanged content |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run from `.opencode/skills/system-spec-kit/mcp_server` against its vitest config.

| Check | Result |
|-------|--------|
| `npx vitest run tests/folder-discovery-idempotent.vitest.ts` | PASS, 9 tests covering the no-op skip, real-delta write, escape hatch, targeted upsert, no-op upsert, insert, bootstrap, aggregate gate, and flag-OFF legacy path |
| `npx vitest run ../scripts/tests/workflow-canonical-save-metadata.vitest.ts` | PASS, reconciled graph idempotency test plus the existing canonical-save coverage, 5 passed 1 skipped |
| `npx vitest run tests/folder-discovery.vitest.ts tests/folder-discovery-integration.vitest.ts tests/workflow-memory-tracking.vitest.ts tests/description` | PASS, no regression in the existing write-helper, integration, memory-tracking, and description suites |
| `npx vitest run tests/graph-metadata-integration.vitest.ts tests/p0-c-graph-metadata-laundering.vitest.ts ../scripts/tests/graph-metadata-refresh.vitest.ts` | PASS, graph idempotency unaffected |
| `npm run typecheck` | PASS, clean tsc |
| `bash scripts/spec/validate.sh <035> --strict` | Exit 0, see DOCS gate |

### Known pre-existing failure, out of scope

`tests/env-reference-drift.vitest.ts` fails on two undocumented env tokens, `SPECKIT_ENTITY_CONFIG_PATH` in `entity-extractor.ts` and `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` at `folder-discovery.ts:399`. Both predate this phase, `entity-extractor.ts` has no uncommitted change and the z-exclusion read sits outside this phase diff. The new flag is read indirectly through a const and is not detected by the drift regex, so it adds no new token. Documenting those two unrelated flags belongs to their owning phases under SCOPE LOCK.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Default-OFF until migration.** The gate ships behind a default-OFF flag, so the idempotency benefit is inert in production until a separate scoped migration restamps the legacy wall-clock files and graduates the flag.
2. **Live-caller routing pending.** The targeted upsert exists and is tested but is not yet wired into live callers that currently rebuild, that routing is part of graduation.
3. **No dedicated grandfather reporter.** The default-OFF flag is the rollout guard, a standalone would-rewrite report tool is deferred to the graduation follow-on.
4. **Graph side excluded.** This phase fixes only the description-side writes and reconciles one graph test, the graph-metadata fingerprint and the broader identity-resolver and validator work are separate phases.
<!-- /ANCHOR:limitations -->

---
