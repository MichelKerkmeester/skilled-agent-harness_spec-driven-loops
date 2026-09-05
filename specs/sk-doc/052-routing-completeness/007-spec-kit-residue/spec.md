---
title: "Feature Specification: Phase 7: spec-kit-residue [template:level-3/spec.md]"
description: "The suite cannot finish a run, roughly a hundred and fifteen failures have a signature but no mechanism, and its tests have never been type-checked at all."
trigger_phrases:
  - "spec kit residue"
  - "contract questions"
  - "049 supersession"
  - "coverage graph repoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-03T23:30:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Closed the last three criteria on measured evidence and set the phase complete"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every contract question is ruled: two implemented, five superseded by 049, one already shipped."
      - "The suite completes sharded: 12 of 12 shards, 34m00s, no shard killed by a bound."
      - "The residue splits: 31 surviving failures in 15 named mechanisms, 150 inside 049's delete counted and attributed."
      - "The missing references split: 27 fixed where they survive, 21 recorded where they do not."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 7: spec-kit-residue

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Eight contract questions, where a test and the code it exercises assert opposite things, were
put to their owner and decided. Re-reading each against `049-memory-decommission` showed that
five of them would edit files that packet deletes outright, so they close as superseded with
their decision text intact. The two that survive are implemented and verified, and one had
already shipped.

**Key Decisions**: supersede rather than implement anything inside the `mcp-server/` delete.
restore the coverage-graph tests by repointing them at the moved subject rather than deleting
them. Give `generate-context.ts`'s `main()` an injectable project root instead of pointing its
fixture back at a real packet.

The three criteria that outlived that pass closed the same way. The suite was run to the end
rather than assumed: twelve shards, 34 minutes, nothing killed by a bound. Its residue splits into
31 failures in trees that survive 049, each now in a named mechanism group, and 150 inside the
delete that carry a count and an attribution. The missing references split identically, 27 fixed
and 21 recorded. Both inherited counts were low, 115 against 181 and 25 against 48.

**Critical Dependencies**: `specs/system-speckit/049-memory-decommission` phase
`003-spec-memory-server-removal`, whose Delete list decides which decisions are worth spending on.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-validator-and-template-debt |
| **Successor** | None |
| **Handoff Criteria** | Every ADR carries a resolution, every criterion reads `Met`, and each closed on measured evidence rather than an inherited number |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the routing completeness phases specification.

**Scope Boundary**: the recorded contract questions, the code paths their surviving decisions
name, and the three criteria those decisions left open. Nothing inside the `mcp-server/` tree is
edited, and nothing in `system-deep-loop` runtime is changed. Closing the reference criterion
widened the file list by one pair of test files, recorded in ADR-009.

**Dependencies**:
- `049-memory-decommission/003-spec-memory-server-removal` §3, the Delete list that decides
  which decisions survive

**Deliverables**:
- A resolution on every ADR, plus the daemon-recycle entry
- The three repointed coverage-graph tests, with the fourth deleted
- An injectable project root on `generate-context.ts`'s `main()`, and a hermetic fixture
- A completed whole-suite run, with its residue split by tree and grouped by mechanism
- The surviving missing references resolved, and the rest recorded

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The suite does not complete. All modules run and then a reused worker spins on a rehash storm
and never returns, so a bound kills it and the run reports nothing. Sharding works around it
by giving each shard a fresh worker.

Beneath that, roughly a hundred and fifteen failures across sixty files have an error
signature and no established mechanism. Twenty-five references to names that do not exist sit
in test files that no gate has ever type-checked, because the typecheck lane runs against a
config that excludes tests.

Five findings need a person rather than a fix, because each is a contract question where the
test and the code assert opposite things.

### Purpose

The suite completes, its failures have mechanisms rather than signatures where a mechanism is
worth buying, and the five contract questions are decided by their owner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The residue grouped by mechanism, with a worked example each.
- The untypechecked references, which are runtime failures waiting to happen.
- The five contract questions put to their owner with the evidence for each side.

### Out of Scope

- Changing what a test asserts to make it green. A test asserting the right thing about broken code means the code moves.
- The worker spin itself, which is a runtime investigation rather than a suite fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/runtime/cli/tests/coverage-graph-integration.vitest.ts` | Modify | Repoint the import at the deep-loop runtime |
| `system-spec-kit/runtime/cli/tests/coverage-graph-cross-layer.vitest.ts` | Modify | Repoint three imports at the deep-loop runtime |
| `system-spec-kit/runtime/cli/tests/graph-convergence-parity.vitest.ts` | Modify | Repoint the import at the deep-loop runtime |
| `system-spec-kit/runtime/cli/tests/session-isolation.vitest.ts` | Delete | Depends on retired MCP handler modules with no relocated equivalent |
| `system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | `main()` takes a defaulted project root |
| `system-spec-kit/runtime/cli/tests/generate-context-cli-authority.vitest.ts` | Modify | Fixture moves to a throwaway packet under a temp root |
| `system-spec-kit/runtime/cli/tests/tree-thinning.vitest.ts` | Modify | Import the exported `FileEntry` alias its annotations already name |
| `system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts` | Modify | Declare the report shape the validation script prints |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the eight recorded decisions is implemented or closed as superseded by packet 049, with the reason and the paths in `decision-record.md` |
| REQ-002 | The sharded suite runs to completion without a shard killed by its bound, and its failures are counted rather than estimated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every failure in a surviving tree is grouped by mechanism with a file and a line; failures inside 049's delete are counted and attributed by file |
| REQ-004 | Unresolved references in surviving test files are fixed, and those inside the delete are recorded with their count |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run test:sharded` reports 12 of 12 shards with no shard exiting 124, and the failure count is a number read from the run, 181, not the 115 carried before
- **SC-002**: The 31 surviving failures sit in 15 named mechanisms, and the 27 surviving unresolved references are fixed with the tree's type error count dropping by exactly 27
- **SC-003**: The ADR-008 suite leaves `git status` clean, and the two ADR-005 drifts are ruled and green, 60 of 60
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 049's delete list for `mcp-server/` | A decision closed as superseded is wrong if 049's scope moves | Every path was checked against 049 phase 003 §3 immediately before the ruling, and the check date sits beside each note |
| Risk | Repointing a fixture at a real archived packet turns tests green by mutating the repository | High | `main()` takes an injectable project root and the fixture is a throwaway packet under a temp workspace |
| Risk | A full suite run rewrites generated metadata under `specs/` | Med | The 20 rewritten files were restored, and the writer goes with 049 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sharded suite completes inside its per-shard bound; the slowest shard ran 409s against a bound that used to kill the run

### Security
- **NFR-S01**: No test writes into the real `specs/` tree; the write guard that rejected the archived packet stays in force

### Reliability
- **NFR-R01**: A shard that times out keeps its non-zero status, so a killed shard and a failing shard stay distinguishable by the per-shard line

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an empty research claim set is a vacuous pass returning 1.0, by the producer's own documentation, and the test now says so
- Maximum length: 989 modules across 12 shards is the largest run recorded, 34m00s of wall time

### Error Scenarios
- External service failure: a static ESM import that cannot resolve kills the whole test file with zero tests collected, which is why three files reported as failures with no diagnosis
- Network timeout: not applicable, the suite runs offline

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 9 code files, LOC under 200, Systems: spec-kit tests, deep-loop runtime contracts |
| Risk | 12/25 | Auth: N, API: N, Breaking: a `main()` signature gained a defaulted parameter |
| Research | 18/20 | Nine decisions each read against 049's delete list and both producers |
| Multi-Agent | 0/15 | Single session |
| Coordination | 12/15 | Depends on 049's scope and two operator rulings |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | 049's scope moves after a decision is closed as superseded | M | L | The check date is recorded beside each note; re-check before acting on any of them |
| R-002 | A drifted assertion gets rewritten to match the code, writing the drift down as the specification | H | M | Both producers were read first and both already documented the behavior; the assertions now state the contract with its reason |

---

## 11. USER STORIES

### US-001: A maintainer reads the residue (Priority: P0)

**As a** spec-kit maintainer, **I want** every surviving failure named by its mechanism with a file and a line, **so that** fifteen numbers read as fifteen causes rather than one hundred and eighty-one symptoms.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A test author runs the save-path suite (Priority: P1)

**As a** test author, **I want** the CLI authority suite to build its own throwaway packet under a temp root, **so that** a green run never depends on the shape of the real `specs/` tree and never writes into it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

Both questions this phase opened are answered. An empty research graph scores
`claimVerificationRate` 1, a vacuous pass the producer's own doc comment states, and a review
coverage gap is a FILE with no incoming COVERS, which the runtime's own tests assert on purpose.
The tests follow the producer in each case (adjacent findings A1 and A2).

What is left open belongs to other owners and is recorded rather than carried:

- No typecheck lane covers a surviving test file, and the two surviving trees report 469 and 283
  non-reference type errors, so switching one on is its own change (A4).
- The relative-path arm of the import guard is dead, because it spells the directory with an
  underscore the rename removed (A5).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
