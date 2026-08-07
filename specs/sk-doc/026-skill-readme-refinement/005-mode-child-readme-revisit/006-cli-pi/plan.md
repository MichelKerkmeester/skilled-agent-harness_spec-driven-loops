---
title: "Implementation Plan: Phase 6 cli-pi mode skill README revisit"
description: "Rewrite the cli-pi skill README purpose-first against the refined README template from phase 001 with the mcp-obsidian exemplar, including a version bump and changelog entry."
trigger_phrases:
  - "phase 6 plan"
  - "cli pi readme plan"
  - "mode readme rewrite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 6 plan inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute the README rewrite per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-cli-pi"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 6 cli-pi mode skill README revisit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite `.opencode/skills/cli-external-orchestration/cli-pi/README.md` against the refined README template from phase 001 with the mcp-obsidian README as the exemplar. The README becomes purpose-first with a one-line pitch and a problem-first OVERVIEW, keeps every verifiable fact, passes the HVR greps, bumps the version field and gains a changelog entry. No SKILL.md, template, other skill README or vault file is touched. Rollback is a git revert of the rewrite commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| README validator | `validate_document.py --type readme` reports zero issues on the README (REQ-006) | validate_document.py |
| HVR grep | Zero em dashes, semicolons and Oxford commas in the README body (REQ-004) | rg -n |
| Link guard | No broken links in the README body | link guard |
| Version field | `version:` present in the README frontmatter (REQ-005) | rg |
| Changelog entry | `changelog/<version>.md` exists with the entry (REQ-005) | ls |
| Diff hygiene | `git diff --check` clean on the change set | git diff |
| Phase docs | `validate.sh` errors zero on this phase folder (REQ-009) | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `cli-pi/README.md` | Rewrite: one-line pitch blockquote, problem-first OVERVIEW with WHY THIS SKILL EXISTS, AT A GLANCE rows, capability and navigation sections per the refined template, VERIFICATION section, bumped version field |
| `cli-pi/changelog/<version>.md` | Add: changelog entry for the bumped version |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the README follows the refined template from phase 001 with the mcp-obsidian README as the worked shape. The rewrite reuses the current README's fact set, so capability, path and pinned-contract details survive the restructure. The version bump lands on the next version after the changelog head, closing the observed drift between the README frontmatter and the release log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Refined README template and mcp-obsidian exemplar read, section model recorded (T001)
- Current cli-pi README baseline recorded (`version: 1.2.0.0`, validator exit `0` with `0` issues, links `20/20` OK) (T002)
- Changelog head inventoried (`v1.3.0.0`, bump target `1.4.0.0`) (T003)

### Phase 2: Implementation
- One-line pitch blockquote and problem-first OVERVIEW drafted (T004)
- Body rewritten with the conductor model, output contracts, self-invocation guard and resource map (T004)
- Frontmatter version bumped to `1.4.0.0` (T005)
- `changelog/v1.4.0.0.md` entry added (T005)
- Section-by-section fact diff confirms no dispatch fact lost (T006)

### Phase 3: Verification
- Readme validator, HVR grep, link guard and `git diff --check` pass (T007, T008)
- `validate.sh` on the phase folder, the scope diff check and metadata regeneration pass (T009, T010)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The rewritten README is validated with `validate_document.py --type readme`, the HVR greps return zero em dashes, semicolons and Oxford commas in the README body, a link guard scans the README links, `git diff --check` confirms whitespace hygiene and a section-by-section diff against the pre-rewrite README confirms no fact is lost (REQ-007). The phase folder then runs `validate.sh` with zero errors. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined README template (phase 001) | Rewrite may miss template directives | Read the template and record its section model first |
| mcp-obsidian exemplar README | Style may drift from the pilot | Mirror the exemplar pitch and OVERVIEW shape |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record the output in the checklist |
| cli-pi changelog folder | Version bump may land on a wrong base | Inventory the changelog head before the bump |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README rewrite commit with `git revert` to restore the previous README and remove the changelog entry. The phase touches only the cli-pi README, its changelog folder and this phase folder, so the revert is clean and no SKILL.md, template, other skill README or vault file participates.
<!-- /ANCHOR:rollback -->
