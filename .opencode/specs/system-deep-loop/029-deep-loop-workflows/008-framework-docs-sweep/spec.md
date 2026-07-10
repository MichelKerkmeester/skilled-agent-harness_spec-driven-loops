---
title: "Feature Specification: Framework documentation sweep"
description: "Rewrite the framework docs from the five-skill model to the two-skill model (root README, CLAUDE.md/AGENTS.md paired edits, the runtime README, constitutional, sibling Related-skills lines); stamp v1.0.0; preserve per-mode changelog history."
trigger_phrases:
  - "deep-loop framework docs sweep"
  - "five to two skill doc rewrite"
  - "deep-loop-runtime readme rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/008-framework-docs-sweep"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-008-framework-docs-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Framework documentation sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete - shipped in the deep-loop merge; per-phase checklist sign-off pending |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 008 of 009 (parent: `147-deep-loop-workflows`) |
| **Depends on** | 007 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cross-repo documentation is written around a five-skill model: the root README enumerates five loop skills (including a brittle slash-enumeration and per-skill README links that will 404), .opencode/skills/README.md counts "23 skills" and "deep-* (6)", CLAUDE.md and AGENTS.md are hand-mirrored at identical line numbers, the deep-loop-runtime README is built around a five-consumer model, and constitutional/deep-skill-workflow-required.md enumerates all five names. descriptions.json and changelog history must be EXCLUDED from the rename sweep.

### Purpose
Rewrite all framework documentation to the two-skill architecture, stamp the merged skill v1.0.0, and preserve each source mode’s prior changelog history as mode history.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan system-deep-loop/029-deep-loop-workflows/008-framework-docs-sweep`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root README.md (four sections), .opencode/skills/README.md catalog + counts, CLAUDE.md + AGENTS.md paired edits.
- deep-loop-runtime/README.md rewrite from a five-consumer to a one-consumer-with-modes model; constitutional/deep-skill-workflow-required.md.
- system-spec-kit and cli-opencode Related-skills lines; SYNC.md:32 + the optional loop.py:94 comment.
- Stamp deep-loop-workflows v1.0.0; preserve per-mode changelog history.

### Out of Scope
- Old-directory deletion (phase 009).
- Any Barter contract-version bump (none required for a path/docs rename).
- descriptions.json and changelog history (excluded from the rename sweep).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Root README.md (four sections), .opencode/skills/README.md catalog + counts, CLAUDE.md + AGENTS.md paired edits.
- **R2 (MUST):** deep-loop-runtime/README.md rewrite from a five-consumer to a one-consumer-with-modes model; constitutional/deep-skill-workflow-required.md.
- **R3 (MUST):** system-spec-kit and cli-opencode Related-skills lines; SYNC.md:32 + the optional loop.py:94 comment.
- **R4 (MUST):** Stamp deep-loop-workflows v1.0.0; preserve per-mode changelog history.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Zero stale deep-{research,review,context,ai-council,improvement} skill-path references (grep).
- Changelog history intact; no Barter contract-version bump.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 007.

- CLAUDE.md/AGENTS.md hand-mirror drift if edited independently (Med×Med) — treat the paired edit as one unit at identical line numbers.
- A per-skill README link left dangling (404) after the folder move — sweep and re-point or remove.

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

- descriptions.json contains only historical spec-folder slugs (no live skill refs) — exclude from the rename.
- changelog/ history is append-only — exclude from the rename sweep.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium: wide doc surface across the repo but purely textual; the paired CLAUDE.md/AGENTS.md edit is the main correctness trap.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Fresh v1.0.0 vs inherited-max version (resolved: v1.0.0) — confirm changelog-history preservation shape.

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
