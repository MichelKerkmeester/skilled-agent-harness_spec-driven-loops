---
title: "Feature Specification: Fan-out synthesis lineage aggregation"
description: "Make deep-research fan-out synthesis consume lineage-owned state, iterations, and deltas in place. Repair empty-registry reconstruction, publish byte-identical canonical and compatibility registries, and preserve lineage provenance through synthesis and resource-map output."
trigger_phrases:
  - "fanout synthesis lineage aggregation"
  - "deep research empty registry reconstruction"
  - "lineage delta resource map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation"
    last_updated_at: "2026-07-26T08:44:44Z"
    last_updated_by: "opencode"
    recent_action: "Completed lineage-aware fan-in, canonical synthesis, and verification"
    next_safe_action: "Begin the dependent sk-design mode-consolidation packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/commands/deep/assets/deep-research-confirm.yaml"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Lineage artifacts remain in place; synthesis reads them without copying or renumbering."
      - "Count-only state resolves from exact-count iteration Markdown or graph evidence and fails closed on mismatch."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fan-out Synthesis Lineage Aggregation

> Phase adjacency under the durable-orchestration parent (navigation order, not a runtime dependency): predecessor `006-provenance-balanced-reduction`; successor none (last sibling).

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

Deep-research fan-out completes each executor in an isolated lineage, but root synthesis still reads root-only state, iteration, registry, and delta paths. This packet makes fan-in publish the canonical registry and teaches synthesis and resource-map generation to consume lineage evidence in place without filename collisions or provenance loss.

**Key Decisions**: Keep lineage artifacts immutable in their lineage directories; publish the merged research registry to canonical and compatibility names with identical bytes.

**Critical Dependencies**: Existing fan-out merge, research reducer, auto/confirm workflow parity, and the canonical `/deep:research` synthesis path.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `../` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Fan-out writes iterations and deltas under `research/lineages/<label>/`, while synthesis reads `research/iterations/`, `research/deltas/`, and `research/findings-registry.json`. The merge currently writes only `deep-research-findings-registry.json`, and an existing registry with `keyFindings: []` prevents state-log reconstruction even when five complete lineage iterations contain findings.

### Purpose

Make fan-out synthesis consume all lineage evidence deterministically, preserve lineage attribution, and produce the same canonical artifacts that the single-executor path promises.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconstruct research findings when a lineage registry exists but its canonical finding array is empty.
- Atomically write byte-identical `findings-registry.json` and `deep-research-findings-registry.json` outputs.
- Aggregate lineage deltas into `resource-map.md` without running the root reducer over merged state.
- Make auto and confirm synthesis read lineage state and iteration files and preserve attribution.
- Regenerate the compiled deep-research contract and add regression coverage.
- Align compiler output paths with the tracked hyphenated contracts consumed by the renderer and drift checker across research, review, AI Council, and alignment.
- Permit canonical synthesis against spec folders in Git-registered linked worktrees without approving arbitrary sibling directories.
- Rerun canonical synthesis for the existing five-iteration sk-design research packet.

### Out of Scope

- Copying or renumbering lineage iteration and delta files into root directories.
- Changing single-executor research behavior or review fan-out semantics.
- Manually authoring the workflow-owned `research.md` synthesis.
- Changing convergence math, executor selection, or fan-out scheduling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Empty-registry fallback and dual registry publication |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Fan-out resource-map-only lineage delta aggregation |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modify | Lineage-aware synthesis inputs and invariants |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | Modify | Confirm-mode parity |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Generate | Compiled workflow contract |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Generate | Refresh tracked review contract |
| `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md` | Generate | Refresh tracked AI Council contract |
| `.opencode/commands/deep/assets/compiled/deep-alignment.contract.md` | Generate | Refresh tracked alignment contract |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | Align generated deep-research contract path with the renderer |
| `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | Modify | Recognize tracked hyphenated authority filenames |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Registry and lineage collision regressions |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Lineage delta aggregation regressions |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | Modify | Compiler output-path regression |
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Modify | Approve spec roots from verified Git worktree registrations |
| `.opencode/skills/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Modify | Registered-worktree and lookalike containment regressions |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modify | Assert incomplete research synthesis exits nonzero |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | Consume tracked hyphenated prompt-pack templates |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Modify | Consume tracked hyphenated review workflows |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Existing-empty research registries fall back to non-empty lineage state | CLI regression produces reconstructed findings from the state log |
| REQ-002 | Canonical and compatibility registries are identical | Both files exist and byte comparison succeeds |
| REQ-003 | Fan-out resource maps consume lineage deltas without overwriting merged registry state | Multi-lineage delta test includes all sources and registry bytes remain unchanged |
| REQ-004 | Synthesis reads lineage iterations and state without copying or renumbering | Two lineages may each retain `iteration-001.md` and both appear in synthesis inputs |
| REQ-005 | Synthesis invariants use lineage evidence | Complete and incomplete event regressions cover lineage state |
| REQ-006 | Canonical research synthesis is workflow-produced | `/deep:research` creates `research.md` and `resource-map.md` from the five existing iterations |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Auto and confirm workflows stay semantically aligned | Contract/YAML parity checks pass |
| REQ-008 | Single-executor and review behavior do not regress | Targeted runtime tests pass |
| REQ-009 | Compiler, drift checker, and renderer resolve tracked hyphenated deep-command contracts | Research, review, AI Council, and alignment compiler paths match their tracked files; live drift checks pass |
| REQ-010 | Cross-worktree synthesis remains fail-closed | A Git-registered linked worktree resolves, while an unregistered lookalike remains outside the approved roots |
| REQ-011 | Lineage evidence and outputs reject symbolic links | Symlinked lineage, delta, artifact-root, and output fixtures fail before external reads or writes |
| REQ-012 | Malformed state cannot yield partial synthesis | Invalid lineage JSONL and synthesis parse failures return nonzero |
| REQ-013 | Count-only state reconstructs complete findings | Exact-count Markdown headings or graph findings produce one canonical finding per declared finding |
| REQ-014 | Confirm mode honors resource-map disablement | Confirm config and state bind the parsed `resource_map_emit` value |
| REQ-015 | Incomplete synthesis halts the workflow | `synthesis_incomplete` is severity error and exits with status 2 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root `iterations/` and `deltas/` may remain empty while canonical fan-out synthesis succeeds.
- **SC-002**: `findings-registry.json` and `deep-research-findings-registry.json` are byte-identical after fan-in.
- **SC-003**: Resource-map output includes deterministic lineage provenance from every valid delta source.
- **SC-004**: Existing five-iteration research produces workflow-owned `research.md` without a sixth iteration.
- **SC-005**: Runtime tests, compiled contract checks, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/deep:research` YAML workflow | A prose-only fix could drift from runtime behavior | Update auto and confirm, then regenerate the compiled contract |
| Risk | Resource-map command rewrites the merged registry | Findings disappear immediately before synthesis | Add a resource-map-only fan-out branch and byte-preservation test |
| Risk | Duplicate iteration numbers collide across lineages | Evidence is silently dropped or overwritten | Read lineage files in place and sort by lineage plus iteration |
| Risk | Compatibility registry drifts from canonical registry | Consumers observe inconsistent findings | Serialize once and atomically write identical content to both paths |
| Risk | Worktree support broadens writes to arbitrary sibling directories | Workflow containment no longer protects the workspace | Trust only bidirectional Git worktree registrations and retain realpath containment |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Lineage discovery is bounded to direct `lineages/<label>/` children and stable-sorted paths.
- **NFR-P02**: No additional research iteration or artifact copy is required for synthesis.

### Security

- **NFR-S01**: All discovered paths remain beneath the resolved research artifact directory.
- **NFR-S02**: Existing artifact inputs and outputs must be real files/directories, not symbolic links.

### Reliability

- **NFR-R01**: Registry writes retain atomic temp, fsync, and rename semantics.
- **NFR-R02**: Malformed delta rows remain reported and excluded under the existing reducer policy.
- **NFR-R03**: Malformed state JSONL and unresolved finding-count mismatches halt fan-in before root projections are written.

## 8. EDGE CASES

### Data Boundaries

- No lineage directory: preserve existing no-op behavior.
- Empty lineage registry plus non-empty state: reconstruct and merge.
- Empty lineage registry plus empty state: skip the lineage.
- Duplicate iteration filenames across labels: retain both via distinct source paths.
- Root and lineage deltas together: aggregate deterministically without duplicate copying.

### Error Scenarios

- Missing canonical synthesis artifacts emit `synthesis_incomplete` with explicit failures and a nonzero exit.
- Registry or delta parse failure follows the existing fail-closed policy.
- Symbolic links at lineage, evidence, or output boundaries are rejected rather than followed.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Shared runtime, reducer, two workflows, generated contract, tests |
| Risk | 21/25 | Persistence and workflow-owned canonical output |
| Research | 14/20 | Reproduced with an existing five-iteration lineage packet |
| Multi-Agent | 5/15 | Sequential implementation; no implementation fan-out |
| Coordination | 12/15 | Runtime, workflow, synthesis, and downstream packet dependency |
| **Total** | **70/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root reducer erases merged findings | H | H | Separate fan-out resource-map-only execution |
| R-002 | Invariant counts ignore lineage state | H | H | Discover lineage state logs in invariant code |
| R-003 | Auto/confirm behavior diverges | H | M | Parallel edits plus compiled contract verification |
| R-004 | Canonical rerun starts iteration six | H | L | Use the command workflow with max-iteration state and synthesis-only instruction |

## 11. USER STORIES

### US-001: Synthesize fan-out research (Priority: P0)

**As a** deep-research operator, **I want** fan-in synthesis to consume lineage artifacts directly, **so that** completed multi-executor research produces the same canonical outputs as single-executor research.

**Acceptance Criteria**:
1. Given completed lineage iterations and empty root iteration directories, when synthesis runs, then all lineage evidence appears in canonical output.

### US-002: Preserve machine consumers (Priority: P0)

**As a** runtime consumer, **I want** both registry filenames to contain identical bytes, **so that** canonical and shipped compatibility readers cannot disagree.

**Acceptance Criteria**:
1. Given a merged research registry, when fan-in publishes it, then both paths pass byte comparison.

## 12. OPEN QUESTIONS

None. The implementation and rollback boundaries are frozen by the approved plan.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Contract**: `../spec.md`
