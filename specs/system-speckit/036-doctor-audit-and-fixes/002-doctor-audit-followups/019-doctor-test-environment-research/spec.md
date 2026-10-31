---
title: "Feature Specification: Phase 19: doctor-test-environment-research"
description: "Two doctor contract gaps stay open and the doctor manual testing scenarios have no shared environment that exercises /doctor:update on real customized, conflict, removed and local units. This phase researches the fixes and the environment, without building them."
trigger_phrases:
  - "doctor test environment research"
  - "doctor update test worktree"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: doctor-test-environment-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-doctor-playbook-mcp |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` gives the fixes, the environment design, the scenario list and an ordered plan, each claim cited |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the doctor audit follow-ups. Phases 014 to 018 wrote the doctor scenarios and recorded two contract gaps. This phase researches how to close the gaps and how to give the scenarios a long-lived local test environment.

**Scope Boundary**: Research only. No command, scenario or worktree is changed or created in this phase.

**Dependencies**:
- The doctor command contracts in `.skilled/commands/doctor/` and the release-update engine
- The Barter sk-git snapshot in the main checkout's `barter/` folder

**Deliverables**:
- `research/research.md`: the two fixes, the environment design, the scenario list and an ordered implementation plan

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:speckit` can never report OK on the current corpus, and `/doctor:mcp` defines no error for an unknown flag. The `/doctor:update` scenarios have no repository state that carries customized, conflicting, removed and local units, so they cannot be run for real.

### Purpose
A cited plan for both fixes and for a reusable local environment the doctor scenarios can run against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `/doctor:speckit` severity rule and the `/doctor:mcp` flag errors
- A long-lived local worktree for `/doctor:update`, with sk-code and sk-git overrides
- Which other doctor suites gain from a long-lived environment, and which scenarios change

### Out of Scope
- Building the fixes, the worktree or the scenarios - later phases
- Running the doctor scenarios - a separate run

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `019-doctor-test-environment-research/research/` | Create | Fan-out state, two lineages and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Three iterations on DeepSeek V4.1 Flash and two on LUNA 6 | Five iteration files across the two lineages |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every claim cites a file and line or command evidence | `research/research.md` carries the citation, and load-bearing claims are re-checked |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The report ends with an ordered implementation plan.
- **SC-002**: Each load-bearing claim is checked against the repository before it is reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `opencode-go` provider for Pi | No DeepSeek iterations | Fall back to Cline, then cli-devin |
| Risk | The lineages disagree | Med | Merge with the disagreement recorded in the divergence map |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The worktree name: the allocator's numbered form with a symlink, or the exact requested name.
- Whether the non-update suites get their own current-code environment.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- checksum: sha256:bf284333bd765c52eb8e725d078ea6e5318b2d52e625c54931a95a9e1f2989e3 -->
Deep-research findings (abridged; `research/research.md` is canonical):

- `/doctor:speckit`: report phrase quality as an advisory outside `severity_max`, so a fresh index reports OK. The "never rank" rationale is wrong, because the scorer does score those phrases. Also align the YAML status list with the presentation.
- `/doctor:mcp`: add an `unknown_flag` error beside `cross_sub_action_flag_injection`.
- `/doctor:update` environment: a worktree from `v4.0.0.0` with the current updater overlaid and four committed fixtures. These are a Webflow `SKILL.md` edit (customized), the Barter sk-git (conflict), a local prerelease tag without `sk-code-obsidian` (removed) and a new `sk-code-web-dev` packet (local).
- The other doctor suites test current code, so they need a current-code environment, not the updater fixture. DOC-370 stays on a disposable clone because a linked worktree shares `.git/config`.
- Open for the operator: the worktree name and a second environment.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
