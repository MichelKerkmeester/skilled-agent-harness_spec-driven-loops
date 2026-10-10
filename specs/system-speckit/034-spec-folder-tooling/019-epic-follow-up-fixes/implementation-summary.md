---
title: "Implementation Summary"
description: "The eleven follow-ups from the spec-folder tooling epic are closed: the env reference, the compat workflow contract, Gate 3 parity coverage, CLI test isolation and the leaf manifest generator."
trigger_phrases:
  - "epic follow up fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes"
    last_updated_at: "2026-10-10T07:52:00Z"
    last_updated_by: "doc-381-rerun"
    recent_action: "DOC-381 rerun on fresh fixtures passed, CHK-021 ticked"
    next_safe_action: "No DOC-381 step is owed, the operator decides the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "closeout-019-epic-follow-up-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-epic-follow-up-fixes |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
| **Status** | Complete |
| **Base HEAD** | `dd6f9316a3`. The changes below are committed in `242e896c11`, `ce3d7d0b29`, `c5afce1a98`, `7ba9345bd8` and `269f87a3a2`, and the 018 push receipt in `9bd0eecc44` |
| **Pinned diff** | `git diff HEAD -- .skilled` over 26 files, SHA-256 `e945b0d176e31c1da99a6fa9f27ab164d97f92a283d94ee652a498c5e1d8b39f`, taken before the commits in Base HEAD |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The follow-ups that the spec-folder tooling epic left are closed. `/doctor:env` accepts `ENV-REFERENCE.md` again, because the one duplicated switch row now agrees with its twin on default and type and the parse rules read the two row shapes the file uses. The compat workflow now says how a resume treats a step it still owes, closes its move log on every terminal stop and fails when its layout map prints no JSON. The Gate 3 parity test covers 17 menu copies instead of 12, and three CLI tests build their fixtures in OS temp folders, so a run leaves the real `specs/` root as it found it. The leaf manifest generator skips dot-named folders, so a local tool cache cannot change a hub manifest.

### Phase 19: epic-follow-up-fixes

Each item is a small change to the file that owns the behavior, with a test or a gate that pins it. The doc items (U01 to U04) correct a duplicate row, a missing manifest field, four wrong references and the README sections that the validator requires. The compat items (U05 to U07) change the workflow contract and its DOC-381 scenario. The test items (U08 to U10) widen the parity list, move fixtures out of `specs/` and stop a dot-named cache from becoming a leaf. U11 is the one item this closeout left to the orchestrator, which committed the 018 push receipt in `9bd0eecc44`.

What the operator gains: a resume that works after an interrupted move, a move log that reads as finished after any stop, a Gate 3 check that catches drift in three more menu copies, and a test run that no longer creates folders in the real `specs/` tree.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | U01: the `SYSTEM_SPEC_GATE_DISABLED` row at line 209 now agrees with line 76 on default and type |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Modified | U01: parse rules accept legacy label rows, read boolean polarity, and treat a wrong-cell row as malformed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | U02: the manifest field list includes `completedAt` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modified | U03: `../../ops/retrofit-convention.mjs` replaces the wrong path |
| `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md` | Modified | U03: the legacy `.opencode/specs` root is named as repo-relative |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md` | Modified | U03: `../../../templates/` replaces `../../templates/` |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/README.md` | Modified | U03: the diagram names `spec-gate-core.mjs` in place of a wrong path |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modified | U04: the index README carries the sections its type requires |
| `.skilled/commands/doctor/scripts/tests/README.md` | Modified | U04: the index README carries the sections its type requires |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Added item: validates with 0 issues |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md` | Modified | Added item: sibling playbook README validates with 0 issues |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md` | Modified | Added item: sibling playbook README validates with 0 issues |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/README.md` | Modified | Added item: sibling playbook README validates with 0 issues |
| `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` | Modified | U05 to U07: owed-step exemption, `close_rule`, run-started on a no-move run, layout map JSON rule |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modified | U06: the interrupted-run wording now keys on a run with no run-complete line |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md` | Modified | U05, U06: DOC-381 expects the resume to proceed with no refusal, and the log expectations match the YAML |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Modified | U05 to U07: contract assertions for each rule |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs` | Modified | U05 to U07: the integration scenario expects the owed step to run |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | Modified | U08: `GATE_3_MENU_FILES` lists 17 files |
| `.skilled/commands/create/assets/create-agent-presentation.txt` | Modified | U08: option C aligned with `GATE_3_CHOICE_RELATED` |
| `.skilled/commands/create/assets/create-command-presentation.txt` | Modified | U08: option C aligned with `GATE_3_CHOICE_RELATED` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts` | Modified | U09: fixtures in an OS temp root, guarded teardown |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modified | U09: fixtures in an OS temp root, containment guard, guarded teardown |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modified | U09: fixtures in an OS temp root, guarded teardown |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modified | U10: dot-named directories are not walked |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs` | Modified | U10: a dot-named cache does not change a manifest |
| `specs/system-speckit/034-spec-folder-tooling/spec.md` | Modified (019 row only) | Phase table row 19 names the phase and sets Complete |
| `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/` | Modified and added | Spec, plan, tasks, acceptance criteria, this summary and `scratch/evidence/` |

Phase 020 (`020-deep-review-remediation`) edited three of the files above while it closed CHK-021. Those edits are not in `079e9c34d2`, and they ship with phase 020, not with this phase. They are the phase 7 wording in `exit_policy` and `on_failure.still_failing` in `doctor-update-compat-action.yaml`, the phase 7 test pin in `doctor-update-compat.test.cjs`, and four DOC-381 changes in `doctor-update-compat.md`: the step 1 `npm run build` bullet, the step 8 `.marker` cleanup, the build line in Evidence and the stale-build row in Failure Triage.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in lanes that edited disjoint files, and the closeout then re-ran the gates against the working tree at HEAD `dd6f9316a3`. Every gate ran after the last commit on that branch. Each gate wrote its log and exit code to `scratch/evidence/`.

| Gate | Command (short form) | Exit | Key result | Evidence |
|------|----------------------|------|------------|----------|
| 1 | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` with the 3600000 ms timeout | 0 | 1776 passed, 19 skipped, 0 failed (baseline 1776 / 19 / 0). 171 files passed, 3 skipped | `gate-01-cli-suite.txt`, `gate-01-cli-suite.exit` |
| 2 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 0 | 7 suites passed, 0 failed | `gate-02-doctor-run-all.txt` |
| 3 | `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/*.test.mjs` | 0 | 186 pass, 0 fail, 3 skipped | `gate-03-hooks-node-test.txt` |
| 4 | vitest on `tests/workflow-invariance.vitest.ts` (vocabulary test) | 0 | 2 of 2 tests passed | `gate-04-workflow-invariance.txt` |
| 5a | playbook validator, `system-spec-kit` | 0 | 99 scenarios, 0 violations, 1 warning | `gate-05a-playbook-system-spec-kit.txt` |
| 5b | playbook validator, `sk-git` | 0 | 45 scenarios, 0 violations | `gate-05b-playbook-sk-git.txt` |
| 5c | playbook validator, `system-deep-loop` | 0 | 24 scenarios, 0 violations | `gate-05c-playbook-system-deep-loop.txt` |
| 5d | playbook validator, `mcp-code-mode` | 0 | 32 scenarios, 0 violations, 2 warnings (SKIP tier for this package) | `gate-05d-playbook-mcp-code-mode.txt` |
| 6 | `validate_catalog_package.py --package system-spec-kit` | 0 | 85 warnings, 0 failures, baseline 85 | `gate-06-feature-catalog.txt` |
| 7 | `check-markdown-links.cjs` | 0 | 7945 files, 14105 links, 0 broken | `gate-07-markdown-links.txt` |
| 8 | `generate-leaf-manifest.cjs --check` on 14 hub directories | 0 | 14 of 14 OK, sk-code included | `gate-08-leaf-manifests.txt` |
| 9 | `generate-leaf-manifest-scopes.test.cjs` | 0 | scope contract coverage passed | `gate-09-leaf-manifest-scopes-test.txt` |
| 10 | `sync-skills-hermes.cjs --check` | 0 | 70 Hermes skill copies in sync | `gate-10-hermes-sync-check.txt` |
| 11 | `check-comment-hygiene.sh` (python3) on the 8 modified code files | 0 | no violations. A seeded violation exits 1 | `gate-11-comment-hygiene.txt`, `gate-11-positive-control.txt` |
| 12 | `git diff --check` and `git diff --cached --check` | 0 and 0 | no whitespace errors | `gate-12-git-diff-check.txt` |

Two more checks ran at closeout. The U01 probe was rerun against the live ENV-REFERENCE.md (`u01-env-probe-rerun.txt`, status OK, exit 0). The document validator was rerun on the six READMEs in U04 (`u04-validate-document-readmes-rerun.txt`, all VALID).

The 018 push receipt (U11) is committed in `9bd0eecc44`, so it is not in the list above. The code changes in the Files Changed table are committed as listed in Metadata. The packet docs are committed in `079e9c34d2` (`docs(specs): close the epic follow-up fixes`). Later doc edits, and the `scratch/evidence/` files that commit does not hold, are not committed yet.

Two gate-plan items differed from the plan as written. Gate 11 names `python3` on a file with a `.sh` name, and that file has a python3 shebang, so the run used `python3`. Gate 4 ran through `npx vitest` from the CLI directory, because the package's own config path is relative to it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| U05: an owed recovery step is not a planned move for the dirty-roots check | The step is the only thing left to finish an interrupted move, and the refusal would stop the resume that the owed step exists for. The exemption covers only the `link-legacy-path` step, so every other planned step still gets the check. The filter drops only the porcelain line for the deleted specs link (` D specs` or `D  specs`), and every other dirty line still refuses. |
| U06: run-complete closes every terminal stop, except a failed step in phase_4_move | Recovery reads an open run as interrupted. A declined upgrade or a failed post-check would otherwise look interrupted to the next run. A step-failed line leaves its run open on purpose, because writing run-complete there would drop the owed symlink from recovery. A no-move run opens with run-started before upgrade-started, so its log has a start line. Phase 8 writes run-complete only when the run logged a line, so a run with no line leaves no trace. |
| U07: a layout map must print parseable JSON on stdout, whatever its exit code | Exit 1 also comes from a script that fails to load. Its stdout is then empty, and the old rule read that as collisions. The JSON rule makes the failure visible. |
| U03: `../../vitest.config.ts` in `retrieval/lib/README.md` stays unchanged | The CLI runs from `runtime/cli`, and `package.json` uses the same base. The reference resolves from the run directory, not from the README. |
| U03: the hooks diagram names `spec-gate-core.mjs` | The diagram box is a label, not a link, and the old path did not resolve from the README's directory. The bare name is accurate, but it is not a relative path (see Known Limitations). |
| U08: the parity list covers 17 files | The three 018 copies were aligned but not covered by the test. The two presentation files had drifted option C lines that the test did not check. The planted-drift runs show that each of the two presentation files now fails when it drifts. |
| U09: fixtures move to OS temp sandboxes, and teardown removes the tool-tree link before the recursive remove | The tool locates its repository root from its working directory, so each test runs in a sandbox that links the checked-in tool tree. A recursive remove that walked into the link would delete the real tree, so the link goes first. The helpers that create folders also check containment under `<sandbox>/specs/`. |
| U10: the generator skips dot-named directories, and no manifest is regenerated | The sk-code manifest was clean in git. The stale report came from a local cache that the generator walked, not from the committed manifest. That cache cannot be reproduced now, because no dot cache exists under sk-code. The skip is pinned by a scope test instead, and the `.gitkeep` case stays a leaf. |
| U01: the two rows agree on default and type, and each keeps its own description | The probe found one conflicting duplicate. Making the rows agree was the smallest change that clears the parse rule. |
| Added: the doctor scripts README and three sibling playbook READMEs | They fail the same document validator as the two index READMEs, and they were fixed in the same change. |
| Not done: the phase_5 exit-code ambiguity | The same script loads in phase 2, and `main()` maps a crash to exit 2, so the ambiguity has low impact. Changing it would widen the change without a failing case. |
| Not done at closeout: the nested changelog entry named in spec.md | The 034 parent had no `changelog/` folder when this phase closed, and the writer would have created one there. That folder was outside this packet's edit list, so the step was left for the operator. 018 had not written one either. The operator later asked for the folder, and it now holds generated entries for 010, 017, 018 and 019 (see Known Limitations item 2). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gates 2 to 12 (table above) | PASS. Each exit 0, with the numbers in the table |
| CLI suite (gate 1), baseline 1776 passed, 19 skipped, 0 failed | PASS. 1776 passed, 19 skipped, 0 failed, exit 0. The chained legacy and validation stages report 0 failed |
| U09 during-run poll on the three edited test files | PASS. New 0, gone 0, diff 0 for each file (`u09-during-run-poll.txt`) |
| U09 sandbox tests (`u09-cli-sandbox-vitest.txt`) | PASS. 3 files, 33 tests passed (15, 6 and 12) |
| U09 specs root before and after the closeout runs | PASS. The same top-level entries (`u09-specs-root-before.txt` and `u09-specs-root-after.txt`) |
| U01 probe, rerun at closeout | PASS. Status OK, 177 data rows, 0 malformed, 0 conflicts |
| U04 document validator on six READMEs | PASS. All VALID, 0 issues |
| Planted drift in the two added presentation files | PASS. Each fails the parity test with `ERR_ASSERTION` on its own file |
| `validate.sh --strict` on this folder | PASSED. `scratch/evidence/validate-019-strict-final.txt` ends with `RESULT: PASSED`. The earlier run that failed on AC_CLOSURE is `validate-019-strict.txt`. See Known Limitations item 1 |
| `validate.sh --strict` on the 034 parent | PASSED. `scratch/evidence/validate-034-strict-final.txt` ends with `RESULT: PASSED` |
| DOC-381 manual run (CHK-021) | PASS on fresh fixtures. Steps 1 to 7 pass after the playbook's step 1 was amended to build the fixture runtime. The first run failed at step 6 on an unbuilt fixture and is kept as history in `scratch/evidence/doc-381-manual-run.txt`. Receipts and verdict in `scratch/evidence/doc-381-manual-run-rerun.txt` |
| Post-push CI on main, SC-002 | PASS. Every check on `079e9c34d2` succeeded (14 of 14). The CI bot commit `4669db6522` had 11 checks succeed, and its Trigger Index Rebuild was skipped by its job guard (`scratch/evidence/post-push-ci.txt`) |
| Pinned evidence | Base `dd6f9316a3`, `.skilled` diff SHA-256 `e945b0d1` (see Metadata), taken before the commits listed in Metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **U11 is closed.** The 018 push receipt is committed in `9bd0eecc44`, so AC-011 is Met. The first strict run after that flip failed on AC_CLOSURE for AC-014 only, which is the validation result itself. AC-014 was marked Met after that run, and both folders printed `RESULT: PASSED` once the derived graph metadata was re-derived. The packet docs are committed in `079e9c34d2`. Later edits and some `scratch/evidence/` files are not committed yet, as How It Was Delivered says.
2. **The nested changelog step was not done at closeout, and it is now resolved.** Spec.md asks for a refresh of a file in `../changelog/`. The 034 parent had no `changelog/` folder when this phase closed, and the writer would have created one in the parent, outside this packet's edit list. The operator later asked for one. The folder now exists at `specs/system-speckit/034-spec-folder-tooling/changelog/`, and this phase's entry is in it, generated from these docs.
3. **The DOC-381 manual scenario was run by hand on 2026-10-10 on fresh fixtures, and steps 1 to 7 pass.** The first run failed at step 6 because its fixture runtime was not built, so the copy's dist freshness check read the packet as unreadable. Step 1 now builds the fixture runtime. The compat phases were played by hand, not run as the slash command, so the status lines are rendered from the phase text. Two checkout `runtime/cli` freshness records were also rewritten at 09:45:24 local during the run. No scenario command reproduced that write, and its writer is unknown (evidence file, section 7). The receipts are in `scratch/evidence/doc-381-manual-run-rerun.txt`, and the failed run stays in `scratch/evidence/doc-381-manual-run.txt`. The automated contract tests pin the same resume rule.
4. **The hooks diagram label is a bare file name.** `spec-gate-core.mjs` names the file but is not a path from `runtime/tests/hooks/`. The full relative path is `../../hooks/lib/spec-gate/spec-gate-core.mjs`. The link checker does not read diagram labels, so the change is accepted as a label. A later edit can use the full path.
5. **Resolved by phase 020: the three stress-test category READMEs now pass the document validator.** They are `command-flow-stress-tests` under deep-review and deep-research, and `agent-discipline-stress-tests` under deep-improvement. Each had 3 missing sections before (`u04-stress-test-readme-validate-context.txt`). Phase 020 added the missing sections in its working-tree edits, which are not committed yet and ship with phase 020. On 2026-10-10, `validate_document.py` on each file printed `Total issues: 0` and exited 0.
6. **The 034 parent handoff row for 018 to 019 had placeholder text at closeout, and it is now filled in.** The row read `[Criteria TBD]` when this phase closed. It was not edited then, because only the 019 phase row was in scope. The row now names 018's acceptance rows and evidence, see the Phase Handoff Criteria table in `specs/system-speckit/034-spec-folder-tooling/spec.md`.
7. **Plain-text paths in READMEs are checked by reading, not by a tool.** The link checker covers Markdown links only. The U03 reference fixes were checked by resolving each path from its file.
8. **The sk-code leaf manifest premise is not reproduced in the live tree.** No `.pytest_cache` exists under sk-code now, so the dot-directory skip is pinned by the scope test, not by a live regeneration.
9. **The pinned evidence predates the commits.** The `.skilled` diff hash was taken at HEAD `dd6f9316a3`, before the commits listed in Metadata, so read it against that base HEAD.
<!-- /ANCHOR:limitations -->

---
