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
| `system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Modify | Repoint the import at the deep-loop runtime |
| `system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | Modify | Repoint three imports at the deep-loop runtime |
| `system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts` | Modify | Repoint the import at the deep-loop runtime |
| `system-spec-kit/scripts/tests/session-isolation.vitest.ts` | Delete | Depends on retired MCP handler modules with no relocated equivalent |
| `system-spec-kit/scripts/memory/generate-context.ts` | Modify | `main()` takes a defaulted project root |
| `system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` | Modify | Fixture moves to a throwaway packet under a temp root |
| `system-spec-kit/scripts/tests/tree-thinning.vitest.ts` | Modify | Import the exported `FileEntry` alias its annotations already name |
| `system-spec-kit/scripts/tests/progressive-validation.vitest.ts` | Modify | Declare the report shape the validation script prints |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | [Requirement description] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | [Requirement description] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

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
