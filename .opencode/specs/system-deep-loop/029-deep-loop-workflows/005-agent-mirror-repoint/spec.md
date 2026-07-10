---
title: "Feature Specification: Agent mirror repoint"
description: "Repoint the five native agent bodies across all three runtime mirrors (.opencode, .claude, .codex), holding three-way parity. Agent names are kept; only skill references change."
trigger_phrases:
  - "deep agent mirror repoint"
  - "three-way agent parity"
  - "codex toml agent mirror"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/005-agent-mirror-repoint"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-005-agent-mirror-repoint"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Agent mirror repoint

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (shipped as part of the deep-loop merge; per-phase checklist gate not independently run) |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 005 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | 004 |

> **Status reconciliation:** This phase shipped in the deep-loop merge, but its standalone checklist was not independently gate-run; the differing summary status records that scoped delivery evidence.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five deep agents (deep-context, deep-research, deep-review, deep-improvement, ai-council) exist as real three-file mirrors (.opencode/agents canonical + .claude + .codex), not symlinks; a missed mirror is a silent native-seat failure in that runtime (risk R5). The decision is to keep the five agent names (the ai-council/deep-ai-council asymmetry is precedent that a skill rename does not force an agent rename). The ai-council agent is the highest-effort (~27 path edits, executing persist-artifacts.cjs from literal paths in lockstep with output_schema.md), and the .codex toml mirrors are hand-maintained derived files guarded by the mirror-sync verifier.

### Purpose
Repoint the five agent bodies’ skill references across all three runtime mirrors while preserving agent names, dispatch contracts, and three-way body parity.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan system-deep-loop/029-deep-loop-workflows/005-agent-mirror-repoint`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skill-path references in the 5 agent bodies across .opencode/agents, .claude/agents, .codex/agents.
- The ai-council lockstep contract (agent body + persist-artifacts.cjs paths + output_schema.md).
- Confirming the .codex toml mirrors are hand-maintained (not regenerated) before editing developer_instructions bodies.

### Out of Scope
- Agent renames (decision: keep names).
- Command YAML (phase 004).
- Advisor edges (phase 006).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Skill-path references in the 5 agent bodies across .opencode/agents, .claude/agents, .codex/agents.
- **R2 (MUST):** The ai-council lockstep contract (agent body + persist-artifacts.cjs paths + output_schema.md).
- **R3 (MUST):** Confirming the .codex toml mirrors are hand-maintained (not regenerated) before editing developer_instructions bodies.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Three-way mirror body parity (the Path-Convention line whitelisted as an expected per-runtime diff).
- Agent-name dispatch unchanged; all 5 agents resolve their skill loads.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 004.

- One runtime mirror not repointed → silent native-seat failure in that runtime (R5, Med×Med) — run the three-way mirror-parity check.
- A .codex toml regenerated from a stale pipeline overwrites the repoint — confirm mirrors are hand-maintained first.

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

- deep-review’s out-of-set sk-code-review/references/review_core.md reference must be LEFT as-is.
- The per-runtime "Path Convention" line is an expected diff and must be whitelisted in the parity check.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium: 15 files, mostly mechanical, but the ai-council lockstep and the three-way parity make it error-prone.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Are the .codex toml mirrors hand-edited or machine-generated (blocker carried from research angle 2)?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
