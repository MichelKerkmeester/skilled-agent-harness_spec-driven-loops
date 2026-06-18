---
title: "Feature Specification: Old-skill deletion and full-surface validation"
description: "Delete the five old skill directories and pass the full-surface Acceptance Gate set, including the /doctor council-graph coverage blocker (B1). Deletion happens only here, after every prior gate is green."
trigger_phrases:
  - "delete old deep skill dirs"
  - "deep-loop-workflows full surface validation"
  - "doctor council-graph coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-old-skill-deletion-and-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Old-skill deletion and full-surface validation

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
| **Phase** | 009 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | 008 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five old skill directories must be deleted only after every surface (skill, commands, agents, advisor, governance, docs, runtime) is green, so that rollback stays per-strata until the very end. The /doctor deep-loop council-graph coverage gap (blocker B1 / risk R8) must be resolved before the council mode ships unmonitored — /doctor deep-loop currently probes only deep-loop-graph.sqlite, not the host-confirmed council-graph.sqlite.

### Purpose
Delete the five old skill directories and pass the full release-blocking Acceptance Gate set, resolving the /doctor council-graph coverage blocker first.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the five old skill directories (deep-ai-council, deep-context, deep-improvement, deep-research, deep-review).
- Extend /doctor deep-loop to probe council-graph.sqlite as well as deep-loop-graph.sqlite (blocker B1).
- Run the full Acceptance Gate set: byte-identical per-mode parity, advisor mode+skill assertion, rejectedEdges=0, three-way mirror parity, governance count reconciliation, validate.sh --strict, registry completeness, family field, and the convergence invariant.
- Skill-graph rebuild + advisor_validate.

### Out of Scope
- Any new behavior or feature.
- Reintroducing an MCP tool to deep-loop-runtime.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Delete the five old skill directories (deep-ai-council, deep-context, deep-improvement, deep-research, deep-review).
- **R2 (MUST):** Extend /doctor deep-loop to probe council-graph.sqlite as well as deep-loop-graph.sqlite (blocker B1).
- **R3 (MUST):** Run the full Acceptance Gate set: byte-identical per-mode parity, advisor mode+skill assertion, rejectedEdges=0, three-way mirror parity, governance count reconciliation, validate.sh --strict, registry completeness, family field, and the convergence invariant.
- **R4 (MUST):** Skill-graph rebuild + advisor_validate.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- All Acceptance Gates pass; the five old directories are gone.
- Full byte-identical parity across all 5 modes + 8 commands; /doctor covers both graph DBs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 008.

- Deleting old dirs before a surface is actually green removes the per-strata rollback (High×Low) — deletion is gated behind every prior phase green.
- /doctor council-graph coverage gap persists, leaving the council mode unmonitored (R8, Med×Med) — ship the coverage fix as a release-blocking gate.

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

- A lingering reference to an old skill dir surfaces only after deletion — the phase-008 grep gate must be empty before deletion.
- A stale advisor edge to a deleted node — rejectedEdges must be 0 after the final scan.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium: deletion is mechanical but irreversible; the value is in the full-surface acceptance gate and the council-graph coverage fix landing first.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the /doctor deep-loop route extended to council-graph.sqlite before deletion (blocker B1)?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
