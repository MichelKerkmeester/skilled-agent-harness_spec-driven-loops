---
title: "Changelog: Phase 19: epic-follow-up-fixes [034-spec-folder-tooling/019-epic-follow-up-fixes]"
description: "Chronological changelog for the Phase 19: epic-follow-up-fixes phase."
trigger_phrases:
  - "spec folder tooling epic follow up fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The follow-ups that the spec-folder tooling epic left are closed. /doctor:env accepts ENV-REFERENCE.md again, because the one duplicated switch row now agrees with its twin on default and type and the parse rules read the two row shapes the file uses. The compat workflow now says how a resume treats a step it still owes, closes its move log on every terminal stop and fails when its layout map prints no JSON. The Gate 3 parity test covers 17 menu copies instead of 12, and three CLI tests build their fixtures in OS temp folders, so a run leaves the real specs/ root as it found it. The leaf manifest generator skips dot-named folders, so a local tool cache cannot change a hub manifest.

### Added

- U08 Gate 3 parity: GATE_3_MENU_FILES lists 17 files, 5 more than before, including create-agent-presentation.txt and create-command-presentation.txt with aligned option C lines (runtime/tests/hooks/gate-3-menu-parity.test.mjs, u08-gate3-parity-final.txt, u08-gate3-parity-planted-drift-agent.txt, u08-gate3-parity-planted-drift-command.txt)
- U10 leaf manifest: the generator skips dot-named directories, and a new scope test pins that a .pytest_cache does not change a manifest while .gitkeep stays a leaf. The sk-code manifest was already clean in git and was not regenerated (generate-leaf-manifest.cjs, generate-leaf-manifest-scopes.test.cjs, u10-leaf-manifest-scope-test.txt, gate-08-leaf-manifests.txt)
- Added: the doctor scripts READMEs and the three sibling doctor-commands playbook READMEs (mcp-code-mode, sk-git, system-deep-loop) validate with 0 issues (u04-validate-*.txt, u04-validate-document-readmes-rerun.txt)
- Added: the three playbook prompt files create-agent-presentation.txt, create-command-presentation.txt and doctor-update-presentation.txt aligned with their YAML and test rules (git diff, u08-gate3-parity-final.txt)
- Gates 2 to 12 run on the working tree at HEAD dd6f9316a3, each with its log and exit code under scratch/evidence/gate-* (see implementation-summary.md, Verification)
- CHK-011 No console errors or warnings introduced: the suite prints one vitest configLoader notice from ../../vitest.config.ts. This closeout did not compare it with HEAD, so the notice is recorded, not claimed as pre-existing (gate-01-cli-suite.txt).

### Changed

- Read scratch/follow-ups.md and the cited line of each follow-up before editing (scratch/follow-ups.md)
- Confirm the git state and record the base for the closeout: HEAD dd6f9316a3, with the gates recorded after the last commit (gate-*.txt headers, git reflog)
- [P] Locate the gate tools named in the closeout: vitest config, hook test glob, comment-hygiene checker, leaf manifest generator (paths in each gate-*.txt CMD: line, except gate-01, whose log has none)
- U01 ENV-REFERENCE: the SYSTEM_SPEC_GATE_DISABLED row at line 209 now agrees with its twin at line 76 on default and type, and doctor-env.yaml accepts legacy label rows, boolean polarity and rejects wrong-cell rows (ENV-REFERENCE.md, commands/doctor/assets/doctor-env.yaml, u01-doctor-env-probe-after.json, u01-env-probe-rerun.txt)
- U02 spec README: the manifest field list includes completedAt (runtime/cli/spec/README.md, source upgrade-legacy.mjs:494)
- U04 index READMEs: the system-spec-kit doctor-commands README and the doctor tests README validate with 0 issues (u04-validate-document-readmes-rerun.txt)

### Fixed

- U03 reference fixes: four references fixed in four READMEs, and ../../vitest.config.ts left unchanged because it resolves from the run directory runtime/cli (u03-markdown-links-after.txt, gate-07-markdown-links.txt)
- U09 CLI test isolation: repair-derived, scaffold-passes-its-own-gate and scaffold-golden-snapshots run in OS temp sandboxes. Teardown removes the tool-tree link with rmSync force before the recursive remove. Two helpers have containment guards (runtime/cli/tests/*.vitest.ts, u09-cli-sandbox-vitest.txt, u09-containment-guard-cases.txt, u09-specs-root-before.txt, u09-specs-root-after.txt)
- Manual verification: the DOC-381 scenario was run by hand on 2026-10-10 on fresh fixtures, and steps 1 to 7 pass as amended (see CHK-021 and scratch/evidence/doc-381-manual-run-rerun.txt). The automated contract tests pin the same rule (see plan.md, section 5)
- CHK-021 Manual testing complete. The DOC-381 scenario was run by hand on 2026-10-10 on fresh fixtures, after the playbook's step 1 was amended to build the fixture runtime. Steps 1 to 7 pass, with exit codes and receipts in scratch/evidence/doc-381-manual-run-rerun.txt. The first run failed at step 6 on an unbuilt fixture and stays as history in scratch/evidence/doc-381-manual-run.txt.
- CHK-FIX-001 Each actionable finding has a finding class. U01 instance-only, U02 instance-only, U03 instance-only, U04 instance-only, U05 cross-consumer, U06 class-of-bug, U07 algorithmic, U08 matrix/evidence, U09 test-isolation, U10 class-of-bug, U11 instance-only.
- CHK-FIX-002 Same-class producer inventory: the env probe read all 177 data rows across every table in ENV-REFERENCE.md (u01-doctor-env-probe-after.json). The reference fixes were checked by reading each README, and the link checker covered the 7945 Markdown files (u03-markdown-links-after.txt). Plain-text paths are not covered by a tool, which is recorded in implementation-summary.md.

### Verification

- Gates 2 to 12 (table above) - PASS. Each exit 0, with the numbers in the table
- CLI suite (gate 1), baseline 1776 passed, 19 skipped, 0 failed - PASS. 1776 passed, 19 skipped, 0 failed, exit 0. The chained legacy and validation stages report 0 failed
- U09 during-run poll on the three edited test files - PASS. New 0, gone 0, diff 0 for each file (u09-during-run-poll.txt)
- U09 sandbox tests (u09-cli-sandbox-vitest.txt) - PASS. 3 files, 33 tests passed (15, 6 and 12)
- U09 specs root before and after the closeout runs - PASS. The same top-level entries (u09-specs-root-before.txt and u09-specs-root-after.txt)
- U01 probe, rerun at closeout - PASS. Status OK, 177 data rows, 0 malformed, 0 conflicts
- U04 document validator on six READMEs - PASS. All VALID, 0 issues
- Planted drift in the two added presentation files - PASS. Each fails the parity test with ERR_ASSERTION on its own file

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | U01: the SYSTEM_SPEC_GATE_DISABLED row at line 209 now agrees with line 76 on default and type |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Modified | U01: parse rules accept legacy label rows, read boolean polarity, and treat a wrong-cell row as malformed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | U02: the manifest field list includes completedAt |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modified | U03: ../../ops/retrofit-convention.mjs replaces the wrong path |
| `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md` | Modified | U03: the legacy .opencode/specs root is named as repo-relative |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md` | Modified | U03: ../../../templates/ replaces ../../templates/ |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/README.md` | Modified | U03: the diagram names spec-gate-core.mjs in place of a wrong path |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modified | U04: the index README carries the sections its type requires |
| `.skilled/commands/doctor/scripts/tests/README.md` | Modified | U04: the index README carries the sections its type requires |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Added item: validates with 0 issues |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md` | Modified | Added item: sibling playbook README validates with 0 issues |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md` | Modified | Added item: sibling playbook README validates with 0 issues |

### Follow-Ups

- U11 is closed. The 018 push receipt is committed in 9bd0eecc44, so AC-011 is Met. The first strict run after that flip failed on AC_CLOSURE for AC-014 only, which is the validation result itself. AC-014 was marked Met after that run, and both folders printed RESULT: PASSED once the derived graph metadata was re-derived. The packet docs are committed in 079e9c34d2. Later edits and some scratch/evidence/ files are not committed yet, as How It Was Delivered says.
- The nested changelog step was not done at closeout, and it is now resolved. Spec.md asks for a refresh of a file in ../changelog/. The 034 parent had no changelog/ folder when this phase closed, and the writer would have created one in the parent, outside this packet's edit list. The operator later asked for one. The folder now exists at specs/system-speckit/034-spec-folder-tooling/changelog/, and this phase's entry is in it, generated from these docs.
- The DOC-381 manual scenario was run by hand on 2026-10-10 on fresh fixtures, and steps 1 to 7 pass. The first run failed at step 6 because its fixture runtime was not built, so the copy's dist freshness check read the packet as unreadable. Step 1 now builds the fixture runtime. The compat phases were played by hand, not run as the slash command, so the status lines are rendered from the phase text. Two checkout runtime/cli freshness records were also rewritten at 09:45:24 local during the run. No scenario command reproduced that write, and its writer is unknown (evidence file, section 7). The receipts are in scratch/evidence/doc-381-manual-run-rerun.txt, and the failed run stays in scratch/evidence/doc-381-manual-run.txt. The automated contract tests pin the same resume rule.
- The hooks diagram label is a bare file name. spec-gate-core.mjs names the file but is not a path from runtime/tests/hooks/. The full relative path is ../../hooks/lib/spec-gate/spec-gate-core.mjs. The link checker does not read diagram labels, so the change is accepted as a label. A later edit can use the full path.
- Resolved by phase 020: the three stress-test category READMEs now pass the document validator. They are command-flow-stress-tests under deep-review and deep-research, and agent-discipline-stress-tests under deep-improvement. Each had 3 missing sections before (u04-stress-test-readme-validate-context.txt). Phase 020 added the missing sections in its working-tree edits, which are not committed yet and ship with phase 020. On 2026-10-10, validate_document.py on each file printed Total issues: 0 and exited 0.
- The 034 parent handoff row for 018 to 019 had placeholder text at closeout, and it is now filled in. The row read [Criteria TBD] when this phase closed. It was not edited then, because only the 019 phase row was in scope. The row now names 018's acceptance rows and evidence, see the Phase Handoff Criteria table in specs/system-speckit/034-spec-folder-tooling/spec.md.
