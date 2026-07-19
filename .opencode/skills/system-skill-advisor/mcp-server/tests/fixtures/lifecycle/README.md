---
title: "Lifecycle Fixtures: Advisor Metadata Test Data"
description: "Test fixtures for lifecycle metadata scenarios covering superseded, successor, archived, future, rolled back and mixed version skill states."
trigger_phrases:
  - "lifecycle fixtures"
  - "lifecycleFixtures"
  - "advisor lifecycle test data"
---

# Lifecycle Fixtures: Advisor Metadata Test Data

> Single-file fixture module that exports lifecycle metadata shapes for advisor routing and lifecycle test coverage.

---

## 1. OVERVIEW

`tests/fixtures/lifecycle/` owns the `lifecycleFixtures` const that provides test data for lifecycle metadata handling in the skill-advisor codebase. The fixtures cover skill states that affect routing decisions: deprecated skills with redirect metadata, active successors, archived skills, future skills, rolled back schema versions and mixed schema version arrays.

Current state:

- `index.ts` is the only file. It exports `lifecycleFixtures` as a readonly object with six fixture groups.
- Lifecycle status values are `deprecated`, `active`, `archived` or `future`. The rolled back fixture uses schema version 1 format without a derived block. Mixed version fixtures contain arrays with varying `schema_version` values.
- Superseded fixtures include `redirectTo` metadata for routing redirects. Archived fixtures reference `z_archive` directory paths and future fixtures reference `z_future` directory paths.
- Two test suites consume these fixtures: `lifecycle-derived-metadata.vitest.ts` in the parent tests directory and `native-scorer.vitest.ts` in the scorer directory.
- The fixture module has no imports beyond its own definition. It exports static data only.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Exports `lifecycleFixtures` with superseded, successor, archived, future, rolled back and mixed version fixture groups. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `lifecycleFixtures` | const | Readonly object with lifecycle metadata fixtures for deprecation, archival, future state and version mixing scenarios. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-skill-advisor/mcp-server && npm test -- tests/lifecycle-derived-metadata.vitest.ts
```

Expected result: exit code 0.

---

## 5. RELATED

- [Parent: Fixtures](../README.md)
- [Tests: tests/](../../README.md)
- [Scorer Fixtures](../../scorer/fixtures/README.md)
