---
description: Status-report command fixture doc carrying a real non-sequential heading-number warning.
argument-hint: [--format json|text]
allowed-tools: Read
---

# Status Report

A command-shaped fixture doc whose two required sections are both present — no `missing_required_section` finding here — but whose H2 numbering skips a number on purpose, to seed a real P1 warning distinct from this corpus's two P0 gaps.

---

## 1. PURPOSE

Report a lane's current status: how many artifacts were discovered, how many findings are open at each severity, and whether the lane has converged to a clean pass.

---

## 3. INSTRUCTIONS

Read the emitted `alignment-report.md`'s per-lane section for the authority in question. The numbering above skips `2.` on purpose — both required sections are present and correctly named, so the only defect a structural check should surface here is the numbering gap itself, not a missing section.

```text
## Lane: sk-doc / docs
P0:0 P1:0 P2:0
```
