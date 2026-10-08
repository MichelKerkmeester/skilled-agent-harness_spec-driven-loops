---
title: "Acceptance Criteria: External-user compatibility path"
description: "The criteria this packet must satisfy before it may be closed."
trigger_phrases:
  - "doctor update compatibility acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: External-user compatibility path for /doctor:update

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a v3 layout repo, when `/doctor:update check` runs, then compatibility section shows layout and era signal counts | Exit 0 from check on fixture, output shows layout:v3 and signal counts | Unmet | - |
| AC-002 | REQ-002 | Given approval from user, when the compatibility action runs, then it moves the spec tree and applies upgrade-legacy without touching `.skilled/` | Exit 0 from action on fixture v3 repo; verify `.skilled/` unchanged (git status shows only specs/ changes) | Unmet | - |
| AC-003 | REQ-003 | Given a path collision in the move preview, when the user is shown the preview, then every collision is listed with before and after paths | Preview output from action shows collision list | Unmet | - |
| AC-004 | REQ-004 | Given a user following the workflow, when they read /doctor:update documentation, then the exact command sequence is clear and warnings are named (clean tree or before-image required) | Documentation shows command sequence with warnings; validate against actual action output | Unmet | - |
| AC-005 | REQ-005 | Given an action run, when the user watches execution, then every step is logged and a rollback procedure is named if interrupted or failed | Action output log shows step names; rollback instructions appear in final summary or error message | Unmet | - |
| AC-006 | REQ-006 | Given a partial v3 layout move already in progress, when the compatibility action is invoked, then it detects the state and resumes or refuses clearly | Action output names what is already moved | Unmet | - |
| AC-007 | REQ-007 | Given the latest doctor and spec-kit test suite, when compatibility changes are added, then no new test failure is introduced | Exit 0 from `bash .skilled/commands/doctor/scripts/tests/run-all.sh` and `npm --prefix .skilled/skills/system-spec-kit test` | Unmet | - |
| AC-008 | REQ-001 | Given a v4-era repo with no `.opencode/specs`, when `/doctor:update check` runs, then compatibility section shows layout:v4 and no move is recommended | Fixture v4 repo check output shows layout:v4 | Unmet | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No (Planned, not yet built)

This packet is planned and awaiting implementation. All acceptance criteria are listed but unchecked.
<!-- /ANCHOR:closure -->
