---
title: "Feature Specification: DeepSeek V4 Max Tier Dispatch Support (cli-devin)"
description: "cli-devin cannot dispatch the DeepSeek V4 max thinking tiers — the enforced allowlist carries only the base uids. Additive superset: deepseek-v4-flash-max / deepseek-v4-pro-max, list-verified 2026-08-14."
trigger_phrases:
  - "deepseek v4 max devin"
  - "deepseek max phase 002"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/002-deepseek-v4-max"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Phase complete: DeepSeek max uids shipped in the combined 2026-08-14 roster change"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-roster-update-luna-deepseek-glm-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Add all DeepSeek tiers or only max to cli-devin? RESOLVED (operator): max tier only — deepseek-v4-pro-max and deepseek-v4-flash-max."
---
# Feature Specification: DeepSeek V4 Max Tier Dispatch Support (cli-devin)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent** | cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini |
| **Predecessor** | 001-gpt-5-6-luna-max (shipped with this phase in one change) |
| **Successor** | 003-glm-5-3-opencode-go |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin's live roster carries DeepSeek V4 max thinking tiers (`deepseek-v4-pro-max`, `deepseek-v4-flash-max`) that `DEVIN_SUPPORTED_MODELS` does not include, so cli-devin hard-rejects them.

### Purpose
Make the DeepSeek V4 max tiers dispatchable on cli-devin as a pure additive superset, keeping the two hand-synced enforcement points and the curated family list consistent. Ids list-verified against the live `devin models list` on 2026-08-14.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` allowlist: `DEVIN_SUPPORTED_MODELS` +2, sorted, honest rationale comments.
- `fanout-run.cjs` mirror `DEVIN_ALLOWED_MODELS` kept byte-identical.
- Vitest fixtures for devin (+2); cross-check and combo-matrix derivation flow automatically.
- cli-devin `providers-and-models.md` roster rows, family-list honesty sweep, changelog, SKILL.md version bump.

### Out of Scope
- GPT-5.6 Luna Max (phase `001-gpt-5-6-luna-max` owns it) and GLM 5.3 (phase `003-glm-5-3-opencode-go`).
- DeepSeek non-max tiers (`-low`/`-high`) — request said "max thinking levels" only; Devin's other tiers stay out.
- `sk-prompt-models` DeepSeek max prompt-craft profile — deferred, inherits closest persona.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | +2 devin uids, sorted; honest comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the same additions in the Set |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Devin +2 fixtures |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Modify | Roster +2 rows, family-list sweep, changelog v1.4.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DeepSeek max tiers dispatchable on cli-devin | `isDevinModelAllowed('deepseek-v4-pro-max')` and `'deepseek-v4-flash-max'` true; mirror Set identical |
| REQ-002 | No fabricated ids | Every added id appears verbatim in a live listing captured 2026-08-14 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No stale family/count claims | No cli-devin doc omits DeepSeek max tiers from the curated roster |
| REQ-004 | Additive only | Every pre-existing id/uid still present |
| REQ-005 | Test suite green | executor-config, fanout-run, combo-matrix vitest pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-loop unit suite passes with the updated fixtures.
- **SC-002**: A fanout cli-devin dispatch naming a DeepSeek max uid is no longer rejected by the allowlist gate.
- **SC-003**: `grep` finds no residual stale claim in cli-devin docs.
- **SC-004**: `validate.sh <folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` CLI installed | Cannot list-verify ids | Confirmed installed 2026-08-14 |
| Risk | Mirror drift `executor-config.ts` vs `fanout-run.cjs` | Fanout rejects/accepts wrong id | Edited together; cross-check test asserts identical sets |
| Risk | Fabricated id (the 033 failure mode) | Dispatch fails at runtime | Every id copied verbatim from a live listing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No id is added that is not present verbatim in a live CLI listing (no-fabrication invariant).

### Reliability
- **NFR-R01**: `executor-config.ts` allowlist and `fanout-run.cjs` mirror MUST list identical ids (fail-closed sync invariant asserted by the cross-check tests).
- **NFR-R02**: Every doc comment naming the curated family carries the live-verification date and honest verification level (list-verified, not dispatch-tested).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Only the `-max` tier suffix is in scope; `deepseek-v4-flash-low` / `deepseek-v4-flash-high` dispatches are (correctly) rejected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 3 code/test files + ~5 docs; additive only |
| Risk | 8/25 | Shared deep-loop runtime (high blast) but pure superset, guarded by tests |
| Research | 2/20 | Live-listing verification on one CLI |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Tier-scope decision resolved by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->
