---
title: "Skill Advisor Legacy Tests"
description: "Older Vitest regression coverage for skill advisor routing, prompt policy, freshness, timing and renderer behavior."
trigger_phrases:
  - "skill advisor legacy tests"
  - "advisor legacy regression tests"
---

# Skill Advisor Legacy Tests

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`tests/legacy/` keeps broad regression coverage for the skill advisor surfaces that predate the newer focused test folders.

Current state:

- Covers advisor brief rendering, corpus parity, freshness, graph health, privacy, cache, prompt policy and subprocess behavior.
- Stores small scenario fixtures in `advisor-fixtures/` for prompt-cache and policy tests.
- Uses Vitest plus direct Python subprocess checks for parity-sensitive paths.

---

## 2. DIRECTORY TREE

```text
legacy/
+-- advisor-brief-producer.vitest.ts        # Brief output contract
+-- advisor-corpus-parity.vitest.ts         # Python and TypeScript corpus parity
+-- advisor-fixtures/                       # Scenario JSON fixtures
+-- advisor-graph-health.vitest.ts          # Graph health checks
+-- advisor-prompt-policy.vitest.ts         # Prompt policy behavior
+-- advisor-runtime-parity.vitest.ts        # Runtime parity coverage
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-corpus-parity.vitest.ts` | Compares Python scorer decisions with TypeScript scorer output over the labeled corpus. |
| `advisor-prompt-cache.vitest.ts` | Verifies prompt cache behavior and prompt-safe handling. |
| `advisor-renderer.vitest.ts` | Guards rendered advisor brief shape. |
| `advisor-fixtures/` | Contains JSON cases for stale, ambiguous, skipped and adversarial advisor inputs. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run skill_advisor/tests/legacy
```

Expected result: all legacy advisor regression tests pass.

---

## 5. RELATED

- [`../compat/README.md`](../compat/README.md)
- [`advisor-fixtures/README.md`](advisor-fixtures/README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../../README.md`](../../README.md)
