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

- [ ] T001 Record the six baseline commands and the route count into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'route-validate' scratch/baseline.txt` prints at least `1` and names the route count.
- [ ] T002 Read the exemplar router and its contract test (`D/sk-skill.md`, `D/scripts/tests/doctor-sk-skill-contract.test.cjs`). Verify: `rg -c 'skill_agent' D/sk-skill.md` prints `1`.
- [ ] T003 Write the contract suite first (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the router with the six canonical sections (`R`). Verify: `node --test T` reports the section case passing.
- [ ] T005 Add the three manifest routes with their mutation classes and phrases (`D/_routes.yaml`). Verify: `node --test T` reports the route and phrase cases passing.
- [ ] T006 Add the read-only workflow (`D/assets/doctor-agents-md-check.yaml`). Verify: `node --test T` reports the read-only field case passing.
- [ ] T007 Add the embed workflow with the plan digest, the allowlist and `never_commit` (`D/assets/doctor-agents-md-embed.yaml`). Verify: `node --test T` reports the embed field case passing.
- [ ] T008 Add the restore workflow (`D/assets/doctor-agents-md-restore.yaml`). Verify: `node --test T` reports the restore field case passing.
- [ ] T009 Add the presentation file and the setup row (`D/assets/doctor-agents-md-presentation.txt`, `D/assets/doctor-setup-presentation.txt`). Verify: `node --test T` reports the setup-row case passing.
- [ ] T010 Add the update next-step line (`D/assets/doctor-update-presentation.txt`). Verify: `rg -c 'agents-md' D/assets/doctor-update-presentation.txt` prints `1`.
- [ ] T011 Add the command contract entries (`command-contract.json`). Verify: `node --test T` reports the contract case passing.
- [ ] T012 Add the catalog row (`.skilled/commands/README.txt`). Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`.
- [ ] T013 Regenerate the advisor blocks (`derive-command-bridges.cjs`). Verify: a second run leaves `git diff --exit-code` clean on its outputs.
- [ ] T014 Regenerate the mirrors and the three prompt stub sets. Verify: each `--check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the family validators (`D/scripts`). Verify: `bash D/scripts/route-validate.sh` exits 0 and `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` exits 0.
- [ ] T016 Run the suite runner (`D/scripts/tests`). Verify: `bash D/scripts/tests/run-all.sh` ends `0 failed`.
- [ ] T017 Confirm the bridge stays inactive (`scoring-compatibility.json`). Verify: `node D/scripts/doctor-phrase-reach.cjs` exits 0 and the new bridge is absent from the activation list.
- [ ] T018 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The re-measured route count is recorded in `implementation-summary.md`
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

- [ ] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] Both engines answer. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 and `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` exits 0.
- [ ] CHK-003 [P1] The baseline is recorded. Verify: `rg -c 'routes validated' scratch/baseline.txt` prints at least `1`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The router carries six canonical sections. Verify: `node --test T` reports the section case passing.
- [ ] CHK-011 [P0] Every phrase has three or more words. Verify: the phrase case passes for all three routes.
- [ ] CHK-012 [P1] No YAML grants a write target the read-only route does not need. Verify: `rg -n 'allowed_targets|forbidden_targets' D/assets/doctor-agents-md-check.yaml` prints the read-only restriction.
- [ ] CHK-013 [P1] No generated file was edited by hand. Verify: `git status --porcelain` lists generated paths only after a regeneration run.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] The contract suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`.
- [ ] CHK-022 [P1] The family validators pass. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
- [ ] CHK-023 [P1] The runner passes. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The writing workflows declare `never_commit: true`. Verify: `rg -c 'never_commit: true' D/assets/doctor-agents-md-embed.yaml D/assets/doctor-agents-md-restore.yaml` prints `1` for each.
- [ ] CHK-031 [P0] The allowlist in the embed workflow matches the engine's. Verify: the six paths appear in both files.
- [ ] CHK-032 [P1] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' D/assets/doctor-agents-md-*.yaml` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The setup presentation lists the command once. Verify: `rg -c 'agents-md' D/assets/doctor-setup-presentation.txt` prints `1`.
- [ ] CHK-041 [P1] The catalog row matches the router. Verify: `node D/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`.
- [ ] CHK-042 [P2] The re-measured route count is recorded. Verify: `rg -n 'routes validated' implementation-summary.md` prints the figure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Router, workflows and presentation live under the doctor command folder. Verify: `ls .skilled/commands/doctor/agents-md.md .skilled/commands/doctor/assets/doctor-agents-md-*.yaml` prints all four.
- [ ] CHK-051 [P1] No temporary file survives. Verify: `git status --porcelain` lists no path under a temporary directory.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
