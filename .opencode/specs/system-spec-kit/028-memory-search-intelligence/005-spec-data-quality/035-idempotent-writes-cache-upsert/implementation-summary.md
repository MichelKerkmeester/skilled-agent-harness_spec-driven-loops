---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will make the description-side writes idempotent and scoped, a content fingerprint with a per-folder no-op skip, a content-gated aggregate-cache write, and a targeted upsertDescriptionCacheEntry that replaces the whole-tree rescan for the per-folder save path, all behind a default-OFF flag with a grandfather report mode. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the PLANNED scaffold for recs 5 and 8"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 0
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
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Content-hash gated description and global cache writes (rec 5)

The phase will add a deterministic content fingerprint over the canonical description fields, sourced from the set `buildCanonicalDescriptionFields` already isolates, excluding the volatile `lastUpdated` stamp. Today `generatePerFolderDescription` stamps `lastUpdated` with `new Date().toISOString()` and `savePerFolderDescription` writes unconditionally, so a rerun on unchanged content dirties the file with a fresh timestamp. The new fingerprint lets `savePerFolderDescription` skip the write and preserve the prior `lastUpdated` on a match, and lets `saveDescriptionCache` preserve the aggregate `generated` stamp and member rows on no semantic delta. A canonical-save event keeps a preserved escape hatch that may still bump `lastUpdated` intentionally.

### Targeted global-cache upsert split from rebuild (rec 8)

The phase will add `upsertDescriptionCacheEntry`, a targeted helper that replaces only the target folder entry in the loaded `descriptions.json` cache and writes only when that entry changed. Today running the per-folder generator triggers `ensureDescriptionCache` to regenerate the whole tree by scanning every base path, so a scoped per-folder save pulls every other session folders into the commit. The new upsert routes the per-folder save path away from the whole-tree rescan, and the full `generateFolderDescriptions` plus `ensureDescriptionCache` rebuild is reserved for structural changes like a folder delete or rename.

### Default-OFF flag and grandfather report mode

Both fixes will ship behind a single default-OFF feature flag, because the existing `description.json` and `descriptions.json` files already carry the wall-clock `lastUpdated` and `generated` stamps the content-hash gate rejects, so a hard cutover would mass-rewrite them. A grandfather report mode will report the existing wall-clock-stamped files as would-rewrite without mutating them, so the legacy files do not mass-fail. The flag graduates to default-ON only after a separate scoped migration, which is a follow-on outside this phase.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Add the content fingerprint, the per-folder no-op skip, the aggregate-cache content gate, and `upsertDescriptionCacheEntry` with the rebuild split, all behind the default-OFF flag with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts` | Planned create | Vitest proving a no-delta rerun writes nothing, a real delta writes once, the upsert touches only the target entry, and the flag-OFF grandfather path reports without mutating |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence confirms the write-helper seams at the cited lines, adds the canonical-field fingerprint, then the per-folder no-op skip, the aggregate-cache content gate, and the targeted upsert with the rebuild split, all behind the default-OFF flag with a grandfather report mode. The vitest proving the no-delta no-op, the single real-delta write, the target-only upsert, the structural rebuild, and the flag-OFF legacy path lands with the code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fingerprint only the canonical fields, exclude `lastUpdated` and `generated` | A fingerprint that included a volatile stamp would never detect a no-op and would defeat the skip |
| Ship both fixes behind one default-OFF flag with a grandfather report mode | The existing files carry the wall-clock stamps the gate rejects, so a hard cutover would mass-rewrite them, per research theme 7 |
| Route the per-folder save through a targeted upsert, not the whole-tree rescan | `ensureDescriptionCache` rescans every base path, so a scoped save pulls unrelated sessions folders into the commit |
| Reserve the full rebuild for structural changes | A delete or rename needs the whole-tree rebuild, a content save does not |
| Leave the graph side untouched | Research confirms graph metadata is already idempotent via the volatile-ignoring compare, so the graph fingerprint is hardening, not this phase |
| Preserve the canonical-save escape hatch | A deliberate canonical-save must still be able to bump `lastUpdated` even on unchanged content |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned test command is `node .opencode/skills/system-spec-kit/mcp_server/scripts/tests/run-vitest.mjs folder-discovery-idempotent` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A no-delta rerun with the flag ON writes nothing and preserves `lastUpdated` and `generated` | PLANNED, not yet run |
| A real content change with the flag ON writes exactly once and advances only the changed entry | PLANNED, not yet run |
| A per-folder save with the flag ON touches only the target entry and triggers no whole-tree rescan | PLANNED, not yet run |
| A structural change still routes through the full rebuild | PLANNED, not yet run |
| With the flag OFF the legacy unconditional write runs and the grandfather report mode reports a legacy fixture without mutating it | PLANNED, not yet run |
| The canonical-save escape hatch still bumps `lastUpdated` intentionally | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Default-OFF until migration.** The gate ships behind a default-OFF flag, so the idempotency benefit is inert until a separate scoped migration rewrites the legacy wall-clock files and graduates the flag.
3. **Fingerprint field selection open.** Which canonical fields enter the fingerprint is unresolved until the canonical set is confirmed against `buildCanonicalDescriptionFields`.
4. **Graph side excluded.** This phase fixes only the description-side writes, the graph-metadata fingerprint and the broader identity-resolver and validator work are separate phases.
<!-- /ANCHOR:limitations -->

---
