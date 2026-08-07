---
title: "Implementation Plan: Phase 022 sk-create-agent README revisit (rewrite per refined template)"
description: "Rewrite or align the sk-create-agent mode skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, sync the version field, add the changelog entry and validate every gate."
trigger_phrases:
  - "phase 022 plan"
  - "sk create agent readme plan"
  - "create agent readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 022 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README conformance work per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/022-sk-create-agent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 022 sk-create-agent README revisit (rewrite per refined template)

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite or align `.opencode/skills/sk-doc/sk-create-agent/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The phase verifies every gate first, rewrites the README purpose-first on any failing gate, syncs the version field, adds the changelog entry and validates the result. The baseline already carries a purpose-first skeleton with a one-line pitch and a problem-first OVERVIEW, so the pass may land verify-only when every gate holds. No SKILL.md content and no other packet file is touched. Rollback is a git revert of the README and changelog commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every relative link in the README resolves | rg + ls |
| Version field | README frontmatter carries a version field | rg |
| Changelog entry | `changelog/<version>.md` exists and matches the version field | ls |
| Whitespace | `git diff --check` reports no whitespace errors | git diff --check |
| Phase docs | validate.sh errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-agent/README.md` | Rewrite or verify: one-line pitch blockquote, AT A GLANCE, problem-first OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS per the refined template |
| `.opencode/skills/sk-doc/sk-create-agent/changelog/<version>.md` | Add on rewrite: per-release entry matching the bumped version field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the conformant README: pitch blockquote right after the H1, numbered ALL-CAPS H2 sections with `---` dividers, OVERVIEW as the only required section. The rewrite keeps the section order of the refined template, drops any section that does not earn its place and renumbers the rest. The reference model for voice and section order is the mcp-obsidian exemplar README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, the current README, the mcp-obsidian exemplar and the changelog head. Record the baseline: version field value, validator output and link state |
| Implementation | Verify each gate, rewrite the README purpose-first on any failing gate, bump the version field and add the changelog entry |
| Verification | Validator, HVR grep, link guard, version and changelog checks, scoped diff review, phase validation |

Sequenced in tasks.md (T001-T011).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The finished README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every relative link resolves and `git diff --check` reports no whitespace errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Conformance measured against a moving standard | Read the template first and gate on REQ-001 |
| mcp-obsidian exemplar README | Style drift from the family standard | Read the exemplar and match its section order and voice |
| Phases 001 and 004 | Standard and fleet not settled | Parent spec gates child phases on both |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README and changelog commit with `git revert` to restore the prior README and remove the new changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template or other skill file participates.
<!-- /ANCHOR:rollback -->
