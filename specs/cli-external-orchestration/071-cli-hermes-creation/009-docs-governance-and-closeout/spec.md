---
title: "Feature Specification: Phase 8: docs-governance-and-closeout"
description: "Docs governance and closeout: every roster surface that named six external CLI modes now names cli-hermes, the hub and packet READMEs describe the shipped state, the agent-directory table records that Hermes has no agents folder, and the parent validates recursively."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: docs-governance-and-closeout

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The seventh mode existed in the registries before it existed in the prose. This phase walks every surface that enumerates the external CLI modes (orchestrate agent copies, root and hub READMEs, the rewrite command, the deep-command presentations and their compiled contracts, sibling packet READMEs, the council and benchmark docs) and adds `cli-hermes` in place, then refreshes the packet README with `sk-create-readme` and closes the parent with the recursive strict gate.

**Key Decisions**: no new repo rule (the packet's hard rules carry everything Hermes-specific); `AGENTS.md` gets one table row saying Hermes has no agents directory

**Critical Dependencies**: phases 002 to 008 landed

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete — roster surfaces, READMEs and closeout gate 2026-09-14 |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/009-docs-governance-and-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-hermes-playbook-and-catalog |
| **Successor** | None |
| **Handoff Criteria** | Parent passes `validate.sh --recursive --strict`; every roster surface names `cli-hermes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the cli-hermes creation packet; its durable directive and closure criteria are in `goal.md`, derived from the phase 001 synthesis and confirmed by the operator on 2026-09-14.

**Scope Boundary**: Extend roster and governance docs to name `cli-hermes`, refresh READMEs with `sk-create-readme`, and run the recursive strict closeout; optional.

**Dependencies**:
- Every other phase Complete

**Deliverables**:
- Roster docs, READMEs, recursive validation evidence, parent goal criteria closed

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader following any roster surface would find six external CLI modes and never learn the seventh existed. The packet README described a plan, not the shipped state.

### Purpose
Every place the six runtimes are named also names `cli-hermes`, and the READMEs describe what shipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Roster surfaces: orchestrate agent copies, root `README.md`, hub `README.md`, `AGENTS.md` table row, the rewrite command, the deep-command presentations and compiled contracts, sibling packet READMEs, council and benchmark docs
- `cli-hermes/README.md` refreshed with `sk-create-readme`
- Recursive strict validation of the parent

### Out of Scope
- New repo rules - phase 001 found nothing a rule must carry beyond the packet's hard rules (P2)
- Historical records under `changelog/` and archived packets - never edited (P3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.pi/agents/orchestrate.md`, `.codex/agents/orchestrate.toml` | Modify | "seven modes" with `cli-hermes` (Cursor and Devin copies are symlinks to the Claude file) |
| `README.md`, `.opencode/skills/cli-external-orchestration/README.md` | Modify | Mode bullets, table rows, counts |
| `AGENTS.md` (`CLAUDE.md` is a symlink to it) | Modify | One agent-directory row for Hermes |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Modify | Seven supported external skills, `hermes` engine id |
| `.opencode/commands/deep/assets/deep-{research,review}-presentation.txt`, `-auto.yaml`, `compiled/*.contract.md` | Modify | `H) cli-hermes` executor block; contracts recompiled |
| `cli-{opencode,claude-code,codex,cursor,devin}/README.md` | Modify | Cross-runtime table row |
| `.opencode/skills/cli-external-orchestration/cli-hermes/README.md` | Modify | Shipped-state rewrite in the readme template order |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A grep for the six runtime names across the roster surfaces shows `cli-hermes` beside them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Hub and packet READMEs describe the shipped state and validate |
| REQ-003 | The parent passes `validate.sh --recursive --strict` with zero errors |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rn "cli-pi" <surface> | grep -v cli-hermes` leaves only lines that are Pi's own on every roster surface
- **SC-002**: `RESULT: PASSED` for every folder of the parent under `--recursive --strict`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 to 008 | READMEs would describe an unfinished state | Written after those phases were tested |
| Risk | A roster surface is missed | Low | Repo-wide grep for the six names recorded in the summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: None; documentation only

### Security
- **NFR-S01**: No credential or operator path appears in any README

### Reliability
- **NFR-R01**: Compiled deep-command contracts stay digest-fresh (`check-contract-drift.cjs` OK)

---

## 8. EDGE CASES

### Data Boundaries
- A surface that is a symlink: edited once through its real file
- A count word ("six") in prose: changed with the list, never alone

### Error Scenarios
- Pre-existing validator findings on `AGENTS.md` (missing overview section) and the orchestrate copies (section numbering) are recorded, not fixed here
- None else

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: ~20, LOC: ~150, Systems: docs only |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 3/20 | Repo-wide grep |
| Multi-Agent | 5/15 | One roster lane |
| Coordination | 8/15 | Every earlier phase |
| **Total** | **29/100** | **Level 3 (inherited from the packet)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A README claims a state a later fix changes | M | M | READMEs written after the live checks; the `--yolo` correction propagated the same day |

---

## 11. USER STORIES

### US-001: Find the seventh mode (Priority: P0)

**As a** reader of any roster surface, **I want** `cli-hermes` listed beside its siblings, **so that** I can route to it without reading the registry.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Trust the packet README (Priority: P1)

**As an** operator, **I want** the packet README to describe what shipped, **so that** the four operator steps and the `--yolo` semantics are right the first time.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


