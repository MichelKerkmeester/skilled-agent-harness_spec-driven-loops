---
title: "Implementation Plan: A3 Enum-Constrain JSON Metadata Schemas [template:level_2/plan.md]"
description: "Replace the free-string importance_tier status and content_type fields in the two JSON metadata zod schemas with closed enums sourced from named as-const tuples, mirroring the existing mutation_class and save_lineage enum discipline, landing in warn so the legacy corpus never hard-breaks."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-a3-enum-constrain-schemas"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "benchmark-spec-agent"
    recent_action: "Specified per-phase benchmark, test and default-safety in plan"
    next_safe_action: "Mirror benchmark and test into tasks and checklist"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A3 Enum-Constrain JSON Metadata Schemas

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
| **Language/Stack** | TypeScript zod schemas under the spec-kit MCP server |
| **Framework** | zod validation on the parse-on-load path |
| **Storage** | None, the schemas validate `graph-metadata.json` and `description.json` in memory |
| **Testing** | Unit parse fixtures plus a derive-then-parse round trip over a real packet |

### Overview
This phase swaps the free-string `importance_tier`, `status`, and `content_type` fields in the two JSON metadata zod schemas for closed enums fed by named `as const` tuples. It mirrors the enum discipline the command surface already proves through the `mutation_class` check and the in-house `save_lineage` enum, so a drifted or mistyped controlled value fails validation at parse time instead of persisting silently. The enums land in warn here, the producer guard closes the leaky default branch, and the error flip is handed to A4.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema-field type tightening plus a producer guard. No new abstraction and no retrieval-path change. The constant-then-enum shape reuses the existing `SAVE_LINEAGE_VALUES` pattern in `graph-metadata-schema.ts`.

### Key Components
- **`graph-metadata-schema.ts`**: hosts `graphMetadataDerivedSchema` where `importance_tier` and `status` are `z.string().min(1)` at lines 43-44 and `save_lineage` already reads `z.enum(SAVE_LINEAGE_VALUES)` at line 50. Target of the three `as const` vocabularies and the `z.enum(...)` swap.
- **`description-schema.ts`**: hosts the description schema where `type` is a bare `z.string().optional()` at line 64 with no `importance_tier` or `content_type` field. Target of the two added enums, the tightened `type`, the preserved `.passthrough()`, and the existing `formatDescriptionSchemaIssues` per-field message path.
- **`graph-metadata-parser.ts`**: hosts `deriveStatus`, `deriveImportanceTier`, and `normalizeDerivedStatus` whose default branch at lines 179-180 returns the raw normalized token. Target of the closed default so the producer never emits an out-of-enum value.

### Data Flow
A metadata file is parsed on load through its zod schema. Today a drifted `importance_tier`, `status`, or `content_type` validates clean because the field is a free string. After this phase the field is a closed enum, so an out-of-vocabulary value fails at parse time. The producer side derives a status or tier, and the closed `normalizeDerivedStatus` default maps an unknown source token to a defined fallback before the value reaches the schema, so a freshly derived file always parses clean against its own enums.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graphMetadataDerivedSchema.importance_tier` | Free `z.string().min(1)` at line 44 | swap to `z.enum(...)` over the canonical tier tuple | a fixture with `high` fails, `important` passes |
| `graphMetadataDerivedSchema.status` | Free `z.string().min(1)` at line 43 | swap to `z.enum(...)` over the derived-status tuple | a fixture with `wip` fails, `in_progress` passes |
| `content_type` on the schema that carries it | No enum target on either schema | add an `as const` tuple sourced from the live doc-type axis plus a `z.enum(...)` | an unknown content_type fails, a known one passes |
| `description-schema.ts` `type` plus added enums | `type` is bare `z.string().optional()` at line 64, no tier or content_type field | add closed `importance_tier` and `content_type` enums, tighten `type`, keep `.passthrough()` | an extra authored key still parses, an out-of-enum tier fails |
| `normalizeDerivedStatus` default branch | Returns the raw normalized token at lines 179-180 | close the default to a defined fallback | a malformed source status derives to an in-enum value |
| `formatDescriptionSchemaIssues` | Per-field issue formatter | reuse so an out-of-enum value yields a precise message | a failing parse names the offending field and its allowed set |

Required inventories:
- Same-class producers: `rg -n 'z.string\(\).min\(1\)|z.enum|SAVE_LINEAGE_VALUES' .opencode/skills/system-spec-kit/mcp_server/lib/graph .opencode/skills/system-spec-kit/mcp_server/lib/description`.
- Consumers of changed symbols: `rg -n 'importance_tier|content_type|graphMetadataDerivedSchema|folderDescriptionSchema' .opencode/skills/system-spec-kit --glob '*.ts'`.
- Matrix axes: in-enum value, out-of-enum value, absent optional field, case or separator drift, derived-then-parsed round trip.
- Algorithm invariant: a freshly derived file always parses clean against its own enums, and an out-of-enum authored value fails at parse time.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `graph-metadata-schema.ts` and `description-schema.ts` to confirm the field lines, the `SAVE_LINEAGE_VALUES` pattern, and the `formatDescriptionSchemaIssues` message path
- [ ] Confirm the canonical `content_type` vocabulary from the live doc-type axis at build time, not the `MemoryTypeName` record axis
- [ ] Confirm the derived-status set against `normalizeDerivedStatus` outputs at `graph-metadata-parser.ts:170-181`

### Phase 2: Core Implementation
- [ ] Add the three `as const` vocabularies in `graph-metadata-schema.ts` and swap `importance_tier` and `status` to `z.enum(...)`, adding `content_type` where the derived block carries it
- [ ] Add closed `importance_tier` and `content_type` enums to `description-schema.ts`, tighten `type`, and keep `.passthrough()`
- [ ] Wire the out-of-enum message through `formatDescriptionSchemaIssues` so a failing parse names the field and its allowed set
- [ ] Close the `normalizeDerivedStatus` default branch so an unknown derived token maps to a defined fallback rather than leaking raw
- [ ] Cite the `content_type` source vocabulary in a code comment that states the durable WHY with no artifact id

### Phase 3: Verification
- [ ] A fixture with an out-of-enum `importance_tier`, `status`, or `content_type` fails, and an in-enum fixture passes
- [ ] A derive-then-parse round trip over a real packet with a malformed source status produces an in-enum status that parses clean
- [ ] A description fixture with extra authored keys still parses while an out-of-enum `importance_tier` fails

### Benchmark (SPECIFIED, not run)

This is a write-time schema-conformance phase, so the metric is not recall. Prod search truncates to the 3-result floor and a validation-only change moves no retrieval number, so the per-phase benchmark is enum swap-precision on a planted fixture set paired with a frozen corpus conformance-count.

| Aspect | Value |
|--------|-------|
| **Primary metric** | Enum swap-precision over a planted fixture set covering an in-enum and an out-of-enum value for `importance_tier`, `status` and `content_type` on both schemas |
| **Pass threshold** | Catch-rate 1.00, every planted out-of-enum value rejected, AND false-reject-rate 0.00, every in-enum value accepted, across `graphMetadataDerivedSchema` and the description schema |
| **Regress threshold** | Any in-enum value false-rejected, or any out-of-enum value accepted. A false-reject is the blocking direction because it would hard-break a valid legacy file |
| **Conformance metric** | The count of live spec-folder metadata files whose `importance_tier`, `status` or `content_type` falls outside the new enum, swept at warn tier and frozen as the A4 starting count |
| **Conformance target** | This phase does not drive the count to zero. It freezes the baseline and confirms the enum adds no new violation of its own. A4 (phase `002`) owns the count-to-zero backfill and the warn-to-error flip |
| **Reproduce** | `npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/enum-constrain-schemas.vitest.ts` for swap-precision, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-root>` running the `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` warn-tier rules for the conformance count |
| **Reuse** | The warn-tier `check-graph-metadata-shape.sh` and `check-description-shape.sh` rules registered in `validator-registry.json` are the corpus sweepers, so no new sweep harness lands |

### Default-Safety (SPECIFIED, not run)

- **Default state**: `SPECKIT_SCHEMA_ENUM_ENFORCE` defaults OFF through the existing `isFeatureEnabled` helper, so the parse-on-load and save path keep the current free-string acceptance and every existing or freshly saved file parses byte-identical to baseline. The unit-level enum reject of REQ-001 and REQ-002 stays provable on fixtures with the flag off.
- **Keep-off rationale**: the legacy corpus still carries drifted `importance_tier`, `status` and `content_type` tokens that the A4 backfill has not yet driven to zero, so enforcing on the live write path now would risk a premature false-fire before the count reads clean.
- **No-regress**: with the flag off both schemas parse byte-identical to baseline, and `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` stay at `severity: warn` in `validator-registry.json` so a drifted value reports without blocking.
- **Reversibility**: `export SPECKIT_SCHEMA_ENUM_ENFORCE=false`, or leaving it unset, reverts at runtime with zero re-index and zero retrieval-path change. The new flag is registered in the `flag-ceiling.vitest.ts` drift guard so default-off coverage never silently gaps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Passing and failing parse fixtures for each constrained field on both schemas | `enum-constrain-schemas.vitest.ts`, direct schema parse |
| Integration | Derive-then-parse round trip over a real packet folder | parser plus schema parse |
| Manual | Message-shape check that an out-of-enum value names the field and its allowed set | `formatDescriptionSchemaIssues` output |
| Benchmark | Enum swap-precision on the planted fixture set, catch-rate 1.00 and false-reject-rate 0.00 across both schemas, plus the frozen corpus conformance-count baseline | `enum-constrain-schemas.vitest.ts` plus the warn-tier shape rules via `validate.sh` |
| Default-safety | Flags-off byte-identical parse of a legacy-corpus fixture with `SPECKIT_SCHEMA_ENUM_ENFORCE` off, with the flag registered in the flag-ceiling drift guard | `enum-constrain-schemas.vitest.ts` plus `flag-ceiling.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The canonical `content_type` vocabulary from the live doc-type axis | Internal | Yellow | Inventing values would drift the very field the enum guards |
| `SAVE_LINEAGE_VALUES` constant-then-enum pattern | Internal | Green | None, the pattern ships today in `graph-metadata-schema.ts` |
| A4 promote DESCRIPTION_SHAPE and GRAPH_METADATA_SHAPE warn to error (parent phase `002`) | Internal | Yellow | A4 consumes these enums, so this phase is its structural prerequisite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A freshly derived file fails its own enum, or a valid authored file false-fires under the new enum.
- **Procedure**: Revert the `z.enum(...)` swap on the offending field back to its free-string type, leaving the other enums in place at warn while the surfaced gap is traced.
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
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Canonical `content_type` vocabulary confirmed from the live doc-type axis
- [ ] Derive-then-parse round trip staged over a real packet
- [ ] Passing and failing fixtures staged for each constrained field

### Rollback Procedure
1. Revert the `z.enum(...)` swap on the offending field to its free-string type
2. Keep the remaining enums in place at warn
3. Re-run the derive-then-parse round trip to confirm the producer stays in-enum
4. Re-attempt the swap once the surfaced gap is traced

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change touches schema typing and a producer guard only, with zero re-index
<!-- /ANCHOR:enhanced-rollback -->

---
