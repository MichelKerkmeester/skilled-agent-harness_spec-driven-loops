---
title: "Feature Specification: Command surface repoint"
description: "Repoint the eight /deep:* commands and their YAML assets to the new packet paths and skill keys (command YAML only), after the Python↔TypeScript {skill,mode} routing contract is finalized."
trigger_phrases:
  - "deep command surface repoint"
  - "deep command yaml skill path rewrite"
  - "skill,mode routing contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-004-command-surface-repoint"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Command surface repoint

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
| **Phase** | 004 of 009 (parent: `152-deep-loop-workflows`) |
| **Depends on** | 003 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight /deep:* commands plus roughly twelve YAML assets reference the five old skill paths and skill: keys (the heaviest YAML carry dozens of path occurrences each). The command surface is independent of the skill folder and should stay stable, but every literal skill-path needs repointing. The repoint depends on the Python↔TypeScript {skill,mode} routing contract being finalized first (blocker B2) so fixtures and command bindings can be planned concretely. The per-mode required-input setup schemas and the "do not transfer sibling defaults" guardrails must survive verbatim.

### Purpose
Repoint all eight commands and their YAML/presentation assets to the new packet paths and skill keys, touching command YAML only (agent bodies are phase 005).

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 8 command markdown skill-path references and skill: frontmatter values.
- YAML skill:/skill_md: keys and nested references/scripts/assets path blocks.
- Finalizing the {skill,mode} routing contract before fixture/command edits.
- Preserving the 5 per-mode required-input setup schemas and the do-not-transfer-sibling-defaults guardrails.

### Out of Scope
- Agent body edits (phase 005).
- Advisor graph (006).
- Adding YAML for Lane C/D (they keep their markdown wrapper contracts).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** The 8 command markdown skill-path references and skill: frontmatter values.
- **R2 (MUST):** YAML skill:/skill_md: keys and nested references/scripts/assets path blocks.
- **R3 (MUST):** Finalizing the {skill,mode} routing contract before fixture/command edits.
- **R4 (MUST):** Preserving the 5 per-mode required-input setup schemas and the do-not-transfer-sibling-defaults guardrails.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- All 8 commands resolve to new packet paths; YAML skill: keys updated.
- Byte-identical command output vs the phase-001 baseline.
- Every deep-loop-runtime path left unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 003.

- A deep-loop-runtime path is rewritten by mistake during the sweep (R3, High×Med) — the rewrite rule must leave every deep-loop-runtime/ path untouched.
- A per-mode setup schema or sibling-default guardrail is dropped — diff the rendered command output against the baseline.

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

- ask-ai-council body-level --loop-type council reference must NOT be rewritten.
- Lane C/D commands invoke loop-host directly — they must not gain YAML for symmetry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium-high: large mechanical surface (~270 skill-path occurrences) but bounded by a single rewrite rule and the byte-identical command-output gate.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does RoutingResult gain an explicit mode field or derive mode post-cast (blocker B2)?
- Is ask-ai-council’s dual-naming reconciled or carried forward?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
