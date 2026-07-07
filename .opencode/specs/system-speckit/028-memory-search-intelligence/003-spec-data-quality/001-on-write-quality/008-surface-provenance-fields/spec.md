---
title: "Feature Specification: A8 Surface Provenance Fields [template:level_2/spec.md]"
description: "The memory side already computes source_kind and provenance but the two metadata JSONs never expose them, and causal_summary is not freshness-bound to the source_docs it summarizes. This phase surfaces those fields as first-class JSON fields and binds causal_summary freshness to source_docs."
trigger_phrases:
  - "surface provenance fields"
  - "source kind json"
  - "content type freshness"
  - "causal summary source docs"
  - "metadata json governance"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/008-surface-provenance-fields"
    last_updated_at: "2026-07-04T17:12:00.389Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the A8 phase spec from the research synthesis"
    next_safe_action: "Run the generators then plan the schema and write-path changes"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "a8-spec-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether content_type and document_weight have a compute site to reuse or must be derived fresh"
    answered_questions:
      - "source_kind is already computed and persisted on the memory side"
---
# Feature Specification: A8 Surface Provenance Fields

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
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `008-surface-provenance-fields` |
| **Verdict** | GO-on-cost (Tier A, floor-bypassing on-write) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory side already computes provenance and `source_kind` for every saved row, but the two metadata JSONs never expose them as first-class fields. `write-provenance.ts:7` defines the `SourceKind` union and `:141-182` derive and persist it onto `memory_index`, yet `description-schema.ts` and `graph-metadata-schema.ts` carry no `source_kind`, `provenance`, `content_type`, `document_weight` or freshness field, so a logic and governance reader cannot tell a human-authored doc from an imported or agent-generated one. Separately, `graph-metadata-schema.ts:47 causal_summary` and `:52 source_docs` both ship but are not coupled, so a `causal_summary` can silently outlive the `source_docs` it was derived from with no staleness signal.

### Purpose
Expose the already-computed provenance governance fields as first-class JSON fields and freshness-bind `causal_summary` to `source_docs` so logic and governance readers get an honest, machine-checkable provenance and staleness signal with zero re-index.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `source_kind` and a `provenance` block to the `description.json` zod schema, sourced from the value `write-provenance.ts` already persists.
- Add `content_type` and a `document_weight` governance field plus a `temporal` or freshness block to the JSON schemas, reusing an existing compute site when one is found and deriving on-write when one is not.
- Freshness-bind `causal_summary` to `source_docs` in `graph-metadata-schema.ts` so a `causal_summary` that predates its newest `source_docs` mtime is flagged stale.
- Populate the new fields at the existing `generate-context.ts:398 atomicWriteJson` write seam (graph write at `:587`) with no new write path.
- A warn-tier validation check that the surfaced fields are present and internally coherent, default-off so the legacy corpus never breaks.

### Out of Scope
- Re-implementing provenance or `source_kind` compute. The memory side already owns it. - reuse only.
- Any retrieval-class fusion of these fields into the vector. - that is C3 and C2-gated, not A8.
- Mutating any authored doc body. - this phase touches JSON metadata only.
- Promoting the new validation check to error. - the four-beat migration to error is a separate governance phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Modify | Add `source_kind`, `provenance`, `content_type` fields |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add `document_weight` and freshness fields, bind `causal_summary` to `source_docs` |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Populate the new fields at the `atomicWriteJson` write seam |
| `.opencode/skills/system-spec-kit/scripts/validation/content-quality.ts` | Modify or Create | Add a warn-tier provenance-field coherence check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When `generate-context.ts` writes `description.json`, the system SHALL include `source_kind` sourced from the value `write-provenance.ts` persists for that packet. | A freshly generated `description.json` carries a `source_kind` from the `SourceKind` union and a parse against the updated schema passes. |
| REQ-002 | When `generate-context.ts` writes `graph-metadata.json` at the `:587` seam, the system SHALL emit a freshness binding so a `causal_summary` older than the newest `source_docs` mtime is flagged stale. | A graph file whose `causal_summary` predates a `source_docs` entry validates as stale, a fresh one validates as current. |
| REQ-003 | The updated zod schemas SHALL accept every existing live-root JSON without a new hard failure. | The Stage-0 census count of newly-failing live-root files after the field additions is 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The system SHALL surface `content_type` and a `document_weight` governance field in the JSONs, reusing a compute site when one exists and deriving on-write when none does. | Both fields are present on a freshly generated JSON, with a noted source for each value. |
| REQ-005 | A new warn-tier check SHALL assert the surfaced provenance fields are present and internally coherent, default-off. | The check emits warn not error on a legacy file missing the fields, and emits a coherence warning on a contradictory file. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A freshly generated `description.json` and `graph-metadata.json` carry the surfaced provenance fields, each value traced to its compute or derive source.
- **SC-002**: A `causal_summary` that predates its newest `source_docs` mtime is flagged stale, with zero re-index required.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-prodmode-recall-gate` | Any field that becomes a retrieval input must pass the C2 prod-mode gate first. | A8 surfaces fields for logic and governance only, the retrieval fusion stays out of scope and C2-gated. |
| Dependency | `write-provenance.ts` `source_kind` compute | A8 reuses, never re-implements, this value. | Read the persisted `source_kind`, do not recompute it. |
| Risk | `content_type` or `document_weight` have no reuse compute site | Med | If no compute site is found, derive on-write and record the derive source rather than claiming a reuse that does not exist. |
| Risk | Schema additions hard-fail legacy live-root JSONs | Med | Land new fields optional and warn-tier first, hold the four-beat migration to error for a later phase. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No re-index. The fields are surfaced at the existing JSON write seam, retrieval cost is unchanged.

### Security
- **NFR-S01**: Provenance values are read from the existing trust boundary, no new actor or signing surface is introduced.

### Reliability
- **NFR-R01**: A missing or null provenance field degrades to warn, never an error, on the legacy corpus.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing `source_kind`: the field is null and the warn check flags it, the write never fails.
- Empty `source_docs`: the freshness binding is vacuously current, no stale flag.
- Unknown `content_type`: derive falls back to a `general` default and records the fallback.

### Error Scenarios
- No compute site for `document_weight`: derive on-write and note the derive source, do not fabricate a reuse claim.
- A `causal_summary` with no `source_docs` mtime available: treat freshness as unknown, not stale.

### State Transitions
- Legacy JSON re-saved: new fields are added additively on the next save, no destructive rewrite.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3 to 4 files, two zod schemas plus one write seam plus one warn check |
| Risk | 8/25 | No re-index, no body mutation, additive optional fields, legacy-safe |
| Research | 6/20 | One open question, the `content_type` and `document_weight` compute site |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
- Does `content_type` or `document_weight` have an existing compute site to reuse, or must each be derived fresh on-write? The two named files compute `source_kind` but the grep for `document_weight`, `content_type` and `freshness` in `pe-gating.ts` and `write-provenance.ts` is empty.
- Should the freshness binding compare `source_docs` mtime or a stored `last_save_at`, given `graph-metadata-schema.ts:49 last_save_at` already exists?
<!-- /ANCHOR:questions -->
