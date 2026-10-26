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

- [x] T001 Confirm that 001-honest-checker landed, so the checker emits JSON (REQ-005) (`$Q/scripts/check-comment-hygiene.sh`). Verify: `printf 'x = 1\n' > $P/scratch/probe.py && python3 $Q/scripts/check-comment-hygiene.sh --json $P/scratch/probe.py | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')) && 'phase1-json'"` prints `phase1-json`. Evidence 2026-10-26: the Verify command printed `phase1-json`, exit 0.
- [x] T002 Re-check the design citations in `plan.md` section 8 against the current tree before any file changes (`$P/plan.md`). Verify: `rg -n 'Nothing is written' .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints one line that begins with `17:`. Evidence 2026-10-26: the `rg` printed one line, `17:// the battery reports the tree a caller would see. Nothing is written...`. The plan section 8 citations were re-read at this tree, and the `Q/SKILL.md` envelope anchors sat about 4 lines lower after Phase 1 (envelope 214 to 226, `checker_outputs` at 221).
- [x] T003 [P] Record the baseline for the four quality suites and the hook test (`$Q/scripts/check-comment-hygiene.test.sh`, `$Q/scripts/ceiling-report.test.sh`, `$Q/scripts/typo-flags.test.sh`, `$Q/scripts/hooks/claude-posttooluse.test.sh`). Verify: `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo baseline-green` prints `baseline-green`. Evidence 2026-10-26: the Verify command printed `baseline-green`. The suites printed 95, 11 and 9 PASS lines and `Post-edit adapter parse regression fixture passed`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Write the fixture builder that makes a temporary git repository from quoted strings and takes the D9 snapshot (REQ-015) (`$Q/scripts/tests/fixtures.cjs`). Verify: `node -p "Object.keys(require('./$Q/scripts/tests/fixtures.cjs')).sort().join(',')"` prints `assertSnapshotUnchanged,buildRepo`. Evidence 2026-10-26: the Verify command printed `assertSnapshotUnchanged,buildRepo`.
- [x] T005 [P] Write the quality defaults with sensor settings, the quality-owned checklist rows and no command key (REQ-009) (`$Q/assets/quality-defaults.json`). Verify: `node -p "'commands' in require('./$Q/assets/quality-defaults.json')"` prints `false`. Evidence 2026-10-26: the Verify command printed `false`.
- [x] T006 Write the `node:test` file with one case per named fixture and one `unit:` case for each unit name that `acceptance-criteria.md` uses (REQ-015) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `rg -c "test\('F(0[1-5]|10|1[234]|1[678])" $Q/scripts/tests/quality-gate.test.cjs` prints `12`. Evidence 2026-10-26: the Verify command printed `12`. The file holds 27 cases: the twelve named fixtures, the ten unit names from `acceptance-criteria.md`, `unit: checker failure`, and the four review-fix cases `unit: secret redaction`, `unit: sensors`, `unit: jsonc` and `unit: changed lines`.
- [x] T007 Write the spawn module with argv arrays, the per-check timeout, the tool probe, the state mapping and the content-hash guard (REQ-004) (`$Q/scripts/lib/run-check.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: argv spawn and guard' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. The command carries `--test-reporter=tap`, because Node 26 prints its default spec reporter (`ℹ fail 0`) even when piped. After the review fixes it also asserts that a mutation names the check that ran, and the guard takes one snapshot pair around every spawned check.
- [x] T008 Write the scope stage for `--worktree`, `--base` and `--files`, with changed lines from `git diff -U0` and the unchecked-file report (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F10' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Review fix: git ends a `+++` header with a tab when the name holds a space, and the diff parser kept it, so a changed line of `my file.js` read as touched-file. The parser now drops the tab, and `unit: changed lines` (a tracked `a b.js` and `é f.py`) printed `# pass 1`.
- [x] T009 Write the verdict assembly and the exit precedence 3, 1, 4, 2, 0 (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: exit precedence' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`.
- [x] T010 Write the single hygiene call through `check-comment-hygiene.sh --json` and the changed-line and touched-file blocking rules (REQ-005) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F0[34]' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 2` and `# fail 0`.
- [x] T011 Write the conflict-marker, secret and debug-leftover sensors, with no matched text in a secret finding (REQ-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F12' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Review fixes: a parser message quoted a key in full (`node --check`, the CommonJS compile) or in part (`JSON.parse`), and a 200-character excerpt cut a key past the signature, so the redaction now reads the source line and the file's own keys and withholds a parser message in a file that holds a key. The conflict and secret sensors now also scan a readable file with no comment family, such as `.env` or Markdown, and such a file stays unchecked. `unit: secret redaction` and `unit: sensors` printed `# pass 2`. Deviation: debug-leftovers stays on checked files, because a debugger line in a Markdown or text file is an example.
- [x] T012 Write the syntax floor that follows the shebang before the extension (REQ-007) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F1[38]' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 2` and `# fail 0`. Review fix: `.vscode/*.json`, `devcontainer.json`, `.devcontainer.json` and `.eslintrc.json` parse as JSONC, and any other `.json` that parses only as JSONC gets a heuristic finding that does not block. `unit: jsonc` printed `# pass 1`.
- [x] T013 Write the pre-commit, CI and post-edit layer probes with the five state values (REQ-008) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: layers' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`.
- [x] T014 Write the python-absent path, which reports SKIPPED_ABSENT and UNVERIFIED with exit 4 (REQ-016) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F17' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Deviation: F17 sets PATH to a temporary folder that holds only a link to node, because the folder node lives in can also hold `python3` and `git`.
- [x] T015 [P] Add the `quality.checklists` rows for SKILLED and `sk-code-ci` to the registry entries (REQ-011) (`$H/mode-registry.json`). Verify: `node -p "require('./$H/mode-registry.json').modes.filter(m => m.quality).map(m => m.workflowMode).join(',')"` prints `sk-code-skilled,sk-code-ci`. Evidence 2026-10-26: the Verify command printed `sk-code-skilled,sk-code-ci`.
- [x] T016 Write the compiler validator `QUALITY_DECLARATION_INVALID` beside `SURFACE_DETECTION_INVALID` (REQ-011) (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: compiler rejects' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Deviation: the served compiler is a promoted copy, so the edit went into its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`, and `node .skilled/bin/compiled-route-sync.cjs` promoted it (`promoted 62 closure files`), then `--finalize` removed the rollback. The sk-code activation manifest was refreshed with `compiled-route-manifest.cjs refresh --hub sk-code` and copied to its authored twin.
- [x] T017 Add the per-kind marker lists beside the merged list in `surfaceEntry`, with the exported names unchanged (REQ-012) (`$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs`). Verify: `node -p "(s => Array.isArray(s.pathMarkers) && Array.isArray(s.contentMarkers))(require('./$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs').declaredSurfaces('./$H')[0])"` prints `true`. Evidence 2026-10-26: the Verify command printed `true`.
- [x] T018 Write checklist resolution from the floor, the defaults and the declarations, with the `hub:` prefix and the real-path guard (REQ-009, REQ-010) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F1[46]|unit: real-path guard' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 3` and `# fail 0`.
- [x] T019 Write the `json`, `text` and `envelope` renderers with the `checker_outputs` grammar and the PENDING fields (REQ-001, REQ-013) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: envelope' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`.
- [x] T020 Write the private-label rule so a `local-*` surface prints its label only (REQ-014) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: private label' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Review fix: REQ-014 and SC-006 now state the contract's rule, a path segment or word that starts with `local-`, and the rule also catches a word after `(` or a quote. The case asserts `nonlocal-config.js` and `.local-env.sh` print as they are and `docs/(local-draft).js` prints `docs/(<PRIVATE>).js`.
- [x] T021 Write the flags `--lines changed|file`, `--only`, `--skip`, `--no-run`, `--timeout` and `--explain`, and reject `--config` with exit 3 (REQ-020, REQ-021) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: flags' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. `--no-run` follows ADR-017. Review fix: `--timeout 0.0004` rounded to a 0 ms deadline, which spawnSync reads as none, so the deadline now rounds up to 1 ms, and the case asserts `TIMEOUT` for it.
- [x] T022 Write the dist adapter that runs per file for declared generated paths, sets `SPECKIT_DIST_AUTO_REBUILD=0` and reads the banner text (REQ-023) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: dist adapter' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. The case drives a stand-in checker, and the defaults declare no generated path (ADR-018).
- [x] T023 Write the test-only hub override `SK_CODE_QUALITY_HUB_ROOT`, which can change checklists and never commands (REQ-015) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F16' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`.
- [x] T024 [P] Add the `unit: target map` case, which checks that the `Q/SKILL.md` target map equals the declarations (REQ-019) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: target map' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`.
- [x] T025 Write `runner-contract.md` with eight `##` sections: CLI, exit codes and states, verdict schema, envelope grammar, rule ids, reader rules, checker input fields and the dist adapter (REQ-018) (`$Q/references/runner-contract.md`). Verify: `rg -c '^## ' $Q/references/runner-contract.md` prints `8`. Evidence 2026-10-26: the Verify command printed `8`. Deviation: section 1 is titled `OVERVIEW AND CLI`, because `validate_document.py` requires an overview section in a reference, and a ninth section would break the count.
- [x] T026 Update the workflow, tree, loading table, target map, enforcement table, envelope section and rules to name the runner (REQ-019) (`$Q/SKILL.md`). The workflow gains the restraint step: before a gate fix adds code, apply the Design Restraint Ladder in `code-quality-standards.md`. The P0 table moves "unchecked generated drift" and "missing required checklist evidence" to UNVERIFIED. ALWAYS gains "run the runner before any quality-pass claim", and NEVER gains "never run a command the repository layer does not name". The UNKNOWN escalation line stays for phase 004. `DEFAULT_RESOURCE` follows the new ALWAYS rows of the loading table, and the CQ-001 path loop at line 73 of `$Q/manual-testing-playbook/quality-gate/quality-checklist.md` names the same paths. Verify: `rg -c 'quality-gate.cjs' $Q/SKILL.md` prints a number of 4 or more, `rg -c 'Design Restraint Ladder' $Q/SKILL.md` prints a number of 1 or more, and `sed -n '/^DEFAULT_RESOURCE/,/^]/p' $Q/SKILL.md` lists the same paths as the line 73 loop. Evidence 2026-10-26: `rg -c 'quality-gate.cjs'` printed `11`, `rg -c 'Design Restraint Ladder'` printed `1`, and `DEFAULT_RESOURCE` lists `references/runner-contract.md`, `../shared/references/universal/code-quality-standards.md` and `references/code-style-guide.md`, the same three paths as the line 73 loop. CQ-001 `expected_resources` now names `references/runner-contract.md` in place of the SKILLED checklist, and the playbook moved to 1.1.3.0.
- [x] T027 [P] Add the runner row to the reader table, after line 125 (REQ-018) (`$H/shared/references/stack-detection.md`). Verify: `rg -n 'quality-gate' $H/shared/references/stack-detection.md` prints one line whose number is between 121 and 128. Evidence 2026-10-26: the Verify command printed one line, numbered `126`. The doc moved to 2.2.7.0.
- [x] T028 [P] Replace the pointer-only statement in the lib README with the new module, and add the `node --test` suite to the VALIDATION list of the scripts README beside the four bash suites (REQ-019) (`$Q/scripts/lib/README.md`, `$Q/scripts/README.md`). Verify: `! rg -n 'pointer only' $Q/scripts/lib/README.md && echo pointer-removed` prints `pointer-removed`, and `rg -c 'scripts/tests/' $Q/scripts/README.md` prints a number of 1 or more. Evidence 2026-10-26: the first command printed `pointer-removed`, and `rg -c 'scripts/tests/'` printed `1`.
- [x] T029 [P] Add the `node --test` row for the quality tests to the sk-code script test workflow (REQ-024) (`.github/workflows/sk-code-script-tests.yml`). Verify: `actionlint .github/workflows/sk-code-script-tests.yml && rg -c 'sk-code-quality/scripts/tests' .github/workflows/sk-code-script-tests.yml` prints `1` after `actionlint` exits 0. Evidence 2026-10-26: `actionlint` exited 0, and the count printed `1`. Review fix: both path filters gain the three compiled-routing folders that `unit: compiler rejects` loads, so a compiler-only change runs the suite.
- [x] T030 Bump the packet version to 1.6.0.0 and write the packet changelog (REQ-022) (`$Q/SKILL.md`, `$Q/changelog/v1.6.0.0.md`). Verify: `rg -n '^version: 1\.6\.0\.0$' $Q/SKILL.md` prints one line. Evidence 2026-10-26: the Verify command printed `5:version: 1.6.0.0`. `validate_document.py --type changelog` on `v1.6.0.0.md` printed `VALID`, 0 issues.
- [x] T031 [P] Bump the hub version to 3.2.0.0 in `hub-router.json`, `mode-registry.json` and `description.json` (REQ-022) (`$H/hub-router.json`, `$H/mode-registry.json`, `$H/description.json`). Verify: `node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints `3.2.0.0,3.2.0.0,3.2.0.0`. Evidence 2026-10-26: the Verify command printed `3.2.0.0,3.2.0.0,3.2.0.0`.
- [x] T032 Bump the hub `SKILL.md` version to 3.2.0.0 and write the hub changelog (REQ-022) (`$H/SKILL.md`, `$H/changelog/v3.2.0.0.md`). Verify: `rg -n '^version: 3\.2\.0\.0$' $H/SKILL.md && test -f $H/changelog/v3.2.0.0.md && echo hub-changelog-ok` prints the version line and `hub-changelog-ok`. Evidence 2026-10-26: the Verify command printed `5:version: 3.2.0.0` and `hub-changelog-ok`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T033 Run the four quality test groups together, so the full `node:test` run passes (REQ-015) (`$Q/scripts/tests/*.test.cjs`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/*.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# fail 0`, with `# tests 27` and `# pass 27`, after the review fixes.
- [x] T034 Run the twelve named fixtures alone, and confirm each one passes (REQ-015) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F(0[1-5]|10|1[234]|1[678])' $Q/scripts/tests/quality-gate.test.cjs 2>&1 | rg '^# pass'` prints `# pass 12`. Evidence 2026-10-26: the Verify command printed `# pass 12` and `# fail 0`. Deviation: F02 seeds six strings (`100/250`, `UTF-8`, `SHA-256`, `RFC 7231`, `HTTP 404`, `CWE-79`). The Phase 1 checker still flags `phase 0 prepares` and `T1000` by its own recorded decision, so the design's other two strings would fail a fixture that expects zero findings.
- [x] T035 Run the self-run proof on `check-comment-hygiene.sh` (SC-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format json | node -p "(v => v.resolved_surface.includes('SKILLED') && !v.findings.some(f => f.rule.startsWith('syntax.')))(JSON.parse(require('fs').readFileSync(0, 'utf8')))"` prints `true`. Evidence 2026-10-26: the Verify command printed `true`.
- [x] T036 Run the foreign smoke test on an untracked Go file with a spec-style comment (SC-004) (`$Q/scripts/quality-gate.cjs`). Verify: `ROOT=$(git rev-parse --show-toplevel) && T=$(mktemp -d) && git -C "$T" init -q && printf 'package a\n\n// see ADR-12\nfunc A() {}\n' > "$T/a.go" && (cd "$T" && node "$ROOT/$Q/scripts/quality-gate.cjs" > "$T/v.json" || echo "exit=$?") && node -p "(v => v.gate === 'BLOCKED' && v.resolved_surface[0] === 'unknown')(require('$T/v.json'))"` prints `exit=1` and then `true`. Evidence 2026-10-26: the Verify command printed `exit=1` and then `true`.
- [x] T037 Run the two hub validators on `sk-code` (SC-005) (`$H/mode-registry.json`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check && node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H > /dev/null && echo hub-validators-ok` prints `hub-validators-ok`. Evidence 2026-10-26: the Verify command printed `all 7 hubs resolve`, `all 55 served copies match their authored files` and `hub-validators-ok`.
- [x] T038 Confirm the envelope never contains a `local-` label or a pass value (SC-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format envelope | grep -c -e 'local-' -e 'status: pass'` prints `0`. Evidence 2026-10-26: the Verify command printed `0`.
- [x] T039 Run the comment hygiene check on every new code file (REQ-017) (`$Q/scripts/quality-gate.cjs`, `$Q/scripts/lib/run-check.cjs`, `$Q/scripts/tests/fixtures.cjs`, `$Q/scripts/tests/quality-gate.test.cjs`). Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $Q/scripts/tests/quality-gate.test.cjs && echo clean` prints `clean`. Evidence 2026-10-26: the Verify command printed `clean`.
- [x] T040 Confirm that no file this phase creates or changes names a private skill other than `local-example` (REQ-014). The three quality checklist files that still name one today are phase 004's, and the released `v1.4.0.0.md` changelog stays unchanged (`$Q/scripts`, `$Q/assets/quality-defaults.json`, `$Q/references/runner-contract.md`, `$Q/SKILL.md`, `$H/mode-registry.json`, `$P`). Verify: `! rg -l 'local-(webflow|obsidian)' $Q/scripts $Q/assets/quality-defaults.json $Q/references/runner-contract.md $Q/SKILL.md $H/mode-registry.json $P && echo no-private-names` prints `no-private-names`. Evidence 2026-10-26: the Verify command printed `no-private-names`.
- [x] T041 Remove the probe file and confirm that `scratch/` holds only its placeholder (`$P/scratch/`). Verify: `rm -f $P/scratch/probe.py && ls -A $P/scratch` prints `.gitkeep`. Evidence 2026-10-26: the Verify command printed `.gitkeep`. The baseline logs this run wrote to `scratch/` were removed with the probe, after their numbers were copied into this file and `implementation-summary.md`.
- [x] T042 [P] Record the outputs of T035, T036, T037 and T038 in the implementation summary (`$P/implementation-summary.md`). Verify: `rg -c 'exit=1|hub-validators-ok|RESULT: PASSED' $P/implementation-summary.md` prints `3` or more. Evidence 2026-10-26: the Verify command printed `4`. The summary records `exit=1`, `hub-validators-ok`, `true` and `0` from T035 to T038, and the strict result.
- [x] T043 Validate the packet with the strict validator and read the final line (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict --no-recursive | tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26: the Verify command printed `RESULT: PASSED`, with `Summary: Errors: 0  Warnings: 0`, rerun after T044 to T046.
- [x] T044 Describe the runner in the packet README: the quick start runs the runner, the universal checklist loads only for SKILLED, and the verification and related tables name the runner and its contract (REQ-019) (`$Q/README.md`). Verify: `rg -c 'quality-gate.cjs' $Q/README.md` prints a number of 3 or more, and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $Q/README.md --type readme` prints `VALID`. Evidence 2026-10-26: `rg -c` printed `4`, and the validator printed `VALID` with 0 issues. The README moved from 1.2.5.0 to 1.3.0.0.
- [x] T045 Run every spawned check between one guard snapshot and the next, and compare a file over 2 MB by size and change time (NFR-P01) (`$Q/scripts/quality-gate.cjs`, `$Q/scripts/lib/run-check.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='unit: argv spawn and guard' $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the Verify command printed `# pass 1` and `# fail 0`. Measured in this worktree, 93 files in scope: the full run fell from 3.28 s and 3.35 s to between 2.59 s and 3.14 s over three runs, with `--no-run` at 0.92 s to 1.12 s. One `git ls-files --others` walk costs about 0.63 s here, and a run now takes two in its guard instead of three to five. Phase 6 gates the budget.
- [x] T046 Name the derived and companion files in `spec.md` section 3, record the `ROUTER.md` CODE_QUALITY row as Phase 5 work, and narrow the leaf-manifest line in Out of Scope (`$P/spec.md`). Verify: `rg -c 'Regenerate' $P/spec.md` prints a number of 4 or more, and `rg -c 'ROUTER.md' $P/spec.md` prints `1`. Evidence 2026-10-26: the two counts printed `5` and `1`. Revised after review: Phase 5 plans only the runner-contract resource and its ADR-010 keeps the `universal-checklist.md` entry, so the Out of Scope line now says no phase plans to scope that entry to SKILLED, and Known Limitations item 8 records it. The two counts then printed `5` and `1` again.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The seven criteria in `goal.md` section 3 pass on the branch head
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

- [x] CHK-001 [P0] `001-honest-checker` landed. T001 prints `phase1-json`. Evidence 2026-10-26: T001 printed `phase1-json`.
- [x] CHK-002 [P0] Scope and REQ list are frozen in `spec.md`. `rg -c '^\| REQ-' $P/spec.md` prints 24. Evidence 2026-10-26: `rg -c '^\| REQ-' spec.md` printed `24`.
- [x] CHK-003 [P1] Every design citation in `plan.md` section 8 was re-checked at the current tree. T002 prints line 17. Evidence 2026-10-26: T002 printed the line numbered 17.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New code files pass the comment hygiene check. T039 prints `clean`. Evidence 2026-10-26: T039 printed `clean`, and the same checker printed no finding for `router-replay-lib.cjs` and the authored compiler.
- [x] CHK-011 [P0] No code comment names a packet path, phase, REQ, ADR or task id. `rg -n 'REQ-|ADR-|T[0-9]{3}|015-quality|002-builtin' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $Q/scripts/tests/quality-gate.test.cjs` prints nothing. Evidence 2026-10-26: the `rg` printed nothing and exited 1.
- [x] CHK-012 [P1] Every module exports only the names the tasks list. T004, T007 and T018 print their export lists. Evidence 2026-10-26: T004 printed `assertSnapshotUnchanged,buildRepo`. `Object.keys` printed `findTool,runGit,spawnArgv,withGuard` for `lib/run-check.cjs` and `decideGate,runDistAdapter` for `quality-gate.cjs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All seven criteria in `goal.md` section 3 pass. T033 to T038 record them. Evidence 2026-10-26: the seven `goal.md` criteria ran on HEAD `a1673881f2` with this working tree, again after the review fixes: `# fail 0`, `# pass 12` and `# fail 0`, `true`, `exit=1` then `true`, both validators exit 0, both version lines and both changelog files listed, and `0`.
- [x] CHK-021 [P0] The self-run and the foreign smoke test pass. T035 and T036 print `true` and `exit=1`. Evidence 2026-10-26: T035 printed `true`. T036 printed `exit=1` and `true`.
- [x] CHK-022 [P1] Edge cases in `spec.md` section L2 each have one fixture or one `unit:` case. T006 counts the named fixtures. Evidence 2026-10-26: each L2 edge case maps to a case: empty input, the size limit and an internal error in `unit: exit precedence`, binary and no comment family in F05, checker failure in `unit: checker failure`, timeout in `unit: flags`, the missing file and no git in F10, the symlink in `unit: real-path guard`, and partial completion in F17, where hygiene is skipped and the other checks still report `RAN_CLEAN`. The no-comment-family edge case also has `unit: sensors`, where the sensors scan a Markdown and a `.env` file that stay unchecked.
- [x] CHK-023 [P1] Error scenarios in `spec.md` section L2 are tested, including the python-absent path (T014) and the missing named file. Evidence 2026-10-26: F17 covers python3 absent, F10 and `unit: envelope` cover `FILE_NOT_FOUND`, `unit: flags` covers six usage errors and `BASE_NOT_FOUND`, and `unit: argv spawn and guard` covers `CHECK_MUTATED_WORKSPACE`. All passed in the 23-case run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding carries a finding class: `hygiene`, `conflict`, `secret`, `syntax`, `debug` or `layer`. Evidence 2026-10-26: every finding carries a `<class>.<name>` rule id from `hygiene`, `conflict`, `secret`, `syntax`, `debug` or `dist`. Deviation: no finding has the `layer` class, because layer states are verdict fields (`layers`), and the dist adapter adds the `dist` class. `runner-contract.md` section 5 lists the ids.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for `surfaceEntry` and `declaredSurfaces`, as `plan.md` section FIX ADDENDUM lists. Evidence 2026-10-26: `rg -n 'surfaceEntry|declaredSurfaces' .skilled --glob '*.cjs' --glob '*.js'` listed `router-replay-lib.cjs` (lines 499, 523, 529, 534, 671, 780) and the runner (lines 776, 777, 1366, 1518). The advisor copy at `.skilled/plugins/system-skill-advisor.js:747`, which `rg` skips as a linked path, is unchanged under ADR-016.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the registry fields, the reader, the advisor copy and the checker output. Evidence 2026-10-26: the consumer `rg` listed 20 files. The compiler, the surface-hint test, the review mode, the metadata gate and its test read `surfaceDetection` or `surface_detection` and are unchanged. The runner reads the new per-kind lists, and the docs that name the symbols are the hub, its feature catalog, playbooks and READMEs. `sk-code-skilled` tests ran 27 of 27 and the compiled-route tests 92 of 94, the same 2 failures as the baseline.
- [x] CHK-FIX-004 [P0] The real-path guard has adversarial cases for a symlink to another repository, a symlink to a `local-*` folder, `..` segments and spaces (`unit: real-path guard`). Evidence 2026-10-26: `unit: real-path guard` covers `vendor/.skilled/tool.py` through a link to another repository, `.skilled/skills/local-example/f.py` through a link to a folder outside the hub, `src/../.skilled/...` and `.skilled/../src/d.py`, and `.skilled/skills/my tool/a b.py` and `other dir/c.py`. It passed.
- [x] CHK-FIX-005 [P1] Matrix axes and fixture rows are listed in `plan.md` section FIX ADDENDUM before completion is claimed. Evidence 2026-10-26: `plan.md` FIX ADDENDUM lists the axes: language family, shebang, surface, git, python3 and scope. The fixtures cover each: F01 and F02 the families, F13 the shebang, F14, F16 and F01 the three surfaces, F10 git absent, F17 python3 absent, and `unit: flags` the `--base` scope.
- [x] CHK-FIX-006 [P1] The fixture tests set `SK_CODE_QUALITY_HUB_ROOT` and `SPECKIT_DIST_AUTO_REBUILD` only inside the test process, and restore them after each case. Evidence 2026-10-26: deviation in the stronger direction: no case sets or restores either variable in this process. Each case hands `SK_CODE_QUALITY_HUB_ROOT` or `SPECKIT_DIST_AUTO_REBUILD` to the child it starts, and an `rg` for assignments or deletes on `process.env` under `scripts/tests/` printed nothing.
- [x] CHK-FIX-007 [P1] Evidence for T035 to T038 is pinned to the branch head commit, not to a moving range. Evidence 2026-10-26: T035 to T038 ran on the working tree that this phase's commit will record, on top of HEAD `a1673881f2`, and no evidence reads a branch range. This run does not commit, so the pin is the commit that carries this file.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The secret fixtures join their fragments at run time, and no literal key reaches the repository. Evidence 2026-10-26: the two AWS key fixtures and the GitHub token fixture are joined from fragments at run time, and an `rg` for the AWS, GitHub and private-key signatures over `scripts/tests/` and the runner printed nothing.
- [x] CHK-031 [P0] Input validation for every path and argv. A file path is resolved and checked against the repository root before any spawn. Evidence 2026-10-26: `namedFiles` resolves every `--files` path and checks it against the root before any spawn. F10 shows `FILE_OUTSIDE_ROOT` for `../outside.py` and `FILE_NOT_FOUND` for a missing file, and every spawn is an argv array with no shell.
- [x] CHK-032 [P1] N/A: the runner has no authentication or authorization surface. It reads files and runs built-in checks only. Evidence 2026-10-26: N/A, as the row states. The runner has no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every REQ id in `spec.md` appears in `acceptance-criteria.md`. `diff <(rg -o 'REQ-0[0-9]{2}' $P/spec.md | sort -u) <(rg -o 'REQ-0[0-9]{2}' $P/acceptance-criteria.md | sort -u)` prints nothing. Evidence 2026-10-26: the `diff` printed nothing.
- [x] CHK-041 [P1] `runner-contract.md` documents every field the verdict prints. T025 prints 8. Evidence 2026-10-26: T025 printed `8`, and section 3 of `runner-contract.md` documents every top-level verdict field, the check row, the finding and the explain schema.
- [x] CHK-042 [P2] `Q/SKILL.md` and `runner-contract.md` both name the exit states. `rg -c 'NOTHING_CHECKED|UNVERIFIED' $Q/SKILL.md $Q/references/runner-contract.md` prints a count of at least 1 for each file. Evidence 2026-10-26: the `rg -c` printed `3` for `Q/SKILL.md` and `3` for `runner-contract.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only. T001 writes its probe there, and T041 removes it. Evidence 2026-10-26: T001 wrote its probe in `scratch/`, and the baseline logs went there too. T041 removes them.
- [x] CHK-051 [P1] `scratch/` cleaned before completion. T041 prints `.gitkeep`. Evidence 2026-10-26: T041 printed `.gitkeep`.
- [x] CHK-052 [P0] No file outside the scope in `spec.md` section 3 changed. `git status --porcelain` lists only the files named there. Evidence 2026-10-26: `spec.md` section 3 was amended after review to name every file `git status` lists for this phase: the regenerated Hermes copies, `leaf-manifest.json`, the served compiler and its authored twin, the activation manifest and its twin, the `sk-code-skilled` patch bump and changelog, the hub `README.md`, the packet `README.md`, the parent `spec.md` and both `graph-metadata.json` files. The remaining entries under `specs/hooks/023-session-relaunch-loop/research/lineages/` belong to another session and were not touched.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

