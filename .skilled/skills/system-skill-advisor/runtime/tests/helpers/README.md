---
title: "Test Helpers: Env Snapshot Utility"
description: "Test-only helper for the skill-advisor runtime tests, not product code."
---

# Test Helpers: Env Snapshot Utility

---

## 1. OVERVIEW

`tests/helpers/` holds test-only helpers for the skill-advisor runtime. No product code depends on it, and the production build excludes `tests/`. It exists so tests that mutate `process.env` can capture and restore the exact keys they touched.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `env-snapshot.ts` | Exports `snapshotEnv(keys)`, which captures the current value of each given `process.env` key and returns a `restore()` function that re-sets or deletes each key back to its captured state. |

---

## 3. CONSUMERS

- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`

---

## 4. RELATED

- [`../README.md`](../README.md)
