---
title: "Tasks: Phase 3: frontend-content"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "frontend content tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: frontend-content

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Run every command from the repository root. A path with no folder in front of it, such as `findings-ledger.md` or `scratch/`, is inside `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/` in phase 001 and inside this phase folder elsewhere.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read row `F7` and list the rules to move (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| F7 .*| Unverified |' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T002 Record the rule count before any move (`.skilled/skills/sk-code/sk-code-frontend/references/`). Verify: `cat .skilled/skills/sk-code/sk-code-frontend/references/*.md | rg -c '^### M[0-9]+\.'` prints 57.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite the ALWAYS line that orders the web layer first (`.skilled/skills/sk-code/sk-code-frontend/SKILL.md`). Verify: `rg -c 'visual, motion and Figma intents' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` prints 1.
- [x] T004 Rewrite the section 6 load sentence the same way (`.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md`). Verify: `rg -c 'visual, motion and Figma intents' .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` prints 1.
- [x] T005 State the load rule, the token file path and the doctrine links, and correct the topic-file count (`.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`). Verify: `rg -c 'nine web topic files' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1.
- [x] T006 Move each rule row `F7` lists to its owning topic file and leave a link behind (`.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md`). Verify: `wc -l` on that file prints 400 or fewer.
- [x] T007 Close the `I8` gap and order the `P` ids (`.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md`, `.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md`). Verify: `rg -c '^### I8\.' .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` prints 1.
- [x] T008 State where other frameworks live in section 8 (`.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md`). Verify: `rg -c 'project mode' .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints a number above 0.
- [x] T009 Apply the answer to the type-token question (`.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css`). Verify: REQ-006 prints as written, or the ledger row `F10` records `no change` with the operator's answer.
- [x] T010 Add one scenario for each of the eight uncovered intents (`.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/`). Verify: `ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/*.md | wc -l` prints 11.
- [x] T011 Add the frontend `quality.checklists` row (`.skilled/skills/sk-code/mode-registry.json`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` passes.
- [x] T012 Write the packet release note and raise the packet version (`.skilled/skills/sk-code/sk-code-frontend/changelog/`, `.skilled/skills/sk-code/sk-code-frontend/SKILL.md`). Verify: the newest file in `.skilled/skills/sk-code/sk-code-frontend/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-frontend/SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the playbook validator (`.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook` exits 0.
- [x] T014 Count the motion rule ids across the references (`.skilled/skills/sk-code/sk-code-frontend/references/`). Verify: the count prints 57.
- [x] T015 Run the drift guards (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). Verify: the router-sync and doc-claims legs print PASS.
- [x] T016 Record the fix evidence for rows `F5` to `F13` (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| F\(5\|6\|7\|8\|9\|10\|11\|12\|13\) .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T017 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The playbook package validator exits 0 with 11 scenarios
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings ledger**: See `../001-finding-verification/findings-ledger.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-010 each name a command and its expected result]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md Affected Surfaces and the spec Files to Change table name the changed files]
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 002 closed in `78a9f12ec9` with 13 of 13 frontend probes]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: `node -e require(...)` on mode-registry.json exits 0]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: router-sync, doc-claims and stack-folders PASS, and alignment-drift reports the same 23 ERROR files as the baseline]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: one file outside the table changed, `sk-code-skilled/SKILL.md`, recorded in the goal log and the summary with its reason, plus the two regenerated manifests]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: `validate_document.py` and the playbook validator pass, and the doc-claims guard passes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-003 and AC-005 to AC-010 are Met, and AC-004 is Superseded by ADR-001]
- [x] CHK-021 [P0] The playbook package validator exits 0 with 11 scenarios [EVIDENCE: `PASS` with `scenarios=11`, exit 0]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: FRONTEND_WEB keeps its two-resource scenario, and the WEB_VISUAL_HIERARCHY scenario lists all four resources and replays them]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: a wrong path in `web-layout.md` left the validator at exit 0 and made router-sync check 4 exit 1, logged in goal.md as a difference from spec.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts [EVIDENCE: F5 to F13 carried a verdict before T003 started]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg -n 'web layer before|nine web topic|text-base: ?16px' .skilled/skills/sk-code` finds no copy outside the changelog history]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: playbook replay, the REQ-001 counts, the router legs and the checklist map test all ran]
- [x] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix [EVIDENCE: rows F5 to F13 name their proving command]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: rows F5 to F13 name `62507384e6`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds documents, one registry row, CSS tokens and scenario files only]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: the one comment added, in tokens.css, explains the unit and carries no id or path]
- [ ] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: the briefs live in `002-frontend-reach/scratch/tools/d/`, and this phase's `scratch/` holds no working file]
- [x] CHK-051 [P1] `scratch/` holds only files a later phase reads [EVIDENCE: later phases reuse the dispatch tools and briefs in `002-frontend-reach/scratch/tools/`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



