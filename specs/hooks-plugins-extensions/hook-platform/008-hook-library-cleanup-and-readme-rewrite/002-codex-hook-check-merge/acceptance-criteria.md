---
title: "Acceptance Criteria: Phase 2: codex-hook-check-merge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "codex hook check merge acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge"
    last_updated_at: "2026-11-15T14:58:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-codex-hook-check-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: codex-hook-check-merge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge
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
| AC-001 | REQ-001 | Given the worktree at its final state, When `ls -d .skilled/hooks/codex-global-hooks-check` and `git ls-files .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` run, Then the first exits 0 and the second prints nothing | On 2026-11-15 `ls -d` printed the folder and exited 0, and `git ls-files` on the two old folders printed nothing from the final state. It printed 10 lines before the move. | Met | - |
| AC-002 | REQ-002 | Given the moved folders, When `find .skilled/hooks/codex-global-hooks-check -type l` runs, Then it lists 4 links, and the same command with `! -exec test -e {} \; -print` prints nothing | The first `find` listed 4 links. The second printed nothing. `readlink` on the OpenCode link printed `../../../../.opencode/plugins/codex-hooks-watchdog.js`. | Met | - |
| AC-003 | REQ-003 | Given the worktree at its final state, When the old-folder search in `tasks.md` (`SEARCH`) runs, Then it prints nothing | The search printed nothing from the final state. It printed 42 lines before the move, so it does read the tree. | Met | - |
| AC-004 | REQ-004 | Given the final state, When both sync checks run with `--check`, Then each prints PASS | `[hook-registration-sync] PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` and `[runtime-mirror-sync] PASS: 257 mirrors across 10 trees are in sync.` | Met | - |
| AC-005 | REQ-004 | Given the final state, When the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests run, Then Vitest prints 501 passed, the plugin tests print `fail 0` and the `node --test` suites fail only the case in `hook-stdin-deadline.test.mjs` | Vitest printed `Test Files 9 passed (9)` and `Tests 501 passed (501)`. The plugin tests printed `tests 591`, `pass 591`, `fail 0`. The `node --test` suites printed `tests 1839`, `pass 1838`, `fail 1`, and the one failing case is "the Cursor preflight, MCP route and Task guards still answer a normal payload" at `hook-stdin-deadline.test.mjs:172`. All three match the phase 1 final counts. | Met | - |
| AC-006 | REQ-005 | Given the final state, When `git diff --stat HEAD` runs on `hook-flags.cjs`, the OpenCode plugin, the installer and `hook-registry.json`, Then it prints nothing | The command printed nothing from the final state. | Met | - |
| AC-007 | REQ-006 | Given the new feature README, When `validate_document.py`, `hvr_scan.py` and `check_readme_references.py` run on it, Then they print `VALID`, `hard blockers: 0` and a PASS line, and `rg -c` finds `install-codex-hooks.mjs --check` and both switch names | `validate_document.py` printed `VALID` with 0 issues. `hvr_scan.py` printed `hard blockers: 0`. `check_readme_references.py` printed `PASS` with `references=50 unresolved=0`. `rg -c` printed 8. | Met | - |
| AC-008 | REQ-007 | Given the rebased pinned lists, When `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` run, Then each exits 0 | `test_readme_manifest.py` printed `manifest=reproducible` with 920 directories. `test_readme_verdict_parity.py` printed `PARITY baseline_files=1141 post_files=1141 diff_entries=0` and `PARITY PASS`. `generate-trigger-index.mjs --check` printed `trigger index matches the corpus`. | Met | - |
| AC-009 | REQ-008 | Given the final state, When the bare-name count in `tasks.md` (`BARE`) runs, Then it prints the 13 lines of the expected column in the `plan.md` table | `BARE` printed 13 lines, saved as `scratch/bare-after.txt`. A `diff` against `scratch/bare-before.txt` shows `coverage-rationale.md` 2 to 1, `.skilled/hooks/README.md` 5 to 4 and the `./README.md` line gone. Every other line is equal. | Met | - |

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

All nine criteria are Met. None is waived or superseded.
<!-- /ANCHOR:closure -->
