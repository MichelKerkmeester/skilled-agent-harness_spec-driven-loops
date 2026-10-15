---
title: "Acceptance Criteria: Phase 5: setup-check-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "setup check hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/005-setup-check-hardening"
    last_updated_at: "2026-10-15T15:37:23Z"
    last_updated_by: "scaffold"
    recent_action: "Planned 25 acceptance criteria, one per requirement"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: setup-check-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/033-git-setup-customization/005-setup-check-hardening
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture whose `hook-flags.env` sets `SYSTEM_HOOKS_DISABLED=1` and an environment without it, When the battery runs, Then the suppression row is FAIL, lists the value with the file as its source and names the file line in its repair | The T005 test, plus its mutation check. Observed: "a master switch saved in hook-flags.env fails suppression and names its line" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:505`) passes, and the old `checkSuppression` restored made 3 tests fail | Met | - |
| AC-002 | REQ-001 | Given the same file and `SYSTEM_HOOKS_DISABLED=` set empty in the environment, When the battery runs, Then the suppression row is PASS, because the environment wins as `hook-flags.cjs:160-163` does | The T005 empty-override test. Observed: the same test sets `SYSTEM_HOOKS_DISABLED` to an empty string and asserts PASS (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:517`) | Met | - |
| AC-003 | REQ-002 | Given a `.codex/hooks.json` that names the advisory only under `SessionStart`, When the battery runs with `--tool codex`, Then the ai-tool-hooks row is FAIL, and the same holds for a wrong event or a non-matching matcher under Claude, Devin and Cursor | The T006 negative tests, plus its mutation check. Observed: "ai-tool-hooks accepts each runtime's real wiring and refuses a wrong event or matcher" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:836`) fails each runtime under a wrong event and a wrong matcher. The old substring match failed it at the wrong event, and a matcher check forced true failed it at the Claude matcher case | Met | - |
| AC-004 | REQ-002 | Given copies of this checkout's four real adapter configs, When the battery runs with each tool, Then each is reported registered, and the hooks README section 3 rows show the same matchers | The T006 real-shape tests and the T007 diff. Observed: the same test passes copies of this checkout's Claude, Codex, Devin and Cursor configs (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:836`), and `.skilled/skills/sk-git/scripts/hooks/README.md:77-78` show matcher `Bash` and matcher `exec\|Bash` | Met | - |
| AC-005 | REQ-003 | Given each of the six status-matrix rows from `plan.md`, When the battery runs in human and JSON mode, Then the STATUS line, the JSON `status` and the exit code are OK with 0, DEGRADED with 3 or FAIL with 1 as the matrix says, and a usage error still exits 2 | The T004 matrix tests. Observed: "the status fold maps rows to OK 0, DEGRADED 3 and FAIL 1 in both modes" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:241`) runs six cases in human and JSON mode, and the non-repository test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:271`) still exits 2 | Met | - |
| AC-006 | REQ-003 | Given the docs that state the exit codes, When they are searched for `STATUS=` and exit codes, Then each shows 0, 1, 2 and 3 and the three STATUS lines | `rg` over the consumer list in `plan.md` after T026 to T029. Observed: `doctor-git-setup.yaml`, `doctor-git-presentation.txt:256`, DOC-384 lines 26 to 30, the playbook line 947, the catalog leaf line 29 and `README.md:1505` each state 0, 3, 1 and 2, and the presentation and README show the three STATUS lines | Met | - |
| AC-007 | REQ-004 | Given a gate helper that prints a report without `gates`, one that exits nonzero and a parent `GATE_REGISTRY` pointing at a stub, When the battery runs, Then the gates row is UNKNOWN with no repair for the first two and the stub is never read | The T008 tests. Observed: "gates reports UNKNOWN with no repair when the helper fails or its report has no gates" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:933`) and "gates ignores a GATE_REGISTRY inherited from the environment" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:980`), each failed by its mutation | Met | - |
| AC-008 | REQ-004 | Given a gate saved off in the fixture's local config, When the battery runs, Then the gates row is DEGRADED with `/doctor:git hooks` as its repair and the run exits 3 | The T008 saved-off test. Observed: "a gate saved off degrades the run to exit 3 with the hooks repair" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:960`), and its round trip (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:1078`) turns the row PASS | Met | - |
| AC-009 | REQ-005 | Given no `--tool`, no `CLAUDECODE` and no adapter files, When the battery runs, Then the ai-tool-hooks row is UNKNOWN with a detail naming `--tool` | The T009 tool-less test. Observed: "a run with no active tool and nothing broken is UNKNOWN and names --tool" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:889`) | Met | - |
| AC-010 | REQ-005 | Given an OpenCode plugin file or a Pi extension file without its event hook and shared-module import, When the battery runs, Then that adapter fails the row | The T009 content tests. Observed: "opencode and pi pass only when the adapter registers its event and imports git-rule-checks.mjs" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:901`) | Met | - |
| AC-011 | REQ-006 | Given an existing unwritable worktree base, a file at the base path and a base set by `SPECKIT_WORKTREE_BASE`, When the battery runs, Then the first two fail and the repair for the third names the environment variable | The T010 tests. Observed: "worktrees fails an unwritable base and a file at the base, and names the variable that set it" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:778`), failed by the old `checkWorktrees` | Met | - |
| AC-012 | REQ-007 | Given a hooks FAIL in a fixture that shares the battery root's git common dir, When the battery prints its repair, Then the repair is this checkout's installer by absolute path. Given a hooks FAIL in any other repository, including one with the toolchain sentinel, Then the repair is `git config core.hooksPath` pointed at this checkout's hooks folder. No case names the inspected repository's installer | The T013 tests, and both T014 hooks round trips turning the row PASS. Observed: tests at `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:598`, `:633` and `:668`. A sentinel clone still gets `core.hooksPath`, and the old repair failed the first two | Met | - |
| AC-013 | REQ-008 | Given an install root missing `hard-rules.json`, When the battery runs, Then the install repair restores exactly that path and does not name `/doctor:update` or a whole-subtree restore | The T011 test. Observed: "install restores exactly the missing path of a git install root, and the restore turns the row PASS" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:710`), failed by the old `INSTALL_REPAIR` | Met | - |
| AC-014 | REQ-009 | Given `skgit.contractDir` set at local scope to a missing directory, When the battery runs, Then the standards repair is the local-scope unset or creating the directory, and a malformed block still names `/doctor:git standards` | The T012 tests. Observed: tests at `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:381`, `:399` and `:408`. The local and global scopes each get their own unset, and the malformed block keeps `/doctor:git standards` | Met | - |
| AC-015 | REQ-010 | Given each repair line the battery can print, When the repair is applied to its failing fixture and the battery reruns, Then the row is PASS | The T014 round-trip tests, one per repair. Observed: install `:710`, hooks `:633` and `:668`, standards `:381`, and the six "round trip:" tests from `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:1078` to `:1220`, each applying the printed repair through `bash -c` and asserting PASS | Met | - |
| AC-016 | REQ-011 | Given the pushed commit, When Gate Inputs runs, Then the hook test scripts pass with no `ERR_MODULE_NOT_FOUND` | `gh run view` on the Gate Inputs run (T035). Not observed: no push was authorized. Local proxy only: `check-gate-inputs.sh` RESULT: PASSED and its suite 50 passed, 0 failed | Unmet | - |
| AC-017 | REQ-012 | Given the regenerated manifest, When `test_readme_manifest.py` runs, Then it exits 0, and the manifest diff adds only the sk-code doctor playbook directory | T024 diff and the T033 rerun. Observed: the diff adds only `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands` and moves `derived_count` from 777 to 778, and `test_readme_manifest.py` exits 0 with `reproduced=True` | Met | - |
| AC-018 | REQ-013 | Given the corrected leaf title, When `validate_catalog_package.py` runs, Then every package passes and the command exits 0 | The T033 rerun. Observed: `validate_catalog_package.py` exits 0 with 0 violations, and its fixture tests report ALL PASS | Met | - |
| AC-019 | REQ-014 | Given the setup target, When the setup dashboard renders, Then it shows `Mutation class: read-only`, and the setup result block shows a DEGRADED close | The T027 diff. Observed: `doctor-git-presentation.txt:89` reads the mutation class from `_routes.yaml`, read-only for setup, and the setup result block carries a DEGRADED value, a `Degraded:` count and `STATUS=[OK|DEGRADED|FAIL]` | Met | - |
| AC-020 | REQ-015 | Given DOC-384's precondition as written, When an operator meets only that precondition and runs the scenario, Then the expected signals hold | The T028 diff and the T034 real-runtime run. The diff is observed: DOC-384 lines 26, 28 and 30 state the precondition and the exits. The real-runtime DOC-384 run 2026-10-15 by the orchestrator in Claude Code through `/doctor:git setup`: eleven PASS rows with a source each, result block `Target: setup`, `Changed: none`, `STATUS=OK`; battery `--tool=claude` exit 0 `STATUS=OK checks=11`, `--json` 11 rows with all five keys, `--tool nope` exit 2 with the usage line, and `git config --list --local` and `git status --porcelain` identical before and after | Met | - |
| AC-021 | REQ-016 | Given a FIFO at an adapter config path, When the battery runs under a timeout, Then it finishes and reports the path as unreadable | The T017 test. Observed: "a FIFO at an adapter config path is reported, not read, and the run finishes" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:1057`). With plain reads restored the run was killed by its 20 s timeout | Met | - |
| AC-022 | REQ-017 | Given `GIT_DIR` exported to a second repository, When the battery runs with `--repo` set to the first, Then every row reports on the first | The T015 test. Observed: "an exported GIT_DIR cannot point the probes at another repository" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:986`), failed by the old `safeGitEnv` | Met | - |
| AC-023 | REQ-018 | Given `.`, an empty entry and a trailing `:` in `PATH` and a planted `./git` that writes a marker, When the battery runs, Then the marker is never written | The T016 test. Observed: `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:997` covers `.`, an empty entry and a trailing `:`, failed by bare binary names and by removing `narrowPath()` | Met | - |
| AC-024 | REQ-019 | Given an allowlist file that is a symlink to a file outside the repository, When the battery runs, Then the report refuses it and contains none of the target's lines | The T018 test. Observed: "a symlinked allowlist is refused and none of its target lines are shown" (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:542`) | Met | - |
| AC-025 | REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-025 | Given the strengthened suite and the re-cited evidence, When each test's guarded behavior is broken on purpose, Then that test fails, and every completed task in 002 and 034 cites a command a reviewer can rerun | Mutation checks for T019 to T022, and the T030 diff. Observed: a write into the own doctor tree and a write into the temp dir each failed the no-write test (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:289`), importing from the inspected repository failed the planted-helper test (`:329`), swapping the allowlist roots failed `:559` and printing repairs for FAIL only failed `:211`. The 002 and 034 tasks now cite rerunnable commands, and the 034 commands were rerun with matching hashes | Met | - |

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

**Closeable:** No

Twenty-four of the twenty-five criteria are Met, with the battery suite, the mutation checks and the doc diffs as evidence. One stays Unmet. AC-016 needs a push and a read of the Gate Inputs run. AC-020 was closed by the orchestrator's real-runtime DOC-384 run.
<!-- /ANCHOR:closure -->
