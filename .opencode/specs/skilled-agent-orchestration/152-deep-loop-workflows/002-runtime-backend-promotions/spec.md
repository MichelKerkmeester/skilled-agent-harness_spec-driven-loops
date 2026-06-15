---
title: "Feature Specification: Runtime backend promotions"
description: "Promote the named generic plumbing (capability resolver, loop-lock CLI adapter, resolveArtifactRoot, emitResourceMap) and the terminal journal taxonomy into deep-loop-runtime, with zero behavior delta and no improvement loopType."
trigger_phrases:
  - "deep-loop-runtime backend promotions"
  - "loop-lock cli adapter promotion"
  - "terminal journal taxonomy contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/002-runtime-backend-promotions"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-002-runtime-backend-promotions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Runtime backend promotions

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
| **Phase** | 002 of 009 (parent: `152-deep-loop-workflows`) |
| **Depends on** | 001 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five skills duplicate generic plumbing — a byte-identical runtime-capabilities resolver in deep-research and deep-review, a loop-lock CLI adapter only in deep-context, re-inlined atomic-write/jsonl-repair mirrors across four reducers, and resolveArtifactRoot/emitResourceMap imported from system-spec-kit/shared (so the two-skill architecture is not self-contained). The terminal journal taxonomy is frozen only inside deep-improvement. Left duplicated, these constants drift; promoting them is a prerequisite for a thin hub and a self-contained backend.

### Purpose
Promote the named generic plumbing and the terminal journal taxonomy contract into deep-loop-runtime, with zero behavior delta to existing modes and no improvement loopType added to convergence.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/152-deep-loop-workflows/002-runtime-backend-promotions`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parameterized runtime-capabilities resolver (was per-skill).
- Loop-lock CLI adapter as a runtime front door over lib/deep-loop/loop-lock.ts.
- resolveArtifactRoot into the runtime as the canonical artifact-topology resolver.
- emitResourceMap into deep-loop-workflows shared synthesis (NOT the backend — it renders a deliverable).
- Terminal journal taxonomy (6 stopReason + 4 sessionOutcome) as a shared runtime lifecycle contract.
- Runtime unit/contract tests covering the promotions.

### Out of Scope
- Any per-mode reduce-state body (kept per-mode in deep-loop-workflows).
- Any improvement loopType in convergence.cjs (improvement stays host-driven).
- Building the merged skill (phase 003).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Parameterized runtime-capabilities resolver (was per-skill).
- **R2 (MUST):** Loop-lock CLI adapter as a runtime front door over lib/deep-loop/loop-lock.ts.
- **R3 (MUST):** resolveArtifactRoot into the runtime as the canonical artifact-topology resolver.
- **R4 (MUST):** emitResourceMap into deep-loop-workflows shared synthesis (NOT the backend — it renders a deliverable).
- **R5 (MUST):** Terminal journal taxonomy (6 stopReason + 4 sessionOutcome) as a shared runtime lifecycle contract.
- **R6 (MUST):** Runtime unit/contract tests covering the promotions.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Runtime unit/contract tests green.
- convergence.cjs still validates exactly research|review|council|context.
- Existing modes show no behavior delta vs the phase-001 baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 001.

- A promoted constant silently diverges from a mode’s inlined copy, changing artifacts (R3-adjacent, High×Med) — diff the promoted value against every former inline copy.
- Promoting emitResourceMap into the backend by mistake (it renders a deliverable) — keep it in workflows-shared synthesis.

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

- A reducer that relied on a subtly different inlined writeTextAtomic (markdown vs JSON-only) — confirm the promotion preserves that mode’s exact output.
- A capability manifest that is mode-specific masquerading as generic — keep mode-specific capability sets in the packets.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium: touches the frozen backend, so each promotion needs a contract test and a behavior-delta check against the phase-001 baseline.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do the two runtime-capabilities copies carry any mode-specific capability set (must be confirmed generic before promotion)?
- Does any reducer depend on an intentional inline-mirror difference?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
