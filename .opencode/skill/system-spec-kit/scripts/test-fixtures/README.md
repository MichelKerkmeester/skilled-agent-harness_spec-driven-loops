---
title: Test Fixtures
description: Validation test fixtures for SpecKit validation scripts
---

# Test Fixtures for SpecKit Validation

This directory contains test fixtures for validating the SpecKit validation scripts.

---

## 1. 📖 OVERVIEW

| Fixture | Expected Result | Tests |
|---------|-----------------|-------|
| `valid-level1/` | PASS | Minimal valid Level 1 spec (spec.md, plan.md, tasks.md) |
| `valid-level2/` | PASS | Valid Level 2 spec (Level 1 + checklist.md) |
| `valid-level3/` | PASS | Valid Level 3 spec (Level 2 + decision-record.md) |
| `empty-folder/` | FAIL | No required files (FILE_EXISTS) |
| `missing-required-files/` | FAIL | Missing spec.md (FILE_EXISTS) |
| `unfilled-placeholders/` | FAIL | Contains `[YOUR_VALUE_HERE:]`, `[NEEDS CLARIFICATION:]`, `{{mustache}}` (PLACEHOLDER_FILLED) |
| `invalid-anchors/` | FAIL | Unclosed `<!-- ANCHOR:id -->` tags (ANCHORS_VALID) |
| `valid-anchors/` | PASS | Properly matched anchor pairs |
| `valid-priority-tags/` | PASS | P0/P1/P2 headers and inline `[P0]` tags (PRIORITY_TAGS) |
| `valid-evidence/` | PASS | `[EVIDENCE:]`, `(verified)`, checkmarks (EVIDENCE_CITED) |

---

## 2. 🚀 USAGE

Run validation against a fixture:

```bash
./validate-spec.sh test-fixtures/valid-level1
./validate-spec.sh test-fixtures/empty-folder
```

Run all fixtures with expected results:

```bash
./test-validation.sh
```

---

## 3. ✅ VALIDATION RULES

| Rule | Severity | Tested By |
|------|----------|-----------|
| FILE_EXISTS | error | `empty-folder/`, `missing-required-files/`, `valid-level1/2/3/` |
| PLACEHOLDER_FILLED | error | `unfilled-placeholders/` |
| SECTIONS_PRESENT | warn | `valid-level1/2/3/` |
| LEVEL_DECLARED | info | All `valid-*` fixtures |
| PRIORITY_TAGS | warn | `valid-priority-tags/` |
| EVIDENCE_CITED | warn | `valid-evidence/` |
| ANCHORS_VALID | error | `invalid-anchors/`, `valid-anchors/` |

---

## 4. 📋 FILE REQUIREMENTS

| Level | Required Files |
|-------|----------------|
| 1 | spec.md, plan.md, tasks.md |
| 2 | Level 1 + checklist.md |
| 3 | Level 2 + decision-record.md |

---

## 5. ➕ CREATING FIXTURES

1. Create a new directory under `test-fixtures/`
2. Add required files based on the level being tested
3. Include the `Level` field in spec.md metadata table
4. Update this README with the new fixture

---

## 6. 🔗 RELATED RESOURCES

- **Validation Script**: `../validate-spec.sh`
- **Test Runner**: `../test-validation.sh`
- **SpecKit SKILL.md**: `../../SKILL.md`
- **Templates**: `../../templates/`
