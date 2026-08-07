---
title: "Implementation Plan: Phase 033 sk-prompt-improve README revisit"
description: "Rewrite the sk-prompt-improve mode README purpose-first on the refined template, mirror the mcp-obsidian exemplar, bump the version, add a changelog entry and validate."
trigger_phrases:
  - "phase 033 plan"
  - "sk-prompt-improve readme plan"
  - "prompt improve readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 033 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/033-sk-prompt-improve"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 033 sk-prompt-improve README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` purpose-first against the refined README template from phase 001, mirroring the mcp-obsidian exemplar. The README opens with a one-line pitch and a problem-first OVERVIEW, keeps every fact of the current document, bumps the version field from 2.3.0.21, corrects the stale validator path and gains a changelog entry. The SKILL.md, the template, the exemplar and all vault files stay untouched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg -n |
| Link guard | All links inside the README resolve | link guard |
| Version field | The README frontmatter carries the bumped version | rg version |
| Changelog entry | `changelog/<version>.md` exists with an entry | ls changelog |
| Scope diff | `git diff --check` clean and only the scoped files change | git diff --check |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, then the refined template sections that earn their place, bumped version field, corrected validator path |
| `changelog/<version>.md` | Add: changelog entry per the packet changelog convention |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the README: pitch blockquote, AT A GLANCE rows, problem-first OVERVIEW, then the template-defined sections (QUICK START, HOW IT WORKS, INTEGRATION AND NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS) where they earn their place. The narrative flow mirrors the mcp-obsidian exemplar.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline, read the refined template and the mcp-obsidian exemplar, run the baseline validator and HVR greps |
| Rewrite | Rewrite the README purpose-first, bump the version field, correct the validator path and add the changelog entry |
| Verification | README validator, HVR grep, link guard, scope diff, validate.sh on this phase folder |

### Phase 1: Setup

Read the current README and record the baseline (version field, validator output, link state), read the refined template and the mcp-obsidian exemplar, run the baseline validator and the HVR greps.

### Phase 2: Rewrite

Rewrite the README purpose-first per the refined template, bump the version field, correct the validator path and add the changelog entry.

### Phase 3: Verification

Run the README validator, the HVR grep, the link guard, the scope diff and validate.sh on this phase folder, then record the evidence in checklist.md.

Sequenced in tasks.md (T001-T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` (zero issues), the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every link resolves, `git diff --check` stays clean and `validate.sh` reports zero errors on this phase folder. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | The rewrite follows an outdated shape | Gate the start on the template file existing and read |
| mcp-obsidian exemplar README | Style drift from the pilot standard | Read the exemplar before drafting |
| sk-doc README validator | The validation gate may be unavailable | Run the validator and record output in the checklist |
| Packet changelog convention | The entry may not match the release shape | Inventory `changelog/` before writing the entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert`. The phase touches only the README, the changelog entry and this phase folder, so the revert is clean and no SKILL.md, template, exemplar, vault file or sibling README participates.
<!-- /ANCHOR:rollback -->
