---
title: "Feature Specification: Phase 11: authoring-speed-research"
description: "Packet 054 grew the four core templates from 4,681 to 7,255 words and added a 1,246-word card, so a model reads more before it writes a spec. This phase researches how to make authoring and upkeep faster than before 054 without losing the quality 054 added."
trigger_phrases:
  - "authoring speed research"
  - "phase 11 authoring speed research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 11: authoring-speed-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-deep-review-finding-fixes |
| **Successor** | None yet |
| **Handoff Criteria** | `research/research.md` ranks every recommendation, and each one is assigned to a later phase or recorded as deferred. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Research how to make spec authoring and upkeep faster while keeping the quality packet 054 added specification.

**Scope Boundary**: Research and synthesis only. No template, card or validator changes in this phase.

**Dependencies**:
- The cli-pi DeepSeek V4.1 Flash max executor and the `/deep:research` command.

**Deliverables**:
- `research/research.md` with ranked recommendations and their phase assignments.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 054 grew the four core templates from 4,681 to 7,255 words and added a 1,246-word card, so a model reads more before it writes. Phase 009 timed DeepSeek authoring at a 252-second mean before 054 and 194 to 233 seconds after, but under unequal load, so nobody knows where authoring time now goes.

### Purpose
A ranked list of changes that make spec authoring and upkeep faster than before 054 while keeping the card, the v2.3 value tokens, the fill notes and the guards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run five `/deep:research` iterations with cli-pi DeepSeek V4.1 Flash max in one lineage, `pi-deepseek`.
- Synthesize `research/research.md` with an Opus high subagent, ranking each change by time saved against quality risk.
- Assign each recommendation to a later phase or record it as deferred with its reason.

### Out of Scope
- Running a speed benchmark - timing is measured on 2026-10-26, outside this phase.
- Building any recommendation - Opus medium subagents build them in later phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (this folder only) | Create | Iteration files, lineage state and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/research.md` ranks every recommendation by time saved against quality risk, each with a `[SOURCE: path:line]` citation. | `rg -c 'SOURCE:' research/research.md` prints at least the number of ranked recommendations. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each ranked recommendation names a later phase or a deferral reason. | Reading the ranking table in `research/research.md` shows a phase or `Deferred` on every row. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls research/lineages/pi-deepseek/iterations/` lists five iteration files.
- **SC-002**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-pi DeepSeek V4.1 Flash max | No iterations run | Record the failure in `goal.md` and ask the operator before switching executor. |
| Risk | A recommendation cuts text that holds 054's quality, such as a fill note example | Med | Each recommendation names its quality risk, and the synthesis ranks it against the time saved. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


