---
title: "D3-R12 — Dispatch-boundary child proof"
description: "Add a DESIGN_BOUNDARY_PROOF v1 envelope + requiresDesignBoundaryProof fixture, one shared design_dispatch_boundary.md asset, and a CLI template-parity checker."
trigger_phrases:
  - "d3-r12 dispatch boundary proof"
  - "design boundary proof design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R12 — Dispatch-boundary child proof

## 1. OBJECTIVE
Add a `DESIGN_BOUNDARY_PROOF v1` envelope plus a `requiresDesignBoundaryProof` fixture, backed by one shared `design_dispatch_boundary.md` asset and a CLI template-parity checker that keeps every copy of the asset identical.

## 2. WHY
Dispatch across the design-interface boundary has no machine-checkable proof that a child honored the design contract, and a duplicated asset can drift. A boundary-proof envelope plus a parity checker makes both enforceable.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/design-interface/SKILL.md`; new shared `design_dispatch_boundary.md` asset (+ CLI parity checker)
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Define the `DESIGN_BOUNDARY_PROOF v1` envelope and a `requiresDesignBoundaryProof` fixture.
- Author one shared `design_dispatch_boundary.md` asset.
- Add a CLI template-parity checker over the asset copies.

## 5. ACCEPTANCE
- The fixture asserting `requiresDesignBoundaryProof` fails closed on a missing/mismatched envelope, and the CLI parity checker fails when one copy of `design_dispatch_boundary.md` drifts (envelope presence enforceable; applied quality advisory).

## 6. EVIDENCE
- `design-interface/SKILL.md:258` — dispatch-boundary region the proof envelope attaches to.
- Source: `research/research.md` §6 (D3-R12).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
