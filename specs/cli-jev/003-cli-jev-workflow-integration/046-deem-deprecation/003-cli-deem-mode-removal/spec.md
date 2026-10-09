---
title: "Feature Specification: Phase 3: cli-deem-mode-removal"
description: "The cli-classifier hub registers two modes and routes Deem prompts to cli-deem. This phase deletes the cli-deem packet and leaves the hub a valid parent hub whose only mode is cli-jev."
trigger_phrases:
  - "delete cli-deem packet"
  - "one-mode classifier hub"
  - "cli-classifier routing remint"
  - "hermes cli-deem removal"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: cli-deem-mode-removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-scorer-deem-arms |
| **Successor** | 004-references-sweep-and-verification |
| **Handoff Criteria** | The completion criteria in `goal.md` each pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Deem deprecation, phase 046 of the cli-jev workflow integration.

**Scope Boundary**: The hub serves `cli-jev` alone, still passes as a parent hub, and is ready for a second classifier as one new mode.

**Dependencies**:
- The operator's request of 2026-10-02 to remove Deem and keep Jev.
- `../001-removal-plan/inventory.md` for every phase after 001.

**Deliverables**:
- The `cli-deem` packet and its Hermes copy
- The hub's registry, router, leaf manifest, ROUTER.md, SKILL.md, README, description, graph metadata, benchmark, playbook and changelog
- The cli-classifier compiled-routing fixtures and harness
- The advisor's `skill-graph.json` and `cli-external-orchestration` metadata

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub registers `cli-deem` beside `cli-jev` in its registry, router, leaf manifest and docs, and the compiled routing, advisor graph and Hermes mirror all carry it. Deleting the packet alone would break every one of them.

### Purpose
The hub serves `cli-jev` alone, still passes as a parent hub, and is ready for a second classifier as one new mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `cli-deem` packet and its Hermes copy
- The hub's registry, router, leaf manifest, ROUTER.md, SKILL.md, README, description, graph metadata, benchmark, playbook and changelog
- The cli-classifier compiled-routing fixtures and harness
- The advisor's `skill-graph.json` and `cli-external-orchestration` metadata

### Out of Scope
- Scorers, which are 002
- Catalogs and docs outside the hub, which are 004
- The local Deem server

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-deem/` | Delete | The mode packet |
| `.hermes/skills/cli-deem/` | Delete | Regenerated mirror |
| `.skilled/skills/cli-classifier/` hub files | Modify | One mode |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/` | Modify | Fixtures and harness |
| Advisor graph and `cli-external-orchestration` metadata | Modify | Drop the mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet and its Hermes copy are gone and the mirror check passes |
| REQ-002 | The parent-hub check passes with one mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Routing reads compiled-serving and the harness passes |
| REQ-004 | The advisor graph and orchestration metadata hold no `cli-deem`, and the advisor suite passes |
| REQ-005 | One cross-family review: P0 and P1 fixed, P2 recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A classifier prompt routes to `cli-jev`.
- **SC-002**: Adding a second classifier needs one new mode and no hub redesign.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A routing rule assumes two modes | Med | 001 cites the mode-count rules first |
| Risk | The routing manifest goes stale after the SKILL.md edit | Low | The commit hook re-mints it, and the status check runs after |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No file holds, reads or prints a credential, and no worker opens a `.env` file.

### Reliability
- **NFR-R01**: Each change is a path-scoped commit that `git revert` undoes on its own.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A match on the English word `deem` is kept, and the inventory marks it keep.

### Error Scenarios
- A suite that fails after an edit blocks that edit's commit until it passes or the edit is reverted.

### State Transitions
- Not applicable. No runtime state changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Bounded by the inventory |
| Risk | 6/25 | Removal behind suites and byte diffs |
| Research | 4/20 | 001 maps the references |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator set the scope on 2026-10-02.
<!-- /ANCHOR:questions -->

---
