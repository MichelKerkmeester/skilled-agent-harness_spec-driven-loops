---
title: "Acceptance Criteria: Phase 1: git-hook-review-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes"
    last_updated_at: "2026-10-02T08:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Commit in worktree 075"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: git-hook-review-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a clone carrying the toolchain sentinel and a planted guard library, When `git pull` or `git commit` runs with the global hooks, Then the planted code does not run | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:150`; P0 reproduction re-run (pull and commit, no marker) | Met | - |
| AC-002 | REQ-001 | Given that clone, When its local config sets `skilled.trustRepoHooks=true`, Then its tree is used; and a `-c` command-scope setting is not enough | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:134` (env opt-in refused) and the local opt-in check after it | Met | - |
| AC-003 | REQ-001 | Given a worktree of the hooks' own checkout, When a hook fires, Then its gates still run | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:131`; every suite runs from worktree 075 | Met | - |
| AC-004 | REQ-002 | Given a branch that merged a non-conforming commit from the remote, When it is pushed, Then the push passes | `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:168` | Met | - |
| AC-005 | REQ-002 | Given a force-push over an unfetched remote tip, or a push by URL, When pre-push runs, Then only new commits are checked and a crash is not reported as a rule failure | `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:179` and `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:198` | Met | - |
| AC-006 | REQ-003 | Given a pushed branch that was rebased, When it is amended or landed on main and pushed, Then no Commit-Id collision is reported | `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:194` and `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh:200` | Met | - |
| AC-007 | REQ-004 | Given a real `git cherry-pick`, clean or conflicted, When the commit is made, Then it carries a new Commit-Id | `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh:199` (real clean and continued picks) | Met | - |
| AC-008 | REQ-005 | Given `git -c skgit.contractDir=<empty>` or `GIT_CONFIG_*`, When a bad message is committed, Then it is blocked | `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:202`; manual `git -c` and `GIT_CONFIG_*` commits blocked | Met | - |
| AC-009 | REQ-006 | Given a subject and a `Context:` line that name the vendor, When prepare-commit-msg runs, Then both stay and only forbidden keys are removed, with a stderr note | `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh:378` | Met | - |
| AC-010 | REQ-007 | Given a plain repo with partially staged `.claude/` files or an edited tracked routing file, When committing or pushing, Then nothing blocks | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:613` and `.skilled/scripts/git-hooks/tests/pre-push.test.sh:212` | Met | - |
| AC-011 | REQ-008 | Given a violation staged then fixed only in the working tree, or a non-ASCII staged name, When committing, Then the commit is blocked | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:631` | Met | - |
| AC-012 | REQ-009 | Given the docs and headers, When read against the code, Then findings 12, 14 to 18 no longer apply | `.skilled/scripts/git-hooks/pre-push:348` and `.skilled/skills/sk-git/scripts/worktree-naming.sh:164`; README and header diff review | Met | - |
| AC-013 | REQ-010 | Given a body line starting with `#` under `-m`, When committing and later pushing, Then both stages agree | `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:129` and `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh:387` | Met | - |

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
`decision-record.md`.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All thirteen criteria are Met with observed test evidence. Making the skill-metadata gate block and routing `skilled/v*` through the allowlist were left out on purpose, by operator ruling.
<!-- /ANCHOR:closure -->
