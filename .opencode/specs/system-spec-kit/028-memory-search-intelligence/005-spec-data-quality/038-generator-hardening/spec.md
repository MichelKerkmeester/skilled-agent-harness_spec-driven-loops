---
title: "Feature Specification: Generator Hardening [template:level_2/spec.md]"
description: "The graph-metadata generator carries no proof that its derived fields were re-derived from current source docs and the phase-child contract is split across two helpers that can disagree, while access and freshness telemetry mutate the generated JSON on reads and resumes so a no-op read dirties an unchanged file. This phase persists a graph-metadata source fingerprint, unifies the phase-child contract behind one helper, and moves access and freshness telemetry out of generated JSON, all behind a default-off flag and a grandfather report mode so existing files that carry prose statuses and prefixed paths do not mass-fail."
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded generator hardening phase from recs 13 and 14"
    next_safe_action: "Run speckit plan to decompose the fingerprint and telemetry split build"
    blockers: []
    key_files:
      - "../031-generated-json-quality-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which hash input set defines source_fingerprint without re-introducing volatile drift"
    answered_questions:
      - "Whether the fingerprint is a fix or hardening, it is hardening because graph metadata is already idempotent"
---
# Feature Specification: Generator Hardening

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
| **Priority** | P1 |
| **Status** | PLANNED |
| **Created** | 2026-06-22 |
| **Branch** | `038-generator-hardening` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The graph-metadata generator and the JSON it produces carry two residual hardening gaps that the 031 research ranked P2 because neither is a fix for a live crash, both are protections against silent drift and churn. Graph metadata is already idempotent through `graphMetadataEqualIgnoringVolatile` and the no-op skip at `graph-metadata-parser.ts:1275-1286`, so a rerun on unchanged content does not bump the volatile timestamps. What it cannot do today is prove that its derived fields, the `causal_summary` and the `description`, were re-derived from the current source docs rather than carried forward from a stale snapshot, because no persisted source fingerprint exists to compare against. The same generator also splits the phase-child contract across two code paths, `isPhaseParent` and `resolveChildrenIds`, so the two helpers can disagree on what counts as a child and a re-derive can produce a `children_ids` set that does not match the parent classification. Separately, access and freshness telemetry, `last_accessed_at` and the phase-parent `last_active_child_id` and `last_active_at` pointers, are stored inside the generated JSON and are mutated on reads and resumes, so a no-op read or a resume dirties an otherwise-unchanged generated file and produces the unscoped cross-session commit churn that the 031 study identifies as the dominant visible symptom. The net effect is that drift cannot be proven, the child contract can diverge, and a read can dirty a generated file.

### Purpose
Persist a graph-metadata `source_fingerprint` derived from the current source docs so strict validation and a dry-run backfill can prove that the stored derived fields match the docs they claim to summarize, unify the phase-child contract behind one shared `listPhaseChildren` helper so `isPhaseParent` and `resolveChildrenIds` agree on what a child is, and move access and freshness telemetry out of the generated JSON into the DB or index layer so the generated files change only on a source or structural change and not on a read or a resume. Every behavioral change ships behind a default-off flag or a grandfather report mode so the existing files that carry prose statuses and prefixed paths the new contract would reject do not mass-fail on the first rollout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A persisted `source_fingerprint` field on `graph-metadata.json` derived from the current source docs, written by the generator and read by strict validation and a dry-run backfill to prove the stored `causal_summary` and `description` were re-derived from the current docs rather than carried forward stale, ignoring volatile timestamps so the fingerprint does not re-introduce the churn the idempotency compare already prevents.
- One shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds` so the parent classification and the derived `children_ids` set agree on the phase-child definition, replacing the two separate child-detection paths.
- Moving `last_accessed_at` and the phase-parent `last_active_child_id` and `last_active_at` pointers out of the generated JSON into the DB or index layer, so a read event or a resume updates the access and freshness record without rewriting the generated file, and the generated JSON changes only on a source or structural change.
- A schema addition for `source_fingerprint` on the graph-metadata schema and the strict-mode read path that asserts it, gated so a file without the field reports under a grandfather mode rather than failing.
- A default-off flag for the fingerprint write and the telemetry split, plus a grandfather report mode for the fingerprint read, so existing files carrying prose statuses and prefixed paths the new contract rejects surface as a report rather than a strict failure on first rollout.

### Out of Scope
- The scoped backfill boundary, the shared identity resolver, the merge-path lineage guard, the description idempotency, the status enum, the global-cache upsert, and the first-class validator. Those are the 031 P0 root-cause fixes and the P1 hardening that land in earlier phases and are dependencies this phase assumes already shipped, not work this phase repeats.
- Any change to the existing `graphMetadataEqualIgnoringVolatile` idempotency compare or the no-op skip. Graph metadata is already idempotent, so this phase adds a fingerprint and a telemetry split on top of that contract, it does not re-derive determinism.
- The split exclusion policy and the z_* helper. Those are a separate P1 hardening item, not part of the fingerprint or telemetry work.
- Graduating the default-off flag to default-on. This phase ships the flag default-off and the grandfather report mode, the graduation is a later scoped migration after existing files are migrated.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Add the `source_fingerprint` write derived from the current source docs, route both `isPhaseParent` and `resolveChildrenIds` through one shared `listPhaseChildren` helper, and stop writing access and freshness telemetry into the merged payload, all behind a default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add the optional `source_fingerprint` field to the schema and keep it tolerant under the grandfather mode so a file without it does not fail at the schema boundary |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Stop emitting `last_accessed_at` into the generated description and route access events to the DB or index layer instead, behind the default-off flag |
| `.opencode/skills/system-spec-kit/scripts/rules/` | Create | A strict-mode read that asserts the `source_fingerprint` matches a re-derive of the current docs, registered with a grandfather report mode for the first rollout |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/generator-hardening.vitest.ts` | Create | A vitest proving the fingerprint write and read, the unified child contract, the telemetry split, the default-off flag, and the grandfather report mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The generator MUST write a `source_fingerprint` derived from the current source docs that ignores volatile timestamps, and a re-derive on unchanged docs MUST produce the same fingerprint so the field does not re-introduce churn (rec 13) | A unit assertion shows a re-derive on unchanged source docs yields an identical `source_fingerprint` and does not dirty the file, and a change to a source doc yields a different fingerprint |
| REQ-002 | The phase-child contract MUST be unified behind one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds`, so the parent classification and the derived `children_ids` set never disagree (rec 13) | A unit assertion confirms `isPhaseParent` and `resolveChildrenIds` both call `listPhaseChildren` and agree on a fixture tree, and a child the parent classification counts is never absent from the derived `children_ids` |
| REQ-003 | Access and freshness telemetry, `last_accessed_at` and the phase-parent `last_active_child_id` and `last_active_at` pointers, MUST be moved out of the generated JSON into the DB or index layer so a read event or a resume does not rewrite the generated file (rec 14) | A read event and a resume update the access and freshness record in the DB or index layer and leave the generated JSON byte-identical, proven by a no-op diff after a read |
| REQ-004 | Every behavioral change MUST ship behind a default-off flag or a grandfather report mode, so existing files carrying prose statuses and prefixed paths the new contract rejects do not mass-fail on first rollout | With the flag default-off the generator behavior is unchanged, and the strict read reports a missing or mismatched `source_fingerprint` under the grandfather mode rather than failing, proven by a strict run over an existing un-migrated file that does not exit non-zero |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The `source_fingerprint` SHALL be added to the graph-metadata schema as an optional field that is tolerant of absence so a file without it parses, and a strict-mode read SHALL assert it under the grandfather mode (rec 13) | The schema accepts a file with and without `source_fingerprint`, and the strict rule reports a missing field as a grandfather note rather than a schema error |
| REQ-006 | The telemetry split SHALL preserve the access and freshness signal so a resume still finds the last active child, reading the pointer from the DB or index layer rather than the generated JSON (rec 14) | A resume after the split still resolves the last active child from the DB or index layer, proven by a resume that selects the same child the pre-split pointer would have selected |
| REQ-007 | A `generator-hardening.vitest.ts` SHALL prove the fingerprint write and read, the unified child contract, the telemetry split, the default-off flag, and the grandfather report mode | The vitest covers all four P0 requirements and the two P1 requirements and passes on the dist build |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A re-derive on unchanged source docs yields an identical `source_fingerprint` and does not dirty the generated file, while a source-doc change yields a different fingerprint, proving the field is drift-detection not churn.
- **SC-002**: `isPhaseParent` and `resolveChildrenIds` both resolve children through `listPhaseChildren` and agree on a fixture tree, so the parent classification and the derived `children_ids` set cannot diverge.
- **SC-003**: A read event and a resume leave the generated JSON byte-identical while updating the access and freshness record in the DB or index layer, proving the telemetry split removes the read-time churn.
- **SC-004**: With the flag default-off the generator behavior is unchanged and a strict run over an existing un-migrated file reports a missing `source_fingerprint` under the grandfather mode rather than exiting non-zero, proving the rollout does not mass-fail existing files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 031 P0 identity resolver and merge guard | The fingerprint and the unified child contract assume the resolver and the merge-path lineage guard already shipped, so this phase breaks if it lands before them | Sequence this phase after the P0 root-cause fixes per the 031 recommended build order, this is a P2 refinement deferred to a backlog |
| Dependency | The DB or index layer access record | The telemetry split needs a place to store access and freshness events, so it depends on the index layer accepting the access write | Confirm the index layer access path exists before the split lands, and keep the generated pointer readable until the split is proven |
| Risk | The `source_fingerprint` re-introduces volatile churn | High | Derive the fingerprint over a volatile-ignoring projection of the source docs, the same projection the idempotency compare already uses, so a no-op re-derive yields an identical fingerprint |
| Risk | The unified `listPhaseChildren` changes the child set for an existing parent | Med | Prove `listPhaseChildren` matches the union of the two existing helpers on a fixture tree before the cutover, and ship the cutover behind the default-off flag |
| Risk | The grandfather mode masks a real fingerprint mismatch | Med | Keep the grandfather mode a report not a silence, so a mismatch surfaces as a note the migration must clear, and graduate to strict only after the scoped migration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `source_fingerprint` derive runs over the source docs the generator already reads, so it adds no second tree walk and no second file read.

### Reliability
- **NFR-R01**: The fingerprint is deterministic on a fixed source-doc set, so the strict read is stable across reruns of the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An existing file with no `source_fingerprint`: the schema accepts it and the strict read reports it under the grandfather mode rather than failing, so the rollout does not mass-fail un-migrated files.
- A phase parent whose two old child helpers disagreed: `listPhaseChildren` resolves one child set and the cutover behind the flag proves the new set against the union of the old two before it ships.

### Error Scenarios
- A source-doc change with no re-derive: the strict read reports a fingerprint mismatch as drift, which is the signal the field exists to surface.
- A read event with the index layer unavailable: the access write fails closed in the index layer and the generated JSON stays byte-identical, so a telemetry write failure never dirties the generated file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One schema field, one shared child helper, a telemetry split across the parser and discovery, and a strict read, all behind a default-off flag and a grandfather mode |
| Risk | 7/25 | No live crash, the risk is re-introducing churn through the fingerprint and changing an existing child set, both ship behind the flag |
| Research | 4/20 | Seams verified to file:line in the 031 research section 4 and section 6 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which hash input set defines the `source_fingerprint` without re-introducing volatile drift, given the idempotency compare already projects over a volatile-ignoring view.
- Whether the access and freshness record lives in the memory DB or the index layer, given a resume must still resolve the last active child after the split.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

P2 hardening refinement. The verdict for this phase is GO-on-cost and deferred-after-P0. The 031 research ranks both recommendations P2 because neither is a fix for a live crash, graph metadata is already idempotent through `graphMetadataEqualIgnoringVolatile` and the no-op skip at `graph-metadata-parser.ts:1275-1286`, so the `source_fingerprint` is hardening that proves the derived fields were re-derived from current docs, not a determinism fix. The telemetry split is the larger refactor the study scopes after the P0 and P1 work lands, because moving `last_accessed_at` and the phase-parent pointers out of generated JSON removes the read-time and resume-time churn that is the dominant visible symptom. Both ship behind a default-off flag and a grandfather report mode because the existing files carry the prose statuses and prefixed paths the new contract rejects, so a strict-by-default rollout would mass-fail un-migrated files. The direction is to harden after the root-cause fixes, prove the fingerprint does not re-introduce churn, and graduate to strict only after a scoped migration.
<!-- /ANCHOR:verdict -->
