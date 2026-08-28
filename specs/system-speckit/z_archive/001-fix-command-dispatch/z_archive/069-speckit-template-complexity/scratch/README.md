# Scratch Folder: Test Outputs and Generated Examples

This folder contains actual outputs from the complexity detection and template expansion systems.

---

---

## 1. OVERVIEW

This README documents the purpose and usage of this spec folder and links to the primary artifacts in this directory.

---

## Directory Structure

```
scratch/
├── detection-outputs/        # JSON outputs from detect-complexity.js
│   ├── level-1-detection.json
│   ├── level-2-detection.json
│   ├── level-3-detection.json
│   └── level-3plus-detection.json
├── template-outputs/         # Expanded templates at each level
│   ├── spec-level-1.md       # Minimal spec template
│   ├── spec-level-2.md       # Standard spec template
│   ├── spec-level-3.md       # Full spec template
│   ├── spec-level-3plus.md   # Extended spec template
│   ├── plan-level-*.md       # Plan templates at each level
│   ├── tasks-level-*.md      # Tasks templates at each level
│   ├── checklist-level-*.md  # Checklist templates (Level 2+)
│   └── decision-record-level-*.md  # Decision record (Level 3+)
└── test-outputs/             # Verbose test run outputs
    ├── full-test-run.txt     # Complete test suite output
    ├── test-detector-output.txt
    ├── test-marker-parser-output.txt
    ├── test-preprocessor-output.txt
    ├── test-classifier-output.txt
    └── test-cli-output.txt
```

---

## Detection Outputs Summary

| Level | Score | Task Description |
|-------|-------|------------------|
| **1** | 0/100 | "Fix typo in README file" |
| **2** | 27/100 | OAuth2 + JWT authentication |
| **3** | 73/100 | Enterprise platform rewrite (200+ files, 10k LOC) |
| **3+** | 83/100 | Enterprise-scale rewrite (500+ files, 50k LOC) |

---

## Template Output Sizes (bytes)

| Template | Level 1 | Level 2 | Level 3 | Level 3+ |
|----------|---------|---------|---------|----------|
| spec.md | 20,326 | 20,862 | 21,171 | 21,171 |
| plan.md | 14,299 | 15,377 | 16,972 | 17,418 |
| tasks.md | 12,630 | 12,630 | 13,749 | 13,749 |
| checklist.md | - | 8,061 | 9,052 | 9,971 |
| decision-record.md | - | - | 9,610 | 9,610 |

---

## Test Results

**Total Tests**: 171 passing, 0 failing

| Suite | Tests |
|-------|-------|
| Complexity Detector | 31 |
| Marker Parser | 49 |
| Template Preprocessor | 26 |
| Classifier & Features | 49 |
| CLI Scripts | 16 |

---

## Viewing Files

```bash
# View detection output
cat detection-outputs/level-3-detection.json | jq .

# View expanded template
cat template-outputs/spec-level-3.md

# View test output
cat test-outputs/full-test-run.txt
```

---

## Generated: 2026-01-16

