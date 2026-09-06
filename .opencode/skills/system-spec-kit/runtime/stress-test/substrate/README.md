---
title: "Substrate Stress Tests"
description: "Vitest gate for pure-logic substrate stress coverage under runtime/stress-test."
trigger_phrases:
  - "substrate stress"
  - "vitest substrate gate"
---

# Substrate Stress Tests

## 1. OVERVIEW

`stress-test/substrate/` holds pure-logic stress coverage: cases that put the package's validation rules under volume without spawning a process or opening a database. Keeping them pure is deliberate: process startup adds noise that swamps the signal these cases exist to produce.

---

## 2. SCOPE

| File | Coverage |
|---|---|
| `v-rule-save-flood-stress.vitest.ts` | Cross-spec contamination rules under a 50-save canonical-doc flood, driven against `extractSpecIdCandidates()` and `validateMemoryQualityContent()` from `../../cli/lib/validate-memory-quality`. Each case builds its own temp root and removes it in `afterEach`. |

---

## 3. RUN RECIPE

Run the substrate gate from `.opencode/skills/system-spec-kit/runtime`:

```bash
npx vitest run --config vitest.stress.config.ts stress-test/substrate
```

Run a single case:

```bash
npx vitest run --config vitest.stress.config.ts \
  stress-test/substrate/v-rule-save-flood-stress.vitest.ts
```

---

## 4. ISOLATION BOUNDARY

These cases are pure logic over temporary directories. They open no socket, spawn no child process, and read no state outside the temp root each case creates. Every temp root is tracked and removed in `afterEach`, so a failed assertion cannot leave a sandbox behind.

A case that needs a real process or a real database does not belong in this folder.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../tests/README.md`](../../tests/README.md)
