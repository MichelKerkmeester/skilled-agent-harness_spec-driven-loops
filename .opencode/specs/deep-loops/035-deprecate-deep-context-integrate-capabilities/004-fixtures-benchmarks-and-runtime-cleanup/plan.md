---
title: "Implementation Plan: Fixtures Benchmarks Archive And Runtime Cleanup"
description: "Plan fixture, benchmark, generated-source, and conditional runtime cleanup for standalone deep-context after public and discoverability phases pass."
trigger_phrases:
  - "deep-context runtime cleanup plan"
  - "deep-context fixture cleanup plan"
  - "deep-context benchmark cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/004-fixtures-benchmarks-and-runtime-cleanup"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 004 plan"
    next_safe_action: "Recover Spec Memory daemon and reindex packet metadata"
    blockers:
      - "Spec Memory daemon indexing is unavailable: socket absent."
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-004-plan"
      parent_session_id: "2026-07-04-phase-004-contract-authoring"
    completion_pct: 100
    open_questions:
      - "Spec Memory reindex pending daemon recovery."
    answered_questions:
      - "Active context fan-out is rejected; historical context artifact parsing remains with tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fixtures Benchmarks Archive And Runtime Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node/CommonJS runtime scripts, TypeScript runtime libs/tests, JSON fixtures, Markdown benchmark docs |
| **Framework** | deep-loop-runtime, deep-loop-workflows, command contract compiler, behavior benchmark framework |
| **Storage** | `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/deep-loop-workflows/`, compiled command assets |
| **Testing** | Runtime unit/integration tests, command contract regeneration, benchmark fixture tests, SpecKit validation |

### Overview

Phase 004 starts with inventory, not deletion. It classifies every remaining context runtime, fixture, benchmark, compiler, and docs reference, then either removes it with tests or retains it as narrow historical compatibility with tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 public redirect verification passed.
- [x] Phase 003 registry/advisor/docs cleanup verification passed.
- [x] Fresh runtime/fixture/benchmark grep inventory captured.
- [x] Runtime test commands identified.

### Definition of Done
- [x] Active context fixtures and benchmark lanes are removed, replaced, or archived.
- [x] Generated command compiler no longer depends on missing deep-context files.
- [x] Runtime context handling is removed or explicitly retained for historical compatibility with tests.
- [x] Deep-loop workflow/runtime docs agree on supported current modes.
- [x] Strict child and recursive parent validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-gated runtime retirement.

### Key Components
- **Compiler source lists**: determine whether generated command contracts require missing context packet files.
- **Runtime loop type support**: scripts and coverage graph libs that accept `context` as a loop type.
- **Tests and fixtures**: runtime and benchmark data that may keep context as an active lane.
- **Historical artifact compatibility**: narrow retained behavior if old context artifacts still need read/query support.

### Data Flow

```text
Phases 002 and 003 verified
  -> runtime/fixture inventory
  -> classify current vs historical references
  -> remove or retain with tests
  -> regenerate contracts/indexes
  -> final parent validation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compile-command-contracts.cjs` | Compiled contract source authority | Remove context command generation or stale missing-source inputs | Regenerate contracts and inspect diff |
| Runtime scripts accepting `context` | Shared execution/query/status support | Remove or retain narrowly | Runtime tests |
| Coverage graph libs/schema | Stores loop type data | Remove context only if no compatibility need remains | Unit/integration tests |
| Runtime tests using `context` | Regression coverage | Replace with supported modes or historical tests | Test pass with changed expectations |
| Behavior benchmark framework | Lists CXB/deep-context lane | Archive or remove active lane | Benchmark docs/tests |
| Skill benchmark fixture `dlw-context-001.private.json` | Deep-loop-workflows private fixture | Replace, archive, or mark historical | Skill benchmark tests |
| Deep-loop-workflows docs/metadata | Mode roster and packet shape | Refresh after cleanup | Grep and metadata validation |

Required inventories:
- Same-class producers: search runtime scripts, libs, tests, fixtures, behavior benchmarks, and compiler source lists for `context`, `deep-context`, `deep_context`, `context-report`, and `runtimeLoopType`.
- Consumers of changed symbols: search command contracts, registry tests, advisor tests, benchmark tests, and graph DB tests after edits.
- Matrix axes: compiler, runtime scripts, runtime libs/schema, runtime tests, behavior benchmarks, skill benchmark fixtures, generated contracts, historical artifact compatibility.
- Algorithm invariant: no runtime context support is removed unless tests prove no current consumer remains or retained compatibility is explicitly covered.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preflight
- [ ] Confirm phases 002 and 003 passed.
- [ ] Capture fresh runtime/fixture/benchmark inventory.
- [ ] Confirm nested deep-context packet file state.
- [ ] Identify runtime and benchmark test commands.

### Phase 2: Fixtures And Compiler
- [ ] Update command contract compiler source lists and regenerate contracts.
- [ ] Remove, replace, or archive active context benchmark fixtures.
- [ ] Update behavior benchmark framework docs.
- [ ] Run benchmark/skill-benchmark tests affected by fixture changes.

### Phase 3: Runtime Branch Decision
- [ ] Classify runtime `context` branches as removable or historical compatibility.
- [ ] Patch runtime scripts/libs/tests according to that classification.
- [ ] Run targeted runtime unit/integration tests.
- [ ] Stop and reconsider if research/review/council regressions appear.

### Phase 4: Finalization
- [ ] Refresh deep-loop workflow/runtime docs and metadata.
- [ ] Run full relevant validation suite.
- [ ] Refresh phase metadata and parent metadata.
- [ ] Run strict child and recursive parent validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Runtime unit tests | loop type validation, fanout, convergence, coverage graph | Existing vitest/node suites |
| Runtime integration tests | convergence script and graph behavior | Existing integration tests |
| Contract generation | command contract compiler outputs | `compile-command-contracts.cjs` |
| Benchmark tests | behavior and skill benchmark fixtures | Existing benchmark test suites |
| Active reference grep | runtime/docs/fixtures after edits | Grep |
| Spec validation | Phase 004 and parent packet | `validate.sh --strict`, recursive validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 redirect | Internal phase gate | Red | Runtime cleanup may break a still-public route. |
| Phase 003 discoverability cleanup | Internal phase gate | Red | Runtime cleanup may conflict with active registry/advisor/docs. |
| Runtime tests | Internal verification | Yellow | Cannot safely remove context branches without them. |
| Benchmark replacement fixture | Internal test data | Yellow | Skill benchmark coverage may degrade if removed without replacement. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Runtime tests fail, command generation fails, benchmark coverage drops unexpectedly, or historical artifact compatibility breaks.
- **Procedure**: Revert phase 004 runtime/fixture/compiler edits, regenerate command contracts, rerun the failed test subset, and retain context support with an explicit compatibility note until a safer removal plan is approved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phases 002 and 003 pass
  -> classify runtime and fixture references
  -> remove or retain with tests
  -> regenerate contracts and metadata
  -> close parent packet
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preflight | Phases 002 and 003 | All cleanup edits |
| Fixtures/compiler | Inventory | Runtime branch decision |
| Runtime branch decision | Targeted tests | Final validation |
| Finalization | All edits | Parent completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight | Medium | 30-90 minutes |
| Fixtures/compiler | Medium | 1-2 hours |
| Runtime branch decision | High | 2-5 hours |
| Finalization | Medium | 1-2 hours |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Earlier phase verification evidence read.
- [ ] Runtime and benchmark baseline tests captured.
- [ ] Pre-edit inventory of `context` hits captured.
- [ ] Generated contract compiler command confirmed.

### Rollback Procedure
1. Revert runtime, fixture, compiler, and docs edits from phase 004.
2. Regenerate command contracts from restored sources.
3. Rerun the failing runtime or benchmark tests.
4. Document retained context compatibility if removal is unsafe.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File-level revert plus generated contract/metadata refresh.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Earlier phase proofs -> inventory -> fixtures/compiler -> runtime branch decision -> tests -> final validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory | Phase 002/003 proofs | Classification table | All cleanup edits |
| Fixtures/compiler | Inventory | No active generated/fixture dependency | Runtime branch decision |
| Runtime branch decision | Tests and classification | Removed or retained context support | Parent closure |
| Final metadata | Cleanup result | Discoverable completion state | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm earlier phase proofs** - 15-30 minutes - CRITICAL
2. **Classify runtime/fixture hits** - 30-90 minutes - CRITICAL
3. **Patch fixtures/compiler** - 1-2 hours - CRITICAL
4. **Patch or retain runtime context branches with tests** - 2-5 hours - CRITICAL
5. **Regenerate and validate** - 1-2 hours - CRITICAL

**Total Critical Path**: 5-10 hours

**Parallel Opportunities**:
- Fixture replacement research can happen while runtime hit classification is being prepared, but final edits should stay sequential to avoid test ambiguity.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime inventory complete | Every context hit classified | Phase 004 |
| M2 | Fixtures/compiler cleaned | Generated contracts and benchmarks no longer depend on standalone context | Phase 004 |
| M3 | Runtime decision verified | Context support removed or retained with tests | Phase 004 |
| M4 | Parent ready for closure | Recursive validation passes | Phase 004 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm phases 002 and 003 have passing verification evidence.
- Classify every fixture, benchmark, compiler, and runtime context hit before editing.
- Read shared runtime files and tests before changing context branches.
- Name rollback and run targeted tests before claiming cleanup.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Classify consumers, then update fixtures/compiler, then decide runtime branch removal. |
| TASK-SCOPE | Do not change public redirect or registry/advisor discoverability in phase 004. |
| TASK-VERIFY | Run targeted runtime, fixture, compiler, and strict validation gates. |

### Status Reporting Format

Use `phase=004; task=<T###>; status=<pending|in_progress|blocked|complete>; evidence=<file-or-command>`.

### Blocked Task Protocol

If BLOCKED, document the failed test or compatibility need in `implementation-summary.md`, retain unchecked checklist items, and avoid partial runtime deletion.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Conditional Runtime Removal

**Status**: Proposed

**Context**: Runtime scripts and tests still support `context`, but public command and discoverability cleanup should happen first. Some support may be needed to read historical artifacts.

**Decision**: remove runtime `context` branches only when tests prove no current consumer or historical compatibility need remains. Otherwise retain a narrow documented compatibility path.

**Consequences**:
- Runtime cleanup may end with retained compatibility instead of full deletion.
- The retained behavior, if any, is explicit and test-backed rather than accidental.

**Alternatives Rejected**:
- Delete all context branches immediately: rejected because shared runtime regressions and historical artifact breakage are plausible.
- Keep all context branches indefinitely: rejected because it leaves hidden active support without a concrete need.
