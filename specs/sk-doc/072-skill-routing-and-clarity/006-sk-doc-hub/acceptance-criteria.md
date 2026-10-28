---
title: "Acceptance Criteria: Phase 6: sk-doc hub and mode packets"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-doc hub and mode packets acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/006-sk-doc-hub"
    last_updated_at: "2026-10-28T13:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: sk-doc hub and mode packets

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/006-sk-doc-hub`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `parent-skill-check.cjs`, `package_skill.py --strict` and `compiled-route-guard.cjs` pass after the change. | At the final state all three pass: `parent-skill-check` on sk-doc prints `PASS: 12b-routing-shape: hub and 14 packet(s) follow the routing canon (0 known debt)` and `OK: parent-skill-check — all hard invariants passed, 0 warnings`; `package_skill.py --check --strict` prints `Result: PASS` for sk-doc and for each of the 14 packets; `compiled-route-guard.cjs --json` reports 7 of 7 `fresh`, failures 0. The full gate set is `scratch/after.md` §1. `scratch/after.md:28`, `scratch/after.md:53`, `scratch/after.md:124`, `scratch/after.md:126`, `scratch/after.md:132` | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: The separation rationale appears once, and every other copy links to it. | `rg -n "must not move into" .skilled/skills --glob 'SKILL.md'` finds nothing. The one full statement is the `### Why the leaf router stays in ROUTER.md` section of `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`, and the four hubs that used to restate it link to its anchor: `sk-doc`, `cli-external-orchestration`, `system-deep-loop` and `sk-design` `SKILL.md`. The line numbers are in `scratch/after.md` §6. `scratch/after.md:168`, `scratch/after.md:172`, `scratch/after.md:173`, `scratch/after.md:174`, `scratch/after.md:175` | Met | - |

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

Both criteria are Met with observed evidence from the final gate run.
<!-- /ANCHOR:closure -->
