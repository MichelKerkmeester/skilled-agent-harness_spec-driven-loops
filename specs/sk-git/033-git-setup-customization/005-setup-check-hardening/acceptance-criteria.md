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
**Status:** Draft
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture whose `hook-flags.env` sets `SYSTEM_HOOKS_DISABLED=1` and an environment without it, When the battery runs, Then the suppression row is FAIL, lists the value with the file as its source and names the file line in its repair | The T005 test, plus its mutation check | Unmet | - |
| AC-002 | REQ-001 | Given the same file and `SYSTEM_HOOKS_DISABLED=` set empty in the environment, When the battery runs, Then the suppression row is PASS, because the environment wins as `hook-flags.cjs:160-163` does | The T005 empty-override test | Unmet | - |
| AC-003 | REQ-002 | Given a `.codex/hooks.json` that names the advisory only under `SessionStart`, When the battery runs with `--tool codex`, Then the ai-tool-hooks row is FAIL, and the same holds for a wrong event or a non-matching matcher under Claude, Devin and Cursor | The T006 negative tests, plus its mutation check | Unmet | - |
| AC-004 | REQ-002 | Given copies of this checkout's four real adapter configs, When the battery runs with each tool, Then each is reported registered, and the hooks README section 3 rows show the same matchers | The T006 real-shape tests and the T007 diff | Unmet | - |
| AC-005 | REQ-003 | Given each of the six status-matrix rows from `plan.md`, When the battery runs in human and JSON mode, Then the STATUS line, the JSON `status` and the exit code are OK with 0, DEGRADED with 3 or FAIL with 1 as the matrix says, and a usage error still exits 2 | The T004 matrix tests | Unmet | - |
| AC-006 | REQ-003 | Given the docs that state the exit codes, When they are searched for `STATUS=` and exit codes, Then each shows 0, 1, 2 and 3 and the three STATUS lines | `rg` over the consumer list in `plan.md` after T026 to T029 | Unmet | - |
| AC-007 | REQ-004 | Given a gate helper that prints a report without `gates`, one that exits nonzero and a parent `GATE_REGISTRY` pointing at a stub, When the battery runs, Then the gates row is UNKNOWN with no repair for the first two and the stub is never read | The T008 tests | Unmet | - |
| AC-008 | REQ-004 | Given a gate saved off in the fixture's local config, When the battery runs, Then the gates row is DEGRADED with `/doctor:git hooks` as its repair and the run exits 3 | The T008 saved-off test | Unmet | - |
| AC-009 | REQ-005 | Given no `--tool`, no `CLAUDECODE` and no adapter files, When the battery runs, Then the ai-tool-hooks row is UNKNOWN with a detail naming `--tool` | The T009 tool-less test | Unmet | - |
| AC-010 | REQ-005 | Given an OpenCode plugin file or a Pi extension file without its event hook and shared-module import, When the battery runs, Then that adapter fails the row | The T009 content tests | Unmet | - |
| AC-011 | REQ-006 | Given an existing unwritable worktree base, a file at the base path and a base set by `SPECKIT_WORKTREE_BASE`, When the battery runs, Then the first two fail and the repair for the third names the environment variable | The T010 tests | Unmet | - |
| AC-012 | REQ-007 | Given a hooks FAIL in a fixture that shares the battery root's git common dir, When the battery prints its repair, Then the repair is this checkout's installer by absolute path. Given a hooks FAIL in any other repository, including one with the toolchain sentinel, Then the repair is `git config core.hooksPath` pointed at this checkout's hooks folder. No case names the inspected repository's installer | The T013 tests, and both T014 hooks round trips turning the row PASS | Unmet | - |
| AC-013 | REQ-008 | Given an install root missing `hard-rules.json`, When the battery runs, Then the install repair restores exactly that path and does not name `/doctor:update` or a whole-subtree restore | The T011 test | Unmet | - |
| AC-014 | REQ-009 | Given `skgit.contractDir` set at local scope to a missing directory, When the battery runs, Then the standards repair is the local-scope unset or creating the directory, and a malformed block still names `/doctor:git standards` | The T012 tests | Unmet | - |
| AC-015 | REQ-010 | Given each repair line the battery can print, When the repair is applied to its failing fixture and the battery reruns, Then the row is PASS | The T014 round-trip tests, one per repair | Unmet | - |
| AC-016 | REQ-011 | Given the pushed commit, When Gate Inputs runs, Then the hook test scripts pass with no `ERR_MODULE_NOT_FOUND` | `gh run view` on the Gate Inputs run (T035) | Unmet | - |
| AC-017 | REQ-012 | Given the regenerated manifest, When `test_readme_manifest.py` runs, Then it exits 0, and the manifest diff adds only the sk-code doctor playbook directory | T024 diff and the T033 rerun | Unmet | - |
| AC-018 | REQ-013 | Given the corrected leaf title, When `validate_catalog_package.py` runs, Then every package passes and the command exits 0 | The T033 rerun | Unmet | - |
| AC-019 | REQ-014 | Given the setup target, When the setup dashboard renders, Then it shows `Mutation class: read-only`, and the setup result block shows a DEGRADED close | The T027 diff | Unmet | - |
| AC-020 | REQ-015 | Given DOC-384's precondition as written, When an operator meets only that precondition and runs the scenario, Then the expected signals hold | The T028 diff and the T034 real-runtime run | Unmet | - |
| AC-021 | REQ-016 | Given a FIFO at an adapter config path, When the battery runs under a timeout, Then it finishes and reports the path as unreadable | The T017 test | Unmet | - |
| AC-022 | REQ-017 | Given `GIT_DIR` exported to a second repository, When the battery runs with `--repo` set to the first, Then every row reports on the first | The T015 test | Unmet | - |
| AC-023 | REQ-018 | Given `.`, an empty entry and a trailing `:` in `PATH` and a planted `./git` that writes a marker, When the battery runs, Then the marker is never written | The T016 test | Unmet | - |
| AC-024 | REQ-019 | Given an allowlist file that is a symlink to a file outside the repository, When the battery runs, Then the report refuses it and contains none of the target's lines | The T018 test | Unmet | - |
| AC-025 | REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-025 | Given the strengthened suite and the re-cited evidence, When each test's guarded behavior is broken on purpose, Then that test fails, and every completed task in 002 and 034 cites a command a reviewer can rerun | Mutation checks for T019 to T022, and the T030 diff | Unmet | - |

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

Planning only. No criterion is met yet. The hooks-repair question that AC-012 depended on was resolved on 2026-10-15 with option A.
<!-- /ANCHOR:closure -->
