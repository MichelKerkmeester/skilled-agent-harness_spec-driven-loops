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

- [ ] T001 Record the Hermes check baseline (`scratch/before.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` output and exit code are in the file.
- [ ] T002 Record route-validate and run-all before the change (`scratch/before.md`). Verify: both exit codes are in the file.
- [ ] T003 [P] Rerun the template sweep (`scratch/sweep.md`). Verify: the file lists every hit and marks each stale or correct.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add both Hermes checks to the route's `script_invocations` (`DOC/_routes.yaml`). Verify: `rg -c "sync-skills-hermes.cjs --check" DOC/_routes.yaml` and `rg -c "sync-prompts-hermes.cjs --check" DOC/_routes.yaml` each print 1.
- [ ] T005 Add `hermes_skills` and `hermes_prompts` to `upstream_assets`, a checker step for each with the n/a rule for an absent `.hermes/`, and a repair line for each (`DOC/assets/doctor-runtime-mirrors.yaml`). Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T006 Create the contract test (`DOC/scripts/tests/doctor-runtime-mirrors-contract.test.cjs`). Verify: `node --test DOC/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` passes, and fails with either check's line removed from either file.
- [ ] T007 Fix the wording (`TPL`). Verify: `rg -n "in-SKILL.md router" .skilled/skills` exits 1 and `node -e "JSON.parse(require('fs').readFileSync('TPL','utf8'))"` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: every suite prints PASS.
- [ ] T009 Run the template consumer test (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs`). Verify: `node --test` on it passes.
- [ ] T010 Manual run of `/doctor:runtime-mirrors` with one Hermes skill copy edited, then restored by the generator. Verify: the run reports DRIFT with the `sync-skills-hermes.cjs` repair line, and in sync after the repair. Repeat with one Hermes prompt copy and the `sync-prompts-hermes.cjs` repair line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the T010 transcript is saved in `scratch/`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baselines recorded in `scratch/before.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] CHK-011 [P0] The template parses as JSON
- [ ] CHK-012 [P1] The new checker step maps exits the same way as its neighbours
- [ ] CHK-013 [P1] The route invokes only the `--check` form
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The contract test passes and fails on a removed line
- [ ] CHK-022 [P1] Absent `.hermes/` gives an n/a row
- [ ] CHK-023 [P1] `run-all.sh` and `create-journey-proof.test.cjs` pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding has a class: D8 is `instance-only` (one route), D9 is `class-of-bug` (template wording)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory for D9 completed by the sweep in `scratch/sweep.md`
- [ ] CHK-FIX-003 [P1] Consumer inventory of the template recorded (`rg -n "skill-leaf-manifest-config-template" .skilled`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The route stays read-only and runs no generator in write mode
- [ ] CHK-031 [P1] N/A for input validation: the route takes no argument
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The sk-create-skill changelog records the template fix (phase 7 entry, or a new one if phase 7 already closed)
- [ ] CHK-042 [P1] `sync-prompts-hermes.cjs --check` is in the route, the YAML and the contract test
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines and transcripts live in `scratch/` only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



