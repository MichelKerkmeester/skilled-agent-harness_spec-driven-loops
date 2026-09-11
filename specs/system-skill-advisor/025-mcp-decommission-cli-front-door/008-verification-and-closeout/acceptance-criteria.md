---
title: "Acceptance Criteria: Phase 8: verification-and-closeout"
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
    packet_pointer: "scaffold/008-verification-and-closeout"
    last_updated_at: "2026-09-11T06:49:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: verification-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 025-mcp-decommission-cli-front-door/008-verification-and-closeout
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When recursive strict validate runs over the packet, Then every folder prints RESULT: PASSED | 11 folders, all PASSED, exit 0, zero errors | Met | - |
| AC-002 | REQ-002 | Given each of the five runtime configs, When searched for an advisor server declaration, Then none is found | Zero references in opencode.json, .claude/mcp.json, .codex/config.toml, .cursor/mcp.json, .pi/mcp.json | Met | - |
| AC-003 | REQ-003 | Given the advisor package, When searched for MCP SDK importers, Then none remain in source | Zero source importers; the single hit is a transitive lock entry from the shared workspace | Met | - |
| AC-004 | REQ-004 | Given the CLI front door, When each capability is invoked, Then all nine answer and mutations fail closed | Nine commands listed; apply without --trusted returns a dry run that applied nothing | Met | - |
| AC-005 | REQ-005 | Given a runtime with no advisor MCP server, When a prompt is submitted, Then the brief arrives unprompted in all three daemon states | Warm and cold both render a route; unreachable renders a degraded line | Met | - |
| AC-006 | REQ-006 | Given the phase 2 budget, When the prompt path is measured from the final state, Then the delta is reported and inside it | CLI warm 736 ms vs 1,100; hook warm 819 ms vs 2,096; cold 1,566-1,812 vs 3,500. latency-delta.md | Met | - |
| AC-007 | REQ-007 | Given every live instruction surface, When searched for the retired transport or directory, Then none presents the advisor as an MCP server | 87 live files at first measurement, now zero; 24 historical files keep the old name by design | Met | - |
| AC-008 | REQ-008 | Given the final state, When the advisor suite runs, Then no failure is introduced by this packet | 860 passed, 5 failed, 7 skipped of 872; all 5 fail identically on the pre-change baseline, which fails 8 | Met | - |

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

The residue criterion carried this packet: it was the only one that failed when
first measured, at 87 live files, and closing it took a sweep, a regenerated
trigger index and a hand-corrected allowlist. Left out consciously: the P2
naming residue in the plugin's timeout variable, because it is operator-set and
renaming it would change operator-visible behaviour that this packet's second
decision forbids; and the stress-test tree, which runs in no suite on the
pre-change branch either.
<!-- /ANCHOR:closure -->
