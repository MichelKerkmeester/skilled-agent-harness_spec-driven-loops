---
title: "Feature Specification: A4 Schema Warn to Error [template:level_2/spec.md]"
description: "DESCRIPTION_SHAPE and GRAPH_METADATA_SHAPE validate with hand-rolled JSON checks at warn severity while the real zod schemas sit dormant and a never-triggered legacy_grandfathered bypass weakens strict mode. This phase promotes both rules to error against the real schemas and deletes the dead bypass."
trigger_phrases:
  - "schema warn to error"
  - "description shape"
  - "graph metadata shape"
  - "legacy grandfathered"
  - "zod schema validation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/004-schema-warn-to-error"
    last_updated_at: "2026-07-04T17:12:01.279Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec for A4 schema warn-to-error"
    next_safe_action: "Run generate-context to produce description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: A4 Schema Warn to Error

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
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `004-schema-warn-to-error` |
| **Verdict** | measured-GO, unconditional as a DECISION but flip-gated on backfill-to-zero (the live failing count is 16-to-24 today, not 0), ships first |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two structural JSON-shape rules ship at warn severity and never block, so a malformed `description.json` or `graph-metadata.json` reaches the corpus unchecked. Both rule scripts hand-roll their own JSON checks in inline Node rather than running the real zod schemas that already exist next to them, so the validator and the canonical writer can drift apart. A `legacy_grandfathered` strict-mode bypass at `validate.sh:175-183` still gates the strict RESULT, yet the live census counts 0 grandfathered packets, so the bypass is dead code that only weakens the strict gate.

### Purpose
Promote `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` to error against the real zod schemas and delete the dormant `legacy_grandfathered` bypass, so a malformed metadata JSON fails strict validation with zero re-index and zero grandfathered-packet blast radius.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the hand-rolled JSON checks in both rule scripts with the real exported zod schemas (`graphMetadataSchema` from `graph-metadata-schema.ts`, `folderDescriptionSchema` from `description-schema.ts`), reusing `formatDescriptionSchemaIssues` for the description issue text.
- Flip the registry severity for both rules from `warn` to `error` in `validator-registry.json`.
- Delete the `detect_legacy_grandfathered` function and every read of the `LEGACY_GRANDFATHERED` flag in `validate.sh`, so the strict RESULT no longer consults the bypass.
- Run the four-beat migration discipline (WARN already landed, BACKFILL the failing files, RE-MEASURE the failing count to 0, ERROR flip) so the legacy corpus reads zero before the gate turns hard.
- Add a regression-catch proof that a deliberately corrupted scratch packet now exits 2 under `--strict`.

### Out of Scope
- A3 enum constraints on `importance_tier` and `status` and `content_type`. A4 pairs with A3 but A3 is its own phase.
- A1 keystone content-quality wiring and any `CONTENT_QUALITY` rule. Different surface, different phase.
- Any retrieval-class change or re-index. A4 touches validation not ranking and carries zero prod-retrieval risk.
- Changing the schema field set itself. This phase wires the existing schemas, it does not redesign them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh` | Modify | Replace the inline hand-rolled Node check (lines 32-60) with a call into `folderDescriptionSchema` plus `formatDescriptionSchemaIssues`, surface every issue as an error |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh` | Modify | Replace the inline hand-rolled Node check (lines 32-69) with a call into `graphMetadataSchema`, keep the phase-parent `last_active_child_id` pointer check, promote remaining warnings to errors |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Set `severity` to `error` for `GRAPH_METADATA_SHAPE` (line 195) and `DESCRIPTION_SHAPE` (line 203) |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Delete `detect_legacy_grandfathered` (lines 175-183), its declaration (line 41), its call site (line 1044), and all four `LEGACY_GRANDFATHERED` reads in the strict RESULT and exit logic (lines 912, 927, 935, 1062), not the single read the earlier draft named |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The system MUST validate `description.json` against `folderDescriptionSchema` and `graph-metadata.json` against `graphMetadataSchema` instead of the hand-rolled inline checks | Grep of both rule scripts shows the schema names and no surviving inline ad-hoc JSON shape logic, and a valid file passes both rules |
| REQ-002 | When a metadata JSON fails its schema the system MUST report the failure at error severity | `validator-registry.json` lists `severity: "error"` for both rule ids, and a malformed file produces an error not a warning in `validate.sh` output |
| REQ-003 | The system MUST NOT consult any `legacy_grandfathered` bypass when computing the strict RESULT | Grep of `validate.sh` returns zero matches for `legacy_grandfathered` and `LEGACY_GRANDFATHERED`, and a corrupted scratch packet exits 2 under `--strict` |
| REQ-004 | Before the error flip, the live corpus MUST re-measure to a 0 failing count under the new schemas | A dry-run pass over `.opencode/specs` reports 0 description-shape and 0 graph-metadata-shape failures after backfill, captured as evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The phase-parent `last_active_child_id` pointer integrity check MUST survive the schema swap | A phase parent whose `derived.last_active_child_id` points at a missing child still fails the graph rule |
| REQ-006 | The schema-issue text surfaced to the operator MUST stay human-readable, not a raw zod dump | Description failures route through `formatDescriptionSchemaIssues`, graph failures present field-path plus reason per issue |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both shape rules validate against the real zod schemas, severity is `error`, and `legacy_grandfathered` is fully removed from `validate.sh`.
- **SC-002**: The live corpus re-measures to 0 failing files before the flip, and a corrupted scratch packet exits 2 under `--strict` after it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Real zod schemas `graphMetadataSchema` and `folderDescriptionSchema` already exported with `formatDescriptionSchemaIssues` | None, schemas ship today and import `zod` | Reuse verbatim, add no new schema logic in the rule scripts |
| Dependency | Four-beat migration discipline (WARN, BACKFILL, RE-MEASURE TO ZERO, ERROR) from the parent rollout layer | An early flip would fail-block legacy files | Hold the error flip until the dry-run failing count reads 0 |
| Risk | Live-root files still failing the stricter `graphMetadataSchema`. A real `safeParse` over the 2059-file corpus fails 24 files (16 excluding archives), not the 11 the parent census reported. The 11 are nested `research/.../iterations/` text-stub artifacts, not roots. The 11 also exclude the genuine failing roots | Med, an early flip would block validation on the real failing roots | The real failing roots are `.opencode/specs/graph-metadata.json` (legacy two-key `{derived, children_ids}` shape) and three `026/022` packets (`migration_source` not "legacy", missing `manual.depends_on[].source`, out-of-enum `derived.save_lineage`). BACKFILL these to the canonical shape then re-measure to zero before flipping |
| Dependency | A4 spans two validators, `DESCRIPTION_SHAPE` (`folderDescriptionSchema`) and `GRAPH_METADATA_SHAPE` (`graphMetadataSchema`) | The description half re-measures clean today (0 of 2054 `description.json` files fail), so the whole backfill burden sits on the graph half | Scope the backfill to `graph-metadata.json` files only |
| Risk | The error flip drops the live reader's legacy-migration tolerance. `validateGraphMetadataContent` (`graph-metadata-parser.ts:338-387`) catches a strict-parse failure and falls back to `parseLegacyGraphMetadataContent`, accepting legacy on-disk files that a bare `graphMetadataSchema.parse` at error rejects | Med, legacy-format files the loader tolerates would fail strict after the flip | The re-measure-to-zero gate surfaces them before the flip. Backfill them to the canonical shape, do not re-add a tolerance path inside the rule |
| Risk | The stricter zod schema rejects a shape the hand-rolled check tolerated | Low, the schemas are the canonical writer contract | Run the full dry-run pass and backfill any newly-surfaced gap before the flip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The schema-backed check adds no measurable latency over the prior inline Node check on a single packet validation.

### Security
- **NFR-S01**: The change stays inside the existing validation trust boundary and reads no new inputs.

### Reliability
- **NFR-R01**: A valid corpus continues to pass strict validation with exit 0 after the flip, no false-fire.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing file: both rules already return `info` and skip shape validation when the JSON is absent, presence stays owned by `GRAPH_METADATA_PRESENT`. Preserve this branch.
- Invalid JSON parse: surface as an error, matching the current parse-error path.
- Phase parent with a stale `last_active_child_id`: still fails, the pointer check runs after the schema check.

### Error Scenarios
- Newly-surfaced legacy gap at flip time: blocked by the re-measure-to-zero gate, never reaches the error flip.
- Corrupted scratch packet: must exit 2 under `--strict`, this is the regression-catch proof.

### State Transitions
- Partial migration: WARN and BACKFILL may land while severity stays `warn`. The error flip is the final beat and lands only after the count reads 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 files, schema swap plus severity flip plus dead-code deletion, no new schema |
| Risk | 10/25 | No breaking change, but a stricter gate over a legacy corpus needs the backfill-to-zero discipline |
| Research | 4/20 | Seams already grounded to file:line by the parent research, schemas already exist |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the backfill of the real failing graph roots (the legacy two-key `.opencode/specs/graph-metadata.json` plus the three `026/022` packets, not the 11 `research/.../iterations/` text-stubs) run through `generate-context` or a one-shot backfill, and is that backfill in this phase or a precondition owned by the parent Stage-0 census.
- Do the rule scripts call the zod schema through a thin compiled Node entry or a `tsx` shim, matching how the strict-only validators already resolve `tsx_bin` in `validate.sh`.
<!-- /ANCHOR:questions -->
