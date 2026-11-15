---
title: "Feature Specification: Phase 10: post-fix-research"
description: "Phase 009 changed the relaunch core and every adapter, so a fresh research pass checks what that consolidation left or introduced. Five DeepSeek V4.1 Flash max iterations through cli-pi, with every finding verified at its cited line."
trigger_phrases:
  - "post fix research"
  - "phase 10 post fix research"
  - "session relaunch research after phase 009"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: post-fix-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-research-fixes-and-core-consolidation |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` holds a verification table covering every lineage finding, and `validate.sh` on this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Session relaunch loop specification.

**Scope Boundary**: Research only. The loop's code, tests and docs are read, not changed. Fixing a verified finding is a later phase the operator chooses.

**Dependencies**:
- Phase 009 merged to `main`, and the prior research in `../research/research.md`, whose findings are out of scope.

**Deliverables**:
- One cli-pi lineage of five iterations under `research/lineages/deepseek-pi/`.
- `research/research.md` with a verdict and verified severity for every finding.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 moved shared decisions into the core and changed every adapter. A consolidation that size can leave drift or add bugs that its own tests do not reach, and the earlier research predates it.

### Purpose
Know what remains after phase 009, with each claim checked at its cited line, so the next fix phase starts from verified findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five research iterations through `/deep:research` on the relaunch core, adapters, wrapper, command, OpenCode plugin, conformance suite and their docs.
- A verification pass over every finding.

### Out of Scope
- Code, test or doc changes to the loop.
- The findings phase 009 already fixed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage artifacts, merged registry and the verified report |
| `../spec.md`, `../goal.md` | Modify | Phase 10 row, binding row, criterion 1 at ten folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Five iterations run through cli-pi with `deepseek-v4.1-flash` at thinking max on LLM Gateway, and each iteration's record reaches the state log through the append gateway. |
| REQ-002 | Every lineage finding carries a verdict and a verified severity in `research/research.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The parent's map, binding table and goal criteria name this phase. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The lineage ends `fulfilled` with five iteration files and no gateway refusal.
- **SC-002**: Recursive strict validation of the parent prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A finding overstates its severity | Medium | Every finding is re-read at its cited line before it is reported |
| Dependency | LLM Gateway credit for DeepSeek V4.1 Flash | Low | The cli-pi roster names this route as the fan-out route for the model |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The lineage stays inside the runner's per-iteration timeout of 900 seconds.

### Security
- **NFR-S01**: The lineage writes only inside this folder's `research/`; the runner's containment check records anything else.

### Reliability
- **NFR-R01**: A lineage that bypasses the gateway is refused, not merged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A finding that restates a phase 009 fix: dropped by instruction.

### Error Scenarios
- A containment advisory for files the orchestrator edits during the run: recorded, not restored.

### State Transitions
- The existing `../research/` tree stays untouched; this run has its own.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One lineage and one report |
| Risk | 2/25 | Read-only research |
| Research | 14/20 | Twenty findings to verify |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether to fix the verified findings, and which, is the operator's call.
<!-- /ANCHOR:questions -->

---
