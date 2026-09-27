---
title: "Tasks: Phase 11: spec-validator-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec validator fixes tasks"
  - "ac coverage unresolved citation tasks"
  - "check-goal goal.md path tasks"
  - "spec validator verification checklist"
  - "create.sh phase label tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: spec-validator-fixes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` (25 passed), `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` (18 pass, not the 15 of the planning run) and the exit 2 of `check-goal.cjs` on `006-goal-criteria-lint/goal.md`. Evidence, orchestrator, 2026-09-27 before the build: `25 passed, 0 failed`, exit 0. `tests 18`, `pass 18`, `fail 0`, exit 0. `check-goal.cjs .../006-goal-criteria-lint/goal.md` printed `RESULT: FAILED (0/5 checks; errors=1)`, exit 2
- [x] T002 Read the owner contracts: `system-spec-kit/SKILL.md`, `references/validation/validation-rules.md` section on `AC_COVERAGE`, `sk-create-goal/SKILL.md`, `sk-create-goal/scripts/README.md` and the `sk-code` rules for shell and Node. Evidence, a post-build conformance read on 2026-09-27 (no pre-build read is recorded), none contradicting the build. `system-spec-kit/SKILL.md:456` requires each criterion's evidence to trace into the tasks document and says nothing that would make an unresolved citation stop counting. `validation-rules.md:95` names unresolved citations as reported and still counted, and `:101` keeps the coverage calculation, so the ratio is unchanged. `sk-create-goal/SKILL.md:109` runs `check-goal.cjs <packet>`, and `scripts/README.md:70` defines `<packet>` as a folder or its `goal.md`, while `:54` keeps the checker read-only. The `sk-code` shell standards ask for double-quoted expansions (`overview-and-priority-blockers.md:72`), WHY comments (`:120`) and `local` variables (`:156`), which the three new helpers meet. Function comment blocks (`:250`) are a P2 recommendation, and the rule file documents its functions with WHY comments instead. The Node guide's `'use strict'` and `path.resolve` patterns (`javascript/quick-reference.md:41`, `:244`) hold in `check-goal.cjs`
- [x] T003 Rerun `git log -5 --format='%h %ad %s' --date=short` and `git status --short` on every file in Files to Change. Stop and report any change newer than the one recorded in `goal.md`'s log. Evidence: the brief author re-measured on 2026-09-27 and found `git status --short` empty on the seven touched files (`scratch/briefs/00-index.md` row O1). Two newer commits were reported there: `8036425eaa` already fixed the `create.sh` labels and `e7c88670fb` added a fifth `check-goal.cjs` check. `git log -3` on `create.sh` and `check-goal.cjs`, rerun read-only while closing these docs, lists both commits dated 2026-09-27
- [x] T004 Get the orchestrator's order for phase 006's `git diff --quiet` check against this build. Evidence: phase 006 is not built in this wave, so its check cannot collide with brief 06, which is committed in `e9059c8073` before any 006 run
- [x] T005 [P] Confirm `rg -n 'has_file_line' .skilled/skills/system-spec-kit/runtime/cli/rules/` shows only `check-ac-coverage.sh:291` and `:346`. Evidence: the brief author confirmed both pins before the build (`scratch/briefs/00-index.md` premise 6). After the build the same `rg`, rerun read-only, still finds only the two definitions, now at `:292` and `:360`
- [x] T006 [P] Record the `create.sh` baseline: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `10 passed, 0 failed (of 10)`, and check whether `create.sh:1489`, `:1511` and `:1523` still build labels from `_i`. Evidence: `Results: 10 passed, 0 failed (of 10)`, exit 0. The labels no longer use `_i`: `8036425eaa` sets `_phase_number` at `create.sh:1489` and uses it at `:1494`, `:1516` and `:1528`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Find the repository root once in `run_check()` and pass it to the citation resolver (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`). Evidence: `run_check()` calls `git -C "$folder" rev-parse --show-toplevel` once per run and falls back to the working directory (brief 04, commit `e9059c8073`). The plan's awk `getline` design was dropped because macOS awk aborts on a directory, so the root goes to bash builtins instead of awk
- [x] T008 Make `_ac_analyze_canonical()` carry each counted citation out as `AC-ID (path:line)` without touching the covered count, and resolve it in bash: absolute as written, else folder, else root, readable file and 1 <= line <= line count (`check-ac-coverage.sh`). Evidence: brief 01 (the fifth field) and brief 02 (`_ac_file_has_line`, `_ac_citation_resolves`, `_ac_unresolved_citations`), commit `e9059c8073`. `git diff -U0 e9059c8073~1 -- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh | grep -cE '^[-+].*covered\+\+'` prints `0`
- [x] T009 Do the same for `_ac_analyze_traceability()` (`check-ac-coverage.sh`). Evidence: brief 05, commit `e9059c8073`. Review fix brief 12 stops the legacy parser splitting an id cell such as `AC-001, AC-002` on its own comma, commit `03e567cfe7`
- [x] T010 Append the citation list as a fifth TSV field, write `-` for an empty id list, and read it in `run_check()` into one `Unresolved evidence citation(s):` detail (`check-ac-coverage.sh`). Evidence: briefs 01 and 03, commit `e9059c8073`. The case "empty id and citation lists are written as -" passes in the final 45/0 suite
- [x] T011 [P] In `main()`, replace a packet argument whose basename is `goal.md` and that is not a directory with its folder (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`). Evidence: brief 06, commit `e9059c8073`. The only hunk is inside `main()`, at `check-goal.cjs:704-708`
- [x] T012 [P] Add unresolved citations to the `AC_COVERAGE` paragraph (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md`). Evidence: brief 08. `rg -n 'nresolved'` returns line 95
- [x] T013 [P] Say that `<packet>` may be the folder or its `goal.md` in section 5 (`.skilled/skills/sk-doc/sk-create-goal/scripts/README.md`). Evidence: brief 09. `rg -n 'goal.md'` returns line 70
- [x] T014 Make each appended child's three labels carry its folder's phase number (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Evidence: already done by `8036425eaa` (another packet), which sets `_phase_number=$((PHASE_START_INDEX + _i - 1))`, the formula that also builds the folder's `NNN` prefix. This phase edits no line of `create.sh`. `rg -n 'Phase \$\{_i\}'` on `create.sh` prints nothing, exit 1
- [x] T015 Keep code comments free of spec paths, phase numbers and REQ or task ids. Comments state the durable reason only. Evidence: the 12 comment lines the two commits add to the five code and test files, checked read-only while closing these docs, name no spec path, phase number, REQ, task, CHK or ADR id
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Add canonical-parser cases: a packet-relative citation that resolves, a missing file, a line past the end and a root-relative citation inside a temporary `git init` repository (`.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh`). Evidence: "a citation inside the file resolves" (also an absolute path), "a missing file and line 0 or past the end do not", "a path from the repository root resolves" (a `git init` fixture) and "unresolved citations are named with their AC id", all passing in the final 45/0 suite. `baf2876802` adds "a citation that climbs out of the folder resolves only to a real file"
- [x] T017 Add legacy-parser cases: a resolving citation and a missing file in a merged `tasks.md` traceability table (`tests/check-ac-coverage.sh`). Evidence: "the legacy table names an unresolved citation", "the legacy ratio is unchanged" and "a resolving legacy citation adds no detail" pass. They are the legacy parser's first test coverage
- [x] T018 [P] Add command-line cases: a `goal.md` path matches the folder's stdout and exit 0, and another file path exits 2 with `packet path is not a directory` (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs`). Evidence: "a goal.md path checks the folder that holds it" and "a path to another file still exits 2 as not a directory". `node --test` reports `tests 20`, `pass 20`, `fail 0`, exit 0
- [x] T019 Run both suites in full and compare with the T001 baseline. Evidence at HEAD `03e567cfe7`: `check-ac-coverage.sh` `44 passed, 0 failed`, exit 0 (baseline 25/0, 41/0 at the build commit, three review cases added). At `baf2876802`, after one more resolver case: `45 passed, 0 failed`, exit 0. `node --test` `tests 20`, `pass 20`, `fail 0`, exit 0 (baseline 18/0)
- [x] T020 Time `validate.sh --strict` on the packet with the most citations before and after, and record both numbers. Evidence: `specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation` (37 ACs), three runs each, all exit 0. Before 2.26, 1.60 and 1.57 s. After the build 2.32, 1.77 and 1.78 s. After the review fixes 1.76, 1.73 and 1.73 s. Every run printed `AC_COVERAGE advisory: 37/37 ACs have evidence; floor 34/37`
- [x] T021 Run `validate.sh --strict` on one real packet with unresolved citations and confirm the new detail and an unchanged ratio. Evidence: `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment` exits 0 with `RESULT: PASSED`, `AC_COVERAGE advisory: 6/6 ACs have evidence; floor 6/6` and one detail line starting `Unresolved evidence citation(s): AC-001 (runtime/cli/spec/create.sh:157)`. The citations are skill-relative, so they do not resolve from the repository root, and the ratio did not change
- [x] T022 Record the owner's answer on counting (option A, B or C), or record that none was requested. Evidence: option A, report only, settled before the build and recorded in `scratch/briefs/00-index.md`. Nothing from options B or C was built
- [x] T023 Extend the description-generator stub to log `--description`, then add an append-mode case asserting "Phase 2" and "Phase 3" for `002-implementation` and `003-integration` in the stub log, `graph-metadata.json` and the `spec.md` title (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh`). Evidence: brief 07, commit `e9059c8073`. The case passes against the current `create.sh`. Against the pre-fix `create.sh` from `8036425eaa^` the suite prints `11 passed, 1 failed`, with this case failing
- [x] T024 Run `tests/test-phase-system.sh` in full and compare with the T006 baseline. Evidence: `Results: 12 passed, 0 failed (of 12)`, exit 0 (baseline 10/0). `npx vitest run cli/tests/create-root-numbering.vitest.ts` from the skill's `runtime` folder prints `Tests  6 passed (6)`, exit 0
- [x] T025 Record the owner's answer on label detection (option A, B or C), or record that none was requested. Evidence: option A, fix at the source only, settled before the build and recorded in `scratch/briefs/00-index.md`. No detection was built in `validate.sh` or `repair-derived.cjs`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T002 is a post-build conformance read
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. T021's real-packet run shows the detail and the unchanged 6/6 ratio
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available, including the 006 build order. Phase 006 is not built in this wave, and brief 06 is committed in `e9059c8073` before any 006 run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` passes on the changed shell files and `node --check` passes on `check-goal.cjs`. Rerun read-only while closing these docs: `bash -n` exit 0 on the rule, its test and `test-phase-system.sh`. `node --check` exit 0 on `check-goal.cjs` and `check-goal.test.cjs`
- [x] CHK-011 [P0] No new stderr output from either validator on the existing fixtures. Evidence, orchestrator at HEAD `baf2876802`, stderr captured per command: `check-goal.cjs <folder>` and `check-goal.cjs <folder>/goal.md` on the parent and all 18 children of `specs/cli-jev/003-cli-jev-workflow-integration`, 19 folders, 0 bytes in either form. `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` exit 0, `tests 20`, `fail 0`, 0 bytes. `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` exit 0, `45 passed, 0 failed`, 0 bytes. `validate.sh --strict` on this phase, on `014-sk-design-doc-and-routing-check`, on `specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation` and on `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment`, each exit 0 with 0 bytes. Stderr is empty at HEAD, so the change added none
- [x] CHK-012 [P1] An unreadable citation is reported and never stops the rule. The cross-family review ran the rule under `set -euo pipefail`: a directory, an unreadable file and a huge line number are reported unresolved and the rule still exits 0
- [x] CHK-013 [P1] Code follows the owner patterns: the detail line mirrors `Malformed evidence citation(s):`, and the checker stays read-only. The two `RULE_DETAILS` lines sit side by side in `run_check()`. The `check-goal.cjs` change only picks which folder to read
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-001 to AC-011 are `Met` in `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual `validate.sh --strict` run on a real packet shows the detail and the unchanged ratio (T021)
- [x] CHK-022 [P1] Edge cases tested: missing file, line past the end, legacy parser, non-goal file path, a new parent's single child. The last is "A new parent's first child is labeled Phase 1" in `test-phase-system.sh`
- [x] CHK-023 [P1] Error scenarios validated: git unavailable falls back to the working directory. Every `check-ac-coverage.sh` fixture except the `git init` one sits under `mktemp -d`, outside any repository, so those cases run on the fallback, and the suite passes 45/0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The citation check is `class-of-bug` (two parser copies). The `goal.md` path is `instance-only`. The `create.sh` label is `class-of-bug` (three label sites), fixed at its source by `8036425eaa`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg 'has_file_line'` finds only the two parser copies. `rg 'Phase \$\{_i\}'` on `create.sh` finds nothing
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. `rg '_ac_analyze_canonical|_ac_analyze_traceability'` finds `run_check()`, `_ac_count_canonical_rows()` (reads `cut -f1`, so the fifth field does not reach it), the test file and one playbook sentence
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Delimiter and joined input: "citations joined by a comma or semicolon split cleanly" and "a legacy row naming two ids reports only real misses". Outside-root: "a citation that climbs out of the folder resolves only to a real file", added in `baf2876802` (brief 13, +3/-0): a `..` citation to a file that exists outside the packet folder resolves, and one to a missing file stays unresolved. The resolver only counts lines and prints nothing from the file, so a climbing citation reveals only whether that file has the line. No-op: "an empty list reports nothing" and "resolving citations add no detail". Fallback: the `mktemp -d` fixtures. Suite `45 passed, 0 failed`, exit 0
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. `plan.md` lists path kind, line and parser, with five required rows
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The reviewer ran the suite under `/bin/bash` 3.2 and the rule under `set -euo pipefail`
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Build `e9059c8073`, review fixes `03e567cfe7`, the outside-root case `baf2876802`, and diffs from `e9059c8073~1`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The added lines hold no key, token, password or secret pattern
- [x] CHK-031 [P0] Input validation implemented: the rule prints citation text only, never file content. The resolver counts lines with a `read` loop and returns only the citation text, as the real-packet detail line shows
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. The stale premises in `scratch/briefs/00-index.md` are corrected in each
- [x] CHK-041 [P1] Code comments adequate and free of spec paths and ids (T015)
- [x] CHK-042 [P2] `validation-rules.md` and the sk-create-goal `scripts/README.md` updated (T012, T013)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. `scratch/` holds only `briefs/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Recorded deviation: `scratch/briefs/` keeps the dispatch briefs on purpose as the record of what each executor was sent, as in phases 012 to 014
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27. CHK-051 is a recorded deviation: `scratch/briefs/` is kept on purpose as the dispatch record, as in phases 012 to 014. It is not an acceptance row
<!-- /ANCHOR:summary -->

---
