---
title: "Acceptance Criteria: Phase 4: agent-template-conformance-and-drift-check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agent template conformance and drift check acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/004-agent-template-conformance-and-drift-check"
    last_updated_at: "2026-11-14T11:36:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-agent-template-conformance-and-drift-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: agent-template-conformance-and-drift-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/004-agent-template-conformance-and-drift-check
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an agent file with a required section renamed, When the check runs, Then it exits 1 and prints the agent and the section | The vitest cases `flags a missing section`, `flags a renamed section` and `flags an out-of-order section` pass, and `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given each block moved into a new section, When its text is compared before and after, Then only the heading line differs | `scratch/move-parity.md` lists each moved block with the result `identical apart from heading` | Unmet | - |
| AC-003 | REQ-003 | Given the edited canonical files, When the mirror check runs, Then every comparable copy is in sync | `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given the eleven agent files, When they are searched for the old section name, Then nothing matches and all eleven carry the new one | `rg -l -i '^## [0-9]+\. ROUTING SCAN' .skilled/agents` prints no path, and `rg -l '^## [0-9]+\. CAPABILITY SCAN' .skilled/agents` prints 11 paths | Unmet | - |
| AC-005 | REQ-005 | Given the eleven agent files, When they are searched for the section heading, Then all eleven carry it | `rg -l '^## [0-9]+\. HOOK-INJECTED CONTEXT ROUTING' .skilled/agents` prints 11 paths | Unmet | - |
| AC-006 | REQ-006 | Given the registry, When each exception is read, Then it names a template section and a reason | `node -e "const r=require('./.skilled/agents/agent-registry.json');process.exit(r.agents.every(a=>(a.templateExceptions ?? []).every(e=>e.section&&e.reason&&e.reason.length>20))?0:1)"` exits 0 | Unmet | - |
| AC-007 | REQ-007 | Given each agent file, When its own section references are listed, Then each one resolves to the intended section | `scratch/section-refs.md` lists every reference with the result `resolves` | Unmet | - |

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

No criterion has been verified yet, because this phase is planned and not implemented.
<!-- /ANCHOR:closure -->
