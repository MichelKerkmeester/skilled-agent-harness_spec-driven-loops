---
title: "Tasks: Phase 6: measurement"
description: "Task Format: T### [P?] Description (file path). Verify: command prints expected output."
trigger_phrases:
  - "measurement tasks"
  - "phase 6 task list"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 6: measurement

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

Shell variables used in the Verify clauses below:
- `Q` is `.skilled/skills/sk-code/sk-code-quality`.
- `H` is `.skilled/skills/sk-code`.
- `P` is `specs/sk-code/015-quality-agnostic-gate/006-measurement`.

**Task Format**: `T### [P?] Description (file path). Verify: the command prints the expected output`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 001 to 005 are Complete in their spec files (`specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md`). Verify: `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` prints `5`.
- [ ] T002 Re-check the design line citations this phase repeats: `Q/manual-testing-playbook/quality-gate/quality-checklist.md` line 73, `H/shared/references/stack-detection.md` line 32 and `H/ROUTER.md` line 242. Verify: `sed -n '242p' .skilled/skills/sk-code/ROUTER.md | rg -c 'CODE_QUALITY'` prints `1`.
- [ ] T003 Create the evidence folder and its transcript subfolder (`P/evidence/transcripts/`). Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` prints `transcripts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Step 1: Playbook scenarios

- [ ] T004 [P] Write scenario CQ-002, a foreign polyglot change built from fixture F01 (`Q/manual-testing-playbook/quality-gate/foreign-polyglot-change.md`). Verify: `rg -c '^id: CQ-002$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/foreign-polyglot-change.md` prints `1`.
- [ ] T005 [P] Write scenario CQ-003, an unknown language built from fixture F05 (`Q/manual-testing-playbook/quality-gate/unknown-language-change.md`). Verify: `rg -c '^id: CQ-003$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/unknown-language-change.md` prints `1`.
- [ ] T006 [P] Write scenario CQ-004, a CI target built from fixture F14 (`Q/manual-testing-playbook/quality-gate/ci-target-change.md`). Verify: `rg -c '^id: CQ-004$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/ci-target-change.md` prints `1`.
- [ ] T007 [P] Write scenario CQ-005, a private surface built from fixture F15, with the private skill named only as a placeholder joined at run time (`Q/manual-testing-playbook/quality-gate/private-surface-change.md`). Verify: `rg -c '^id: CQ-005$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/private-surface-change.md` prints `1`.
- [ ] T008 [P] Write scenario CQ-006, an absent required tool built from fixture F06 (`Q/manual-testing-playbook/quality-gate/absent-required-tool.md`). Verify: `rg -c '^id: CQ-006$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/absent-required-tool.md` prints `1`.
- [ ] T009 [P] Write scenario CQ-007, an envelope round trip through the verify reader, using the BLOCKED envelope from CQ-002 and the UNVERIFIED envelope from CQ-006 (`Q/manual-testing-playbook/quality-gate/envelope-round-trip.md`). Verify: `rg -c '^id: CQ-007$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/envelope-round-trip.md` prints `1`.
- [ ] T010 [P] Write scenario CQ-008, the restraint prompt "apply yagni to this change" (`Q/manual-testing-playbook/quality-gate/restraint-prompt.md`). Verify: `rg -c '^id: CQ-008$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` prints `1`.
- [ ] T011 Add CQ-002 to CQ-008 to the root playbook index: the section 7 headings, the section 9 rows and the section 7 title range (`Q/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c '^### CQ-00[2-8] \|' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` prints `7`.

### Step 2: Routing canaries

- [ ] T012 [P] Write canary CB-CR-006, a single route for the agent-file prompt (`H/manual-testing-playbook/compiled-routing/workflow-alone-quality-agent-compiled-routing.md`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` and `sk-code-quality`.
- [ ] T013 [P] Write canary CB-CR-007, a bundle for the CI prompt with quality first and `sk-code-ci` as the surface (`H/manual-testing-playbook/compiled-routing/quality-ci-bundle-compiled-routing.md`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"surfaceBundle"` with `sk-code-quality` listed before `sk-code-ci`.
- [ ] T014 [P] Write canary CB-CR-008, a single route for the rails prompt (`H/manual-testing-playbook/compiled-routing/workflow-alone-quality-rails-compiled-routing.md`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` prints `"selectionKind":"single"` and `sk-code-quality`.
- [ ] T015 Fill the `evidence_*` fields of CB-CR-006 to CB-CR-008 from a live status read. Verify: `node .skilled/bin/compiled-route-status.cjs --hub sk-code` prints a line with `servingAuthority` set to `compiled`.

### Step 3: Measurements and report

- [ ] T016 Build fixture F01 in a temporary repository, run `quality-gate.cjs --format json` on it, and write `catch` and `commit` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`.
- [ ] T017 [P] Build fixture F02 in a temporary repository, run the same command, and write `false_positives` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0`.
- [ ] T018 Build the 50-file timing set (50 changed `.js` files, each with one changed clean comment line) in a temporary repository. Run `quality-gate.cjs --no-run --format json` three times and write `timing` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000`.
- [ ] T019 [P] Run the four intent prompts (the CQ-001 prompt and the three canary prompts) through `compiled-route.cjs`, and write `intent` with `targeted` set to `false` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').intent.prompts"` prints `4`.
- [ ] T020 Run CQ-002 to CQ-008 live and save each raw transcript as `P/evidence/transcripts/CQ-00N.md`. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `7`.
- [ ] T021 Scan the transcripts for passing claims, read every hit by hand, and write the count of real claims into `pass_claims`. Verify: `rg -l -i 'gate passed|all checks pass|\bPASS\b' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `0`.
- [ ] T022 Write `readonly_invariant`, `runs` and `corpus` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').readonly_invariant"` prints `true`.
- [B] T023 Render the seven-file report folder under `Q/benchmark/reports/`, named by the execution date and the subject `quality-gate-fixtures` with the variant `live`, once OQ-1 is answered (`Q/benchmark/reports/`). Verify: `ls .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ | wc -l` prints `7`.
- [B] T024 Add one index row for the new folder to section 2 of the reports index, after T023 (`Q/benchmark/reports/README.md`). Verify: `rg -c 'quality-gate-fixtures--live' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md` prints `1`.
- [B] T025 Write `source.md` for the new folder with the repository-relative root `.skilled/skills/sk-code/sk-code-quality` and the scenario corpus, and no absolute path (`Q/benchmark/reports/*--quality-gate-fixtures--live/source.md`). Verify: `rg -l '/Users/|/private/|/home/' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ || echo none` prints `none`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T026 Run the sk-doc validator on each of the ten new scenario and canary files. The playbook files are classified by path, so run it with no `--type` flag (`Q/manual-testing-playbook/quality-gate/` and `H/manual-testing-playbook/compiled-routing/`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` exits `0`, and the same holds for each new file.
- [ ] T027 Rerun the whole quality test set as the regression baseline and record the counts against the Phase 5 baseline (`Q/scripts/tests/*.test.cjs`). Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` ends with the line `# fail 0`.
- [ ] T028 [P] Write the packet changelog entry and the quality-mode changelog entry at landing, with the version chosen then (`Q/changelog/`). Verify: `ls .skilled/skills/sk-code/sk-code-quality/changelog | sort -V | tail -1` prints a file whose version is above the `Q/SKILL.md` version read at T001, which is 1.7.1.0 once phases 001 to 005 land.
- [ ] T029 Confirm no gate file changed and the scratch folder is empty (`Q/scripts`, `.skilled/hooks`, `P/scratch`). Verify: `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing, and `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch | wc -l` prints `0`.
- [ ] T030 Reconcile the metadata and status of `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `goal.md`, then run the strict validator on the phase folder (`P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/006-measurement --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (OQ-1 answered and T023 to T025 done)
- [ ] Manual verification passed: the operator reads the seven saved transcripts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 to ADR-008)
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -o 'REQ-[0-9]{3}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md | sort -u | wc -l` prints `18`.
- [ ] CHK-002 [P0] Technical approach defined in plan.md with three steps. Verify: `rg -c '^### Step ' specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md` prints `3`.
- [ ] CHK-003 [P1] Dependencies on phases 001 to 005 identified and Complete (T001). Verify: `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` prints `5`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Phase 6 adds no code, so the gate scripts and hooks are unchanged. Verify: `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing.
- [ ] CHK-011 [P0] Each of the ten new scenario and canary files passes the sk-doc validator. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` exits `0`.
- [ ] CHK-012 [P1] The packet docs hold no em dash. Verify: `rg -c '\x{2014}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md specs/sk-code/015-quality-agnostic-gate/006-measurement/tasks.md` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All seven scenarios and three canaries exist. Verify: `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate | wc -l` prints `7`, and `rg -l '^id: CB-CR-00[678]$' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing | wc -l` prints `3`.
- [ ] CHK-021 [P0] The live runs saved seven transcripts. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `7`.
- [ ] CHK-022 [P1] The edge states appear in the transcripts. Verify: `rg -l 'NOTHING_CHECKED' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints at least `1`.
- [ ] CHK-023 [P1] The error path (CQ-006) reports exit 4 and makes no pass claim. Verify: `rg -c 'exit 4' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts/CQ-006.md` prints at least `1`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each measured miss or false positive names one finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').classes"` prints the class list, or `undefined` when no miss or false positive exists.
- [ ] CHK-FIX-002 [P0] Each miss or false positive has its same-class inventory or an instance-only proof by grep. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').same_class"` prints the recorded inventory, or `none` when no miss or false positive exists.
- [ ] CHK-FIX-003 [P1] The matrix axes are listed before the measurement: F01, F02, F05, F06, the 50-file set and the intent prompts. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').corpus.length"` prints `6`.
- [ ] CHK-FIX-004 [P1] The evidence is pinned to one commit SHA, not a moving range. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').commit.length"` prints `40`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No literal secret key reaches the evidence. Verify: `rg -l 'AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence | wc -l` prints `0`.
- [ ] CHK-031 [P0] No `local-*` skill name appears in the report folder. Verify: `rg -c 'local-' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ || echo none` prints `none`. Blocked until T023.
- [ ] CHK-032 [P1] The fixture snapshots stay unchanged across the runs. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').readonly_invariant"` prints `true`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The spec and the acceptance criteria use the same REQ ids. Verify: `rg -o --no-filename 'REQ-[0-9]{3}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/acceptance-criteria.md | sort -u | wc -l` prints `18`.
- [ ] CHK-041 [P1] The six operator ADR status lines match the goal decision table. Verify: `rg -c 'Accepted, pending operator confirmation at program end' specs/sk-code/015-quality-agnostic-gate/006-measurement/decision-record.md` prints `6`.
- [ ] CHK-042 [P2] No README edit is needed, because the quality README has no playbook index. Verify: `rg -n 'playbook|CQ-' .skilled/skills/sk-code/sk-code-quality/README.md || echo none` prints `none`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The measurement record and the transcripts sit in `evidence/`. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` prints `measurement.json` and `transcripts`.
- [ ] CHK-051 [P1] The scratch folder is empty at close. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch | wc -l` prints `0`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->
