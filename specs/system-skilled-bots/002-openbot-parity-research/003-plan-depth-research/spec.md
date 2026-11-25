---
title: "Feature Specification: Planning-depth review of the 003 build plan"
description: "The 003 build phases were written one at a time and each passed its own review, and nobody had asked whether a builder could finish one without making a design decision. This run asked that of thirteen phases, found four blockers and ninety-eight more findings, and wrote fifteen work orders that close each gap."
trigger_phrases:
  - "plan depth research"
  - "phase 3 plan depth research"
  - "planning depth review"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Planning-depth review of the 003 build plan

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-plan-review-research |
| **Successor** | None |
| **Handoff Criteria** | Every 003 phase is deep enough to build in one shot or carries the child phases it needs, and the depth synthesis names a verdict per phase and ranks the expansion plan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Research runs for the OpenBot parity work: plan review and plan depth specification.

**Scope Boundary**: The thirteen phase packets of `specs/system-skilled-bots/003-openbot-parity-build` other than `003-terminal-screen`, read against the built runtime, against each other, against the 001 parity synthesis and against the reference repos. `003-terminal-screen` is the depth benchmark and is not a subject.

**Dependencies**:
- The thirteen 003 phase packets, each with `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`.
- The built skilled-bots runtime under `.skilled/skills/system-skilled-bots/runtime/lib/` and `.skilled/bin/bots.cjs`.
- The 001 parity synthesis and the reference repos under `specs/system-skilled-bots/context/`.
- The terminal screen's design contract, which sets the depth bar the other phases are measured against.

**Deliverables**:
- `research/research.md`, the merged synthesis with a verdict per phase, eleven cross-cutting gaps and fifteen expansion work orders.
- `research/resource-map.md` and `research/findings-registry.json`, the resource map and the merged registry of 102 findings.
- `research/steering-log.md` and `research/fanout-attribution.md`, the operator-side run record and the per-lineage attribution table.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 003 build phases were written one at a time, and each one passed its own review. Nobody had asked the question that decides whether the build can run in one shot: can a builder finish this phase without making a design decision? The parent spec hands most build work to DeepSeek Flash executors and keeps the strongest model as a last fallback [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:188], so every decision left open is made by the weakest builder on the roster, once per worker [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:33].

### Purpose
A verdict for each of the thirteen phases and fifteen work orders that name the files to create or edit, the content each must hold and what it depends on, so the build plan can be expanded before any phase starts [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:263].
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ find specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages -maxdepth 3 -path "*/iterations/iteration-*.md" | wc -l
      20
$ grep -c "^### WO-" specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md
15
$ grep -c "^| 0[0-9][0-9]-" specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md
13
$ node -p "require('./specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/findings-registry.json').keyFindings.length"
102
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research` fan-out over the thirteen 003 phase packets other than the terminal screen, with `003-terminal-screen` as the depth benchmark.
- Ask of each phase whether a builder needs a design decision, and name the artifact or child phase that closes each gap.
- Check each phase against the built runtime, against the other phases and against the terminal screen's new design contract.
- Rank the gaps into fifteen expansion work orders, each with a wave position and a dependency.
- Record the findings the synthesis rejected, downgraded or upgraded, and the citation accuracy of each lineage.

### Out of Scope
- Building any phase or editing the 003 documents - the work orders name the edits and the build packet applies them.
- Reviewing the six children of `003-terminal-screen` - it is the benchmark, not a subject.
- New design research - the run reads the plans and the runtime, and adds no design.
- Changing the reference repos under `specs/system-skilled-bots/context/` - they are read-only inputs and stay gitignored.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | The four lineage folders, the merged findings registry, `research.md`, `resource-map.md`, the steering log and the attribution table |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Packet docs and continuity |
| `goal.md` | Create | The durable directive and its completion criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run reviews all thirteen 003 phase packets other than the terminal screen, with at least 20 iteration records across the lineages that ran. | `find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' \| wc -l` prints 20, and `research/research.md` names each of the thirteen phase folders. |
| REQ-002 | Every finding names the phase, the gap, the evidence with a resolving `[SOURCE: path:line]`, a severity and the closing artifact. | `research/findings-registry.json` records 102 key findings, and `research/research.md` section 8 marks each one confirmed, weak, wrong or not verified. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The synthesis gives a verdict per phase and names the work order that closes it. | `research/research.md` section 3 holds 13 rows, and each row names a work order. |
| REQ-004 | The synthesis ranks the expansion into fifteen work orders with a wave order and a dependency per order. | `grep -c '^### WO-' research/research.md` prints 15, and section 6.1 holds the wave diagram and the dependency table. |
| REQ-005 | The synthesis records the findings it rejected, downgraded or upgraded, with the reason for each regrade. | `research/research.md` section 7 holds the four regrade tables, and section 8 holds the per-lineage accuracy table. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 003 build plan can be expanded from the fifteen work orders without a second research run, because each order names its files, its content and its dependencies.
- **SC-002**: 20 iteration records exist under `research/lineages/`, and the merged registry holds 102 findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The opencode executor's monthly quota | opencode stops before its first iteration and contributes nothing | The vibe lineage covers the same angles, and a Codex top-up of two lineages adds 10 iterations |
| Risk | A verdict rests on a reading, not a run | A "needs artifacts" claim is wrong | Every finding is re-checked against its cited line, and section 8 marks each one confirmed, weak, wrong or not verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The nine operator decisions the run opened are recorded with a recommended default in `research/research.md` section 6.1, and none of them blocks the record.
<!-- /ANCHOR:questions -->

---


