---
title: "Remediation: deep-agent-improvement ruleCoherence inline fallback (Playbook 008)"
description: "Add inline ALWAYS/NEVER rule extraction fallback to generate-profile.cjs deriveRules (fixes PG-007 + 5D-012); document stale-scenario determinations for PG-005, BI-014/015, 5D-013, DR-031."
trigger_phrases:
  - "rulecoherence inline fallback"
  - "007 phase 008 remediation"
  - "generate-profile deriveRules fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/008-dai-rulecoherence-inline-fallback"
    last_updated_at: "2026-05-27T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Added inline ALWAYS/NEVER fallback to deriveRules; vitest 99/99 still green"
    next_safe_action: "Flip 005 ledger PG-007/5D-012 PASS; document stale-scenario findings"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Remediation: deep-agent-improvement ruleCoherence inline fallback (Playbook 008)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-05-27 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 surfaced one confirmed code bug and four stale-scenario expectations. CODE BUG: `generate-profile.cjs` `deriveRules()` extracted ALWAYS/NEVER rules ONLY from a dedicated `## RULES` / `## OPERATING RULES` section with `### ALWAYS`/`### NEVER` subheadings — it had no inline fallback, so it yielded 0 rules for agents (debug, orchestrate) that carry inline `- NEVER ...` bullets without a dedicated section. This failed PG-007 (inline NEVER fallback) and 5D-012 (debug ruleCoherence non-empty). STALE SCENARIOS (implementation correct, scenario expectation outdated): PG-005 (`≥3 ALWAYS` for debug, which has 0), BI-014/015 (`--profile=debug` — only generic `default.json` ships), 5D-013 (expects `profile-generation-failure`; correct label is `candidate-read-failure`), DR-031 (`SOURCE_DIVERSITY_THRESHOLD=0.4`; code intentionally `1.5`).

### Purpose
Ship the inline-fallback code fix and document the stale-scenario determinations so the phase-005 (+ DR-031) verdicts reflect the correct implementation.
<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code fix: `generate-profile.cjs` `deriveRules()` inline ALWAYS/NEVER fallback.
- Verification: re-run generate-profile on debug + the 99-test vitest (no regression).
- Documented stale-scenario findings (PG-005, BI-014/015, 5D-013, DR-031) as recommended scenario updates.

### Out of Scope
- Editing the playbook scenario files themselves (recorded as follow-up scenario-update recommendations).
- 5D-010 scorer null-aggregate behavior for rule-less agents (recorded as a P2 design observation).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-agent-improvement/scripts/generate-profile.cjs` | Modify | `deriveRules()` inline ALWAYS/NEVER fallback |
<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inline fallback extracts debug's NEVER rules | generate-profile debug -> ruleCoherence has ≥2 NEVER |
| REQ-002 | No vitest regression | deep-agent-improvement vitest 99/99 pass |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Stale-scenario findings documented | PG-005, BI-014/015, 5D-013, DR-031 corrections recorded with exact change |
<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: deriveRules inline fallback shipped; debug ruleCoherence yields its 2 NEVER rules.
- **SC-002**: vitest 99/99 green (no regression).
- **SC-003**: 005 ledger PG-007 + 5D-012 flipped to PASS; stale-scenario findings documented for follow-up.
<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fallback over-matches prose | False rule extraction | Anchored to `^[-*]\s+(ALWAYS\|NEVER)` bullet starts; fires only when section-based yields nothing |
| Risk | Regression in section-based path | Existing profiles change | vitest 99/99 re-run confirms no regression |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- 5D-010: should the 5D scorer score an empty ruleCoherence dimension as 0 (vs null aggregate) for rule-less agents? Recorded as a P2 design observation, not fixed here.
<!-- /ANCHOR:questions -->
