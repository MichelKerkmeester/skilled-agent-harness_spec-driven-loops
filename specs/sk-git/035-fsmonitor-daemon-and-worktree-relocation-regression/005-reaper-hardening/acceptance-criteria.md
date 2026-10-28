---
title: "Acceptance Criteria: Phase 5: reaper-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reaper hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude"
    recent_action: "Hardened the fsmonitor daemon reaper and bounded the hook and launch git calls"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/bin/fsmonitor-daemon-reaper.sh"
      - ".skilled/scripts/git-hooks/lib/bounded-git.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: reaper-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a stray whose listed start time no longer matches `ps`, When `--apply` runs, Then it prints `skipped ... reason=start-time-changed`, signals nothing and the process survives | `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:441` case "a pid whose start time changed is not signalled", guard at `.skilled/bin/fsmonitor-daemon-reaper.sh:251`; the case fails against `git show HEAD:` of the reaper | Met | - |
| AC-002 | REQ-002 | Given two daemons on one registered worktree, When one is ended, Then git's `stop` is not run; with one daemon it is | `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:474` and the case after it, guard at `.skilled/bin/fsmonitor-daemon-reaper.sh:298`; fails against HEAD | Met | - |
| AC-003 | REQ-003 | Given a worktree registered after the run began, When its daemon is classed stray, Then a fresh list spares it and it prints `reason=registered-mid-run` | `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:509`, skip at `.skilled/bin/fsmonitor-daemon-reaper.sh:675`; fails against HEAD | Met | - |
| AC-004 | REQ-004 | Given daemons whose root is deleted and daemons whose root exists, When `--orphans --apply` runs, Then only the deleted-root daemon is ended, a dry run signals nothing, and `--orphans --worktree` exits 2 | `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:559` and `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:568`, class at `.skilled/bin/fsmonitor-daemon-reaper.sh:578`; fails against HEAD | Met | - |
| AC-005 | REQ-005 | Given a `git diff` that never returns, When `pre-commit` or `pre-push` runs, Then the hook exits 1 within the bound with `BLOCKED [gate:git-timeout]` | `.skilled/scripts/git-hooks/tests/bounded-git.test.sh:162` and `.skilled/scripts/git-hooks/tests/bounded-git.test.sh:184`; both fail against the HEAD hooks | Met | - |
| AC-006 | REQ-006 | Given the index-reading call lines named in `spec.md` section 3, When the hooks run, Then each goes through `git_bounded` | `.skilled/scripts/git-hooks/pre-commit:137` and the 24 other call lines, `.skilled/scripts/git-hooks/pre-push:263`; `rg` for an unbounded `git diff`, `ls-files`, `show` or `add` outside `echo` and comments prints nothing | Met | - |
| AC-007 | REQ-007 | Given a `git worktree add` that hangs, When `worktree-session.sh` launches, Then it fails within the bound and starts no session | `.skilled/bin/tests/worktree-session.test.sh:627`, launch call at `.skilled/bin/worktree-session.sh:324` | Met | - |
| AC-008 | REQ-008 | Given a child that ignores SIGTERM or a PATH with no `perl`, When `bounded_run` runs, Then the child is killed after the grace and the command still runs | `.skilled/scripts/git-hooks/tests/bounded-git.test.sh:49` (SIGTERM first), `.skilled/scripts/git-hooks/tests/bounded-git.test.sh:62` (no `perl`), helper at `.skilled/scripts/git-hooks/lib/bounded-git.sh:32` | Met | - |
| AC-009 | REQ-009 | Given the sk-git docs, When read, Then the false catalog line is gone from GIT-034 and GIT-043, the flags are documented, GIT-047 was run, and the playbook validator exits 0 | `rg` for the old line prints nothing; `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` exits 0; `implementation-summary.md:1` GIT-047 table | Met | - |
| AC-010 | REQ-001 | Given every suite that passed at HEAD, When rerun after the change, Then none fails and no count drops | `implementation-summary.md:1` before and after counts table | Met | - |

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

Every row above is Met, and the evidence is in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
