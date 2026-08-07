---
round: 1
seat: seat-003
executor: pragmatic
lens: Pragmatic
status: ok
timestamp: "2026-05-09T19:42:00Z"
simulated: true
---

# Seat 003 — Pragmatic Analysis

## Proposed Plan

Implementation-first analysis. Key findings:
- **All fixes fit existing phases** — zero new phases required.
- **Issues 1+5+3 combine** into single Phase 1 detection block (~25 lines YAML + bash).
- **Total blast radius: ~65 lines** across 2 files (doctor_update.yaml + migration-manifest.json).
- **`.doctor-update.config-instructions` file** as safe alternative to config auto-editing.

## Severity Classification

| Issue | Severity | Lines | Files Touched | Phase |
|-------|----------|-------|---------------|-------|
| 1 (rename) | P0 | ~15 bash + 3 YAML | doctor_update.yaml, .doctor-update.* | Phase 1 |
| 2 (build) | P1 | ~8 YAML | doctor_update.yaml | Phase 1 |
| 3 (placeholder) | P1 | ~5 bash + 1 YAML | doctor_update.yaml | Phase 1 |
| 4 (snapshot order) | P2 | 1-3 bash | doctor_update.yaml | Phase 3 |
| 5 (forbidden configs) | P0 (combined with 1) | Same as 1 | Same as 1 | Phase 1 |
| 6 (cocoindex) | P1 | 1 YAML step | doctor_update.yaml | Phase 8 |
| 7 (manifest) | P1 | ~30-50 JSON | migration-manifest.json | N/A (dev prereq) |

## Implementation Order
```
[7] Complete manifest → [2] Build preflight → [1+5+3] Config+detection → [6] CocoIndex → [4] Timestamps
```

## Constraints Violation Audit
Only real constraint conflict: Issues 1+5. Resolution: instruction file + manual step. Auto-edit capability would require widening mutation boundaries — flagged but not proposed as pragmatic path.

## Confidence: 85/100
High confidence on fix feasibility and phase placement. 15% uncertainty on exact YAML syntax and ccc_reindex idempotency.
