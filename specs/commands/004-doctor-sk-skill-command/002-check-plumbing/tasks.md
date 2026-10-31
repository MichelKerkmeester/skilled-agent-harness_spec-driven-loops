---
title: "Tasks: Phase 2: check-plumbing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "check plumbing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: check-plumbing

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

`DOC` is `.skilled/commands/doctor`. `CMD` is `.skilled/skills/sk-doc/sk-create-command`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load the owning workflow through `/create:command` (`.skilled/commands/create/command.md`): read `CMD/SKILL.md`, `CMD/ROUTER.md` and `CMD/references/router-presentation-split.md`. Verify: the three paths are recorded in `goal.md` section 4 before any surface is written.
- [x] T002 Confirm phase 001 closed (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test` on it exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the router from `CMD/assets/command-router-template.md` (`DOC/sk-skill.md`). Verify: its numbered sections match the template's headings.
- [x] T004 [P] Author the presentation from `CMD/assets/command-presentation-template.md` (`DOC/assets/doctor-sk-skill-presentation.txt`). Verify: the target menu lists `check`.
- [x] T005 [P] Author the check workflow from `CMD/assets/command-template.md` (`DOC/assets/doctor-sk-skill-check.yaml`). Verify: it invokes `node .skilled/commands/doctor/scripts/sk-skill-check.cjs`.
- [x] T006 Append the `check` route per the header steps (`DOC/_routes.yaml:44-48`) with `mutating: read-only` and no `default_target`, since `check` is the command's only target. Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [x] T007 Add `/doctor:sk-skill` to `families.doctor` (`CMD/assets/command-contract.json:194`) and validate the file against `CMD/assets/command-contract.schema.json`. Verify: the schema check reports no errors.
- [x] T008 [P] Add the `/doctor:sk-skill check` row (`DOC/assets/doctor-setup-presentation.txt`). Verify: `rg -n 'doctor:sk-skill check' DOC/assets/doctor-setup-presentation.txt` prints one line.
- [x] T009 Generate command mirrors with the sync scripts, never by hand (`.claude/commands/doctor/sk-skill.md`, `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md`). Verify: each path exists.
- [x] T010 Write the contract test, including template conformance of router, presentation and YAML (`DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `node --test` on it exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: it reports all PASS.
- [x] T012 Run the mirror checks (`validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `command-catalog-mirror-check.cjs`). Verify: all four exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `route-validate.sh` exits 0 with `/doctor:sk-skill check` routed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 3, "Surfaces the new command itself must land on"
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] sk-create-command SKILL.md, ROUTER.md and `router-presentation-split.md` read before the first surface
- [x] CHK-003 [P1] Phase 001 test passes — evidence: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` passes in the 600-test doctor node suite
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `route-validate.sh` exits 0 — evidence: exit 0, `OK: route-validate — 19 routes validated, 3 warnings`
- [x] CHK-011 [P0] `command-contract.json` validates against its schema — evidence: jsonschema 4.25.1 Draft7Validator, 0 errors; the same validator reports 2 errors once `families.doctor.topology` is removed
- [x] CHK-012 [P1] Router, presentation and YAML follow the sk-create-command templates — evidence: the six canonical router sections in order, the presentation's menu and result templates, and the workflow's read-only shape are asserted by `doctor-sk-skill-contract.test.cjs` (14 of 14 pass)
- [x] CHK-013 [P1] No mirror written by hand — evidence: only `sync-runtime-mirrors.cjs`, `sync-prompts.cjs`, `sync-prompts-pi.cjs` and `sync-prompts-hermes.cjs` ran, each reporting what it wrote
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] `run-all.sh` all PASS — evidence: exit 0, `7 suite(s) passed, 0 failed`, node suite `tests 600 / pass 600 / fail 0`
- [x] CHK-022 [P1] Four mirror checks pass — evidence: parity, codex, pi and catalog each exit 0; the Hermes prompt check also exits 0 with 39 prompts in sync
- [x] CHK-023 [P1] Bare command resolves to `check` — evidence: `check` is the only route, so the bare command reaches it, and the router's MODE ROUTING binds `check` when no target is typed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The `check` route is `mutating: read-only` — evidence: the route line and the presentation's manifest row both read `read-only`
- [x] CHK-032 [P1] N/A for auth: doctor commands run locally with no credential
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Router and presentation agree on the target list — evidence: both carry `check` only, and route validator J1 reports parity across 9 commands
- [x] CHK-042 [P2] README entries deferred to phase 007 — evidence: the command index row and its group count were added so the catalog gate passes; README.md and the changelogs stay with phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — evidence: run logs were written outside the repository; the phase `scratch/` folder stays empty
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
