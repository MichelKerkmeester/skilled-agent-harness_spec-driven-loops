---
title: "Feature Specification: design model-benchmark mode selector"
description: "Design the model-benchmark mode selector, pluggable seams, architecture decisions, and build plan for deep-agent-improvement."
trigger_phrases:
  - "deep-agent-improvement benchmark mode"
  - "model-benchmark mode design"
  - "prompt-framework benchmark skill"
  - "mode selector deep-agent-improvement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/001-design-model-benchmark-mode-selector"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Relocated design into phase child 001"
    next_safe_action: "Review design; 002 deep-research deepens it before any build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/121-deep-agent-improvement-benchmark-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: design model-benchmark mode selector

<!-- SPECKIT_LEVEL: 3 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

The 120/003 packet built a working model/prompt-framework benchmark rig (run a model against fixtures under different prompt variants, score, hill-climb to a winner) but it lives packet-local and one-off. `deep-agent-improvement` already runs the same shape of loop (generate candidate, score, converge, promote) for agent definitions. This design adds a **mode selector** to deep-agent-improvement so it can run BOTH `agent-improvement` (today) and a new `model-benchmark` mode (port of the 120/003 rig), reusing ~90% of the shared loop/state/convergence/mutation plumbing and plugging in mode-specific candidate-source, dispatcher, and scorer.

**Key Decisions**: mode selector (not a separate skill); deep-agent-improvement is the home (not deep-loop-runtime, which is a read-only library); pluggable seams keep the two modes' scorers/promotion separate.

**Critical Dependencies**: the 120/003 rig (`eval-rig` + `eval-loop/scripts`) as the portable source; deep-agent-improvement's existing generic scripts (`mutation-coverage.cjs`, `reduce-state.cjs`, `converge.cjs`, `materialize-benchmark-fixtures.cjs`, `improvement-journal.cjs`).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 19 |
| **Predecessor** | `skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark` (the rig this generalizes) |
| **Successor** | `002-research-model-benchmark-implementation` (deepens this design) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We now have two near-identical evaluation loops: `deep-agent-improvement` (mutate + score an agent definition, promote the best) and the 120/003 benchmark rig (run a model against fixtures under prompt-framework variants, score, pick the best). The benchmark rig is packet-local and not reusable, so every future "find the best framework/config for model X" effort would re-port it by hand. There is no first-class, repeatable way to benchmark a model/prompt across the toolchain.

### Purpose
deep-agent-improvement can run a `model-benchmark` mode (real model dispatch + fixture scoring + hill-climbing to a winning prompt/config) alongside its existing `agent-improvement` mode, so model/prompt benchmarking is a standard, repeatable capability rather than a one-off rig.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (this packet = DESIGN ONLY)
- A complete design + decision-record for the mode selector and the three pluggable seams (candidate source, dispatcher, scorer)
- A reuse map (which 120/003 + deep-agent-improvement scripts port as-is vs need generalizing) and a build sequence + effort estimate in plan.md/tasks.md

### Out of Scope
- Implementation (the actual refactor + new scripts) - a follow-on build packet executes plan.md; ~3-4k LOC, multi-week
- Moving/deleting the 120/003 rig - it stays as the reference source the build ports from
- A separate new skill - the capability lands inside deep-agent-improvement, not a new skill or deep-loop-runtime (which is a read-only library)

### Files to Change (when BUILT — for the follow-on packet, not this one)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | Document the `mode` selector + the model-benchmark mode |
| `.opencode/skills/deep-agent-improvement/assets/improvement_config.json` | Modify | Add `mode` + `modelBenchmarkConfig` keys |
| `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs` | Create | Generalized model dispatcher (from 120/003 `dispatch-minimax.cjs`; executor+model+args) |
| `.opencode/skills/deep-agent-improvement/scripts/score-variant.cjs` + `eval-rig/` | Create | Port the 120/003 task-output rubric + deterministic checks + grader |
| `.opencode/skills/deep-agent-improvement/scripts/{loop,mutate,converge,reduce-state,mutation-coverage}.cjs` | Modify | Add mode dispatch; reuse generic logic |
| `.opencode/commands/deep/start-agent-improvement-loop.md` + assets | Modify | Add `--mode=model-benchmark` flags |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Design defines a `mode` selector with both modes' end-to-end flow | decision-record ADR names the seams + which scripts each mode uses |
| REQ-002 | Design defines the 3 pluggable seams (candidate source / dispatcher / scorer) | Each seam has an interface contract + the agent-mode and model-benchmark-mode implementations identified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Reuse map distinguishes port-as-is vs generalize vs keep-separate | plan.md table maps every 120/003 + deep-agent-improvement script to its disposition |
| REQ-004 | Backward compatibility for existing agent-improvement runs | design states the `mode` default = `agent-improvement`; no behavior change when unset |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can read spec.md + decision-record.md and understand exactly what the build packet will create/modify, the seams, and the reuse/refactor split — without re-deriving it from the 120/003 rig.
- **SC-002**: The build estimate (effort + LOC + risk) is explicit so the follow-on can be scheduled as its own effort.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 120/003 rig as port source | Med | Rig is shipped + validated; design references it, doesn't move it |
| Risk | Over-generalizing a focused skill (wrong abstraction) | Med | Keep scorers/promotion mode-separate; share only the proven-generic plumbing; mode default preserves current behavior |
| Risk | Scope creep into a multi-week build during design | Med | This packet is design-only by contract; build is a separate packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Model-benchmark runs are bounded by a dispatch budget cap (like 120/003's ~60 calls); the loop is resumable (append-only state) so it survives interruption.

### Security
- **NFR-S01**: Model dispatch uses the executor's configured auth (e.g. opencode credentials); no API keys are written into spec docs or state.

### Reliability
- **NFR-R01**: Rate-limit backoff + pause/resume (ported from the rig's dispatch wrapper) so a 429 or session restart does not lose progress.

---

## 8. EDGE CASES

### Data Boundaries
- Mode unset: defaults to `agent-improvement` (existing behavior unchanged).
- Fixture toolchain missing (e.g. no node_modules): that fixture scores uniformly across variants, documented as a caveat (as in 120/003), ranking stays valid.

### Error Scenarios
- Model dispatch fails / rate-limited: backoff then pause sentinel; resume continues.
- Grader unreachable: fall back to deterministic-only scoring (drops the semantic dimension, ranking still computed).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Build touches ~8 deep-agent-improvement scripts + new dispatcher/scorer; ~3-4k LOC |
| Risk | 16/25 | No auth/breaking changes to existing mode; main risk is abstraction design |
| Research | 6/20 | Already done (3 Explore agents); seams identified |
| Multi-Agent | 4/15 | Single workstream |
| Coordination | 8/15 | Depends on 120/003 rig + deep-agent-improvement internals |
| **Total** | **52/100** | **Level 3 (the BUILD; this design packet itself is lighter)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Mode abstraction leaks; the two modes' code paths entangle | M | M | Tight seam interfaces; seam tests; keep scorers/promotion fully separate |
| R-002 | Build balloons past estimate | M | M | Phase the build; port-as-is first, generalize incrementally; the 90%-generic infra de-risks it |
| R-003 | Existing agent-improvement runs regress | H | L | `mode` defaults to agent-improvement; regression-test the existing path before merge |

---

## 11. USER STORIES

### US-001: Benchmark a model's best prompt framework (Priority: P0)

**As a** skill maintainer, **I want** to run `/deep:start-agent-improvement-loop --mode=model-benchmark --executor=cli-opencode --model=minimax/MiniMax-M2.7`, **so that** I get a ranked prompt-framework result + winner without hand-porting a rig each time.

**Acceptance Criteria**:
1. Given a model + variant set + fixtures, When I run the model-benchmark mode, Then it dispatches the model, scores outputs, hill-climbs, and writes a synthesis naming the winner.

---

### US-002: Existing agent-improvement runs are unaffected (Priority: P1)

**As a** maintainer relying on the current agent-improvement loop, **I want** the default behavior unchanged, **so that** adding the new mode is non-breaking.

**Acceptance Criteria**:
1. Given no `--mode` flag, When I run the loop, Then it behaves exactly as `agent-improvement` does today.

---

## 12. OPEN QUESTIONS

- Should the model-benchmark mode also gain a "promotion" step (auto-apply the winning framework to the executor's prompt card), or stay synthesis-only (operator integrates manually, as 120/003 did)?
- Should the ported eval-rig live inside deep-agent-improvement, or become a shared component under deep-loop-runtime that both the rig and the skill import? (Research leaned: keep it in the skill; revisit if a third consumer appears.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
