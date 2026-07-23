---
title: "Lib Test Helpers: Env Snapshot Utility"
description: "Test-only helper for the skill-advisor mcp-server lib, not product code."
---

# Lib Test Helpers: Env Snapshot Utility

---

## 1. OVERVIEW

`lib/test-helpers/` is a test-only helper folder inside the skill-advisor `mcp-server/lib/` package. Nothing in `lib/` or the advisor runtime depends on it. It exists so tests that mutate `process.env` can capture and restore the exact keys they touched.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `env-snapshot.ts` | Exports `snapshotEnv(keys)`, which captures the current value of each given `process.env` key and returns a `restore()` function that re-sets or deletes each key back to its captured state. |

## 3. CONSUMERS

- `.opencode/skills/system-skill-advisor/mcp-server/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`

## 4. RELATED

- [`../README.md`](../README.md)
