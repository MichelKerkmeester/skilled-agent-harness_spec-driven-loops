---
title: "Acceptance Criteria: Phase 1: gate-3-mutation-time-delivery"
description: "The criteria this packet must satisfy before it may be closed: no turn-time menu in any runtime, one mutation-time delivery per session through each runtime's strongest channel, a binding pi dialog, a persisted emission marker, and a not-yet-created packet path that binds."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery"
    last_updated_at: "2026-09-22T07:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Recorded closure evidence for every criterion after the final suite and validation run"
    next_safe_action: "None; every criterion is Met and the packet is closeable"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-048-gate-3-mutation-time-delivery"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: gate-3-mutation-time-delivery

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery
**Level:** 2
**Status:** Complete
**Date:** 2026-09-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a write-intent prompt, When any classify adapter processes it, Then the turn carries no option menu while the gate state still opens | The four adapter suites assert no output and read the persisted `open` state (59/59 pass), and the classify boundary check printed `stdout=[]`, exit 0, with `{"status":"open"}` on disk (`tasks.md:134`) | Met | - |
| AC-002 | REQ-002 | Given an open gate and a first non-exempt mutation in one session, When the enforce adapter runs, Then the question is delivered exactly once through that runtime's strongest channel | Core corpus delivery cases (first advisory carries `GATE_3_MUTATION_NOTICE`, second is a silent allow) plus the boundary check's first/second advisory outputs and the Pi suite (9/9) (`tasks.md:135`, `tasks.md:136`) | Met | - |
| AC-003 | REQ-003 | Given a pi interactive session with an open gate and a first write or edit, When the tool call arrives, Then a select-plus-input dialog asks, the answer binds, and that one call is blocked with the retry reason naming the resolution | The Pi extension vitest drives the production handlers through a fake `ExtensionAPI`: `ctx.ui.select` + `ctx.ui.input`, `bindGate3Answer`, one blocked call whose reason names the bound path, retry passes untouched; 9/9 pass (`tasks.md:136`) | Met | - |
| AC-004 | REQ-004 | Given a session where the question was already delivered, When further mutations arrive, Then no repeat emission occurs until a resume trigger, an answer attempt or a re-opened gate re-arms it, and `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` forces emission | Core corpus marker, re-arm and forced-emission cases all pass, and the boundary check's second mutation printed nothing (`tasks.md:151`, `tasks.md:135`) | Met | - |
| AC-005 | REQ-005 | Given a not-yet-created packet path whose parent exists inside the repository `specs/` root and whose leaf matches `^\d{3}-[a-z0-9-]+$`, When it is submitted as an answer, Then the binding is accepted and no re-ask follows; traversal, out-of-root, empty and file-where-folder-expected candidates are rejected | Core corpus binding cases: the fresh `.opencode/specs/048-fresh-packet` path binds, while traversal, out-of-root, non-packet leaf, bare token, empty path and an existing file at a packet-pattern path all stay open (`tasks.md:137`, `tasks.md:149`) | Met | - |
| AC-006 | REQ-006 | Given a cancelled or timed-out dialog, a malformed payload, a disabled flag or an unresolvable project root, When either entrypoint runs, Then the outcome equals the shipped default taken today and no new block appears | The Pi suite's cancelled-dialog case records `dialog-cancelled` and never re-asks while failing open; the preserved fail-open corpus cases (corrupt state, unwritable state dir, unexpected argument shape) all pass (`tasks.md:136`, `tasks.md:126`) | Met | - |
| AC-007 | REQ-007 | Given `AI_SESSION_CHILD=1`, When either entrypoint runs, Then it completes as a no-op before any state read, question or telemetry | The core child-session cases, the four adapter child cases and the OpenCode plugin's child case all pass: no state file, no output, no telemetry (`tasks.md:138`) | Met | - |
| AC-008 | REQ-008 | Given the final workspace, When the core corpus, the four adapter suites, the runtime vitest project and both strict validations run, Then every one passes from that state | Core `107/104/0/3` (`107/107` with module mocks), adapters `59/59`, runtime root project `1292 passed / 13 skipped / 0 failed` including the Pi suite 9/9, plugin suite 11/11, `validate.sh 048-gate-3-mutation-time-delivery --strict` reports `RESULT: PASSED` 0 errors and `validate.sh 033-system-speckit-v4 --recursive --strict` passes on the parent and 48 of 49 children, the single failure being the pre-existing `030-spec-kit-simplification-research` goal-slice error that reproduces from the pre-change tree (`tasks.md:123`, `tasks.md:124`, `tasks.md:125`, `tasks.md:135`) | Met | - |

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

Every row is `Met`. The delivery move landed in the shared core plus all six
runtimes' adapters, the Pi dialog binds an answer end to end through the shipped
handlers, and the evidence in `tasks.md` is the final-state run rather than a
relayed claim. Two honest boundaries are recorded in
`implementation-summary.md`: the Pi dialog is proven through the extension
handler contract, not a live TUI keystroke pass, and one out-of-spec playbook
page still documents the old classify output.
<!-- /ANCHOR:closure -->

---
