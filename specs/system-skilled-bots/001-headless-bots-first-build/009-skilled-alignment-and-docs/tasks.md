---
title: "Tasks: Phase 9: skilled-alignment-and-docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled alignment and docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: skilled-alignment-and-docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-skilled-bots`. `R` is the alignment run folder `~/.local/state/local-skilled-alignment/system-skilled-bots/20261123T205442Z`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the missing docs baseline (`spec.md` Measured Behavior). Verify: the loop prints `missing` for all six folders.
- [x] T002 Run a fresh Opus xhigh review over the runtime logic (`scratch/opus-xhigh-review.md`). Verify: the file lists 1 P0, 5 P1 and 11 P2.
- [x] T003 Run `/local-skilled-alignment` over the branch (`R/report.md`). Verify: `R/findings.json` holds 40 findings. The devin lanes failed on quota and permission mode, and the operator switched to `--lanes vibe-deepseek`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add six code-folder READMEs (`S/runtime/**/README.md`, `S/scripts/**/README.md`). Verify: `audit_readmes.py --document-type code_folder` marks the four non-fixture READMEs `valid`, and `validate_document.py --no-exclude --type code_folder` prints `VALID` for both fixture READMEs.
- [x] T005 Add the feature catalog (`S/feature-catalog/`). Verify: `validate_catalog_package.py --package system-skilled-bots --strict` prints `PASS: 0 violations`.
- [x] T006 Add runtime playbook scenarios BOT-009 to BOT-025 and a scenario-to-catalog index (`S/manual-testing-playbook/`). Verify: `validate-playbook-package.cjs --package S/manual-testing-playbook` prints `PASS ... scenarios=25 ... violations=0 warnings=0`.
- [x] T007 Fix the confirmed Opus review findings test-first (`S/runtime/lib/*.ts`). Verify: `scratch/review-triage.md` names each disposition, and vitest runs 35 files and 372 tests.
- [x] T008 Rename the BOT.md template out of the doc gates (`S/assets/bot-template.txt`). Verify: `check-skill-doc-frontmatter.sh . --coverage` prints `violations=0`.
- [x] T009 Fix the literal and doc alignment findings (README counts, changelogs, command assets, env documents, deep-loop and cli read-only docs). Verify: each row of `scratch/alignment-triage.md` names its check.
- [x] T010 Add the bots runtime CI workflow through `/doctor:ci scaffold` (`.github/workflows/bots-runtime.yml`). Verify: `ci-report.cjs --json --no-gh` shows no flags for the file, and `check-gate-inputs.sh` prints `RESULT: PASSED`.
- [x] T011 Fix the hub routing vocabulary and activate the four `/bots:*` bridges (`S/hub-router.json`, `S/ROUTER.md`, `scoring-compatibility.json`). Verify: the two-stage replay (`scratch/routing-replay.txt`) routes all 14 in-domain probes to their mode at stage two and routes none of the 34 out-of-domain and 16 adjacent prompts there. Stage one ranks the hub first for 10 of the 14. P04, P09, "launch the triage bot" and "run the triage bot to write a summary" miss it, a shared-scorer limitation recorded in `implementation-summary.md`.
- [x] T012 Regenerate the compiled skill graph (`skill-graph.json`). Verify: `skill-graph-freshness.cjs --strict` exits 0 and reports no stale, missing or ghost entry for the 16 skills.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Rerun the runtime suite and typecheck from the final state. Verify: `Test Files  35 passed (35)` and typecheck exit 0. Observed from the staged tree: `Test Files  35 passed (35)`, `Tests  372 passed (372)`, typecheck exit 0.
- [x] T014 Recheck the alignment run (`--recheck R`). Verify: every row fixed here reads resolved. Observed: 5 resolved, 3 still open, 0 new, 33 needing review. The three open rows are the renamed template, the deferred release notes and the runner-set `SKILLED_BOT_RUN_ID`, each a recorded decision in `scratch/alignment-triage.md`.
- [x] T015 Validate this phase and the parent strictly. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both. Observed 2026-11-24: 009 `Errors: 0  Warnings: 0` `RESULT: PASSED`, and the parent with every child `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the two-stage replay and the BOT-025 dry run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-006, REQ-006 amended for the lane switch
- [x] CHK-002 [P0] Technical approach defined in plan.md: verify each finding, then fix at source
- [x] CHK-003 [P1] Dependencies identified and available: devin quota failed, cli-vibe used (plan.md section 6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks: bots `npm run typecheck` exit 0, `check-gate-inputs.sh` `RESULT: PASSED`
- [x] CHK-011 [P0] No console errors or warnings: parent-skill-check `0 warnings`, playbook validator `warnings=0`
- [x] CHK-012 [P1] Error handling implemented: an ordered keyword under two words fails the compile with `ORDERED_KEYWORD_INVALID`
- [x] CHK-013 [P1] Code follows project patterns: routing went through 008's pipeline, and CI through `/doctor:ci scaffold`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` reads Met, AC-010 by the strict runs of 009 and the parent
- [x] CHK-021 [P0] Manual testing complete: BOT-025 commands dry-run in a temp world, and the probes replayed through both stages
- [x] CHK-022 [P1] Edge cases tested: out-of-domain prompts at stage two all defer, and the run marker and off switch queue nothing
- [x] CHK-023 [P1] Error scenarios validated: the definition-drift and quarantine paths are covered by vitest
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the routing misses are `class-of-bug` (matcher shape), the read-only docs are `cross-consumer`, and the rest are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: a grep over system-deep-loop and cli-external-orchestration for the read-only refusal wording returns no live hit.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: every `bot-template` reference was updated, and the 706-prompt old-versus-new scoring pass left plain-keyword scores unchanged.
- [x] CHK-FIX-004 [P0] Parser fixes include adversarial cases: the canary gold holds whole-word negatives (robot, chatbot) and a gap-too-wide defer.
- [x] CHK-FIX-005 [P1] Matrix axes listed: probes by stage (two) and mode (four), in `scratch/alignment-triage.md`.
- [x] CHK-FIX-006 [P1] Hostile env variant executed: the post-commit harness runs with `SKILLED_BOT_RUN_ID` and `SYSTEM_BOTS_ENQUEUE_DISABLED` set.
- [x] CHK-FIX-007 [P1] Evidence is pinned: the review fixes are in `bd474396742`, and the routing replay is at policy `93ebae9de124` (`scratch/routing-replay.txt`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets: the CI file sets `persist-credentials: false` and reads no secret
- [x] CHK-031 [P0] Input validation implemented: the compiler rejects a malformed ordered keyword
- [x] CHK-032 [P1] Auth/authz: N/A, no auth surface. The workflow holds `contents: read` only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: the amended scope names every surface changed
- [x] CHK-041 [P1] Code comments adequate: no spec path or finding id in the engine comments (grep of the added lines)
- [x] CHK-042 [P2] README updated: root README and the workflows README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the review, triage and routing evidence kept as receipts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---



