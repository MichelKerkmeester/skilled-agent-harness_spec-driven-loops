---
title: "Implementation Plan: Deep-Research Investigation of System-Spec-Kit MCP Sidecar"
description: "Research strategy for 20 deep-research iterations across drift, dead code, security, over-engineering, simplification, and refinement angles."
trigger_phrases:
  - "sidecar deep research plan"
  - "drift simplification research strategy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification"
    last_updated_at: "2026-05-22T21:00:18Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-research-plan"
    next_safe_action: "run-iteration-001-drift-detection"
    blockers: []
    key_files:
      - "plan.md"
      - "research/deep-research-config.json"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0100010100010100010100010100010100010100010100010100010100010100"
      session_id: "013-embedder-testing-and-architecture-010-001"
      parent_session_id: null
    completion_pct: 0
---
# Implementation Plan: Deep-Research Investigation of System-Spec-Kit MCP Sidecar

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Python, shell |
| **Framework** | system-spec-kit MCP server, deep-research workflow |
| **Storage** | Research JSONL, findings registry JSON, markdown iteration artifacts |
| **Testing** | Strict spec validation; research workflow state validation during execution |

### Overview
Run 20 research iterations across six sidecar investigation angles. The executor mix is recorded as 10 cli-devin SWE-1.6 iterations and 10 cli-opencode DeepSeek-v4-pro high iterations, alternating by task, with actual dispatch owned by the deep-research workflow rather than this scaffold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research scope names primary sidecar files and immediate dependencies.
- [x] State files exist under `research/`.
- [x] Executor mix and per-iteration budget are documented.

### Definition of Done
- [ ] 20 iteration markdowns exist.
- [ ] State JSONL includes iteration records and a convergence event.
- [ ] Findings registry is populated and deduplicated.
- [ ] Final synthesis categorizes findings across all six angles.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-owned research loop with packet-local state.

### Key Components
- **Research config**: Immutable loop parameters, executor schedule, and file-protection contract.
- **State JSONL**: Append-only lifecycle and iteration event log.
- **Strategy/dashboard/registry**: Reducer-owned research guidance, progress state, and deduplicated finding inventory.
- **Iteration artifacts**: Write-once markdown and delta records for each pass.

### Data Flow
The deep-research workflow reads `deep-research-config.json`, renders an iteration prompt from `deep-research-strategy.md`, dispatches the selected executor, writes an iteration markdown and delta, appends JSONL state, and refreshes dashboard/registry outputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:methodology -->
## 3. RESEARCH METHODOLOGY

### Iteration Model

The investigation runs 20 iterations across six angles:

| Angle | Focus | Iteration Count |
|-------|-------|-----------------|
| 1 | Drift detection | 4 |
| 2 | Dead code | 4 |
| 3 | Security risks | 3 |
| 4 | Over-engineering | 3 |
| 5 | Simplification opportunities | 3 |
| 6 | Refinement | 3 |

### Executor Mix

| Executor | Model | Iterations | Notes |
|----------|-------|------------|-------|
| cli-devin | SWE-1.6 | 10 | Assigned to odd-numbered tasks. |
| cli-opencode | deepseek-v4-pro high | 10 | Assigned to even-numbered tasks. |

The parent agent manages executor selection per iteration through the deep-research workflow. This scaffold records the plan only and does not self-dispatch.

### Budgets

| Budget | Value |
|--------|-------|
| Tool calls per iteration | 12 |
| Timeout per iteration | 25 minutes |
| Total duration cap | 600 minutes |
| Max iterations | 20 |
<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:convergence -->
## 4. CONVERGENCE

Stop when either condition is met:

- `newInfoRatio <= 0.10` for 2 consecutive iterations.
- All six angles are covered at least 3 times.

The planned 20-iteration rotation satisfies the second condition by construction while still allowing the reducer to mark convergence earlier if novelty drops below the threshold twice in a row.
<!-- /ANCHOR:convergence -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create parent and child spec scaffolds.
- [x] Create deep-research state files and artifact directories.
- [x] Record executor schedule and file-protection contract.

### Phase 2: Implementation
- [ ] Execute T001-T020 research iterations through the workflow.
- [ ] Append JSONL state and deltas for each iteration.
- [ ] Maintain dashboard and registry via reducer-owned updates.

### Phase 3: Verification
- [ ] Compile final synthesis.
- [ ] Confirm all angles meet coverage.
- [ ] Run strict validation for parent and child.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Parent and child scaffold correctness | `validate.sh --strict` |
| State validation | JSON and JSONL shape | Deep-research reducer and workflow checks during execution |
| Research QA | Evidence quality, deduplication, angle coverage | Dashboard, findings registry, synthesis review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-research workflow | Internal | Ready | Iteration dispatch cannot run if state contract is invalid. |
| system-spec-kit sidecar files | Internal | Ready | Research scope loses its primary evidence base if paths move. |
| cli-devin / cli-opencode executors | External workflow tools | Planned | Executor mix may need workflow-level adjustment; research can still proceed with native fallback if approved later. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scaffold validation fails or arc 010 is no longer needed.
- **Procedure**: Remove the arc 010 parent folder and delete the 016 parent map/graph references added in this dispatch before research begins.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Research Iterations -> Synthesis -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Research iterations |
| Research iterations | Setup | Synthesis |
| Synthesis | Research iterations | Validation |
| Validation | Synthesis | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scaffold dispatch |
| Research iterations | High | 20 iterations at up to 25 minutes each |
| Synthesis | Medium | One consolidation pass |
| Verification | Low | Strict validators and state checks |
| **Total** | | **Up to 600 minutes by config** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime deployment occurs in this research-only packet.
- [x] Git mutation is forbidden by dispatch.
- [x] Implementation fixes are deferred to a follow-on packet.

### Rollback Procedure
1. Delete the arc 010 parent folder if research has not started.
2. Remove the arc 010 row from the 016 parent spec.
3. Remove the arc 010 child id from the 016 graph metadata.
4. Re-run strict validation for the 016 parent.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove scaffold docs only before research execution begins.
<!-- /ANCHOR:enhanced-rollback -->
