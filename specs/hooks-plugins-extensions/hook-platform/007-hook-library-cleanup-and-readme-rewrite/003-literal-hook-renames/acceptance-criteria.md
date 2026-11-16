---
title: "Acceptance Criteria: Phase 3: literal-hook-renames"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "literal hook renames acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames"
    last_updated_at: "2026-11-15T14:58:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-literal-hook-renames"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: literal-hook-renames

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/003-literal-hook-renames
**Level:** 3
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the worktree at its final state, When `ls -d` runs on `cli-dispatch`, `subagent-dispatch-guard` and `completion-evidence` under `.skilled/hooks/` and `git ls-files` runs on `dispatch`, `task-dispatch` and `completion` there, Then `ls -d` exits 0 and `git ls-files` prints nothing | `ls -d` printed `cli-dispatch`, `completion-evidence` and `subagent-dispatch-guard` under `.skilled/hooks/` and exited 0. `git ls-files` on the three old folders printed 0 lines, and `ls -d` on each reported `No such file or directory`. | Met | - |
| AC-002 | REQ-002 | Given the final state, When the three `find` commands of REQ-002 run, Then the first prints nothing, the second lists 6 files and the third lists 8 files | The first `find` printed 0 lines, the second listed 6 files and the third listed 8 files. | Met | - |
| AC-003 | REQ-003 | Given the final state, When the old-name search in `tasks.md` (`SEARCH`) runs, Then it prints nothing | `SEARCH` printed 0 lines after T055. The same pattern printed 558 lines before the first rename (`scratch/search-before.txt`). | Met | - |
| AC-004 | REQ-004 | Given the final state, When the relative-path search (`REL`), the path-segment search (`SEG`) and the bare-folder search (`BARE`) in `tasks.md` run, Then `REL` and `SEG` print nothing and `BARE` prints only lines that hold `dispatch/spawn` | `REL` and `SEG` printed 0 lines. `BARE` printed 3 lines, each a `dispatch/spawn` comment in a `post-edit-quality.cjs` adapter. | Met | - |
| AC-005 | REQ-005 | Given the final state, When both sync checks run with `--check` and the dangling-link `find` of REQ-005 runs, Then each sync check prints PASS and the `find` prints nothing | `sync-hook-registrations.cjs --check` printed `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` `sync-runtime-mirrors.cjs --check` printed `PASS: 257 mirrors across 10 trees are in sync.` The dangling-link `find` printed nothing before its `LINKS_DONE` marker. | Met | - |
| AC-006 | REQ-006 | Given the final state, When the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests run, Then each prints the counts T001 recorded, and the `node --test` suites fail only the case in `hook-stdin-deadline.test.mjs` | `scratch/baseline-after/`: Vitest 9 files and 501 tests passed, `node --test` 1839 tests with 1838 pass and 1 fail, plugin tests 591 pass and 0 fail. The one failing case is "the Cursor preflight, MCP route and Task guards still answer a normal payload", with `0 !== 2` at `hook-stdin-deadline.test.mjs:200`, the name and assertion T001 saved. | Met | - |
| AC-007 | REQ-007 | Given the final state, When the hook ids are printed from `hook-registry.json` at `HEAD` and from the working tree, and `git diff --stat HEAD` runs on `hook-flags.cjs`, Then the two id lists are equal and the diff prints nothing | `diff` of the working-tree hook id list against `scratch/hook-ids-before.txt` printed nothing, with 35 ids on each side. `git diff --stat HEAD -- .skilled/hooks/shared/hook-flags.cjs` printed nothing. | Met | - |
| AC-008 | REQ-008 | Given the rebased pinned lists, When `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` run, Then they print `manifest=reproducible`, `PARITY PASS` and `trigger index matches the corpus` | `test_readme_manifest.py` printed `manifest=reproducible`, `test_readme_verdict_parity.py` printed `PARITY baseline_files=1141 post_files=1141 diff_entries=0` and `PARITY PASS`, both with exit 0 in `scratch/baseline-after/summary.txt`. `generate-trigger-index.mjs --check` printed `trigger index matches the corpus` with 0 stale documents. | Met | - |
| AC-009 | REQ-009 | Given the spec sub-track move, When `ls -d` runs on `specs/hooks-plugins-extensions/cli-dispatch` and on `specs/hooks-plugins-extensions/dispatch`, Then the first exits 0 and the second reports the folder missing, and the `relocate.mjs --apply` output is saved in `scratch/` | `ls -d specs/hooks-plugins-extensions/cli-dispatch` printed the folder. `ls -d specs/hooks-plugins-extensions/dispatch` printed `No such file or directory`. The `relocate.mjs --apply` output is `scratch/relocate-apply.txt`. T036 and T037 record that the tool moved the one packet inside the sub-track, not the sub-track path. | Met | - |
| AC-010 | REQ-010 | Given the final state, When `git diff --stat HEAD` runs on the benchmark report folders and the captured question screens, Then it prints nothing | `git diff --stat HEAD` on the benchmark report folders and the captured question screens printed nothing. | Met | - |
| AC-011 | REQ-011 | Given the rendered `.claude/settings.json`, When the registered command of each Claude adapter whose path changed runs from the worktree root with a payload on stdin, Then each exits 0 | `scratch/t053-adapter-runs.txt`: all 10 registered commands exited 0 with no `mk-hook-drift` line and an existing script path. A control command that named a path with no file also exited 0 and did print the drift line, so the drift line is the reading that tells the two apart. | Met | - |
| AC-012 | REQ-012 | Given the final state, When `check_readme_references.py` runs over the hook READMEs, Then its failing-file count is no higher than the count T001 recorded | `check_readme_references.py` over the 183 hook READMEs printed `SUMMARY files=183 pass=88 fail=95`, the same as `scratch/readme-refs-before.txt`. The first rerun printed `fail=96`, because two sibling links still named `../dispatch/README.md` and `../completion/README.md`. Both were corrected and the per-file rows now match the saved run. | Met | - |

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

**Closeable:** Yes

All 12 criteria are Met. Each Verification cell names output observed on 2026-11-15 from the final state of the worktree.
<!-- /ANCHOR:closure -->
