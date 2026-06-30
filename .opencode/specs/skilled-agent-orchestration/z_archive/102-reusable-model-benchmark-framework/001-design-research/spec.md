---
title: "Feature Specification: Reusable model-benchmark framework for deep-improvement"
description: "Deep-research (cli-codex gpt-5.5 high/fast, 10 iterations) into how to generalize the one-off prompt-framework benchmark rigs into a reusable, config-driven, model/situation-agnostic benchmark framework that lives in the deep-improvement skill."
trigger_phrases:
  - "reusable benchmark framework"
  - "deep-improvement benchmark generalization"
  - "model-agnostic benchmark"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/001-design-research"
    last_updated_at: "2026-06-02T06:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep-research complete; research.md + deltas.jsonl synthesized"
    next_safe_action: "Plan implementation phases from the P0/P1/P2 roadmap in research/research.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "New module vs extend Lane B? -> EXTEND Lane B; matrix expander as new sweep-benchmark.cjs called by loop-host"
      - "How to separate frontier models? -> correctness-as-gate + tiered T3/T4 fixtures + per-dimension separation + saturation auto-detect"
      - "Minimal profile schema? -> additive mode/models[]/frameworks[]/variants[]/scoring/sampling/reporting over default.json (iter 7)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reusable model-benchmark framework for deep-improvement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (research packet) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `121-deep-agent-improvement-benchmark-mode` (Lane B), `126/004-mimo-prompt-framework-benchmark` (the lean one-off rig this generalizes) |
| **Successor** | TBD — implementation phases follow the research |
| **Handoff Criteria** | `research/research.md` produced with a concrete design + prioritized roadmap (deltas) for a reusable, config-driven benchmark framework in deep-improvement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's prompt-framework benchmarks are **one-off, model-specific rigs**: `120/003` (MiniMax, 7 fixtures) and `126/004` (MiMo, lean 2-fixture port) each re-implement fixtures + a dispatch wrapper + scoring. Packet `121` generalized *model-benchmark mode* into deep-improvement Lane B (`run-benchmark.cjs` + `dispatch-model.cjs` + a 5-dim scorer), but the **prompt-framework bake-off, the fixture taxonomy, the multi-dimensional scoring, and the statistical rigor are not yet a reusable framework** — each new model or question still needs new rig code. The `126/004` run also exposed a **correctness-saturation** problem: tractable pure-function fixtures don't separate frontier models, so the benchmark only measured format/brevity.

### Purpose
Deep-research (10 iterations, cli-codex `gpt-5.5` high reasoning / fast tier) how to evolve these rigs into **one reusable, config-driven, model/situation-agnostic benchmark framework** that lives in the `deep-improvement` skill — so benchmarking any model, prompt technique, reasoning level, or situation becomes a **profile/config**, not new code. Output: a design + a prioritized implementation roadmap (deltas). Implementation is a follow-on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (research)
- Inventory current benchmark assets (deep-improvement Lane B, `120/003`, `121`, `126/004`) — what is reusable vs one-off; the gap to "any model/situation."
- Design dimensions to research: fixture taxonomy + difficulty tiers (anti-saturation), multi-dimensional scoring (deterministic + LLM-judge), statistical rigor (multi-sample, noise floor, significance), model-agnostic dispatch (executor/provider/reasoning sweep), pluggable prompt-technique + framework registry, config-driven profiles, reporting/leaderboard/regression, situational modes (model-vs-model, framework bake-off, reasoning ablation, capability profiling).
- A prioritized design + roadmap (deltas) for building it into deep-improvement.

### Out of Scope
- Implementing the framework (follow-on phases).
- Re-running the MiMo/MiniMax benchmarks (that is `126/004`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `127-.../research/iterations/iteration-NNN.md` | Create | Per-iteration codex findings |
| `127-.../research/research.md` | Create | Synthesis + design + prioritized roadmap (deltas) |
| `127-.../research/deltas/deltas.jsonl` | Create | Structured deltas |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 10-iteration deep-research executed via cli-codex gpt-5.5 high/fast | `research/iterations/iteration-001..010.md` present, each a real codex finding |
| REQ-002 | Concrete reusable-framework design produced | `research/research.md` proposes a config/profile schema + the seam architecture (fixtures, frameworks, scorers, dispatch) enabling any-model/any-situation reuse |
| REQ-003 | Prioritized roadmap (deltas) | `research/deltas/deltas.jsonl` lists P0/P1/P2 build steps with target files + confidence |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Anti-saturation fixture strategy | research.md addresses how to separate frontier models (harder/graded fixtures) beyond the 126/004 saturation limit |
| REQ-005 | Reuse vs net-new mapped against deep-improvement Lane B | research.md states what to reuse from 121's Lane B and what is net-new |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` present with a config-driven framework design + prioritized roadmap.
- **SC-002**: Each iteration grounded in real repo evidence (the existing rigs + Lane B).
- **SC-003**: `validate.sh --strict` on this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex gpt-5.5 (high/fast) | Med — the research executor | codex-cli 0.135.0 has no `--search`; research draws on repo evidence (the existing rigs) + model knowledge, which is the right grounding for a design question |
| Risk | Design sprawl (too ambitious to build) | Med | Roadmap must phase the work; mark MVP vs later |
| Risk | Duplicating 121's Lane B instead of extending it | Med | REQ-005 forces a reuse-vs-net-new mapping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the framework be a new module or an extension of deep-improvement Lane B's `run-benchmark.cjs`?
- How to make fixtures separate frontier models without per-model hand-tuning (graded/LLM-judge tasks, difficulty tiers, agentic/multi-file tasks)?
- What is the minimal profile schema that covers model, executor, reasoning, fixtures, frameworks, scorers, and samples?
<!-- /ANCHOR:questions -->
