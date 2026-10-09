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

`runtime/cli/test-fixtures/` contains positive and negative spec folder examples
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

- Runtime JSON fixtures live under `runtime/tests/fixtures/`.
- Runtime test orchestration lives under `../tests/`.
- Production templates live under `../../templates/`.

---

## 3. PACKAGE TOPOLOGY

As of this revision, the tree contains 74 fixture directories numbered 001 through 080.
Numbers 027, 029, 049, 052, 059, 060 and 067 have no directory, and 073 has two.
The highest-numbered fixture is `080-anchors-duplicate-closer`.

```text
runtime/cli/test-fixtures/
+-- 001-empty-folder/              # Invalid empty packet
+-- 002-valid-level1/              # Level 1 baseline
+-- 003-valid-level2/              # Level 2 baseline
+-- 004-valid-level3/              # Level 3 baseline
+-- 005-unfilled-placeholders/
+-- 006-missing-required-files/
+-- 007-valid-anchors/
+-- 008-invalid-anchors/
+-- 009-valid-priority-tags/
+-- 010-valid-evidence/
+-- 011-anchors-duplicate-ids/
+-- 012-anchors-empty-memory/
+-- 013-anchors-multiple-files/
+-- 014-anchors-nested/
+-- 015-anchors-no-memory/
+-- 016-evidence-all-patterns/
+-- 017-evidence-case-variations/
+-- 018-evidence-checkmark-formats/
+-- 019-evidence-p2-exempt/
+-- 020-evidence-wrong-suffix/
+-- 021-invalid-priority-tags/
+-- 022-level-explicit/
+-- 023-level-inferred/
+-- 024-level-no-bold/
+-- 025-level-out-of-range/
+-- 026-level-zero/
+-- 028-level3-missing-decision/
+-- 030-missing-decision-sections/
+-- 031-missing-evidence/
+-- 032-missing-plan/
+-- 033-missing-plan-sections/
+-- 034-missing-spec-sections/
+-- 035-missing-tasks/
+-- 036-multiple-placeholders/
+-- 037-placeholder-case-variations/
+-- 038-placeholder-in-codeblock/
+-- 039-placeholder-in-inline-code/
+-- 040-priority-context-reset/
+-- 041-priority-inline-tags/
+-- 042-priority-lowercase/
+-- 043-priority-mixed-format/
+-- 044-priority-p3-invalid/
+-- 045-valid-sections/
+-- 046-with-config/
+-- 047-with-extra-files/
+-- 048-with-memory-placeholders/
+-- 050-with-scratch/
+-- 051-with-templates/
+-- 053-template-compliant-level2/
+-- 054-template-extra-header/
+-- 055-template-missing-header/
+-- 056-template-reordered-header/
+-- 057-template-missing-anchor/
+-- 058-template-reordered-anchor/
+-- 061-template-optional-absent/
+-- 062-template-compliant-level1/
+-- 063-template-compliant-level3/
+-- 064-link-formats/
+-- 065-evidence-strict-marker/
+-- 066-template-header-drift-mid/
+-- 068-review-record-valid/
+-- 069-review-record-missing-report/
+-- 070-comment-hygiene-marker/
+-- 071-comment-hygiene-marker-violation/
+-- 072-scaffold-never-touched-violation/
+-- 073-scaffold-never-touched-clean/
+-- 073-template-provenance-title/
+-- 074-evidence-unindented-prose/
+-- 075-evidence-indented-continuation/
+-- 076-evidence-short-deferred/
+-- 077-status-drift/
+-- 078-anchors-nested-questions/
+-- 079-anchors-adr-allowance/
+-- 080-anchors-duplicate-closer/
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
| Levels | `022-level-explicit`, `025-level-out-of-range` |

---

## 4. ENTRYPOINTS

Run from the repository root:

```bash
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors
bash .opencode/skills/system-spec-kit/runtime/cli/tests/test-validation.sh
```

Use a single fixture when debugging one rule. Use `test-validation.sh` after
changing validation behavior.

---

## 5. VALIDATION

Use repository-root commands:

```bash
bash .opencode/skills/system-spec-kit/runtime/cli/tests/test-validation.sh
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1 --strict
```

Expected behavior: the full fixture suite reports the configured pass/fail
expectation for every fixture, and valid baseline fixtures pass strict
validation.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../../references/validation/validation-rules.md`](../../../references/validation/validation-rules.md)
