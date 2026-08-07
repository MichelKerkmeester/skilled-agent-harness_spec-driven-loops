---
title: "Implementation Plan: Phase 030 sk-create-quality-control README revisit"
description: "Rewrite the sk-create-quality-control mode skill README purpose-first on the refined template with a version bump and a changelog entry, then validate the result."
trigger_phrases:
  - "phase 030 plan"
  - "sk create quality control readme plan"
  - "quality control readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 030 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/030-sk-create-quality-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 030 sk-create-quality-control README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-quality-control/README.md` purpose-first against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps every fact the current README carries, adds a one-line pitch and a problem-first OVERVIEW, bumps the version field in the frontmatter and adds the matching entry at `changelog/<version>.md`. The finished README must pass the sk-doc README validator with zero issues, read clean under the Human Voice Rules grep and resolve every linked path. No SKILL.md, template, vault file or sibling README is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README | validate_document.py |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | rg |
| Link guard | Every linked path in the README resolves | link guard |
| Version field | README frontmatter carries a bumped version value | rg |
| Changelog entry | Entry file exists at `changelog/<version>.md` matching the version field | ls |
| Diff hygiene | `git diff --check` reports no whitespace errors | git diff --check |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-quality-control/README.md` | Rewrite: purpose-first narrative on the refined template section model with a one-line pitch, an AT A GLANCE table, a problem-first OVERVIEW and the sections that earn their place |
| `.opencode/skills/sk-doc/sk-create-quality-control/changelog/<version>.md` | Add: per-release changelog entry matching the bumped version field |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote after the H1, AT A GLANCE, OVERVIEW (required), then the sections the current content earns: QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS. The conformance scan against the refined template decides which sections stay.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the current README and record the baseline (version field, validator output, link state)
- [x] Read the refined template and the mcp-obsidian exemplar, record the changelog head and the SKILL.md version

### Phase 2: Implementation
- [x] Rewrite the README per the template (or verify sections that already conform), bump the version field, add the changelog entry

### Phase 3: Verification
- [x] README validator, HVR grep, link guard, scope diff, `git diff --check`, phase validation

Sequenced in tasks.md (T001-T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body. The link guard resolves every linked path and `git diff --check` reports clean diff hygiene. The scope diff confirms only the README and the changelog entry changed. The phase folder runs `validate.sh` with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite style diverges | Read the template and record its section model before drafting (REQ-001) |
| Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| mcp-obsidian exemplar README | Exemplar shape drifts | Read the exemplar README before drafting (REQ-003) |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Changelog convention | Bump target ambiguous | Record the baseline version, the changelog head and the SKILL.md field before bumping |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README body and version field, then remove the changelog entry added by this phase. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, vault file or sibling README participates.
<!-- /ANCHOR:rollback -->
