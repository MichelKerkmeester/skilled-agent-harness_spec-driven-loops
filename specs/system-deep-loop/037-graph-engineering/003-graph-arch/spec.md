---
title: "Feature Specification: graph-arch (GraphARC) → Graph-Based Deep-Loop (Repo Study 3)"
description: "Phase child of 037: a 20-iteration deep-research study of the graph-arch (GraphARC) Python governance-wrapper, synthesized by GPT-5.6-SOL xhigh and independently verified by DeepSeek V4 Pro (REWORK fixes applied), extending the studies-1+2 graph-based deep-loop design with governance contracts over the 036 authority plane."
trigger_phrases:
  - "graph-arch grapharc governance"
  - "graph-based deep loop admission policy"
  - "organization policy deep loop"
  - "grapharc repo study"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/003-graph-arch"
    last_updated_at: "2026-08-14T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter research; SOL-xhigh synthesis, DeepSeek REWORK fixes applied"
    next_safe_action: "Proceed to repo study 4 (graph-engineering-master) or plan a shadow-prototype packet"
    blockers: []
    key_files:
      - "orientation.md"
      - "research/research.md"
      - "research/verification-deepseek-v4-pro.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-graph-arch-sol-high-1786656633113-zhqpv7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "GraphARC contributes a governance layer but proves admission is a precondition, not authorization; 036 must independently re-validate."
---
# Feature Specification: graph-arch (GraphARC) → Graph-Based Deep-Loop (Repo Study 3)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Parent** | `system-deep-loop/037-graph-engineering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Studies 1 (agent-swarms) and 2 (graphene-main) produced the graph-based deep-loop design and its executable contracts, but neither deeply studied the GOVERNANCE plane — admission, organization policy, approvals, and audit. `graph-arch` (GraphARC), a Python governance-wrapper over LangGraph, is the reference for exactly that. We need a focused study of GraphARC that advances the design rather than repeating the prior two.

### Purpose
Produce a research foundation (`research/research.md`) that extracts GraphARC's governance contracts — framed as confirm/refine/extend/contradict against studies 1 and 2 — with the central finding that admission is a precondition, not authorization, and grounded in all 12 blog posts + our runtime + the 036 authority plane.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only study of `context/graph-arch/` (admission, policy/approvals/audit, materialization, runtime, replay-to-OTel, staged examples).
- All 12 posts in `context/blog-posts/` as the graph-engineering concept foundation.
- Mapping onto the current `system-deep-loop` runtime and the 036-deep-loop-innovation authority plane.
- Eight prioritized governance angles (R1–R8) that extend the studies-1+2 design, with explicit when-not-to-use boundaries.

### Out of Scope
- Implementation of any graph-based loop changes (follow-up planning packet).
- Code changes to `system-deep-loop`, 036, or graph-arch (research subjects are read-only).
- The remaining 037 reference repo (`graph-engineering-master`) — a separate phase child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `orientation.md` | Create | gpt-5.6-sol orientation seed (summary + studies-1+2 comparison + 8 angles) |
| `research/research.md` | Create | Canonical synthesis (GPT-5.6-SOL xhigh; DeepSeek V4 Pro verified, REWORK fixes applied) |
| `research/verification-deepseek-v4-pro.md` | Create | Independent verification verdict + applied fixes |
| `research/findings-plain-language.md` | Create | Plain-language rec summary |
| `research/lineages/graph-arch-sol-high/iterations/iteration-NNN.md` | Create | Per-iteration evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 deep-research iterations (gpt-5.6-sol high/fast) over graph-arch + the blog corpus | 20 iteration records complete; `stopReason: maxIterationsReached` — SATISFIED |
| REQ-002 | Synthesize with gpt-5.6-sol xhigh and independently verify with DeepSeek V4 Pro | `research.md` authored by SOL xhigh; verification present (REWORK); all flagged fixes applied — SATISFIED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Resolve the 8 governance angles (R1–R8) with cited evidence, framed vs studies 1+2 | 8/8 resolved at design-decision level in `research.md` — SATISFIED |
| REQ-004 | Flag GraphARC's own defects, unexamined assumptions, and explicit when-NOT-to-use boundaries | `research.md` §"GraphARC's Own Gaps" + §"Unexamined Assumptions" + §"When-Not-to-Use" — SATISFIED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` compiled from 20 iterations with a convergence report. — MET
- **SC-002**: All 8 angles resolved with cited evidence; synthesis independently verified (REWORK; all fixes applied). — MET
- **SC-003**: Concrete, staged governance design decisions that extend studies 1+2 and stay aligned with the 036 authority plane. — MET
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | GraphARC is third-party code with its own defects | Medium | Findings distinguish OBSERVED-IN-CODE from INFERRED; a "GraphARC's Own Gaps" section flags what NOT to copy |
| Risk | Design offloads a re-validation list to 036 without auditing 036 has those primitives | Medium | Recorded explicitly in "Unexamined Assumptions"; flagged as the largest untested dependency |
| Note | Run stopped at maxIterationsReached (terminal novelty ~0.60), not convergence | Low | "No open conflicts" scoped as a bounded-search result, not proof of absence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Implementation dependencies only: exact gate/refusal persistence, the mandatory graph evidence-resolver API, authenticated provider-usage normalization, multi-host atomic fencing, and whether 036 exposes the assumed revalidation primitives.
<!-- /ANCHOR:questions -->

---
