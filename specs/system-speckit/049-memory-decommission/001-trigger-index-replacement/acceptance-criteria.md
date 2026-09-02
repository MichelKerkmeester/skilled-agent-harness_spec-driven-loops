---
title: "Acceptance Criteria: Phase 1: trigger-index-replacement"
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
    packet_pointer: "system-speckit/049-memory-decommission/001-trigger-index-replacement"
    last_updated_at: "2026-09-02T11:04:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs"
      - ".opencode/skills/system-spec-kit/data/trigger-index.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: trigger-index-replacement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-memory-decommission/001-trigger-index-replacement
**Level:** 3
**Status:** Draft
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the frozen prompt set, When each prompt is resolved through both the live `exactTriggerSearch` lane and `trigger-index.json`, Then the index result set contains every path the live lane returned | `node scripts/retrieval/parity-check.mjs` reports `missing: 0`; report committed at `fixtures/parity-baseline.json` | Unmet | - |
| AC-002 | REQ-002 | Given a generated `trigger-index.json`, When the generator is run a second time with no corpus change, Then the artifact is byte-identical | `node generate-trigger-index.mjs && git diff --exit-code .opencode/skills/system-spec-kit/data/trigger-index.json` exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given a fresh clone with no build step and no running daemon, When Gate 1 resolves a prompt, Then the index is present and readable from the working tree | `git ls-files` lists the artifact; lookup succeeds in a clean checkout | Unmet | - |
| AC-004 | REQ-004 | Given no daemon, no database and no network, When the generator runs, Then it completes successfully | generation run with the MCP server stopped; exit status 0 read | Unmet | - |
| AC-005 | REQ-005 | Given `retrieval-conventions.md`, When a reader looks up the replacement for `memory_search`, `memory_context` or `memory_quick_search`, Then each has a concrete ripgrep invocation that can be pasted and run | doc inspection; each invocation executed once and its output observed | Unmet | - |
| AC-006 | REQ-006 | Given a document with a malformed `trigger_phrases` block, When the generator runs, Then it reports that document by path rather than skipping it silently | unit test over a malformed fixture; reported count recorded in the baseline | Unmet | - |
| AC-007 | REQ-007 | Given a cold Node start, When a single prompt is resolved against the index, Then it completes in under 200ms | timed run, baseline and measurement both recorded | Unmet | - |
| AC-008 | SC-003 | Given the `system-spec-memory` daemon is stopped, When a session exercises Gate 1, Then trigger matching still returns results | manual session run with the server stopped | Unmet | - |

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

Written at closure, not before. AC-001 and AC-008 are the rows that decide this
phase: parity with the live lane, and Gate 1 surviving without the daemon.
<!-- /ANCHOR:closure -->
