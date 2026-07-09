---
title: "Feature Specification: add opt-in 5dim scorer and skill docs"
description: "Add the opt-in 5dim scorer path and document model-benchmark mode in the skill documentation."
trigger_phrases:
  - "optin 5dim scorer"
  - "run-benchmark scorer flag"
  - "deep-agent-improvement skill docs sk-doc"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/005-add-opt-in-5dim-scorer-and-skill-docs"
    last_updated_at: "2026-05-28T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wired opt-in 5dim scorer + documented mode in SKILL.md"
    next_safe_action: "None — phase complete; verify + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "optin-scorer-20260528"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: add opt-in 5dim scorer and skill docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 19 |
| **Predecessor** | 004-fix-hardening-findings-for-model-benchmark |
| **Successor** | 006-deep-loop-empty-archive-dir |
| **Handoff Criteria** | 5-dim scorer wired as opt-in with tests; default pattern path byte-identical; SKILL.md documents model-benchmark mode at DQI excellent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of packet 121 — closing the substantive review deferral (F-P2-1/F-P2-2 from the 122 review) by making the ported 5-dimension scorer genuinely usable, and bringing the deep-agent-improvement skill docs current + sk-doc-aligned now that the model-benchmark mode exists.

**Scope Boundary**: An opt-in `--scorer` flag in `run-benchmark.cjs` + docs. The default `pattern` path stays byte-identical. No change to the agent-improvement path.

**Dependencies**: the 121/003 build (loop-host, dispatch-model, `scorer/`), the 122 review-report deferrals, sk-doc templates + DQI tool.

**Deliverables**: opt-in 5-dim scorer wiring + tests; model-benchmark mode documented in SKILL.md (DQI excellent); README structure table current.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 122 review flagged that the ported 5-dim scorer (`score-model-variant.cjs`) was built and available but never wired into `run-benchmark.cjs` (deferral F-P2-1/F-P2-2), and the deep-agent-improvement SKILL.md did not document the model-benchmark mode at all (the whole 121/003 feature was undocumented in the skill).

### Purpose
Make the 5-dim scorer usable end-to-end as an opt-in, and bring the skill docs current and sk-doc-aligned, without regressing the default benchmark path or the agent-improvement path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `run-benchmark.cjs` `--scorer pattern|5dim` (default pattern) + `--grader noop|mock|llm`; lazy-load the scorer only on the 5dim path; record `scoringMethod`
- Regression tests for both scorer paths + unknown-scorer fallback
- SKILL.md: document the model-benchmark mode (Mode 4 + WHEN-TO-USE) ; README: refresh the structure table

### Out of Scope
- Making 5dim the default (stays opt-in; default pattern path byte-identical) - design intent
- Generating fresh model output inside run-benchmark (the dispatcher path remains a separate concern)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/run-benchmark.cjs` | Modify | `--scorer`/`--grader` flags + `scoreFixture5dim` adapter + `scoringMethod` |
| `scripts/tests/optin-scorer.vitest.ts` | Create | 3 wiring regression tests |
| `SKILL.md` | Modify | Mode 4 model-benchmark docs + WHEN-TO-USE case + code-fence fix |
| `scripts/README.md` | Modify | structure table refreshed for new scripts + `scorer/` subtree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 5-dim scorer wired as opt-in | `run-benchmark.cjs --scorer=5dim` produces `scoringMethod:5dim` + per-dimension scores; default produces `scoringMethod:pattern`; regression-tested |
| REQ-002 | No regression | default pattern path byte-identical behavior; full vitest green; alignment-drift PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Skill docs current + sk-doc-aligned | SKILL.md documents the model-benchmark mode at DQI band excellent; README structure table lists the real current scripts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can opt into the 5-dim rubric for a benchmark run, and the choice is recorded in the report + state log.
- **SC-002**: A reader of the skill docs can find how the model-benchmark mode and its scorer options work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wiring regresses the default benchmark path | Med | Lazy-load scorer only on 5dim; default path unchanged; backward-compat test |
| Risk | 5dim scoring of benchmark fixtures yields odd dims (e.g. D5 pre-planning low) | Low | Opt-in + advisory; documented as experimental rubric scoring |
| Dependency | sk-doc DQI tool + templates | Low | DQI run before/after; SKILL.md stays excellent band |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: 5dim wired as opt-in (not default) — keeps the default pattern path byte-identical, closing F-P2-1/F-P2-2 without the half-baked-default risk the 122 review warned about.
- RESOLVED: skill was already structurally sk-doc-aligned (DQI 94→97); the gap was content (undocumented mode), now filled.
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
