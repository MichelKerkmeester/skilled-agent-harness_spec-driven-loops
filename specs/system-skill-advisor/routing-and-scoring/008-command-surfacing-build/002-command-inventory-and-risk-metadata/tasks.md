---
title: "Tasks: Phase 2: command-inventory-and-risk-metadata"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "command inventory and risk metadata tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: command-inventory-and-risk-metadata

<!-- SPECKIT_LEVEL: 3+ -->

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

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SK` is `.skilled/skills/sk-doc/sk-create-skill`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `G` is `$ADV/scripts/command-bridges/command-bridges.generated.json`. `S` is this packet's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the deriver is fresh before any edit (`$G`). Verify: `node $D --check | jq -r .status` prints `fresh`.
- [x] T002 Confirm the contract gate and record the contract test's state before any edit (`$SK/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` prints `checked=14 passed=14 failed=0 fixed=0`, and `node $SK/scripts/tests/skill-root-metadata-contract.test.cjs` fails at `testFleetDiscoveryUsesTheAuthoredMarker` because its expected roster lacks `system-skilled-doctor`. That failure predates this phase.
- [x] T003 Confirm routing is at the phase 1 baseline (`$ADV/tests/command-routing-slice.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/command-routing-slice.vitest.ts` reports 4 passed, and `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'` prints `[158,50,20,5]`.
- [x] T004 Save the baseline's routing parts for the later comparison (`$S/baseline-before.json`). Verify: `jq -c '{rows,metrics,commands,unreachable}' $ADV/scripts/routing-accuracy/command-routing-baseline.json > $S/baseline-before.json` exits 0 and `jq '.rows | length' $S/baseline-before.json` prints 175.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `system-skilled-doctor` to the expected roster so the contract test runs past fleet discovery (`$SK/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: `node $SK/scripts/tests/skill-root-metadata-contract.test.cjs; echo $?` prints 0.
- [x] T006 Move `command-metadata.json` from the standalone forbidden set to the standalone optional set (`$SK/scripts/lib/skill-root-metadata-contract.cjs`). Verify: `rg -n "'command-metadata.json'" $SK/scripts/lib/skill-root-metadata-contract.cjs` shows the name inside `OPTIONAL_BY_CLASS` for the standalone class and no longer inside `FORBIDDEN_BY_CLASS`.
- [x] T007 Make the gate require `ownerMode` to equal the skill id when the root has no `mode-registry.json` (`$SK/scripts/ci-skill-root-metadata.cjs`). Verify: `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` prints `failed=0`.
- [x] T008 Add two cases to the contract test: a standalone fixture root with a coherent `command-metadata.json` passes, and one whose `ownerMode` differs from the skill id fails (`$SK/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: the T005 command prints 0, and with the T007 rule commented out it prints 1.
- [x] T009 [P] Add `mutating`, `gate3_location` and, on none of them, `ask_first` to the 13 entries (`.skilled/skills/sk-doc/command-metadata.json`). Verify: `jq '[.[] | select(.mutating == "mutates" and (.gate3_location | type == "string"))] | length' .skilled/skills/sk-doc/command-metadata.json` prints 13.
- [x] T010 [P] Add the same keys to the 3 entries (`.skilled/skills/sk-design/command-metadata.json`). Verify: the T009 `jq` filter on this file prints 3.
- [x] T011 [P] Add the same keys plus `ask_first: ["spend"]` to the 3 entries (`.skilled/skills/system-deep-loop/command-metadata.json`). Verify: `jq '[.[] | select(.mutating == "mutates" and .ask_first == ["spend"])] | length' .skilled/skills/system-deep-loop/command-metadata.json` prints 3.
- [x] T012 Create the file with 7 entries, each with `ownerMode` `system-spec-kit`, `ownedSignals` holding the command string, and the classes in `plan.md` section 3 (`.skilled/skills/system-spec-kit/command-metadata.json`). Verify: `jq -c '[length, ([.[] | select(.ownerMode == "system-spec-kit")] | length), ([.[] | select(.mutating == "read-only")] | map(.command)), ([.[] | select(.ask_first == ["relaunch"])] | map(.command))]' .skilled/skills/system-spec-kit/command-metadata.json` prints `[7,7,["/speckit:search"],["/speckit:handoff"]]`.
- [x] T013 Create the file with the one entry for `/prompt:improve`, `ownerMode` `sk-prompt`, class `mutates` (`.skilled/skills/sk-prompt/command-metadata.json`). Verify: `jq -c '[length, .[0].command, .[0].ownerMode, .[0].mutating]' .skilled/skills/sk-prompt/command-metadata.json` prints `[1,"/prompt:improve","sk-prompt","mutates"]`, and `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` prints `failed=0`.
- [x] T014 [P] Add `actions` with `list: read-only` and `select: mutates` to `/doctor:env`, and `write_scope: spec-folder` to the `/doctor:speckit` and `/doctor:deep-loop` routes (`.skilled/commands/doctor/_routes.yaml`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | tail -1` starts with `OK: route-validate`, and `grep -c 'write_scope: spec-folder' .skilled/commands/doctor/_routes.yaml` prints 2.
- [x] T015 Add the tree read and the two identity failures, with the allow-list exemption and the `local-` skip (`$D`). Verify: `node $D --check | jq -r .status` prints `stale` or `fresh` and never an identity error on the real tree, and the fixture cases in T019 fail as stated.
- [x] T016 Add attribute validation and the exported `derivePolicy`, and emit `commandPolicies` (`$D`). Verify: `node -e "const d=require('./$D');console.log(d.derivePolicy({mutating:'read-only'}),d.derivePolicy({mutating:'mutates'}),d.derivePolicy({mutating:'mutates',ask_first:['spend']}),d.derivePolicy({mutating:'mutates',doctor:true}),d.derivePolicy({mutating:'add-only',write_scope:'spec-folder'}))"` prints `run start ask ask run`.
- [x] T017 Skip a second entry for a metadata command that an allow-list row carries (`$D`). Verify: after T018, `jq -c '[.counts.generated,.counts.typescriptActive,.counts.pythonActive]' $G` prints `[66,40,50]` and `jq '[.entries[] | select(.command == "/speckit:plan")] | length' $G` prints 1.
- [x] T018 Regenerate (`$G`). Verify: `node $D` exits 0, `node $D --check | jq -r .status` prints `fresh`, `jq '[.commandPolicies[].command] | unique | length' $G` prints 44, and `jq -c '.entries[0] | keys' $G` prints `["command","id","ownerMode","runtime","skillId","source"]`.
- [x] T019 Add the test: the five rule rows, a fixture command with no attributes, a fixture entry with no command file, an unknown `ask_first` reason and a `local-` file that is ignored (`$ADV/tests/command-policy-derivation.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/command-policy-derivation.vitest.ts` reports 0 failed.
- [x] T020 Update the census from 19 to 27 (`$ADV/tests/command-metadata-e2e.vitest.ts`). Verify: in `$ADV`, `npx vitest run tests/command-metadata-e2e.vitest.ts tests/command-bridges-drift-guard.vitest.ts` reports 0 failed.
- [x] T021 Re-capture the routing baseline for its counts (`$ADV/scripts/routing-accuracy/command-routing-baseline.json`). Verify: after `node $ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs --write > /dev/null`, `diff <(jq -c '{rows,metrics,commands,unreachable}' $ADV/scripts/routing-accuracy/command-routing-baseline.json) $S/baseline-before.json` prints nothing.
- [x] T022 [P] Document the risk keys, the rule and `commandPolicies` (`$ADV/scripts/command-bridges/README.md`). Verify: `grep -c 'commandPolicies\|ask_first\|write_scope' $ADV/scripts/command-bridges/README.md` prints 3 or more.
- [x] T023 [P] State the standalone allowance and the owner rule (`$SK/references/shared/skill-root-metadata-contract.md`). Verify: `grep -n 'standalone' $SK/references/shared/skill-root-metadata-contract.md | grep -c 'command-metadata.json'` prints 1 or more and no line still says the file is forbidden on a standalone root.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Prove the missing-attributes failure on the real deriver: add a file `.skilled/commands/create/zz-fixture.md`, run the check, then delete the file (`$D`). Verify: `node $D --check; echo $?` prints an error naming `/create:zz-fixture` and 1, and after the delete it prints `fresh` and 0.
- [x] T025 Prove a class change flips a policy: copy the manifest and `$G` to `$S`, set the `/doctor:git` `setup` route to `mutates`, run `node $D`, read the record, then copy both files back (`.skilled/commands/doctor/_routes.yaml`). Verify: the record for `/doctor:git` `setup` reads `ask` while the edit is in place, and after the copies are restored `node $D --check | jq -r .status` prints `fresh`.
- [x] T026 Compare the policy rollup with the review (`$G`). Verify: `jq -c '[.commandPolicies | group_by(.command)[] | (map(.policy) | if index("ask") then "ask" elif index("start") then "start" else "run" end)] | group_by(.) | map({(.[0]): length}) | add' $G` prints `{"ask":15,"run":7,"start":22}`, or each difference is listed in `implementation-summary.md`.
- [x] T027 Confirm the private command is absent (`$G`). Verify: `rg -c 'local-skilled-alignment' $ADV/scripts/command-bridges $ADV/lib` prints nothing.
- [x] T028 Re-run the pinned numbers and the routing slice (`$ADV/tests/command-routing-slice.vitest.ts`). Verify: the two T003 commands print 4 passed and `[158,50,20,5]`.
- [x] T029 Run the whole advisor suite and the contract checks (`$ADV/package.json`). Verify: in `$ADV`, `npm test` reports 0 failed. `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` prints `failed=0`. `node $SK/scripts/tests/skill-root-metadata-contract.test.cjs; echo $?` prints 0.
- [x] T030 Confirm the changed files match `spec.md` section 3 (`spec.md`). Verify: `git status --short .skilled` lists only those files plus the four untracked phase 1 files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node $D --check | jq -r .status` prints `fresh`, the generated file lists 44 commands in `commandPolicies` and the T029 runs report 0 failed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-004.
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Each line below names the command or task that answers it.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocking fact, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The deriver is fresh and the contract gate passes 14 of 14 before the first edit: T001 and T002
- [x] CHK-002 [P0] Routing is at the phase 1 baseline before the first edit: T003
- [x] CHK-003 [P1] The baseline's routing parts are saved for comparison: T004
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $D` and `node --check $SK/scripts/ci-skill-root-metadata.cjs` exit 0
- [x] CHK-011 [P0] `jq empty` exits 0 on each of the five `command-metadata.json` files and on `$G`
- [x] CHK-012 [P1] A missing class, an unknown `ask_first` reason and an unknown `write_scope` each make the deriver exit non-zero and name the entry: T019
- [x] CHK-013 [P1] `rg -n 'specs/|REQ-|ADR-|T0[0-9][0-9]|008-command' $D $ADV/tests/command-policy-derivation.vitest.ts $SK/scripts/lib/skill-root-metadata-contract.cjs` prints nothing new from this phase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met` with observed evidence
- [x] CHK-021 [P0] The pinned numbers and the baseline's rows, metrics, commands and unreachable list are unchanged: T021 and T028
- [x] CHK-022 [P1] A fixture command with no attributes fails the real check: T024
- [x] CHK-023 [P1] The whole suite and both contract checks pass: T029
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No path derives `run` from a missing or unreadable class: the T019 case for a missing class fails the deriver
- N/A for secrets and auth: the phase edits metadata and a generator and reads no credential.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md` section 3, `plan.md` and T030 name the same files
- [x] CHK-042 [P1] The bridges README and the contract reference state the new keys and rule: T022 and T023
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The saved baseline and the manifest copy used by T025 live under this packet's `scratch/`
- [x] CHK-051 [P1] `ls .skilled/commands/create/zz-fixture.md` reports no such file at close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-002 is followed: `jq -c '.entries[0] | keys' $G` prints the six entry keys and the policy lives in `commandPolicies`
- [x] CHK-101 [P1] ADR-001, ADR-003 and ADR-004 are followed: T013, T014 and T017 pass
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

N/A: the deriver is not on a request path and the spec makes no performance claim.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

N/A: the phase ships metadata, a generator change and tests. Nothing is deployed, and the rollback in `plan.md` section 7 is a file restore.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No dependency is added: `git diff --stat -- '*package.json' '*package-lock.json'` prints nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] The parent `spec.md` phase map row for this phase and this packet's `spec.md` state the same handoff criterion
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides the commit and the start of phase 002 | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

