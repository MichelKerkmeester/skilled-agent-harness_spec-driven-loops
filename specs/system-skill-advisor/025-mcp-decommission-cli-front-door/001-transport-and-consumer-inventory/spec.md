---
title: "Feature Specification: Phase 1: transport-and-consumer-inventory"
description: "Exhaustive classified inventory of every MCP surface, caller, flag and document reference in the skill advisor, with each row assigned to rewire, delete or preserve"
trigger_phrases:
  - "advisor mcp inventory"
  - "advisor caller inventory"
  - "advisor preserve set"
  - "transport surface classification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: transport-and-consumer-inventory

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Every later phase acts on a list. This phase produces that list: what reaches the advisor through MCP, what calls any advisor capability by any route, what flags and documents name the retired ids, and what must survive untouched. The inventory also records behavior, so the closing phase can prove the same things still happen.

**Key Decisions**: Research only, no edits outside this folder; exhaustive classification with no unclassified rows

**Critical Dependencies**: None. This phase reads the tree as it stands and blocks the phases that act on it.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-daemon-transport-decision |
| **Handoff Criteria** | Every MCP surface, caller, flag and document is classified as rewire, delete or preserve, with no unclassified rows and an owning phase on each |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill advisor MCP decommission specification.

**Scope Boundary**: Read and classify. This phase writes only its own inventory documents and changes nothing in the runtime.

**Dependencies**:
- None. This is the first phase and it gates the rest.

**Deliverables**:
- A classified inventory of every MCP surface and every advisor caller, each row carrying its owning phase.
- The preserve set, written out, with a named owner per item.
- A behavior table: runtime, trigger, observable output, for everything that happens automatically today.
- An answer on whether the Python compatibility shim still has a reason to exist.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Later phases delete a transport, repoint callers and sweep documents. Each needs a complete list before it starts, and the cost of a missed row is asymmetric: a caller nobody inventoried breaks after the transport is already gone. The surfaces are also not in one place. The SDK is imported in a handful of files, the server is declared in five runtime config roots, callers reach the advisor over three different transports, and the retired tool ids appear across dozens of documents that mix live instruction with historical evidence.

### Purpose
Hand phases 003 through 007 a complete, classified worklist so no later phase has to discover its own scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file importing the MCP SDK inside the advisor package, with its owning phase.
- Every runtime config root that declares the advisor server, with its exact key and env block.
- Every caller of any advisor capability, with the transport it uses today.
- Every flag that exists only to serve the MCP transport.
- Every document naming a retired tool id, split into live instruction surface and historical evidence.
- The preserve set, and the behavior table of what happens automatically today.

### Out of Scope
- Acting on any finding. Rewiring, deleting and sweeping belong to phases 004, 005 and 007.
- Routing quality, lane weights and the scorer. The inventory records them as preserve-set items and does not analyze them.
- Other MCP servers, beyond recording that they are preserved.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-transport-and-consumer-inventory/research/` | Create | Iteration files and the classified inventory |
| `001-transport-and-consumer-inventory/inventory.md` | Create | The classified worklist later phases consume |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every MCP SDK importer in the advisor package is listed with its owning phase |
| REQ-002 | Every runtime config root declaring the advisor server is listed with its key and env block |
| REQ-003 | Every advisor caller is listed with its transport and its owning phase |
| REQ-004 | The preserve set is written down with a named owner per item |
| REQ-005 | The behavior table records runtime, trigger and observable output for every automatic behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every document naming a retired tool id is listed and split into live surface and historical evidence |
| REQ-007 | The Python compatibility shim question is answered with a recommendation and its reasoning |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No row in the inventory is unclassified.
- **SC-002**: Every row names the phase that owns it.
- **SC-003**: The behavior table covers every runtime the advisor currently serves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An inventory that looks complete but misses a caller | High | Enumerate by transport and by symbol, then reconcile the two lists against each other |
| Risk | Live instruction and historical evidence conflated | Medium | Classify every document hit into one bucket explicitly; a borderline case is escalated, not guessed |
| Dependency | The tree as it stands today | Blocks every later phase | Freeze the commit the inventory was taken at and record it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every claim in the deliverable cites the file, command or output it came from. An uncited claim is a finding, not a row.

---

## 8. EDGE CASES

### Classification boundaries
- A surface that is both live instruction and historical evidence: classify as live, and record the historical copy separately.
- A caller reached only under a flag that is off by default: classify it, and record the flag as the condition.

---

## 9. COMPLEXITY ASSESSMENT

Research phase. Complexity sits in coverage rather than in change: the cost of a missed row is a broken caller discovered after the transport is gone.

---

## 12. OPEN QUESTIONS

- Which surfaces count as live instruction rather than historical evidence, and who decides the borderline cases?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Goal**: See `goal.md` for the durable directive this phase executes against
- **Parent Goal**: See `../goal.md` for the packet directive that outranks it
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
