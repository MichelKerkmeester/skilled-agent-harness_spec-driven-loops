---
title: "Feature Specification: Fixtures Benchmarks Archive And Runtime Cleanup"
description: "Phase 004 retires active deep-context fixtures, benchmarks, generated-source references, and optional runtime context branches after phases 002 and 003 prove public behavior and discoverability are safe."
trigger_phrases:
  - "deep-context fixture cleanup"
  - "deep-context benchmark cleanup"
  - "deep-context runtime cleanup"
  - "archive deep-context packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/004-fixtures-benchmarks-and-runtime-cleanup"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 004 cleanup"
    next_safe_action: "Recover Spec Memory daemon and reindex packet metadata"
    blockers:
      - "Spec Memory daemon indexing is unavailable: socket absent."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../003-discoverability-docs-mirrors-and-index/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-004-contract-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Spec Memory reindex pending daemon recovery."
    answered_questions:
      - "Active context fan-out is rejected; historical context artifact parsing remains with tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fixtures Benchmarks Archive And Runtime Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 004 is the final cleanup phase. It updates or retires active fixtures and behavior benchmarks that still model standalone `deep-context`, reconciles missing nested packet references, and removes runtime `context` branches only when tests prove no current command, advisor, fixture, or generated contract depends on them.

**Key Decisions**: cleanup waits for phases 002 and 003; runtime branch removal is conditional; generated and benchmark assets are updated through owner workflows when possible.

**Critical Dependencies**: verified public redirect, verified discoverability cleanup, runtime test suite, generated command contract compiler, and fixture/benchmark inventory.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Validated |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 4 |
| **Predecessor** | `../003-discoverability-docs-mirrors-and-index/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Active fixtures, benchmarks, generated-source lists, and runtime branches either no longer require standalone context or are explicitly retained for historical artifact compatibility with tests. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Even after public and discoverability cleanup, test fixtures, behavior benchmarks, generated source lists, and shared runtime branches can keep standalone `deep-context` alive as an active compatibility path. Current evidence shows runtime scripts accepting `context`, tests creating context artifacts, command compilation listing missing deep-context sources, and shared benchmark/docs surfaces referencing context mode.

Direct glob checks did not find `.opencode/skills/deep-loop-workflows/deep-context/**`, even though generated contracts and docs reference that nested packet. Phase 004 must reconcile whether the packet is already absent, moved, or incorrectly referenced before archiving or deleting anything.

### Purpose

Retire active standalone context fixtures and runtime dependencies safely, preserving only concrete historical-artifact compatibility that tests prove is still needed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify whether nested `deep-context` packet files exist, are already archived elsewhere, or are stale references.
- Update command contract compiler source lists so generated contracts no longer require missing deep-context packet or agent files.
- Remove, replace, or mark inactive behavior benchmark entries and fixtures that model standalone `context` mode as a current lane.
- Update runtime tests and fixture data that only exist to keep standalone `context` mode active.
- Remove runtime `context` branches only when command, registry, advisor, fixture, and test evidence proves no current consumer remains.
- Retain minimal context artifact parsing if needed for historical packets, and document that compatibility explicitly.

### Out of Scope

- Public `/deep:context` redirect implementation; phase 002 owns that.
- Registry, advisor, and active docs cleanup; phase 003 owns that.
- Deleting historical spec records or old completed context artifacts for cosmetic cleanup.
- Replacing `@context` with another retrieval agent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` | Modify | Remove or alter context contract source list after public route and discoverability cleanup. |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Conditional modify | Remove or retain `context` convergence branch based on tests. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Conditional modify | Remove context fanout behavior or retain historical parser path. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Conditional modify | Remove context loop type if no active consumer remains. |
| `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs` | Conditional modify | Remove or quarantine deep-context route-proof validation. |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Conditional modify | Remove context query support only if coverage graph no longer needs it. |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Conditional modify | Remove context status support only if no artifact compatibility need remains. |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Conditional modify | Remove context upsert support only if no historical artifact compatibility need remains. |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/*` | Conditional modify | Remove or retain context loop type at the schema/query layer. |
| `.opencode/skills/deep-loop-runtime/tests/**` | Modify | Update tests away from standalone context or add explicit historical compatibility tests. |
| `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md` | Modify | Remove active CXB/deep-context benchmark lane or mark it archived. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json` | Modify/archive | Replace active benchmark fixture or archive it after scoring tests are updated. |
| `.opencode/skills/deep-loop-workflows/README.md` and graph metadata | Modify/refresh | Stop describing a missing nested deep-context packet as active. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm phases 002 and 003 passed. | Public redirect, registry/advisor cleanup, and active docs cleanup have verification evidence before runtime cleanup starts. |
| REQ-002 | Classify all remaining `context` runtime consumers. | Each runtime/test/fixture hit is marked active current behavior, historical compatibility, generated stale reference, or false positive. |
| REQ-003 | Reconcile missing nested packet references. | Generated/source docs stop requiring nonexistent deep-context packet files, or the packet location is found and archived deliberately. |
| REQ-004 | Update fixtures and benchmarks safely. | Active benchmark fixtures no longer score standalone context as a current lane, or retained fixtures are marked historical compatibility with tests. |
| REQ-005 | Gate runtime branch removal on tests. | Runtime `context` branches are removed only after targeted runtime tests pass, or retained with an explicit compatibility reason and tests. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve historical artifacts. | Existing completed context reports remain readable or documented as archived records. |
| REQ-007 | Refresh generated docs and metadata. | Runtime skill docs, graph metadata, phase metadata, and generated contracts/indexes agree with the final decision. |
| REQ-008 | Provide rollback path. | Reverting runtime/fixture edits and rerunning generation restores the prior tested state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No active fixture or benchmark treats standalone `deep-context` as a current supported lane.
- **SC-002**: Generated command contracts do not depend on missing deep-context packet or agent files.
- **SC-003**: Runtime `context` handling is either removed with passing tests or retained only for documented historical-artifact compatibility.
- **SC-004**: Deep-loop workflow docs and runtime docs agree on current supported modes.
- **SC-005**: Phase 004 validates strictly and parent recursive validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 and 003 | Runtime cleanup could remove active support too early. | Do not start phase 004 until earlier phases pass. |
| Dependency | Runtime tests | Removing `context` branches can break shared graph/runtime assumptions. | Run targeted and adjacent tests before claiming closure. |
| Risk | Historical artifact incompatibility | Old packets may become unreadable. | Retain minimal parser support if tests prove persisted artifacts need it. |
| Risk | Missing packet references hide generation bugs | Compiler may continue to list nonexistent files. | Update source lists and regenerate contracts. |
| Risk | Fixture removal weakens benchmark coverage | Skill benchmark expectations may lose a lane. | Replace with research/review fixture coverage or mark context fixture archived. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Runtime cleanup must not degrade research/review/council runtime tests or coverage graph operations.

### Security
- **NFR-S01**: Fixture/archive movement must not expose private benchmark fixture contents in public docs.

### Reliability
- **NFR-R01**: Historical artifacts must either remain readable or have a documented archive boundary with no current runtime dependency.

---

## 8. EDGE CASES

### Runtime Compatibility
- If persisted context artifacts are still a concrete compatibility need, retain parsing or query support with explicit tests. Do not add broad backward compatibility without evidence.

### Missing Nested Packet
- If `.opencode/skills/deep-loop-workflows/deep-context/**` remains absent, phase 004 should remove stale references and compiler inputs instead of trying to archive missing files.

### Shared Runtime Type Definitions
- Removing `context` from one runtime script may require schema, tests, and fixture updates across multiple files. Stop on failing tests and decide whether retention is safer.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Runtime scripts, tests, fixtures, benchmarks, generated contracts. |
| Risk | 20/25 | Shared runtime branches and historical artifact compatibility. |
| Research | 12/20 | Inventory evidence exists; fresh runtime impact analysis needed. |
| Multi-Agent | 4/15 | Sequential implementation preferred. |
| Coordination | 13/15 | Depends on phases 002 and 003 and closes the parent packet. |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime context branch removal breaks research/review shared code. | High | Medium | Run targeted runtime tests and retain compatibility if needed. |
| R-002 | Compiler still lists missing deep-context packet files. | High | Medium | Update compile source lists and regenerate contracts. |
| R-003 | Benchmark fixture cleanup weakens model/skill benchmark coverage. | Medium | Medium | Replace context lane expectations with supported-mode fixtures. |
| R-004 | Historical context artifacts become unreadable. | Medium | Medium | Preserve documented parser support if tests prove it is needed. |

---

## 11. USER STORIES

### US-001: No Active Fixture Drift (Priority: P0)

**As a** maintainer running tests and benchmarks, **I want** fixtures to reflect current supported modes, **so that** standalone `deep-context` does not stay alive through test data after user-facing cleanup.

**Acceptance Criteria**:
1. Given benchmark fixtures are searched, When `context` lane fixtures remain, Then each is either replaced, archived, or explicitly marked historical with tests.
2. Given generated contracts are regenerated, When source lists are inspected, Then missing deep-context packet paths are not required for current command compilation.

---

### US-002: Safe Runtime Cleanup (Priority: P1)

**As a** runtime maintainer, **I want** context branches removed only when tests prove they are unused, **so that** shared research/review/council runtime behavior stays stable.

**Acceptance Criteria**:
1. Given runtime branch removal is attempted, When targeted runtime tests run, Then research/review/council tests pass and no active context consumer remains.
2. Given tests show historical artifacts still need parsing support, When cleanup is complete, Then retained context support is documented as historical compatibility and covered by tests.

---

## 12. OPEN QUESTIONS

- Will runtime `context` parsing be removed entirely, or retained narrowly for historical artifact compatibility?
- Which benchmark fixture replaces `dlw-context-001.private.json` if skill-benchmark coverage still needs a deep-loop-workflows fixture lane?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Phase 003**: `../003-discoverability-docs-mirrors-and-index/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
