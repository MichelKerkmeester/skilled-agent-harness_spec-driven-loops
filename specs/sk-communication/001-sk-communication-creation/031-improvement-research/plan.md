---
title: "Implementation Plan: Phase 031 Communication Projection Improvement Research"
description: "Completed five-iteration deep-research method for ranking improvements to communication projection operator UX, documentation, package architecture, and skill guidance."
trigger_phrases:
  - "communication projection improvement research"
  - "research plan"
  - "deep-research communication improvements"
  - "sk-communication assessment"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/031-improvement-research"
    last_updated_at: "2026-08-15T08:26:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed the accurate Phase-030-grounded improvement research"
    next_safe_action: "Open a build phase for the P1 dist/packaging and UX quick wins"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-031-improvement-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The loop produced 33 findings after 5 recorded iterations."
      - "The canonical run used the shipped Phase 030 tree and corrected the earlier loader-absent and no-op claims."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 031 Communication Projection Improvement Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research-only assessment of TypeScript, JavaScript, Markdown, and skill assets |
| **Framework** | `/deep:research` with 5 iterations and convergence threshold 0.05 |
| **Grounding** | `src/config/local-provider.ts`, OpenCode plugin, `bin/cli-output-wrapper.mjs`, package `docs/`, and `sk-communication` assets |
| **Storage** | `research/research.md` in this packet, produced later by the loop |
| **Testing** | Iteration validity, evidence traceability, axis coverage, and strict packet validation |

### Overview

The research ran exactly 5 recorded iterations through one `cli-opencode` executor using `opencode-go/deepseek-v4-flash`. It stopped at `maxIterationsReached` and produced 33 findings. The run inspected the shipped Phase 030 tree in this worktree and corrected the earlier loader-absent and entry-point no-op claims. This phase changed no shipped runtime or documentation surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The four research axes and grounding surfaces are fixed. [evidence: `spec.md` sections 2 and 3]
- [x] The 5-iteration method, executor, model, threshold, and stop rule are recorded. [evidence: this plan and `research/deep-research-state.jsonl`]
- [x] The research-only boundary and loop-owned deliverables are explicit. [evidence: `spec.md` section 3]

### Definition of Done

- [x] All 5 iterations completed under the fixed executor and model. [evidence: `research/deep-research-state.jsonl`]
- [x] `research/research.md` contains a ranked cross-axis recommendation list with rationale and rough effort. [evidence: loop synthesis]
- [x] Strict packet validation passes with zero errors and warnings. [evidence: final `validate.sh --strict` output]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A single-executor research loop performs 5 passes over the shipped implementation, package docs, and skill assets. The loop preserves evidence per iteration and synthesizes one ranked recommendation set after iteration 5.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Deep-research loop | Run 5 iterations, preserve state, and author `research/research.md` |
| Executor | Use `cli-opencode` for every iteration |
| Model | Use `opencode-go/deepseek-v4-flash` for every iteration |
| Grounding surface | Supply current evidence from runtime, docs, and skill files |
| Ranked recommendation | Order improvements across all four axes with rationale and rough effort |

### Data Flow

Shipped runtime, docs, and skill assets -> 5 deep-research iterations -> evidence-backed synthesis -> `research/research.md` -> later build-phase selection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/config/local-provider.ts` | Loads Phase 030 local-provider configuration | Research input only | Recommendations cite observed loader behavior |
| OpenCode plugin | Native communication projection entry point | Research input only | Operator and wiring findings cite current activation behavior |
| `bin/cli-output-wrapper.mjs` | Wrapper entry point | Research input only | Recommendations account for both entry points |
| Provider, transport, and judge modules | Package architecture seams | Research input only | Architecture recommendations identify current ownership boundaries |
| Package `docs/` | Operator and developer guidance | Research input only | Documentation findings cite current files and gaps |
| `sk-communication` assets | Skill routing, logic, and user guidance | Research input only | Skill recommendations cover `SKILL.md`, references, and feature catalog |
| Phase and packet docs | Record planned state | Create Phase 031 | Strict validation and generated metadata |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm the Phase-030-tree grounding inventory across runtime, docs, and skill assets. [evidence: iteration 1 notes and `research/research.md`]
- [x] Fix the four-axis evaluation frame and ranking criteria. [evidence: `spec.md` requirements]
- [x] Initialize the 5-iteration loop with convergence threshold 0.05. [evidence: `research/deep-research-state.jsonl`]

### Phase 2: Implementation

- [x] Run iterations 1 through 3 on Phase 030 architecture, operator UX, documentation, and skill assets. [evidence: `research/iterations/iteration-001.md` through `iteration-003.md`]
- [x] Run iterations 4 and 5 on advisor evidence, fresh-checkout checks, packaging, and cross-axis ranking. [evidence: `research/iterations/iteration-004.md` and `iteration-005.md`]

### Phase 3: Verification

- [x] Confirm that exactly 5 valid iterations completed with the fixed executor and model. [evidence: `research/deep-research-state.jsonl`]
- [x] Validate Phase 030 grounding, axis coverage, rationale, ranking, and rough effort. [evidence: `checklist.md` and `implementation-summary.md`]
- [x] Run strict packet validation after the loop writes `research/research.md`. [evidence: final validation output]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Iteration validity | Every deep-research iteration passes canonical loop checks | `/deep:research` loop mechanics |
| Method proof | Exactly 5 iterations, threshold 0.05, one executor, one model | Externalized loop state |
| Grounding audit | Every recommendation resolves to a current shipped surface | Direct source references in `research/research.md` |
| Coverage audit | Operator UX, docs, architecture, and skill each receive explicit findings | `checklist.md` |
| Packet integrity | Phase 031 metadata, navigation, links, and required docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` | Executor | Complete | The fixed loop recorded all 5 iterations |
| `opencode-go/deepseek-v4-flash` | Model | Complete | Every iteration used the specified model |
| Shipped communication package | Grounding | Available | Recommendations cannot be tied to current behavior |
| Package docs and skill assets | Grounding | Available | Documentation and skill axes cannot be assessed |
| `/deep:research` mechanics | Tooling | Available | The loop cannot preserve state or author the deliverable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The executor or model is unavailable, an iteration fails validation, or research begins changing shipped files.
- **Procedure**: stop the loop, preserve the last valid externalized state, remove only invalid loop output, and resume from the failed iteration under the same method. No runtime rollback is needed because this phase changes no shipped runtime.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup and grounding -> 5 research iterations -> Ranked synthesis and validation
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Setup and grounding | Current shipped files and fixed method | Deep-research loop |
| Deep-research loop | Available executor, model, and externalized state | Recommendation synthesis |
| Recommendation synthesis and validation | All 5 valid iterations | Later build-phase selection |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and grounding | Low | 0.5 day |
| Deep-research loop with 5 iterations | Medium | 1 day |
| Recommendation synthesis and validation | Low | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the loader, plugin, wrapper, docs, and skill paths seen in the Phase 030 tree. [evidence: `research/iterations/iteration-001.md`]
- [x] Confirm that no shipped runtime or documentation change belongs to this phase. [evidence: `spec.md` Out of Scope]
- [x] Record the executor, model, iteration count, and convergence policy. [evidence: this plan and `research/deep-research-state.jsonl`]

### Procedure

1. Record the failed iteration and reason in loop state.
2. Preserve all earlier valid iterations.
3. Remove only invalid output from the failed iteration.
4. Resume with the same executor, model, and no-early-convergence policy.
5. Rerun strict validation after the final synthesis.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: restore packet-local research state only. No runtime or user data changes in this phase.
<!-- /ANCHOR:enhanced-rollback -->
