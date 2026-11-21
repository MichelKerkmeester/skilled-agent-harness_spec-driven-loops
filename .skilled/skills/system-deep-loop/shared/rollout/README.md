---
title: "Command Injection Rollout"
description: "The isolated rollout-mode core for command injection in the deep-loop runtime."
trigger_phrases:
  - "command injection rollout"
  - "rollout mode"
version: 1.0.4.0
---

# Command Injection Rollout

---

## 1. OVERVIEW

This directory contains the isolated rollout-mode core for command injection. The resolver reads the environment override first, then the JSON map, then falls back to `fallback`. A missing JSON map counts as an empty one. A map that exists but cannot be read, is not valid JSON or does not hold an object makes the resolver throw, so a typo never silently resolves every command to `fallback`.

The [`tests/`](./tests/README.md) folder pins this behavior with two test files, which assert resolver precedence across the default, the JSON map and the environment override, and check that the rollout and its `fix` entries carry the evidence `validate-rollout.cjs` requires.

---

## 2. CONTENTS

```text
rollout/
+-- command-injection-rollout.json   # Command name to fallback or fix map
+-- promotion-rule.md                # Evidence required before a fix promotion
+-- resolve-injection-mode.cjs       # Effective-mode resolver
+-- validate-rollout.cjs             # Evidence validator run before promotion
+-- tests/                           # Resolver and validator tests
`-- README.md
```

| File | Responsibility |
|---|---|
| `command-injection-rollout.json` | Maps command names to `fallback` or `fix`. |
| `promotion-rule.md` | Defines the evidence required before flipping any command to `fix`. |
| `resolve-injection-mode.cjs` | Resolves the effective mode from the environment override first, then the JSON map, then `fallback`. Throws on an unreadable or malformed map. |
| `validate-rollout.cjs` | Rejects any `fix` entry that is missing required evidence. Run it before promotion. |
| `tests/` | Pins resolver precedence and the evidence rules. See [`tests/README.md`](tests/README.md). |

---

## 3. VALIDATION

Run from the repository root.

```bash
node .skilled/skills/system-deep-loop/shared/rollout/validate-rollout.cjs
node .skilled/skills/system-deep-loop/shared/rollout/tests/resolve-injection-mode.test.cjs
node .skilled/skills/system-deep-loop/shared/rollout/tests/validate-rollout.test.cjs
```

Expected: the validator prints `[command-injection-rollout] evidence validation passed: <path>`, and the test files print `resolve-injection-mode tests passed (12 assertions)` and `validate-rollout tests passed (12 assertions)` after the `[command-injection-rollout]` prefix.

---

## 4. DEFERRED SCOPE

- Manifest capture: add emitter wiring later to capture fallback/fix manifests and fallback hashes from the live command-injection path.
- Comparator: add the CI comparator later after capture data exists; do not stub fake capture or synthetic comparator logic here.
