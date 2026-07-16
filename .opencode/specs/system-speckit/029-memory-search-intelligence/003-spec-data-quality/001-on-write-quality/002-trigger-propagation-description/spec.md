---
title: "Feature Specification: A2 Trigger Propagation and Derived Description [template:level_2/spec.md]"
description: "description.json never carries the curated frontmatter trigger_phrases and its description is a verbatim copy of the spec title. Propagate the curated triggers into the JSON and derive a real extractive description so the retrieval and adherence readers stop seeing a title where a description and triggers should be."
trigger_phrases:
  - "trigger propagation description"
  - "extractive description derive"
  - "description json triggers"
  - "extractTriggersFromContent cap"
  - "subset coherence triggers"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/002-trigger-propagation-description"
    last_updated_at: "2026-07-04T17:12:01.703Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the A2 spec grounded to the description-generator seams"
    next_safe_action: "Plan the build that populates description.json triggers and derived text"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:a2b7c1e0f4938d652170c5a8b9e6d3471f2086c0d5e93b487a1f6c20e9d745b3"
      session_id: "a2-trigger-propagation-description-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the curated frontmatter triggers should override or merge with the derived extractive set when both exist"
    answered_questions:
      - "Whether the assertion is subset or equality (subset, the derived set is capped)"
---
# Feature Specification: A2 Trigger Propagation and Derived Description

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
| **Branch** | `002-trigger-propagation-description` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../001-extend-quality-loop-authored/spec.md |
| **Successor** | ../003-enum-constrain-schemas/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The per-folder `description.json` generator never propagates the curated frontmatter `trigger_phrases` and its `description` is a verbatim copy of the spec title. `extractDescription` Pass 1 returns the first `# ` heading unchanged (`folder-discovery.ts:455-461`), `generatePerFolderDescription` builds the record with `description` and `keywords` but no `trigger_phrases` key (`folder-discovery.ts:872-902`), and the field is declared optional in both the interface (`folder-discovery.ts:54`) and the schema (`description-schema.ts:66`) yet is never written. The live sibling `005/description.json` proves both gaps in one file. Its `description` reads "Feature Specification: Spec-Kit Data Quality by Default" and it carries no `trigger_phrases` key at all even though `005/spec.md` frontmatter holds five curated triggers.

### Purpose
The retrieval and adherence readers see a real extractive description and the curated trigger vocabulary in `description.json`, not a title echo and a missing field.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Populate `trigger_phrases` in `generatePerFolderDescription` from the curated frontmatter `trigger_phrases` plus the derived extractive set, additive and capped at 12.
- Derive a real extractive `description` instead of copying the title verbatim, demoting the title-copy from Pass 1 to a last-resort fallback so a Problem or Purpose line wins when present.
- Raise the `extractTriggersFromContent` cap from 8 to 12 (`quality-loop.ts:515`) so the derived set matches the propagated cap.
- Add the subset coherence check the curated-to-derived relationship requires (the curated set is the authority, the derived set fills gaps, the assertion is subset not byte equality).

### Out of Scope
- The cross-surface `trigger_phrases` coherence gate spanning frontmatter, description.json and graph-metadata.derived. That is A5 and lands as its own phase.
- The `CONTENT_QUALITY` validate.sh rule and the live-save scorer hooks. Those are A1 and the shared engine, this phase only fixes the field-population seam.
- Any change to `graph-metadata.json` generation or the embedding and re-index path. A2 is a write-time metadata fix and bypasses the retrieval floor by construction.
- Mutating any authored spec.md body. The derive reads the body, it never rewrites it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Populate `trigger_phrases` in `generatePerFolderDescription` (:872-902), demote the title-copy in `extractDescription` (:455-461) to a fallback, read curated frontmatter triggers from spec.md. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts` | Modify | Raise the `extractTriggersFromContent` cap from 8 to 12 (:515) to match the propagation cap. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Modify | Confirm `trigger_phrases` validation tolerates the populated capped array. No schema break since the field is already declared (:66). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN `generatePerFolderDescription` builds a record, the system SHALL set `trigger_phrases` from the curated frontmatter triggers merged with the derived extractive set, deduplicated and capped at 12. | Regenerating `005/description.json` writes a non-empty `trigger_phrases` array of at most 12 entries that includes every curated frontmatter trigger. |
| REQ-002 | WHEN a spec.md exposes a Problem or Purpose line, the derived `description` SHALL prefer that line over a verbatim title copy. | Regenerating a folder whose spec.md has a Problem Statement yields a `description` that is not byte-equal to the first `# ` heading. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | WHEN the curated frontmatter trigger set and the derived set both exist, the system SHALL treat the curated set as authoritative and use the derived set only to fill remaining slots up to the cap. | The propagated `trigger_phrases` is a superset of the curated frontmatter set whenever the curated count is at or below 12. |
| REQ-004 | The `extractTriggersFromContent` cap SHALL be 12 so the derive helper and the propagation cap agree. | `quality-loop.ts` `slice(0, 12)` and the propagation cap read the same constant or value. |
| REQ-005 | WHERE the relationship between curated and propagated triggers is asserted, the check SHALL be subset coherence, never byte equality, because the derived set is capped and the curated set may differ. | A coherence test passes when the curated set is a subset of the propagated set and fails only when a curated trigger is absent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After a regeneration pass, `005/description.json` carries a `trigger_phrases` array that is a superset of its frontmatter curated set and its `description` is no longer a verbatim title copy.
- **SC-002**: The `extractTriggersFromContent` cap and the propagation cap both read 12, and the subset coherence assertion passes against a folder with curated triggers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-prodmode-recall-gate` | None for this phase. A2 is a write-time metadata fix that bypasses the prod retrieval floor, so the C2 gate does not block it. | Documented as not-required, no retrieval promotion claim is made here. |
| Dependency | `026-shared-safe-fix-engine` | The shared `triggers.propagate` safe-class fixer reuses this populated-field logic. | Keep the propagation logic in `generatePerFolderDescription` so the engine can call the same derive path without divergence. |
| Risk | A curated trigger set larger than 12 truncates the derived contribution to zero. | Med | Curated triggers fill first, derived triggers fill the remainder, so the curated set is never dropped under the cap. |
| Risk | Demoting the title-copy regresses folders whose only signal is the title. | Low | Keep the title-copy as the documented last-resort fallback when no Problem or Purpose line exists. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The derive and propagation run inside the existing single spec.md read in `generatePerFolderDescription`, adding no extra file I/O per folder.

### Reliability
- **NFR-R01**: Regeneration stays idempotent. A second pass over an unchanged spec.md produces the same `trigger_phrases` and `description`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty curated set: the propagated `trigger_phrases` is the derived set alone, still capped at 12.
- Curated set already at 12: the derived contribution is empty and no curated trigger is dropped.
- spec.md with no Problem or Purpose line: the description falls back to the title copy, the documented last resort.

### Error Scenarios
- Unreadable or missing spec.md: `generatePerFolderDescription` returns null as today, no partial record is written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three files, one generator function, one cap constant, one assertion. |
| Risk | 6/25 | No retrieval-path change, no body mutation, idempotent regeneration. |
| Research | 4/20 | Seams confirmed to file:line against the live code and the sibling JSON. |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the curated frontmatter triggers should be sorted ahead of the derived set or interleaved by relevance when both fit under the cap.

### Verdict
GO-on-cost. A2 is a floor-bypassing on-write reuse-first fix. The derive helper already ships, the title-copy is the measured current default and the propagated set is capped at 12 so the assertion is subset not equality. It touches metadata generation, not ranking, so it carries no prod-retrieval risk.
<!-- /ANCHOR:questions -->
