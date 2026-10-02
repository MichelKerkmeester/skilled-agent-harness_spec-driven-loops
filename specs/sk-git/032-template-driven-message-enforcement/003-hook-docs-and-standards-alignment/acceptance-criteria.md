---
title: "Acceptance Criteria: Phase 3: hook-docs-and-standards-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hook docs alignment acceptance"
  - "env reference switch acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/003-hook-docs-and-standards-alignment"
    last_updated_at: "2026-10-02T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Hook docs, code READMEs and the env reference aligned with the hooks; three standards gaps fixed"
    next_safe_action: "Commit in worktree 075 on the operator's go-ahead"
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
# Acceptance Criteria: Phase 3: hook-docs-and-standards-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/032-template-driven-message-enforcement/003-hook-docs-and-standards-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a staged file whose content cannot be read, When either pre-commit hook runs, Then the commit is blocked, a submodule entry is skipped, and the temp directory is removed | `.skilled/scripts/git-hooks/pre-commit:97-106`, `.skilled/hooks/git/pre-commit:43-52`; pre-commit suite 67 passed; scratch repo shows a staged gitlink reads as mode `160000` | Met | - |
| AC-002 | REQ-002 | Given `Spec: ../README.md` or `Spec: sk-git/../../README.md`, When the validator runs, Then `trailer.spec-exists` fires | `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:108-109`; 23 of 23 pass, and 1 fails with the phase 2 validator restored | Met | - |
| AC-003 | REQ-003 | Given every `SPECKIT_*` and `SYSTEM_*` name in the hooks and their libraries, When each is looked up in ENV-REFERENCE.md, Then none is missing | Coverage script over `.skilled/scripts/git-hooks/{pre-commit,pre-push,prepare-commit-msg,commit-msg,post-*}`, `lib/*.sh` and `.skilled/hooks/git/pre-commit` prints no MISSING line (14 before) | Met | - |
| AC-004 | REQ-004 | Given the hook docs, When each changed sentence is read against the hook line it describes, Then they agree | `README.md:194-196`; `.skilled/skills/sk-git/references/remote-branch-policy.md:28-30,70,74`; `.skilled/scripts/git-hooks/README.md:31,107,112`; `.skilled/hooks/git/README.md:28,31,57,78,101`; checked against `.skilled/scripts/git-hooks/pre-push:269-300,348` | Met | - |
| AC-005 | REQ-005 | Given the checker and the layout module, When their folder READMEs are read, Then they name multi-file checking and `AUTHORED_PROGRAM_DIR` | `.skilled/skills/sk-code/sk-code-quality/scripts/README.md:20`; `.skilled/bin/lib/README.md:57` | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are Met. Two audit proposals were declined with their reasons in spec.md: narrowing the Commit-Id copy rule, which would flag every real rebase copy, and setting the regex flag in host processes. One audit claim was refuted in code.
<!-- /ANCHOR:closure -->
