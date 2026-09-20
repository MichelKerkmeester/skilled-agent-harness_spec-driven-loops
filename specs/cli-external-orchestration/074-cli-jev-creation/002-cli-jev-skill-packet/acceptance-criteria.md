---
title: "Acceptance Criteria: Phase 2: cli-jev skill packet"
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
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/002-cli-jev-skill-packet"
    last_updated_at: "2026-09-20T10:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet-authoring criteria against the authored files"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-002-cli-jev-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: cli-jev skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/074-cli-jev-creation/002-cli-jev-skill-packet
**Level:** 3
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the packet `SKILL.md`, When a reader asks what the mode does, Then it states in its opening sections that the mode returns a value and acts on nothing, and forbids `Write`, `Edit` and `Task` | `.skilled/skills/cli-external-orchestration/cli-jev/SKILL.md:45` — the "Transport, not executor" framing, and `:301` for the forbidden tool list | Met | - |
| AC-002 | REQ-002 | Given the declared rules, When the dispatch test suite runs its CI guard, Then all eight ids resolve to implemented checks and none is orphaned | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:37` — the CI GUARD test resolves every declared id | Met | - |
| AC-003 | REQ-002 | Given the eight rules, When their severities are read, Then a violation that yields a wrong answer or a hang blocks, and one with a legitimate variant advises | `.skilled/skills/cli-external-orchestration/cli-jev/SKILL.md:10` through `:38` — six `severity: error`, two `severity: warn` | Met | - |
| AC-004 | REQ-003 | Given the four references, When each is opened, Then it carries a four-part version in frontmatter | `.skilled/skills/cli-external-orchestration/cli-jev/references/cli-reference.md:1` | Met | - |
| AC-005 | REQ-003 | Given a reference claim, When it is compared to phase 001's evidence, Then it traces to a probe or is marked source-read | `../001-jev-contract-research-and-pin/scratch/probe-matrix.txt:28` — the matrix the exit table is built from | Met | - |
| AC-006 | REQ-004 | Given the MCP reference, When a reader considers wiring it, Then the document names the step as an operator action and states that no repository config carries it | `.skilled/skills/cli-external-orchestration/cli-jev/references/mcp-server.md:1` | Met | - |
| AC-007 | REQ-005 | Given the packet layout, When it is compared to the hub's other modes, Then `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/` and `changelog/` are all present | `.skilled/skills/cli-external-orchestration/cli-jev/SKILL.md:1`, `README.md:1`, `references/cli-reference.md:1`, `assets/question-shaping-card.md:1`, `manual-testing-playbook/manual-testing-playbook.md:1` and `changelog/v1.0.0.0.md:1` all resolve under the mode folder | Met | - |

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

AC-002 carried the packet. A packet whose rules have no implementations reads as enforcement and provides none, and the guard that compares declared ids against implemented checks is what keeps the two from drifting. Deliberately out of scope: registration and the enforcement wiring itself, which is phase 003's, and the feature catalog and scenario files, which are phase 004's.
<!-- /ANCHOR:closure -->
