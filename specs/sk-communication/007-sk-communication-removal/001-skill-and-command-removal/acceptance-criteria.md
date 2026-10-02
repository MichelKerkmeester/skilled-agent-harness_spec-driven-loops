---
title: "Acceptance Criteria: Phase 1: skill-and-command-removal"
description: "The criteria this phase must satisfy before it may close, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "phase 1 acceptance criteria"
  - "skill removal closure gate"
  - "runtime mirror acceptance"
  - "advisor route exclusion test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/007-sk-communication-removal/001-skill-and-command-removal"
    last_updated_at: "2026-10-02T06:05:50Z"
    last_updated_by: "codex"
    recent_action: "Closed phase 1 acceptance criteria with passing trigger-index evidence"
    next_safe_action: "Choose whether and when to commit the completed packet."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:c1d5e5b7cd8d546569786d885836e3eba75d22c743e22c059b0e765479189b62"
      session_id: "codex-074-sk-communication-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: skill-and-command-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/007-sk-communication-removal/001-skill-and-command-removal
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
| AC-001 | REQ-001, REQ-002 | Given the specified runtime feature surfaces, When their paths are checked, Then the skill, package changelog, Hermes skill, rewrite commands, runtime prompts and OpenCode plugin/test are absent | T004-T006, task trace tasks.md:47; removal-path command; observed no stdout, exit 0 | Met | - |
| AC-002 | REQ-004 | Given the advisor route-exclusion loader remains, When its focused Vitest suite runs, Then an empty list is safe and non-excluded skills remain routable | T010, task trace tasks.md:60; npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/route-exclusions.vitest.ts; observed 1 file passed, 10 tests passed, exit 0 | Met | - |
| AC-003 | REQ-005 | Given the retained canonical prompt and Hermes skill sources, When all mirror generators run in check mode, Then Codex, Hermes and Pi prompt mirrors and the Hermes skill mirror have no drift | T009, task trace tasks.md:59; all four --check commands; Codex/Hermes/Pi each reported PASS: 32 prompts are in sync, Hermes skills reported PASS: 71 Hermes skill copies in sync; exit 0 for each | Met | - |

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

AC-001 through AC-003 are Met with observed path, advisor and mirror evidence. The packet-level trigger-index generation and freshness check also passed under T013.
<!-- /ANCHOR:closure -->
