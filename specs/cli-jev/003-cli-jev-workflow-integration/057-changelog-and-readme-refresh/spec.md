---
title: "Feature Specification: Phase 57: changelog-and-readme-refresh"
description: "The v4.0.0.3 changelog and the root README were written before phases 52 to 56 landed, so they still placed the injection screen on Claude Code alone, overstated the Pi route and left out the hook work. This phase brings both to the current code."
trigger_phrases:
  - "v4.0.0.3 changelog classifier refresh"
  - "root readme classifier refresh"
  - "jev changelog accuracy"
importance_tier: "normal"
contextType: "documentation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 57: changelog-and-readme-refresh

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
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 57 of 57 |
| **Predecessor** | 056-codex-dispatch-and-checklist |
| **Successor** | None |
| **Handoff Criteria** | Every classifier and hook claim in both files matches the code, and both pass their document checks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 57** of the cli-jev workflow integration packet. The operator asked for the v4.0.0.3 changelog and the root README to match current reality and every phase worked on in recent sessions.

**Scope Boundary**: Classifier, Jev and hook statements in `.skilled/changelog/skilled/v4.0.0.3.md` and the root `README.md`, plus a correction to the Codex approval wording phase 56 wrote.

**Dependencies**:
- Phases 52 to 56, whose implementation summaries record what changed
- v4.0.0.3 having no release tag, so its entry can still change

**Deliverables**:
- A changelog whose classifier section and upgrade notes match the code
- A README whose classifier, plugin, hook-core, off-switch and live-sync lines match the code

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog's classifier section was written on 2026-10-04, before phases 52 to 56. It said the injection screen ran after a Claude Code web fetch only, said every Jev question went to Pi first and left out the Codex shell-hook fix and the wider live sync. The README carried the same Pi claim, an out-of-date plugin count and hook-core list, and off-switch lines that missed the Jev switches and the message gate's exception.

### Purpose
A reader of either file learns what the classifier and hooks really do on each runtime today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The changelog's injection screen, Pi route and off-switch sentences, two new hook items and two upgrade notes
- The README's classifier, OpenCode plugin, Pi extension, hook-core, Codex approval, off-switch and live-sync lines
- The Codex approval wording in the cli-codex hook contract and the phase 56 docs, cut back to what the probe confirmed

### Out of Scope
- The README's command count - it predates this work
- A Hermes subsection in the README and the Hermes live-sync row in the hooks README - outside the two files asked for
- Non-classifier fixes from the same commit range - other packets own them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modify | Classifier section, hook items and upgrade notes |
| `README.md` | Modify | Classifier, plugin, hook and switch lines |
| `cli-codex/references/hook-contract.md` | Modify | Approval wording |
| `056-codex-dispatch-and-checklist/{spec,implementation-summary}.md` | Modify | Approval wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every classifier and hook statement in both files matches the code | Each changed sentence has a source path checked in this phase |
| REQ-002 | Both files pass their document checks | `validate_document.py` 0 issues, HVR 0 hard blockers, README baselines pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No claim goes beyond what was observed | The Codex re-approval statement names only the confirmed behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Neither file places the injection screen on Claude Code alone or sends every Jev question to Pi first.
- **SC-002**: The README's plugin, Pi bridge and hook-core lists match the files on disk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An audit finding is wrong | A new false claim | Each finding checked against its source before the edit |
| Risk | The changelog contract forbids overwriting an entry | Edit refused | v4.0.0.3 is untagged, and earlier commits amended it the same way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
