---
title: "Acceptance Criteria: Phase 17: fleet-front-door-stdin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fleet front door stdin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/017-fleet-front-door-stdin"
    last_updated_at: "2026-11-24T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built and verified the fleet stdin front door"
    next_safe_action: "Triage the generation-4 P2 findings in phase 018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-fleet-front-door-stdin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: fleet-front-door-stdin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 017-fleet-front-door-stdin
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the `.skilled` tree, When the grep for `--prompt "<task>"` runs outside changelogs and benchmarks, Then nothing matches | Empty output after 32 lines at HEAD | Met | - |
| AC-002 | REQ-002 | Given a heredoc task holding `"`, `$(touch <file>)` and a backtick, When each of the eight hubs routes it, Then each prints a decision and no file appears | Eight JSON decisions; `ls` reports no such file | Met | - |
| AC-003 | REQ-003 | Given the sk-doc scaffold, When its tests run, Then they pass | pytest 462 passed; parity test exit 0 | Met | - |
| AC-004 | REQ-004 | Given the re-minted manifests, When the guard and the sync check run, Then all hubs are fresh and all copies match | 8 `ok: true`; "all 61 served copies match their authored files" | Met | - |
| AC-005 | REQ-005 | Given the final state, When the hub checks, canaries and bin suite run, Then each passes | `parent-skill-check` OK on eight hubs; `canary=0` on eight; bin 197 of 197 | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
