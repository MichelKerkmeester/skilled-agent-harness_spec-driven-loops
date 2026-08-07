---
title: "Implementation Plan: Phase 021 sk-design-md-generator README revisit (rewrite)"
description: "Implementation plan for the purpose-first rewrite of the sk-design-md-generator mode skill README per the refined template and the mcp-obsidian exemplar, with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 021 plan"
  - "md generator readme plan"
  - "sk design readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 021 plan inside 026-skill-readme-refinement"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-sk-design-md-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 021 sk-design-md-generator README revisit (rewrite)

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-design/sk-design-md-generator/README.md` purpose-first per the refined README template from phase 001 and the mcp-obsidian exemplar. The rewrite adds a one-line pitch and a problem-first OVERVIEW, preserves every fact, bumps the version field, adds the changelog entry at `changelog/<version>.md` and validates with the readme validator, the HVR grep, the link guard and `git diff --check`. No SKILL.md, other skill README, template or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every linked path in the README resolves | `rg -n` |
| Version field | Present and bumped in the README frontmatter | `rg -n` |
| Changelog entry | Entry exists at `changelog/<version>.md` | `ls` |
| Diff hygiene | `git diff --check` clean | `git diff` |
| Phase docs | `validate.sh` errors zero on this phase folder | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` (sk-design-md-generator) | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, refined template section model, bumped version field in the frontmatter |
| `changelog/<version>.md` | Add: per-release entry matching the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: frontmatter with a bumped version field, a one-line pitch blockquote, a problem-first OVERVIEW and the numbered sections of the refined template, with non-earning sections dropped per template guidance. The mcp-obsidian README is the worked example the rewrite follows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current README and record the baseline, read the refined template and the mcp-obsidian exemplar |
| Rewrite | Rewrite the README purpose-first, bump the version field, add the changelog entry |
| Verification | Readme validator, HVR grep, link guard, `git diff --check`, scope diff, phase validation |

### Phase 1: Setup

Read the current README and record the baseline (version field, validator output, link state), then read the refined template and the mcp-obsidian exemplar. Sequenced as T001-T003 in tasks.md.

### Phase 2: Rewrite

Rewrite the README purpose-first per the refined template, bump the version field and add the changelog entry. Sequenced as T004-T006 in tasks.md.

### Phase 3: Verification

Run the readme validator, the HVR grep, the link guard, `git diff --check` and the scope diff, then validate the phase folder. Sequenced as T007-T010 in tasks.md.

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme` and must report zero issues, the HVR grep returns zero em dashes, zero semicolons and zero Oxford commas, the link guard confirms every link resolves, `git diff --check` is clean and a section-by-section diff against the prior README confirms every fact survives. The phase folder is validated with `validate.sh`. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Read the template before drafting (REQ-001) |
| mcp-obsidian exemplar README | Rewrite drifts from the pilot pattern | Read the exemplar before drafting (REQ-003) |
| Standalone fleet revisit (phase 004) | Fleet conventions shift mid-phase | Cross-check the rewrite against the phase 004 output where available |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, other skill README, template or vault file participates.
<!-- /ANCHOR:rollback -->
