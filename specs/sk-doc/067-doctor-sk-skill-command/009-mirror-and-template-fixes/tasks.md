---
title: "Tasks: Phase 9: mirror-and-template-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mirror and template fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: mirror-and-template-fixes

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

`DOC` is `.skilled/commands/doctor`. `TPL` is `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the Hermes check baseline (`scratch/before.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` output and exit code are in the file. Done: skills check `PASS: 65 Hermes skill copies in sync` exit 0, prompts check `PASS: 38 prompts are in sync.` exit 0.
- [x] T002 Record route-validate and run-all before the change (`scratch/before.md`). Verify: both exit codes are in the file. Done: route-validate exit 0 with 44 invocations, run-all exit 0 with 7 suites.
- [x] T003 [P] Rerun the template sweep (`scratch/sweep.md`). Verify: the file lists every hit and marks each stale or correct. Done: 11 hits, one stale (the leaf-manifest config template) and ten correct.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add both Hermes checks to the route's `script_invocations` (`DOC/_routes.yaml`). Verify: `rg -c "sync-skills-hermes.cjs --check" DOC/_routes.yaml` and `rg -c "sync-prompts-hermes.cjs --check" DOC/_routes.yaml` each print 1. Done: each printed 1, and `route-validate.sh` reports 46 invocations.
- [x] T005 Add `hermes_skills` and `hermes_prompts` to `upstream_assets`, a checker step for each with the n/a rule for an absent `.hermes/`, and a repair line for each (`DOC/assets/doctor-runtime-mirrors.yaml`). Verify: `bash DOC/scripts/route-validate.sh` exits 0. Done: exit 0, and each check's exact command string is in the workflow (`rg -c` prints 1 per file).
- [x] T006 Create the contract test (`DOC/scripts/tests/doctor-runtime-mirrors-contract.test.cjs`). Verify: `node --test DOC/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` passes, and fails with either check's line removed from either file. Done: 7 tests pass, and each of the four removals (two checks across two files) fails the run; `scratch/contract-fail-proof.md` holds all four.
- [x] T007 Fix the wording (`TPL`). Verify: `rg -n "in-SKILL.md router" .skilled/skills` exits 1 and `node -e "JSON.parse(require('fs').readFileSync('TPL','utf8'))"` exits 0. Done: rg exit 1, JSON parses with the same seven keys.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: every suite prints PASS. Done: 7 suites passed, 0 failed, 555 node tests.
- [x] T009 Run the template consumer test (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs`). Verify: `node --test` on it passes. Done: 1 test passed.
- [x] T010 Manual run of `/doctor:runtime-mirrors` with one Hermes skill copy edited, then restored by the generator. Verify: the run reports DRIFT with the `sync-skills-hermes.cjs` repair line, and in sync after the repair. Repeat with one Hermes prompt copy and the `sync-prompts-hermes.cjs` repair line. Done at the checker level, not on a live runtime: this run had no runtime attached, and the tracked `.hermes/` tree was outside its write authority, so the skills cycle ran against a scratch copy through `HERMES_SKILLS_OUTPUT_DIR` (`scratch/t010-drift-transcript.md`: in sync exit 0, `DRIFT sk-git` exit 1 after a hand edit, in sync exit 0 after the generator). The prompts checker exposes no output-root override, so its drift half ran on the tracked tree in the worktree: `STALE .hermes/prompts/create-agent.md` exit 1 after a hand edit, exit 0 after the generator, `.hermes/` clean.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the T010 transcript is saved in `scratch/t010-drift-transcript.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` section 6, decisions D8 and D9
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

A blocked task is marked `[B]` with the blocker named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines recorded in `scratch/before.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [x] CHK-011 [P0] The template parses as JSON
- [x] CHK-012 [P1] The new checker step maps exits the same way as its neighbours: 0 in sync, 1 drift, and an error is reported, never a pass
- [x] CHK-013 [P1] The route invokes only the `--check` form: the contract test refuses any `sync-*` or `install-*` invocation without it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, each row in `acceptance-criteria.md` carrying its evidence
- [x] CHK-021 [P0] The contract test passes and fails on a removed line, proven for both checks and both files in `scratch/contract-fail-proof.md`
- [x] CHK-022 [P1] Absent `.hermes/` gives an n/a row: both steps carry the rule and the contract test asserts it; the check form leaves an absent tree absent (`scratch/hermes-absent-n-a.md`)
- [x] CHK-023 [P1] `run-all.sh` and `create-journey-proof.test.cjs` pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: D8 is `instance-only` (one route), D9 is `class-of-bug` (template wording)
- [x] CHK-FIX-002 [P0] Same-class producer inventory for D9 completed by the sweep in `scratch/sweep.md`
- [x] CHK-FIX-003 [P1] Consumer inventory of the template recorded in `scratch/sweep.md` (`rg -n "skill-leaf-manifest-config-template" .skilled` returned seven path references, none of them a content hash)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The route stays read-only and runs no generator in write mode, asserted by the contract test on both the manifest and the workflow's mutation boundaries
- [x] CHK-031 [P1] N/A for input validation: the route takes no argument
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The sk-create-skill changelog records the template fix (phase 7 entry, or a new one if phase 7 already closed) — Evidence: `007-docs-and-changelogs` wrote it in `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.9.1.0.md:16` ("The leaf manifest config template now names the router in the sibling `ROUTER.md` rather than in `SKILL.md`") and `:24` (the bullet stating the new `leafRoots` wording), and both commits that touch the entry (`f26c2945ee` created it, `0a8bd93611` extended it) are ancestors of this worktree's head. Phase 7's entry covers the fix, so no separate entry was needed
- [x] CHK-042 [P1] `sync-prompts-hermes.cjs --check` is in the route, the YAML and the contract test
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines and transcripts live in `scratch/` only
- [x] CHK-051 [P1] scratch/ cleaned before completion: the throwaway copies live outside the packet, and the six files kept here are the ones the acceptance rows cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

CHK-041 closed once the changelog it waited on existed. The block named a file outside this phase's write
authority, and `007-docs-and-changelogs` wrote that entry, so the row is verified from the entry rather than
waived.

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



