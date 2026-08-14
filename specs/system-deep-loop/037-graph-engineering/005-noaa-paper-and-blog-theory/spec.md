---
title: "Feature Specification: NOOA paper + blog theory → the loop/harness layer of system-deep-loop (Repo Study 5)"
description: "Phase child of 037: a 20-iteration loop/harness-layer study of the NVIDIA Object-Oriented Agents (NOOA) paper + the 12 blogs, synthesized by GPT-5.6-SOL xhigh and independently verified by DeepSeek V4 Pro (PASS-WITH-FIXES applied). The loop/harness counterpart to the four graph-layer studies; extracts validated iteration returns, agent-curated memory, model-callable context, and bounded LEAF tactics, all subordinate to 036."
trigger_phrases:
  - "noaa paper loop harness"
  - "validated iteration returns deep loop"
  - "agent curated memory deep loop"
  - "loop harness layer system-deep-loop"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory"
    last_updated_at: "2026-08-14T02:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter loop/harness research; SOL-xhigh synthesis, DeepSeek fixes applied"
    next_safe_action: "Plan a mutant-driven shadow-prototype packet (P7 test corpus first)"
    blockers: []
    key_files:
      - "orientation.md"
      - "research/research.md"
      - "research/verification-deepseek-v4-pro.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-noaa-theory-sol-high-1786680785904-4bkmet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The loop/harness layer (NOOA + blogs) adds validated typed returns, agent-curated memory, and bounded LEAF tactics; all stay subordinate to the 036 authority plane, which currently runs dark."
---
# Feature Specification: NOOA paper + blog theory → the loop/harness layer (Repo Study 5)

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
| **Parent Spec** | [../spec.md](../spec.md) · [../context-index.md](../context-index.md) |
| **Previous Phase** | [../004-graph-engineering-master/](../004-graph-engineering-master/) |
| **Next Phase** | [../006-cross-study-integration/](../006-cross-study-integration/) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Studies 1–4 covered the GRAPH layer (orchestration, event-sourcing/belief, governance, knowledge doctrine). The LOOP/HARNESS layer — the layer `system-deep-loop` itself occupies (bounded iteration, context, validation, memory, evaluation, state, dispatch) — was not centered. The NVIDIA NOOA research paper (agent-as-Python-object, validated LLM loops, agent-curated memory, model-callable harness APIs) plus the 12 blogs' loop/harness first principles are the right corpus for that layer.

### Purpose
Produce a research foundation (`research/research.md`) that extracts loop/harness design decisions for `system-deep-loop`, framed as confirm/refine/extend/contradict against BOTH the studies-1–4 graph design AND the live runtime, and kept subordinate to the 036 authority plane.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only study of the NVIDIA NOOA paper (`context/research-paper/`) as the primary subject.
- The 12 posts in `context/blog-posts/` for loop/harness first principles.
- Mapping onto the live `system-deep-loop` runtime (convergence, LEAF dispatch, prompt-pack, JSONL state, post-dispatch validate, fanout, loop-lock) and the 036 authority plane.
- Seven prioritized loop/harness angles (P1–P7) and explicit when-not-to-use boundaries.

### Out of Scope
- Implementation of any loop/harness changes (follow-up planning packet).
- Adopting NOOA wholesale (it is external research, not a controlled dependency).
- The four graph-layer reference repos (studies 1–4) — separate phase children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `orientation.md` | Create | gpt-5.6-sol orientation seed (loop/harness doctrine + 7 angles + 6 deltas) |
| `research/research.md` | Create | Canonical synthesis (GPT-5.6-SOL xhigh; DeepSeek V4 Pro verified, fixes applied) |
| `research/verification-deepseek-v4-pro.md` | Create | Independent verification verdict + applied fixes |
| `research/findings-plain-language.md` | Create | Plain-language rec summary |
| `research/lineages/noaa-theory-sol-high/iterations/iteration-NNN.md` | Create | Per-iteration evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 deep-research iterations (gpt-5.6-sol high/fast) over the NOOA paper + the blog corpus | 20 iteration records complete; `stopReason: maxIterationsReached` — SATISFIED |
| REQ-002 | Synthesize with gpt-5.6-sol xhigh and independently verify with DeepSeek V4 Pro | `research.md` authored by SOL xhigh; verification present (PASS-WITH-FIXES); all flagged fixes applied — SATISFIED |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Resolve the 7 loop/harness angles (P1–P7) with cited evidence, framed vs studies 1–4 and the live runtime | 7/7 resolved at design-decision level in `research.md` — SATISFIED |
| REQ-004 | Keep every extraction subordinate to 036 and correct the 036 operational status | `research.md` states 036 runs dark (target-state, not current enforcement); each delta names its 036 boundary — SATISFIED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` compiled from 20 iterations with a convergence report. — MET
- **SC-002**: All 7 angles resolved with cited evidence; synthesis independently verified (PASS-WITH-FIXES; all fixes applied). — MET
- **SC-003**: Six concrete, additive loop/harness deltas for system-deep-loop, each subordinate to 036, with a mutants-first rollout. — MET
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | NOOA is single-agent, in-process, not authority-aware | Medium | Every extraction framed as a proposal beneath 036; in-process/model-spawn ideas explicitly rejected |
| Risk | Inheriting "036 is operational" framing from studies 1–4 | Medium | Corrected: 036 runs dark (target-state invariant, not current enforcement) |
| Note | Novelty telemetry is executor-generated (suspiciously monotonic) | Low | Flagged as trajectory metadata, not corpus-exhaustion evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Implementation/measurement only: repair-budget behavior, memory recall/precision, context-API token/latency, harness mutant kill rate. The next evidence class is a mutant-driven shadow prototype (P7 corpus first).
<!-- /ANCHOR:questions -->

---
