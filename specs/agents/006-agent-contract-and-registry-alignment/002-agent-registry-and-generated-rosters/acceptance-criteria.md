---
title: "Acceptance Criteria: Phase 2: agent-registry-and-generated-rosters"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agent registry and generated rosters acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/002-agent-registry-and-generated-rosters"
    last_updated_at: "2026-11-14T11:36:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-agent-registry-and-generated-rosters"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: agent-registry-and-generated-rosters

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-agent-contract-and-registry-alignment/002-agent-registry-and-generated-rosters
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the registry and the agents directory, When the check runs, Then it exits 0 only if the two name the same eleven agents | `node .skilled/bin/sync-agent-roster.cjs --check` exits 0, and the vitest case that removes one record exits 1 naming the agent. Observed 2026-11-14: the check printed `agent-roster: OK` and exited 0, and the case `fails when a registry record is removed` passed | Met | - |
| AC-002 | REQ-002 | Given the generated `orchestrate.md`, When it is searched for the two agents, Then each appears in all three rosters | `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more, and `rg -c '@prompt-improver' .skilled/agents/orchestrate.md` prints 3 or more. Observed 2026-11-14: both counts printed 3 | Met | - |
| AC-003 | REQ-003 | Given a generated block, When one row is changed by hand and the check runs, Then it exits 1 and prints the block's name | The vitest case `rejects a hand-edited block` passes. Observed 2026-11-14: the case passed, 4 of 4 tests passed | Met | - |
| AC-004 | REQ-004 | Given the regenerated canonical file, When the mirror check runs, Then every comparable copy is in sync | `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0. Observed 2026-11-14: the check printed `11 agent(s) checked — all comparable mirrors in sync — OK` and exited 0 | Met | - |
| AC-005 | REQ-005 | Given `README.txt`, When the check runs after the registry gains a twelfth test record, Then it exits 1 until the block is regenerated | The vitest case `flags a stale README roster` passes. Observed 2026-11-14: the case passed | Met | - |
| AC-006 | REQ-006 | Given the workflow file, When it is read, Then one step runs the roster check | `rg -c 'sync-agent-roster.cjs --check' .github/workflows/agent-mirror-sync.yml` prints 1. Observed 2026-11-14: the count printed 1 | Met | - |
| AC-007 | REQ-007 | Given the registry, When each record's dispatchers are read, Then none is empty | `node -e "const r=require('./.skilled/agents/agent-registry.json');process.exit(r.agents.every(a=>a.dispatchers.length)?0:1)"` exits 0. Observed 2026-11-14: the command exited 0 | Met | - |
| AC-008 | REQ-008 | Given the registry and the agent files, When each tier is compared with the file's nesting section, Then they agree | `scratch/tier-parity.md` lists eleven rows, each ending `agrees`. Observed 2026-11-14: eleven rows, each ending `agrees` | Met | - |

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

All eight criteria are `Met`, each with the output observed on 2026-11-14.
<!-- /ANCHOR:closure -->
