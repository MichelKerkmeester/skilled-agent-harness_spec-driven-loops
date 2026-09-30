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

- [x] T001 Recheck the owner state: `git status --short -- .skilled/skills/sk-prompt` prints nothing, and `git log -5 --format='%h %ad %s' --date=short -- .skilled/skills/sk-prompt` shows no new commit touching `SKILL.md` or the registry since `ee5852eae6`. Reread any line that moved (`.skilled/skills/sk-prompt/`). Evidence: `git status --short -- .skilled/skills/sk-prompt .hermes/skills/sk-prompt` printed nothing. `git log -5` lists `094cdb9f8a` (2026-09-27) as the newest skill commit, newer than `ee5852eae6`, but it adds search metadata to `changelog/*.md` only and touches neither edited file. No commit after `86e99e7fc1` touches `SKILL.md`. `sync-skills-hermes.cjs --check` printed `PASS: 71 Hermes skill copies in sync`, exit 0. The build-start HEAD `6f47c32dce` became the AC-007 diff base
- [x] T002 Record the baseline of `plan.md` section 5 in `implementation-summary.md`: byte counts, registry `node -p`, both sk-doc validators and the card sync guard (`implementation-summary.md`). Evidence: 23081, 36580, 3066, 3950, 2670 and 538 bytes, `rcaf,race,cidi,tidd-ec,costar false false`, `validate_document.py` `VALID`, `quick_validate.py` `Skill is valid!` and `GUARD PASS`, each exit 0
- [x] T003 [P] Record the sweep foundation baseline: `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` from `.skilled/skills/system-deep-loop/deep-improvement/scripts`, output and exit status (`implementation-summary.md`). Evidence: `Tests  26 passed (26)`, exit 0
- [x] T004 [P] Read the owner's latest changelog file to learn where and how this entry goes (`.skilled/skills/sk-prompt/changelog/v3.0.1.0.md`). Evidence: the new `v3.0.2.0.md` follows its format, frontmatter, the `> Spec folder:` line and the `What's New at a Glance` and `Upgrade` sections
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rewrite the registry's top-level `description`: code-task benchmark scaffolds for five of the skill's seven frameworks, CRISPE and CRAFT without a scaffold, `references/patterns-evaluation.md` as the source of the framework set. Leave every entry untouched (`.skilled/skills/sk-prompt/assets/framework-registry.json`). Evidence: brief 01, commit `e3cf07f4f9`. `node -p` prints `rcaf,race,cidi,tidd-ec,costar true true` and `git diff --numstat` prints `1 1`
- [x] T006 Add the section-read rule below the `### Resource Loading Levels` table: read `## 2. FRAMEWORK LIBRARY & SELECTION`, then only the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES`, then `## 10. CLEAR EVALUATION MASTERY`. A framework switch reads the new subsection, an unmatched name reads all of section 3, an on-demand keyword reads the whole file (`.skilled/skills/sk-prompt/SKILL.md`). Evidence: brief 02, commit `e3cf07f4f9`. `sed -n '100p;108p'` prints the rule's first line, then `### Smart Router Pseudocode`
- [x] T007 Amend the `patterns-evaluation.md` bullet in `### Deterministic Agent Rules` to name the same three sections (`.skilled/skills/sk-prompt/SKILL.md`). Evidence: brief 02, commit `e3cf07f4f9`. `grep -c` prints 2 for `FRAMEWORK DEEP DIVES` and 2 for `CLEAR EVALUATION MASTERY`, and `git diff --numstat` prints `9 1` for this brief
- [x] T008 Add one changelog entry for both changes, following the convention read in T004 (`.skilled/skills/sk-prompt/changelog/`). Evidence: brief 04 created `changelog/v3.0.2.0.md`. `validate_document.py` on it prints `VALID` and `Document type: changelog`, exit 0. Brief 03 moved the `SKILL.md` frontmatter `version` from 3.0.1.0 to 3.0.2.0 to match, and `sed -n 5p` prints `version: 3.0.2.0`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Happy path: rerun the registry `node -p` (expect `rcaf,race,cidi,tidd-ec,costar true true`) and `grep -c` for `FRAMEWORK DEEP DIVES` and `CLEAR EVALUATION MASTERY` in `SKILL.md` (expect at least 2 each). Evidence: `rcaf,race,cidi,tidd-ec,costar true true`, `deep=2 clear=2`, each exit 0
- [x] T010 Edge cases: `git diff` of the registry shows one changed line, and `grep -c '"all frameworks"' .skilled/skills/sk-prompt/SKILL.md` still prints 1. Evidence: registry numstat `1 1`, `allfw=1`
- [x] T011 Measure: the `sed` counts of `plan.md` section 5 for TIDD-EC and CRAFT and `wc -c` of `SKILL.md`. Record before and after totals (`implementation-summary.md`). Evidence: `SKILL.md` 23893 bytes. Sections 2 and 10 print 3066 and 3950, CRAFT 2670 and TIDD-EC 538, so the CRAFT read is 9,686 bytes and the TIDD-EC read 7,554. Before 59,661 bytes, after at most 33,579
- [x] T012 Regression: `validate_document.py` on `SKILL.md`, `quick_validate.py` on the skill, the card sync guard and the sweep foundation test, each with output and exit status. If phase 012 has landed, note it. Evidence: `VALID`, `Skill is valid!`, `GUARD PASS` and `Tests  26 passed (26)`, each exit 0. Phase 012 has not landed: its `spec.md` still reads Status Planned
- [x] T013 Scope check: `git diff --name-only -- .skilled/skills/sk-prompt` lists `SKILL.md`, `assets/framework-registry.json` and one changelog file, nothing else. Evidence: before the commit `git status --short` printed ` M SKILL.md`, ` M assets/framework-registry.json` and `?? changelog/v3.0.2.0.md`. After it, `git diff --name-only 6f47c32dce..HEAD -- .skilled/skills/sk-prompt` lists exactly those three files. The commit also carries the regenerated Hermes mirror `.hermes/skills/sk-prompt/SKILL.md`, outside this path (see the `goal.md` log)
- [x] T014 Update `implementation-summary.md`, `acceptance-criteria.md` and the `goal.md` log with the evidence, then run `validate.sh --strict` and `check-goal.cjs` on this folder. Evidence: the three docs record the evidence. `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` exits 0 on the final state (`implementation-summary.md` Verification)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. Evidence: T009 to T013
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 to 5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6. Phase 012 has not landed, so the validators ran unchanged
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `framework-registry.json` still parses and `validate_document.py` prints `VALID` for `SKILL.md`. Evidence: the `node -p` over the registry prints `rcaf,race,cidi,tidd-ec,costar true true`, and `validate_document.py` prints `VALID`, exit 0
- [x] CHK-011 [P0] No new finding from `quick_validate.py` on `.skilled/skills/sk-prompt`. Evidence: `Skill is valid!`, exit 0, before and after
- [x] CHK-012 [P1] The rule covers the fallbacks: framework switch, unmatched name and on-demand keyword. Evidence: the rule's item 2 names the switch and the unmatched name, and its closing line sends an on-demand keyword to the whole file (`git diff 6f47c32dce..HEAD -- .skilled/skills/sk-prompt/SKILL.md`)
- [x] CHK-013 [P1] Edits follow the owner's `SKILL.md` structure: the router pseudocode block stays the one authoritative routing block. Evidence: the rule sits between the loading table and `### Smart Router Pseudocode`, and the diff leaves the pseudocode block untouched
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 7/7 Met
- [x] CHK-021 [P0] Byte measurement recorded for TIDD-EC and CRAFT. Evidence: `implementation-summary.md` Verification, 7,554 and 9,686 bytes
- [x] CHK-022 [P1] Edge cases tested: one changed registry line, on-demand keyword line intact. Evidence: registry numstat `1 1`, `allfw=1`
- [x] CHK-023 [P1] Sweep foundation test and card sync guard pass. Evidence: `Tests  26 passed (26)` and `GUARD PASS`, each exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Class: `instance-only`, two docs statements in one skill
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `plan.md` affected surfaces, the `rg -n 'framework-registry'` inventory. No other reader uses the `description` field
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `plan.md` affected surfaces lists the `patterns-evaluation` consumers, all by path. `git diff --quiet 6f47c32dce..HEAD -- .skilled/skills/sk-prompt/references .skilled/agents` exits 0
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: a docs change with no security, path, parser or redaction surface
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected surfaces lists intent by framework by on-demand keyword and the rows that matter
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: no code changed and no check reads process-wide state the change affects
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: build commit `e3cf07f4f9`, diff range `6f47c32dce..e3cf07f4f9`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff of `e3cf07f4f9` adds prose and one JSON string, with no credential or token
- [x] CHK-031 [P0] No model call or network call during the build or its checks. Superseded for the build method by parent D5 (operator, 2026-09-27): CLI executors write the edits, so the four edits were written by `pi` over `llmgateway/deepseek-v4.1-flash`. The change itself is static text, no check makes a model or network call, and no Jev or Deem call was made
- [x] CHK-032 [P1] No `.env` file opened. The orchestrator opened none. Each brief's DON'T block forbids it, and each of the four handbacks names only its target file. No tool trace records the executor's reads, so the executor side rests on that rule and its handback
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, tasks, acceptance criteria, goal and summary agree on Complete
- [x] CHK-041 [P1] No spec path, phase number or requirement id in the edited skill text. Evidence: `grep -c -E 'specs/|REQ-[0-9]|AC-[0-9]|cli-jev'` over the added lines of `SKILL.md` and the registry prints 0. The changelog's `> Spec folder:` line follows the owner's convention, as in `v3.0.1.0.md` line 14
- [x] CHK-042 [P2] sk-prompt changelog entry written. Evidence: `changelog/v3.0.2.0.md`, `VALID`, exit 0
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `git status --short` on this folder shows only doc edits and `scratch/briefs/`, and the sk-prompt scope check lists only the three intended files
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `scratch/briefs/` is kept on purpose as the record of what each executor was sent; nothing else is in `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27. CHK-031 is superseded by parent D5 for the build method, and CHK-051 keeps `scratch/briefs/` as a recorded deviation
<!-- /ANCHOR:summary -->

---



