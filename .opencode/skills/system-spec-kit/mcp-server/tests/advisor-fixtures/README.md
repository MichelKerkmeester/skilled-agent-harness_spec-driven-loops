---
title: "Advisor Fixtures: Mock Hook Response Test Data"
description: "Test fixtures for the Copilot skill-advisor hook, providing mock advisor responses that cover recommendation, skip, error and edge case scenarios."
trigger_phrases:
  - "advisor fixtures"
  - "advisor hook test data"
  - "copilot user prompt submit fixtures"
  - "mock advisor responses"
---

# Advisor Fixtures: Mock Hook Response Test Data

> Fixture-only directory that provides mock skill-advisor hook responses for testing the Copilot user-prompt-submit hook under various advisor scenarios.

---

## 1. OVERVIEW

`tests/advisor-fixtures/` owns mock advisor response fixtures for the Copilot skill-advisor hook integration. These fixtures simulate the advisor MCP response shape under different conditions so that the user-prompt-submit hook can be tested without live MCP calls.

Current state:

- 10 JSON files provide the full fixture surface. No subdirectories or executable code exist.
- Fixtures cover recommendation scenarios: `livePassingSkill.json` (happy path), `ambiguousTopTwo.json` (confidence tie), `noPassingSkill.json` (fallback), `staleHighConfidenceSkill.json` (freshness handling).
- Fixtures cover skip policy scenarios: `skipPolicyCommandOnly.json`, `skipPolicyEmptyPrompt.json`, `skippedShortCasual.json`.
- Additional edge cases: `failOpenTimeout.json` (error handling), `promptPoisoningAdversarial.json` (sanitization), `unicodeInstructionalSkillLabel.json` (unicode labels).
- Each fixture matches the `AdvisorHookResult` interface with `status`, `freshness`, `brief`, `recommendations`, `diagnostics`, `metrics`, `generatedAt` and `sharedPayload` fields.
- The consumer test is `tests/copilot-user-prompt-submit-hook.vitest.ts`, which loads fixtures through a `fixture()` helper function.
- The test suite is gated behind `copilotHooksAvailable` and is currently skipped when compiled Copilot hook fixtures are not available.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `livePassingSkill.json` | Happy-path fixture with a passing skill recommendation at high confidence. |
| `ambiguousTopTwo.json` | Fixture with two top skills at similar confidence levels, testing ambiguity handling. |
| `noPassingSkill.json` | Fixture where no skills pass the confidence threshold, testing fallback behavior. |
| `staleHighConfidenceSkill.json` | Fixture with a stale but high-confidence skill, testing freshness handling. |
| `skipPolicyCommandOnly.json` | Fixture skipped due to command-only policy, testing skip policy logic. |
| `skipPolicyEmptyPrompt.json` | Fixture skipped due to empty prompt, testing empty prompt handling. |
| `skippedShortCasual.json` | Fixture skipped for short casual prompts, testing skip conditions. |
| `failOpenTimeout.json` | Fixture representing advisor timeout failure, testing error handling. |
| `promptPoisoningAdversarial.json` | Fixture testing security and sanitization of adversarial advisor responses. |
| `unicodeInstructionalSkillLabel.json` | Fixture with unicode characters in skill labels, testing unicode handling. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `livePassingSkill.json` through `unicodeInstructionalSkillLabel.json` | Fixture | Mock advisor hook responses loaded by `tests/copilot-user-prompt-submit-hook.vitest.ts` for hook behavior testing. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npm test -- tests/copilot-user-prompt-submit-hook.vitest.ts
```

The consumer test is gated behind `copilotHooksAvailable` and is currently skipped in this environment when compiled Copilot hook fixtures are not available. The test structure and fixture loading logic are valid.

---

## 5. RELATED

- [Parent: Tests](../README.md)
- [Skill README](../../README.md)
