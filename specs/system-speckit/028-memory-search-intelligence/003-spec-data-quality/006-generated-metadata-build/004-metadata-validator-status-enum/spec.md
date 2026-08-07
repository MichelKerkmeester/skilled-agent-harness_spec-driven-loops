---
title: "Feature Specification: Generated-Metadata Validator and Status Enum [template:level_2/spec.md]"
description: "The generated graph-metadata status field is open. normalizeDerivedStatus returns the raw normalized string for any unknown value and the Zod schema accepts any non-empty string, so em-dash prose becomes a valid status. The shallow GRAPH_METADATA_SHAPE and DESCRIPTION_SHAPE checks run as warnings rather than a real completion gate, and the parser preserves a legacy bad status when a packet has no implementation-summary.md. This phase closes derived.status to a shared enum at the schema boundary, adds a first-class generated-metadata validator wired into strict mode, and re-derives legacy bad statuses instead of preserving them."
trigger_phrases:
  - "generated metadata validator"
  - "derived status enum boundary"
  - "graph metadata integrity rule"
  - "stop preserving bad statuses"
  - "status enum schema close"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/004-metadata-validator-status-enum"
    last_updated_at: "2026-07-04T17:11:56.810Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped status enum, integrity validator and legacy re-derive"
    next_safe_action: "Plan the scoped migration to graduate the grandfather flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-036-metadata-validator-status-enum"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the integrity rule errors or warns on a prefixed specFolder path during the grandfather window"
    answered_questions:
      - "Whether each behavioral fix ships behind a default-off flag or a grandfather report mode, it does, because existing files carry the prose statuses and prefixed paths the new contract rejects"
---
# Feature Specification: Generated-Metadata Validator and Status Enum

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
| **Priority** | P0 |
| **Status** | COMPLETE |
| **Created** | 2026-06-22 |
| **Branch** | `036-metadata-validator-status-enum` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../003-idempotent-writes-cache-upsert/spec.md |
| **Successor** | ../005-drift-gate-synopsis-extractor/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The generated-JSON contract is weak, so bad statuses leak in and no real gate catches them. The status normalizer `normalizeDerivedStatus` returns the raw normalized string in its default branch at `graph-metadata-parser.ts:179-180`, and the Zod schema in `graph-metadata-schema.ts` accepts any non-empty string for `derived.status`, so an em-dash prose value becomes a valid status. The current `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` checks registered in the rule registry are shallow shell guards run at warning level, while the real Zod schemas already exist and are not used as a completion gate. The parser also preserves a legacy bad status. When a packet has no `implementation-summary.md`, the parser keeps the existing status after a normalization that admits arbitrary strings, so a folder that once carried a prose status keeps carrying it across re-derives. The combined effect is that the status enum, the path-prefix shape and the schema invariants regress silently because nothing errors on them under strict mode. The 031 research confirmed each leak against live code in its section 4 ranked proposals 6, 9 and 7 and in its section 6 verification table.

### Purpose
Close `derived.status` to a shared closed enum at the schema boundary so an unknown value resolves to an enum member or null rather than to prose, add a first-class generated-metadata validator `GENERATED_METADATA_INTEGRITY` that validates both `description.json` and `graph-metadata.json` through the shared schemas plus the path-prefix and enum invariants and is registered as an error in strict mode behind a grandfather report mode for first rollout, and stop preserving bad legacy statuses so the parser re-derives on the closed enum instead of carrying prose forward. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because existing files carry the prose statuses and prefixed paths the new contract rejects and would mass-fail without a scoped migration window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared `GRAPH_METADATA_STATUS_VALUES` const and a `z.enum` schema for `derived.status` in `graph-metadata-schema.ts`, so the schema rejects any value outside the closed set rather than accepting any non-empty string.
- A `normalizeDerivedStatus` change in `graph-metadata-parser.ts` so the default branch returns an enum value or null rather than the raw normalized string, removing the prose leak at the resolver.
- A first-class `GENERATED_METADATA_INTEGRITY` rule that validates `description.json` and `graph-metadata.json` through the shared Zod schemas plus the path-prefix and enum invariants, registered in the rule registry as an error under strict mode and behind a grandfather report mode for the first rollout window.
- A parser change so a missing `implementation-summary.md` preserves an existing status only when it is already an enum value, otherwise re-derives or falls back to `planned` plus a review flag, replacing the current preserve-anything path.
- A default-off flag or grandfather report mode that gates the error-level behavior of the integrity rule and the re-derive path, so existing prefixed paths and prose statuses report rather than block until the scoped migration lands.

### Out of Scope
- The shared spec-folder identity resolver and the merge-path lineage guard (ranks 2 and 3) - those are separate phases and this phase asserts against the identity invariants without authoring the resolver.
- The description idempotency and the global-cache upsert (ranks 5 and 8) - the write-determinism work is description-side and is not gated here.
- The drift gate, the shared synopsis extractor and the authoritative z_* exclusion helper (ranks 10, 11, 12) - they are downstream P1 hardening, not part of the status enum and validator close.
- The backfill scope boundary and the backfill failure isolation (ranks 1 and 4) - those are scope-side fixes, not the schema and validator boundary.
- A mass migration of existing files - this phase ships the contract behind a grandfather window, the bulk re-stamp of legacy files is a separate migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add `GRAPH_METADATA_STATUS_VALUES` and switch `derived.status` to a `z.enum` closed set |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Make `normalizeDerivedStatus` return an enum value or null, and preserve a legacy status only when it is already an enum value |
| `.opencode/skills/system-spec-kit/scripts/rules/` | Create | Add the `GENERATED_METADATA_INTEGRITY` rule bridge validating both JSON files through the shared schemas plus path-prefix and enum invariants |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register `GENERATED_METADATA_INTEGRITY` as an error in strict mode with a grandfather report mode flag |
| `.opencode/skills/system-spec-kit/scripts/tests/` | Create | Add a vitest proving the enum close, the validator verdict and the legacy re-derive behind the flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Source Rec |
|----|-------------|---------------------|------------|
| REQ-001 | The `derived.status` field MUST be a closed enum at the schema boundary, sourced from a shared `GRAPH_METADATA_STATUS_VALUES` const and enforced by `z.enum`, and `normalizeDerivedStatus` MUST return only an enum value or null | A unit assertion confirms the schema rejects an em-dash prose status, the normalizer returns null for an unknown value rather than the raw string, and `GRAPH_METADATA_STATUS_VALUES` is the single source the schema and normalizer both read | #6 |
| REQ-002 | A first-class `GENERATED_METADATA_INTEGRITY` rule MUST validate `description.json` and `graph-metadata.json` through the shared Zod schemas plus the path-prefix and enum invariants, registered as an error under strict mode | A strict run over a folder whose `graph-metadata.json` carries a prose status exits with an error from the integrity rule, and a clean folder passes, and the rule reads the shared schema not a shallow shell shape | #9 |
| REQ-003 | The integrity rule and the re-derive path MUST ship behind a default-off flag or a grandfather report mode so existing prefixed paths and prose statuses report rather than block until the scoped migration lands | With the grandfather mode on, a legacy folder reports the violation as a non-blocking warning and strict mode does not fail on it, and with the flag off the same folder errors, proven by a unit assertion on both arms | #6, #9, #7 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Source Rec |
|----|-------------|---------------------|------------|
| REQ-004 | WHEN a packet has no `implementation-summary.md` the parser SHALL preserve an existing status only when it is already an enum value, otherwise re-derive or fall back to `planned` plus a review flag, rather than preserving an arbitrary string | A unit assertion confirms a folder with a prose status and no `implementation-summary.md` re-derives to an enum value or falls back to `planned` with the review flag set, and a folder whose existing status is already an enum value keeps it | #7 |
| REQ-005 | The status enum, the integrity rule and the re-derive path SHALL share one `GRAPH_METADATA_STATUS_VALUES` const so the schema, the normalizer, the validator and the parser agree on the closed set | A grep confirms a single declaration of `GRAPH_METADATA_STATUS_VALUES` and that the schema, the normalizer, the integrity rule and the parser re-derive all import it rather than re-listing literals | #6, #7, #9 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An em-dash prose status fails schema validation and the normalizer returns null for it, proving `derived.status` is closed at the boundary rather than admitting prose (REQ-001, rec #6).
- **SC-002**: A strict run over a folder carrying a prose status or a prefixed `specFolder` errors from `GENERATED_METADATA_INTEGRITY` rather than passing as a shallow warning, proving the validator is a real gate (REQ-002, rec #9).
- **SC-003**: With the grandfather report mode on, a legacy folder that carries a prose status or a prefixed path reports a non-blocking warning and strict mode passes, and with the flag off the same folder errors, proving the contract ships behind a migration window (REQ-003).
- **SC-004**: A folder with no `implementation-summary.md` and a prose status re-derives to an enum value or falls back to `planned` with a review flag, while a folder whose existing status is already an enum value keeps it, proving the parser stops preserving bad legacy statuses (REQ-004, rec #7).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing files carry prose statuses and prefixed paths the new contract rejects | High | Ship the integrity rule and the re-derive path behind a default-off flag or a grandfather report mode, graduate to error only after a scoped migration |
| Risk | Closing the enum re-derives a status a reviewer expected to stay frozen | Medium | Preserve an existing status when it is already an enum value, fall back to `planned` plus a review flag only when the existing value is not an enum member |
| Dependency | The shared Zod schemas in `graph-metadata-schema.ts` already exist | Internal | The validator reuses the real schemas rather than the shallow shell shape, so the dependency is present and the rule is a bridge not a rewrite |
| Dependency | The rule registry and strict-mode wiring in `validate.sh` | Internal | Register the new rule in the existing registry and reuse the strict-mode pathway, no new validation harness |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The integrity rule validates the two JSON files per folder through the existing schemas, adding no second parse pass beyond the schema parse the rule already performs.

### Reliability
- **NFR-R01**: The status enum and the integrity verdict are deterministic on a fixed folder, so a rerun over the same inputs returns the same verdict and the same re-derived status.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `graph-metadata.json` whose `derived.status` is an em-dash prose string: the schema rejects it and the normalizer returns null, and under the grandfather mode the integrity rule reports it as a warning rather than blocking.
- A `description.json` whose `specFolder` carries a `.opencode/specs/` prefix: the path-prefix invariant flags it, blocking when the flag is off and reporting when the grandfather mode is on.

### Error Scenarios
- A folder with no `implementation-summary.md` and a prose status: the parser re-derives to an enum value or falls back to `planned` plus a review flag rather than preserving the prose.
- A missing or unparseable JSON file: the integrity rule fails closed with a clear contract error rather than passing the folder as clean.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One schema enum close, one normalizer change, one parser re-derive change, one new rule bridge and its registry entry, all behind a grandfather flag |
| Risk | 9/25 | No ranking change, the risk is the migration window, existing files carry the prose statuses and prefixed paths the new contract rejects |
| Research | 4/20 | Seams already verified to file:line in the 031 research section 4 and section 6 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- RESOLVED. The integrity rule reports a prefixed `specFolder` path non-blocking under the grandfather window and errors only when the grandfather flag is off, so the prefixed path stays surfaced until the identity resolver migration lands.
- RESOLVED. The `planned` fallback for a non-enum legacy status sets `status_review_required` in the graph-metadata JSON, mirroring the existing `parent_id_review_required` field, so the dropped status is surfaced in the file rather than only in the validator report.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Data-quality contract close. The verdict is GO-on-cost and buildable-now. The three recs touch the schema boundary, the rule registry and the parser re-derive, all of which already exist and are reused rather than rewritten. Rec #6 closes `derived.status` to a `z.enum` sourced from a shared const so the normalizer returns an enum value or null instead of prose. Rec #9 adds the `GENERATED_METADATA_INTEGRITY` rule that validates both JSON files through the shared schemas and the path-prefix and enum invariants and registers as an error in strict mode. Rec #7 stops the parser preserving a legacy bad status, re-deriving on the closed enum or falling back to `planned` plus a review flag. Every behavioral fix ships behind a default-off flag or a grandfather report mode, because the 031 research section 5 theme 7 confirmed that many existing files carry the very prose statuses and prefixed paths the new contract rejects, so the contract graduates to error only after a scoped migration. The direction is the convergent enforcement three angles reached in the research, turning shallow warning-level shell checks into a real completion gate.
<!-- /ANCHOR:verdict -->
