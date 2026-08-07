---
title: "Implementation Plan: Phase 006 sk-doc standalone README rewrite"
description: "Plan for the purpose-first rewrite of the sk-doc skill README with a version bump and a changelog entry, validated by the README validator, the HVR grep and a link guard."
trigger_phrases:
  - "phase 006 plan"
  - "sk doc readme plan"
  - "standalone readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 006 plan inside 026-skill-readme-refinement"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 006 sk-doc standalone README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/README.md` against the refined README template from phase 001 with the mcp-obsidian README as the reference shape. The rewrite is purpose-first: a one-line pitch and a problem-first OVERVIEW replace the older tabular reference-card opening. The version field is bumped and a changelog entry is added. The rewrite passes the README validator, the HVR grep and the link guard. No SKILL.md content, no other skill README and no template is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas | `rg -n` |
| Link guard | Every link in the README resolves | link scan |
| Version field | Present and bumped in the README frontmatter | `rg -n` |
| Changelog entry | Entry exists for the new version | `ls -1` |
| Whitespace | `git diff --check` clean | `git diff --check` |
| Phase docs | `validate.sh` errors zero | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, purpose-first sections per the refined template, bumped version field, HVR clean prose |
| `.opencode/skills/sk-doc/changelog/<version>.md` | Add: changelog entry for the rewrite per the per-release conventions |
| Phase docs | spec.md, plan.md, tasks.md and checklist.md in this phase folder |

Section map for the rewrite: pitch blockquote, AT A GLANCE rows, problem-first OVERVIEW, then the capability sections in the template order with the create-* mode pointers preserved. The refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` defines the section order and the mcp-obsidian README shows the narrative shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline (version field value, pre-rewrite validator output, link state), read the refined template and the mcp-obsidian exemplar |
| Implementation | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | README validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation |

### Phase 1: Setup

Read the current README and record the baseline: the version field value, the pre-rewrite validator output and the link state. Read the refined template and the mcp-obsidian exemplar and record the section model.

### Phase 2: Implementation

Rewrite the README purpose-first on the refined template, bump the version field to the skill anchor and add the changelog entry.

### Phase 3: Verification

Run the README validator, the HVR grep, the link guard, the scope diff and `git diff --check`, then validate the phase folder with `validate.sh`.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewrite is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas. The link guard confirms every link resolves and `git diff --check` confirms clean whitespace. The old README is diffed against the new one section by section to prove fact preservation. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite may use a stale section model | Read the template and record its section order before drafting |
| mcp-obsidian pilot README | Exemplar shape may not translate to the sk-doc surface | Read the exemplar and map its sections before drafting |
| Changelog conventions | Entry naming may drift | Follow the per-release `<version>.md` convention in the changelog folder |
| README validator | Gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the previous README state. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md content, template, registry or vault file participates.
<!-- /ANCHOR:rollback -->
