
# Test Fixtures for SpecKit Validation

This directory contains test fixtures for validating the SpecKit validation scripts.


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


## 4. 📋 FILE REQUIREMENTS

| Level | Required Files |
|-------|----------------|
| 1 | spec.md, plan.md, tasks.md |
| 2 | Level 1 + checklist.md |
| 3 | Level 2 + decision-record.md |


## 6. 🔗 RELATED RESOURCES

- **Validation Script**: `../validate-spec.sh`
- **Test Runner**: `../test-validation.sh`
- **SpecKit SKILL.md**: `../../SKILL.md`
- **Templates**: `../../templates/`
