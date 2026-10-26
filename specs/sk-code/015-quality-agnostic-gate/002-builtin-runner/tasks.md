---
title: "Tasks: Phase 2: builtin-runner"
description: "Ordered tasks for the built-in runner: setup, the runner build, the proofs, the documentation and the versions."
trigger_phrases:
  - "builtin runner tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 2: builtin-runner

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

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` and the command, then the output it must print.

Shell variables for every command in this list. Run each command from the repository root.
- `Q=.skilled/skills/sk-code/sk-code-quality`
- `H=.skilled/skills/sk-code`
- `P=specs/sk-code/015-quality-agnostic-gate/002-builtin-runner`

The phase headings below group the tasks. They are not the six design phases. This packet is design Phase 2 only. Comments in every new code file state the durable reason only. No packet path, phase number, REQ, ADR or task id appears in a code comment.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm that 001-honest-checker landed, so the checker emits JSON (REQ-005) (`$Q/scripts/check-comment-hygiene.sh`). Verify: `printf 'x = 1\n' > $P/scratch/probe.py && python3 $Q/scripts/check-comment-hygiene.sh --json $P/scratch/probe.py | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')) && 'phase1-json'"` prints `phase1-json`.
- [ ] T002 Re-check the design citations in `plan.md` section 8 against the current tree before any file changes (`$P/plan.md`). Verify: `rg -n 'Nothing is written' .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints one line that begins with `17:`.
- [ ] T003 [P] Record the baseline for the four quality suites and the hook test (`$Q/scripts/check-comment-hygiene.test.sh`, `$Q/scripts/ceiling-report.test.sh`, `$Q/scripts/typo-flags.test.sh`, `$Q/scripts/hooks/claude-posttooluse.test.sh`). Verify: `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo baseline-green` prints `baseline-green`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Write the fixture builder that makes a temporary git repository from quoted strings and takes the D9 snapshot (REQ-015) (`$Q/scripts/tests/fixtures.cjs`). Verify: `node -p "Object.keys(require('./$Q/scripts/tests/fixtures.cjs')).sort().join(',')"` prints `assertSnapshotUnchanged,buildRepo`.
- [ ] T005 [P] Write the quality defaults with sensor settings, the quality-owned checklist rows and no command key (REQ-009) (`$Q/assets/quality-defaults.json`). Verify: `node -p "'commands' in require('./$Q/assets/quality-defaults.json')"` prints `false`.
- [ ] T006 Write the `node:test` file with one case per named fixture and one `unit:` case for each unit name that `acceptance-criteria.md` uses (REQ-015) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `rg -c "test\('F(0[1-5]|10|1[234]|1[678])" $Q/scripts/tests/quality-gate.test.cjs` prints `12`.
- [ ] T007 Write the spawn module with argv arrays, the per-check timeout, the tool probe, the state mapping and the content-hash guard (REQ-004) (`$Q/scripts/lib/run-check.cjs`). Verify: `node --test --test-name-pattern='unit: argv spawn and guard' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T008 Write the scope stage for `--worktree`, `--base` and `--files`, with changed lines from `git diff -U0` and the unchecked-file report (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F10' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T009 Write the verdict assembly and the exit precedence 3, 1, 4, 2, 0 (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: exit precedence' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T010 Write the single hygiene call through `check-comment-hygiene.sh --json` and the changed-line and touched-file blocking rules (REQ-005) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F0[34]' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T011 Write the conflict-marker, secret and debug-leftover sensors, with no matched text in a secret finding (REQ-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F12' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T012 Write the syntax floor that follows the shebang before the extension (REQ-007) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F1[38]' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T013 Write the pre-commit, CI and post-edit layer probes with the five state values (REQ-008) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: layers' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T014 Write the python-absent path, which reports SKIPPED_ABSENT and UNVERIFIED with exit 4 (REQ-016) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F17' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T015 [P] Add the `quality.checklists` rows for SKILLED and `sk-code-ci` to the registry entries (REQ-011) (`$H/mode-registry.json`). Verify: `node -p "require('./$H/mode-registry.json').modes.filter(m => m.quality).map(m => m.workflowMode).join(',')"` prints `sk-code-skilled,sk-code-ci`.
- [ ] T016 Write the compiler validator `QUALITY_DECLARATION_INVALID` beside `SURFACE_DETECTION_INVALID` (REQ-011) (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`). Verify: `node --test --test-name-pattern='unit: compiler rejects' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T017 Add the per-kind marker lists beside the merged list in `surfaceEntry`, with the exported names unchanged (REQ-012) (`$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs`). Verify: `node -p "(s => Array.isArray(s.pathMarkers) && Array.isArray(s.contentMarkers))(require('./$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs').declaredSurfaces('./$H')[0])"` prints `true`.
- [ ] T018 Write checklist resolution from the floor, the defaults and the declarations, with the `hub:` prefix and the real-path guard (REQ-009, REQ-010) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F1[46]|unit: real-path guard' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T019 Write the `json`, `text` and `envelope` renderers with the `checker_outputs` grammar and the PENDING fields (REQ-001, REQ-013) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: envelope' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T020 Write the private-label rule so a `local-*` surface prints its label only (REQ-014) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: private label' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T021 Write the flags `--lines changed|file`, `--only`, `--skip`, `--no-run`, `--timeout` and `--explain`, and reject `--config` with exit 3 (REQ-020, REQ-021) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: flags' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T022 Write the dist adapter that runs per file for declared generated paths, sets `SPECKIT_DIST_AUTO_REBUILD=0` and reads the banner text (REQ-023) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='unit: dist adapter' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T023 Write the test-only hub override `SK_CODE_QUALITY_HUB_ROOT`, which can change checklists and never commands (REQ-015) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-name-pattern='^F16' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T024 [P] Add the `unit: target map` case, which checks that the `Q/SKILL.md` target map equals the declarations (REQ-019) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-name-pattern='unit: target map' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
- [ ] T025 Write `runner-contract.md` with eight `##` sections: CLI, exit codes and states, verdict schema, envelope grammar, rule ids, reader rules, checker input fields and the dist adapter (REQ-018) (`$Q/references/runner-contract.md`). Verify: `rg -c '^## ' $Q/references/runner-contract.md` prints `8`.
- [ ] T026 Update the workflow, tree, loading table, target map, enforcement table, envelope section and rules to name the runner (REQ-019) (`$Q/SKILL.md`). The workflow gains the restraint step: before a gate fix adds code, apply the Design Restraint Ladder in `code-quality-standards.md`. The P0 table moves "unchecked generated drift" and "missing required checklist evidence" to UNVERIFIED. ALWAYS gains "run the runner before any quality-pass claim", and NEVER gains "never run a command the repository layer does not name". The UNKNOWN escalation line stays for phase 004. `DEFAULT_RESOURCE` follows the new ALWAYS rows of the loading table, and the CQ-001 path loop at line 73 of `$Q/manual-testing-playbook/quality-gate/quality-checklist.md` names the same paths. Verify: `rg -c 'quality-gate.cjs' $Q/SKILL.md` prints a number of 4 or more, `rg -c 'Design Restraint Ladder' $Q/SKILL.md` prints a number of 1 or more, and `sed -n '/^DEFAULT_RESOURCE/,/^]/p' $Q/SKILL.md` lists the same paths as the line 73 loop.
- [ ] T027 [P] Add the runner row to the reader table, after line 125 (REQ-018) (`$H/shared/references/stack-detection.md`). Verify: `rg -n 'quality-gate' $H/shared/references/stack-detection.md` prints one line whose number is between 121 and 128.
- [ ] T028 [P] Replace the pointer-only statement in the lib README with the new module, and add the `node --test` suite to the VALIDATION list of the scripts README beside the four bash suites (REQ-019) (`$Q/scripts/lib/README.md`, `$Q/scripts/README.md`). Verify: `! rg -n 'pointer only' $Q/scripts/lib/README.md && echo pointer-removed` prints `pointer-removed`, and `rg -c 'scripts/tests/' $Q/scripts/README.md` prints a number of 1 or more.
- [ ] T029 [P] Add the `node --test` row for the quality tests to the sk-code script test workflow (REQ-024) (`.github/workflows/sk-code-script-tests.yml`). Verify: `actionlint .github/workflows/sk-code-script-tests.yml && rg -c 'sk-code-quality/scripts/tests' .github/workflows/sk-code-script-tests.yml` prints `1` after `actionlint` exits 0.
- [ ] T030 Bump the packet version to 1.6.0.0 and write the packet changelog (REQ-022) (`$Q/SKILL.md`, `$Q/changelog/v1.6.0.0.md`). Verify: `rg -n '^version: 1\.6\.0\.0$' $Q/SKILL.md` prints one line.
- [ ] T031 [P] Bump the hub version to 3.2.0.0 in `hub-router.json`, `mode-registry.json` and `description.json` (REQ-022) (`$H/hub-router.json`, `$H/mode-registry.json`, `$H/description.json`). Verify: `node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints `3.2.0.0,3.2.0.0,3.2.0.0`.
- [ ] T032 Bump the hub `SKILL.md` version to 3.2.0.0 and write the hub changelog (REQ-022) (`$H/SKILL.md`, `$H/changelog/v3.2.0.0.md`). Verify: `rg -n '^version: 3\.2\.0\.0$' $H/SKILL.md && test -f $H/changelog/v3.2.0.0.md && echo hub-changelog-ok` prints the version line and `hub-changelog-ok`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T033 Run the four quality test groups together, so the full `node:test` run passes (REQ-015) (`$Q/scripts/tests/*.test.cjs`). Verify: `node --test $Q/scripts/tests/*.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`.
- [ ] T034 Run the twelve named fixtures alone, and confirm each one passes (REQ-015) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-name-pattern='^F(0[1-5]|10|1[234]|1[678])' $Q/scripts/tests/quality-gate.test.cjs 2>&1 | rg '^# pass'` prints `# pass 12`.
- [ ] T035 Run the self-run proof on `check-comment-hygiene.sh` (SC-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format json | node -p "(v => v.resolved_surface.includes('SKILLED') && !v.findings.some(f => f.rule.startsWith('syntax.')))(JSON.parse(require('fs').readFileSync(0, 'utf8')))"` prints `true`.
- [ ] T036 Run the foreign smoke test on an untracked Go file with a spec-style comment (SC-004) (`$Q/scripts/quality-gate.cjs`). Verify: `ROOT=$(git rev-parse --show-toplevel) && T=$(mktemp -d) && git -C "$T" init -q && printf 'package a\n\n// see ADR-12\nfunc A() {}\n' > "$T/a.go" && (cd "$T" && node "$ROOT/$Q/scripts/quality-gate.cjs" > "$T/v.json" || echo "exit=$?") && node -p "(v => v.gate === 'BLOCKED' && v.resolved_surface[0] === 'unknown')(require('$T/v.json'))"` prints `exit=1` and then `true`.
- [ ] T037 Run the two hub validators on `sk-code` (SC-005) (`$H/mode-registry.json`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check && node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H > /dev/null && echo hub-validators-ok` prints `hub-validators-ok`.
- [ ] T038 Confirm the envelope never contains a `local-` label or a pass value (SC-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format envelope | grep -c -e 'local-' -e 'status: pass'` prints `0`.
- [ ] T039 Run the comment hygiene check on every new code file (REQ-017) (`$Q/scripts/quality-gate.cjs`, `$Q/scripts/lib/run-check.cjs`, `$Q/scripts/tests/fixtures.cjs`, `$Q/scripts/tests/quality-gate.test.cjs`). Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $Q/scripts/tests/quality-gate.test.cjs && echo clean` prints `clean`.
- [ ] T040 Confirm that no file this phase creates or changes names a private skill other than `local-example` (REQ-014). The three quality checklist files that still name one today are phase 004's, and the released `v1.4.0.0.md` changelog stays unchanged (`$Q/scripts`, `$Q/assets/quality-defaults.json`, `$Q/references/runner-contract.md`, `$Q/SKILL.md`, `$H/mode-registry.json`, `$P`). Verify: `! rg -l 'local-(webflow|obsidian)' $Q/scripts $Q/assets/quality-defaults.json $Q/references/runner-contract.md $Q/SKILL.md $H/mode-registry.json $P && echo no-private-names` prints `no-private-names`.
- [ ] T041 Remove the probe file and confirm that `scratch/` holds only its placeholder (`$P/scratch/`). Verify: `rm -f $P/scratch/probe.py && ls -A $P/scratch` prints `.gitkeep`.
- [ ] T042 [P] Record the outputs of T035, T036, T037 and T038 in the implementation summary (`$P/implementation-summary.md`). Verify: `rg -c 'exit=1|hub-validators-ok|RESULT: PASSED' $P/implementation-summary.md` prints `3` or more.
- [ ] T043 Validate the packet with the strict validator and read the final line (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict --no-recursive | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The seven criteria in `goal.md` section 3 pass on the branch head
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`. Its requirements REQ-001 to REQ-024 are the list this file implements.
- **Plan**: See `plan.md`. Its four steps group the tasks above.
- **Decisions**: See `decision-record.md`. Each task that changes a decision names the ADR it implements.
- **Acceptance**: See `acceptance-criteria.md`. Each AC row names the task that proves it.
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

- [ ] CHK-001 [P0] `001-honest-checker` landed. T001 prints `phase1-json`.
- [ ] CHK-002 [P0] Scope and REQ list are frozen in `spec.md`. `rg -c '^\| REQ-' $P/spec.md` prints 24.
- [ ] CHK-003 [P1] Every design citation in `plan.md` section 8 was re-checked at the current tree. T002 prints line 17.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] New code files pass the comment hygiene check. T039 prints `clean`.
- [ ] CHK-011 [P0] No code comment names a packet path, phase, REQ, ADR or task id. `rg -n 'REQ-|ADR-|T[0-9]{3}|015-quality|002-builtin' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $Q/scripts/tests/quality-gate.test.cjs` prints nothing.
- [ ] CHK-012 [P1] Every module exports only the names the tasks list. T004, T007 and T018 print their export lists.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All seven criteria in `goal.md` section 3 pass. T033 to T038 record them.
- [ ] CHK-021 [P0] The self-run and the foreign smoke test pass. T035 and T036 print `true` and `exit=1`.
- [ ] CHK-022 [P1] Edge cases in `spec.md` section L2 each have one fixture or one `unit:` case. T006 counts the named fixtures.
- [ ] CHK-023 [P1] Error scenarios in `spec.md` section L2 are tested, including the python-absent path (T014) and the missing named file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding carries a finding class: `hygiene`, `conflict`, `secret`, `syntax`, `debug` or `layer`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for `surfaceEntry` and `declaredSurfaces`, as `plan.md` section FIX ADDENDUM lists.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the registry fields, the reader, the advisor copy and the checker output.
- [ ] CHK-FIX-004 [P0] The real-path guard has adversarial cases for a symlink to another repository, a symlink to a `local-*` folder, `..` segments and spaces (`unit: real-path guard`).
- [ ] CHK-FIX-005 [P1] Matrix axes and fixture rows are listed in `plan.md` section FIX ADDENDUM before completion is claimed.
- [ ] CHK-FIX-006 [P1] The fixture tests set `SK_CODE_QUALITY_HUB_ROOT` and `SPECKIT_DIST_AUTO_REBUILD` only inside the test process, and restore them after each case.
- [ ] CHK-FIX-007 [P1] Evidence for T035 to T038 is pinned to the branch head commit, not to a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. The secret fixtures join their fragments at run time, and no literal key reaches the repository.
- [ ] CHK-031 [P0] Input validation for every path and argv. A file path is resolved and checked against the repository root before any spawn.
- [ ] CHK-032 [P1] N/A: the runner has no authentication or authorization surface. It reads files and runs built-in checks only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Every REQ id in `spec.md` appears in `acceptance-criteria.md`. `diff <(rg -o 'REQ-0[0-9]{2}' $P/spec.md | sort -u) <(rg -o 'REQ-0[0-9]{2}' $P/acceptance-criteria.md | sort -u)` prints nothing.
- [ ] CHK-041 [P1] `runner-contract.md` documents every field the verdict prints. T025 prints 8.
- [ ] CHK-042 [P2] `Q/SKILL.md` and `runner-contract.md` both name the exit states. `rg -c 'NOTHING_CHECKED|UNVERIFIED' $Q/SKILL.md $Q/references/runner-contract.md` prints a count of at least 1 for each file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only. T001 writes its probe there, and T041 removes it.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion. T041 prints `.gitkeep`.
- [ ] CHK-052 [P0] No file outside the scope in `spec.md` section 3 changed. `git status --porcelain` lists only the files named there.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

