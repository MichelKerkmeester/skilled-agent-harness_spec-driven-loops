---
title: "Implementation Plan: Fan-out synthesis lineage aggregation"
description: "Repair deep-research fan-in by reconstructing empty registries from lineage state, publishing one serialized registry to two names, and adding a resource-map-only lineage delta path. Auto and confirm synthesis then read lineage evidence directly and verify it before canonical output is accepted."
trigger_phrases:
  - "fanout synthesis implementation plan"
  - "lineage registry merge plan"
  - "deep research resource map fanout"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/005-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Delivered and verified the lineage-aware implementation path"
    next_safe_action: "Begin the dependent sk-design mode-consolidation packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fan-out Synthesis Lineage Aggregation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS JavaScript, TypeScript tests, YAML workflow contracts |
| **Framework** | Node.js, Vitest, SpecKit deep-loop runtime |
| **Storage** | JSON, JSONL, Markdown artifacts on disk |
| **Testing** | Vitest, workflow contract compiler/checkers, strict SpecKit validation |

### Overview

Keep every lineage artifact at its original path. Fan-in reconstructs findings from state only when an existing registry has no usable findings, serializes the merged research registry once, and atomically publishes identical canonical and compatibility files. A new fan-out resource-map-only reducer path reads lineage deltas without rebuilding the root registry, while both synthesis workflows discover lineage state and iterations for metrics, compilation, and invariant checks.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem and reproduction documented in `spec.md`.
- [x] Root-only and lineage-owned input surfaces identified.
- [x] Canonical research packet and required synthesis workflow identified.

### Definition of Done

- [x] Empty-existing registry regression passes.
- [x] Canonical and compatibility registry bytes match.
- [x] Lineage delta aggregation preserves the merged registry.
- [x] Auto and confirm workflows read lineage state and iterations.
- [x] All four compiled deep-command contracts are fresh.
- [x] Canonical `/deep:research` synthesis produces `research.md` and `resource-map.md`.
- [x] Strict packet validation passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deterministic fan-in over immutable lineage artifacts with canonical root projections.

### Key Components

- **Fan-out merge**: Reads each direct lineage registry and state log, reconstructs only when the registry has no usable findings, merges with attribution, and publishes canonical root registry projections.
- **Resource-map-only reduction**: Reads stable-sorted root and lineage delta files, attaches lineage provenance, and writes only `resource-map.md`.
- **Synthesis workflows**: Discover root and lineage inputs, compile canonical research, and evaluate invariants against the same evidence set.
- **Artifact-root resolver**: Adds only spec roots from bidirectionally verified Git worktree registrations to the existing current-repository and temporary-directory allowlist.

### Data Flow

`lineages/<label>/{state,iterations,deltas,registry}` flows into the merged root registry and resource map by reference. Synthesis reads the original iteration files and merged registry, writes root `research.md`, then records complete or incomplete state based on lineage-aware invariants.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-merge.cjs` | Registry producer | Repair empty-registry fallback and dual publication | Unit and CLI regressions |
| `reduce-state.cjs` | Registry/dashboard/resource-map reducer | Add write-isolated fan-out resource-map path | Registry byte-preservation test |
| Auto workflow | Canonical autonomous synthesis | Read lineage state/iterations/deltas and use lineage invariants | Contract tests and canonical rerun |
| Confirm workflow | Interactive synthesis parity | Mirror auto behavior | Contract parity tests |
| Compiled deep-research contract | Generated command contract | Regenerate from canonical workflows | Freshness check |
| Contract compiler path | Generated output owner | Align research, review, and AI Council outputs with tracked hyphenated contracts | Compiler, drift, and renderer tests |
| Existing sk-design research packet | Real reproduction and downstream input | Rerun synthesis only | `research.md`, `resource-map.md`, complete event |
| `review-research-paths.cjs` | Artifact write-boundary resolver | Recognize registered linked-worktree spec roots | Positive registration and negative lookalike tests |

Algorithm invariant: each lineage path is a distinct evidence identity. A repeated basename such as `iteration-001.md` never deduplicates or overwrites another lineage's file.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Capture targeted runtime and workflow baseline results.
- [x] Record existing research packet root/lineage artifact layout.
- [x] Confirm no relevant target files contain unrelated unstaged edits.

### Phase 2: Core Implementation

- [x] Repair empty-registry reconstruction and dual registry publication.
- [x] Add resource-map-only lineage delta aggregation.
- [x] Update auto and confirm synthesis input discovery and invariants.
- [x] Align compiler output paths with all four tracked renderer contracts.
- [x] Regenerate all four compiled contracts.
- [x] Add all required regressions.
- [x] Add fail-closed linked-worktree and symbolic-link containment support and regressions.

### Phase 3: Verification

- [x] Run targeted and package-level runtime tests.
- [x] Rerun `/deep:research` synthesis without a new iteration.
- [x] Verify canonical artifacts, update completion docs, and run strict validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry normalization, reconstruction, merge ordering | Vitest |
| Integration | CLI dual-write, duplicate iteration basenames, lineage delta map | Vitest with temporary directories |
| Security | Registered linked-worktree roots versus unregistered lookalikes | Resolver Vitest fixture with bidirectional Git metadata |
| Contract | Auto/confirm YAML and compiled deep-research contract | Repository contract compiler/checkers |
| End-to-end | Existing five-iteration sk-design research synthesis | Canonical `/deep:research` command |
| Documentation | Packet anchors, metadata, checklist evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing lineage research packet | Internal evidence | Green | End-to-end proof unavailable |
| Deep-loop runtime Vitest package | Internal test | Green | Regression gate unavailable |
| Deep contract generator | Internal generated artifact | Green | Compiled contract remains stale |
| SpecKit metadata and validator scripts | Internal docs | Green | Packet cannot close |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Registry bytes diverge, single-executor behavior regresses, lineage evidence is omitted, or canonical synthesis starts a sixth iteration.
- **Procedure**: Revert only Packet 1 runtime/workflow/test changes and regenerated contract; leave lineage research artifacts untouched. Re-run the captured baseline commands to confirm the prior behavior is restored.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline -> Merge and reducer changes -> Workflow parity -> Contract generation -> Tests -> Canonical synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Implementation |
| Merge/reducer | Baseline | Workflow parity and tests |
| Workflow parity | Merge/reducer | Contract generation and synthesis |
| Verification | All implementation | Packet completion and Packet 2 |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and baselines | Medium | 1 hour |
| Core implementation | High | 4-6 hours |
| Verification and synthesis | High | 2-4 hours |
| **Total** | **High** | **7-11 hours** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Baseline test output captured.
- [x] Existing lineage artifacts remain unmodified.
- [x] No data migration or external deployment is involved.

### Rollback Procedure

1. Restore the touched runtime, workflow, generated contract, and test files.
2. Remove only Packet 1 outputs created by a failed synthesis attempt when they are demonstrably generated.
3. Re-run the baseline test commands.
4. Confirm the five lineage iteration files and deltas are unchanged.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Generated root synthesis outputs may be regenerated; lineage sources are never deleted or rewritten.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
fanout-merge.cjs ---------> canonical registry ---------+
                                                       +-> synthesis -> research.md
lineage state/iterations -------------------------------+
lineage deltas -> resource-map-only reducer -> resource-map.md
auto + confirm YAML -> compiled deep-research contract
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registry merge | Lineage registries/state | Canonical registry bytes | Synthesis invariants |
| Resource-map path | Lineage deltas/config | Resource map | Final references |
| Workflow parity | Merge and reducer contract | Synthesis behavior | Compiled contract |
| End-to-end synthesis | All code and workflow changes | Canonical research | Packet 2 planning |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Registry and resource-map correctness** - CRITICAL
2. **Auto/confirm lineage-aware synthesis** - CRITICAL
3. **Compiled contract freshness and regressions** - CRITICAL
4. **Canonical research rerun** - CRITICAL

**Parallel Opportunities**: Unit tests for merge and resource-map collection may be authored independently after their interfaces are fixed.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fan-in projections fixed | Empty registry reconstructs and dual files match | Complete |
| M2 | Synthesis inputs aligned | Auto/confirm consume lineage evidence | Complete |
| M3 | Runtime verified | Targeted/package tests and compiled contract pass | Complete |
| M4 | Research synthesized | Existing packet has canonical workflow output | Complete |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### Decision: Read immutable lineage artifacts in place

**Status**: Accepted

**Context**: Copying lineage artifacts into root would create iteration-number collisions and sever path provenance.

**Decision**: Discover stable-sorted direct lineage inputs and preserve their original paths through merge, resource-map, compilation, and invariant evaluation.

**Consequences**: Synthesis gains a fan-out input branch, while single-executor paths remain unchanged. See `decision-record.md` for alternatives and rollback details.
