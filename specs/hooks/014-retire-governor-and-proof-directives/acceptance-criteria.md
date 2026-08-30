---
title: "Acceptance Criteria: Retire the governor and proof-over-appearance directives from every runtime's prompt injection"
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
    packet_pointer: "hooks/014-retire-governor-and-proof-directives"
    last_updated_at: "2026-08-30T18:28:13Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Retire the governor and proof-over-appearance directives from every runtime's prompt injection

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/014-retire-governor-and-proof-directives
**Level:** 2
**Status:** Complete
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the whole repository, When it is searched for either directive's literal text, Then nothing outside archived benchmark output matches | `rg 'Governor: reason\|Proof over appearance'` returns no hit in source, tests, fixtures or docs | Met | - |
| AC-002 | REQ-001 | Given the compiled renderer, When its exports are listed, Then only `DIRECTIVES_LABEL` and `HYGIENE_DIRECTIVE` remain directive-shaped | `dist/mcp-server/lib/render.js` exports inspected directly | Met | - |
| AC-003 | REQ-001 | Given the compiled module is unavailable, When a fallback emitter renders, Then it also omits both directives | Both mirrors edited; `plugin-bridge` and OpenCode plugin suites pass | Met | - |
| AC-004 | REQ-002 | Given any runtime, When a brief is delivered, Then the comment-hygiene directive is still present | Every delivery assertion re-pointed at hygiene and passing | Met | - |
| AC-005 | REQ-003 | Given the test suites, When they run against the pre-change code, Then they fail | Observed: 25 assertions failed before the tests were updated | Met | - |
| AC-006 | REQ-003 | Given a fixture that mutated directive text to simulate changed policy, When the text it mutated no longer exists, Then the fixture is re-pointed rather than left as a silent no-op | The dedup fixture rewrote governor text; repointed at surviving text, 26/26 pass | Met | - |
| AC-007 | REQ-004 | Given the injection catalog, When it is read, Then it describes one constant directive and records why two were retired | `.opencode/hooks/injection-contract.md` updated | Met | - |

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

AC-003 and AC-006 are the two that mattered. Both fallback emitters carry their own literal
copies of the directive text for when the compiled module is unavailable, so editing the
canonical owner alone would have left every runtime still injecting the directives on its
fallback path — the search had to cover literal text, not symbol names.

AC-006 caught a quieter failure. A lifecycle fixture built its "changed policy" case by rewriting
a phrase inside the governor directive. With that directive gone the rewrite became a no-op, the
two fixtures compared equal, and the test asserted a premise that no longer existed. It failed
loudly, which is the only reason it was found; a fixture that had degraded silently would have
kept passing while testing nothing.

Left in place: the comment-hygiene directive, which is a prohibition with a pre-commit gate behind
it rather than a disposition.
<!-- /ANCHOR:closure -->
