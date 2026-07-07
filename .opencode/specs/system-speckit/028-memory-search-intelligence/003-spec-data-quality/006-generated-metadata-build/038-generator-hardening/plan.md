---
title: "Implementation Plan: Generator Hardening [template:level_2/plan.md]"
description: "Persist a graph-metadata source fingerprint derived from the current source docs over a volatile-ignoring projection, unify the phase-child contract behind one shared listPhaseChildren helper consumed by both isPhaseParent and resolveChildrenIds, and move access and freshness telemetry out of the generated JSON into the DB or index layer, all behind a default-off flag and a grandfather report mode so existing files do not mass-fail."
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/038-generator-hardening"
    last_updated_at: "2026-07-04T17:11:56.393Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the fingerprint, child contract, and telemetry split build"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Generator Hardening

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
| **Language/Stack** | TypeScript spec-kit MCP server lib plus a compiled dist |
| **Framework** | spec-kit graph-metadata generator and folder discovery |
| **Storage** | The graph-metadata.json generated file plus the memory DB or index layer for access and freshness telemetry |
| **Testing** | A vitest over the dist proving the fingerprint, the unified child contract, the telemetry split, and the flag and grandfather mode |

### Overview
This phase hardens the graph-metadata generator with three changes the 031 research ranked P2. It persists a `source_fingerprint` derived from the current source docs over the same volatile-ignoring projection the idempotency compare already uses, so strict validation and a dry-run backfill can prove the stored `causal_summary` and `description` were re-derived from current docs rather than carried forward stale. It unifies the phase-child contract behind one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds`, so the parent classification and the derived `children_ids` set can no longer disagree. It moves `last_accessed_at` and the phase-parent `last_active_child_id` and `last_active_at` pointers out of the generated JSON into the DB or index layer, so a read or a resume updates the access and freshness record without rewriting the generated file. Every behavioral change ships behind a default-off flag and a grandfather report mode so existing files carrying prose statuses and prefixed paths the new contract rejects do not mass-fail on first rollout.
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
Additive hardening over an already-idempotent generator: one new schema field, one shared child helper replacing two divergent paths, and a telemetry relocation from generated JSON to the DB or index layer. No change to the existing idempotency compare, every behavioral change behind a default-off flag and a grandfather report mode.

### Key Components
- **`source_fingerprint`**: a persisted graph-metadata field derived from the current source docs over a volatile-ignoring projection, so a re-derive on unchanged docs yields the same fingerprint and a source-doc change yields a different one. It proves the stored `causal_summary` and `description` were re-derived from current docs.
- **`listPhaseChildren`**: one shared helper that returns the phase-child set, consumed by both `isPhaseParent` and `resolveChildrenIds`, so the parent classification and the derived `children_ids` set agree on what a child is.
- **Access and freshness record**: the relocated `last_accessed_at` and phase-parent `last_active_child_id` and `last_active_at` pointers, stored in the DB or index layer so a read or a resume updates them without rewriting the generated JSON.
- **The default-off flag and grandfather report mode**: the rollout gate that keeps the generator behavior unchanged with the flag off and reports a missing or mismatched fingerprint as a note rather than a strict failure.

### Data Flow
The generator reads the source docs it already reads, derives the `source_fingerprint` over the volatile-ignoring projection, and writes it onto the graph-metadata payload behind the flag. Both `isPhaseParent` and `resolveChildrenIds` call `listPhaseChildren` to resolve the child set, so the parent classification and `children_ids` derive from one source. A read event or a resume routes the access and freshness update to the DB or index layer rather than the generated JSON, so the generated file changes only on a source or structural change. Strict validation reads the `source_fingerprint`, re-derives over the current docs, and reports a mismatch as drift under the grandfather mode, a real failure only after the flag graduates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-metadata-parser.ts` fingerprint | Re-derives `causal_summary` and `description` with no persisted proof the derive matched the current docs | add a `source_fingerprint` write derived over the volatile-ignoring projection of the source docs, behind the default-off flag | a re-derive on unchanged docs yields an identical fingerprint and does not dirty the file, a source-doc change yields a different one |
| `graph-metadata-parser.ts` child contract | `isPhaseParent` and `resolveChildrenIds` resolve children through two separate paths that can disagree | route both through one shared `listPhaseChildren` helper so the parent classification and `children_ids` agree | both helpers call `listPhaseChildren` and agree on a fixture tree, no parent-counted child is absent from `children_ids` |
| `graph-metadata-parser.ts` merge payload | Spreads access and freshness telemetry into the merged payload so a read or resume rewrites the file | stop writing `last_accessed_at`, `last_active_child_id`, and `last_active_at` into the merged payload, route them to the DB or index layer behind the flag | a read and a resume leave the generated JSON byte-identical, proven by a no-op diff |
| `graph-metadata-schema.ts` | The schema has no `source_fingerprint` field | add the optional `source_fingerprint` field, tolerant of absence so a file without it parses under the grandfather mode | the schema accepts a file with and without the field, an absent field is not a schema error |
| `folder-discovery.ts` access telemetry | Emits `last_accessed_at` into the generated description on reads | stop emitting `last_accessed_at` into the generated description, route the access event to the DB or index layer behind the flag | a read updates the access record in the index layer and leaves the generated description byte-identical |
| `scripts/rules/` strict read | No rule asserts the `source_fingerprint` matches a re-derive | create a strict-mode read that re-derives and compares, registered with a grandfather report mode | a missing or mismatched fingerprint reports as a grandfather note, not a strict failure, on an un-migrated file |
| The default-off flag and grandfather mode | No rollout gate exists | add a default-off flag for the writes and a grandfather report mode for the strict read | with the flag off the generator behavior is unchanged and a strict run over an un-migrated file does not exit non-zero |

Required inventories:
- Same-class producers: `rg -n 'source_fingerprint|listPhaseChildren|isPhaseParent|resolveChildrenIds|last_accessed_at|last_active_child_id' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'isPhaseParent|resolveChildrenIds|last_active_child_id|last_accessed_at' .opencode/skills/system-spec-kit`.
- Matrix axes: fingerprint write with flag on and off, fingerprint re-derive on unchanged docs, fingerprint re-derive after a source-doc change, unified child contract on a fixture tree, telemetry split on a read and on a resume, schema with and without the field, strict read under the grandfather mode.
- Algorithm invariant: the fingerprint is derived over the volatile-ignoring projection so a no-op re-derive is identical, both child helpers resolve through `listPhaseChildren`, a read or resume never dirties the generated JSON, and a missing or mismatched fingerprint reports as a grandfather note until the flag graduates.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 031 P0 identity resolver and merge-path lineage guard already shipped, since this phase assumes them as dependencies
- [ ] Confirm the DB or index layer exposes an access and freshness write path the telemetry split can route to
- [ ] Define the volatile-ignoring projection the `source_fingerprint` derives over, matching the projection the idempotency compare already uses
- [ ] Define the default-off flag name and the grandfather report mode the strict read honors

### Phase 2: Core Implementation
- [ ] Add the `source_fingerprint` write to the parser over the volatile-ignoring projection, behind the default-off flag
- [ ] Add the optional `source_fingerprint` field to the schema, tolerant of absence under the grandfather mode
- [ ] Replace the two child-detection paths with one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds`
- [ ] Stop writing `last_accessed_at`, `last_active_child_id`, and `last_active_at` into the generated JSON, route them to the DB or index layer behind the flag
- [ ] Add the strict-mode read that re-derives and compares the `source_fingerprint`, registered with a grandfather report mode

### Phase 3: Verification
- [ ] A re-derive on unchanged source docs yields an identical fingerprint and does not dirty the file, a source-doc change yields a different one
- [ ] `isPhaseParent` and `resolveChildrenIds` both resolve through `listPhaseChildren` and agree on a fixture tree
- [ ] A read and a resume leave the generated JSON byte-identical while updating the access and freshness record in the DB or index layer
- [ ] With the flag default-off the generator behavior is unchanged and a strict run over an un-migrated file reports under the grandfather mode rather than exiting non-zero
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The fingerprint is identical on a no-op re-derive and different after a source-doc change, both child helpers resolve through `listPhaseChildren`, the schema accepts a file with and without the field | `generator-hardening.vitest.ts` over the dist |
| Integration | A read and a resume leave the generated JSON byte-identical while the access and freshness record updates in the DB or index layer, the strict read reports under the grandfather mode on an un-migrated file | `generator-hardening.vitest.ts` plus `validate.sh --strict` over a fixture folder |
| Manual | Confirm with the flag default-off the generator behavior is unchanged and existing files do not mass-fail | inspect a strict run over an existing un-migrated sibling folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 031 P0 identity resolver and merge-path lineage guard | Internal | Yellow | This phase assumes them, so it should not land before the P0 root-cause fixes |
| The DB or index layer access and freshness write path | Internal | Yellow | The telemetry split needs a destination for the relocated access events |
| The existing `graphMetadataEqualIgnoringVolatile` idempotency compare | Internal | Green | The fingerprint reuses its volatile-ignoring projection, so a no-op re-derive stays churn-free |
| A scoped migration before the flag graduates | Internal | Yellow | The grandfather mode reports until the migration clears existing files, then the flag can graduate to strict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fingerprint re-introduces churn, the unified child helper changes an existing child set, or the telemetry split loses a resume pointer.
- **Procedure**: Set the default-off flag off to restore the prior generator behavior, the schema field is optional so existing files stay valid, and the relocated telemetry can read back from the generated pointer until the split is proven.
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
- [ ] The volatile-ignoring projection for the fingerprint matches the idempotency compare
- [ ] The unified child set is proven against the union of the two old helpers on a fixture tree
- [ ] The DB or index layer access write path is confirmed before the telemetry split lands

### Rollback Procedure
1. Set the default-off flag off to restore the prior generator behavior
2. Leave the optional `source_fingerprint` schema field in place, a file without it stays valid
3. Read the access and freshness pointer back from the generated JSON until the split is proven
4. Re-run `validate.sh --strict` to confirm existing files still pass under the grandfather mode

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds an optional schema field and relocates telemetry behind a flag, so turning the flag off restores the prior behavior
<!-- /ANCHOR:enhanced-rollback -->

---
