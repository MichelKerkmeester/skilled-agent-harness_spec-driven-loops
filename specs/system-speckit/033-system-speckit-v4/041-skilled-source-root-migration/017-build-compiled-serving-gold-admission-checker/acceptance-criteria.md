---
title: "Acceptance Criteria: Phase 17: build-compiled-serving-gold-admission-checker"
description: "The criteria the admission checker build must satisfy before it may close."
trigger_phrases:
  - "gold admission checker acceptance"
  - "phase 17 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker"
    last_updated_at: "2026-09-19T05:32:44Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the build"
    next_safe_action: "Answer the open questions in spec.md section 10"
    blockers:
      - "The open questions in spec.md section 10 need the operator's answers"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How does a clarify decision count?"
      - "What coverage floor applies, and to admitted hubs as well as new ones?"
      - "How does multi-mode gold score?"
      - "Repair the flip tool or replace it?"
      - "Should CI block on drift from day one?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: build-compiled-serving-gold-admission-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker
**Level:** 2
**Status:** Planned
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture per status and sub-reason, When the scorer runs, Then each gets its expected status, and an unparseable gold value fails the run | The fixture tests | Unmet | - |
| AC-002 | REQ-002 | Given a hub whose manifest reads legacy, When the checker runs, Then it still scores the hub and no manifest changes | A test that hashes the activation manifests before and after | Unmet | - |
| AC-003 | REQ-003 | Given a hub below the floor, When the checker runs, Then it reports `insufficient-coverage` | A fixture hub | Unmet | - |
| AC-004 | REQ-004 | Given the live corpus, When the tests run, Then the corpus count matches its pin and one live hub scores | The live test | Unmet | - |
| AC-005 | REQ-005 | Given a push, When CI runs, Then the checker runs over all five hubs | A CI run ID | Unmet | - |
| AC-006 | REQ-006 | Given the baseline report, When it is read, Then every failure carries a class | The committed report | Unmet | - |
| AC-007 | REQ-007 | Given a sandbox copy, When the flip step runs, Then the manifest reads `compiled` and the lock and journal are clean | The sandbox run | Unmet | - |

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

The build has not started. It waits on the answers to `spec.md` section 10.
<!-- /ANCHOR:closure -->
