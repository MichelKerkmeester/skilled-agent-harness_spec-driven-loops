---
title: "D1-R13 — Already-adopted laws → guard against duplicate re-port"
description: "Add duplicate-detection to the docs benchmark so it fails on redundant mode-local restatements of timing/color/layout/type defaults and forces references to owners."
trigger_phrases:
  - "d1-r13 duplicate law detection"
  - "duplicate law detection design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R13 — Already-adopted laws → guard against duplicate re-port

## 1. OBJECTIVE
Add a duplicate-detection check to the docs benchmark so already-adopted laws are referenced from their owner instead of being re-copied into mode-local docs.

## 2. WHY
Already-adopted laws can be re-ported as mode-local copies, so timing/color/layout/type defaults drift between duplicates.

## 3. TARGET & CLASS
- **Target file(s):** docs benchmark (duplicate-detection check)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add duplicate-detection to the docs benchmark.
- Fail on redundant mode-local restatements of timing/color/layout/type defaults.
- Require references to owners, not copies.

## 5. ACCEPTANCE
- Docs benchmark fails when a mode-local doc restates an owned default instead of referencing its owner (deterministic).

## 6. EVIDENCE
- `design-interface/.../mechanical_defaults.md:45` — a mode-local restatement of defaults already owned elsewhere.
- Source: `research/research.md` §4 (D1-R13)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
