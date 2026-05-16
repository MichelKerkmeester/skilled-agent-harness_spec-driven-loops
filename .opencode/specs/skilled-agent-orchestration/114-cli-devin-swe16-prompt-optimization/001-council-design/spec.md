---
title: "Feature Specification: Council Design for cli-devin SWE 1.6 Optimization"
description: "Three-seat deep-ai-council deliberation that ratifies the rubric, fixture catalog, knob set, and loop shape for the downstream eval rig + eval loop. Decides bespoke-vs-existing flow question, picks grader model, sets budget envelope."
trigger_phrases:
  - "114/001 council design"
  - "cli-devin council deliberation"
  - "swe 1.6 rubric design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/001-council-design"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded council-design spec"
    next_safe_action: "Dispatch deep-ai-council with 3 seats × 3 questions"
    blockers: []
    key_files:
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114001"
      session_id: "114-001-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Grader model: claude-sonnet vs codex-gpt-5.5 vs dual-grader"
      - "Fixture count: 5 / 7 / 10"
      - "Rubric weights: adopt proposal or revise"
    answered_questions:
      - "Council location: ai-council/** scope-write per deep-ai-council invariant"
      - "Seat count: 3 (pragmatist, skeptic, optimizer)"
      - "Convergence rule: two-of-three agreement"
---
# Feature Specification: Council Design for cli-devin SWE 1.6 Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Convene a 3-seat deep-ai-council with distinct lenses (pragmatist via cli-codex, skeptic via cli-claude-code, optimizer via cli-gemini) to ratify the design framing for the downstream eval rig (002) and eval loop (003). Council deliberates over a pre-seeded rubric proposal, knob set, and fixture catalog; runs adversarial cross-seat critique; converges via two-of-three rule; persists artifacts to `ai-council/**`. Output is `council-report.md` — the binding design contract for 002 + 003.

**Key Decisions**: Bespoke loop vs retargeted existing flow, 5-dim rubric weights, fixture grounding (real failure modes from memory vs synthetic)

**Critical Dependencies**: cli-codex, cli-claude-code, cli-gemini executors available; deep-ai-council skill operational

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The bespoke deep-loop in 003 needs a binding rubric, fixture catalog, knob set, and convergence rule before any code is written. Choosing these unilaterally would skip the adversarial-critique value that prevents single-perspective blind spots (e.g., a rubric that scores plausibility instead of correctness, fixtures that don't trigger real failure modes). Memory confirms documented SWE 1.6 failure modes exist (feedback_cli_devin_bundle_verification, feedback_bundle_gate_smoke_run) — these need to anchor the fixture set, not generic synthetic tasks.

### Purpose
Produce a council-ratified design contract that 002 and 003 consume verbatim. After this phase, no further design debate — only execution against the contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convene 3 seats (pragmatist / skeptic / optimizer) via real executors (cli-codex, cli-claude-code, cli-gemini)
- Each seat answers Q1 (deep-flow fit), Q2 (rubric + weights + scoring method), Q3 (fixture catalog)
- Adversarial cross-seat critique round
- Two-of-three convergence rule
- Persist artifacts to `ai-council/**` (council-report.md, seat-proposals/, critique.md, ai-council-state.jsonl)
- Decide grader model (claude-sonnet vs codex-gpt-5.5 vs dual)
- Decide fixture count (5 / 7 / 10)
- Decide budget envelope (max dispatches in 003, free-tier rate-limit policy)

### Out of Scope
- Implementing the rig (002 owns) or running iterations (003 owns)
- Writing any code outside `ai-council/**`
- Modifying cli-devin skill (004 owns, after 003 synthesis)
- Council seat selection across more than 3 (depth-1 dispatch only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-council-design/ai-council/council-report.md` | Create | Final binding design contract |
| `001-council-design/ai-council/seat-proposals/*.md` | Create | One proposal per seat |
| `001-council-design/ai-council/critique.md` | Create | Cross-seat adversarial critique |
| `001-council-design/ai-council/ai-council-state.jsonl` | Create | Append-only deliberation state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 3 seats convene with distinct reasoning lenses | `ai-council/seat-proposals/` contains 3 files (pragmatist.md, skeptic.md, optimizer.md), each authored by a different real executor |
| REQ-002 | Each seat answers all 3 questions (Q1 flow, Q2 rubric, Q3 fixtures) | Every proposal has § Q1, § Q2, § Q3 sections filled with reasoned content + evidence citations |
| REQ-003 | Adversarial cross-seat critique runs and surfaces ≥1 substantive disagreement | `critique.md` quotes ≥1 cross-seat contradiction and how it was resolved (or escalated) |
| REQ-004 | Two-of-three convergence achieved on each decision OR explicit escalation to operator | `council-report.md` § Convergence shows 2-of-3 vote tally per decision, or `escalated_decisions[]` list |
| REQ-005 | Output stays within `ai-council/**` scope-write | `git status` after council run shows no files modified outside `001-council-design/ai-council/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Council-ratified rubric specifies 5 dimensions, weights summing to 1.00, deterministic-vs-grader-method per dim | `council-report.md` § Rubric matches schema |
| REQ-007 | Fixture catalog has 5–10 tasks, each grounded in a documented failure mode or sourced from cli-devin manual playbook | `council-report.md` § Fixtures lists ≥ 5 entries with `grounded_in` citation per entry |
| REQ-008 | Budget envelope set: maxDispatches, maxIterations, free-tier rate-limit policy | `council-report.md` § Budget filled with concrete numbers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Council convenes, deliberates, converges on all decisions, persists artifacts — single end-to-end run
- **SC-002**: 002-eval-rig and 003-eval-loop can read `council-report.md` and act without further clarification
- **SC-003**: At least 1 substantive disagreement surfaced and resolved (not a rubber-stamp deliberation)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex, cli-claude-code, cli-gemini executors available + authenticated | Cannot run real-executor seats | Pre-flight `gh auth status` equivalent per CLI; document fallback to simulated seats with explicit downgrade note |
| Risk | Seats converge too easily (rubber-stamp) | Loses adversarial value | Explicit skeptic seat MUST find ≥ 1 disagreement; if none, re-prompt with stronger adversarial framing |
| Risk | Free-tier rate limits hit during seat dispatches | Council delayed | Sequential seat dispatch, not parallel; backoff on 429 |
| Risk | Council drifts from packet scope (debates 002/003 implementation details) | Output bloated, less actionable | Tight contract prompt: 3 questions only, ai-council/** scope-write only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: End-to-end council run completes in < 30 min wall-clock (sequential 3 seats × ~5 min each + critique + convergence)

### Security
- **NFR-S01**: Council writes stay within `ai-council/**`; no shell escape, no external HTTP outside CLI executor sandboxes

### Reliability
- **NFR-R01**: State JSONL append-only; partial seat failure recoverable by re-running just the failed seat

---

## 8. EDGE CASES

### Data Boundaries
- Empty seat output: re-dispatch seat once; if still empty, escalate
- Disagreement on all 3 questions: cannot converge; escalate to operator with critique.md

### Error Scenarios
- One seat fails to dispatch (executor unavailable): fallback to simulated seat with explicit downgrade note in council-report.md
- All 3 seats unanimous (no critique value): re-prompt skeptic with stronger adversarial framing

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | 1 spec folder, ~50 LOC of ai-council artifacts, no shared systems |
| Risk | 5/25 | No auth changes, no breaking API, no shipped code |
| Research | 6/20 | Reuse deep-ai-council patterns; minimal investigation |
| Multi-Agent | 10/15 | 3 seats × real executors |
| Coordination | 5/15 | Sequential seat dispatch + critique step |
| **Total** | **34/100** | **Level 3** (multi-agent coordination justifies L3) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | All seats converge unanimously without critique value | M | M | Skeptic prompt requires ≥ 1 disagreement; re-prompt with adversarial framing if none |
| R-002 | Executor rate-limit hit during seat dispatch | L | M | Sequential dispatch + 60s backoff on 429 |
| R-003 | Council scope-creep into rig/loop implementation | M | L | Tight contract: 3 questions, ai-council/** writes only |

---

## 11. USER STORIES

### US-001: Operator runs council (Priority: P0)

**As an** operator running this phase, **I want** to dispatch the council with one command, **so that** I get a binding design contract without managing seat orchestration manually.

**Acceptance Criteria**:
1. Given a clean 001-council-design/ folder, When I run the deep-ai-council skill on this packet, Then 3 seats dispatch sequentially and ai-council/council-report.md exists at the end.
2. Given REQ-005 (scope-write boundary), When the run completes, Then `git status` shows only `ai-council/**` modifications.

### US-002: Downstream packet reads contract (Priority: P0)

**As** 002-eval-rig or 003-eval-loop, **I want** to read `council-report.md` and find every decision I need, **so that** I don't need to re-derive design from this packet's deliberation logs.

**Acceptance Criteria**:
1. Given a completed council run, When 002 starts, Then 002's spec.md can cite `council-report.md` § Rubric / § Fixtures / § Knobs / § Budget without ambiguity.

## 12. OPEN QUESTIONS

- Grader model choice: claude-sonnet-4.6 (cheap, fast) vs codex-gpt-5.5-high (rigorous, costly) vs dual-grader with median + dispute detection? Council recommends; operator can override.
- Fixture count: 5 (faster but less coverage) vs 7 (balanced) vs 10 (best coverage but longer 003 wall-clock)?
- Should we cap iterations at 12 if convergence not reached, or run until convergence with operator-paused breaks?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Downstream consumers**: `../002-eval-rig/spec.md`, `../003-eval-loop/spec.md`
