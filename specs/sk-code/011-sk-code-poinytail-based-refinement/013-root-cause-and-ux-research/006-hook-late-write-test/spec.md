---
title: "Feature Specification: Phase 6: hook-late-write-test"
description: "A short-deadline hook drops a payload its host writes after 500 ms, and no test pinned that behavior, so a change to it would pass unnoticed."
trigger_phrases:
  - "hook late write test"
  - "phase 6 hook late write test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: hook-late-write-test

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
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-readme-node-floor |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: The spec-kit hook stdin test, plus the system-spec-kit version line and its changelog entry.

**Dependencies**:
- `../research/research.md` section 5, the 500 ms deadline row

**Deliverables**:
- One late-write test
- system-spec-kit 2.7.2.1 with its changelog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hooks whose host allows 3 seconds read stdin for 500 ms. A payload written later on a stdin that stays open is cut, and the hook takes its empty-payload answer. The round-four summary records this as a known limitation, but the suite only tested a payload written at spawn, so nothing would notice if the deadline or the empty answer changed.

### Purpose
Pin today's behavior for a late payload with one test that would fail if it changed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `writeDelayMs` option in the test's spawn helper
- One test: the Claude prompt-submit shim, payload written at 800 ms, answer `{}`
- The proportionate system-spec-kit build bump and changelog

### Out of Scope
- Changing the deadline or adding telemetry, both rejected in the research until a host latency is measured
- The duplicated 500 ms constants

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modify | Write-delay option and the late-write test |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Version 2.7.2.0 to 2.7.2.1 |
| `.skilled/skills/system-spec-kit/changelog/v2.7.2.1.md` | Create | Changelog for the test |
| `.hermes/skills/system-spec-kit/SKILL.md`, trigger index and retrieval fixtures | Regenerate | Derived artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The late-write behavior is pinned | The new test passes on today's hooks |
| REQ-002 | The test discriminates | With the write moved before the deadline, it fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Derived artifacts stay in step | Hermes sync and trigger index `--check` both pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The suite reads 40 tests, 40 pass.
- **SC-002**: system-spec-kit reads 2.7.2.1 with a valid changelog.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An 800 ms delay is close to timing noise | Low | The deadline is 500 ms and the bound is 2500 ms; the mutant at 100 ms shows the assertion reads the payload path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
