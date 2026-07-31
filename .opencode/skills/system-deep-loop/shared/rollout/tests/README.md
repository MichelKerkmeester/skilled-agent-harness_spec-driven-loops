---
title: "Rollout Tests: command-injection resolver test suite"
description: "Tests that pin default, JSON-override and environment-override precedence for the command-injection rollout resolver."
---

# Rollout Tests

---

## 1. OVERVIEW

Test suite for `../resolve-injection-mode.cjs`. Pins the default `fallback` resolution, a per-command override from the JSON mode map and environment-variable override precedence over that map, for both slash and path command name forms.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `resolve-injection-mode.test.cjs` | Nine assertions run against temporary config files: default fallback with an empty mode map, string and evidence-bearing JSON overrides, and `SPECKIT_COMMAND_INJECTION_MODE` env override precedence. |
| `validate-rollout.test.cjs` | Validates the repaired rollout, a complete evidence-bearing `fix` entry and each missing evidence field, including the legacy string form. |

## 3. VALIDATION

```bash
node .opencode/skills/system-deep-loop/shared/rollout/tests/resolve-injection-mode.test.cjs
node .opencode/skills/system-deep-loop/shared/rollout/tests/validate-rollout.test.cjs
```

Expected: both commands exit 0; the resolver reports 9 assertions and the validator reports 12 assertions.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../resolve-injection-mode.cjs`](../resolve-injection-mode.cjs)
