---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will persist a graph-metadata source fingerprint, unify the phase-child contract behind one shared listPhaseChildren helper, and move access and freshness telemetry out of the generated JSON, all behind a default-off flag and a grandfather report mode. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the planned-state hardening phase doc set"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-generator-hardening |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Graph-metadata source fingerprint

The phase will add a persisted `source_fingerprint` to `graph-metadata.json` derived from the current source docs over the same volatile-ignoring projection the idempotency compare already uses. Today the generator re-derives the `causal_summary` and the `description` but carries no proof that the stored values match the docs they claim to summarize, so a stale snapshot can ride forward unnoticed. The fingerprint lets strict validation and a dry-run backfill prove the derived fields were re-derived from current docs rather than carried forward. Because the derive runs over the volatile-ignoring projection, a re-derive on unchanged docs yields an identical fingerprint and does not dirty the file, so the field is drift-detection and not new churn. The 031 research ranks this P2 because graph metadata is already idempotent, the fingerprint is hardening rather than a fix.

### Unified phase-child contract

The phase will replace the two separate child-detection paths with one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds`. Today the parent classification and the derived `children_ids` set resolve children through different code, so they can disagree and a re-derive can produce a `children_ids` set that does not match the parent classification. Routing both helpers through one source means a child the parent counts is never absent from `children_ids` and the two can no longer drift apart.

### Access and freshness telemetry split

The phase will move `last_accessed_at` and the phase-parent `last_active_child_id` and `last_active_at` pointers out of the generated JSON into the DB or index layer. Today these mutate the generated file on reads and resumes, so a no-op read or a resume dirties an otherwise-unchanged generated file and produces the unscoped cross-session commit churn the 031 study identifies as the dominant visible symptom. After the split a read or a resume updates the access and freshness record in the DB or index layer and leaves the generated JSON byte-identical, so the generated files change only on a source or structural change. A resume still resolves the last active child by reading the pointer from the DB or index layer.

### Rollout gate

Every behavioral change will ship behind a default-off flag and a grandfather report mode. With the flag default-off the generator behavior is unchanged, and the strict read reports a missing or mismatched `source_fingerprint` under the grandfather mode rather than failing, so existing files carrying the prose statuses and prefixed paths the new contract rejects do not mass-fail on first rollout. The flag graduates to default-on only after a scoped migration clears the existing files.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Add the `source_fingerprint` write, route both child helpers through `listPhaseChildren`, and stop writing telemetry into the merged payload, behind the flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the optional `source_fingerprint` field tolerant of absence under the grandfather mode |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Stop emitting `last_accessed_at` into the generated description, route access events to the DB or index layer behind the flag |
| `.opencode/skills/system-spec-kit/scripts/rules/` | Planned create | A strict-mode read that re-derives and compares the `source_fingerprint`, with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/generator-hardening.vitest.ts` | Planned create | The vitest proving the fingerprint, the unified child contract, the telemetry split, the flag, and the grandfather mode |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence confirms the 031 P0 dependencies and the DB or index access path first, then defines the volatile-ignoring projection and the flag, then adds the fingerprint write and the schema field, unifies the child contract behind `listPhaseChildren`, and routes the telemetry split. The proofs land with the code: a no-op re-derive yields an identical fingerprint, a source-doc change yields a different one, both child helpers agree on a fixture tree, a read and a resume leave the generated JSON byte-identical, and a strict run over an un-migrated file reports under the grandfather mode rather than exiting non-zero.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the `source_fingerprint` as hardening not a fix | Graph metadata is already idempotent through `graphMetadataEqualIgnoringVolatile` and the no-op skip, so the fingerprint proves the derived fields are fresh rather than fixing determinism |
| Derive the fingerprint over the volatile-ignoring projection | A fingerprint over the raw payload would change on every timestamp, so it must reuse the idempotency projection or it re-introduces the churn the compare already prevents |
| Unify the child contract behind one `listPhaseChildren` helper | Two separate child-detection paths can disagree, so one shared source keeps the parent classification and `children_ids` aligned |
| Move access and freshness telemetry to the DB or index layer | Storing it in generated JSON dirties the file on reads and resumes, which is the dominant churn symptom, so the generated files should change only on a source or structural change |
| Ship every behavioral change behind a default-off flag and a grandfather report mode | Existing files carry the prose statuses and prefixed paths the new contract rejects, so a strict-by-default rollout would mass-fail un-migrated files |
| Sequence the phase after the 031 P0 fixes | The fingerprint and the child contract assume the identity resolver and the merge-path lineage guard, so this P2 refinement is deferred to a backlog after the root-cause fixes land |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned docs gate is `validate.sh --strict` and the planned test gate is `generator-hardening.vitest.ts` over the dist.

| Check | Result |
|-------|--------|
| A re-derive on unchanged source docs yields an identical fingerprint and does not dirty the file | PLANNED, not yet run |
| A source-doc change yields a different fingerprint | PLANNED, not yet run |
| `isPhaseParent` and `resolveChildrenIds` both resolve through `listPhaseChildren` and agree on a fixture tree | PLANNED, not yet run |
| A read and a resume leave the generated JSON byte-identical while the access record updates in the DB or index layer | PLANNED, not yet run |
| A resume still resolves the last active child from the DB or index layer | PLANNED, not yet run |
| A strict run over an un-migrated file reports under the grandfather mode rather than exiting non-zero | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Dependency precondition.** The fingerprint and the unified child contract assume the 031 P0 identity resolver and merge-path lineage guard already shipped, so this phase should not land before them.
3. **Open projection question.** Which hash input set defines the `source_fingerprint` without re-introducing volatile drift is unresolved until the projection is fixed against the idempotency compare.
4. **Grandfather precondition.** The flag stays default-off and the strict read stays in grandfather report mode until a scoped migration clears the existing files that carry the prose statuses and prefixed paths the new contract rejects.
<!-- /ANCHOR:limitations -->

---
