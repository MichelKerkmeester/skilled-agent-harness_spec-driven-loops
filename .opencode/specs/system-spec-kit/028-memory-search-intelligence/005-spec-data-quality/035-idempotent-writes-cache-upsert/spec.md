---
title: "Feature Specification: Idempotent Writes and Global-Cache Upsert [template:level_2/spec.md]"
description: "The per-folder description generator stamps lastUpdated with new Date and the savePerFolderDescription helper writes unconditionally, so a rerun on unchanged content dirties the folder. Running that generator also triggers ensureDescriptionCache to regenerate the whole tree by scanning every base path, pulling unrelated sessions folders into a scoped commit. Two convergent fixes are specified: content-hash gated description and global cache writes, and a targeted global-cache upsert split from full rebuild, both behind a default-OFF flag so the existing wall-clock-stamped files do not mass-fail."
trigger_phrases:
  - "idempotent description writes"
  - "global cache upsert"
  - "content hash gated description"
  - "ensureDescriptionCache over-reach"
  - "description json no-op skip"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded PLANNED spec from research recs 5 and 8, both flag-gated"
    next_safe_action: "Run speckit plan to decompose the fingerprint helper and the upsert split"
    blockers: []
    key_files:
      - "../031-generated-json-quality-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: "phase-035-idempotent-writes-cache-upsert"
    completion_pct: 0
    open_questions:
      - "Which canonical fields enter the description fingerprint versus the volatile lastUpdated and generated stamps"
    answered_questions:
      - "Whether the fix ships behind a flag, it does, default-OFF with a grandfather report mode for the existing wall-clock files"
---
# Feature Specification: Idempotent Writes and Global-Cache Upsert

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | PLANNED |
| **Created** | 2026-06-22 |
| **Branch** | `035-idempotent-writes-cache-upsert` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit description generators write `description.json` and the aggregate `descriptions.json` cache non-idempotently, so a rerun on unchanged content dirties files and buries real diffs under wall-clock churn. This is research safety class B, non-idempotent writes, and it surfaces as the same symptom as the broad-walk class, unscoped cross-session commit churn.

Two distinct seams in `folder-discovery.ts` produce the churn. First, `generatePerFolderDescription` stamps `lastUpdated: new Date().toISOString()` (`folder-discovery.ts:897`) and `savePerFolderDescription` writes the payload unconditionally (`folder-discovery.ts:962`), so a rerun that derives identical content still rewrites the file with a fresh timestamp. The aggregate path repeats the pattern, `generateFolderDescriptions` stamps `const now = new Date().toISOString()` (`folder-discovery.ts:675`) into `generated: now` (`folder-discovery.ts:749`) and per-folder `lastUpdated` rows, and `saveDescriptionCache` writes unconditionally (`folder-discovery.ts:1041`). This is research rank 5, confirmed against live code in research section 6 as description-side non-determinism, graph metadata is already idempotent and out of scope here.

Second, running the per-folder generator triggers `ensureDescriptionCache` (`folder-discovery.ts:1153`) to regenerate the entire tree by scanning every base path, so a scoped per-folder save pulls every other session's folders into the commit. This is research rank 8, a broad rebuild used where a targeted upsert belongs. The fix is to replace only the target entry and write only when it changed, reserving the full rebuild for structural changes like delete or rename.

Both fixes carry a rollout hazard. The existing `description.json` and `descriptions.json` files already carry wall-clock `lastUpdated` and `generated` stamps that a content-hash gate would treat as drift, so a hard cutover would mass-rewrite or mass-fail them. Research cross-cutting theme 7 requires every behavioral fix to ship behind a default-OFF flag or a grandfather report mode and graduate only after a scoped migration. This spec adopts that constraint for both recommendations.

### Purpose
Make the description-side writes deterministic and scoped. Add a content fingerprint over the canonical description fields so an unchanged folder preserves its prior timestamp and skips its write, add a targeted `upsertDescriptionCacheEntry` that replaces only the changed entry and writes only on a real delta, and reserve full-tree rebuild for structural changes. Ship both behind a single default-OFF flag with a grandfather report mode so the existing wall-clock-stamped files are reported, not rewritten, until a scoped migration graduates the gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic content fingerprint over the canonical description fields (the fields `buildCanonicalDescriptionFields` already isolates at `folder-discovery.ts:202`), excluding the volatile `lastUpdated` stamp, used to decide whether a per-folder write is a real delta.
- A no-op skip in `savePerFolderDescription` (`folder-discovery.ts:962`) so an unchanged folder preserves its prior `lastUpdated` and writes nothing, mirroring the graph-metadata no-op skip pattern the research confirms already exists for the graph side.
- A content-hash gate on the aggregate cache write in `saveDescriptionCache` (`folder-discovery.ts:1041`) so the `generated` stamp and per-folder rows are preserved on no semantic delta and the cache file is rewritten only when a member entry changed.
- A targeted `upsertDescriptionCacheEntry` helper that replaces only the target folder entry in the loaded cache and writes only when that entry changed, so a scoped per-folder save no longer triggers a whole-tree rescan.
- A rebuild split, full `generateFolderDescriptions` plus `ensureDescriptionCache` rescan reserved for structural changes like a folder delete or rename, with the per-folder save path routed through the upsert instead.
- A single default-OFF feature flag gating all of the above, plus a grandfather report mode that reports the existing wall-clock-stamped files as would-rewrite without mutating them, so the legacy files do not mass-fail before a scoped migration.
- A preserved escape hatch so a canonical-save event is still allowed to bump `lastUpdated` intentionally, per research rank 5.

### Out of Scope
- Any change to `graph-metadata.json` write determinism. Research section 6 confirms graph metadata is already idempotent via `graphMetadataEqualIgnoringVolatile` and the no-op skip, so the graph fingerprint is rank 13 hardening, not this phase.
- The broad-walk backfill boundary (research rank 1) and the shared identity resolver (research rank 2). They are separate phases and are not required for the description-side write determinism specified here.
- The first-class generated-metadata validator (research rank 9). This phase makes the writes idempotent, it does not add the strict-mode validator rule.
- Graduating the default-OFF flag to default-ON. The scoped migration that rewrites the legacy wall-clock files onto the new contract is a follow-on, gated on this phase landing first.
- Splitting access and freshness telemetry out of the generated JSON (research rank 14). That is a larger refactor deferred to the backlog.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Add the description content fingerprint, the per-folder no-op skip, the aggregate-cache content gate, and the `upsertDescriptionCacheEntry` helper with the rebuild split, all behind the default-OFF flag with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts` | Create | Vitest proving a no-delta rerun writes nothing, a real delta writes once, the upsert touches only the target entry, and the flag-OFF grandfather path reports without mutating |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Rec |
|----|-------------|---------------------|-----|
| REQ-001 | WHEN the flag is ON and a per-folder description is re-derived with no change to the canonical fields, the generator SHALL preserve the prior `lastUpdated` and write nothing | A test re-runs `savePerFolderDescription` on identical canonical content and asserts the file mtime and the `lastUpdated` value are both unchanged and no write occurred | 5 |
| REQ-002 | WHEN the flag is ON and a per-folder description changes a canonical field, the generator SHALL write exactly once with a refreshed `lastUpdated` | A test mutates one canonical field, re-runs the save, and asserts the file is rewritten once and `lastUpdated` advanced | 5 |
| REQ-003 | WHEN the flag is ON, the aggregate `descriptions.json` write SHALL preserve the `generated` stamp and member rows on no semantic delta and rewrite only when a member entry changed | A test re-runs the aggregate save on an unchanged tree and asserts `generated` and every row are byte-identical, then changes one folder and asserts only that row and `generated` advanced | 5 |
| REQ-004 | The per-folder save path SHALL route through a targeted `upsertDescriptionCacheEntry` that replaces only the target entry, never a whole-tree `ensureDescriptionCache` rescan | A test saving one folder asserts unrelated folders entries in the loaded cache are untouched and no other base path was scanned | 8 |
| REQ-005 | A full-tree `generateFolderDescriptions` plus `ensureDescriptionCache` rebuild SHALL run only for structural changes like a folder delete or rename, not for a per-folder content save | A test asserts the per-folder save path does not invoke the whole-tree scan and a structural-change path still does | 8 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Rec |
|----|-------------|---------------------|-----|
| REQ-006 | All of REQ-001 through REQ-005 SHALL be gated behind a single default-OFF feature flag, so with the flag OFF the current unconditional-write behavior is unchanged | A test with the flag OFF asserts the legacy unconditional write path runs and no new skip or upsert branch is taken | 5, 8 |
| REQ-007 | A grandfather report mode SHALL report the existing wall-clock-stamped files as would-rewrite without mutating them, so the legacy files do not mass-fail before a scoped migration | A test points the report mode at a fixture carrying a legacy wall-clock stamp and asserts it is reported as would-rewrite and the fixture is not modified | 5, 8 |
| REQ-008 | A canonical-save event SHALL remain able to bump `lastUpdated` intentionally even when the canonical content is unchanged | A test issues a canonical-save with the no-op gate active and asserts `lastUpdated` is allowed to advance through the canonical escape hatch | 5 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag ON, two consecutive description saves on unchanged content produce zero file writes and an unchanged `lastUpdated`, proving description-side write idempotency (rec 5).
- **SC-002**: With the flag ON, a per-folder save mutates only the target entry in `descriptions.json` and triggers no whole-tree rescan, proving the targeted upsert replaces the broad rebuild for the content-save path (rec 8).
- **SC-003**: A full rebuild still runs for a structural delete or rename, proving the split reserves the expensive rescan for the case that needs it (rec 8).
- **SC-004**: With the flag OFF, the legacy unconditional-write behavior is byte-for-byte preserved and the grandfather report mode reports the existing wall-clock files without rewriting them, proving the rollout does not mass-fail existing files (recs 5 and 8).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hard content-hash cutover mass-rewrites the existing wall-clock-stamped `description.json` and `descriptions.json` files | High | Ship behind a default-OFF flag with a grandfather report mode, graduate only after a scoped migration, per research theme 7 |
| Risk | The fingerprint includes a volatile field and never detects a no-op, defeating the skip | Med | Fingerprint only the canonical fields `buildCanonicalDescriptionFields` isolates, exclude `lastUpdated` and the `generated` stamp explicitly, assert the exclusion in a test |
| Risk | The upsert split misses a structural change and leaves the cache stale after a delete or rename | Med | Reserve the full rebuild for the structural-change path and assert in a test that delete and rename still trigger it |
| Dependency | `folder-discovery.ts` write helpers and the canonical-field builder | The fix edits these seams in place, so it breaks if the helper signatures change first | Confirm `buildCanonicalDescriptionFields`, `savePerFolderDescription`, `saveDescriptionCache`, and `ensureDescriptionCache` exist at the cited lines before editing |
| Dependency | The feature-flag mechanism the server already uses for default-OFF gates | The grandfather rollout needs a flag the env-reference table recognizes | Register the flag in the existing default-OFF feature-flag set and document it in the env reference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The targeted upsert reads and writes one entry of `descriptions.json` for a per-folder save, so a scoped save no longer pays the full-tree scan cost it pays today.

### Reliability
- **NFR-R01**: With the flag ON and fixed inputs, the description and aggregate-cache writes are deterministic, so a rerun on unchanged content is a guaranteed no-op rather than a timestamp-only diff.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder with no prior `description.json`: the first save writes once and stamps `lastUpdated`, the no-op skip applies only to a subsequent unchanged rerun.
- A `descriptions.json` cache missing the target entry: the upsert inserts the entry and writes once rather than failing or rescanning the whole tree.

### Error Scenarios
- A legacy file carrying a wall-clock stamp the new gate would flag: with the flag OFF the grandfather report mode reports it as would-rewrite and leaves it untouched, with the flag ON only a scoped migration rewrites it.
- A canonical-save on unchanged content: the canonical escape hatch lets `lastUpdated` advance intentionally, so the no-op skip does not swallow a deliberate canonical bump.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One source file edited in place plus one new vitest, four behavior changes (per-folder skip, aggregate gate, targeted upsert, rebuild split) all flag-gated |
| Risk | 9/25 | No ranking or retrieval change, risk is the rollout against legacy wall-clock files and the fingerprint field selection |
| Research | 3/20 | Seams verified to file:line in research section 4 ranks 5 and 8 and re-confirmed in section 6 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which canonical fields enter the description fingerprint, given that `buildCanonicalDescriptionFields` already isolates the canonical set and the volatile `lastUpdated` and `generated` stamps must be excluded.
- Whether the grandfather report mode and the default-OFF flag share one env switch or split into a report switch and an enforce switch.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Class B fix, non-idempotent description-side writes. The verdict is GO-on-cost and buildable-now: it touches the description write helpers in one file, not ranking or retrieval, and the seams are verified to file:line in research ranks 5 and 8 and re-confirmed in section 6 against live code. The graph side is explicitly out of scope because research confirms it is already idempotent. Both behavioral fixes ship behind a single default-OFF flag with a grandfather report mode, because the existing `description.json` and `descriptions.json` files carry the very wall-clock stamps the content-hash gate rejects, so a hard cutover would mass-rewrite them. The flag graduates to default-ON only after a scoped migration, which is a follow-on outside this phase.
<!-- /ANCHOR:verdict -->
