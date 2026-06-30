---
title: "Feature Specification: Phase 4: discriminating-bakeoff (contingency)"
description: "CONTINGENCY — if phase 2 saturates (correctness TIE) even on strict validators, re-run the GLM-5.2 framework bakeoff on harder, even-more-discriminating fixtures so the frameworks separate. Mirrors 149/004."
trigger_phrases:
  - "glm-5.2 discriminating bakeoff"
  - "glm-5.2 strict validator rerun"
  - "framework bakeoff contingency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Not triggered; phase 2 separated cleanly"
    next_safe_action: "None; closed unexecuted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 2 saturated? No (run 008 separable) — contingency not needed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: discriminating-bakeoff (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY PHASE — TRIGGER-GATED.** Execute this phase **ONLY IF** phase 2's bakeoff returns a saturated correctness TIE (all frameworks perfect, no separation) despite using strict validators. If phase 2 produced a clear verdict, this phase is **not needed** and stays Not Started. This is the same situation that forced 149's phase 4 (run 007) after its phase-2 run 006 saturated — scaffolded here so the runway exists if GLM-5.2 (a very strong model) saturates too.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (contingency) |
| **Status** | Contingency — Not Triggered |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 (contingency) |
| **Predecessor** | 002-framework-bakeoff (and its 003 promotion of the interim/TIE result) |
| **Successor** | A second 003-style promotion of the discriminating verdict |
| **Trigger Condition** | Phase 2 correctness gate saturated → TIE with no separable winner |
| **Handoff Criteria** | The re-run separates correctness; a single winner (or a defensible best-of-tied) is named |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **contingency phase** of the glm-5-2-support specification, mirroring `149-kimi-k2-7-code-support/004-discriminating-bakeoff`.

**Scope Boundary**: Re-run the framework bakeoff for `glm-5.2` on a harder, invalid-dominant fixture set that does NOT saturate, then hand the separable verdict back to a promotion step. It does not change the registry directly — promotion is a 003-style follow-up.

**Dependencies**:
- Phase 002 ran and returned a saturated TIE.
- The model-benchmark lane + a non-GLM judge.

**Deliverables**:
- A discriminating bakeoff profile (harder strict validators) and a completed run that SEPARATES correctness.
- A verdict + leaderboard with a named winner (or defensible best-of-tied) and an explicit refutation of the saturated run.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
If phase 2 saturates, the registry holds a TIE-driven `default-unverified` placeholder and dispatch guidance is still a guess. A model as strong as GLM-5.2 can ace moderately-strict fixtures, hiding real framework differences.

### Purpose
Re-run the bakeoff on adversarial fixtures hard enough to separate the frameworks, producing an evidence-based winner that a promotion step folds into the registry — exactly how 149's run 007 rescued its saturated run 006.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A harder bakeoff profile (more adversarial invalid-dominant validators; more samples/cell if needed).
- A run that separates correctness, with a non-GLM judge.
- A verdict + leaderboard, and an explicit note refuting the saturated phase-2 result.

### Out of Scope
- Promoting the verdict (a 003-style follow-up owns the registry edit).
- Changing the benchmark machinery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/glm-5.2-frameworks-discriminating.json` | Create | Harder bakeoff profile |
| `.opencode/skills/sk-prompt-models/benchmarks/<next>-glm-5.2-discriminating/` | Create | Run outputs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Build a discriminating profile | Harder invalid-dominant validators where a lax-but-plausible solution scores <1.0 |
| REQ-002 | Run separates correctness | Per-framework correctness is NOT uniform 1.0; a winner (or defensible best-of-tied) emerges |
| REQ-003 | Non-GLM judge | Grader is not a GLM model |
| REQ-004 | Refute the saturated run | Synthesis explicitly notes that phase 2 saturated and this run supersedes it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The discriminating run separates the frameworks and names a winner (or defensible best-of-tied) for a promotion step to fold in.
- **SC-002**: The synthesis records why phase 2 saturated and how this run resolved it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Even harder fixtures still saturate | No separation | Increase adversarial density + samples; report token-efficiency/format as the discriminator (149/004 precedent) |
| Risk | This phase runs when unneeded | Wasted dispatch budget | Trigger-gated: only run if phase 2 actually saturated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What fixture difficulty actually separates GLM-5.2's frameworks? (Tune from the phase-2 saturation evidence.)
<!-- /ANCHOR:questions -->
