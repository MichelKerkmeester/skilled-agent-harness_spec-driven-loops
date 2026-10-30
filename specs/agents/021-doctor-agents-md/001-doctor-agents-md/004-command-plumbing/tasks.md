---
title: "Tasks: command plumbing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md plumbing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: command plumbing

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

**Variables.** `D` is `.skilled/commands/doctor`. `R` is `D/agents-md.md`. `T` is `D/scripts/tests/doctor-agents-md-contract.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six baseline commands and the route count into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'route-validate' scratch/baseline.txt` prints at least `1` and names the route count. Evidence: `scratch/baseline.txt` records 21 routes and the six baseline commands, measured at `d70f145c49` before the first edit.
- [x] T002 Read the exemplar router and its contract test (`D/sk-skill.md`, `D/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `rg -c 'skill_agent' D/sk-skill.md` prints `1`. Evidence: both files were read; `rg -c 'skill_agent' .skilled/commands/doctor/sk-skill.md` prints `1`.
- [x] T003 Write the contract suite first (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`. Evidence: written before the router existed; `node --test` exited 1 on `ENOENT ... .skilled/commands/doctor/agents-md.md`, captured in `scratch/fail-first.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the router with the six canonical sections (`R`). Verify: `node --test T` reports the section case passing. Evidence: passes `the router follows the router template: six canonical sections in order and no inline presentation`.
- [x] T005 Add the three manifest routes with their mutation classes and phrases (`D/_routes.yaml`). Verify: `node --test T` reports the route and phrase cases passing. Evidence: passes `the manifest holds a check, an embed and a restore route` and `every trigger phrase carries three or more words`.
- [x] T006 Add the read-only workflow (`D/assets/doctor-agents-md-check.yaml`). Verify: `node --test T` reports the read-only field case passing. Evidence: passes `the check workflow is read-only` and `the check workflow maps the engine exit classes`.
- [x] T007 Add the embed workflow with the plan digest, the allowlist and `never_commit` (`D/assets/doctor-agents-md-embed.yaml`). Verify: `node --test T` reports the embed field case passing. Evidence: passes `the embed workflow writes only after the printed plan, its digest and the yes` and `the embed allowlist is the engine own list`.
- [x] T008 Add the restore workflow (`D/assets/doctor-agents-md-restore.yaml`). Verify: `node --test T` reports the restore field case passing. Evidence: passes `the restore workflow asks once ...` and `restores only what one run recorded`.
- [x] T009 Add the presentation file and the setup row (`D/assets/doctor-agents-md-presentation.txt`, `D/assets/doctor-setup-presentation.txt`). Verify: `node --test T` reports the setup-row case passing. Evidence: passes `the presentation carries the menu ...` and `the setup target list carries one agents-md row`.
- [x] T010 Add the update next-step line (`D/assets/doctor-update-presentation.txt`). Verify: `rg -c 'agents-md' D/assets/doctor-update-presentation.txt` prints `1`. Evidence: `rg -c 'agents-md' .skilled/commands/doctor/assets/doctor-update-presentation.txt` prints `1`.
- [x] T011 Add the command contract entries (`command-contract.json`). Verify: `node --test T` reports the contract case passing. Evidence: passes `the contract names the router, the three workflows, the presentation, the hint and the alias`.
- [x] T012 Add the catalog row (`.skilled/commands/README.txt`). Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`. Evidence: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` over 41 commands.
- [x] T013 Regenerate the advisor blocks (`derive-command-bridges.cjs`). Verify: a second run leaves `git diff --exit-code` clean on its outputs. Evidence: the run wrote 55 generated entries; a second run prints `"status": "fresh"` and `"changed": []`.
- [x] T014 Regenerate the mirrors and the three prompt stub sets. Verify: each `--check` exits 0. Evidence: `sync-runtime-mirrors.cjs --check` prints 207 mirrors in sync, the three prompt syncs print 41 prompts each, and `generate-command-routers.cjs --check` prints `routers=39 clean=39`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the family validators (`D/scripts`). Verify: `bash D/scripts/route-validate.sh` exits 0 and `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` exits 0. Evidence: `route-validate.sh` exits 0 with `OK: route-validate — 24 routes validated, 5 warnings`; `validate-command-tree-parity.sh` exits 0 with 207 mirrors in sync.
- [x] T016 Run the suite runner (`D/scripts/tests`). Verify: `bash D/scripts/tests/run-all.sh` ends `0 failed`. Evidence: `run-all.sh` ends `7 suite(s) passed, 0 failed`; node:test ran 41 files and 911 tests with `fail 0`.
- [x] T017 Confirm the bridge stays inactive (`scoring-compatibility.json`). Verify: `node D/scripts/doctor-phrase-reach.cjs` exits 0 and the new bridge is absent from the activation list. Evidence: `doctor-phrase-reach.cjs` prints `STATUS=OK phrases=142 bridges=24`, and the three new bridges carry `"enabled": false` in both scorers.
- [x] T018 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing --strict` prints `RESULT: PASSED`. Evidence: `validate.sh ... --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the routes validate, the contract suite passes and every generator `--check` is clean on this branch
- [x] The re-measured route count is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|------------------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. Evidence: `git log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints `afb71aa136`, and both its routes validate.
- [x] CHK-002 [P0] Both engines answer. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 and `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` exits 0. Evidence: `agents-md-check.cjs` exits 0 with `STATUS=OK rows=12 findings=0 unknown=0`; `agents-md-embed.cjs plan` exits 0 with `NOTHING TO DO`.
- [x] CHK-003 [P1] The baseline is recorded. Verify: `rg -c 'routes validated' scratch/baseline.txt` prints at least `1`. Evidence: `rg -c 'routes validated' scratch/baseline.txt` prints `1`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The router carries six canonical sections. Verify: `node --test T` reports the section case passing. Evidence: the section case passes with the six headings in order.
- [x] CHK-011 [P0] Every phrase has three or more words. Verify: the phrase case passes for all three routes. Evidence: the phrase case passes for all four to six phrases on each of the three routes.
- [x] CHK-012 [P1] No YAML grants a write target the read-only route does not need. Verify: `rg -n 'allowed_targets|forbidden_targets' D/assets/doctor-agents-md-check.yaml` prints the read-only restriction. Evidence: the read-only YAML declares `allowed_targets: []` and `forbidden_targets: ["**/*"]`.
- [x] CHK-013 [P1] No generated file was edited by hand. Verify: `git status --porcelain` lists generated paths only after a regeneration run. Evidence: `git status --porcelain` lists the four generated paths and the two mirror links after the generation runs, and a second deriver run changed nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. Evidence: every row in `acceptance-criteria.md` reads `Met`.
- [x] CHK-021 [P0] The contract suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`. Evidence: `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports 31 tests with `fail 0`.
- [x] CHK-022 [P1] The family validators pass. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. Evidence: `route-validate.sh` exits 0 with 24 routes validated.
- [x] CHK-023 [P1] The runner passes. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`. Evidence: `run-all.sh` ends `7 suite(s) passed, 0 failed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The writing workflows declare `never_commit: true`. Verify: `rg -c 'never_commit: true' D/assets/doctor-agents-md-embed.yaml D/assets/doctor-agents-md-restore.yaml` prints `1` for each. Evidence: `rg -c 'never_commit: true'` prints `1` for the embed and `1` for the restore workflow.
- [x] CHK-031 [P0] The allowlist in the embed workflow matches the engine's. Verify: the six paths appear in both files. Evidence: the contract suite compares the embed workflow allowlist against the engine's exported `ALLOWLIST` and finds the same six paths, and no seventh `.md` path.
- [x] CHK-032 [P1] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' D/assets/doctor-agents-md-*.yaml` prints nothing. Evidence: `rg -ni 'api[_-]?key|token|secret|password'` on the three workflows prints nothing (exit 1).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The setup presentation lists the command once. Verify: `rg -c 'agents-md' D/assets/doctor-setup-presentation.txt` prints `1`. Evidence: `rg -c 'agents-md' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints `1`.
- [x] CHK-041 [P1] The catalog row matches the router. Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`. Evidence: `command-catalog-mirror-check.cjs` prints `STATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree`.
- [x] CHK-042 [P2] The re-measured route count is recorded. Verify: `rg -n 'routes validated' implementation-summary.md` prints the figure. Evidence: `implementation-summary.md` records `OK: route-validate — 24 routes validated, 5 warnings`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Router, workflows and presentation live under the doctor command folder. Verify: `ls .skilled/commands/doctor/agents-md.md .skilled/commands/doctor/assets/doctor-agents-md-*.yaml` prints all four. Evidence: `ls` lists the router and the three workflows; the presentation sits beside them.
- [x] CHK-051 [P1] No temporary file survives. Verify: `git status --porcelain` lists no path under a temporary directory. Evidence: `git status --porcelain` lists no path under a temporary directory.
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
