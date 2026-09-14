---
title: "Feature Specification: Phase 6: hermes-model-registry-and-routing"
description: "Hermes model registry and routing: the two-id LLM Gateway roster is enforced at both dispatch entry points, the prompt-improver eligibility and persona tables carry a cli-hermes row, the prompt-card sync guard covers the new packet, and every reasoning level was checked live."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: hermes-model-registry-and-routing

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Hermes reaches some forty providers; this repo lets it reach one, with two model ids. This phase proves the roster is enforced where a dispatch is built (the executor config and its byte mirror in the runner), registers the mode in the shared prompt-knowledge layer so the prompt-improver eligibility rule and the persona-attach table know it, and checks each `--reasoning` level against the gateway live.

**Key Decisions**: no `auto` default and no provider-prefixed ids; the runtime pins both roster models to `max` and the gateway accepts every level, so nothing is refused at the effort axis

**Critical Dependencies**: phase 003's allowlist; phase 002's configured provider

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete — enforcement proven and registry rows landed 2026-09-14 |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/007-hermes-model-registry-and-routing` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-hermes-hook-and-plugin-layer |
| **Successor** | 008-hermes-playbook-and-catalog |
| **Handoff Criteria** | A rostered model dispatches through the executor and an off-roster id is refused |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the cli-hermes creation packet; its durable directive and closure criteria are in `goal.md`, derived from the phase 001 synthesis and confirmed by the operator on 2026-09-14.

**Scope Boundary**: Add the Hermes model profiles and enforce the two-model roster at both dispatch entry points with the live effort mapping.

**Dependencies**:
- Phase 002's effort mapping; phase 003's allowlist

**Deliverables**:
- `sk-prompt/prompt-models` profiles, roster enforcement, sync check passing

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 wrote the allowlist, but nothing had shown the runner refusing an off-roster id, the prompt-improver eligibility tables did not know `cli-hermes` existed, and the prompt-card drift guard skipped the new packet. Effort levels were forwarded on the assumption that the gateway accepts Hermes's whole `--reasoning` set.

### Purpose
Every Hermes dispatch from this repo uses a rostered model with a known effort behavior, and an off-roster id is refused before a command is built.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Runner output for a rostered dispatch and for an off-roster refusal
- A `cli-hermes` row in the prompt-improver model-eligibility table (every runtime copy) and in the canonical persona-attach table
- The prompt-card sync guard covering the `cli-hermes` card and `SKILL.md`
- Live check of the `--reasoning` levels against the gateway, recorded in the providers reference

### Out of Scope
- Adding a third model - an amendment to the parent's D3, not this phase
- A Hermes-specific effort map - the runtime forwards the enum unchanged and pins both roster models to `max`
- Council and benchmark executor allowlists - a separate lane

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Modify | Add the `cli-hermes` card and `SKILL.md` to both checks |
| `.opencode/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md`, `.pi/agents/prompt-improver.md`, `.codex/agents/prompt-improver.toml` | Modify | `cli-hermes` eligibility row (the Cursor and Devin copies are symlinks to the Claude file) |
| `.opencode/skills/sk-prompt/SKILL.md` | Modify | Same eligibility row |
| `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | `cli-hermes` INLINE row in the persona-attach table |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md` | Modify | Roster standing to observed; reasoning-level results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A rostered model dispatches through the fan-out runner and an off-roster id is refused before any command is built, both with runner output recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The prompt-card sync guard passes with `cli-hermes` in both of its lists, and every copy of the model-eligibility table carries the `cli-hermes` row |
| REQ-003 | Each `--reasoning` level either dispatches without a provider error or is documented as refused |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fanout-run.cjs` with `llmgateway/deepseek-v4.1-flash` returns `status: rejected` naming the allowlist, with no lineage process started
- **SC-002**: `check-prompt-quality-card-sync.sh` prints `GUARD PASS` with two `cli-hermes` PASS lines
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Configured `llmgateway` provider | No live effort check | Phase 002 configured it under operator authorization |
| Risk | The eligibility table has six copies | One copy drifts | Every copy edited in one pass and grepped for the row |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An off-roster refusal returns before any process spawns (observed: 12 ms)

### Security
- **NFR-S01**: No credential appears in any edited file; the key stays in the shell environment

### Reliability
- **NFR-R01**: The allowlist and its runner mirror stay byte-identical (vitest mirror test)

---

## 8. EDGE CASES

### Data Boundaries
- Provider-prefixed id (`llmgateway/deepseek-v4.1-flash`): refused; Hermes takes the bare literal
- `--reasoning` outside Hermes's set: the builder throws before dispatch

### Error Scenarios
- Gateway rejects a level: would surface as exit 1 with an HTTP error on stdout; none observed
- Silent stream: bounded by the runner timeout, not `--run-budget` (phase 002 finding)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 8, LOC: ~20, Systems: 2 |
| Risk | 6/25 | Auth: N, API: N, Breaking: N |
| Research | 4/20 | Live gateway checks |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: phases 002 and 003 |
| **Total** | **24/100** | **Level 3 (inherited from the packet)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A copy of the eligibility table is missed | M | L | grep count per copy recorded in the summary |

---

## 11. USER STORIES

### US-001: Refuse an off-roster id (Priority: P0)

**As a** deep-loop caller, **I want** a wrong Hermes model id refused before dispatch, **so that** no lineage burns a timeout on a provider error.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Route prompt-improve work correctly (Priority: P1)

**As a** prompt-improver, **I want** the Hermes roster in the eligibility table, **so that** a Hermes-hosted model can take the work without guessing.

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


