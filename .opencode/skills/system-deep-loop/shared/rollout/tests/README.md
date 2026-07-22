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
| `resolve-injection-mode.test.cjs` | Three assertions run against a temporary config file: default fallback with an empty mode map, a JSON map override per command and `SPECKIT_COMMAND_INJECTION_MODE` env override taking precedence over the JSON map. |

## 3. VALIDATION

```bash
node .opencode/skills/system-deep-loop/shared/rollout/tests/resolve-injection-mode.test.cjs
```

Expected: `[command-injection-rollout] resolve-injection-mode tests passed`.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../resolve-injection-mode.cjs`](../resolve-injection-mode.cjs)
