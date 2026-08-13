---
title: "Feature Specification: graphene-main → Graph-Based Deep-Loop (Repo Study 2)"
description: "Phase child of 037: a 20-iteration deep-research study of the graphene-main Rust event-sourced graph engine (with a belief/truth-maintenance layer), synthesized by GPT-5.6-SOL xhigh and independently verified by DeepSeek V4 Pro, extending the repo-1 graph-based deep-loop design over the 036 authority plane."
trigger_phrases:
  - "graphene-main graph engineering"
  - "graph-based deep loop graphene"
  - "belief truth maintenance deep loop"
  - "graphene repo study"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/002-graphene-main"
    last_updated_at: "2026-08-13T21:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter research; SOL-xhigh synthesis verified by DeepSeek V4 Pro"
    next_safe_action: "Proceed to repo study 3 (graph-arch) or plan a shadow-prototype implementation packet"
    blockers: []
    key_files:
      - "orientation.md"
      - "research/research.md"
      - "research/verification-deepseek-v4-pro.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-graphene-main-sol-high-1786648621541-lzda3r"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Graphene supplies executable contracts (belief projection, ledger fold, causal-prefix parity, claim-fence) that extend repo 1 without replacing the 036 authority plane."
---
# Feature Specification: graphene-main → Graph-Based Deep-Loop (Repo Study 2)

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
| **Created** | 2026-08-13 |
| **Parent** | `system-deep-loop/037-graph-engineering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Repo study 1 (agent-swarms) produced a graph-based deep-loop design but studied a TypeScript product runtime whose weak spots (self-declared loops, best-effort checkpoints, look-alike parity) left the hardest parts under-specified. `graphene-main` is a purpose-built Rust, event-sourced graph engine with a belief/truth-maintenance layer — a much closer model for what we would build. We need a focused study of graphene that advances the repo-1 design rather than repeating it.

### Purpose
Produce a research foundation (`research/research.md`) that extracts executable contracts from graphene for the parts repo 1 left under-specified — truth-maintaining convergence, ledger-to-graph fold, behavioral parity, mutation fencing, truth admission, refusals, and human gates — framed as confirm/refine/extend/contradict against repo 1, and grounded in all 12 blog posts + our runtime + the 036 authority plane.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only study of `context/graphene-main/` (event fold, belief layer, claims/leases, golden tests, refusal, human gates, crates).
- All 12 posts in `context/blog-posts/` as the graph-engineering concept foundation.
- Mapping onto the current `system-deep-loop` runtime and the 036-deep-loop-innovation authority plane.
- A prioritized set of extractable design decisions (P1–P7) that extend the repo-1 design, with explicit when-not-to-use boundaries.

### Out of Scope
- Implementation of any graph-based loop changes (follow-up planning packet).
- Code changes to `system-deep-loop`, 036, or graphene-main (research subjects are read-only).
- The other 037 reference repos (`graph-arch`, `graph-engineering-master`) — separate phase children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `orientation.md` | Create | gpt-5.6-sol orientation seed (summary + repo-1 comparison + 7 angles) |
| `research/research.md` | Create | Canonical synthesis (GPT-5.6-SOL xhigh; DeepSeek V4 Pro verified) |
| `research/verification-deepseek-v4-pro.md` | Create | Independent verification verdict + applied fixes |
| `research/findings-plain-language.md` | Create | Plain-language rec summary |
| `research/lineages/graphene-main-sol-high/iterations/iteration-NNN.md` | Create | Per-iteration evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 deep-research iterations (gpt-5.6-sol high/fast) over graphene-main + the blog corpus | 20 iteration records complete; `stopReason: maxIterationsReached` — SATISFIED |
| REQ-002 | Synthesize with gpt-5.6-sol xhigh and independently verify with DeepSeek V4 Pro | `research.md` authored by SOL xhigh; `verification-deepseek-v4-pro.md` present; flagged fixes applied — SATISFIED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Resolve the 7 orientation angles (P1–P7) with cited evidence, framed vs repo 1 | 7/7 resolved at design-decision level in `research.md` — SATISFIED |
| REQ-004 | Flag graphene's own defects and explicit when-NOT-to-use boundaries | `research.md` §"Graphene's Own Gaps" + §"Explicit When-Not-to-Use Boundaries" — SATISFIED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` compiled from 20 iterations with a convergence report. — MET
- **SC-002**: All 7 angles resolved with cited evidence; synthesis independently verified (PASS-WITH-FIXES, fixes applied). — MET
- **SC-003**: Concrete, staged, evidence-cited design decisions that extend repo 1 and stay aligned with the 036 authority plane. — MET
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | graphene-main is third-party code with its own defects | Medium | Findings distinguish OBSERVED-IN-CODE from INFERRED; a dedicated "Graphene's Own Gaps" section flags what NOT to copy |
| Risk | Design-level output is not implementation proof | Medium | Synthesis names the next evidence class: executable A1–A7 mutants, race tests, shadow traces, measured baselines |
| Note | Run stopped at maxIterationsReached (terminal novelty ~0.46), not convergence | Low | "No open conflicts" is scoped as a bounded-search result, not proof of absence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Residual implementation questions only (exact package/field names, serialization-cost tractability, settlement-termination proof) — these require scoped implementation planning and runtime measurement, not more corpus review.
<!-- /ANCHOR:questions -->

---
