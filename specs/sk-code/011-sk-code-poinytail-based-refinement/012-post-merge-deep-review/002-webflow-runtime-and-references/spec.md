---
title: "Feature Specification: Phase 2: webflow-runtime-and-references"
description: "The Webflow minified runtime test stops running callbacks at depth 20 without saying so, and a Webflow debugging reference lists two evidence files that exist nowhere."
trigger_phrases:
  - "webflow runtime and references"
  - "phase 2 webflow runtime and references"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: webflow-runtime-and-references

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/002-webflow-runtime-and-references` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-hook-stdin-deadlines |
| **Successor** | 003-drift-guard-warning-count |
| **Handoff Criteria** | The known-good fixture prints the skip warning for late-element-poll.js only, both fixture verdicts are unchanged, and the dead evidence bullets are gone |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: One script and one reference inside `.skilled/skills/sk-code/sk-code-webflow/`, plus its version line and one changelog.

**Dependencies**:
- Review findings 3 (R5-SEC-003) and 10 (R9-MNT-003) in `../review/review-report.md`

**Deliverables**:
- A skip count and warning line in `test-minified-runtime.mjs`
- The scroll interceptor reference without its dead evidence subsection
- Version 1.1.3.0 and its changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`test-minified-runtime.mjs` runs timer, animation frame and `Webflow.push` callbacks synchronously and returns silently once the nesting depth reaches `MAX_SYNC_CALLBACK_DEPTH` (20). A callback past the cap never runs, so an error inside it never reaches `callback_errors` and the file can print PASS. Separately, `scroll-interceptor-and-related.md` lists two spec files under "Memory Files (Evidence)" that resolve nowhere in this repository.

### Purpose
A reader of the runtime report can see when callbacks were skipped, and the debugging reference cites only files that exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count callbacks skipped at the cap and print one warning line under that file's PASS line
- Delete the "Memory Files (Evidence)" heading and its two bullets
- Bump `sk-code-webflow` to 1.1.3.0 and add `changelog/v1.1.3.0.md`

### Out of Scope
- Failing a file at the cap, as the review first proposed. The known-good fixture `late-element-poll.js` polls for a late element and reaches the cap by design, so a failure would turn a correct pattern red
- Raising or removing the cap, which exists to keep unbounded retry loops from overflowing the stack
- README version line, which earlier bumps left at 1.1.0.0

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` | Modify | Skip counter and warning line |
| `.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/scroll-interceptor-and-related.md` | Modify | Dead evidence subsection removed |
| `.skilled/skills/sk-code/sk-code-webflow/SKILL.md` | Modify | Version 1.1.3.0 |
| `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.3.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The runtime test reports callbacks skipped at the cap | From `runtime-fixture/known-good`, the run exits 0 with `Passed:  2/2`, and `late-element-poll.js` prints `⚠ 1 callback(s) past depth 20 were not run, so errors inside them were not checked` while `guarded-init.js` prints no warning |
| REQ-002 | Pass and fail verdicts do not change | From `runtime-fixture/known-bad`, the run still exits 1 with `Failed:  4/4` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The reference cites no dead evidence | `rg -n "Memory Files|005-example.com|005-subagent-delegation"` on the reference prints nothing, and `validate_document.py` reports `Total issues: 0` |
| REQ-004 | Version 1.1.3.0 with one changelog entry | `SKILL.md` and `changelog/v1.1.3.0.md` read `version: 1.1.3.0`, and the changelog validates with `Total issues: 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The skip warning appears exactly once across the two fixture families, on the polling fixture
- **SC-002**: No fixture verdict changes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A script that greps the runtime report could trip on the new line | Low | The line is indented under the file and leaves the `RESULT:` and summary lines unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The review proposed failing at the cap. That would fail the known-good polling fixture, so this phase reports the skip instead.
<!-- /ANCHOR:questions -->

---
