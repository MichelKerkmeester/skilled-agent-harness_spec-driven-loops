---
title: "Feature Specification: Delete the sk-design hub and interface commands"
description: "Phase 005 deletes the sk-design judgment hub (.opencode/skills/sk-design/) and the /interface command namespace (.opencode/commands/interface/) after the extraction survivor is proven detached and green, honoring the extraction-before-deletion invariant."
trigger_phrases:
  - "delete sk-design hub"
  - "remove interface commands"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/005-delete-hub-and-interface-commands"
    last_updated_at: "2026-08-19T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Deleted sk-design hub (328) + interface commands (8); survivor proven green first"
    next_safe_action: "Phase 006: repo-wide reference cleanup and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/commands/interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Delete the sk-design hub and interface commands

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Structure** | Phase child of `016-deprecate-sk-design-interface` |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/016-deprecate-sk-design-interface` |
| **Parent Spec** | ../spec.md |
| **Mutation Class** | destructive (operator-gated delete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`sk-design` was a design *judgment* hub — interface direction, foundations, motion, and audit modes. Phases 001–004 extracted the one capability that survives (`sk-design-md-generator`, measured-CSS extraction into a Style Reference DESIGN.md) and its `styles/` corpus into a standalone top-level skill, folding a condensed design-knowledge layer into it.

**Purpose:** remove the retired judgment hub and its command surface now that the survivor is proven detached and functional, so nothing dispatches to a hub that no longer exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Delete `.opencode/skills/sk-design/` (parent hub + interface/foundations/motion/audit design modes + `shared/`).
- Delete the `.opencode/commands/interface/` namespace (`design.md`, `design-reference.md`, and their auto/confirm/presentation assets) — the `design-reference` capability was rebound to `/design:design-reference` in prior phases before this delete.

**Out of scope**

- The standalone survivor `sk-design-md-generator/` and `styles/` (extracted in 002–004; must remain intact).
- Repo-wide reference cleanup and reconcile (phase 006).
- Frozen benchmark fixtures and changelogs (history/evidence, left untouched).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — `.opencode/skills/sk-design/` no longer exists on disk.
- **REQ-002** — `.opencode/commands/interface/` no longer exists on disk.
- **REQ-003** — The delete runs ONLY after the extraction-before-deletion invariant is satisfied: 002–004 verified green (survivor extraction works, DB corpus intact, `validate.sh --strict` and Class-S pass on the new root).
- **REQ-004** — The rollback is named before the destructive action: the deletion is git-tracked and `sk-design/` is restorable from HEAD until committed; operator gate honored.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `test -d .opencode/skills/sk-design` → absent; `test -d .opencode/commands/interface` → absent.
- `git diff --cached --name-status | grep -c '^D'` accounts for the hub + command deletions (336 tracked deletions).
- The survivor is proven green BEFORE the delete: backend suite 173/173, Class-S PASS, 0 dangling internal refs to the deleted hub path.
- No non-sk-design file is deleted (scoped destructive change; concurrent unrelated dirty work excluded).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: deleting before the survivor is detached** — mitigated by the extraction-before-deletion invariant; the survivor's tests and Class-S gate were run green first.
- **Risk: stranded references** — this phase only deletes; every stranded live reference is inventoried and reconciled in phase 006, which fixes each delete-consequence gate before any completion claim.
- **Dependency:** 002–004 (extraction + rewire + fold). Downstream: 006 (reconcile).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The delete was operator-gated and executed after the survivor was proven green.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
## PHASE NAVIGATION

- **Parent:** `../spec.md`
- **Predecessor:** `../004-fold-design-knowledge/spec.md`
- **Successor:** `../006-reference-cleanup-and-reconcile/spec.md`
<!-- /ANCHOR:phase-navigation -->
