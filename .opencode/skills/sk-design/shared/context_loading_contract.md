---
title: Design Context Loading Contract
description: Shared sk-design contract for register-first loading, build bundles, context manifests, proof fields, and claim gates.
trigger_phrases:
  - "design context loading"
  - "context loaded card"
  - "proof of application card"
  - "sk-design context manifest"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Design Context Loading Contract

This file is shared vocabulary, not a workflow and not a sixth mode. The mode packets still own craft: `../design-interface/SKILL.md` owns interface direction and pre-flight, `../design-foundations/SKILL.md` owns static systems and contrast, and `../design-audit/SKILL.md` plus `../design-audit/references/audit_contract.md` own evidence-backed audit claims.

---

## 1. OVERVIEW - REGISTER-FIRST GATE

`register.md` is the first read for any design or UI work. Set `Brand` or `Product` before palette, layout, motion, copy, severity, or implementation handoff decisions. The register is the shared posture; mode files decide how to apply it.

Required first files:

- `register.md`
- `../design-interface/references/design-process/brief_to_dials.md`

---

## 2. BUNDLE RULE FOR BUILD WORK

For narrow advice, the parent hub's smallest-useful-mode rule still applies. For work that builds, redesigns, generates, or evaluates a UI surface, the smallest useful bundle is larger than one mode:

- `interface` for direction, surface read, and pre-flight.
- `foundations` for palette, type, layout, responsive, token, and contrast decisions.
- `register.md` plus `../design-interface/references/design-process/brief_to_dials.md` for register and dials.
- `../design-interface/assets/interface_preflight_card.md` before delivery.
- Matching `foundations` axis references when color, type, layout, data, responsive, or token work is in scope.
- `../design-audit/references/audit_contract.md`, `../design-audit/references/accessibility_performance.md`, `../design-audit/references/evidence_capture.md`, and `../design-audit/assets/audit_evidence_worksheet.md` before audit, score, accessibility, release-ready, or production-ready claims.

---

## 3. CONTEXT MANIFEST

Before dispatching an agent or making a design/build decision, name the loaded files in a context manifest. The manifest is proof of context, not a summary.

Minimum manifest fields:

```text
SURFACE:
TASK TYPE: advice | build | redesign | generation | audit | dispatch
REGISTER SOURCE: register.md loaded | not loaded
DIAL SOURCE: brief_to_dials.md loaded | not loaded
MODE BUNDLE LOADED:
- interface:
- foundations:
- audit:
CONDITIONAL FILES LOADED:
- foundations contrast/color refs:
- interface pre-flight card:
- audit evidence refs:
```

No palette, layout, motion, copy, accessibility, score, release, or readiness claim passes until the files behind the claim are named as loaded.

---

## 4. REQUIRED PROOF FIELDS

Use these exact field names and shapes in parent sessions, delegated prompts, child responses, and final proof cards when the corresponding gate applies. The fill-in cards `assets/context_loaded_card.md` (pre-work) and `assets/proof_of_application_card.md` (end-of-work) operationalize these fields.

### Register And Dials

```text
REGISTER: Brand | Product
WHY: task cue | surface in focus | declared register
DIALS: VARIANCE n / MOTION n / DENSITY n
DOWNSTREAM EFFECT: density, motion budget, color dosage, copy register, anti-slop strictness, audit severity
```

### Contrast Pairs

```text
CONTRAST PAIRS:
- foreground token/value:
  background token/value:
  surface:
  target: WCAG AA 4.5:1 body or 3:1 large/UI
  result: pass | fail | not assessed
  fix if fail:
```

`foundations` owns the contrast repair logic; use actual foreground/background pairs and adjust OKLCH lightness first when repairing. Compute each ratio with `../design-foundations/scripts/contrast_check.py` (a calculator, not an estimate); `result` is `fail` for any pair below 4.5:1 body unless the 3:1 large/UI target applies.

### Interface Preflight

```text
INTERFACE PREFLIGHT:
surface:
section count:
narrowest tested width:
hero: pass | fail
grid/bento: pass | fail | N/A
eyebrow/meta: pass | fail
button/form contrast: pass | fail
breakpoint overflow: pass | fail
real imagery: pass | fail | N/A
copy audit: pass | fail
motion/reduced-motion: pass | fail | N/A
AI-tell sweep: pass | fail
verdict: SHIP | FIX
```

`interface` owns the detailed binary card. A single failed applicable box means the UI surface is not ready.

### Audit Evidence

```text
AUDIT EVIDENCE:
target:
source code: confirmed | not-assessed
rendered UI: confirmed | inferred | not-assessed
design artifact: confirmed | inferred | not-assessed
deterministic scan: confirmed | not-assessed
dimensions:
  accessibility:
  performance:
  responsive:
  theming:
  anti-patterns:
```

`audit` owns severity, scoring, labels, and finding order. Use `../design-audit/assets/audit_evidence_worksheet.md` to carry confirmed, inferred, and not-assessed labels into findings and scores.

---

## 5. HARD GATES

| Gate | Blocks |
|---|---|
| Context Loaded | Any design decision before required files are named as loaded |
| Register/Dials | Any palette, layout, motion or copy decision before register and dials |
| Foundations Contrast | Any UI build with changed foreground/background pairs |
| Interface Pre-Flight | Any "done", "ready", "ship", "looks good" delivery claim |
| Audit Evidence | Any audit, score, accessibility or release-readiness claim |
| Dispatch Profile | Any small-model delegation where a profile exists |
| Adoption | Any canonical skill change from lineage findings |

---

## 6. ADOPT-IF-BETTER

Fan-out or delegated recommendations are candidates until merged, attributed, and gated. Before adopting a lineage recommendation into canonical skill files, use the promotion discipline in `../../deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md`: score the candidate, validate it against fixtures or miss cases, check repeatability, respect the manifest boundary, and require explicit operator approval.
