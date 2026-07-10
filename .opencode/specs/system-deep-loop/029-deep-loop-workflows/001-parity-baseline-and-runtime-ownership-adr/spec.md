---
title: "Feature Specification: Parity baseline and runtime-ownership ADR"
description: "Capture a byte-level baseline of all five modes’ artifacts, eight commands, and advisor outputs; author the runtime-ownership ADR; run the nested-SKILL.md advisor-discovery gate; decide the Lane-D dry-run baseline. The phase-0 gate before any file moves."
trigger_phrases:
  - "deep-loop-workflows parity baseline"
  - "runtime ownership adr"
  - "nested skill.md discovery test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-parity-baseline-and-runtime-ownership-adr"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parity baseline and runtime-ownership ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 001 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | — (first phase) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A structure-only merge can silently change behavior. Without a captured byte-level baseline of every mode’s artifacts, commands, and advisor outputs, "no regression" is unprovable (the acceptance bar is byte-identical per mode). Two open risks gate the whole epic: nested-SKILL.md advisor discovery (blocker B5 / risk R1 — if the advisor scanner globs **/SKILL.md, the verbatim mode packets become separate rankable skills and defeat consolidation) and the Lane-D baseline asymmetry (B8). The runtime also gains new ownership in phase 002, which the runtime’s own ESCALATE rule says requires an ownership ADR before extension.

### Purpose
Establish the parity baseline, author the runtime-ownership ADR, and resolve the two phase-0 gates, before any directory is moved or renamed.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Byte-level baseline capture of the five modes’ artifacts, the eight /deep:* command outputs, and advisor routing outputs (single-executor, normalized modulo timestamps).
- The nested-SKILL.md advisor-discovery test: prove the planned packet layout yields no extra rankable advisor nodes (blocker B5).
- The runtime-ownership ADR (decision-record.md) authorizing the phase-002 promotions per the deep-loop-runtime ESCALATE contract.
- The Lane-D baseline decision: capture parity dry-run-only (blocker B8), so phase-009 acceptance compares on the same basis.

### Out of Scope
- Any directory move, rename, or path rewrite (phases 003+).
- Building the mode-registry.json (phase 003).
- The backend promotions themselves (phase 002).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Byte-level baseline capture of the five modes’ artifacts, the eight /deep:* command outputs, and advisor routing outputs (single-executor, normalized modulo timestamps).
- **R2 (MUST):** The nested-SKILL.md advisor-discovery test: prove the planned packet layout yields no extra rankable advisor nodes (blocker B5).
- **R3 (MUST):** The runtime-ownership ADR (decision-record.md) authorizing the phase-002 promotions per the deep-loop-runtime ESCALATE contract.
- **R4 (MUST):** The Lane-D baseline decision: capture parity dry-run-only (blocker B8), so phase-009 acceptance compares on the same basis.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Baseline snapshot recorded and reproducible for all 8 commands + 5 modes.
- Nested-SKILL.md discovery test proves exactly the intended one rankable node per packet plan.
- Runtime-ownership ADR authored; validate.sh --strict green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase — (first phase).

- Nested-SKILL.md discovered as separate advisor skills (R1, High×Med) — abort and redesign packet layout before any move.
- Baseline not reproducible (non-determinism leaks past timestamp normalization) — over-broaden the normalizer before trusting parity.

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

- A mode whose artifact embeds a non-timestamp nondeterministic field (run id, temp path) — the normalizer must mask it or the baseline is unusable.
- Lane D cannot run live in this environment — baseline is captured dry-run-only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low blast-radius (read-only baseline + one ADR + one discovery test), but it is the gating phase: a wrong nested-SKILL.md verdict invalidates the whole layout decision.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the advisor skill-graph scanner glob **/SKILL.md (blocker B5)?
- Is the Lane-D dry-run baseline sufficient for phase-009 acceptance (blocker B8)?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
