---
title: "Feature Specification: Phase 3: promote-results [template:level_1/spec.md]"
description: "Folded the inconclusive bakeoff-006 finding (a TIE) into the registry and the kimi-k2.7-code reference doc as a placeholder, keeping default-unverified, then re-ran the card-sync guard. Superseded by phase 004 (run 007: COSTAR promoted, empirical)."
trigger_phrases:
  - "kimi promote bakeoff results"
  - "registry empirical framework"
  - "kimi-k2.7-code profile update"
  - "promote-results phase"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/003-promote-results"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Promoted TIE finding; kept default-unverified, RCAF retained"
    next_safe_action: "Card-sync guard + tree-wide strict validate close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-promote-results"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: promote-results

> **SUPERSEDED BY PHASE 004 (run 007).** This phase promoted the **inconclusive** run-006 finding (RCAF retained, `status: default-unverified`) into the registry as a placeholder, because run 006's easy fixtures saturated and named no winner. Phase 004 then superseded that promotion: its run 007 on strict adversarial validators promoted **COSTAR (primary), TIDD-EC fallback, RCAF retired**, status **empirical**. The live registry (`model-profiles.json`), `kimi-k2.7-code.md`, and `_index.md` now hold the phase-004 result, NOT the run-006 placeholder described below. Any "final" or "current registry state" wording in this phase refers to its interim placeholder; the authoritative current state is phase 004.

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
| **Status** | Complete (promoted the TIE finding; kept default-unverified + RCAF) |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-framework-bakeoff |
| **Successor** | None |
| **Handoff Criteria** | Registry status flips to `empirical` (or a documented TIE/INCONCLUSIVE keeps `default-unverified`), and `check-prompt-quality-card-sync.sh .` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the kimi-k2-7-code-support specification.

**Scope Boundary**: This phase promotes the empirical bakeoff result from Phase 002 into the registry and the model reference doc. It edits `model-profiles.json` and `references/models/kimi-k2.7-code.md` only, and re-runs the card-sync guard. It does NOT re-run the bakeoff or touch the bakeoff profile.

**Dependencies**:
- Phase 002 (framework-bakeoff) complete: run `006-kimi-k2.7-prompt-framework` has produced a verdict and a per-framework leaderboard.
- The card-sync guard `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`.

**Deliverables**:
- Updated `recommended_frameworks` block for `kimi-k2.7-code` in `model-profiles.json` (primary, preplanning_density, evidence, status).
- Rewritten §3 (Recommended Framework) and §4 (Benchmark Evidence) of `references/models/kimi-k2.7-code.md` citing run `006`.
- A clean card-sync guard run and a clean `validate.sh --strict` on the parent and all children.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 002 runs the bakeoff, the empirical winner exists only in the run output under `benchmarks/006-kimi-k2.7-prompt-framework/`. The registry (`model-profiles.json#kimi-k2.7-code`) still carries the placeholder: `primary: "rcaf"`, `status: "default-unverified"`, all evidence null. The reference doc `references/models/kimi-k2.7-code.md` still describes RCAF as a reasoned-but-unverified default. Dispatch guidance stays a guess until the result is folded back into the data source and its mirror.

### Purpose
Promote the bakeoff-006 verdict into the registry and the kimi reference doc so dispatch guidance for kimi-k2.7-code becomes evidence-based, then prove the mirror stays in sync with the card-sync guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `recommended_frameworks` for `kimi-k2.7-code` in `model-profiles.json` from the bakeoff verdict.
- Rewrite §3 and §4 of `references/models/kimi-k2.7-code.md` to cite run `006`, mirroring `minimax-m3.md` / `mimo-v2.5-pro.md`.
- Re-run the card-sync guard and `validate.sh --strict` across the packet; reconcile completion metadata.

### Out of Scope
- Re-running the bakeoff or editing `kimi-k2.7-frameworks.json` - that is Phase 002.
- Editing sibling model entries (MiniMax, MiMo) - their promotions stand.
- Changing the registry schema or the card-sync guard itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/assets/model-profiles.json` | Modify | `kimi-k2.7-code.recommended_frameworks`: set `primary`, `preplanning_density`, `evidence` (benchmark `006`, score, sample, confidence), `status: "empirical"` (or keep `default-unverified` on TIE/INCONCLUSIVE) |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.7-code.md` | Modify | Rewrite §3 (Recommended Framework) and §4 (Benchmark Evidence) to cite run `006` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Update the registry from the verdict | `kimi-k2.7-code.recommended_frameworks` sets `primary`, `preplanning_density`, and `evidence` (`benchmark: "006-..."`, `primary_score`, `sample`, `confidence`) from the bakeoff result |
| REQ-002 | Flip status honestly | On a clear WINNER, `status` is `"empirical"`; on TIE/INCONCLUSIVE, `status` stays `"default-unverified"` and the reason is recorded |
| REQ-003 | Cite run 006 in the reference doc | §3 and §4 of `references/models/kimi-k2.7-code.md` cite run `006` with score, sample, and confidence, mirroring `minimax-m3.md` / `mimo-v2.5-pro.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Card-sync guard passes | `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh .` exits 0 after the edits |
| REQ-005 | Packet validates strict | `validate.sh --strict` exits 0 on the parent and all three children |
| REQ-006 | Completion metadata reconciled | Parent phase map, child statuses, and continuity blocks agree that 003 is complete and the registry is promoted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** *(interim state at this phase's close; superseded by phase 004)*: `model-profiles.json#kimi-k2.7-code.recommended_frameworks.status` read `"default-unverified"` with a recorded TIE/saturation reason, `evidence` citing benchmark `006`. Phase 004's run 007 later set this to `"empirical"` citing benchmark `007-kimi-k2.7-discriminating` (COSTAR primary).
- **SC-002**: `check-prompt-quality-card-sync.sh .` exits 0 and the kimi reference doc §3/§4 stayed in sync with the registry (run `006` at this phase; run `007` after phase 004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 verdict | Nothing to promote without it | Gate Phase 003 on a completed run `006` with a verdict |
| Risk | Card-sync guard drift | Registry and reference doc fall out of sync; guard fails | Edit the registry DATA first, then mirror §3/§4; re-run the guard until exit 0 |
| Risk | Over-claiming on a weak verdict | Promotes a winner the data does not support | On TIE/INCONCLUSIVE keep `default-unverified` and record why, as the kimi reference doc already anticipates |
| Risk | Completion metadata conflict | Parent map and child status disagree | Reconcile the phase map, child statuses, and continuity blocks after the edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ~~On a marginal WINNER inside noise, does the operator want `empirical` status or a `default-unverified` hold?~~ **Resolved (interim, superseded):** run 006's verdict was a TIE (not even a marginal winner), so this phase held `default-unverified` with the saturation caveat. Phase 004's run 007 later flipped the registry to `empirical` (COSTAR).
- ~~Should the promotion also update `preplanning_density` if a denser/leaner framework wins?~~ **Resolved (interim, superseded):** no framework won run 006, so this phase held `preplanning_density: medium`. Phase 004 later set it to `lean` (COSTAR).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
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
