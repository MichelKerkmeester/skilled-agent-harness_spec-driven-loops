---
title: "Acceptance Criteria: Phase 19: epic-follow-up-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "epic follow up fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes"
    last_updated_at: "2026-10-09T19:59:32Z"
    last_updated_by: "closeout"
    recent_action: "Recorded evidence for each criterion and the gate results"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 19: epic-follow-up-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given ENV-REFERENCE.md and doctor-env.yaml, When the `/doctor:env` parse rules run over ENV-REFERENCE.md, Then no conflicting duplicate and no malformed row remain | `scratch/evidence/u01-env-probe-rerun.txt` and `u01-doctor-env-probe-after.json`: status OK, 177 data rows, `malformed` empty, `conflicts` empty. ENV-REFERENCE.md lines 76 and 209 now agree on the default and type of `SYSTEM_SPEC_GATE_DISABLED`, and each keeps its own description. The parse rules are in `commands/doctor/assets/doctor-env.yaml` | Met | - |
| AC-002 | REQ-006 | Given the spec README's manifest field list, When it is compared with `upgrade-legacy.mjs`, Then `completedAt` is listed | `runtime/cli/spec/README.md` lists `completedAt` after `beforeImages`. The writer is `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:494` (`context.manifest.completedAt = new Date().toISOString()`) | Met | - |
| AC-003 | REQ-006 | Given the five references in U03, When each path is resolved from its own file, Then each broken one is fixed and the run-directory one is left as it is | Four edits: `retrieval/lib/README.md` now `../../ops/retrofit-convention.mjs`, `test-fixtures/README.md` now `../../../templates/`, `sweep/README.md` names the legacy `.opencode/specs` root as repo-relative, and `tests/hooks/README.md` names `spec-gate-core.mjs`. `../../vitest.config.ts` in `retrieval/lib/README.md` is unchanged because the CLI runs from `runtime/cli`, the same base `package.json` uses. Link check `u03-markdown-links-after.txt`: 0 broken of 14105. Caveat: the hooks diagram label is a bare file name, which is not a path from its directory. The full relative path is `../../hooks/lib/spec-gate/spec-gate-core.mjs`, and the link checker does not read diagram labels | Met | - |
| AC-004 | REQ-006 | Given the two index READMEs and the three sibling doctor-commands playbook READMEs, When each runs through `validate_document.py`, Then each validates with 0 issues | `u04-validate-document-readmes-rerun.txt`: six files VALID, `Total issues: 0`, exit 0 on each. The three deep-loop stress-test category READMEs were not in this row. Before phase 020 they failed with 3 missing sections each (`u04-stress-test-readme-validate-context.txt`), and phase 020 has since brought them to `Total issues: 0` (implementation-summary.md, Known Limitations item 5) | Met | - |
| AC-005 | REQ-003 | Given an owed `link-legacy-path` step from an interrupted run, When the resume runs its dirty-roots check, Then the owed step runs without the refusal, and only the exact porcelain lines for a deleted specs link are dropped | `dirty_refusal` in `doctor-update-compat-action.yaml` under `phase_2_layout_preview` and `phase_4_move` states the rule and the filter (` D specs` unstaged, `D  specs` staged). DOC-381 expects the resume to proceed. The contract tests "an owed recovery step runs without the dirty-roots refusal" and "the owed-step exemption covers only the recovery link step" pass in `u05-u07-doctor-tests.txt` and the doctor suite `gate-02-doctor-run-all.txt` (7 suites passed, 0 failed) | Met | - |
| AC-006 | REQ-003 | Given any terminal stop after run-started, When the run ends, Then `run-complete` is appended, except after a `step-failed` line in phase_4_move | `close_rule` in the compat YAML, plus the phase 5 to 8 and post-check edits in the YAML diff. Tests "every terminal stop after run-started closes its move log run", "a failed post-check closes its open run before it stops" and "the compat upgrade opens its run when the move logged no line" pass in `u05-u07-doctor-tests.txt` | Met | - |
| AC-007 | REQ-003 | Given a layout map that exits with any code and prints no parseable JSON, When phase 2 reads it, Then the step stops with `STATUS=FAILED` | Tests "a layout map without parseable JSON on stdout fails whatever its exit code" and "a layout map that cannot load its script exits 1 with empty stdout" pass in `u05-u07-doctor-tests.txt`. The rule is `exit_policy` in the compat YAML | Met | - |
| AC-008 | REQ-004 | Given the Gate 3 parity list of 17 files, When any one option C copy drifts from `GATE_3_CHOICE_RELATED`, Then the test fails | `u08-gate3-parity-final.txt`: 17 pass, 0 fail. Planted drift in `create-agent-presentation.txt` (`u08-gate3-parity-planted-drift-agent.txt`) and in `create-command-presentation.txt` (`u08-gate3-parity-planted-drift-command.txt`) each fails with `ERR_ASSERTION` on that file. Gate 3 hook glob at closeout: `gate-03-hooks-node-test.txt`, 186 pass, 0 fail, 3 skipped | Met | - |
| AC-009 | REQ-002 | Given a CLI test run, When it finishes, Then no fixture is left under the real `specs/` root and the three tests build their fixtures in OS temp sandboxes | `u09-specs-root-before.txt` and `u09-specs-root-after.txt` list the same top-level entries, with no `.repair-fixture-*` or `001-scaffold-gate-phase-probe`. The before and after snapshots are from the closeout runs. The during-run poll of the three edited files is in `u09-during-run-poll.txt`. Sandbox tests: `u09-cli-sandbox-vitest.txt`, 3 files and 33 tests passing. Containment cases: `u09-containment-guard-cases.txt` | Met | - |
| AC-010 | REQ-005 | Given the sk-code leaf manifest, When the generator runs with `--check`, Then it passes, and dot-named directories cannot change a manifest | `gate-08-leaf-manifests.txt`: sk-code reports `leaf-manifest.json OK`, and all 14 hub manifests exit 0. The sk-code manifest is unchanged in git. The skip is pinned by `u10-leaf-manifest-scope-test.txt` (test "dot-named directory does not change manifest"), since no `.pytest_cache` exists under sk-code in the live tree | Met | - |
| AC-011 | REQ-006 | Given the 018 push receipt, When the packet closes, Then it is committed with the 018 evidence | Committed in 9bd0eecc44 (`docs(specs): record the epic docs alignment push`). `git ls-files` lists `specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/scratch/evidence/push.txt` at that commit | Met | - |
| AC-012 | REQ-006 | Given the full CLI suite with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, When it finishes, Then passed is at least 1776 and failed is 0 | `scratch/evidence/gate-01-cli-suite.txt` lines 188 and 189: Test Files 171 passed, 3 skipped (174), and Tests 1776 passed, 19 skipped (1795). `gate-01-cli-suite.exit` reads `EXIT=0`. The chained legacy and validation stages report 0 failed (lines 2214, 2222 and 2266). The real `specs/` listing after the run equals the one before it (`u09-specs-root-after-cli-run.txt`) | Met | - |
| AC-013 | REQ-006 | Given the gates named in implementation-summary.md, When each runs at closeout, Then each exits 0 with the stated numbers | Gates 2 to 12 exit 0 (`gate-*.exit`). Gate 6 prints 85 warnings and 0 failures against the baseline of 85. Gate 8 prints 14 of 14. Gate 4 prints 2 of 2 tests. Gate 11 prints no violations (`gate-11-comment-hygiene.txt`), and a seeded violation exits 1 (`gate-11-positive-control.txt`) | Met | - |
| AC-014 | REQ-006 | Given this folder and the 034 parent, When `validate.sh --strict` runs on each, Then each prints `RESULT: PASSED` | `scratch/evidence/validate-019-strict-final.txt` and `scratch/evidence/validate-034-strict-final.txt` both end with `RESULT: PASSED`. Before this row was marked, the same two runs failed only on AC_CLOSURE for AC-014. The earlier run that failed on AC-011 and AC-014 is `scratch/evidence/validate-019-strict.txt` | Met | - |
| AC-015 | SC-002 | Given the push of `079e9c34d2` to `main`, When CI is read for `079e9c34d2` and its bot commit `4669db6522`, Then every check on `079e9c34d2` succeeds, and the bot commit's checks succeed except its Trigger Index Rebuild, which its job guard skips | `scratch/evidence/post-push-ci.txt`: 14 of 14 checks succeeded on `079e9c34d2`, 11 succeeded on `4669db6522`, and its Trigger Index Rebuild was skipped by the guard at `.github/workflows/trigger-index-rebuild.yml` line 26. The query was `gh run list --branch main --limit 40` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes, under the closure rule above. Every criterion is Met: AC-011 is committed in `9bd0eecc44`, and AC-014 is Met on the strict runs of this folder and the 034 parent, and AC-015 is Met on the post-push CI receipt for SC-002. The DOC-381 manual run (CHK-021) passed by hand on 2026-10-10 on fresh fixtures, steps 1 to 7, and CHK-021 is ticked in tasks.md. Its receipts are in `scratch/evidence/doc-381-manual-run-rerun.txt`.

AC-001 to AC-010, AC-012 and AC-013 carried the packet on gate output and on the test and file evidence named in each row. The three stress-test category READMEs were outside AC-004 at closeout, and phase 020 has since brought them to `Total issues: 0`. The DOC-381 manual run is no longer left out, see CHK-021.
<!-- /ANCHOR:closure -->
