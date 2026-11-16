---
title: "Acceptance Criteria: Phase 1: dead-hook-file-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dead hook file removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal"
    last_updated_at: "2026-11-15T14:58:49Z"
    last_updated_by: "scaffold"
    recent_action: "Marked all eleven criteria Met"
    next_safe_action: "Run /speckit:plan on the 002-codex-hook-check-merge folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-dead-hook-file-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: dead-hook-file-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal
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
| AC-001 | REQ-001 | Given the worktree at its final state, When `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` runs, Then it prints nothing | On 2026-11-15 the command printed nothing from the final state. It listed five files before the deletion. | Met | - |
| AC-002 | REQ-002 | Given the worktree at its final state, When the reference search in `tasks.md` (`SEARCH`) runs, Then it prints nothing | On 2026-11-15 the search printed nothing and exited 1 from the final state. The same search listed every caller this phase repaired when it ran before the first edit, so it does read the tree. | Met | - |
| AC-003 | REQ-003 | Given the gate list without the legacy entry, When `bash .github/scripts/check-gate-inputs.sh` runs, Then it prints `files=46` and `RESULT: PASSED` | The check printed `files=46 inputs_resolved=317 dynamic_inputs=38 twin_pairs=376 failures=0` and `RESULT: PASSED`. Before the workflow step was removed it printed `FAIL workflow-inputs` for the deleted installer test. | Met | - |
| AC-004 | REQ-003 | Given the repaired test files, When `check-gate-inputs.test.sh`, `pre-commit.test.sh` and `source-root-selection.test.sh` run, Then each ends with `0 failed` | `check-gate-inputs.test.sh` printed `61 passed, 0 failed` (baseline 61). `pre-commit.test.sh` printed `152 passed, 0 failed` (baseline 163, minus the 11 assertions of the nine removed cases). `source-root-selection.test.sh` printed `56 passed, 0 failed` (baseline 60, minus the four checks on the two removed list entries). | Met | - |
| AC-005 | REQ-004 | Given the final state, When the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests run, Then Vitest prints 501 passed, the plugin tests print `fail 0` and the `node --test` suites fail only the baseline case in `hook-stdin-deadline.test.mjs` | Vitest printed `Test Files 9 passed (9)` and `Tests 501 passed (501)`. The plugin tests printed `tests 591`, `pass 591`, `fail 0`. The `node --test` suites printed `tests 1839`, `pass 1838`, `fail 1`, and the failing case is the baseline one in `hook-stdin-deadline.test.mjs`. | Met | - |
| AC-006 | REQ-004 | Given the flags test without its `.ts` leg, When `node --test .skilled/hooks/shared/hook-flags.test.cjs` runs, Then it prints `tests 31` and `fail 0` | The command printed `tests 31`, `pass 31`, `fail 0`. | Met | - |
| AC-007 | REQ-005 | Given the final state, When both sync checks run with `--check`, Then each prints PASS | `[hook-registration-sync] PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `[runtime-mirror-sync] PASS: 257 mirrors across 10 trees are in sync.` | Met | - |
| AC-008 | REQ-006 | Given the rebased pinned lists, When `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` run, Then each exits 0 | `test_readme_manifest.py` printed `manifest=reproducible` and exited 0. `test_readme_verdict_parity.py` printed `PARITY PASS` and exited 0 with `baseline_files=1142`, not the 1136 this row first named: the committed baseline lacked six READMEs that exist at the base commit and the writer added them. `generate-trigger-index.mjs --check` printed `trigger index matches the corpus` and exited 0. | Met | - |
| AC-009 | REQ-007 | Given the primary pre-commit, When the `pre-commit.test.sh` cases that set `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` run, Then they pass | `rg -c` on the switch name printed 4 and the file ended with `pre-commit gates: 152 passed, 0 failed`. | Met | - |
| AC-010 | REQ-008 | Given the main checkout, When the five stray paths are listed, Then none exists and the log has a backup | `ls` on the main checkout printed `No such file or directory` for `session-relaunch`, `decision-capture/.skilled` and `dispatch/node_modules` on 2026-11-15, and the removal run printed `gone` for all five. The log was copied to the session scratchpad before removal. | Met | - |
| AC-011 | REQ-009 | Given the finished phase, When `implementation-summary.md` is read, Then it holds one sentence for the release note that names the removed standalone pre-commit and `.skilled/scripts/install-git-hooks.sh` | `rg -c 'install-git-hooks.sh' implementation-summary.md` printed 1 on 2026-11-15. The sentence starts with `Release note:` and names `.skilled/hooks/git/pre-commit` as removed. The same search printed nothing while the file was a scaffold. | Met | - |

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

All eleven criteria are Met. None is waived or superseded.
<!-- /ANCHOR:closure -->
