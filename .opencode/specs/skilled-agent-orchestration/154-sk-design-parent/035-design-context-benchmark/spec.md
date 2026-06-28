---
title: "Feature Specification: deep review + empirical benchmark of the context-loading contract"
description: "Level-1 evaluation phase: a 10-iteration gpt-5.5 deep review of the 029/030 context-loading contract work, plus an empirical A/B benchmark using Kimi K2.7 and MiniMax M3 as test subjects (baseline vs contract) to measure whether the contract actually closes the four observed design misses. Observation only; no edits to 029/030 or the live skills."
trigger_phrases:
  - "context loading contract benchmark"
  - "design contract deep review benchmark"
  - "kimi minimax contract A/B"
  - "does the context contract work"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/035-design-context-benchmark"
    last_updated_at: "2026-06-27T16:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran 10-iter deep review + 4-run A/B benchmark; contract works (+5/+6 lift)"
    next_safe_action: "Optional: deterministic contrast script + executable orchestrator gate + P1 fixes"
    blockers: []
    key_files:
      - "spec.md"
      - "benchmark-matrix.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "eval-154-035-design-context-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The contract measurably works: handing a delegated small model the contract flips 0/6 to 5-6/6 on the proof-field rubric, consistent across two models"
      - "The weakest link is weak-model contrast arithmetic (kimi mislabeled failing pairs), arguing for a deterministic contrast script (research §17)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep review + empirical benchmark of the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase independently stress-tests the 029 research and the 030 context-loading contract build via two parallel tracks: a 10-iteration GPT-5.5 deep review, and an empirical A/B benchmark using Kimi K2.7 and MiniMax M3 as test subjects (each builds the same card with and without the contract). The question: does the contract actually close the four observed design misses? It does — the benchmark shows a +5 to +6 lift on the proof-field rubric, consistent across two models; the review confirms the structure is sound but flags that enforcement is advisory.

**Key Decisions**: observation-only (no edits to 029/030 or the live skills); the benchmark scores a fixed 6-criterion rubric per model×condition.

**Critical Dependencies**: the 029/030 deliverables (review target), the live `sk-design`/`cli-opencode`/`sk-prompt-models` contract, and the Kimi/MiniMax transports.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../030-design-context-adoption/spec.md |
| **Type** | Evaluation (deep review + benchmark; no production edits) |
| **Handoff Criteria** | `review/review-report.md` (10 iters), `benchmark-matrix.md` (2 models × 2 conditions × rubric), and a combined verdict exist; no 029/030 or live-skill file changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 030 build wired an enforceable context-loading contract into the live skills and self-verified clean, but self-verification is not proof the contract changes real behavior or that the implementation survives an adversarial review. We needed independent evidence on two axes: is the work correct (review), and does the contract empirically prevent the four misses when a small model actually builds something (benchmark)?

### Purpose
Run a 10-iteration deep review of the work AND an A/B benchmark (Kimi K2.7 + MiniMax M3, baseline vs contract) to produce a defensible verdict and a prioritized fix list.

> **Phase note:** evaluation only; it observes the 029/030 deliverables and the live skills, and writes only its own artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 10-iteration GPT-5.5 deep review over 029 + 030 + the 18 contract files → `review/review-report.md`.
- A 4-run A/B benchmark (2 models × {baseline, contract}) → `runs/**` + `benchmark-matrix.md`.
- A combined verdict (review + benchmark) + prioritized fixes.

### Out of Scope
- Any edit to the 029/030 deliverables or the live `.opencode/skills/**` files. Observation only.
- Applying the review's recommended fixes (queued for a follow-up).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/**` | Created | 10-iteration deep-review artifacts + report |
| `runs/{minimax,kimi}-{A,B}/**` | Created | A/B benchmark outputs (card.html + notes.md + run.json) |
| `benchmark-matrix.md` | Created | Scored rubric matrix + verdict |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Spec-folder wrapper + combined verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A 10-iteration deep review runs and reports | `review/review-report.md` exists with a verdict + findings by severity |
| REQ-002 | A 4-run A/B benchmark runs and is scored | All 4 runs produce artifacts; `benchmark-matrix.md` scores the rubric + lift |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings are evidence-grounded | Review cites file:line; benchmark cites the run artifacts + independently-checked contrast values |
| REQ-004 | Both models used as subjects | Kimi K2.7 + MiniMax M3 each run baseline + contract; substitutions flagged (none needed) |
| REQ-005 | Observation only | No 029/030 or live-skill file changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep review converges (10 iters) with a severity-ranked findings table and a four-misses verdict; the benchmark produces a scored 2×2×rubric matrix with per-model lift.
- **SC-002**: A combined verdict states whether the contract measurably works and the prioritized follow-ups, with no production edits made in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Benchmark scoring bias | Inflated/deflated lift | Fixed presence-based rubric + independently-recomputed contrast values |
| Risk | Small n (1/cell) | Not statistically robust | Direction is unambiguous (0→5-6/6); caveat stated |
| Risk | Benchmark model strays outside run dir | Scope leak | Verified post-run: models wrote only to their run dir |
| Dependency | 029/030 deliverables + live contract | Nothing to evaluate | Present and validated |
| Dependency | Kimi/MiniMax transports | Benchmark cannot run | Both smoke-tested live |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Evaluation complete. The benchmark answers the core question (the contract works for delegated dispatch). Two follow-ups remain, both now evidence-backed: a deterministic contrast script (kimi mislabeled failing pairs) and an executable/self-check gate for the orchestrator path (review F-004). Plus the review's small P1/P2 fixes (F-003 bare paths, F-005 unsafe CO-037 command, F-006 template placement/inventory).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Deep-review report**: `review/review-report.md`
- **Benchmark matrix**: `benchmark-matrix.md`
- **Evaluated work**: `../029-design-context-loading/`, `../030-design-context-adoption/`
