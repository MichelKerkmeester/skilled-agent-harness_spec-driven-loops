---
title: "D3-R10 — Application-witness (loaded-determinative)"
description: "Add an APPLICATION WITNESS section to the application proof card and a proof_check.py flag classifying not-loaded/loaded-inert/loaded-determinative."
trigger_phrases:
  - "d3-r10 application witness"
  - "loaded determinative witness design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R10 — Application-witness (loaded-determinative)

## 1. OBJECTIVE
Add an `APPLICATION WITNESS` section to the application proof card and `proof_check.py --require-application-witness`, classifying each loaded rule as `not-loaded`, `loaded-inert`, or `loaded-determinative` (a cited rule changed one named output choice).

## 2. WHY
Loading a file proves nothing about use. The witness raises the floor from "loaded" to "loaded had an observable effect on one output choice", so a missing witness blocks a ready-claim — while still never claiming the design is tasteful.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`, `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add an `APPLICATION WITNESS` section to the proof card capturing the cited rule + the named output choice it changed.
- Implement `proof_check.py --require-application-witness`.
- Classify each entry not-loaded / loaded-inert / loaded-determinative; block ready-claims lacking a determinative witness.

## 5. ACCEPTANCE
- `proof_check.py --require-application-witness` fails a ready-claim with no `loaded-determinative` witness and passes one citing a rule that changed a named output choice (presence enforceable; quality stays advisory).

## 6. EVIDENCE
- `proof_of_application_card.md:15` — card region where the witness section attaches.
- Source: `research/research.md` §6 (D3-R10).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
