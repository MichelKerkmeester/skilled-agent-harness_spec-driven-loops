---
title: "Feature Specification: Phase 3: drift-guard-warning-count"
description: "The sk-code drift-guard umbrella prints a bare PASS and a clean summary line over 272 alignment warnings, so the warnings are easy to miss."
trigger_phrases:
  - "drift guard warning count"
  - "phase 3 drift guard warning count"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: drift-guard-warning-count

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
| **Branch** | `scaffold/003-drift-guard-warning-count` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-webflow-runtime-and-references |
| **Successor** | 004-hub-doc-pointers |
| **Handoff Criteria** | The umbrella shows 272 on the alignment PASS line and in its summary, exits 0, and keeps every pass or fail decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: The umbrella script and its README inside `.skilled/skills/sk-code/sk-code-skilled/scripts/`, plus the packet version line and one changelog.

**Dependencies**:
- Review finding 5 (R7-MNT-001) in `../review/review-report.md`

**Deliverables**:
- Per-guard warning counts and a summary total in `run-all-drift-guards.sh`
- Matching expected output in `scripts/README.md`
- Version 1.2.2.0 and its changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`run-all-drift-guards.sh` runs the alignment leg without `--fail-on-warn`. `bash run-all-drift-guards.sh | grep -c '\[WARN\]'` prints 272 while the PASS line and the last line read as clean, so a reader of the summary never learns the warnings exist.

### Purpose
The umbrella's PASS line and summary show how many non-blocking warnings each run produced, while warnings still never fail the gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count `[WARN]` lines per guard and show them on that guard's PASS line
- Add the total to the success line
- Update the README's expected output and table row
- Bump `sk-code-skilled` to 1.2.2.0 and add `changelog/v1.2.2.0.md`

### Out of Scope
- Turning on `--fail-on-warn`, which would turn the gate red on 272 existing warnings and fails the restraint test the review applied
- Fixing the warnings themselves
- README version line, which earlier bumps left alone

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | Modify | Warning counts on PASS lines and the summary |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` | Modify | Expected output and table row |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | Version 1.2.2.0 |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.2.0.md` | Create | Changelog entry |
| `.hermes/skills/sk-code-skilled/SKILL.md` | Modify | Regenerated Hermes copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Warnings are visible | The run prints `PASS: alignment-drift  (verify_alignment_drift.py --check-router) (272 warnings)` and ends `run-all-drift-guards: all 4 guards PASSED, 272 non-blocking warning(s)` |
| REQ-002 | Decisions are unchanged | The run exits 0 with four PASS lines, a guard's own exit status still decides PASS or FAIL, and each guard's stderr still goes to stderr |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The README matches the output | `scripts/README.md` names the `non-blocking warning(s)` suffix and validates with `Total issues: 0` |
| REQ-004 | Version 1.2.2.0 with one changelog entry | `SKILL.md` and `changelog/v1.2.2.0.md` read `version: 1.2.2.0`, and the changelog validates with `Total issues: 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run with warnings says so on its last line
- **SC-002**: A run with no warnings prints the old summary line byte for byte
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A script matching the exact old summary line | Low | The new line keeps the `all 4 guards PASSED` prefix, and no caller in the repository matches the full line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The review weighed `--fail-on-warn` and rejected it, so this phase only counts.
<!-- /ANCHOR:questions -->

---
