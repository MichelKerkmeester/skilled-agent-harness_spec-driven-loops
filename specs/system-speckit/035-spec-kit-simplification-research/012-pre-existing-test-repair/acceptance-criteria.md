---
title: "Acceptance Criteria: Pre-existing test repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "test repair criteria"
  - "full project green"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/012-pre-existing-test-repair"
    last_updated_at: "2026-09-07T04:35:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Pre-existing test repair

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/012-pre-existing-test-repair
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
| AC-001 | REQ-001 | Given the fixture packet, When its implementation summary is edited after stamping and the rule runs with the flag on, Then it warns, and with the enforce switch it fails with exit 2 | the freshness suite passed 17 cases and skipped 1, where the two stale cases failed before | Met | - |
| AC-002 | REQ-002 | Given a manifest of this test and the checker, When the checker runs, Then it prints "all entries are tracked" with exit 0 | the manifest suite passed both cases, where the tracked case failed before | Met | - |
| AC-003 | REQ-003 | Given both test files, When they are searched, Then `checklist.md` appears in neither | the rewrite asserted its absence from the freshness suite; the manifest suite never named it | Met | - |
| AC-004 | REQ-004 | Given the CLI project, When vitest runs it whole, Then zero tests fail | the full CLI project passed 138 files and 1,351 tests with zero failures, where one file failed on every earlier run | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the deep-loop packet's stale goal manifest, which belongs to another session and is reported rather than edited.
<!-- /ANCHOR:closure -->
