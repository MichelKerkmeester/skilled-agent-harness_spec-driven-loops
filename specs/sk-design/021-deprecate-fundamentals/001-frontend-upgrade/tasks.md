---
title: "Tasks: Phase 1: frontend-upgrade"
description: "Ordered setup, authoring, routing and verification tasks for the sk-code frontend visual upgrade."
trigger_phrases:
  - "frontend upgrade tasks"
  - "sk-code-frontend visual reference tasks"
  - "phase 1 routing checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: frontend-upgrade

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

**Variables**: `R` is `.skilled/skills/sk-code/sk-code-frontend/references`. `P` is `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the baseline routing in the phase spec (`$P/spec.md`). Verify: the Measured Behavior block quotes `compiled-route --hub sk-code` deferring on five value prompts and the advisor sending a padding prompt to `sk-design` at 0.65.
- [x] T002 Write one dispatch brief per reference (`$P/scratch/task-1.md`, `task-2.md` and `task-3.md`). Verify: `ls $P/scratch/task-*.md` lists three files.
- [x] T003 Confirm the authoring targets exist before a dispatch starts (`$R/` and `.skilled/skills/sk-code/sk-code-frontend/assets/`). Verify: `ls` lists both directories.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Author the values reference (`$R/web-visual-values.md`). Verify: `validate_document.py` reports VALID 0 issues, the file is 566 lines and the item sequence runs V1 to V41.
- [x] T005 Author the hierarchy reference (`$R/web-visual-hierarchy.md`). Verify: `validate_document.py` reports VALID 0 issues, the file is 618 lines, the diagnosis rows total 40, the review rows total 21 and the UX law rows total 21.
- [x] T006 Author the motion reference (`$R/web-motion-and-interaction.md`). Verify: `validate_document.py` reports VALID 0 issues.
- [x] T007 Move the token file into the frontend assets (`.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css`). Verify: `ls` prints the new path and its header cites no book.
- [x] T008 Replace the shadow-only focus advice with links to A5 and A8 (`$R/web-motion-and-interaction.md`, `$R/web-visual-values.md` and `$R/web-visual-hierarchy.md`). Verify: `rg -n 'A5|A8'` over the three files prints the links.
- [x] T009 Add the three stage-two intents (`.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`). Verify: `rg -n 'WEB_VISUAL_VALUES|WEB_VISUAL_HIERARCHY|WEB_MOTION' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints three intent lines.
- [x] T010 Add six accessibility phrases to `WEB_A11Y` (`.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`). Verify: `rg -n 'WEB_A11Y' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints the intent line with the new focus phrases.
- [x] T011 Add the `code-frontend-visual` vocabulary class (`.skilled/skills/sk-code/hub-router.json`). Verify: `rg -n 'code-frontend-visual' .skilled/skills/sk-code/hub-router.json` prints the class and its router signal.
- [x] T012 Add 88 screen-design intent signals (`.skilled/skills/sk-code/graph-metadata.json`). Verify: `generate-router-intent-signals --check sk-code` prints orphans=0 missing=0 PASSED.
- [x] T013 Mirror the three intents into the hub resource map (`.skilled/skills/sk-code/ROUTER.md`). Verify: the drift guards report all 4 guards PASSED.
- [x] T014 Repoint the documents that cited the fundamentals assets (`$R/frontend-practice.md`, `$R/web-markup-and-css.md`, `$R/figma-to-code.md`, `.skilled/skills/sk-code/SKILL.md` and `.skilled/skills/sk-code/README.md`). Verify: `check-markdown-links` prints 0 broken markdown links across 14494 links.
- [x] T015 Bump both versions and write the changelogs (`.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/sk-code-frontend/SKILL.md`, `changelog/v3.11.0.0.md` and `changelog/v1.1.0.0.md`). Verify: `rg -n 'version: 3.11.0.0' .skilled/skills/sk-code/SKILL.md` and `rg -n 'version: 1.1.0.0' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` each print one line and both changelog files exist.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T016 Validate the three references and the two changelogs. Verify: `validate_document.py` reports VALID 0 issues on each file.
- [x] T017 Run the leak grep over the three references. Verify: `rg -n 'fundamentals|sk-design|refactoring|research|specs/|slide|print|em dash' $R/web-visual-values.md $R/web-visual-hierarchy.md $R/web-motion-and-interaction.md` prints no line.
- [x] T018 Compare the shared scales across the references. Verify: the spacing, type and opacity scale blocks are byte-exact.
- [x] T019 Replay stage one against the advisor. Verify: padding resolves to sk-code 0.63, type scale to 0.88, palette to 0.88, looks wrong to 0.90 and dropdown animation to 0.82.
- [x] T020 Replay stage two against the sk-code hub. Verify: all eight value, review and motion prompts route to `sk-code-frontend` and the vitest prompt still routes to `sk-code-skilled`.
- [x] T021 Run the sk-code parent-skill check. Verify: the output reads `OK: parent-skill-check` with all hard invariants passed and 0 warnings at exit 0.
- [x] T022 Run the sk-code drift guards (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). Verify: all 4 guards PASSED with 11 non-blocking warnings, the same count as the main baseline.
- [x] T023 Check compiled-route sync. Verify: `compiled-route-sync --check` reports all 55 served copies match and `--verify` reports the move simulation resolves all 7 hubs.
- [x] T024 Run the router vocabulary reach check across all 7 hubs. Verify: RESULT PASSED with wrong-hub=0 outranked=0 no-reach=0 and sk-code declared phrases at 172 from 94.
- [x] T025 Regenerate and check the runtime mirrors. Verify: `sync-agents`, `sync-agents-pi` and `sync-skills-hermes` report PASS on `--check`, and `runtime-mirrors --check` reports PASS for 213 mirrors.
- [x] T026 Run the packet gate. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade --strict` prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The packet gate prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent phase map**: See `../spec.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: REQ-001 to REQ-010 cover the three references, the token move, the routing and the versions.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: the architecture section names the two routing stages and their owners.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the three dispatch briefs sit in `scratch/task-{1,2,3}.md` and every gate tool ran.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Documents pass lint and format checks. Evidence: `validate_document.py` reports VALID 0 issues on all three new references.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the change adds Markdown and JSON only, and the validator and drift guards print no error.
- [x] CHK-012 [P1] Error handling implemented. Evidence: no executable code is added. The failure path is a stale link, which `check-markdown-links` catches.
- [x] CHK-013 [P1] Documents follow project patterns. Evidence: each reference carries the standard frontmatter and section shape that `validate_document.py` accepts.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` records every row as Met with its command.
- [x] CHK-021 [P0] Manual testing complete. Evidence: both routing stages replay the value, review and motion prompts against the new references.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a no-signal prompt defers and the sk-design stage-two replay records it.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: `check-markdown-links` reports 0 broken links across 14494 links.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The reported gap is a class-of-bug: every value prompt on the sk-code surface deferred because the surface owned no value guidance.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the baseline records five value prompts deferring and the three references now cover all five.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md` lists the five repointed documents, the two router files and the graph metadata.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction cases are not applicable. Evidence: the change adds no executable code.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts are listed. Evidence: stage one has five value prompts and stage two has eight value, review and motion prompts.
- [x] CHK-FIX-006 [P1] Hostile environment variant is not applicable. Evidence: the routing replay runs on the refreshed advisor cache and no test reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the baseline commit `10474a9567` recorded in `scratch/facts.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change adds Markdown and JSON only.
- [x] CHK-031 [P0] Input validation is not applicable. Evidence: no input is parsed by the new documents.
- [x] CHK-032 [P1] Auth and authz are not applicable. Evidence: the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized. Evidence: all three name the three references, the token move and the routing intents.
- [x] CHK-041 [P1] Code comments are adequate. Evidence: the validator's comment-hygiene rule finds no ephemeral marker.
- [x] CHK-042 [P2] README updated. Evidence: `.skilled/skills/sk-code/README.md` points at the new reference paths.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: the three dispatch briefs and the evidence file sit under `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds no stray output. Evidence: the three briefs and `facts.md` are the recorded evidence and nothing else was added.
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

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
