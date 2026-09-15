---
title: "Acceptance Criteria: Phase 2: extend-dispatch-coverage"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/014-extend-dispatch-coverage"
    last_updated_at: "2026-09-15T16:29:32Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-014-extend-dispatch-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: extend-dispatch-coverage

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/014-extend-dispatch-coverage
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a violating dispatch in a Cursor session, When the adapter evaluates it, Then it returns a deny envelope before the command runs | Adapter exercised directly: deny envelope with exit 2 on the unredirected codex dispatch, allow on the corrected one and on plain shell | Met | - |
| AC-002 | REQ-002 | Given a violating dispatch in an OpenCode session, When the pre-execution hook evaluates it, Then it throws and the call is denied | Plugin hook exercised directly: DENIED on the unredirected codex dispatch, ALLOWED on the corrected one and on plain shell | Met | - |
| AC-003 | REQ-003 | Given both spellings of each widened condition, When each predicate evaluates them, Then both are caught and the correct forms still pass | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` test "predicate bypasses"; negative controls assert a URL and a POSIX path are not slash prompts | Met | - |
| AC-004 | REQ-004 | Given a Pi dispatch without the offline flag or with an unqualified model, When the preflight evaluates it, Then it is denied | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` test "pi dispatches need --offline and a provider-qualified model", including the no-model case | Met | - |
| AC-005 | REQ-005 | Given a missing adapter file or binding, When the suite runs, Then it fails rather than passing silently | Removing the Cursor binding fails the registration test with "cursor has no preflight binding" | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
