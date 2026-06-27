---
title: "Implementation Plan: A4 Schema Warn to Error [template:level_2/plan.md]"
description: "Wire both structural shape rules to the real exported zod schemas, flip their registry severity from warn to error, and delete the dead legacy_grandfathered strict-mode bypass after the legacy corpus re-measures to zero."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/004-schema-warn-to-error"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for A4 schema warn-to-error scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
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
# Implementation Plan: A4 Schema Warn to Error

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
| **Language/Stack** | Bash rule scripts calling Node, zod schemas in TypeScript |
| **Framework** | spec-kit validator (`validate.sh` rule registry) |
| **Storage** | None, the rules read `description.json` and `graph-metadata.json` on disk |
| **Testing** | `validate.sh --strict` plus a dry-run census pass over `.opencode/specs` |

### Overview
This phase replaces the hand-rolled inline JSON checks in the two structural shape rules with the real exported zod schemas that already sit beside them, flips both registry severities from `warn` to `error`, and deletes the dead `legacy_grandfathered` strict-mode bypass. The flip lands only after a dry-run re-measure of the live corpus reads zero failing files, so a malformed metadata JSON starts failing strict validation with no re-index and no grandfathered blast radius.
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
Validator rule swap plus registry severity flip plus dead-code deletion. No new abstraction and no schema redesign.

### Key Components
- **`check-description-shape.sh`**: structural rule for `description.json`, today carrying an inline ad-hoc shape check, target consumer of `folderDescriptionSchema` and `formatDescriptionSchemaIssues`.
- **`check-graph-metadata-shape.sh`**: structural rule for `graph-metadata.json`, today carrying an inline ad-hoc shape check, target consumer of `graphMetadataSchema` while keeping its phase-parent pointer check.
- **`validator-registry.json`**: owns the `severity` field per rule id, the single place the warn-to-error flip lands.
- **`validate.sh`**: the strict gate, host of the dead `detect_legacy_grandfathered` function (lines 175-183), its declaration (line 41), its call site (line 1044), and all four `LEGACY_GRANDFATHERED` reads in the strict RESULT and exit logic (lines 912, 927, 935, 1062).

### Data Flow
`validate.sh` resolves each rule from the registry, runs the rule script against the packet JSON, then folds the rule status into the strict RESULT. After this phase the two shape rules route their JSON through the canonical zod schemas and return `error` on a shape miss, and the strict RESULT no longer consults any grandfathered bypass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-description-shape.sh` | Hand-rolls the `description.json` shape check inline at warn | update to call `folderDescriptionSchema` plus `formatDescriptionSchemaIssues`, surface every issue as error | grep shows the schema names and no surviving inline shape logic, a valid file passes |
| `check-graph-metadata-shape.sh` | Hand-rolls the `graph-metadata.json` shape check inline at warn | update to call `graphMetadataSchema`, keep the `last_active_child_id` pointer check, promote warnings to error | grep shows the schema name, a valid file passes, a stale pointer still fails |
| `validator-registry.json` | Declares `severity: warn` for both shape rule ids | update both to `severity: error` | registry lists `error` for `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` |
| `validate.sh` strict RESULT | Reads the `LEGACY_GRANDFATHERED` flag at four sites (lines 912, 927, 935, 1062) through `detect_legacy_grandfathered` | delete the function (175-183), its declaration (41), its call site (1044), and all four reads | grep returns zero matches for `legacy_grandfathered` and `LEGACY_GRANDFATHERED` |
| `graph-metadata-schema.ts`, `description-schema.ts` | Canonical writer schemas already exported | not a consumer change, reuse verbatim | the schemas import `zod` and ship today, no new schema logic added |

Required inventories:
- Same-class producers: `rg -n 'legacy_grandfathered|LEGACY_GRANDFATHERED' .opencode/skills/system-spec-kit/scripts`.
- Consumers of changed symbols: `rg -n 'GRAPH_METADATA_SHAPE|DESCRIPTION_SHAPE|folderDescriptionSchema|graphMetadataSchema' .opencode/skills/system-spec-kit`.
- Matrix axes: valid file, malformed file, missing file, invalid JSON parse, phase parent with stale pointer.
- Algorithm invariant: a shape miss returns error, a missing file stays `info` owned by the presence rule, and the strict RESULT depends on no bypass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `graphMetadataSchema`, `folderDescriptionSchema`, and `formatDescriptionSchemaIssues` are exported and importable from the rule scripts
- [ ] Decide the Node entry shape for the schema call, matching how strict-only validators already resolve `tsx_bin` in `validate.sh`
- [ ] Capture the baseline failing count from a dry-run census over `.opencode/specs`

### Phase 2: Core Implementation
- [ ] Replace the inline check in `check-description-shape.sh` with a `folderDescriptionSchema` call routed through `formatDescriptionSchemaIssues`
- [ ] Replace the inline check in `check-graph-metadata-shape.sh` with a `graphMetadataSchema` call, keeping the phase-parent `last_active_child_id` pointer check
- [ ] Backfill every file the new schemas surface as failing, then re-measure the census to zero
- [ ] Flip `severity` to `error` for `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` in `validator-registry.json`
- [ ] Delete `detect_legacy_grandfathered` (175-183), its declaration (41), its call site (1044), and all four `LEGACY_GRANDFATHERED` reads (912, 927, 935, 1062) in `validate.sh`

### Phase 3: Verification
- [ ] A valid corpus passes `validate.sh --strict` with exit 0
- [ ] A deliberately corrupted scratch packet exits 2 under `--strict`
- [ ] grep confirms zero `legacy_grandfathered` and `LEGACY_GRANDFATHERED` matches in `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | A valid and a malformed `description.json` and `graph-metadata.json` through each rule script | direct rule-script invocation |
| Integration | Strict gate over a valid packet and a corrupted scratch packet | `validate.sh --strict` |
| Manual | Dry-run census re-measure to zero across `.opencode/specs` before the flip | census pass plus grep evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `graphMetadataSchema`, `folderDescriptionSchema`, `formatDescriptionSchemaIssues` exports | Internal | Green | None, the schemas ship today and import `zod` |
| Four-beat migration discipline (WARN, BACKFILL, RE-MEASURE TO ZERO, ERROR) | Internal | Yellow | An early flip fail-blocks legacy files |
| Backfill path for the real failing graph roots (the legacy two-key `.opencode/specs/graph-metadata.json` plus three `026/022` packets, a real `safeParse` fails 24 files and 16 excluding archives, not 11), including legacy-format files the live reader migrates in memory but a strict `graphMetadataSchema.parse` rejects | Internal | Yellow | The flip cannot land until the failing count reads zero |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A valid packet false-fires under the stricter schema, or the live corpus still shows nonzero failures after the flip.
- **Procedure**: Revert the `severity` flip in `validator-registry.json` back to `warn`, leaving the schema swap in place at warn while the surfaced gap is backfilled.
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
- [ ] Dry-run census failing count captured before the flip
- [ ] Backfill of surfaced files complete and re-measured to zero
- [ ] Corrupted scratch packet regression proof staged

### Rollback Procedure
1. Revert the `severity` flip in `validator-registry.json` to `warn`
2. Keep the schema swap at warn while the surfaced gap is backfilled
3. Re-run the dry-run census to confirm the failing count
4. Re-attempt the flip once the count reads zero

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change touches validation logic and rule severity only
<!-- /ANCHOR:enhanced-rollback -->

---
