---
title: "Feature Specification: Retire the Gemini 3.8 Flash route from cli-devin"
description: "Remove gemini-3-8-flash-high from the cli-devin roster and the deep-loop fan-out allowlist after one two-iteration research pass exhausted Devin's daily quota; the model stays reachable through cursor."
trigger_phrases:
  - "retire gemini devin route"
  - "gemini 3.8 flash devin quota"
  - "devin roster removal"
  - "fanout devin allowlist gemini"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/065-retire-gemini-devin-route"
    last_updated_at: "2026-09-06T11:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Retired the Gemini route from cli-devin and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the Gemini 3.8 Flash route from cli-devin

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin bills Gemini 3.8 Flash High at twice the 3.7 rate. A single two-iteration deep-research pass through cli-devin exhausted the account's daily quota, so the route costs far more than the work it returns and blocks every other Devin dispatch for the rest of the day.

### Purpose
`gemini-3-8-flash-high` is rejected by the cli-devin roster and the deep-loop fan-out allowlist, with the reason recorded where the next reader will look, while the cursor route for the same model stays untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the uid from the runtime allowlists in `executor-config.ts` and `fanout-run.cjs`
- Move the uid from the accepted to the rejected list in the fan-out test
- Remove the family from the cli-devin SKILL.md and providers catalog, with a retirement note

### Out of Scope
- The cursor route for Gemini 3.8 Flash High - the operator retired the Devin route only
- Devin's other families - unchanged

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Drop the uid; five-family scope |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Drop the uid from the enforced set |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Uid now expected to be rejected |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Family lists |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Row removed, retirement note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fan-out rejects `gemini-3-8-flash-high` for kind cli-devin | The allowlist test lists it among rejected models and passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The cli-devin docs no longer offer the family and say why it left | No Gemini row in the catalog; the retirement note names the cost reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fanout-run.vitest.ts` and `executor-config.vitest.ts` pass with the uid in the rejected set
- **SC-002**: A grep for the uid across cli-devin returns only the retirement note
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A saved fan-out config still names the uid for cli-devin | That run fails closed at command construction | The error names the enforced allowlist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
