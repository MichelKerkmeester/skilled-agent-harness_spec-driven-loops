---
title: "Feature Specification: Phase 2: removal-plan"
description: "Two research inventories list every agent-improvement and model-benchmark reference, but not the order in which to remove them. This phase turns them into one ordered, gate-checked removal plan."
trigger_phrases:
  - "removal plan"
  - "phase 2 removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: removal-plan

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 10 |
| **Predecessor** | 001-removal-research |
| **Successor** | 003-agent-mirror-checker-relocation |
| **Handoff Criteria** | Every inventoried file outside the packet and history maps to exactly one of phases 003 to 010, and ADR-001 to ADR-005 are recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the agent-improvement and model-benchmark removal packet.

**Scope Boundary**: Planning only: merge the two inventories, decide the removal strategy and re-scope phases 003 to 006. No repository file outside this packet changes.

**Dependencies**:
- Both `001-removal-research` children closed with verified `research.md` files

**Deliverables**:
- `plan.md` and `tasks.md` with the ordered removal
- `decision-record.md` covering deprecate-then-delete versus a single pass and the fate of `sk-create-benchmark`
- Updated scope in the spec of each of phases 003 to 006

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two inventories overlap on shared surfaces such as the `deep-improvement` packet, the hub registry and the advisor maps, and some removals must land together or a gate breaks between phases. Without one plan, phases 003 to 006 would each guess the order.

### Purpose
One ordered plan where each inventoried reference belongs to exactly one phase, and every phase ends on green gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merge and de-duplicate the two inventories
- Decide deprecate-then-delete versus a single deletion pass
- Order the removal so each phase leaves the hub, advisor and runtimes green
- Re-scope phases 003 to 006 from the merged inventory

### Out of Scope
- Editing any non-packet file - phases 003 to 006 own the changes
- The research, review and ai-council modes - they stay

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `plan.md`, `tasks.md`, `decision-record.md`, `acceptance-criteria.md` | Create | The removal program and its decisions |
| `../00[3-9]-*/scratch/files.txt`, `../010-*/scratch/files.txt` | Create | Per-phase file lists, each file in exactly one phase |
| `../00[3-9]-*/spec.md`, `../010-*/spec.md` | Modify | Scope re-cut from the merged inventory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Assign every inventoried file outside the packet and the history classes to exactly one implementation phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Record the removal strategy, the mirror checker's new home, the benchmark-family scope, the implementation method and the history rule as decisions |
| REQ-003 | Assign every issue the research spotted in passing to a phase |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The per-phase lists cover all 274 assigned files. One file sits in two lists on purpose: `agent-mirror-sync.yml` gets its checker path in phase 003 and its build steps in phase 009. Ten files were added after the first count: seven tracked symlinks the text search did not follow, the `bin/README.md` row, the SOURCE_TAGS test and the CI defect.
- **SC-002**: Each of phases 003 to 010 states its files, its gate and its dependency on earlier phases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both research inventories | No basis for the plan | Phase 001 is complete and verified |
| Risk | A reference missed by both inventories | Med | Phase 010 reruns the repo-wide search on the final state |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths, and runs in the worktree, never in the main checkout.

### Reliability
- **NFR-R01**: Every work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files: never hand-edited; regenerated in phase 010.
- Gitignored `BARTER.md`: edited on main with a backup, since the worktree does not contain it.

### Error Scenarios
- DevPass limit: fall back to Cline at `xhigh`, then wait for the DevPass reset.
- A unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.

### State Transitions
- Partial phase: the tasks list marks each finished unit, and the snapshot hash is recorded beside it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 25/25 | About 284 files plus a 1,100-file packet, seven runtimes |
| Risk | 18/25 | Shared registry, advisor and hook contracts |
| Research | 5/20 | Done in phase 001 |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The decisions are recorded in `decision-record.md`.
<!-- /ANCHOR:questions -->

---


