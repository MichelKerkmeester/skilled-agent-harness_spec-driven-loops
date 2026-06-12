---
title: "Validation Test Fixtures"
description: "Spec folder fixtures used to validate structure, anchors, priorities, evidence rules and edge cases."
trigger_phrases:
  - "test fixtures"
  - "validation fixtures"
  - "spec folder test scenarios"
---

<!-- markdownlint-disable MD025 -->

# Validation Test Fixtures

---

## 1. OVERVIEW

`scripts/test-fixtures/` contains positive and negative spec folder examples
used by validation tests. Each numbered fixture isolates one behavior so
validation regressions can be traced to a specific rule family.

The fixtures exercise spec folder structure, documentation levels, anchors,
evidence markers, priority tags, placeholders and optional-file handling.

---

## 2. FIXTURE BOUNDARIES

Allowed fixture content:

- Minimal spec-doc packets for validation scenarios.
- Intentional invalid states such as missing files or malformed anchors.
- Unresolved placeholders where a validation rule requires them.
- Memory support examples under fixture-local `memory/` directories.
- Optional files needed to verify path-scoped rules.

Not owned here:

- MCP server JSON fixtures live under `mcp_server/tests/fixtures/`.
- Runtime test orchestration lives under `../tests/`.
- Production templates live under `../../templates/`.

---

## 3. PACKAGE TOPOLOGY

As of this revision, the tree contains 66 numbered fixture directories and
the highest-numbered fixture is `067-checklist-uppercase-x`.

```text
scripts/test-fixtures/
+-- 001-empty-folder/              # Invalid empty packet
+-- 002-valid-level1/              # Level 1 baseline
+-- 003-valid-level2/              # Level 2 baseline
+-- 004-valid-level3/              # Level 3 baseline
+-- 005-006-*                      # Placeholder and structure failures
+-- 007-015-*                      # Anchor and memory support cases
+-- 016-021-*                      # Evidence and priority cases
+-- 022-028-*                      # Level declaration and level file cases
+-- 029-045-*                      # Section, placeholder and priority edge cases
+-- 046-051-*                      # Config, extra file and template cases
+-- 053-067-*                      # Template, link and strict evidence cases
`-- README.md
```

Category map:

| Category | Representative fixtures |
| --- | --- |
| Valid baselines | `002-valid-level1`, `003-valid-level2`, `004-valid-level3` |
| Anchors | `007-valid-anchors`, `008-invalid-anchors` |
| Evidence | `010-valid-evidence`, `031-missing-evidence` |
| Priorities | `009-valid-priority-tags`, `021-invalid-priority-tags` |
| Placeholders | `005-unfilled-placeholders`, `036-multiple-placeholders` |
| Levels | `022-level-explicit`, `027-level2-missing-checklist` |

---

## 4. ENTRYPOINTS

Run from the repository root:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/skills/system-spec-kit/scripts/test-fixtures/002-valid-level1
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors
bash .opencode/skills/system-spec-kit/scripts/tests/test-validation.sh
```

Use a single fixture when debugging one rule. Use `test-validation.sh` after
changing validation behavior.

---

## 5. VALIDATION

Use repository-root commands:

```bash
bash .opencode/skills/system-spec-kit/scripts/tests/test-validation.sh
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/skills/system-spec-kit/scripts/test-fixtures/002-valid-level1 --strict
```

Expected behavior: the full fixture suite reports the configured pass/fail
expectation for every fixture, and valid baseline fixtures pass strict
validation.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../../references/validation/validation_rules.md`](../../references/validation/validation_rules.md)
