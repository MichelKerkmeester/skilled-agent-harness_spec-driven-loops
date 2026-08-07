---
title: "Implementation Plan: Phase 025 sk-create-command README revisit"
description: "Plan for rewriting the sk-create-command skill README against the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 25 plan"
  - "sk create command readme plan"
  - "command readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 025 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/025-sk-create-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 025 sk-create-command README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-command/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The phase reads the baseline first, rewrites the README with a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds the matching changelog entry and validates. No SKILL.md content and no other file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | `validate_document.py` |
| HVR grep | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every linked path in the README resolves | Link scan |
| Version field | `version:` present in the README frontmatter with the bumped value | `rg -n` |
| Changelog entry | An entry exists at `changelog/<version>.md` matching the bumped version | `ls` |
| Diff hygiene | `git diff --check` reports no whitespace errors | `git diff --check` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch blockquote, AT A GLANCE table, problem-first OVERVIEW, numbered ALL-CAPS H2 sections with `---` dividers, section count matched to the skill, version field bump in the frontmatter |
| `changelog/<version>.md` | Add: per-release entry matching the bumped version field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README: pitch blockquote, AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. Sections that do not earn their place drop and the rest renumber. The draft is compared against the mcp-obsidian README as the exemplar shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template, read the current README and record the baseline, read the mcp-obsidian exemplar, confirm the parent sub-phase order |
| Rewrite | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, scope diff, phase validation |

### Phase 1: Setup

Read the refined template and record its section model and required-section rule. Read the current README and record the baseline: the version field value, the validator output and the link state. Read the mcp-obsidian exemplar for the purpose-first shape and confirm the parent sub-phase order.

### Phase 2: Implementation

Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW. Bump the version field to the evidence-based target and add the matching changelog entry.

### Phase 3: Verification

Run the README validator, the HVR grep, the link guard and the scope diff. Run `validate.sh --strict` on this phase folder and regenerate the phase metadata.

Sequenced in tasks.md (T001-T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The finished README is validated with `validate_document.py --type readme` reporting zero issues, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body, the link guard confirms every linked path resolves, `git diff --check` reports no whitespace errors and `validate.sh` on this phase folder reports zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Follow the template section model and required-section rule (REQ-001) |
| mcp-obsidian exemplar README | Rewrite drifts from the pilot shape | Compare the draft against the exemplar section by section |
| sk-create-command changelog folder | Version field and changelog head disagree | Record the baseline and pick the bump target on evidence |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the prior README and drop the changelog entry. The phase touches only the README, its changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template or sibling file participates.
<!-- /ANCHOR:rollback -->
