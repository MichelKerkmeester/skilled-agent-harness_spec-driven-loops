---
title: "Verification Checklist: Merge design-motion into design-interface"
description: "Verification checklist for the four-phase merge: ordering-mechanism fidelity, content move and collision resolution, command/router/test rewire, final sweep."
trigger_phrases:
  - "motion merge checklist"
  - "design-motion retirement checklist"
  - "restraint gate ordering checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once Phase 1 lands"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Merge design-motion into design-interface
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Commit `b217d74b819` has been read in full before any move begins
  - **Evidence (planned):** `git show b217d74b819 --stat`
- [ ] CHK-002 [P0] The restraint-gate ordering mechanism is chosen and recorded with rationale before any content moves
  - **Evidence (planned):** `implementation-summary.md` Key Decisions row
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [ordering fidelity + content move]

- [ ] CHK-010 [P0] The restraint-gate-first ordering is mechanically checkable, not just documented in prose
  - **Evidence (planned):** trace a motion task through the chosen mechanism end to end
- [ ] CHK-011 [P0] All five no-interface-equivalent references transfer intact (`animation-decision-framework.md`, `motion-strategy.md`, `animate-presence-patterns.md`, `advanced-craft.md`, `performance-reduced-motion.md`)
  - **Evidence (planned):** `find design-interface/references/motion/` listing all five
- [ ] CHK-012 [P0] `shared/numeric-design-laws.md:38-41`'s four motion timing laws still resolve to the moved `motion-strategy.md`
  - **Evidence (planned):** `rg -n "motion-strategy" shared/numeric-design-laws.md`
- [ ] CHK-013 [P1] All 9 filename collisions are resolved (suffix or merge), none silently overwritten
  - **Evidence (planned):** per-collision note in `implementation-summary.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [command/router/test surface]

- [ ] CHK-020 [P0] `design-command-surface-check.mjs:358`'s non-empty `next` requirement is satisfied; the design<->motion two-cycle is fixed
  - **Evidence (planned):** checker output
- [ ] CHK-021 [P0] `hub-router.json:7` `tieBreak` equals the declared modes in registry order
  - **Evidence (planned):** manual diff against mode registry
- [ ] CHK-022 [P0] `grounding-receipt.mjs:26-30` `PAIRED_MODES` collapses to the 2-mode set; `ALLOWED_INFLUENCE_AXES`'s `'motion'` entry is untouched
  - **Evidence (planned):** diff of `grounding-receipt.mjs`
- [ ] CHK-023 [P0] `command-metadata.json` lanes match `SKILL.md` `INTENT_SIGNALS` exactly
  - **Evidence (planned):** design-command-surface checker output
- [ ] CHK-024 [P1] Both test rosters (`interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`) pass
  - **Evidence (planned):** test run output
- [ ] CHK-025 [P1] Runtime mirrors of `/interface:motion` deleted from all four runtime dirs
  - **Evidence (planned):** `find .claude/ .codex/ .cursor/ .devin/ -iname "motion.md"`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [ceremony + deletion]

- [ ] CHK-030 [P1] `design-motion/SKILL.md`, `README.md`, `changelog/` deleted
  - **Evidence (planned):** `find design-motion/SKILL.md design-motion/README.md design-motion/changelog`
- [ ] CHK-031 [P1] `motion-character-handoff.md` deleted, not repointed
  - **Evidence (planned):** `find shared/evidence-envelopes/motion-character-handoff.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [ ] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence (planned):** diff review confirms markdown/JSON/`.mjs` content only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same scope and ordering decision
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "design-motion"` across the hub (excluding history) returns nothing
  - **Evidence (planned):** command output attached to `implementation-summary.md`
- [ ] CHK-061 [P1] This phase lands as its own commit, independently revertable from `009`/`011`
  - **Evidence (planned):** `git log -1 --stat` for the merge commit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->
