---
title: "Feature Specification: Parent-Hub Rollout — Phase Parent"
description: "Phase parent that activates the compiled unified-router contract on the parent hubs one at a time, in increasing blast-radius order: sk-code (evidence composition), then system-deep-loop (shared packet/backend projections), then mcp-tooling (external effects + cross-hub judgment). Each hub is a fenced-CAS canary gated on route-gold staying green, advisor identity matching-or-ignored, document parity, and a proven rollback drill. The shared scorer is never touched; rollback swaps to the byte-identical prior manifest and cannot undo a committed external effect."
trigger_phrases:
  - "parent hub rollout phase parent"
  - "compiled contract per-hub canary"
  - "unified router activation order"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: heavy docs (plan/tasks/checklist belong in children); migration-history narratives.
  REQUIRED: root purpose; the three-child map + activation order.
-->

# Parent-Hub Rollout — Phase Parent

## EXECUTIVE SUMMARY

Activate the compiled contract on the parent hubs, **one hub at a time, in increasing blast-radius order**, after the base machinery (phases 000–004, plus the destination lifecycle in 003) is proven on the `mcp-code-mode` N=1 case. Each hub is a per-hub canary behind the fenced activation selector: legacy stays serving-authoritative until the canary shows zero hard mismatch, advisor identity matches or is ignored, document parity holds, and a rollback drill is proven. Route-gold stays green; the shared scorer is never touched.

## PHASE DOCUMENTATION MAP

| Order | Folder | Hub | Why this blast radius |
|-------|--------|-----|-----------------------|
| 1 | 001-sk-code/ | sk-code | Evidence composition: one acting workflow + N read-only evidence surfaces (`surfaceBundle`); an evidence target can never COMMIT |
| 2 | 002-system-deep-loop/ | system-deep-loop | Shared packet/backend projections: several public modes on one packet with distinct backend/runtime discriminators — identity is the load-bearing risk |
| 3 | 003-mcp-tooling/ | mcp-tooling | External effects + cross-hub judgment: `composeAfter` / `requiresAuthorityFrom` edges; transports never own judgment. Highest blast radius — last |

### Sequencing
001 → 002 → 003. Each satisfies migration Stage 4 (per-hub canary) and, for effect-capable legs, Stage 6 (destination rollout). No hub activates before its predecessor's canary + rollback drill pass.

## RELATED DOCUMENTS
- **Design**: `../../009-unified-refactor-research/unified-refactor-synthesis.md` (§7 archetype mapping, §2.2 identity)
- **Parent Spec**: `../spec.md`
