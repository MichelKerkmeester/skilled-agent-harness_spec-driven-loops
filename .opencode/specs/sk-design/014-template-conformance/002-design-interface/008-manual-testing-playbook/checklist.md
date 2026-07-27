---
title: "Verification Checklist: design-interface manual-testing-playbook conformance"
description: "Verification Date: 2026-07-27"
trigger_phrases:
  - "manual-testing-playbook checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/008-manual-testing-playbook"
    last_updated_at: "2026-07-27T20:00:00Z"
    last_updated_by: "worker-session"
    recent_action: "Confirmed root cause; disproved the foundations-*/motion-* residue hypothesis"
    next_safe_action: "Present the 18-file 9-column reformat question to the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worker-session"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the 18 relocated foundations/motion scenario files (color, type, layout, data-viz, tokens, worked-examples, strategy, presence, reduced-motion, micro-interactions, decision, advanced-craft) be reformatted into the governing template's 9-column table, or does 'relocated intact' constitute an accepted, permanent exception?"
    answered_questions:
      - "Was foundations a standalone mode later merged into design-interface? YES — confirmed via `git show --stat b217d74b819` (\"Flatten foundations into the interface mode\")."
---

# Verification Checklist: design-interface manual-testing-playbook conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — 5/5 requirements (REQ-001..005) present and re-verified against current on-disk state
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `foundations-*` root cause confirmed with evidence — `git show --stat b217d74b819` ("refactor(sk-design): retire the audit and foundations commands... Flatten foundations into the interface mode") confirms `foundations` was a real, separate mode later consolidated into `design-interface`
- [x] CHK-011 [P0] `foundations-*` disposition decided, no deletion performed — **hypothesis disproven**: the `foundations-`/`motion-` prefixed `procedure-card-contract/` files are NOT stale residue. Root `manual-testing-playbook.md` §23/§24 explicitly documents the naming convention ("renamed with a `foundations-`/`motion-` prefix to avoid colliding with ID-018/019/020"), and a parallel `motion-*` trio was added later by the motion merge following the identical pattern — strong evidence this is an intentional, established convention, not overlooked residue. Disposition: **keep as-is**, no rename/merge/removal. Referenced procedure cards (`procedures/tweakable-design-controls.md`, `procedures/component-system-inventory.md`, `procedures/hierarchy-rhythm-review.md`) confirmed to exist.
- [x] CHK-012 [P0] All 25 categories (not 20 — the motion merge added 6 new categories after this spec was authored: `strategy`, `presence`, `reduced-motion`, `micro-interactions`, `decision`, `advanced-craft`) audited against §3-§5 — see Testing below for the one confirmed gap
- [x] CHK-013 [P1] `licensing-and-provenance/` `ID-007` confirmed untouched — **superseded**: the directory and its root-doc section (formerly §12) are already gone from disk and from `manual-testing-playbook.md`'s numbering (jumps 11→13); sibling `001-apache-devendoring` has already executed its removal. Nothing left for this child to protect.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] No scenario ID renumbered anywhere in the folder [deferred: confirmed, all edits this session were prose/count/path fixes only]
- [ ] CHK-021 [P1] 9-column contract spot-checked across all 25 categories — **partial, real gap found**: the native `ID-0xx` scenarios (13 categories) and the 3 `foundations-*`/3 `motion-*` procedure-card-contract files all use the correct 9-column table. The **other 18 relocated scenario files** (`color`×2, `type`×1, `layout`×2, `data-viz`×1, `tokens`×1, `worked-examples`×1 = 8 foundations; `strategy`×3, `presence`×2, `reduced-motion`×2, `micro-interactions`×1, `decision`×1, `advanced-craft`×1 = 10 motion) use an older `## Prompt` / `## Expected Process` / `## Pass Criteria` structure with no 9-column table at all — confirmed non-conformant with `manual-testing-playbook-template.md:126,143`. Root doc §23/§24 frame this as deliberate ("relocated intact... rather than renumbered"), but that framing is not the same as a documented template exception. **Left unchecked and recorded as an open question** rather than reformatting 18 files unilaterally — that is new-authoring work at a scale beyond this residue-cleanup pass, not a rubber-stampable "already done."
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] Fixed 2 confirmed defects found during verification, both small and in-scope: (1) root `manual-testing-playbook.md`'s OVERVIEW line claimed "30 deterministic scenarios across 19 categories" — actual count is 43 scenarios (verified via `find -mindepth 2 -name "*.md" | wc -l`) across 25 categories (verified via directory listing); corrected. (2) `color/contrast-pair-inventory-before-audit.md`'s Failure Triage cell cited `../../assets/contrast-pair-inventory.md` (missing `foundations/`) while the same row and file correctly used the `foundations/`-qualified path elsewhere — a leftover from the "8 scenarios repointed" pass that missed one instance; fixed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] Not applicable: no secrets, auth, or executable code paths touched by this documentation audit
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — reconciled `checklist.md` and `implementation-summary.md` to verified on-disk state
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — a Python link-resolution script was run inline via `python3 - <<EOF`, no file written to disk
- [x] CHK-051 [P1] scratch/ cleaned before completion [deferred: not applicable, no scratch file was created]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 3 | 2/3 (CHK-021 intentionally open — operator decision on the 18-file 9-column reformat) |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27
<!-- /ANCHOR:summary -->
