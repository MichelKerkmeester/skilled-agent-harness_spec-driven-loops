---
title: "Implementation Plan: Generated-Metadata Validator and Status Enum [template:level_2/plan.md]"
description: "Close derived.status to a shared z.enum at the schema boundary, add a first-class GENERATED_METADATA_INTEGRITY rule validating both JSON files through the shared schemas plus path-prefix and enum invariants registered as an error in strict mode behind a grandfather report mode, and stop the parser preserving a legacy bad status by re-deriving on the closed enum or falling back to planned plus a review flag."
trigger_phrases:
  - "generated metadata validator"
  - "derived status enum boundary"
  - "graph metadata integrity rule"
  - "stop preserving bad statuses"
  - "status enum schema close"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the schema enum, integrity rule and re-derive behind a flag"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/"
      - ".opencode/skills/system-spec-kit/scripts/rules/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-036-metadata-validator-status-enum"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Generated-Metadata Validator and Status Enum

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
| **Language/Stack** | TypeScript spec-kit MCP lib plus a Node rule bridge in the rules dir |
| **Framework** | spec-kit graph-metadata schema and parser plus the `validate.sh` rule registry |
| **Storage** | The generated `description.json` and `graph-metadata.json` per spec folder |
| **Testing** | Vitest over the schema, the normalizer, the integrity rule and the parser re-derive |

### Overview
This phase closes the generated-JSON contract at three points the 031 research verified to file:line. It adds a shared `GRAPH_METADATA_STATUS_VALUES` const and switches `derived.status` to a `z.enum` so the schema rejects any value outside the closed set, and it changes `normalizeDerivedStatus` so its default branch returns an enum value or null rather than the raw normalized string. It adds a first-class `GENERATED_METADATA_INTEGRITY` rule that validates both JSON files through the shared schemas plus the path-prefix and enum invariants and registers as an error under strict mode. It changes the parser so a missing `implementation-summary.md` preserves an existing status only when it is already an enum value and otherwise re-derives or falls back to `planned` plus a review flag. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because existing files carry the prose statuses and prefixed paths the new contract rejects and would mass-fail without a scoped migration window.
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
Schema-boundary close plus a rule bridge over the existing validation registry. The schema gains a closed enum, the normalizer and the parser re-derive read the same shared const, and a new rule reuses the real Zod schemas rather than the shallow shell shape. No new validation harness, the rule registers into the existing strict-mode pathway, and every behavioral change is gated by a default-off flag or a grandfather report mode.

### Key Components
- **`GRAPH_METADATA_STATUS_VALUES`**: one shared const declaring the closed status set, imported by the schema, the normalizer, the integrity rule and the parser re-derive so all four agree on the same enum.
- **`derived.status` schema**: switched from any non-empty string to `z.enum(GRAPH_METADATA_STATUS_VALUES)`, so a prose value fails parse at the boundary.
- **`normalizeDerivedStatus`**: its default branch returns an enum value or null rather than the raw normalized string, removing the prose leak at the resolver.
- **`GENERATED_METADATA_INTEGRITY`**: the new rule bridge that validates `description.json` and `graph-metadata.json` through the shared schemas plus the path-prefix and enum invariants, registered as an error in strict mode behind a grandfather report mode.
- **Parser legacy-status path**: a missing `implementation-summary.md` preserves an existing status only when it is already an enum value, otherwise re-derives or falls back to `planned` plus a review flag.

### Data Flow
A scan or a strict validation reads a folder. The schema parses `graph-metadata.json` and rejects a non-enum `derived.status`. The normalizer resolves any input to an enum value or null using the shared const. The integrity rule validates both JSON files through the shared schemas plus the path-prefix and enum invariants and emits an error under strict mode, or a non-blocking warning under the grandfather report mode. When a folder has no `implementation-summary.md`, the parser re-derives the status on the closed enum or falls back to `planned` plus a review flag rather than preserving an arbitrary string.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-metadata-schema.ts` `derived.status` | Accepts any non-empty string for the status field | add `GRAPH_METADATA_STATUS_VALUES` and switch the field to `z.enum`, so a prose value fails parse | a unit assertion confirms the schema rejects an em-dash prose status and accepts each enum member |
| `graph-metadata-parser.ts:179-180` `normalizeDerivedStatus` | Returns the raw normalized string in the default branch, so prose leaks through | return an enum value or null from the default branch, reading the shared const | a unit assertion confirms the normalizer returns null for an unknown value rather than the raw string |
| `graph-metadata-parser.ts` legacy-status preserve path | Preserves an existing status after a normalization that admits arbitrary strings when there is no `implementation-summary.md` | preserve only when the existing status is already an enum value, otherwise re-derive or fall back to `planned` plus a review flag | a unit assertion confirms a prose status with no `implementation-summary.md` re-derives or falls back, an enum status is kept |
| `scripts/rules/` new `GENERATED_METADATA_INTEGRITY` | The shallow `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` checks run as warnings and do not use the real schemas | add a rule bridge validating both JSON files through the shared schemas plus path-prefix and enum invariants | a strict run over a prose-status folder errors from the new rule, a clean folder passes |
| `scripts/rules/validator-registry.json` | Registers the shallow checks at warning level | register `GENERATED_METADATA_INTEGRITY` as an error in strict mode behind a grandfather report mode flag | the registry entry shows error severity in strict mode and the grandfather flag gates the error arm |
| Grandfather flag and re-derive gate | No flag gates the contract today | add a default-off flag or grandfather report mode so existing prefixed paths and prose statuses report rather than block | a unit assertion confirms the grandfather arm warns and strict passes, the off arm errors |
| `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` shallow checks | Warning-level shell guards | leave in place or supersede per the integrity rule rollout, do not remove until the integrity rule is the gate | grep confirms the integrity rule is the strict-mode gate and the shallow checks are not relied on for the enum or path invariants |

Required inventories:
- Same-class producers: `rg -n 'normalizeDerivedStatus|derived.status|GRAPH_METADATA_STATUS' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'GRAPH_METADATA_STATUS_VALUES|GraphMetadataSchema|normalizeDerivedStatus' .opencode/skills/system-spec-kit`.
- Matrix axes: prose status, enum status, null status, missing `implementation-summary.md`, prefixed `specFolder` path, grandfather flag on, grandfather flag off, missing or unparseable JSON.
- Algorithm invariant: `derived.status` resolves to an enum value or null, the integrity rule errors under strict mode and warns under the grandfather report mode, the parser re-derives a non-enum legacy status rather than preserving it, and the schema, the normalizer, the rule and the parser all read one shared `GRAPH_METADATA_STATUS_VALUES`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the shared Zod schemas in `graph-metadata-schema.ts` cover `description.json` and `graph-metadata.json` and can back the integrity rule
- [ ] Confirm the rule registry and strict-mode pathway in `validate.sh` accept a new error-level rule and a grandfather report mode flag
- [ ] Enumerate the current `derived.status` values the closed enum must admit, sourced from the existing normalizer cases
- [ ] Decide the default-off flag name and the grandfather report mode shape for the integrity rule and the re-derive path

### Phase 2: Core Implementation
- [ ] Add `GRAPH_METADATA_STATUS_VALUES` and switch `derived.status` to `z.enum` in `graph-metadata-schema.ts`
- [ ] Change `normalizeDerivedStatus` so the default branch returns an enum value or null, reading the shared const
- [ ] Add the `GENERATED_METADATA_INTEGRITY` rule bridge validating both JSON files through the shared schemas plus the path-prefix and enum invariants, and register it as an error in strict mode behind the grandfather flag
- [ ] Change the parser so a missing `implementation-summary.md` preserves an existing status only when it is already an enum value, otherwise re-derives or falls back to `planned` plus a review flag

### Phase 3: Verification
- [ ] An em-dash prose status fails schema validation and the normalizer returns null for it
- [ ] A strict run over a prose-status or prefixed-path folder errors from the integrity rule, and a clean folder passes
- [ ] With the grandfather mode on a legacy folder warns and strict passes, with the flag off the same folder errors
- [ ] A folder with no `implementation-summary.md` and a prose status re-derives or falls back to `planned` plus a review flag, an enum status is kept
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The schema rejects a prose status and accepts each enum member, the normalizer returns null for an unknown value, the parser re-derives or falls back for a non-enum legacy status and keeps an enum status, the grandfather flag gates the error arm | a new `generated-metadata-integrity.vitest.ts` under `.opencode/skills/system-spec-kit/scripts/tests/` |
| Integration | A strict `validate.sh` run over a prose-status fixture folder errors from `GENERATED_METADATA_INTEGRITY`, a clean fixture passes, and the grandfather arm warns rather than blocks | `validate.sh --strict` over fixture folders |
| Manual | Confirm the existing legacy folders report rather than mass-fail under the grandfather window before the flag graduates to error | a scoped grandfather-mode run over a sample of existing spec folders |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The shared Zod schemas in `graph-metadata-schema.ts` | Internal | Green | The integrity rule reuses the real schemas, so it cannot bridge if the schemas move |
| The rule registry and strict-mode pathway in `validate.sh` | Internal | Green | The new rule registers into the existing pathway, so it cannot wire if the registry contract changes |
| The grandfather report mode flag | Internal | Yellow | The contract cannot graduate to error until the flag and a scoped migration land, so the error arm stays gated |
| The 031 research file:line evidence | Internal | Green | The seams are verified, so the build asserts against known leaks rather than re-discovering them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The integrity rule false-fires on a valid folder, or the enum close rejects a status that should be admitted.
- **Procedure**: Set the grandfather flag to report-only so the rule warns rather than blocks, then widen `GRAPH_METADATA_STATUS_VALUES` or revert the rule registration. The schema and normalizer changes revert to the prior string-accepting form if needed.
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
- [ ] Grandfather report mode proven to warn rather than block on a legacy folder
- [ ] The enum admits every current valid status, proven against the existing normalizer cases
- [ ] The integrity rule errors on a prose-status fixture with the flag off

### Rollback Procedure
1. Set the grandfather flag to report-only so the integrity rule warns rather than blocks
2. Revert the `GENERATED_METADATA_INTEGRITY` registry entry if the rule itself is faulty
3. Widen `GRAPH_METADATA_STATUS_VALUES` or revert the `z.enum` switch if a valid status was rejected
4. Re-run `validate.sh --strict` over the sample folders to confirm they return to the prior verdict

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change closes a schema field, adds a rule and a re-derive path, and gates the behavioral effect behind a flag, it does not migrate stored data in this phase
<!-- /ANCHOR:enhanced-rollback -->

---
