---
title: "Command Injection Rollout"
description: "The isolated rollout-mode core for command injection in the deep-loop runtime."
trigger_phrases:
  - "command injection rollout"
  - "rollout mode"
version: 1.0.2.0
---

# Command Injection Rollout

---

## 1. OVERVIEW

This directory contains the isolated rollout-mode core for command injection.

- `command-injection-rollout.json` maps command names to `fallback` or `fix`.
- `resolve-injection-mode.cjs` resolves the effective mode from the environment override first, then the JSON map, then `fallback`.
- `promotion-rule.md` defines the evidence required before flipping any command to `fix`.
- `validate-rollout.cjs` rejects any `fix` entry that is missing required evidence, and is the script to run before promotion.

The [`tests/`](./tests/README.md) folder pins this behavior with two test files, which assert resolver precedence across the default, the JSON map and the environment override, and check that the rollout and its `fix` entries carry the evidence `validate-rollout.cjs` requires.

---

## 2. DEFERRED SCOPE

- Manifest capture: add emitter wiring later to capture fallback/fix manifests and fallback hashes from the live command-injection path.
- Comparator: add the CI comparator later after capture data exists; do not stub fake capture or synthetic comparator logic here.
