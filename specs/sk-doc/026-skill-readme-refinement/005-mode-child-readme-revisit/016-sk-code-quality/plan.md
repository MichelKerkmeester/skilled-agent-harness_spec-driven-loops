---
title: "Implementation Plan: Phase 016 sk-code-quality README revisit (rewrite)"
description: "Rewrite the sk-code-quality mode skill README purpose-first against the refined README template from phase 001 and the mcp-obsidian exemplar, bump the version field, add the changelog entry and validate."
trigger_phrases:
  - "phase 16 plan"
  - "sk code quality readme plan"
  - "quality mode rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 016 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-sk-code-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 016 sk-code-quality README revisit (rewrite)

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/sk-code/sk-code-quality/README.md` purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar. The phase records a baseline, rewrites the README with a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds the changelog entry and runs the validation gates (validator, HVR grep, link guard, scope diff and phase validation). No SKILL.md file and no vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator (REQ-006) | Zero issues on the README | validate_document.py --type readme |
| HVR grep (REQ-004) | Zero em dashes, zero semicolons, zero Oxford commas in the README body | rg HVR patterns |
| Link guard (REQ-006) | Every linked path in the README resolves | link guard scan |
| Version field (REQ-005) | Present and bumped in the README frontmatter | rg version |
| Changelog entry (REQ-005) | Entry exists at changelog/<version>.md | ls changelog |
| Scope diff (REQ-008) | No out-of-scope file changed and no whitespace errors | git diff --check + git status |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `README.md` | Rewrite: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections with `---` dividers, HVR-clean prose and a bumped version field |
| `changelog/<version>.md` | Add: per-release entry matching the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewrite: the README is rebuilt on the refined template's section model (pitch blockquote, AT A GLANCE rows, OVERVIEW required and problem-first, numbered ALL-CAPS H2 with dividers) and its validation checklist (command output expectations, link verification and HVR). The mcp-obsidian exemplar README is the narrative shape reference. Every fact in the current README (checklist paths, script paths, router references and the mutation boundary) survives the rewrite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined template and the current README, record the baseline (version field, validator output, link state) |
| Implementation | Rewrite the README purpose-first per the refined template, bump the version field, add the changelog entry |
| Verification | Validator, HVR grep, link guard, scope diff, phase validation and metadata regeneration |

### Phase 1: Setup

Read the refined README template and the current README, record the baseline (version field, validator output, link state) and confirm the exemplar and the parent sub-phase order. Sequence: T001-T003.

### Phase 2: Implementation

Rewrite the README purpose-first per the refined template, bump the version field from `1.0.0.1` to `1.0.0.2` and add the changelog entry at `changelog/v1.0.0.2.md`. Sequence: T004-T006.

### Phase 3: Verification

Run the validator, the HVR grep, the link guard and the scope diff, then validate the phase folder with `--strict` and regenerate the metadata. Sequence: T007-T011.

Sequenced in tasks.md (T001-T011).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The README is validated with `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme`. The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas. The link guard confirms every linked path resolves. `git diff --check` reports no whitespace errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite measured against a moving standard | Read the template first and record its section model (REQ-001) |
| mcp-obsidian exemplar README | Rewrite drifts from the exemplar narrative shape | Compare the draft section by section against the exemplar before closeout |
| Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist (REQ-006) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The rewrite changes exactly two skill files (README.md and changelog/<version>.md) in one commit. `git revert` of that commit restores the prior state. Phase docs are additive and need no rollback.
<!-- /ANCHOR:rollback -->
