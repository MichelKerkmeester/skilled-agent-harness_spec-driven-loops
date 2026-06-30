---
title: "Feature Specification: Phase 3: promote-results"
description: "Fold the phase-2 bakeoff verdict into the glm-5.2 registry entry (recommended_frameworks) and the glm-5.2 reference doc, then re-run the card-sync guard and strict validation."
trigger_phrases:
  - "glm-5.2 promote bakeoff results"
  - "registry empirical framework glm"
  - "glm-5.2 profile update"
  - "promote-results phase"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/003-promote-results"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Promoted COSTAR empirical; card-sync green"
    next_safe_action: "Packet core complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-promote-results"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: promote-results

<!-- SPECKIT_LEVEL: 1 -->
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
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 (core) |
| **Predecessor** | 002-framework-bakeoff |
| **Successor** | None (core arc complete; 004/005 are contingencies) |
| **Handoff Criteria** | Registry status flips to `empirical` (or a documented TIE/INCONCLUSIVE keeps `default-unverified`), and `check-prompt-quality-card-sync.sh .` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the glm-5-2-support specification. It mirrors `149-kimi-k2-7-code-support/003-promote-results`.

**Scope Boundary**: This phase promotes the phase-2 bakeoff result into the registry and the model reference doc. It edits `model_profiles.json` and `references/models/glm-5.2.md` only, and re-runs the card-sync guard. It does NOT re-run the bakeoff or touch the bakeoff profile.

**Dependencies**:
- Phase 002 complete: the bakeoff run has produced a verdict and a per-framework leaderboard.
- The card-sync guard `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`.

**Deliverables**:
- Updated `recommended_frameworks` block for `glm-5.2` in `model_profiles.json` (primary, preplanning_density, evidence, status).
- Rewritten §3 (Recommended Framework) and §4 (Benchmark Evidence) of `references/models/glm-5.2.md` citing the phase-2 run.
- A clean card-sync guard run and a clean `validate.sh --strict` on the parent and all children.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 002 runs the bakeoff, the empirical winner exists only in the run output under `benchmarks/<run-label>/`. The registry (`model_profiles.json#glm-5.2`) still carries the placeholder: `primary: "craft"`, `status: "default-unverified"`, evidence doc-sourced not benchmarked. The reference doc still describes CRAFT as a reasoned-but-unverified default. Dispatch guidance stays a guess until the result is folded back into the data source and its mirror.

### Purpose
Promote the phase-2 verdict into the registry and the glm-5.2 reference doc so dispatch guidance becomes evidence-based, then prove the mirror stays in sync with the card-sync guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `recommended_frameworks` for `glm-5.2` in `model_profiles.json` from the bakeoff verdict.
- Rewrite §3 and §4 of `references/models/glm-5.2.md` to cite the phase-2 run, mirroring `kimi-k2.7-code.md` / `mimo-v2.5-pro.md`.
- Re-run the card-sync guard and `validate.sh --strict` across the packet; reconcile completion metadata.

### Out of Scope
- Re-running the bakeoff or editing `glm-5.2-frameworks.json` — that is Phase 002.
- Editing sibling model entries — their promotions stand.
- Changing the registry schema or the card-sync guard itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Modify | `glm-5.2.recommended_frameworks`: set `primary`, `preplanning_density`, `evidence` (benchmark run-label, score, sample, confidence), `status: "empirical"` (or keep `default-unverified` on TIE/INCONCLUSIVE) |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | Modify | Rewrite §3 (Recommended Framework) and §4 (Benchmark Evidence) to cite the phase-2 run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Update the registry from the verdict | `glm-5.2.recommended_frameworks` sets `primary`, `preplanning_density`, and `evidence` (`benchmark`, `primary_score`, `sample`, `confidence`) from the bakeoff result |
| REQ-002 | Flip status honestly | On a clear WINNER, `status` is `"empirical"`; on TIE/INCONCLUSIVE, `status` stays `"default-unverified"` and the reason is recorded |
| REQ-003 | Cite the phase-2 run in the reference doc | §3 and §4 of `references/models/glm-5.2.md` cite the run with score, sample, and confidence, mirroring the sibling profiles |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Card-sync guard passes | `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh .` exits 0 after the edits |
| REQ-005 | Packet validates strict | `validate.sh --strict` exits 0 on the parent and all children |
| REQ-006 | Completion metadata reconciled | Parent phase map, child statuses, and continuity blocks agree that 003 is complete and the registry is promoted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `model_profiles.json#glm-5.2.recommended_frameworks` reflects the phase-2 verdict (status `empirical` on a WINNER, or a documented `default-unverified` hold on TIE), with `evidence` citing the run-label.
- **SC-002**: `check-prompt-quality-card-sync.sh .` exits 0 and the glm-5.2 reference doc §3/§4 stays in sync with the registry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 verdict | Nothing to promote without it | Gate Phase 003 on a completed run with a verdict |
| Risk | Card-sync guard drift | Registry and reference doc fall out of sync; guard fails | Edit the registry DATA first, then mirror §3/§4; re-run the guard until exit 0 |
| Risk | Over-claiming on a weak verdict | Promotes a winner the data does not support | On TIE/INCONCLUSIVE keep `default-unverified` and record why (149/003 precedent) |
| Risk | Completion metadata conflict | Parent map and child status disagree | Reconcile the phase map, child statuses, and continuity blocks after the edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- On a marginal WINNER inside noise, does the operator want `empirical` status or a `default-unverified` hold? (Default: hold + record reason, per 149/003.)
- Should the promotion also update `preplanning_density` if a denser/leaner framework wins?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
