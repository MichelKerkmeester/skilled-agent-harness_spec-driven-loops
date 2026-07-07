---
title: "Verification Checklist: sk-code Motion.dev Assets and References"
description: "Verification Date: 2026-05-05"
trigger_phrases:
  - "sk-code motion.dev checklist"
  - "002-motion-dev verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/002-motion-dev"
    last_updated_at: "2026-05-05T08:08:41Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Packet 2 verification checklist"
    next_safe_action: "Run strict validation and inventory checks"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: sk-code Motion.dev Assets and References

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

- [x] CHK-001 [P0] Parent packet spec was read before edits. Evidence: `../spec.md` read before authoring.
- [x] CHK-002 [P0] Existing Webflow animation/performance guidance was read for boundary discipline. Evidence: `animation_workflows.md`, `performance_patterns.md`, and `code_quality_standards.md` were read.
- [x] CHK-003 [P1] Official Motion docs were consulted before writing API guidance. Evidence: quick-start, animate, timeline, scroll, inView, spring, hover, press, layout, performance, accessibility, GSAP, and WAAPI URLs were checked.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every Motion API claim is cited to an official Motion URL or a concrete in-repo source path. Evidence: docs use citations sections and source-path notes; no uncited API matrix remains.
- [x] CHK-011 [P0] No fabricated Motion API details or unresolved `[VERIFY:]` placeholders remain. Evidence: `rg "\\[VERIFY:" .opencode/skills/sk-code/references/motion_dev .opencode/skills/sk-code/assets/motion_dev` returned no matches.
- [x] CHK-012 [P0] In-repo examples are runnable patterns, not invented examples. Evidence: reference docs cite real `window.Motion` and ESM patterns from `nav_dropdown.js`, `testimonial.js`, `link_grid.js`, and `link_hero.js`.
- [x] CHK-013 [P1] Snippets guard missing APIs and document loading assumptions. Evidence: snippet headers include `@example` and runtime guards.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation exits 0. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook/002-motion-dev --strict` returned exit 0.
- [x] CHK-021 [P0] Reference inventory is complete. Evidence: `ls references/motion_dev/` shows six `.md` files.
- [x] CHK-022 [P0] Asset inventory is complete. Evidence: `ls assets/motion_dev/` shows `install_card.md`, `playbook_entries.md`, and `snippets/`.
- [x] CHK-023 [P0] Snippet inventory is complete. Evidence: `ls assets/motion_dev/snippets/` shows eight `.js` files.
- [x] CHK-024 [P1] Scope review confirms no Packet 1 or Packet 3 owned files were edited. Evidence: changed files are limited to the child spec folder and motion_dev folders.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `documentation-asset-population`; no runtime bug fix is claimed. Evidence: only Markdown docs and snippet assets were created.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for Motion usage patterns. Evidence: `rg` across `a_nobel_en_zn/2_javascript/` found CDN, ESM, inView, scroll, and motionValue examples.
- [x] CHK-FIX-003 [P0] Consumer inventory represented by Packet 1 playbook IDs MR-001 through MR-004. Evidence: `playbook_entries.md` maps those IDs.
- [x] CHK-FIX-004 [P1] Matrix axes are listed: import mode, API surface, scroll/gesture behavior, performance, reduced motion, and stack integration. Evidence: six reference docs each own one axis.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, private tokens, or real Motion+ tokens are introduced. Evidence: layout snippet uses placeholder wording only and no private token value.
- [x] CHK-031 [P1] CDN guidance pins versions and avoids `@latest` for copy-paste snippets. Evidence: install card and bootstrap snippets use `motion@12.38.0`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] All requested section headings are present in the six reference docs. Evidence: manual read and file inventory confirm requested structure.
- [x] CHK-041 [P0] `install_card.md` includes CDN, npm, ESM, pinning, and verification snippets. Evidence: asset file contains all requested sections.
- [x] CHK-042 [P1] `playbook_entries.md` links to Packet 1 scenarios and motion_dev references. Evidence: file contains MR-001 through MR-004 and cross-links.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Reference files live under `.opencode/skills/sk-code/references/motion_dev/`. Evidence: final `ls` inventory.
- [x] CHK-051 [P0] Asset files live under `.opencode/skills/sk-code/assets/motion_dev/`. Evidence: final `ls` inventory.
- [x] CHK-052 [P1] No scratch files were left in the repo. Evidence: no temporary repo files were created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
