---
title: "Acceptance Criteria: Phase 4: Commit-Id in every toolchain repo"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "commit id in every toolchain repo acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/004-commit-id-in-every-toolchain-repo"
    last_updated_at: "2026-10-13T20:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all six criteria with suite and negative-control evidence"
    next_safe_action: "Commit the phase on the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/lib/commit-id-policy.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "16736890-ae79-4ab6-8f04-75a04b69625f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: Commit-Id in every toolchain repo

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/032-template-driven-message-enforcement/004-commit-id-in-every-toolchain-repo
**Level:** 2
**Status:** Complete
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an untrusted clone that ships the allocator, When a message is prepared, Then it gets one id and the clone's allocator never runs | `prepare-commit-msg.test.sh` case 16b passes, and fails against HEAD | Met | - |
| AC-002 | REQ-002 | Given a repository without the toolchain, When its history carries ids or local `skilled.commitId` is true, Then it is stamped, and false or a command-scope value leaves it alone | `prepare-commit-msg.test.sh` case 16c passes, and fails against HEAD | Met | - |
| AC-003 | REQ-003 | Given a covered repository, When a message without an id reaches commit-msg, Then it is refused, while a real merge passes | `commit-msg.test.sh` case 27 passes, and its refusal cases fail against HEAD | Met | - |
| AC-004 | REQ-004 | Given a covered repository, When a push adds a non-merge commit without an id, Then pre-push blocks it, while stamped commits and merges pass | `pre-push.test.sh` Commit-Id section passes, and its block case fails against HEAD | Met | - |
| AC-005 | REQ-005 | Given a continued revert or a squash, When the stamper runs, Then each gets an id, and a real merge stays untouched | `prepare-commit-msg.test.sh` case 6 passes, and both stamp cases fail against HEAD | Met | - |
| AC-006 | REQ-006 | Given the hook READMEs, When read, Then they describe the policy, the flag and Gate 7 | `README.md`, `lib/README.md` and `tests/README.md` under `.skilled/scripts/git-hooks/` | Met | - |

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

All six criteria are met by the hook suites, each new case also failing against the hooks at HEAD. Backfilling existing history and covering Moneybird Accountant were left out as operator decisions.
<!-- /ANCHOR:closure -->
