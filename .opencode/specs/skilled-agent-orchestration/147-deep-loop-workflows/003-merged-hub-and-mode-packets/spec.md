---
title: "Feature Specification: Merged hub and mode packets"
description: "Build deep-loop-workflows/: a thin authoritative hub SKILL.md, the mandatory mode-registry.json build artifact, and five verbatim mode packets with multi-segment internal path rewrites."
trigger_phrases:
  - "deep-loop-workflows hub skill build"
  - "mode-registry.json build"
  - "verbatim mode packets"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/003-merged-hub-and-mode-packets"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-003-merged-hub-and-mode-packets"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Merged hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (scaffold) |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 003 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five persona skills must become one skill without flattening their five distinct convergence contracts (coverage-saturation, dual-layer newInfoRatio, P0-gated verdict, two-of-three council, config-driven plateau). The mandatory mode-registry.json that enforces the three-tier discriminator does not yet exist (blocker B4). And the verdict on path scope (risk R3) corrected the earlier "single-segment rename" claim: internal references need multi-segment rewrites (for example deep-review/references/protocol/loop_protocol.md becomes deep-loop-workflows/review/references/protocol/loop_protocol.md).

### Purpose
Build the deep-loop-workflows skill: thin hub SKILL.md (routes by mode, holds no per-mode logic), the mode-registry.json build artifact, and the five mode packets moved verbatim with corrected internal paths.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/147-deep-loop-workflows/003-merged-hub-and-mode-packets`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Thin hub SKILL.md routing by mode with no per-mode logic.
- mode-registry.json as the single source for workflowMode, runtimeLoopType (value or explicit null), backendKind, aliases, packet paths, permissions, command names, and artifact roots.
- Five verbatim mode packets (context, research, review, ai-council, improvement) with multi-segment internal path rewrites.
- A registry completeness test asserting every mode carries the three-tier discriminator unambiguously.

### Out of Scope
- Command/agent repointing (phases 004/005).
- Advisor graph migration (006).
- Deleting the old skill directories (009).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Thin hub SKILL.md routing by mode with no per-mode logic.
- **R2 (MUST):** mode-registry.json as the single source for workflowMode, runtimeLoopType (value or explicit null), backendKind, aliases, packet paths, permissions, command names, and artifact roots.
- **R3 (MUST):** Five verbatim mode packets (context, research, review, ai-council, improvement) with multi-segment internal path rewrites.
- **R4 (MUST):** A registry completeness test asserting every mode carries the three-tier discriminator unambiguously.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Registry completeness test passes (every mode has workflowMode + runtimeLoopType-or-null + backendKind).
- Each packet’s internal references resolve.
- validate.sh --strict clean on the new skill docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 002.

- Multi-segment path rewrite misses an internal reference (R3, High×Med) — grep each packet for residual deep-<name>/ paths after the move.
- A router re-derives runtimeLoopType from workflowMode instead of reading the registry (R4) — make registry-read the only enforced path.

Rollback is per-strata: this phase child is independently revertible because the five old skill directories survive until phase 009.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Parity:** byte-identical single-executor artifacts per mode vs the phase-001 baseline (this is a structure/docs reorg, not a behavior change).
- **Backend boundary:** `deep-loop-runtime` stays MCP-free; no MCP tool is added.
- **Validation:** `validate.sh --strict` green on this phase before the next begins.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A mode packet referencing a sibling mode’s asset by relative path — the rewrite must keep cross-mode references valid under the new root.
- The hub SKILL.md accidentally absorbing per-mode logic — it must route only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

High: the structural heart of the epic; the registry is a new build artifact and the verbatim moves carry the largest internal-path rewrite surface.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Flat two-level skill→mode registry vs nested {skill_id:{modes}} (blocker B6)?
- Does the nested-SKILL.md discovery verdict from phase 001 force a packet-layout change?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
