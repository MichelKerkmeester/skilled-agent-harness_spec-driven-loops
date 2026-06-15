---
title: "Feature Specification: Governance consolidation"
description: "Consolidate the five feature_catalog and manual_testing_playbook trees into one tree partitioned by mode; mode-qualify CP- ID collisions at the index (no file renumber); rewrite count self-checks; normalize council casing."
trigger_phrases:
  - "deep-loop governance consolidation"
  - "feature catalog playbook merge"
  - "cp- id collision mode qualify"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/007-governance-consolidation"
    last_updated_at: "2026-06-14T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded from deep-loop-workflows research"
    next_safe_action: "Plan this phase via /speckit:plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-007-governance-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Governance consolidation

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
| **Phase** | 007 of 009 (parent: `152-deep-loop-workflows`) |
| **Depends on** | 006 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All five skills ship a feature_catalog and a manual_testing_playbook (roughly 198 combined playbook scenarios) with no common category schema (lifecycle vs sweep vs four-lane vs council). Feature-ID prefixes collide (CP- reused across research, review, and improvement at different bands), some count self-checks are machine-enforced literals (deep-improvement == 48) and others are prose, the council catalog is UPPERCASE while the others are lowercase, and there is pre-existing intra-skill drift (false "no catalog exists" prose, duplicate headings). Every per-feature file embeds old skill-rooted SOURCE FILES paths.

### Purpose
Build one unified governance tree partitioned by mode, preserving each mode’s subtree, local IDs, category model, and cross-references, with collisions resolved at the index rather than by renumbering files.

> **Scaffold note.** This child is a scoped scaffold derived from `../research/research.md`. Its `plan.md`, `tasks.md`, and `checklist.md` are authored when the phase is picked up via `/speckit:plan skilled-agent-orchestration/152-deep-loop-workflows/007-governance-consolidation`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One feature_catalog root + one manual_testing_playbook root, partitioned by mode (context/research/review/improvement/council).
- Mode-qualify CP- collisions at the merged index (no file renumber); preserve bidirectional catalog↔playbook cross-references.
- Rewrite the machine-enforced count self-checks to the merged total or per-mode sub-totals; update old skill-rooted SOURCE FILES paths (preserving deep-loop-runtime paths).
- Normalize council FEATURE_CATALOG.md casing; dedupe setup-cp-sandbox.sh; reconcile the pre-existing intra-skill drift.

### Out of Scope
- Docs sweep (phase 008).
- Old-directory deletion (009).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** One feature_catalog root + one manual_testing_playbook root, partitioned by mode (context/research/review/improvement/council).
- **R2 (MUST):** Mode-qualify CP- collisions at the merged index (no file renumber); preserve bidirectional catalog↔playbook cross-references.
- **R3 (MUST):** Rewrite the machine-enforced count self-checks to the merged total or per-mode sub-totals; update old skill-rooted SOURCE FILES paths (preserving deep-loop-runtime paths).
- **R4 (MUST):** Normalize council FEATURE_CATALOG.md casing; dedupe setup-cp-sandbox.sh; reconcile the pre-existing intra-skill drift.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This phase is complete when (parity gate):
- Governance counts reconcile (pre vs post); no orphaned CP- IDs.
- The merged index resolves every mode partition; council casing normalized.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** phase 006.

- Files renumbered instead of index-qualified, breaking CP- cross-references (R7, Med×Low) — mode-qualify at the index only.
- A hardcoded count literal (==48) left stale after the merge — rewrite all machine-enforced self-checks.

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

- Pre-existing drift (false "no catalog exists" prose, duplicate headings) must be reconciled, not trusted.
- A SOURCE FILES path pointing at deep-loop-runtime must be preserved unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium: large mechanical SOURCE-FILES surface (~198 files) plus drift-prone count self-checks; no behavior change.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does deep-loop-runtime already carry a feature_catalog/playbook whose convention the merged tree must inherit (blocker B carried from research angle 10)?

Full blocker list (B1–B8) is in `../research/research.md` §Open Items / Blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md` (Phase Documentation Map).
- **Evidence**: `../research/research.md` and `../context/context-report.md`.
- **Frozen backend**: `.opencode/skills/deep-loop-runtime/`.
