---
title: "Tasks: Phase 12: alignment-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment remediation tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: alignment-remediation

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

Two paths are used throughout. `R` is the alignment run folder that holds each finding beside its reproducing command. `P` is this packet folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the starting state of the nine failing rows (`P/scratch/before.md`). Verify: the file lists nine rows, each with its command, its exit status and its output line.
- [x] T002 Confirm each finding in `P/spec.md` §4 against the file it names (`P/scratch/before.md`). Verify: every finding id marked in `R/findings.json` has a row that says where it stands today.
- [x] T003 Confirm the file list in `P/spec.md` §3 against the tree (`P/scratch/before.md`). Verify: every path exists, apart from the rows whose Change Type is `Create`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Make the expected command mirror ignore-aware and test it (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0, and `node .skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` reports more cases than the three it runs today. REQ-001
- [x] T005 Make the child-preamble rule unconditional and bring cli-devin under the cap (`.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md`, `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`, `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/cli-external-orchestration/cli-devin` prints `PASS`, and `rg -n "When sessions may be launched through the per-session worktree wrapper" .skilled/skills/cli-external-orchestration` returns no line that carries the copy-the-preamble instruction. REQ-002
- [x] T006 Give cli-orca its routing signal (`.skilled/skills/cli-orca/SKILL.md`). Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"List my Orca worktrees and open a terminal in the new one"}' --format json` reports `cli-orca` as top-1, and so does the second phrasing D-4 names. REQ-003
- [x] T007 Document the authored leaf scopes (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`, `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/classify-standalone-root-metadata.md`, `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/skills/system-skill-advisor/SKILL.md`). Verify: `rg -n "leaf-scopes" .skilled/skills/sk-doc/sk-create-skill` returns a line from the SKILL.md, the contract and the playbook, and `rg -n "Every routable leaf" .skilled/skills/system-skill-advisor/SKILL.md` names five roots. REQ-004
- [x] T008 Sharpen the two README checkers, then fix the READMEs they flag (`.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py`, `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py`, `README.md`, and the READMEs listed in `plan.md` §5). Verify: both checker commands print `SUMMARY files=55 pass=55 fail=0`. REQ-005
- [x] T009 Bump sk-create-benchmark and record the change (`.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md`, `.skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.6.3.0.md`). Verify: `ls .skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.6.3.0.md` lists it, and `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-doc/sk-create-benchmark` prints `PASS`. REQ-006
- [x] T010 Correct the stale comment and restore the missing tests (`.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts`, `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`, `.skilled/commands/doctor/scripts/tests/test_audit_descriptions.py`). Verify: `rg -n "The other spelling" .skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts` returns nothing, and both test files pass, with `quality-gate.test.cjs` running the `..` link case and the dangling-link case again. REQ-007
- [x] T011 Add the missing OVERVIEW sections (`.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` exits 0 on each of the four. REQ-008
- [x] T012 Correct the prompt-improver command path (`.skilled/agents/prompt-improver.md`). Verify: `rg -c "prompt-improve\.md" .skilled/agents/prompt-improver.md` prints 0, and the three generated mirrors carry the corrected path after the next regeneration. REQ-009
- [x] T013 Drop the duplicated workflow path filters (`.github/workflows/opencode-dual-version.yml`, `.github/workflows/skill-advisor-stress.yml`, `.github/workflows/spec-kit-check.yml`). Verify: `rg -c "'\.opencode/plugins" .github/workflows/opencode-dual-version.yml` counts one entry per trigger block, and the same count holds in the other two. REQ-010
- [x] T014 Size the changed-packet-validation timeout (`.github/workflows/changed-packet-validation.yml`). Verify: the job's `timeout-minutes` is at or above what its own sampled runs need for a full-history checkout, and the file parses as YAML. REQ-011
- [x] T015 Align the sk-code code standards (`.skilled/skills/sk-code/sk-code-quality/`, `.skilled/skills/sk-code/sk-code-review/`, `.skilled/skills/sk-code/shared/scripts/`, `.skilled/commands/doctor/scripts/ci-report.cjs`, `ci-scaffold.cjs`, `ci-toggle.cjs`, `sk-code-setup-check.cjs`, `sk-code-quality-config.cjs`). Verify: the quality gate and the review checks pass, and each rule the two modes share is cited from one place. REQ-012
- [x] T016 Make the sk-code-skilled guides agree (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/language-standards/`). Verify: the four language standards state the same shared rule the same way, checked by reading the shared section in each. REQ-013
- [x] T017 Bring the five sk-code playbooks in line (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`, and the four mode playbooks under `sk-code-ci`, `sk-code-quality`, `sk-code-review` and `sk-code-skilled`). Verify: each playbook's own check passes, and each scenario it lists resolves to a file that exists. REQ-014
- [x] T018 Give every flagged README a disposition (`.skilled/skills/sk-doc/sk-create-readme/scripts/` allowlists, plus the READMEs in `plan.md` §5). Verify: the diff matches the table in `plan.md` §5 row for row, and no README changed only to satisfy a checker misreading. REQ-015
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Rerun the nine battery rows (`P/scratch/after.md`). Verify: each row's own command exits 0 and the record holds its output line beside the line it printed before the fix.
- [x] T020 Walk every finding in `P/spec.md` §4 and record its evidence (`P/scratch/after.md`). Verify: each finding id has the command that failed and the line that proves it now passes.
- [x] T021 Validate the parent packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity --strict --recursive` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The run this phase acts on**: the alignment report and its fix plan, which stay outside the repository because they are working artifacts rather than tracked documents
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` §4, one per group, each naming its findings
- [x] CHK-002 [P0] Technical approach defined in `plan.md` §3, naming the producer and the consumer of each changed check
- [x] CHK-003 [P1] Dependencies identified and available: the run artifacts and phase 011's regenerated mirrors
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed checker passes its own tests, run by file: `node --test` on `sync-runtime-mirrors.test.mjs` and `quality-gate.test.cjs`, and `pytest` on `test_audit_descriptions.py`
- [x] CHK-011 [P0] Every changed script parses: `node --check` on the Node files and `python3 -m py_compile` on the Python files
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file
- [x] CHK-013 [P1] No changed code comment carries a packet, phase, task or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The nine failing battery rows pass on a rerun, with each output recorded in `scratch/after.md`
- [x] CHK-022 [P1] The two README rows pass over all 55 files
- [x] CHK-023 [P1] Each `rule` disposition in `plan.md` §5 has a case in the checker it changes, so the rule cannot regress silently
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding names one class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`
- [x] CHK-FIX-002 [P0] The same-class producer inventory ran, with `rg -n "per-session worktree wrapper" .skilled/skills/cli-external-orchestration` and `rg -n "listCommandRootEntries" .skilled/skills/system-spec-kit/runtime`
- [x] CHK-FIX-003 [P0] The consumer inventory ran for every changed check: the CI workflow that runs it, and each document that quotes it
- [x] CHK-FIX-004 [P0] The mirror fix passes its adversarial cases: a gitignored shared folder, a tracked command file, a `local-*` name and a dot-prefixed folder
- [x] CHK-FIX-005 [P1] The matrix axes and their row count are listed before completion is claimed, as `plan.md` §3 requires
- [x] CHK-FIX-006 [P1] Each fix is rerun in a shell without the operator's environment overrides
- [x] CHK-FIX-007 [P1] Every evidence line is pinned to a commit or an explicit diff range, never to a moving branch
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or credential is added to any changed file
- [x] CHK-031 [P0] N/A unless a checker changes: the input handling a checker change touches is covered by CHK-FIX-004
- [x] CHK-032 [P1] No change widens a CI permission block or adds a network call to a check that runs in CI
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on the fifteen requirements
- [x] CHK-041 [P1] Every changed skill doc has its version and changelog in step, and sk-create-benchmark is the only one whose bump this phase adds
- [x] CHK-042 [P2] The root README's two command counts agree with each other and with the tracked tree
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Work notes live in `scratch/`, and the raw run artifacts stay outside the repository
- [x] CHK-051 [P1] `scratch/` holds only the records this phase cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
