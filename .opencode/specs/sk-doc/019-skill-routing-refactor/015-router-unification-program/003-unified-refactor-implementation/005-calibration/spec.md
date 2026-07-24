---
title: "Feature Specification: Calibration (Idea 5) — Phase Parent"
description: "Phase parent integrating Idea 5 (calibrated negotiation) into the unified router refactor as a first-class build — NOT deferred. Three children: build the sealed held-out routing corpus (the artifact whose absence made the synthesis park calibration), specify the rank-vs-calibrated route contract (rankScore/scoreMargin always, estimatedError only with a validated certificate), and build the selective-classification controller that auto-routes under a validated risk budget else clarifies/defers. Every calibrated claim binds to a corpus id; no fleet-wide threshold constant; the shared scorer is never touched."
trigger_phrases:
  - "calibration phase parent"
  - "integrate idea 5 calibrated negotiation"
  - "held-out routing corpus"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: heavy docs (plan/tasks/checklist belong in children); migration-history narratives.
  REQUIRED: root purpose; the three-child map.
-->

# Calibration (Idea 5) — Phase Parent

## EXECUTIVE SUMMARY

Integrate **Idea 5 (calibrated negotiation)** into the unified refactor as a real capability. The council synthesis kept Idea 5's *ranking* but deferred *calibration* for lack of a held-out corpus; this phase parent removes that blocker by building the corpus first, then shipping calibrated auto-routing on top of it. The route contract keeps `rankScore`/`scoreMargin` always present and admits an `estimatedError` probability ONLY when a validation certificate names a corpus, method, policy hash, and window. The controller auto-routes only under a validated risk budget; otherwise it clarifies once, then defers/rejects. Nothing here edits the shared scorer, and no threshold ships as a fleet-wide constant.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus |
|-------|--------|-------|
| 1 | 001-holdout-corpus/ | The sealed, hash-pinned, per-hub / per-risk-slice held-out routing corpus: intent-derived labels, coverage, offline+live gates, privacy governance. The artifact every later calibration claim binds to. |
| 2 | 002-rank-vs-calibrated-contract/ | The contract separating always-present `rankScore`/`scoreMargin` from an optional `estimatedError` legal only under a validated certificate (corpus id + method + policy hash + window). |
| 3 | 003-selective-controller/ | The selective-classification controller: auto-route under a validated risk budget, else one clarify (ladder rung 3), else defer/reject; friction budget as replay assertions; promotion metrics measured on the corpus. |

### Sequencing
001 → 002 → 003 (the corpus gates the contract; the certificate gates the controller). This phase satisfies migration Stage 3 (shadow-evaluate parity for calibrated paths) and unblocks the Stage-4 canary's calibrated auto-route.

## RELATED DOCUMENTS
- **Design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (Idea 5, §8.1)
- **Parent Spec**: `../spec.md`
