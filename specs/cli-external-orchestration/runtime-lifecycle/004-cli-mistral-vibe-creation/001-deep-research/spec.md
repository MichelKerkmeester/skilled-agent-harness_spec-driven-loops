---
title: "Feature Specification: Phase 1: deep-research"
description: "Nobody has mapped how Mistral Vibe could become a governed runtime mode here, or how much of cli-opencode's extension, hook and plugin surface it could carry. This phase researches both and writes the ranked build phases."
trigger_phrases:
  - "mistral vibe deep research"
  - "phase 1 deep research"
  - "vibe opencode feature parity research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 12 |
| **Predecessor** | None |
| **Successor** | 002-mistral-provider-roster |
| **Handoff Criteria** | `research/research.md` and `research/phase-plan.md` exist, and the plan names the build phases that follow phase 003 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode specification.

**Scope Boundary**: Read-only research of the Vibe source, a local Vibe install and this repository's runtime surfaces, written only under `research/`.

**Dependencies**:
- A local `mistral-vibe` install for read-only commands, which waits on the operator's yes.
- `research-angles.md` as the brief.

**Deliverables**:
- `research/research.md`, with a parity table against cli-opencode.
- `research/phase-plan.md`, ranking the build phases.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Mistral Vibe is Mistral's own coding agent and the client its subscription is built around, but this repository has no mode for it. Its headless contract, configuration, hook system and fit with the deep-loop fan-out are unknown, so no build phase can be scoped without guessing.

### Purpose
Decide whether Vibe can be a governed runtime mode, how far it can match cli-opencode's extensions, hooks and plugins, and in which order to build it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ command -v vibe; ls ~/.vibe
(no output: Vibe is not installed on this machine)
$ rg -n -i 'vibe' .skilled/skills/cli-external-orchestration --glob '*.md'
(no runtime mode or reference names Vibe)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Work the eight angles in `research-angles.md`.
- Compare every cli-opencode extension, hook and plugin surface with Vibe's, and say what porting each takes.
- Write the synthesis and a ranked phase plan.

### Out of Scope
- Building any part of the mode - the build phases come from this phase's plan.
- Writing the operator's `~/.vibe/` or any credential - research stays read-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Iterations, synthesis and phase plan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every angle is answered with cited evidence | `research/research.md` has one section per angle, each claim cited or marked UNKNOWN |
| REQ-002 | The parity table covers every cli-opencode surface the repository uses | Each row says equivalent, partial or none, with the porting cost |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A ranked phase plan exists | `research/phase-plan.md` lists the build phases with a handoff check for each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase plan can be scaffolded as children 004 onward of this parent without a new research question.
- **SC-002**: The headless dispatch shape is recorded from a live read-only `vibe --help`, not from documentation alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local Vibe install | High: angles 1, 3 and 6 need live help output | Install only after the operator's yes; until then mark live claims `documented, unconfirmed` |
| Risk | Vibe versions change fast | Med: v2 and v3 sources disagree on the current version | Pin the installed version in every live capture |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is a print mode or ACP the better dispatch surface for the fan-out?
- Does a Vibe turn draw on the same usage counter as an OpenCode turn on the same key?
<!-- /ANCHOR:questions -->

---
