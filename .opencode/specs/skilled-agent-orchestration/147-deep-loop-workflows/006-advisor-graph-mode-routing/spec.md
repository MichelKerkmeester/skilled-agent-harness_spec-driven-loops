---
title: "Feature Specification: Advisor graph mode-routing collapse"
description: "Correct the council and improvement advisor family from sk-util to deep-loop FIRST, then collapse the five skill IDs into deep-loop-workflows plus a mode-alias/discriminator layer; resolve the deep-context alias asymmetry and the aliases.ts schema."
trigger_phrases:
  - "advisor graph mode routing collapse"
  - "skill advisor family correction"
  - "routing parity deep skills"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/006-advisor-graph-mode-routing"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-006-advisor-graph-mode-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Advisor graph mode-routing collapse

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
| **Phase** | 006 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | 005 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Collapsing five advisor skill IDs into one risks a routing precision/recall regression from unioning the trigger phrases (risk R2). The skill_id is hard-bound to the folder name. Critically, deep-ai-council and deep-improvement carry the wrong family (sk-util, host-confirmed at graph-metadata.json:4) and must be corrected to deep-loop BEFORE any old skill ID is removed, or routing fails closed mid-migration (blocker B7). deep-context is absent from aliases.ts and routes metadata-only today (B3), and the aliases.ts restructuring schema (flat vs nested) is undefined (B6) — it determines how PHRASE_BOOSTS and CATEGORY_HINTS target the new structure.

### Purpose
Migrate the advisor graph to one skill ID plus a mode-alias/discriminator layer, performing the family correction first and keeping per-mode routing winners distinct.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/147-deep-loop-workflows/006-advisor-graph-mode-routing`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct deep-ai-council + deep-improvement family sk-util→deep-loop FIRST.
- Delete the 5 skills’ metadata folders, create one deep-loop-workflows folder (skill_id=deep-loop-workflows); rely on FK ON DELETE CASCADE for node+edge teardown.
- Repoint the finite inbound edges (system-skill-advisor enhances, sk-code-review, sk-prompt, system-spec-kit, deep-loop-runtime); union keywords/trigger_phrases (dedup); rebuild key_files/entities.
- Resolve deep-context Candidate-3 (extend patterns or document metadata-routed); define the aliases.ts schema; fix PHRASE_BOOSTS and CATEGORY_HINTS hardcoded IDs.
- Update routing-parity fixtures to assert BOTH deep-loop-workflows AND a concrete mode.

### Out of Scope
- Governance tree (phase 007).
- Docs sweep (008).
- Old-directory deletion (009).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Correct deep-ai-council + deep-improvement family sk-util→deep-loop FIRST.
- **R2 (MUST):** Delete the 5 skills’ metadata folders, create one deep-loop-workflows folder (skill_id=deep-loop-workflows); rely on FK ON DELETE CASCADE for node+edge teardown.
- **R3 (MUST):** Repoint the finite inbound edges (system-skill-advisor enhances, sk-code-review, sk-prompt, system-spec-kit, deep-loop-runtime); union keywords/trigger_phrases (dedup); rebuild key_files/entities.
- **R4 (MUST):** Resolve deep-context Candidate-3 (extend patterns or document metadata-routed); define the aliases.ts schema; fix PHRASE_BOOSTS and CATEGORY_HINTS hardcoded IDs.
- **R5 (MUST):** Update routing-parity fixtures to assert BOTH deep-loop-workflows AND a concrete mode.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Routing-parity asserts both deep-loop-workflows AND the concrete mode (flat alias equality is insufficient).
- rejectedEdges = 0; UNKNOWN-TARGET grep empty.
- family field = deep-loop for all merged modes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 005.

- Old skill IDs removed before the family fix or before the {skill,mode} contract lands → routing fails closed mid-migration (R2, High×Med) — family-correct first, then collapse.
- Trigger-phrase union degrades prompt→mode precision — keep per-mode winners distinct and test ≥3 phrasings per mode.

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

- deep-context absent from aliases.ts — either extend patterns or explicitly document it stays metadata-routed (blocker B3).
- An inbound edge whose target vanishes is silently rejected (UNKNOWN-TARGET) — grep for it after the scan.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

High: the highest routing-quality risk in the epic; fail-closed fixtures mean advisor changes must be sequenced with their tests.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Flat vs nested aliases.ts schema (blocker B6)?
- Does deep-context become a Candidate-3 mode or stay metadata-routed (blocker B3)?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
