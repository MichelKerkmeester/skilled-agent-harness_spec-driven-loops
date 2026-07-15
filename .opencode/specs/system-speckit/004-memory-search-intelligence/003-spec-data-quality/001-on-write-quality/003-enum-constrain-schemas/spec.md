---
title: "Feature Specification: A3 Enum-Constrain JSON Metadata Schemas [template:level_2/spec.md]"
description: "The graph-metadata and description zod schemas type importance_tier status and content_type as free strings so any typo or drifted vocabulary persists unguarded while the command surface already machine-checks its mutation_class enum. This phase borrows that enum discipline to constrain the three JSON fields."
trigger_phrases:
  - "enum constrain schemas"
  - "importance_tier status content_type"
  - "graph-metadata zod schema"
  - "description schema enum"
  - "mutation_class enum discipline"
importance_tier: "normal"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/003-enum-constrain-schemas"
    last_updated_at: "2026-07-04T17:12:02.139Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author phase spec from research A3 row"
    next_safe_action: "Run generate-context.js and graph-metadata backfill"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the canonical content_type vocabulary at build time from the live doc-type axis"
    answered_questions: []
---
# Feature Specification: A3 Enum-Constrain JSON Metadata Schemas

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `003-enum-constrain-schemas` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-trigger-propagation-description/spec.md |
| **Successor** | ../004-schema-warn-to-error/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two zod metadata schemas type their controlled-vocabulary fields as free strings. In `graph-metadata-schema.ts:43-44` `importance_tier` and `status` are `z.string().min(1)` so any typo or drifted token validates clean, and `content_type` has no enum target on either schema. The description schema carries `type` as a bare `z.string().optional()` (`description-schema.ts:64`) with no `importance_tier` or `content_type` field at all. The command surface already proves the better rail. `route-validate.py` machine-checks a closed `mutation_class` enum (`VALID_MUTATING = {"read-only", "add-only", "mutates"}` at line 48, assertion E at line 13), and the same schema file already uses an in-house enum for `save_lineage` (`z.enum(SAVE_LINEAGE_VALUES)` at `graph-metadata-schema.ts:50`). The metadata enums are the unguarded gap.

### Purpose
Constrain `importance_tier`, `status`, and `content_type` to closed zod enums in both JSON schemas so a drifted or mistyped controlled value fails validation at parse time instead of persisting silently.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Constrain the free-string `importance_tier` and `status` fields in `graphMetadataDerivedSchema` to closed enums over the canonical vocabularies, applied through a flag-gated seam rather than a bare `z.enum` baked into the base schema. The base schema stays free-string and a strict schema variant or a flag-gated `superRefine` adds the enum only when `SPECKIT_SCHEMA_ENUM_ENFORCE` is on, so the default-off parse-on-load path keeps the current acceptance.
- Add a `content_type` enum to the schema surface that carries it, reusing the existing `SAVE_LINEAGE_VALUES` pattern for the constant-then-enum shape, behind the same flag seam.
- Add closed `importance_tier` and `content_type` enums to the description schema and tighten its `type` field, keeping `.passthrough()` so unrelated authored keys survive, behind the same flag seam.
- Guard all three out-of-enum producer paths into `graphMetadataSchema.parse` so a freshly derived file is in-enum before the strict variant can reject it: the `normalizeDerivedStatus` default-passthrough (line 180), the `deriveStatus` `'unknown'` branch (line 1041) and the unnormalized `deriveImportanceTier` raw-tier return (lines 1071-1079).
- Export each vocabulary as a named `as const` tuple next to its schema so the enum and any consumer share one source of truth.
- Emit a precise per-field zod issue message for an out-of-enum value, matching the existing `formatDescriptionSchemaIssues` shape.

### Out of Scope
- Promoting `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` from warn to error. That is A4 (phase `002` per the parent slate) and it consumes these enums. This phase lands the enums in warn so the legacy corpus never hard-breaks. See DEPENDENCIES.
- The four-beat WARN to BACKFILL to RE-MEASURE to ERROR migration of the count-to-zero corpus. A4 owns the flip. This phase only tightens the schema shape.
- Case-normalize auto-fix of a drifted value. That is the `enum.tier_status_ctype` safe-class fix on the shared engine (research section 4), owned by A1 and B1, not by this schema phase.
- Any retrieval-path or vector change. This is validation-only with zero re-index cost.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add the three `as const` vocabularies, add the flag-gated strict enum variant (or `superRefine`) for `importance_tier`, `status` and `content_type` so the base schema stays free-string when `SPECKIT_SCHEMA_ENUM_ENFORCE` is off |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Modify | Add `importance_tier` and `content_type` enums behind the same flag seam, tighten `type`, preserve `.passthrough()` and the per-field issue formatter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Guard all three out-of-enum producer paths so a derived file is in-enum: the `normalizeDerivedStatus` default-passthrough (line 180), the `deriveStatus` `'unknown'` branch (line 1041) and the unnormalized `deriveImportanceTier` raw-tier return (lines 1071-1079) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add the `isSchemaEnumEnforceEnabled()` resolver wrapping `isFeatureEnabled('SPECKIT_SCHEMA_ENUM_ENFORCE')`, mirroring the existing per-flag resolvers, so the strict path is reachable only when the flag is on |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `graphMetadataDerivedSchema.importance_tier` resolves to a closed enum over the canonical tier vocabulary `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` through the strict variant. WHEN `SPECKIT_SCHEMA_ENUM_ENFORCE` is on and a graph-metadata file carries any other tier value THE strict parse SHALL reject it, and WHEN the flag is off the parse stays free-string and accepts it. | A unit parse of the strict variant with `importance_tier: "high"` fails with an out-of-enum issue while the default-off parse-on-load path accepts it. A fixture with `important` passes either way |
| REQ-002 | `graphMetadataDerivedSchema.status` resolves to a closed enum over the derived-status vocabulary `complete`, `in_progress`, `planned` through the strict variant. WHEN the flag is on and a file carries a drifted status THE strict parse SHALL reject it, and WHEN the flag is off the parse stays free-string. | A unit parse of the strict variant with `status: "wip"` fails while the default-off path accepts it. The value `in_progress` passes either way. The set matches `normalizeDerivedStatus` outputs at `graph-metadata-parser.ts:170-181` |
| REQ-003 | `deriveStatus` and `deriveImportanceTier` only ever produce in-enum values so a freshly derived file always parses clean against the strict variant. All three out-of-enum producer paths are guarded, not only `normalizeDerivedStatus`. The `normalizeDerivedStatus` default branch (`return normalized`, line 180) maps unknown tokens to a defined in-enum fallback. The `deriveStatus` `'unknown'` return (line 1041) maps to an in-enum status fallback since `'unknown'` is outside `{complete, in_progress, planned}`. The `deriveImportanceTier` raw-tier return (lines 1071-1079) normalizes the frontmatter tier so a value like `high` cannot reach the enum unmapped. | A derive-then-parse round trip over fixture packets that exercise all three paths (malformed source status, an `unknown`-availability ranked doc, a frontmatter `importance_tier: "high"`) produces in-enum values and the strict parse passes |
| REQ-004 | Each vocabulary is exported as one named `as const` tuple feeding both the `z.enum(...)` strict variant and any TypeScript consumer, mirroring `SAVE_LINEAGE_VALUES`. | `grep` shows one declaration per vocabulary and the `z.enum` reads it by name, not an inline literal array |
| REQ-008 | The enum constraint is reachable only through a flag seam, never baked into the unconditionally parsed base schema. The base `graphMetadataDerivedSchema` stays free-string and a strict schema variant or a flag-gated `superRefine` adds the enum, selected by a new `isSchemaEnumEnforceEnabled()` resolver in `search-flags.ts` wrapping `isFeatureEnabled('SPECKIT_SCHEMA_ENUM_ENFORCE')`. WHEN the flag is off the parse-on-load path keeps the current acceptance so every existing or freshly saved file is byte-identical to baseline. | `grep` shows no bare `z.enum` on `importance_tier` or `status` in the base schema, the strict path runs only when the resolver returns true and a default-off parse of a legacy fixture is byte-identical to baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The description schema gains closed `importance_tier` and `content_type` enums and tightens `type` while keeping `.passthrough()` so non-enum authored keys are preserved. | A description fixture with extra authored keys still parses. One with an out-of-enum `importance_tier` fails |
| REQ-006 | `content_type` is constrained on the schema surface that carries it, with its vocabulary sourced from the live doc-type axis at build time, not invented. | The enum tuple cites its source vocabulary in a code comment that states the durable WHY without any artifact id, and a fixture with an unknown content_type fails |
| REQ-007 | An out-of-enum value yields a precise per-field message through the existing `formatDescriptionSchemaIssues` path rather than a raw zod dump. | A failing parse surfaces a message naming the offending field and its allowed set |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Under `SPECKIT_SCHEMA_ENUM_ENFORCE` both schemas reject an out-of-vocabulary `importance_tier`, `status`, or `content_type` at parse time while the default-off path stays free-string, verified by passing and failing fixtures across both flag states.
- **SC-002**: A derive-then-parse round trip over a real packet folder produces only in-enum values across all three producer paths with zero re-index and zero retrieval-path change.
- **SC-003**: The legacy corpus does not hard-break because the enum lands in the warn tier. The error flip is deferred to A4.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A4 promote DESCRIPTION_SHAPE and GRAPH_METADATA_SHAPE warn to error (parent phase `002`) | A4 consumes these enums to drive its count-to-zero flip. This phase is its structural prerequisite | Land enums in warn here, hand the error flip and the four-beat backfill to A4 |
| Dependency | The canonical content_type vocabulary | Inventing values would drift the very field the enum is meant to guard | Source the set from the live doc-type axis at build time per REQ-006, do not fabricate |
| Risk | A derived value that falls outside the new enum on any of the three producer paths | A freshly generated file could fail its own strict parse | REQ-003 guards all three paths (`normalizeDerivedStatus` default, `deriveStatus` `'unknown'`, `deriveImportanceTier` raw tier) and maps each to a defined in-enum fallback so the producer never emits an out-of-enum value |
| Risk | A bare `z.enum` baked into the base schema would parse unconditionally with no flag seam | The default-off byte-identical claim would be unachievable and parse-on-load would reject out-of-enum values regardless of tier | Use a dual free-string/strict schema or a flag-gated `superRefine` selected by `isSchemaEnumEnforceEnabled()`, never a bare swap (REQ-008) |
| Risk | Over-tightening the description `type` field breaks an existing authored doc | A legacy doc with a free type token could fail | Keep `.passthrough()`, land in warn, let the A4 backfill drive the count to zero before any error flip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validation-only change, zero re-index and zero added retrieval latency. The floor-bypass property in research section 1 holds.

### Reliability
- **NFR-R01**: A freshly derived file always parses clean against its own enums. No producer or consumer regression in the existing parse-on-load path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or missing field: keep the existing optionality. An absent `content_type` on a schema where it is optional must still pass.
- Case or separator drift (`In-Progress` versus `in_progress`): the enum is strict, so `normalizeDerivedStatus` must normalize before the value reaches the schema. Out-of-band normalization is the producer job, not the enum job.

### Error Scenarios
- A legacy file with a drifted value: under warn it reports without blocking, which is the intended pre-A4 state.
- An unknown derived token from any of the three producer paths (`normalizeDerivedStatus` default, `deriveStatus` `'unknown'`, `deriveImportanceTier` raw tier): maps to the defined in-enum fallback per REQ-003, never leaks raw.

### State Transitions
- Warn to error: out of scope here, owned by A4 after its backfill reads zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two schema files, three producer guards, one flag resolver, small surface |
| Risk | 7/25 | No breaking flip here, warn tier, no retrieval touch |
| Research | 4/20 | Seams and vocabularies grounded, only content_type set needs a build-time source-confirm |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Confirm the canonical `content_type` vocabulary from the live doc-type axis before the enum is frozen. The memory-record `MemoryTypeName` axis (working, episodic, and so on) is a different field and must not be borrowed for the spec-doc content_type enum.
- Confirm whether the description schema should carry `status` too, or whether status stays graph-metadata-only. The research A3 row names tier, status, and content_type without binding each to a specific schema.
<!-- /ANCHOR:questions -->

---

<!--
VERDICT (research section 2, Tier A row A3): GO-on-cost. Floor-bypassing on-write reuse-first.
A4 is the parent's only measured unconditional GO and pairs with this enum work.
-->
