---
title: "Description Fixtures: Spec Folder Description Test Data"
description: "Test fixtures for description.json repair and merge logic, providing mock spec folder descriptions from real Phase 017 project packets."
trigger_phrases:
  - "description fixtures"
  - "description json repair"
  - "spec folder description test data"
  - "mergePreserveRepair fixtures"
---

# Description Fixtures: Spec Folder Description Test Data

> Fixture-only directory that provides mock `description.json` payloads for testing the description repair and merge system against real-world spec folder metadata structures.

---

## 1. OVERVIEW

`tests/description/fixtures/` owns mock `description.json` payloads for the description repair and merge system. The fixtures represent real spec folder descriptions from Phase 017 of the system-spec-kit project, enabling comprehensive testing of `mergePreserveRepair` logic.

Current state:

- 3 JSON files provide the full fixture surface. No subdirectories or executable code exist.
- `017-001-infrastructure-primitives.description.json` represents a Wave A child packet with atomic ship groups and critical path tasks.
- `017-002-cluster-consumers.description.json` represents a Wave B child packet with parallel lane execution and wave scope metadata.
- `017-review-findings-remediation.description.json` represents the parent review findings remediation charter with parent-level description structure.
- Each fixture matches the `PerFolderDescription` interface with `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug` and `parentChain` fields.
- The consumer test `tests/description/repair-specimens.vitest.ts` loads fixtures through a `readFixture()` helper to validate discriminated loading, schema validation, merge safety and edge cases.
- Fixture filenames follow the pattern `{phase}-{specId}-{folderSlug}.description.json`.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `017-001-infrastructure-primitives.description.json` | Wave A child packet description with atomic ship groups and critical path task metadata. |
| `017-002-cluster-consumers.description.json` | Wave B child packet description with parallel lane execution and wave scope metadata. |
| `017-review-findings-remediation.description.json` | Parent-level review findings remediation charter with parent chain and remediation task organization. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `017-001-infrastructure-primitives.description.json` | Fixture | Child packet description loaded by `tests/description/repair-specimens.vitest.ts` for merge and repair testing. |
| `017-002-cluster-consumers.description.json` | Fixture | Child packet description loaded by `tests/description/repair-specimens.vitest.ts` for merge and repair testing. |
| `017-review-findings-remediation.description.json` | Fixture | Parent packet description loaded by `tests/description/repair-specimens.vitest.ts` for parent-level structure testing. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/description/repair-specimens.vitest.ts
```

Expected result: exit code 0, all 6 tests pass.

---

## 5. RELATED

- [Parent: Description Tests](../README.md)
- [Tests: tests/](../../README.md)
- [Skill README](../../../README.md)
