---
title: "Implementation Plan: Phase 026-sk-create-diff skill README rewrite"
description: "Rewrite the sk-create-diff mode skill README purpose-first on the refined template, bump the version field to 1.1.2.0, add a changelog entry and validate the result."
trigger_phrases:
  - "phase 026 plan"
  - "sk-create-diff readme plan"
  - "readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 026-sk-create-diff plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/026-sk-create-diff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 026-sk-create-diff skill README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-doc/sk-create-diff/README.md` purpose-first against the refined README template from phase 001 with the mcp-obsidian README as the exemplar. The rewrite keeps every fact of the current README: the snapshot and compare lifecycle, the compare-pair aggregate path, exit codes, the boundary with `sk-git` and the verification commands. The version field bumps from `1.0.0.0` to `1.1.2.0` and a changelog entry lands at `changelog/v1.1.2.0.md`. No `SKILL.md`, template, vault or sibling file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Zero issues on the rewritten README | `validate_document.py --type readme` |
| HVR | Zero em dashes, zero semicolons and zero Oxford commas in the README body | `rg -n` |
| Link guard | Every relative link target in the README resolves | `ls -l` per extracted target |
| Version field | Frontmatter reads `version: 1.1.2.0` | `rg -n "version:"` |
| Changelog entry | `changelog/v1.1.2.0.md` exists with a release title | `ls changelog/` |
| Scope diff | Only the README and the changelog entry changed | `git diff --check` |
| Phase docs | `validate.sh` errors zero on this phase folder | `validate.sh` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/sk-doc/sk-create-diff/README.md` | Rewrite: pitch blockquote after the H1, AT A GLANCE first, problem-first OVERVIEW, numbered ALL-CAPS H2 sections with `---` dividers, HVR clean prose, every command and boundary fact carried over, version field bumped to `1.1.2.0` |
| `.opencode/skills/sk-doc/sk-create-diff/changelog/v1.1.2.0.md` | Add: release entry for the README rewrite following the skill's changelog convention |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: pitch blockquote, AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS where each section earns its place on the template model. Prose carries the explanation. Tables stay only for genuine lookups. The changelog entry follows the release-entry convention of the skill's `changelog/` folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the refined template, read the mcp-obsidian exemplar README, read the current README and record the baseline (version field `1.0.0.0`, validator output, link state).

### Phase 2: Authoring

Rewrite the README purpose-first, bump the version field to `1.1.2.0`, add `changelog/v1.1.2.0.md`.

### Phase 3: Verification

Run the README validator, the HVR greps, the link guard, `git diff --check`, the section-by-section facts diff and the phase validation.

Sequenced in tasks.md (T001-T011).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. `validate_document.py --type readme` reports zero issues on the rewritten README. The HVR greps return zero em dashes, zero semicolons and zero Oxford commas in the README body. The link guard confirms every relative link target resolves. `git diff --check` stays clean. A section-by-section diff against the previous README confirms no factual loss. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite drifts from the standard | Read the template before authoring and follow its section model |
| mcp-obsidian exemplar README (phase 013) | Rewrite diverges from the pilot | Read the exemplar before drafting |
| Parent sequencing (phases 001 and 004) | Rewrite runs against a moving standard | REQ-001 readiness gate before the rewrite |
| sk-doc README validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the rewrite commit with `git revert`. The phase touches only the README, the new changelog entry and this phase's docs, so the revert is clean and no `SKILL.md`, template, vault or sibling file participates.
<!-- /ANCHOR:rollback -->
