---
title: "Feature Specification: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)"
description: "cli-cursor and cli-devin cannot dispatch GPT-5.6 Luna Max — the enforced allowlists carry no GPT-5.6 persona. Additive superset: gpt-5.6-luna-max / gpt-5.6-luna-max-fast on cursor, gpt-5-6-luna-max / gpt-5-6-luna-max-priority on devin, list-verified 2026-08-14."
trigger_phrases:
  - "luna max roster"
  - "gpt-5.6 luna max cursor devin"
  - "luna max phase 001"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster/001-gpt-5-6-luna-max"
    last_updated_at: "2026-08-15T09:00:00Z"
    last_updated_by: "pi"
    recent_action: "Phase complete: Luna Max ids shipped in the combined 2026-08-14 roster change"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-luna-max-deepseek-max-glm-roster"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dispatch-test each new id, or trust the live listings? RESOLVED (operator): list-verified only — every id confirmed present verbatim in live cursor-agent --list-models / devin models list on 2026-08-14; NOT dispatch-tested."
---
# Feature Specification: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)

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
| **Parent** | cli-external-orchestration/043-luna-max-deepseek-max-glm-roster |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GPT-5.6 Luna Max is live-available for external-CLI dispatch but neither enforced roster carries a GPT-5.6 persona: cli-cursor's `CURSOR_SUPPORTED_MODELS` hard-rejects `gpt-5.6-luna-max` and cli-devin's `DEVIN_SUPPORTED_MODELS` hard-rejects `gpt-5-6-luna-max` / `gpt-5-6-luna-max-priority`.

### Purpose
Make the Luna Max tier dispatchable on both modes as a pure additive superset, keeping the two hand-synced enforcement points and every stale count/family claim consistent. Ids list-verified against the live CLI listings on 2026-08-14.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` allowlists: `CURSOR_SUPPORTED_MODELS` +2, `DEVIN_SUPPORTED_MODELS` +2 (luna uids), sorted, honest rationale comments.
- `fanout-run.cjs` mirrors `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` kept byte-identical.
- Vitest fixtures for cursor (+2) and devin (+2 luna); cross-check and combo-matrix derivation flow automatically.
- cli-cursor + cli-devin `providers-and-models.md` rosters, count/family honesty sweep, changelogs, SKILL.md version bumps, hub `smart-routing.md` devin mention.

### Out of Scope
- DeepSeek max tiers (phase `002-deepseek-v4-max` owns them) and GLM 5.3 (phase `003-glm-5-3-opencode-go`).
- Non-Max Luna tiers (none/low/medium/high/xhigh) and the Sol/Terra personas — out of scope, rejected.
- `sk-prompt-models` Luna prompt-craft profile — deferred, inherits closest persona (packet 033 precedent).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | +2 cursor ids, +2 devin luna uids, sorted, honest comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the same additions in both Sets |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Cursor 18→20 assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Cursor +2, Devin +2 luna fixtures |
| `.opencode/skills/cli-external-orchestration/cli-cursor/**` | Modify | Roster +2, count 18→20 sweep, changelog v1.4.0.0 |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Modify | Roster +2 luna rows, family list + GPT-5.6, changelog v1.4.0.0 |
| `.opencode/skills/cli-external-orchestration/shared/references/smart-routing.md` | Modify | Devin roster mention adds GPT-5.6 Luna Max |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Luna Max dispatchable on cli-cursor | `isCursorModelAllowed('gpt-5.6-luna-max')` and `'gpt-5.6-luna-max-fast'` true; mirror Set identical |
| REQ-002 | Luna Max dispatchable on cli-devin | `isDevinModelAllowed('gpt-5-6-luna-max')` and `'gpt-5-6-luna-max-priority'` true; mirror Set identical |
| REQ-003 | No fabricated ids | Every added id appears verbatim in a live listing captured 2026-08-14 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No stale counts | No cli-cursor doc says the old allowlist count; no cli-devin doc omits GPT-5.6 from the curated family list |
| REQ-005 | Additive only | Every pre-existing id/uid still present; Grok 4.6 and GLM unchanged |
| REQ-006 | Test suite green | executor-config, fanout-run, combo-matrix vitest pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-loop unit suite passes with the updated fixtures.
- **SC-002**: A fanout cli-cursor / cli-devin dispatch naming a Luna Max id is no longer rejected by the allowlist gate.
- **SC-003**: `grep` finds no residual stale count claim in cli-cursor / cli-devin docs.
- **SC-004**: `validate.sh <folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cursor-agent` / `devin` CLIs installed | Cannot list-verify ids | Both confirmed installed 2026-08-14 |
| Risk | Mirror drift `executor-config.ts` vs `fanout-run.cjs` | Fanout rejects/accepts wrong id | Edited together; cross-check test asserts identical sets |
| Risk | Fabricated id (the 033 failure mode) | Dispatch fails at runtime | Every id copied verbatim from a live listing |
| Risk | Devin "Fast" mis-mapped as `-fast` | Wrong uid | Live listing shows `-priority` = "…Max Thinking Fast"; documented explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No id is added that is not present verbatim in a live CLI listing (no-fabrication invariant).

### Reliability
- **NFR-R01**: `executor-config.ts` allowlists and `fanout-run.cjs` mirrors MUST list identical ids (fail-closed sync invariant asserted by the cross-check tests).
- **NFR-R02**: Every doc comment naming the curated family carries the live-verification date and honest verification level (list-verified, not dispatch-tested).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Negative-rejection fixtures use `gpt-5.6-sol-*` / `gpt-5-6-sol-*` (Sol, not Luna) so they remain valid after Luna Max is added.
- Devin "Fast" suffix is `-priority`, not `-fast`; a `gpt-5-6-luna-max-fast` dispatch is (correctly) rejected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 4 code/test files + ~10 docs; additive only |
| Risk | 9/25 | Shared deep-loop runtime (high blast) but pure superset, guarded by tests |
| Research | 4/20 | Live-listing verification across two CLIs |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Evidence-level decision resolved by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->
