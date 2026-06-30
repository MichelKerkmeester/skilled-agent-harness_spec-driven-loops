---
title: "Implementation Plan: Idempotent Writes and Global-Cache Upsert [template:level_2/plan.md]"
description: "Add a content fingerprint over the canonical description fields, a per-folder no-op write skip, a content-gated aggregate-cache write, and a targeted upsertDescriptionCacheEntry that replaces the broad ensureDescriptionCache rescan for the per-folder save path, all in folder-discovery.ts behind a default-OFF flag with a grandfather report mode, plus one vitest proving idempotency and the scoped upsert."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the skip, the gate, and the upsert split flag-gated, vitest green"
    next_safe_action: "Graduation follow-on, scoped migration then flip the flag on"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Idempotent Writes and Global-Cache Upsert

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, the spec-kit MCP server `lib/search` module |
| **Framework** | spec-kit description and aggregate-cache generators in `folder-discovery.ts` |
| **Storage** | Per-folder `description.json` files and the aggregate `descriptions.json` cache |
| **Testing** | One vitest proving the no-op skip, the real-delta write, the targeted upsert, and the flag-OFF grandfather path |

### Overview
This phase makes the description-side writes deterministic and scoped, implementing research ranks 5 and 8. It adds a content fingerprint over the canonical description fields so an unchanged folder preserves its prior `lastUpdated` and writes nothing, content-gates the aggregate-cache write so the `generated` stamp survives a no-op, and adds a targeted `upsertDescriptionCacheEntry` that replaces only the changed entry, so a per-folder save no longer triggers the whole-tree `ensureDescriptionCache` rescan. All four behaviors sit behind a single default-OFF flag with a grandfather report mode, because the existing `description.json` and `descriptions.json` files carry the wall-clock stamps the new gate rejects, so a hard cutover would mass-rewrite them. The graph side is untouched, research confirms it is already idempotent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, REQ-007 grandfather reporter deferred with rationale
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place determinism on existing write helpers plus a targeted upsert that replaces a broad rescan, all behind one default-OFF flag. No new module, no ranking change. The fingerprint and the skip mirror the graph-metadata no-op pattern research confirms already works on the graph side.

### Key Components
- **Description fingerprint**: a deterministic hash over the canonical fields `buildCanonicalDescriptionFields` already isolates (`folder-discovery.ts:202`), excluding the volatile `lastUpdated` stamp, used to decide whether a per-folder write is a real delta.
- **Per-folder no-op skip**: a guard in `savePerFolderDescription` (`folder-discovery.ts:962`) that compares the new fingerprint to the loaded prior fingerprint and, on a match, preserves the prior `lastUpdated` and writes nothing.
- **Aggregate-cache content gate**: a guard in `saveDescriptionCache` (`folder-discovery.ts:1041`) that preserves the `generated` stamp and member rows on no semantic delta and rewrites only when a member entry changed.
- **`upsertDescriptionCacheEntry`**: a new helper that loads the cache, replaces only the target folder entry, and writes only when that entry changed, replacing the whole-tree `ensureDescriptionCache` rescan (`folder-discovery.ts:1153`) for the per-folder save path.
- **Default-OFF flag plus grandfather report mode**: a single feature flag gating all four behaviors, with a report mode that reports the existing wall-clock-stamped files as would-rewrite without mutating them.

### Data Flow
A per-folder save derives the canonical fields, computes the fingerprint, and compares it to the prior `description.json` fingerprint. On a match with the flag ON, the save preserves `lastUpdated` and writes nothing, then routes the cache update through `upsertDescriptionCacheEntry`, which replaces only the target entry and writes the aggregate cache only on a real delta. On a real content change the per-folder file is written once with a refreshed `lastUpdated` and the single cache entry is upserted. A structural change like a delete or rename still routes through the full `generateFolderDescriptions` plus `ensureDescriptionCache` rebuild. With the flag OFF the legacy unconditional-write path runs unchanged and the grandfather report mode only reports.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `buildCanonicalDescriptionFields` (`folder-discovery.ts:202`) | Isolates the canonical description fields used to build the write payload | reuse to source the fingerprint input, exclude the volatile `lastUpdated` from the hashed set | the fingerprint is stable across two derivations of identical canonical content and changes when a canonical field changes |
| `generatePerFolderDescription` (`folder-discovery.ts:851`, stamps `lastUpdated: new Date().toISOString()` at `:897`) | Builds the per-folder description and stamps a wall-clock `lastUpdated` | leave the build, move the unconditional `lastUpdated` bump behind the no-op gate so an unchanged rerun preserves the prior stamp | grep shows the wall-clock stamp is now gated, a no-delta rerun preserves the prior `lastUpdated` |
| `savePerFolderDescription` (`folder-discovery.ts:962`) | Writes the per-folder `description.json` unconditionally | add a fingerprint-compare no-op skip behind the flag, preserve the prior `lastUpdated` and write nothing on a match | a no-delta rerun performs zero writes and an unchanged mtime, a real-delta rerun writes exactly once |
| `generateFolderDescriptions` (`folder-discovery.ts:674`, stamps `now` at `:675` and `generated: now` at `:749`) | Builds the whole aggregate cache stamping wall-clock `generated` and per-folder `lastUpdated` | leave intact for the structural-rebuild path, route the per-folder save away from it | the per-folder save path does not invoke this whole-tree builder, a structural change still does |
| `saveDescriptionCache` (`folder-discovery.ts:1041`) | Writes the aggregate `descriptions.json` unconditionally | add a content gate behind the flag, preserve `generated` and member rows on no semantic delta, write only on a real member delta | a no-delta aggregate save preserves byte-identical `generated` and rows, a single-folder change advances only that row and `generated` |
| `ensureDescriptionCache` (`folder-discovery.ts:1153`) | Regenerates the whole tree by scanning every base path, triggered as a side effect of a per-folder generate | reserve for structural changes, route the per-folder save through the new targeted upsert instead | the per-folder save path no longer triggers a whole-tree scan, unrelated folders are untouched |
| `upsertDescriptionCacheEntry` (new in `folder-discovery.ts`) | Does not exist | create the targeted upsert that replaces only the target entry and writes only on a real delta | a per-folder save touches only the target entry in the loaded cache and scans no other base path |
| Default-OFF feature flag and grandfather report mode | No flag, writes are unconditional today | gate all four behaviors behind one default-OFF flag, add a report mode that reports legacy wall-clock files as would-rewrite without mutating them | with the flag OFF the legacy path is byte-for-byte unchanged, the report mode reports a legacy fixture and does not modify it |

Required inventories:
- Same-class producers: `rg -n 'writeFileSync|new Date\(\)\.toISOString|lastUpdated|generated' .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`.
- Consumers of changed helpers: `rg -n 'savePerFolderDescription|saveDescriptionCache|ensureDescriptionCache|generatePerFolderDescription|generateFolderDescriptions' .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag ON no-delta, flag ON real-delta, flag ON aggregate no-delta, flag ON single-entry upsert, structural rebuild, canonical-save escape hatch, flag OFF legacy path, grandfather report mode.
- Algorithm invariant: with the flag ON a no-delta rerun writes nothing and preserves `lastUpdated` and `generated`, a real delta writes exactly once, the per-folder save routes through the targeted upsert and never the whole-tree rescan, a structural change still rebuilds, and with the flag OFF the legacy behavior and the existing files are untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `buildCanonicalDescriptionFields`, `savePerFolderDescription`, `saveDescriptionCache`, `ensureDescriptionCache`, `generatePerFolderDescription`, and `generateFolderDescriptions` exist at the cited lines in `folder-discovery.ts`
- [ ] Decide the canonical fields that enter the fingerprint and confirm `lastUpdated` and `generated` are excluded
- [ ] Register the single default-OFF feature flag in the existing feature-flag set and the env reference

### Phase 2: Core Implementation
- [ ] Add the deterministic content fingerprint over the canonical fields, excluding the volatile stamps
- [ ] Add the per-folder no-op skip in `savePerFolderDescription` behind the flag, preserving the prior `lastUpdated` on a match
- [ ] Add the aggregate-cache content gate in `saveDescriptionCache` behind the flag, preserving `generated` and rows on no semantic delta
- [ ] Add `upsertDescriptionCacheEntry` and route the per-folder save path through it, reserving the whole-tree rebuild for structural changes
- [ ] Add the grandfather report mode and preserve the canonical-save escape hatch that may still bump `lastUpdated`

### Phase 3: Verification
- [ ] A no-delta rerun with the flag ON writes nothing and preserves `lastUpdated` and `generated`
- [ ] A real content change with the flag ON writes exactly once and advances only the changed entry
- [ ] A per-folder save with the flag ON touches only the target entry and triggers no whole-tree rescan, while a structural change still rebuilds
- [ ] With the flag OFF the legacy unconditional write runs and the grandfather report mode reports a legacy fixture without mutating it
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The fingerprint is stable across identical canonical content and changes on a canonical-field change, and excludes `lastUpdated` and `generated` | `folder-discovery-idempotent.vitest.ts` |
| Integration | Flag ON no-delta writes nothing, real delta writes once, the upsert touches only the target entry, a structural change rebuilds, and flag OFF preserves the legacy path | `folder-discovery-idempotent.vitest.ts` over a temp fixture tree |
| Manual | Confirm the grandfather report mode reports the existing wall-clock-stamped files as would-rewrite without mutating them | report-mode run against a legacy fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `folder-discovery.ts` write helpers and `buildCanonicalDescriptionFields` | Internal | Green | The fix edits these seams in place and breaks if the signatures change first |
| The existing default-OFF feature-flag mechanism | Internal | Green | The grandfather rollout needs a recognized flag, absent it the gate cannot ship default-OFF |
| A scoped migration to rewrite the legacy wall-clock files onto the new contract | Internal | Yellow | The flag cannot graduate to default-ON until the migration lands, this phase ships default-OFF |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The no-op skip or the upsert false-fires and drops a legitimate write, or the gate flags valid files.
- **Procedure**: Set the feature flag OFF, which restores the legacy unconditional-write path with no file revert needed, then remove the helper additions if the gate stays disabled.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Default-OFF flag registered and confirmed off in the shipped default
- [ ] Grandfather report mode proven to report without mutating a legacy fixture
- [ ] No-delta and real-delta write proofs staged

### Rollback Procedure
1. Set the feature flag OFF to restore the legacy unconditional-write path
2. Confirm the per-folder save reverts to the prior behavior with no file revert needed
3. If the gate stays disabled, remove the fingerprint, skip, upsert, and report-mode additions
4. Re-run the description generator to confirm it returns to its shipped behavior

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change gates write behavior behind a default-OFF flag and adds no data migration, the legacy files are untouched until a separate scoped migration runs
<!-- /ANCHOR:enhanced-rollback -->

---
