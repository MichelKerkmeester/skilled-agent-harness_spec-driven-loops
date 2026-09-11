---
title: "Feature Specification: Phase 2: daemon-transport-decision"
description: "Measure the resident daemon against a stateless CLI on the real prompt-hook path, then freeze the socket protocol and the latency budget"
trigger_phrases:
  - "advisor daemon decision"
  - "advisor socket protocol"
  - "hook latency baseline"
  - "daemon versus stateless"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: daemon-transport-decision

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The daemon holds warm SQLite and a resident embedder, and the CLI talks to it in MCP-shaped JSON-RPC. Removing MCP forces two questions: does the daemon survive, and what does the socket speak instead. This phase answers both with measured numbers and freezes the answers as a contract and a budget.

**Key Decisions**: Measurement decides, not preference; an inconclusive result keeps the daemon

**Critical Dependencies**: Phase 001's behavior table, which says what the baseline must cover

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
| **Phase** | 2 of 8 |
| **Predecessor** | 001-transport-and-consumer-inventory |
| **Successor** | 003-cli-front-door-parity |
| **Handoff Criteria** | The daemon question is answered with measured numbers and the socket protocol is frozen as a written contract |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the skill advisor MCP decommission specification.

**Scope Boundary**: Measure and decide. This phase writes a benchmark harness and a protocol contract, and changes no production call path.

**Dependencies**:
- Phase 001 for the behavior table that defines which paths the baseline must cover.

**Deliverables**:
- A recorded pre-change prompt-hook latency baseline, per runtime, daemon warm and daemon cold.
- Measured numbers for both the resident and the stateless design on the same harness.
- The daemon decision, stated with the numbers that justify it.
- A frozen socket protocol contract covering framing, error shape and version negotiation.
- A named latency budget, as a number, that phase 008 reports against.
- The session warm mechanism, named per runtime.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The resident daemon is why a prompt-time recommendation is fast: SQLite is warm and the embedder is already loaded. A stateless CLI is a simpler topology but moves that cost onto every prompt, and the prompt hook runs on every message. Choosing between them by taste would be guessing at the one number that decides whether the operator notices this work at all. Separately, the CLI currently speaks MCP-shaped JSON-RPC over the shared socket bridge to its own daemon, which is framing inherited from a transport that is being removed.

### Purpose
Settle the daemon question with numbers, and hand phase 003 a protocol it can implement without re-deciding anything.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A prompt-hook latency baseline recorded before any change, per runtime, warm and cold.
- A benchmark of the resident design and the stateless design on the same harness and the same inputs.
- The daemon decision and its justification.
- The socket protocol contract: framing, error shape, version negotiation.
- The latency budget as a number.
- The session warm mechanism, per runtime.

### Out of Scope
- Implementing the chosen protocol. That is phase 003.
- Changing any production call path. This phase measures.
- Re-tuning the scorer or the embedder to improve the numbers. Both are preserve-set items.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-daemon-transport-decision/bench/` | Create | Harness and recorded runs for both designs |
| `002-daemon-transport-decision/baseline.md` | Create | Pre-change hook latency per runtime, warm and cold |
| `002-daemon-transport-decision/protocol-contract.md` | Create | The frozen socket protocol |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The pre-change prompt-hook latency baseline is recorded per runtime, warm and cold |
| REQ-002 | Both designs are measured on the real hook path using the same harness and inputs |
| REQ-003 | The daemon decision is stated with the numbers that justify it |
| REQ-004 | The socket protocol is frozen as a contract covering framing, errors and version negotiation |
| REQ-005 | A latency budget is named as a number |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The session warm mechanism is named per runtime |
| REQ-007 | An inconclusive measurement is recorded as inconclusive and resolves to keeping the daemon |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The daemon decision cites measured numbers, not a preference.
- **SC-002**: The protocol contract is specific enough that phase 003 implements it without asking a follow-up question.
- **SC-003**: The latency budget is a number phase 008 can check a result against.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A microbenchmark that flatters one design | High | Measure on the real prompt-hook path, with the same inputs, in each runtime |
| Risk | A baseline taken after an unrelated change | High | Record the baseline first, and pin the commit it was taken at |
| Risk | Protocol frozen too loosely to implement | Medium | Require framing, error shape and version negotiation to be specified, not described |
| Dependency | Phase 001 behavior table | Defines baseline coverage | Do not start the baseline until the table exists |
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
