---
title: "137 -- Multi-feature annotation coverage"
description: "This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2."
---

# 137 -- Multi-feature annotation coverage

## 1. OVERVIEW

This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2.

---

## 2. SCENARIO CONTRACT


- Objective: Verify known multi-feature files have annotation count >= 2.
- Real user request: `Please validate Multi-feature annotation coverage against handlers/memory-save.ts and tell me whether the expected signals are present: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate.`
- Prompt: `Validate Multi-feature annotation coverage against handlers/memory-save.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features

---

## 3. TEST EXECUTION

### Prompt

```
Validate Multi-feature annotation coverage against handlers/memory-save.ts and report cited pass/fail evidence.
```

### Commands

1. Identify files known to implement 2+ features (e.g., `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-delete.ts`)
2. For each: count `// Feature catalog:` lines
3. Verify count >= 2 for each multi-feature file
4. Spot-check that listed features are semantically correct for the file's implementation

### Expected

All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate

### Evidence

File list with annotation counts + sample content verification

### Pass / Fail

- **Pass**: all checked multi-feature files have >= 2 annotations and no obviously-missing features
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Review file implementation scope → Compare against catalog feature boundaries → Add missing annotations

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/214-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 137
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/233-multi-feature-annotation-coverage.md`
