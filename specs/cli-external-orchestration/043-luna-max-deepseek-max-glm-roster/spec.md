---
title: "Feature Specification: GPT-5.6 Luna Max, DeepSeek Max & GLM 5.3 Roster Additions"
description: "cli-cursor and cli-devin cannot dispatch GPT-5.6 Luna Max, cli-devin cannot dispatch the DeepSeek V4 max tiers, and cli-opencode's catalog omits GLM 5.3 on opencode-go. Each is a live-available model the rosters or docs do not yet carry."
trigger_phrases:
  - "luna max roster"
  - "gpt-5.6 luna max cursor devin"
  - "deepseek v4 max devin"
  - "glm 5.3 opencode-go"
  - "cli roster additions 043"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster"
    last_updated_at: "2026-08-14T08:29:53Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec + implemented additive roster changes across cli-cursor, cli-devin, cli-opencode"
    next_safe_action: "Run validate.sh --strict to final-state-verify the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-luna-max-deepseek-max-glm-roster"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Dispatch-test each new id, or trust the live listings? RESOLVED (operator): list-verified only — every id confirmed present in live cursor-agent --list-models / devin models list / opencode models opencode-go on 2026-08-14; NOT dispatch-tested."
      - "Add all DeepSeek tiers or only max to cli-devin? RESOLVED (operator): max tier only — deepseek-v4-pro-max and deepseek-v4-flash-max."
---
# Feature Specification: GPT-5.6 Luna Max, DeepSeek Max & GLM 5.3 Roster Additions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four models are live-available for external-CLI dispatch but the enforced rosters (or their docs) do not carry them. cli-cursor's `CURSOR_SUPPORTED_MODELS` has no GPT-5.6 persona, so `gpt-5.6-luna-max` is hard-rejected. cli-devin's `DEVIN_SUPPORTED_MODELS` has no GPT-5.6 persona and no DeepSeek max-tier uids, so `gpt-5-6-luna-max`, `deepseek-v4-pro-max`, and `deepseek-v4-flash-max` are hard-rejected. cli-opencode already serves `opencode-go/glm-5.3` live, but its catalog documents only DeepSeek Flash and Qwen under that gateway.

### Purpose
Make the four requested models dispatchable (cursor/devin) or documented (opencode-go) as a pure additive superset, keeping the two hand-synced enforcement points and every stale count/family claim consistent — every id list-verified against the live CLI listings on 2026-08-14.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` allowlists: `CURSOR_SUPPORTED_MODELS` +2, `DEVIN_SUPPORTED_MODELS` +4, sorted; honest rationale comments.
- `fanout-run.cjs` mirrors `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` kept byte-identical.
- Vitest fixtures for cursor (+2) and devin (+4); the cross-check and combo-matrix derivation flow automatically.
- Three `providers-and-models.md` rosters + the honesty sweep (cursor 18→20, devin 4→5 families) across SKILL.md/README/references/assets/playbook and the hub `smart-routing.md`.
- Per-mode changelogs + SKILL.md version bumps.

### Out of Scope
- Any Grok id change — Grok 4.6 all-levels already shipped in packet 036.
- DeepSeek non-max tiers (`-low`/`-high`) - request said "max thinking levels".
- opencode-go models beyond GLM 5.3 - glm-5.1/glm-5.2 live but not requested.
- sk-prompt-models Luna prompt-craft profile - deferred, inherits closest persona (per packet 033 precedent).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | +2 cursor ids, +4 devin uids, sorted; honest comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the same additions in both Sets |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Cursor 18→20 assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Cursor +2, Devin +4 fixtures |
| `.opencode/skills/cli-external-orchestration/cli-cursor/**` | Modify | Roster +2, count 18→20 honesty sweep, changelog, version |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Modify | Roster +4, 4→5 families sweep, changelog, version |
| `.opencode/skills/cli-external-orchestration/cli-opencode/**` | Modify | opencode-go +glm-5.3 row, changelog, version |
| `.opencode/skills/cli-external-orchestration/shared/references/smart-routing.md` | Modify | Devin roster mention adds GPT-5.6 Luna Max |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Luna Max dispatchable on cli-cursor | `isCursorModelAllowed('gpt-5.6-luna-max')` and `'gpt-5.6-luna-max-fast'` true |
| REQ-002 | Luna Max dispatchable on cli-devin | `isDevinModelAllowed('gpt-5-6-luna-max')` and `'gpt-5-6-luna-max-priority'` true |
| REQ-003 | DeepSeek max tiers dispatchable on cli-devin | `isDevinModelAllowed('deepseek-v4-pro-max')` and `'deepseek-v4-flash-max'` true |
| REQ-005 | Enforcement mirrors stay in sync | `*_ALLOWED ≡ *_SUPPORTED` cross-check tests green |
| REQ-008 | No fabricated ids | Every added id appears verbatim in a live listing captured 2026-08-14 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | GLM 5.3 documented for opencode-go | `providers-and-models.md` lists `opencode-go/glm-5.3` |
| REQ-006 | No stale counts | No cli-cursor doc says "18" allowlist; no cli-devin doc omits GPT-5.6 from the curated family list |
| REQ-007 | Additive only | Every pre-existing id/uid still present; Grok 4.6 unchanged |
| REQ-009 | Test suite green | executor-config, fanout-run, combo-matrix vitest pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-loop unit suite passes with the updated fixtures.
- **SC-002**: A fanout cli-cursor / cli-devin dispatch naming any new id is no longer rejected by the allowlist gate.
- **SC-003**: `grep` finds no residual "18"-count claim in cli-cursor docs and no "four families" claim in cli-devin docs.
- **SC-004**: `validate.sh <folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cursor-agent` / `devin` / `opencode` CLIs installed | Cannot list-verify ids | All three confirmed installed 2026-08-14 |
| Risk | Mirror drift `executor-config.ts` vs `fanout-run.cjs` | Fanout rejects/accepts wrong id | High/Low - edited together, cross-check test asserts identical sets |
| Risk | Fabricated id (the 033 failure mode) | Dispatch fails at runtime | Med/Low - every id copied verbatim from a live listing this session |
| Risk | Stale count left behind | Doc contradicts roster | Med/Low - post-edit grep sweep (SC-003) |
| Risk | Devin "Fast" mis-mapped as `-fast` | Wrong uid | Low - live listing shows `-priority` = "…Fast"; documented explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No id is added that is not present verbatim in a live CLI listing (no-fabrication invariant, matching the enforced-allowlist doctrine in `executor-config.ts`).

### Reliability
- **NFR-R01**: `executor-config.ts` allowlists and `fanout-run.cjs` mirrors MUST list identical ids (fail-closed sync invariant asserted by the cross-check tests).
- **NFR-R02**: Every doc comment naming a curated family carries the live-verification date and honest verification level (list-verified vs dispatch-tested).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Negative-rejection fixtures use `gpt-5.6-sol-*` / `gpt-5-6-sol-*` (Sol, not Luna) so they remain valid after Luna Max is added.
- Devin "Fast" suffix is `-priority`, not `-fast`; a `gpt-5-6-luna-max-fast` dispatch would be (correctly) rejected.

### Error Scenarios
- An off-list id (e.g. `gpt-5.6-luna-high` on cursor) still hard-fails before command construction - only the Max tier is in scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 code/test files + ~13 docs; additive only |
| Risk | 10/25 | Shared deep-loop runtime (high blast) but pure superset, guarded by tests |
| Research | 6/20 | Live-listing verification across three CLIs |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Both decisions resolved by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->
