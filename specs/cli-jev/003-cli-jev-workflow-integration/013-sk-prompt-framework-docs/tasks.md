---
title: "Tasks: Phase 13: sk-prompt framework docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-prompt framework docs tasks"
  - "framework registry description task"
  - "patterns-evaluation section read task"
  - "sk-prompt byte measurement task"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: sk-prompt framework docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Recheck the owner state: `git status --short -- .skilled/skills/sk-prompt` prints nothing, and `git log -5 --format='%h %ad %s' --date=short -- .skilled/skills/sk-prompt` shows no new commit touching `SKILL.md` or the registry since `ee5852eae6`. Reread any line that moved (`.skilled/skills/sk-prompt/`)
- [ ] T002 Record the baseline of `plan.md` section 5 in `implementation-summary.md`: byte counts, registry `node -p`, both sk-doc validators and the card sync guard (`implementation-summary.md`)
- [ ] T003 [P] Record the sweep foundation baseline: `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` from `.skilled/skills/system-deep-loop/deep-improvement/scripts`, output and exit status (`implementation-summary.md`)
- [ ] T004 [P] Read the owner's latest changelog file to learn where and how this entry goes (`.skilled/skills/sk-prompt/changelog/v3.0.1.0.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rewrite the registry's top-level `description`: code-task benchmark scaffolds for five of the skill's seven frameworks, CRISPE and CRAFT without a scaffold, `references/patterns-evaluation.md` as the source of the framework set. Leave every entry untouched (`.skilled/skills/sk-prompt/assets/framework-registry.json`)
- [ ] T006 Add the section-read rule below the `### Resource Loading Levels` table: read `## 2. FRAMEWORK LIBRARY & SELECTION`, then only the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES`, then `## 10. CLEAR EVALUATION MASTERY`. A framework switch reads the new subsection, an unmatched name reads all of section 3, an on-demand keyword reads the whole file (`.skilled/skills/sk-prompt/SKILL.md`)
- [ ] T007 Amend the `patterns-evaluation.md` bullet in `### Deterministic Agent Rules` to name the same three sections (`.skilled/skills/sk-prompt/SKILL.md`)
- [ ] T008 Add one changelog entry for both changes, following the convention read in T004 (`.skilled/skills/sk-prompt/changelog/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Happy path: rerun the registry `node -p` (expect `rcaf,race,cidi,tidd-ec,costar true true`) and `grep -c` for `FRAMEWORK DEEP DIVES` and `CLEAR EVALUATION MASTERY` in `SKILL.md` (expect at least 2 each)
- [ ] T010 Edge cases: `git diff` of the registry shows one changed line, and `grep -c '"all frameworks"' .skilled/skills/sk-prompt/SKILL.md` still prints 1
- [ ] T011 Measure: the `sed` counts of `plan.md` section 5 for TIDD-EC and CRAFT and `wc -c` of `SKILL.md`. Record before and after totals (`implementation-summary.md`)
- [ ] T012 Regression: `validate_document.py` on `SKILL.md`, `quick_validate.py` on the skill, the card sync guard and the sweep foundation test, each with output and exit status. If phase 012 has landed, note it
- [ ] T013 Scope check: `git diff --name-only -- .skilled/skills/sk-prompt` lists `SKILL.md`, `assets/framework-registry.json` and one changelog file, nothing else
- [ ] T014 Update `implementation-summary.md`, `acceptance-criteria.md` and the `goal.md` log with the evidence, then run `validate.sh --strict` and `check-goal.cjs` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `framework-registry.json` still parses and `validate_document.py` prints `VALID` for `SKILL.md`
- [ ] CHK-011 [P0] No new finding from `quick_validate.py` on `.skilled/skills/sk-prompt`
- [ ] CHK-012 [P1] The rule covers the fallbacks: framework switch, unmatched name and on-demand keyword
- [ ] CHK-013 [P1] Edits follow the owner's `SKILL.md` structure: the router pseudocode block stays the one authoritative routing block
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Byte measurement recorded for TIDD-EC and CRAFT
- [ ] CHK-022 [P1] Edge cases tested: one changed registry line, on-demand keyword line intact
- [ ] CHK-023 [P1] Sweep foundation test and card sync guard pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No model call or network call during the build or its checks
- [ ] CHK-032 [P1] No `.env` file opened
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] No spec path, phase number or requirement id in the edited skill text
- [ ] CHK-042 [P2] sk-prompt changelog entry written
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified yet. The phase is Planned
<!-- /ANCHOR:summary -->

---



