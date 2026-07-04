---
title: "Implementation Plan: A8 Surface Provenance Fields [template:level_2/plan.md]"
description: "Surface the already-computed provenance governance fields as first-class JSON fields and freshness-bind causal_summary to source_docs at the existing write seam with no re-index."
trigger_phrases:
  - "surface provenance fields plan"
  - "source kind json plan"
  - "content type freshness plan"
  - "causal summary source docs plan"
  - "metadata json governance plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/008-surface-provenance-fields"
    last_updated_at: "2026-07-04T17:12:00.389Z"
    last_updated_by: "markdown-agent"
    recent_action: "Drafted the A8 plan from the spec seams"
    next_safe_action: "Resolve the content_type compute-site question"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "a8-plan-authoring"
      parent_session_id: "a8-spec-authoring"
    completion_pct: 0
    open_questions:
      - "Whether content_type and document_weight have a compute site to reuse or must be derived fresh"
    answered_questions:
      - "source_kind is already computed and persisted on the memory side"
---
# Implementation Plan: A8 Surface Provenance Fields

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JSON metadata |
| **Framework** | Spec-kit MCP server, zod schemas, generate-context |
| **Storage** | The two metadata JSONs (description.json, graph-metadata.json) |
| **Testing** | validate.sh strict, zod parse, warn-tier coherence check |

### Overview
This plan surfaces the provenance values the memory side already computes as first-class fields in the two metadata JSONs, and binds `causal_summary` freshness to `source_docs`. The fields land additive and optional at the existing `generate-context.ts` write seam so the legacy corpus parses without a new hard failure and no re-index is needed.
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
Schema-plus-write-seam. Two zod schemas gain optional governance fields, one write seam populates them, one warn-tier check asserts coherence.

### Key Components
- **description-schema.ts**: Holds the `source_kind`, `provenance` and `content_type` field definitions read by the description JSON parse.
- **graph-metadata-schema.ts**: Holds `document_weight`, the temporal or freshness block, and the `causal_summary` to `source_docs` binding.
- **generate-context.ts**: Populates the new fields at the existing `atomicWriteJson` write seam, reading the persisted `source_kind` rather than recomputing it.

### Data Flow
`write-provenance.ts` persists `source_kind` onto `memory_index`. The plan reads that persisted value at the `generate-context.ts` write seam, derives `content_type` and `document_weight` when no reuse site exists, writes all fields into the two JSONs, and the warn-tier check reads them back for coherence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| description-schema.ts | Owns the description JSON shape | update, add optional governance fields | zod parse of a generated and a legacy JSON |
| graph-metadata-schema.ts | Owns the graph JSON shape and `causal_summary` | update, add freshness fields and the source_docs binding | stale and fresh fixture both validate as expected |
| generate-context.ts | Writes both JSONs at the atomicWriteJson seam | update, populate the new fields | a freshly generated JSON carries the fields |
| write-provenance.ts | Computes and persists `source_kind` | unchanged, read-only reuse | grep confirms no recompute call added |
| content-quality.ts | Runs validation checks | update or create, add warn-tier coherence check | warn not error on a legacy file |

Required inventories:
- Same-class producers: `rg -n 'source_kind|provenance|content_type|document_weight' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'source_kind|content_type|document_weight|causal_summary|source_docs' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: field present vs absent, fresh vs stale, legacy vs newly generated.
- Algorithm invariant: a `causal_summary` older than the newest `source_docs` mtime is stale, an empty `source_docs` is vacuously current, an unavailable mtime is unknown not stale.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Run the generators on a sample packet to capture a Stage-0 baseline of current JSON shape
- [ ] Confirm the persisted `source_kind` read path from `write-provenance.ts`
- [ ] Answer the `content_type` and `document_weight` compute-site open question

### Phase 2: Core Implementation
- [ ] Add `source_kind` and the `provenance` block to description-schema.ts as optional fields
- [ ] Add `content_type`, `document_weight` and the freshness block to the schemas, reusing a compute site when found and deriving on-write when not
- [ ] Bind `causal_summary` freshness to `source_docs` in graph-metadata-schema.ts
- [ ] Populate the new fields at the `generate-context.ts` atomicWriteJson write seam (graph write at the graph seam)
- [ ] Add the default-off warn-tier provenance coherence check

### Phase 3: Verification
- [ ] A freshly generated description.json and graph-metadata.json carry the surfaced fields
- [ ] A `causal_summary` predating its newest `source_docs` mtime is flagged stale, a fresh one current
- [ ] The Stage-0 census of newly-failing live-root files after the additions is 0
- [ ] validate.sh strict passes on this phase folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | zod parse of generated and legacy JSON, freshness predicate | vitest |
| Integration | generate-context write seam populates fields end to end | vitest |
| Manual | validate.sh strict on the phase folder | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| write-provenance.ts source_kind compute | Internal | Green | A8 reuses this value, blocked means no source_kind to surface |
| 015-prodmode-recall-gate | Internal | Yellow | Any field that becomes a retrieval input must pass the C2 gate first, A8 stays logic-only to avoid the block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A schema addition hard-fails a legacy live-root JSON, or the warn check emits error on the legacy corpus.
- **Procedure**: The fields are additive and optional, so revert the schema and generate-context edits, leave existing JSONs untouched since the write is additive on next save only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────────► Phase 2 (Core) ──► Phase 3 (Verify)
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
- [ ] Stage-0 baseline of current JSON shape captured
- [ ] Warn-tier check defaults off
- [ ] Legacy live-root census run before the additions land

### Rollback Procedure
1. Leave the warn-tier check off, so no completion gate fires on the legacy corpus
2. Revert the schema and generate-context edits
3. Re-run validate.sh strict on a sample folder to confirm the old shape still parses
4. No stakeholder notice needed, the change is JSON metadata only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the new fields are additive on next save and no existing JSON body is rewritten destructively
<!-- /ANCHOR:enhanced-rollback -->
