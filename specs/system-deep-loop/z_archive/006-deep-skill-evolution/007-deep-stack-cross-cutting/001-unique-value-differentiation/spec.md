---
title: "Feature Specification: Deep Skills Unique-Value Differentiation Analysis"
description: "Audit deep-review vs deep-research vs (assumed-upgraded) deep-ai-council for overlap, sharpen boundaries, ensure each has a single-best-fit use case. Drive recommendations via 10-iter deep-research."
trigger_phrases:
  - "deep skills differentiation"
  - "deep-review vs deep-research"
  - "deep-ai-council boundary"
  - "deep skill overlap"
  - "unique value analysis"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/007-deep-stack-cross-cutting/001-unique-value-differentiation"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold Level 3 deep-research target packet"
    next_safe_action: "Dispatch /deep:start-research-loop iter-001 (cli-devin SWE-1.6) on this folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-ai-council/SKILL.md"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the overlap currently a problem or a feature?"
      - "Should commands be merged, kept separate with sharper guards, or unified under one deep-* runtime?"
      - "Where do mixed targets (e.g. 'review-then-research') get routed?"
    answered_questions: []
---

# Feature Specification: Deep Skills Unique-Value Differentiation Analysis

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Three "deep" skills now exist or are proposed: `/deep:start-review-loop`, `/deep:start-research-loop`, and (after packet 129) `/deep:ask-ai-council`. They share the deep-loop-runtime substrate (iteration loop, JSONL state, saturation-based convergence, findings accumulation) but ostensibly target different intents. This packet runs a structured 10-iteration deep-research audit to determine whether each skill has a defensible single-best-fit use case, whether overlap helps or hurts operators, and whether routing/naming sharpens or muddies the boundary.

**Key Decisions**: differentiation strategy (keep distinct / merge / unify-with-mode), routing rules between the three, naming hygiene.

**Critical Dependencies**: packet 129 (proposed deep-ai-council upgrade); existing deep-review / deep-research command surfaces; deep-loop-runtime contract stability.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
deep-review, deep-research, and the proposed deep-ai-council all rest on deep-loop-runtime and share iteration + saturation semantics. As a result the boundaries between them are easy to blur in practice — operators reach for whichever they remember first, and that can mean using deep-research where deep-review's adversarial review depth would have been higher-yield, or running a council deliberation where a single deep-research synthesis was sufficient. Today there's no formal differentiation contract, no routing rule, and no test that proves each skill produces value its siblings cannot.

### Purpose
Run a structured deep-research audit that (a) characterizes each skill's defensible single-best-fit use case, (b) inventories overlap with concrete fixture scenarios, (c) recommends sharpened boundaries (or a merge / unify-mode reorg if warranted), and (d) emits a routing rule the skill-advisor can enforce.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Characterize each skill's input/output/state/convergence contract from current SKILL.md + command YAML.
- Inventory at least 6 concrete fixture prompts where the right routing is non-obvious; map each to the skill that should win.
- Identify overlap surfaces: trigger phrases, output artifacts, expected operator action.
- Recommend differentiation strategy: keep-distinct, merge, unify-with-mode-suffix, or hybrid.
- Recommend skill-advisor routing rules (lexical + structural) to enforce the chosen strategy.
- Identify load-bearing tests + parity invariants needed to keep boundaries from drifting.

### Out of Scope
- Implementing the chosen differentiation strategy (deferred to a follow-on packet).
- Refactoring deep-loop-runtime itself.
- Changing existing command surfaces beyond recommendations.
- Modifying packet 129 deep-ai-council architecture (which assumes deep-council exists for the duration of this analysis).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/` | Create | deep-research iteration outputs |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md` | Create | synthesized recommendations |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/decision-record.md` | Create | ADRs from synthesis |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/implementation-summary.md` | Create | completion record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research convergence on differentiation question across 10 iterations | `research/deep-research-state.jsonl` shows convergence signal OR iter-010 reached; `research.md` ≥ 3 ADR-shaped recommendations |
| REQ-002 | Concrete routing rule output | `decision-record.md` records routing rule with at least 3 fixture prompts + expected skill |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Overlap inventory | `research.md` §"Overlap Surfaces" lists at least 6 overlap points with severity |
| REQ-004 | Parity-test recommendations | `decision-record.md` names at least 2 parity-test invariants to ship in a follow-on packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 deep-research iterations complete (or convergence < 10) with cli-devin SWE-1.6 as the dispatch executor.
- **SC-002**: A single explicit differentiation verdict (keep-distinct / merge / unify-with-mode / hybrid) recorded in `decision-record.md`.
- **SC-003**: At least 6 fixture prompts annotated with the correct deep-* skill.
- **SC-004**: Strict validate exit 0 on this packet AND its `research/` subfolder pattern.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | packet 129 deep-ai-council architecture undefined when this packet runs | Med | Reason about the upgraded deep-council via its 129/001 research scaffold; treat anything indeterminate as an open question |
| Risk | Deep-research iterations diverge across dimensions instead of converging | Med | Saturation threshold 0.2; if iter-10 still novel, mark as "needs follow-on packet" rather than forcing a verdict |
| Risk | SWE-1.6 RCAF discipline drift — small-model dispatches degrade after long context | Med | Per-iter inline prompt; if a single iter fails empty-output, fall back to cli-opencode deepseek-v4-pro per memory `reference_small_model_dispatch_matrix` |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: each deep-research iter ≤ 25 min wall via cli-devin SWE-1.6 (per memory: cli-devin SWE-1.6 typical iter is 10-15 min on small-medium prompts).

### Reliability
- **NFR-R01**: ONE iter at a time, explicit kill between (per memory `feedback_deep_loop_iter_one_at_a_time.md`).

---

## 8. EDGE CASES

### Data Boundaries
- All 3 skills converge on a single best practice → verdict still distinguishes WHEN to invoke which.
- Two skills overlap completely → recommend merge.

### Error Scenarios
- cli-devin SWE-1.6 empty output → retry with cli-opencode deepseek-v4-pro variant=high.
- Iteration produces zero new findings 2x in a row → declare convergence and synthesize.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 3 skill surfaces, 1 runtime, command YAMLs, advisor rules |
| Risk | 14/25 | Boundary-drift risk, but no code mutation |
| Research | 18/20 | 10-iter deep-research target |
| Multi-Agent | 8/15 | Single-agent dispatch per iter |
| Coordination | 6/15 | Parent agent orchestrates sequential iters |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | SWE-1.6 hallucinated trigger phrases in skill comparison | M | M | Each iter must cite SKILL.md file:line |
| R-002 | 10 iters insufficient for differentiation across 3 surfaces | M | L | Saturation-based exit before iter-10 when novelty < 0.2 |
| R-003 | Routing recommendation conflicts with advisor's existing edges | L | M | Synthesis includes advisor-rule patch as a follow-on packet, not in this one |

---

## 11. USER STORIES

### US-001: Operator routing clarity (Priority: P0)

**As a** spec-kit operator, **I want** a clear rule for which deep-* skill to invoke for a given task shape, **so that** I stop guessing and stop double-dispatching wrong skills.

**Acceptance Criteria**:
1. Given a fixture prompt, When the routing rule is applied, Then a single skill wins with ≥ 0.8 confidence.

---

### US-002: Skill-advisor enforcement (Priority: P1)

**As a** skill-advisor maintainer, **I want** lexical + structural rules I can encode in `advisor_recommend`, **so that** advisor confidence converges on the correct deep-* skill automatically.

**Acceptance Criteria**:
1. Given the decision-record routing rule, When advisor is rebuilt, Then the 6 fixture prompts each match the documented correct skill with confidence ≥ 0.8.

---

## 12. OPEN QUESTIONS

- Is "deep" the right shared prefix, or do we need a clearer family name?
- Should one of the three subsume the other two as modes (e.g. `/speckit:deep :review`, `:research`, `:council`)?
- What's the parity-test contract that guarantees boundaries stay sharp post-merge or post-rename?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sibling**: `../001-ai-council/` (upgrades sk-ai-council into deep-council, which this packet analyzes for differentiation)
