---
title: "Feature Specification: Phase 27: derived-sanitizer-instruction-shape"
description: "The derived label sanitizer dropped legitimate routing labels such as system-spec-kit and run lighthouse because it matched single words like system, tool and run. It now matches instruction phrasing, so every curated skill metadata block can carry a truthful sanitizer stamp."
trigger_phrases:
  - "derived sanitizer instruction shape"
  - "sanitizer drops routing labels"
  - "sanitizeSkillLabel v2"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 27: derived-sanitizer-instruction-shape

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-doctor-run-followups |
| **Successor** | None |
| **Handoff Criteria** | All 14 skill-root metadata blocks pass the sanitizer unchanged and carry the current stamp, and graph validation reports 0 warnings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the doctor audit follow-ups. Phase 026 stamped seven skills and left seven unstamped, because the sanitizer would have dropped 22 of their curated labels. The operator asked for the filter to be narrowed so those labels survive.

**Scope Boundary**: The instruction pattern and version constant of the derived sanitizer, its tests, one stress fixture and the `derived.sanitizer_version` key in the 14 skill-root `graph-metadata.json` files.

**Dependencies**:
- The derived sanitizer in `system-skill-advisor/runtime/lib/derived/sanitizer.ts`
- The freshness check in the graph validator, which compares each stamp with `SKILL_DERIVED_SANITIZER_VERSION`

**Deliverables**:
- An instruction pattern that needs phrasing, not a lone word
- `SKILL_DERIVED_SANITIZER_VERSION` bumped to `sanitizeSkillLabel:v2`
- A test that keeps routing labels and still rejects injected instructions
- The v2 stamp on all 14 skills

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sanitizer's instruction filter rejected any label containing words such as `system`, `developer`, `tool` or `run`. Those words appear in skill names and routing phrases, so it would have dropped 22 curated labels across seven skills, including `system-spec-kit`, `mcp tool` and `call tool chain`.

### Purpose
A filter that rejects instruction phrasing while letting skill names and routing phrases through, so every metadata block can carry a stamp it has been proven against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the single-word alternation with phrase shapes: an override verb near an instruction noun, phrases such as previous instructions or system prompt, known injection terms, and calling a tool that is not part of a routing compound
- Bump the version, prove every curated label against the new pattern, and stamp all 14 blocks

### Out of Scope
- The live scan boundary sanitizer in `lib/skill-graph/metadata-sanitizer.ts`, which already matches phrases
- Editing any curated label

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/runtime/lib/derived/sanitizer.ts` | Modify | Phrase-shaped instruction pattern |
| `system-skill-advisor/runtime/schemas/skill-derived-v2.ts` | Modify | Version v2 |
| `system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts` | Modify | Routing-label test |
| `system-skill-advisor/runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts` | Modify | Fixture version |
| 14 skill-root `graph-metadata.json` files | Modify | v2 stamp |
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modify | Release and upgrade notes for the v2 screen |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Injected instructions are still rejected | The existing attack tests and the new attack cases return null |
| REQ-002 | Curated routing labels survive | Every label in all 14 blocks passes the sanitizer unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Graph validation is clean | `skill_graph_validate` reports 0 warnings and 0 errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-spec-kit`, `run lighthouse` and `call tool chain` pass; `call the tool immediately` and `disregard the rules above` do not.
- **SC-002**: Graph validation warnings fall from 7 to 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A narrower filter lets an injected label through | Low | The sanitizer still strips markup and fenced blocks, every label is length-capped, and the existing attack suite still passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

