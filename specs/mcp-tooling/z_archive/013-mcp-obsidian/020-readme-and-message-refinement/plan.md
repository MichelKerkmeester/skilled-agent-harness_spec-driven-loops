---
title: "Implementation Plan — Phase 20 — README and skill message refinement"
description: "Rewrite the mcp-obsidian README in the repo-root narrative style and correct the purpose framing in README and SKILL.md."
trigger_phrases:
  - "phase 20 plan"
  - "readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/020-readme-and-message-refinement"
    last_updated_at: "2026-08-04T05:41:57Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 20 implementation plan"
    next_safe_action: "Execute the README rewrite and SKILL.md refinement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/020-readme-and-message-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Phase 20 — README and skill message refinement

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite the mcp-obsidian README to the repo-root narrative voice with the corrected purpose (effective AI use inside Obsidian, plugin knowledge as a headline capability) and reframe the SKILL.md frontmatter description and H1 intro to match. Preserve every factual claim, bump versions, add a changelog entry, and validate. Rollback is a git revert.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Purpose framing | No "routes between two CLI profiles" identity remains | grep + review |
| README structure | `--type readme` validation passes | validate_document.py |
| Factual preservation | All surfaces, install steps, safety invariants, troubleshooting rows survive | section-by-section diff |
| HVR | Zero em dashes and semicolons in the README body | rg |
| Links | All README links resolve | check-markdown-links.cjs |
| Skill packaging | mcp-tooling leaf manifest fresh | generate-leaf-manifest.cjs --check |
| Phase docs | validate.sh errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Full rewrite: pitch blockquote, AT A GLANCE, OVERVIEW (corrected purpose), QUICK START, HOW IT WORKS (router + plugin-knowledge model), INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS |
| `SKILL.md` | Frontmatter `description` and H1 intro reframed; version 1.3.1.1 → 1.4.1.0; all routing/rules/reference content untouched |
| `changelog/v1.4.1.0.md` | New messaging-release entry |
| `README.md` version | 1.0.0.0 → 1.1.0.0 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Baseline README validation; capture facts to preserve; inventory purpose statements |
| Authoring | Rewrite README; reframe SKILL.md description + intro; create changelog |
| Verification | README validator, HVR grep, link guard, phase validation, metadata regen |

Sequenced in tasks.md (T001–T007).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test: `validate_document.py --type readme` reports zero issues; link guard shows zero broken mcp-obsidian links; grep confirms zero em dashes and semicolons in the README body; phase validation errors zero. No vault or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| sk-create-skill README template | Structure mismatch | Follow the section model and validation checklist exactly |
| Existing README facts | Lost during rewrite | Section-by-section diff against the old file |
| SKILL.md routing surface | Purpose edit touches routing | Edit only the description and intro; leave routers and rules intact |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the release to restore the previous README, SKILL.md frontmatter and intro, and remove the changelog entry. No vault content participates.
<!-- /ANCHOR:rollback -->
