---
title: "Changelog: Phase 3: config-and-doctor [015-quality-agnostic-gate/003-config-and-doctor]"
description: "Chronological changelog for the Phase 3: config-and-doctor phase."
trigger_phrases:
  - "quality agnostic gate config and doctor changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

A repository can now commit .sk-code/quality.json to name its own checks, and the quality runner runs them. In a temporary repository with a package.json that holds lint and test scripts, /doctor:sk-code quality planned one check, lint, as not required, wrote the file on --apply, refused a second write with CONFIG_EXISTS and then checked the file clean.

### Added

- [P] Re-check each design citation this phase repeats against the current tree, and record any moved line in P/scratch/citations.md (read only: D/scripts/sk-code-setup-check.cjs, D/_routes.yaml, D/sk-code.md). Verify: rg -n "const LEGS" .skilled/commands/doctor/scripts/sk-code-setup-check.cjs prints 97:const LEGS = [. Evidence 2026-10-26: rg -n "const LEGS" printed 97:const LEGS = [, exit 0. Line 97 is the pre-edit baseline. After T019 added the quality leg, the array starts at line 182 on the final tree. Every citation held except test_skill_advisor.py lines 1120 and 1162, which moved to 1117 and 1159, and the projection.ts, render.ts and skill_advisor.py sites sit inside blocks the bridge deriver generates.
- Create discovery and file reading in Q/scripts/lib/quality-config.cjs: the four sources in order (--config PATH relative to the working directory, file-scoped skcode.qualityConfig from git config --show-scope --get-all, .sk-code/quality.json at the repository root, none), with command-scope values ignored (REQ-001, REQ-002). In the same change, replace the phase 002 rejection of --config in Q/scripts/quality-gate.cjs with a call into this discovery, so the flag sets config.source to cli. Verify: node --check Q/scripts/lib/quality-config.cjs exits 0 with no output, and node Q/scripts/quality-gate.cjs --config /nonexistent/quality.json --no-run || echo "exit=$?" prints CONFIG_PATH_MISSING in its JSON and then exit=3. Evidence 2026-10-26: node --check Q/scripts/lib/quality-config.cjs printed nothing, exit 0, and quality-gate.cjs --config /nonexistent/quality.json --no-run printed a verdict whose errors[0].code is CONFIG_PATH_MISSING, with config.source cli, then exit=3.
- [P] Create Q/scripts/tests/quality-config.test.cjs with one discovery case per source, the CONFIG_PATH_MISSING case, and the F11 case where a git -c value is ignored (REQ-001, REQ-002, REQ-016). Update the phase 002 unit: flags case in Q/scripts/tests/quality-gate.test.cjs, so --config with an existing file no longer exits 3. Verify: node --test --test-name-pattern="unit: flags" Q/scripts/tests/quality-gate.test.cjs prints # fail 0, and node --test --test-name-pattern="discovery|CONFIG_PATH_MISSING" Q/scripts/tests/quality-config.test.cjs prints # fail 0. Evidence 2026-10-26: node --test --test-name-pattern="unit: flags" Q/scripts/tests/quality-gate.test.cjs printed ℹ tests 1, ℹ pass 1 and ℹ fail 0, and the discovery|CONFIG_PATH_MISSING run of quality-config.test.cjs printed ℹ tests 6, ℹ pass 6, ℹ fail 0. This node prints the spec reporter, so # fail 0 reads ℹ fail 0 here. The flags case now runs --config on an existing file and expects exit 0 with config.source cli, and keeps --config with no value as a USAGE case.
- Add the argv spawn with shell: false, the per-check timeout and the process-group kill to Q/scripts/lib/run-check.cjs (REQ-005, REQ-009). In the same change, match each configured check to in-scope files by languages and paths, expand {files} relative to the check's cwd, run a check with no {files} once per cwd group ("." or the nearest "package" folder holding package.json, pyproject.toml, Cargo.toml or go.mod), report NOT_APPLICABLE with no match, and default required to true for P0 and false for P1 and P2, as design section 4.3 states. Verify: rg -n "shell: true" Q/scripts/lib/run-check.cjs prints nothing and exits 1. Evidence 2026-10-26: rg -n "shell: true" Q/scripts/lib/run-check.cjs printed nothing, exit 1. spawnGroup starts each configured run with shell: false as a process-group leader, and the matching, {files} expansion, cwd groups and NOT_APPLICABLE live in quality-gate.cjs, with the required default in quality-config.cjs.
- Wire the content-hash snapshot around each configured spawn in Q/scripts/lib/run-check.cjs: git diff --binary HEAD, the untracked list from git ls-files --others --exclude-standard -z, git hash-object without -w, the empty tree when no commit exists, and GUARD_UNAVAILABLE without git (REQ-006). Verify: rg -n "takeSnapshot|createHash" Q/scripts/lib/run-check.cjs prints line 103, the in-process sha256 hash of one changed file, and line 217, where takeSnapshot() is defined, and rg -n "hash-object" Q/scripts/lib/run-check.cjs prints nothing. Evidence 2026-10-26: rg -n "takeSnapshot|createHash" Q/scripts/lib/run-check.cjs printed lines 103, 217, 250, 256 and 258, exit 0, and rg -n "hash-object" Q/scripts/lib/run-check.cjs printed nothing, exit 1. Deviation: the Verify clause was rewritten to the check actually used, because the hash-object grep it replaced cannot match this tree. The coordinator ruled that this phase reuses the phase 002 snapshot helper, takeSnapshot(), which hashes the paths from git diff --name-only HEAD and git ls-files --others --exclude-standard -z with sha256 in process and records HEAD, falling back to the empty tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904 (line 31). It writes no object, as git hash-object without -w would not. The F08 and no-git cases in configured-checks.test.cjs pass. ADR-013 records the reuse.
- Add generated rows as path-scoped configured checks in Q/scripts/quality-gate.cjs, under the same argv and guard path as checks (REQ-014). Verify: rg -n "generated" Q/scripts/quality-gate.cjs prints at least one line. Evidence 2026-10-26: rg -c "generated" Q/scripts/quality-gate.cjs printed 21. A repository generated row runs through planConfigured and runConfigured, the same argv, guard and gate path as checks.

### Changed

- [P] Confirm the empty-tree object id the mutation snapshot uses in a repository with no commit (read only, no file written). Verify: git hash-object -t tree /dev/null prints 4b825dc642cb6eb9a060e54bf8d69288fbee4904. Evidence 2026-10-26: git hash-object -t tree /dev/null printed 4b825dc642cb6eb9a060e54bf8d69288fbee4904, exit 0.
- Update D/scripts/tests/sk-code-setup-check.test.cjs from eight PASS lines and legs=8 to nine PASS lines and legs=9, at its header comment, the happy-path test and the summary assertion (REQ-011, REQ-020). Verify: node --test D/scripts/tests/sk-code-setup-check.test.cjs prints # fail 0. Evidence 2026-10-26: node --test D/scripts/tests/sk-code-setup-check.test.cjs printed ℹ tests 17, ℹ pass 17, ℹ fail 0. The header, the happy path (nine PASS lines, STATUS=OK legs=9) and the v4-layout case (eight SKIP lines, skipped=8) changed, the legacy-stub case now also expects the quality route failure (failed=2) and two cases cover a failing quality check.
- Extend D/assets/doctor-sk-code-presentation.txt with the argument wording for setup or quality, the quality result table, the quality result templates and the troubleshooting rows for the route (REQ-012). Verify: rg -c "quality" D/assets/doctor-sk-code-presentation.txt prints a count of at least 5. Evidence 2026-10-26: rg -c "quality" D/assets/doctor-sk-code-presentation.txt printed 21. The file now opens with the argument failure table and the startup menu with Valid targets: setup, quality, which route-validate J1 reads for a command with two targets.
- Update D/assets/doctor-sk-code-setup.yaml at lines 49, 50 and 58 from eight legs and legs=8 to nine legs and legs=9, and name the quality leg in the leg list (REQ-011, REQ-020). Verify: rg -n "eight|legs=8" D/assets/doctor-sk-code-setup.yaml prints nothing and exits 1. Evidence 2026-10-26: rg -n "eight|legs=8" D/assets/doctor-sk-code-setup.yaml printed nothing, exit 1. The leg list names the quality leg, and the pre-v4 sentence says every other leg reads SKIP.
- Update D/sk-code.md: the argument hint on line 3, the mode routing lines 31 to 34 (setup stays the default), the execution target table at lines 43 to 45 with a quality row, and the workflow summary at line 61 (REQ-012). Verify: rg -c "quality" D/sk-code.md prints a count of at least 4. Evidence 2026-10-26: rg -c "quality" D/sk-code.md printed 11. The argument hint, the mode routing (setup stays the default), the execution target table and the workflow summary name the quality target.
- Update the DOC-382 row at line 269 and the battery overview at line 48 of .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md from eight legs and legs=8 to nine and legs=9 (REQ-020). Verify: rg -n "legs=8|eight legs" .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md prints nothing and exits 1. Evidence 2026-10-26: rg -n "legs=8|eight legs" on the root playbook printed nothing, exit 1. Line 48 lists nine legs ending with quality, the DOC-382 row expects nine PASS lines, STATUS=OK legs=9 and STATUS=FAIL failed=2 skipped=0 for the kill-switch run and the DOC-383 row expects eight SKIP lines and STATUS=FAIL failed=1 skipped=8. Its version moved from 1.5.8.0 to 1.5.9.0.

### Fixed

- Confirm the phase 001 and phase 002 files this phase extends are present (Q/scripts/quality-gate.cjs, Q/scripts/lib/run-check.cjs, Q/assets/quality-defaults.json, Q/references/runner-contract.md, Q/scripts/tests/fixtures.cjs). Verify: test -f Q/scripts/quality-gate.cjs && echo present && test -f Q/scripts/lib/run-check.cjs && echo present && test -f Q/assets/quality-defaults.json && echo present && test -f Q/references/runner-contract.md && echo present && test -f Q/scripts/tests/fixtures.cjs && echo present prints present five times. Evidence 2026-10-26: the five test -f checks printed present five times, exit 0.
- Record the phase 001 checker flag names for ticket prefixes, extension families and extra patterns in P/scratch/checker-args.md (read only: Q/scripts/check-comment-hygiene.sh). Verify: rg -n '^- --' P/scratch/checker-args.md prints three lines, one per flag. Evidence 2026-10-26: rg -n '^- --' P/scratch/checker-args.md printed lines 5, 6 and 7 (--ticket-prefix, --extension, --extra-pattern), exit 0. The flag names were read from the checker docstring and parse_args. The scratch note was removed at closure under CHK-051, so the three names now live in implementation-summary.md and in the flag list Q/scripts/quality-gate.cjs passes to the checker, which T012 cites.
- Add schema validation and the merge rules of design section 4.2 to Q/scripts/lib/quality-config.cjs: schemaVersion 1, unknown keys and malformed fields into config.errors, CONFIG_INVALID for any repository error, and the ticket-prefix and extra-pattern checks (REQ-003, REQ-004, REQ-013). Verify: node --check Q/scripts/lib/quality-config.cjs exits 0 with no output. Evidence 2026-10-26: node --check Q/scripts/lib/quality-config.cjs printed nothing, exit 0. The module validates every field and collects every fault into config.errors, and the runner turns any fault into CONFIG_INVALID before a check starts.
- [P] Add the validation and merge cases to Q/scripts/tests/quality-config.test.cjs: a duplicate check id, enabled: false on an exact sensor, a ticket prefix with a symbol, an extra pattern over 200 characters, and an empty config file, which is a parse error (REQ-003, REQ-004, REQ-013). Verify: node --test --test-name-pattern="CONFIG_INVALID|merge|ticket|extraPatterns" Q/scripts/tests/quality-config.test.cjs prints # fail 0. Evidence 2026-10-26: node --test --test-name-pattern="CONFIG_INVALID|merge|ticket|extraPatterns" Q/scripts/tests/quality-config.test.cjs printed ℹ tests 7, ℹ pass 7, ℹ fail 0.
- Add suggested_checks reading to Q/scripts/quality-gate.cjs for package.json scripts, pyproject.toml tools, Cargo.toml, go.mod, the workflow files and a Makefile lint target, and exclude test, fix, format, and any script containing --write or --fix (REQ-007). Verify: node --check Q/scripts/quality-gate.cjs exits 0 with no output. Evidence 2026-10-26: node --check Q/scripts/quality-gate.cjs printed nothing, exit 0. Deviation: the manifest readers live in Q/scripts/lib/quality-config.cjs (readSuggestions), because the doctor init fills its template from the same list, which spec section 3 already assigns to that module. quality-gate.cjs calls it and drops ids and argv a configured check already holds.
- Pass the validated commentHygiene values to the checker in Q/scripts/quality-gate.cjs, using only the flag names recorded in T002 (REQ-013). Verify: rg -n "ticketPrefixes|extraPatterns" Q/scripts/quality-gate.cjs prints at least two lines. Evidence 2026-10-26: rg -n "ticketPrefixes|extraPatterns" Q/scripts/quality-gate.cjs printed lines 1154, 1156, 1158, 1163 and 1165, exit 0. The runner passes --ticket-prefix, --extension EXT=FAMILY and --extra-pattern, the names T002 recorded, and the two flag fields sit in the HYGIENE_FLAG_FIELDS table the refusal row reads.

### Verification

- Quality suite node --test - # fail 0 over 60 tests, F06 to F09 and F11 among them
- Setup battery - PASS quality and STATUS=OK legs=9, exit 0, and the tree unchanged
- Init in a temporary repository - STATUS=OK MODE=DRY_RUN, then STATUS=OK MODE=APPLIED, then STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS with exit 1 and the file byte-identical
- Route validator route-validate.sh - Exit 0, and rg -n "target: quality" prints line 244
- Prompt mirror --check commands - PASS: 38 prompts are in sync. for Codex, Pi and Hermes
- Acceptance criteria - AC-001 to AC-021 all Met, each with its command observed. AC-018 closed last, after task T048 wrote the packet changelog
- Packet changelog - node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor --write wrote changelog-015-003-config-and-doctor.md in the parent packet's changelog/ folder, exit 0
- Packet gates - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor --strict --no-recursive printed Summary: Errors: 0 Warnings: 0 and RESULT: PASSED, exit 0. The AC_COVERAGE row prints as an advisory pass, so the run carries no warning

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Create | Discovery, validation, merge, suggestions and the init plan |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Edit | spawnGroup(), the process group spawner for configured checks |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Edit | --config, --help, configured and generated checks, chained guard windows, suggested_checks and the hygiene flags |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` | Create | 16 cases: discovery, CONFIG_PATH_MISSING, F11, CONFIG_INVALID, merge, hygiene values, template and help |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` | Create | 11 cases: F06 to F09, no git, argv, timeout with the group kill, --no-run, package cwd, NOT_APPLICABLE and generated rows |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Edit | The flags case reads a real --config file |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` | Create | The empty config init fills |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Create | Schema, discovery, merge, run rules, suggestions, error codes, trust boundary, doctor and known limits |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Edit | Config and help flags, configured rows and the new codes, version 1.0.1.0 |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Edit | Runner fact, loading row, RESOURCE_MAP entry and reference line for the config, version 1.7.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md, scripts/lib/README.md` | Edit | The config reader, spawnGroup(), the new suites and the chained windows, versions 1.0.3.0 and 1.0.2.0 |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.7.0.0.md` | Create | Quality mode release notes |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Create | status, check and init for /doctor:sk-code quality |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Create | 7 cases: dry run, apply and refusal, outside folder, no command starts, tool states, invalid config and help |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Edit | The quality leg |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | Edit | Nine legs, the v4-layout and legacy-stub counts, two quality cases |
| `.skilled/commands/doctor/scripts/README.markdown, scripts/tests/README.markdown` | Edit | Rows for the new script and suite |
| `.skilled/commands/doctor/_routes.yaml` | Edit | The quality route, mutating: mutates |
| `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` | Create | The five-phase quality workflow |
| `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` | Edit | Nine legs, legs=9 |
| `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` | Edit | Menu, targets, quality tables, plan, prompt and troubleshooting |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Edit | The /doctor:sk-code quality row |
| `.skilled/commands/doctor/sk-code.md` | Edit | Two targets, argument hint and workflow summary |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md, doctor-commands/doctor-sk-code-setup.md, doctor-commands/doctor-sk-code-pre-v4-checkout.md` | Edit | Nine legs, eight skipped legs, the kill-switch quality failure, versions 1.5.9.0, 1.1.2.0 and 1.0.1.0 |
| `.skilled/skills/sk-code/README.md` | Edit | The quality leg and target, the newest changelog row, version 2.2.24.0 |
| `.skilled/skills/sk-code/SKILL.md, description.json, hub-router.json, mode-registry.json` | Edit | Hub version 3.3.0.0 |
| `.skilled/skills/sk-code/changelog/v3.3.0.0.md` | Create | Hub release notes |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerate | Lists the template and the reference |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json and its authored twin` | Regenerate | Refreshed for the new registry version, then copied |
| `.hermes/skills/sk-code/SKILL.md, .hermes/skills/sk-code-quality/SKILL.md, .hermes/skills/system-skill-advisor/SKILL.md` | Regenerate | Hermes copies |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Edit | The two bridge ids |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json, runtime/lib/scorer/projection.ts, runtime/lib/render.ts, runtime/scripts/skill_advisor.py` | Regenerate | By derive-command-bridges.cjs |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts, runtime/tests/python/test_skill_advisor.py, runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Edit | The setup bridge and the typed setup target |
| `.skilled/skills/system-skill-advisor/SKILL.md, changelog/v0.17.1.0.md` | Edit and Create | Version 0.17.1.0 and its release notes |
| `specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor/` | Edit | spec.md, tasks.md, acceptance-criteria.md, decision-record.md (ADR-011 to ADR-015) and this summary |
| `specs/sk-code/015-quality-agnostic-gate/spec.md` | Edit | Phase 3 reads Complete in the phase map, and its continuity names phase 4 next |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-003-config-and-doctor.md` | Create | Packet changelog |

### Follow-Ups

- Windows is unspecified. Configured commands target POSIX, where spawnGroup() kills the whole process group. Windows behavior stays UNKNOWN until an operator decides.
- The snapshot is the phase 2 helper, not the one REQ-006 describes. It hashes the content of each changed and untracked file with sha256 in process, and a file over 2 MB is compared by size and change time. ADR-013 records why.
- The requirement count is 21. REQ-021 is the help flag requirement the coordinator added with ADR-011, and CHK-001 expects 21 rather than the 20 the plan named.
- A bare /doctor:sk-code matches no bridge by slash command. The command still runs setup, and the advisor matches a typed target, as it does for /doctor:git.
- The battery is slower. It took 33 seconds against 23 before the quality leg, most of it the quality suite. The design sets no budget, so the increase is reported and not gated.
- A long file list can pass the argument limit. {files} passes every matching file of a group in one argv, and such a run reads ERROR. The reference names it.
