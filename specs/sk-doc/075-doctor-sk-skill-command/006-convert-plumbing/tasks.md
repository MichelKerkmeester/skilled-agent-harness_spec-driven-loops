---
title: "Tasks: Phase 6: convert-plumbing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert plumbing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: convert-plumbing

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

`DOC` is `.skilled/commands/doctor`. `BR` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the convert script from phases 3 to 5 exists (`DOC/scripts/sk-skill-convert.cjs`). Verify: `node DOC/scripts/sk-skill-convert.cjs plan --help` exits 0.
- [ ] T002 Confirm the phase 2 plumbing exists (`DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `ls` lists all three.
- [ ] T003 [P] Record the starting gate results (`scratch/before.md`). Verify: the file lists `route-validate.sh`, `run-all.sh` and `doctor-phrase-reach.cjs` with exit codes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the workflow (`DOC/assets/doctor-sk-skill-convert.yaml`) with phases read, refuse, plan and approval, write, re-read, undo, modelled on `doctor-ci-scaffold.yaml:25-36, 86-98`. Verify: `rg -c 'STATUS=(OK|CANCELLED|FAIL)' DOC/assets/doctor-sk-skill-convert.yaml` prints 3 or more.
- [ ] T005 Add the `convert` route (`DOC/_routes.yaml`) with `mutating: mutates`, `script_invocations` for `sk-skill-convert.cjs` and trigger phrases of three or more words. Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T006 Add the convert target to the router and presentation (`DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`), with plan, refusal, `OK` and `CANCELLED` states. Verify: route-validate reports target parity.
- [ ] T007 Add the convert row to the setup list (`DOC/assets/doctor-setup-presentation.txt`). Verify: `rg -n 'doctor:sk-skill convert' DOC/assets/doctor-setup-presentation.txt` prints one line.
- [ ] T008 Add convert to `families.doctor` when absent (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `node --test DOC/scripts/tests/doctor-update-contract.test.cjs` passes.
- [ ] T017 Add `default_target: true` to the `check` route when the `convert` route lands, and change the contract test's single-route assertion to expect both targets and the flag (`DOC/_routes.yaml`, `DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `node BR/derive-command-bridges.cjs` exits 0.
- [ ] T009 Activate the bridge in both lists (`BR/scoring-compatibility.json`), then run `node BR/derive-command-bridges.cjs`. Verify: `rg -c '/doctor:sk-skill' BR/command-bridges.generated.json` prints 1 or more.
- [ ] T010 Extend the contract test (`DOC/scripts/tests/doctor-sk-skill-contract.test.cjs`) with every `REFUSE:` string, the three statuses and the order plan before apply. Verify: `node --test DOC/scripts/tests/doctor-sk-skill-contract.test.cjs` passes.
- [ ] T011 Regenerate the command mirrors with the sync scripts, never by hand. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` exit 0.
- [ ] T016 Author the router, presentation and convert YAML through the sk-create-command mode: read `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `ROUTER.md` and `references/router-presentation-split.md`, then run `/create:command` (`.skilled/commands/create/command.md`) against `assets/command-router-template.md`, `assets/command-presentation-template.md` and `assets/command-template.md`. Verify: the log in `scratch/` names the `/create:command` run, and a JSON Schema check of `assets/command-contract.json` against `assets/command-contract.schema.json` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the doctor suite (`DOC/scripts/tests/run-all.sh`). Verify: `bash DOC/scripts/tests/run-all.sh` prints every suite PASS.
- [ ] T013 Run phrase reach (`DOC/scripts/doctor-phrase-reach.cjs`). Verify: `node DOC/scripts/doctor-phrase-reach.cjs` exits 0 and lists the convert phrases under `/doctor:sk-skill`.
- [ ] T014 Run `/doctor:sk-skill convert` on a scratch skill under `scratch/`. Verify: the transcript shows the plan, `STATUS=CANCELLED` on "no" with no changed file, then `STATUS=OK` on "yes".
- [ ] T015 Run convert on a scratch skill named with a `local-` prefix and on a dual-declaration fixture. Verify: each prints `REFUSE:` and `STATUS=FAIL`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the T014 transcript is saved in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 2.2, 3 and 5 (phase 6)
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

A blocked task is marked `[B]` with the blocking phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phases 2, 3 and 5 closed: `sk-skill-convert.cjs` and `sk-skill.md` exist
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] CHK-011 [P0] The YAML parses: `node -e "require('yaml').parse(require('fs').readFileSync('.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml','utf8'))"` exits 0
- [ ] CHK-012 [P1] Every refusal ends with `STATUS=FAIL` and a named reason
- [ ] CHK-013 [P1] The YAML follows the `doctor-ci-scaffold.yaml` phase shape
- [ ] CHK-014 [P1] Command surfaces came from the sk-create-command templates and the contract validates against its schema
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual run shows plan, `CANCELLED` on no, `OK` on yes
- [ ] CHK-022 [P1] `local-` prefix and dual declaration refused
- [ ] CHK-023 [P1] `run-all.sh` and `doctor-phrase-reach.cjs` pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds a route; it fixes no reported finding.

- [ ] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the YAML, route or tests
- [ ] CHK-031 [P0] The name argument is validated: `local-` and `agent-` prefixes and collisions are refused
- [ ] CHK-032 [P1] `allowed-tools` is proposed and confirmed, never defaulted (D7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The YAML's invariant line states the no-write-before-yes rule
- [ ] CHK-042 [P2] README updates deferred to phase 7
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scratch skills and transcripts live in `scratch/` only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



