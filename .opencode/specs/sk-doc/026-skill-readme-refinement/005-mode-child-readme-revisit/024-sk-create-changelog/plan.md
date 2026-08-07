---
title: "Implementation Plan: Phase 24 sk-create-changelog README rewrite"
description: "Rewrite the sk-create-changelog mode skill README purpose-first against the refined template from phase 001 with mcp-obsidian as the exemplar, plus a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 24 plan"
  - "sk create changelog readme plan"
  - "changelog readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 24 plan inside 026-skill-readme-refinement"
    next_safe_action: "Execute the rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/024-sk-create-changelog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 24 sk-create-changelog README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-changelog/README.md` against the refined README template from phase 001, using the mcp-obsidian README as the pilot exemplar. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, preserves every factual surface of the current document, bumps the version field and adds a changelog entry under the skill changelog folder. No SKILL.md content and no other skill README is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the rewritten README (REQ-006) | validate_document.py |
| HVR | Grep returns zero em dashes, zero semicolons and zero Oxford commas in the README (REQ-004) | rg |
| Link guard | Every relative link in the README resolves | rg + read |
| Version field | `rg -n '^version:'` on the README shows the new value (REQ-005) | rg |
| Changelog entry | `ls` on the skill changelog folder shows the new entry (REQ-005) | ls |
| git diff | `git diff --check` reports zero whitespace errors | git diff |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, QUICK START, capability sections preserving source resolution, global versus nested detection, four-part version rules and format selection, VERIFICATION, RELATED DOCUMENTS |
| `changelog/v<version>.md` | Add: changelog entry per the skill changelog convention |
| Phase docs | Create: spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote, problem-first OVERVIEW, QUICK START, capability sections, VERIFICATION, RELATED DOCUMENTS. The mcp-obsidian README is the narrative exemplar for tone, section depth and the VERIFICATION table.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, read the mcp-obsidian exemplar, record the baseline of the current README (version field, validator output, link state) |
| Implementation | Rewrite the README per the template, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, scope diff, phase validation |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard resolves every relative link, `git diff --check` reports zero whitespace errors and the scope diff shows only the README, the changelog entry and this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style drifts | REQ-001 gates the rewrite on the template read |
| mcp-obsidian exemplar | Narrative shape drifts from the pilot | Review the exemplar in setup |
| sk-doc README validator | Validation gate unavailable | Run the validator and record the output in the checklist |
| Skill changelog folder | Entry naming drift | Read the skill changelog folder before adding the entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the old README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no SKILL.md, template asset or other skill README participates.
<!-- /ANCHOR:rollback -->
