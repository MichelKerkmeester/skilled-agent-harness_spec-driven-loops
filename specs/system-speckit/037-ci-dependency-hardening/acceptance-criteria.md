---
title: "Acceptance Criteria: Harden CI mirror parity at commit time and remediate Dependabot alerts"
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
    packet_pointer: "specs/system-speckit/037-ci-dependency-hardening"
    last_updated_at: "2026-09-07T20:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01N8fCNvYeGom82LR8vjg1ah"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Harden CI mirror parity at commit time and remediate Dependabot alerts

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 037-ci-dependency-hardening
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a staged command source whose mirrors were not regenerated, When the hook runs, Then it exits 1 naming `sync-runtime-mirrors.cjs` | Harness shape 2: `exit=1 BLOCKED [gate:mirror-parity]: sync-runtime-mirrors.cjs failed` | Met | - |
| AC-002 | REQ-002 | Given regenerated mirrors that are untracked, When the hook runs, Then it exits 1 listing the unstaged outputs | Harness shape 3: `BLOCKED [gate:mirror-parity]: a generated mirror has changes that are not staged` | Met | - |
| AC-003 | REQ-001 | Given a clean tree, When the hook runs, Then it exits 0 | Harness shape 1: `exit=0` | Met | - |
| AC-004 | REQ-003 | Given a push touching only a mirror path, When GitHub evaluates triggers, Then Spec-Kit Check runs | Both `paths:` blocks parse with ten entries; runs `34153814137` (main) and `34153812346` (v4) fired on `328accca03` and succeeded | Met | - |
| AC-005 | REQ-004 | Given the default branch, When open alerts are listed, Then the list is empty | `gh api .../dependabot/alerts?state=open` after the lockfile push, recorded in `implementation-summary.md` | Met | - |
| AC-006 | REQ-005 | Given the bumped advisor lockfile, When the suite runs, Then it passes at the same count as the HEAD lockfile | 880 passed with the fixed lock; 880 passed with the HEAD lock as control | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

The gate criteria carried the packet: the hook now refuses every state CI's mirror job would fail, and CI fires on the commit that causes drift. Left out on purpose: the failure-email preference, which only the operator can change in the GitHub UI.
<!-- /ANCHOR:closure -->
