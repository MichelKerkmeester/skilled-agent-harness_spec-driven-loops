---
title: "Acceptance Criteria: Phase 2: worktree-relocation-restore"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "worktree relocation restore acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/002-worktree-relocation-restore"
    last_updated_at: "2026-10-27T10:11:47Z"
    last_updated_by: "planning"
    recent_action: "Filled the planning docs for the worktree base write-back phase"
    next_safe_action: "Review the spec and plan, then implement T005 to T009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-002-worktree-relocation-restore"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: worktree-relocation-restore

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/002-worktree-relocation-restore
**Level:** 2
**Status:** Draft
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given neither `SPECKIT_WORKTREE_BASE` nor `speckit.worktreeBase` is set, When a wrapper launch runs in a fixture repository, Then `git -C "$FIXTURE" config --get speckit.worktreeBase; echo "exit=$?"` prints `exit=1` | `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0`, and its default-path case passes | Unmet | - |
| AC-002 | REQ-002 | Given the same launch, When it allocates its worktree on the default base, Then `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0`, and the launch stderr contains `in-checkout default` | The default-path case greps the stderr for the log line | Unmet | - |
| AC-003 | REQ-003 | Given `SPECKIT_WORKTREE_BASE` is set to a non-empty absolute path and the key is unset, When a wrapper launch runs, Then `git -C "$FIXTURE" config --get speckit.worktreeBase` prints that path | The env-base case (F4) in `bash .skilled/bin/tests/worktree-session.test.sh`, which ends `FAIL=0` | Unmet | - |
| AC-004 | REQ-004 | Given the resolved base sits inside the checkout and four linked worktrees exist, When the doctor runs, Then `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`, and the in-checkout case reports DEGRADED | The new in-checkout case in the doctor suite | Unmet | - |
| AC-005 | REQ-004 | Given the resolved base sits outside the checkout, or three or fewer linked worktrees exist, When the doctor runs, Then `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`, and the outside and at-threshold cases report PASS | The outside and at-threshold cases in the doctor suite | Unmet | - |
| AC-006 | REQ-005 | Given the operator has confirmed each idle worktree in writing and the key is set to `~/worktrees/public`, When each worktree is moved and repaired, Then `git worktree list --porcelain \| grep -c '^worktree .*/\.worktrees/'` prints `0` | The output is recorded in `implementation-summary.md` at closure, with the rollback snapshot from `tasks.md` T016 | Unmet | - |

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

No. AC-001 is unmet and blocks closure, and the operator confirmation for AC-006 is still open.
<!-- /ANCHOR:closure -->
