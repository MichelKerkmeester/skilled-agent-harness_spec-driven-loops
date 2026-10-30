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

- [ ] T001 Load the owning workflow through `/create:command` (`.skilled/commands/create/command.md`): read `CMD/SKILL.md`, `CMD/ROUTER.md` and `CMD/references/router-presentation-split.md`. Verify: the three paths are recorded in `goal.md` section 4 before any surface is written.
- [ ] T002 Confirm phase 001 closed (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test` on it exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author the router from `CMD/assets/command-router-template.md` (`DOC/sk-skill.md`). Verify: its numbered sections match the template's headings.
- [ ] T004 [P] Author the presentation from `CMD/assets/command-presentation-template.md` (`DOC/assets/doctor-sk-skill-presentation.txt`). Verify: the target menu lists `check`.
- [ ] T005 [P] Author the check workflow from `CMD/assets/command-template.md` (`DOC/assets/doctor-sk-skill-check.yaml`). Verify: it invokes `node .skilled/commands/doctor/scripts/sk-skill-check.cjs`.
- [ ] T006 Append the `check` route per the header steps (`DOC/_routes.yaml:44-48`) with `default_target: true` and `mutating: read-only`. Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T007 Add `/doctor:sk-skill` to `families.doctor` (`CMD/assets/command-contract.json:194`) and validate the file against `CMD/assets/command-contract.schema.json`. Verify: the schema check reports no errors.
- [ ] T008 [P] Add the `/doctor:sk-skill check` row (`DOC/assets/doctor-setup-presentation.txt`). Verify: `rg -n 'doctor:sk-skill check' DOC/assets/doctor-setup-presentation.txt` prints one line.
- [ ] T009 Generate command mirrors with the sync scripts, never by hand (`.claude/commands/doctor/sk-skill.md`, `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md`). Verify: each path exists.
- [ ] T010 Write the contract test, including template conformance of router, presentation and YAML (`DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `node --test` on it exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: it reports all PASS.
- [ ] T012 Run the mirror checks (`validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `command-catalog-mirror-check.cjs`). Verify: all four exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `route-validate.sh` exits 0 with `/doctor:sk-skill check` routed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] sk-create-command SKILL.md, ROUTER.md and `router-presentation-split.md` read before the first surface
- [ ] CHK-003 [P1] Phase 001 test passes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `route-validate.sh` exits 0
- [ ] CHK-011 [P0] `command-contract.json` validates against its schema
- [ ] CHK-012 [P1] Router, presentation and YAML follow the sk-create-command templates
- [ ] CHK-013 [P1] No mirror written by hand
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `run-all.sh` all PASS
- [ ] CHK-022 [P1] Four mirror checks pass
- [ ] CHK-023 [P1] Bare command resolves to `check`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The `check` route is `mutating: read-only`
- [ ] CHK-032 [P1] N/A for auth: doctor commands run locally with no credential
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Router and presentation agree on the target list
- [ ] CHK-042 [P2] README entries deferred to phase 007
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
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
