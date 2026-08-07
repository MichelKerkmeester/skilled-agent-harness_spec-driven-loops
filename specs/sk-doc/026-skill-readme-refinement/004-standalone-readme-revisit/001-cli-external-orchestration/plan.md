---
title: "Implementation Plan: Phase 1 cli-external-orchestration README rewrite"
description: "Rewrite the cli-external-orchestration skill README purpose-first per the refined standalone template, bump the version field to 1.3.0.0, add a changelog entry and validate with the readme validator, the HVR grep and the link guard."
trigger_phrases:
  - "phase 1 plan"
  - "cli external orchestration readme plan"
  - "hub readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration"
    last_updated_at: "2026-08-04T12:45:00Z"
    last_updated_by: "phase-executor-001"
    recent_action: "Plan executed: README rewrite complete"
    next_safe_action: "Hand phase off: phase 1 complete, successor 002-mcp-code-mode ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-external-orchestration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 1 cli-external-orchestration README rewrite

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/README.md` purpose-first against the refined standalone README template with the mcp-obsidian README as the reference shape. The rewrite opens with a one-line pitch and a problem-first OVERVIEW, preserves all six mode pointers and the routing facts, bumps the version field from 1.2.0.0 to 1.3.0.0 and adds `changelog/v1.3.0.0.md`. Verification runs the readme validator, the HVR grep, the link guard and `validate.sh` on this phase folder. No SKILL.md, template, registry, manifest or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | Rewritten README reports zero issues | validate_document.py --type readme |
| HVR | Zero em dashes, semicolons and Oxford commas in the README body | rg -n |
| Link guard | Every relative link in the rewritten README resolves | link scan |
| Version field | Frontmatter carries `version: 1.3.0.0` | grep '^version:' |
| Changelog entry | `changelog/v1.3.0.0.md` exists with a titled entry | ls + review |
| Diff hygiene | `git diff --check` clean and scope diff lists only allowed files | git diff --check + git diff --stat |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `.opencode/skills/cli-external-orchestration/README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW, six mode pointers, routing facts, related skills and verification sections |
| `.opencode/skills/cli-external-orchestration/changelog/v1.3.0.0.md` | Add: changelog entry for the README rewrite |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the rewritten README: pitch blockquote, AT A GLANCE rows, OVERVIEW with a WHY THIS HUB EXISTS statement, the six mode pointers with per-mode links, routing notes, RELATED SKILLS and VERIFICATION. The section model mirrors the refined template and the mcp-obsidian exemplar shape, with the existing factual inventory preserved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Template readiness gate passes for `skill-readme-template.md` (T001)
- Current README baseline recorded (`version: 1.2.0.0`, validator exit `0`, link state) (T002)
- mcp-obsidian exemplar read for the pitch and OVERVIEW pattern (T003)

### Phase 2: Implementation
- One-line pitch blockquote and problem-first OVERVIEW drafted (T004)
- Body rewritten with the six mode pointers and routing facts (T005)
- Frontmatter version bumped to `1.3.0.0` (T006)
- `changelog/v1.3.0.0.md` entry added (T007)
- Section-by-section diff confirms no dispatch fact lost (T008)

### Phase 3: Verification
- Readme validator, HVR grep, link guard and `git diff --check` pass (T009)
- `validate.sh` on the phase folder and the scope diff check pass (T010)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes, semicolons and Oxford commas, the link guard confirms every relative link resolves and `git diff --check` stays clean. A section-by-section diff of the old vs new README proves no dispatch fact was lost. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Rewrite style diverges | Read the template before drafting and mirror its section model |
| mcp-obsidian README exemplar | Reference shape drifts | Read the exemplar before drafting |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Changelog convention | Entry format mismatches sibling entries | Mirror the existing `changelog/v1.2.0.0.md` entry shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the prior README and remove the changelog entry. The phase touches only the README, the changelog entry and this phase's docs, so the revert is clean and no SKILL.md, template, registry, manifest or vault file participates.
<!-- /ANCHOR:rollback -->
