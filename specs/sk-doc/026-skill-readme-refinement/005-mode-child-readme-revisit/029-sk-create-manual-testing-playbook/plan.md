---
title: "Implementation Plan: Phase 029 sk-create-manual-testing-playbook README revisit"
description: "Rewrite the create-manual-testing-playbook skill README against the refined README template and the mcp-obsidian exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 029 plan"
  - "sk-create-manual-testing-playbook readme plan"
  - "playbook readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 029 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-sk-create-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 029 sk-create-manual-testing-playbook README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The rewritten README leads with the reader: a one-line pitch, an AT A GLANCE table first, a problem-first OVERVIEW, then only the sections the skill earns. Every fact that still holds moves over, verified by a section-by-section diff. The version field is bumped above 1.0.0.0 and a matching entry lands in the packet changelog. The README validator, the HVR grep and the link guard gate the result. No SKILL.md, template, reference, script or vault file is touched. Rollback is a git revert of the phase commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues | validate_document.py |
| HVR grep | Zero em dashes, semicolons and Oxford commas in the README body | rg -n |
| Link guard | `check-markdown-links.cjs` reports zero broken links in the skill folder | check-markdown-links.cjs |
| Version field | README frontmatter version bumped above 1.0.0.0 | rg -n |
| Changelog entry | Entry exists with a version matching the README field | ls changelog |
| Diff hygiene | `git diff --check` clean and no out-of-scope file changed | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE first, problem-first OVERVIEW, then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS only as they earn their place, version field bumped |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/changelog/<next-version>.md` | Add: per-release entry with the version matching the README field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map: the rewrite keeps the reader-first order from the template and drops sections that do not earn their place. The mcp-obsidian README is the shape exemplar for section count and prose density. Facts that still hold move over unchanged, confirmed by a section-by-section diff. The canonical entry point `/create:manual-testing-playbook` and the validator invocation stay prominent in the README body.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Template readiness gate passes for `skill-readme-template.md` and phase 001 closes (T001)
- Current README baseline recorded (`version: 1.0.0.0`, validator exit `0` with `0` issues, link state) (T002)
- mcp-obsidian exemplar pitch, AT A GLANCE and OVERVIEW patterns recorded (T003)

### Phase 2: Implementation
- Purpose-first README rewrite with one-line pitch and problem-first OVERVIEW (T004)
- Section-by-section diff confirms no dispatch fact lost (T005)
- Frontmatter version bumped to `1.0.1.2` and `changelog/v1.0.1.2.md` entry added (T006)
- Canonical entry point and link resolution confirmed (T007)

### Phase 3: Verification
- Readme validator, HVR grep, link guard and `git diff --check` pass (T008, T009, T010, T011)
- `validate.sh` on the phase folder, scope diff check and metadata regeneration pass (T012)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, semicolons and Oxford commas, the link guard reports zero broken links and `git diff --check` is clean. A section-by-section diff confirms every fact that still holds survived the rewrite. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Phase starts before the template is final | Readiness gate in setup blocks the rewrite |
| mcp-obsidian exemplar | Rewrite drifts from the pilot pattern | Section-by-section comparison in verification |
| Packet changelog convention | Entry version diverges from the README field | REQ-005 ties the entry version to the field |
| sk-doc README validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit with `git revert` to restore the pre-rewrite README and remove the new changelog entry. The phase touches only the README, one changelog entry and this phase folder, so the revert is clean and no SKILL.md, template, reference, script or vault file participates.
<!-- /ANCHOR:rollback -->
