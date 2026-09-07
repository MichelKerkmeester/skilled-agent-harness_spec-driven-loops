---
title: "Feature Specification: Phase 10: manifest-dead-fields-and-coaching-markers"
description: "Two manifest fields on every document type and two scaffold marker blocks create.sh appends have no reader anywhere in the runtime, and both are documented as dead by the extension guide and an earlier remediation child."
trigger_phrases:
  - "manifest dead field removal"
  - "scaffold coaching marker cleanup"
  - "creation trigger absence behavior"
  - "scaffold validation counts block"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: manifest-dead-fields-and-coaching-markers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/010-manifest-dead-fields-and-coaching-markers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 16 |
| **Predecessor** | 009-references-corpus-routing |
| **Successor** | 011-advisor-import-and-ollama-consolidation |
| **Handoff Criteria** | validate.sh reports RESULT: PASSED for this folder and the three named test suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Recorded findings closure specification.

**Scope Boundary**: `templates/spec-kit-docs.json`'s `documents[*].creationTrigger` and `documents[*].absenceBehavior` fields, `runtime/cli/spec/create.sh`'s `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` append blocks, and the two maintainer docs (`EXTENSION-GUIDE.md`, `README.md`) that describe the manifest shape.

**Dependencies**:
- 035's own child `010-template-contract-alignment` already recorded the `documents` index as descriptive (its D1). This phase acts on that decision rather than reopening it.

**Deliverables**:
- `creationTrigger` and `absenceBehavior` removed from all 16 `documents[]` entries in `spec-kit-docs.json`.
- The two scaffold marker blocks removed from `create.sh`.
- `EXTENSION-GUIDE.md` and `README.md` updated to describe the manifest as it now is.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`templates/spec-kit-docs.json` carries a `creationTrigger` and an `absenceBehavior` field on every one of its 16 `documents[]` entries (32 key occurrences, `spec-kit-docs.json:26-117`), and `EXTENSION-GUIDE.md:33-36` already states in its own maintainer instructions that "nothing reads it at runtime: the scaffolder and the validator both work from the `levels` rows below... Keep the index truthful, but know that changing it changes no behavior." A repo-wide grep confirms no `.ts`, `.js`, `.mjs`, `.cjs` or `.py` file reads either field name. Separately, `create.sh` appends an HTML-comment `SCAFFOLD_VALIDATION_COUNTS` block to every scaffolded `spec.md` (`create.sh:662-679`) and a `SCAFFOLD_AI_PROTOCOL_MARKERS` block to `plan.md` at Level 3 and above (`create.sh:683-696`). Finding f-iter002-003 (lane 004 round three, `specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria/research/confirmed-findings.md:153`) confirmed neither block is even injected on a template upgrade, and its recorded disposition was "nothing reads the two markers, so their absence changes no verdict" - a grep of the whole skill tree confirms `create.sh` is the only file that names either marker string.

### Purpose
Neither dead field survives in the manifest and neither dead marker block survives in `create.sh`, and the two maintainer documents that described them describe the manifest as it now is, with the three named test suites still green because none of them ever depended on the removed fields or blocks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Removing `creationTrigger` and `absenceBehavior` from every `documents[]` entry in `templates/spec-kit-docs.json`.
- Removing the `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` append blocks from `create.sh`, and the `grep -q` guards that gate them.
- Updating `EXTENSION-GUIDE.md` §1's field-by-field description so it no longer instructs a maintainer to add fields that no longer exist.
- Confirming `templates/README.md`'s one-line manifest description still holds after the fields are gone.

### Out of Scope
- The `documents[]` entries' remaining fields (`template`, `owner`) - still read by the scaffolder and validator, not touched.
- Reopening 035 child 010's D1/D2 decisions about the `levels` rows being the authority - this phase only acts on D1, it does not revisit it.
- Any other scaffold coaching or marker convention outside the two named blocks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | Remove `creationTrigger` and `absenceBehavior` from all 16 `documents[]` entries |
| `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Remove the `SCAFFOLD_VALIDATION_COUNTS` block (lines 662-679) and the `SCAFFOLD_AI_PROTOCOL_MARKERS` block (lines 683-696) |
| `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` | Modify | Drop the `creationTrigger`/`absenceBehavior` field descriptions from §1's document-type checklist |
| `.opencode/skills/system-spec-kit/templates/README.md` | Modify (if needed) | Confirm the manifest description at line 130 still holds, adjust if it names the removed fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `creationTrigger` and `absenceBehavior` are removed from every `documents[]` entry in `spec-kit-docs.json`, and `EXTENSION-GUIDE.md`'s description of them is removed with them |
| REQ-002 | The `SCAFFOLD_VALIDATION_COUNTS` block create.sh appends to `spec.md` and the `SCAFFOLD_AI_PROTOCOL_MARKERS` block it appends to `plan.md` at Level 3+ are removed from `create.sh`, so a freshly scaffolded packet carries neither |
| REQ-003 | `scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts` and `level-contract-resolver.vitest.ts` all pass unchanged after the removal, since none of the three references either the fields or the markers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A repo-wide grep for `creationTrigger`, `absenceBehavior`, `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` returns no hit outside git history |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `spec-kit-docs.json`'s `documents[]` entries carry only `template` and `owner`, with zero `creationTrigger` or `absenceBehavior` keys.
- **SC-002**: A freshly scaffolded Level 1 through 3+ packet's `spec.md` and `plan.md` carry neither marker block, and the three named suites pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `EXTENSION-GUIDE.md`'s own maintainer instructions currently tell a future editor to add these two fields when extending the manifest | A maintainer re-adds a dead field after this phase closes if the guide is not updated in the same change | Update §1's checklist in the same commit that removes the fields |
| Risk | A downstream fork or the `barter/` mirror still reads one of the two fields outside this repository's own runtime | Low - a repo-wide grep of the live tree found no reader, and a mirror outside the live tree is not this packet's concern | Scope the grep to `.opencode/skills/system-spec-kit` and the runtime dist output, not archival mirrors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable - a smaller manifest and a shorter `create.sh` scaffold step, no measurable runtime change.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable - no auth surface changes.
- **NFR-S02**: Not applicable - no data storage changes.

### Reliability
- **NFR-R01**: A freshly scaffolded packet still passes `validate.sh --strict` after the marker blocks are removed, since `PLACEHOLDER_FILLED` and other rules never read either marker.
- **NFR-R02**: The three named test suites report the same pass count before and after the change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable - the manifest and `create.sh` are fixed-shape files, not user input.
- Maximum length: not applicable.
- Invalid format: a malformed `spec-kit-docs.json` after the edit fails JSON parsing immediately in the scaffolder. The edit is validated by running `create.sh` once against a throwaway folder before committing.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: not applicable - a single-file, single-session edit.

### State Transitions
- Partial completion: if the manifest is edited before `create.sh`, a freshly scaffolded packet still carries the marker blocks until `create.sh` is also edited. Both edits land in the same commit to avoid a half-migrated state.
- Session expiry: `goal.md`'s log tracks which of the two removals (manifest fields, `create.sh` blocks) is done if a session ends mid-phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Four files, no code logic beyond deleting a bash heredoc block and JSON keys |
| Risk | 4/25 | Both removals are already documented as dead by the manifest's own maintainer guide, and both are reversible by git revert |
| Research | 3/20 | The dead-field and dead-marker census is already complete in this spec, and remaining work is the edit itself |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether `templates/README.md` needs any edit at all once the fields are gone, since its current line only names the manifest's general purpose ("Defines Level contracts, document registry, template versions and section gates") without citing the two fields by name - decided by re-reading the line after the manifest edit lands.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
