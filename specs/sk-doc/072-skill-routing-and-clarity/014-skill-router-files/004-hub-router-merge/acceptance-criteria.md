---
title: "Acceptance Criteria: Phase 4: hub-router-merge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub router merge acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge"
    last_updated_at: "2026-10-29T09:04:16Z"
    last_updated_by: "pi"
    recent_action: "Authored the criteria for the planned hub router merge"
    next_safe_action: "Start the phase once 002 and 003 land, then capture the before projections"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/SKILL.md"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: hub-router-merge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-hub-router-merge
**Level:** 1
**Status:** Draft
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When each of the seven hub SKILL.md files is scanned for a MACHINE ROUTER mention, Then none holds one, and each carries the pointer line at the end of SMART ROUTING | `grep -c 'MACHINE ROUTER' .skilled/skills/sk-doc/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-doc/SKILL.md` prints 1, and the same checks on the other six hubs print 0 and 1 | Unmet | - |
| AC-002 | REQ-002 | Given the seven root `ROUTER.md` files, When the machine section of each is hashed after the move, Then every hash equals its pre-move value | `diff scratch/machine-sections-before.txt scratch/machine-sections-after.txt` prints nothing | Unmet | - |
| AC-003 | REQ-002 | Given the replay command, When it runs after the last edit, Then every line matches the capture taken before the first edit | `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing | Unmet | - |
| AC-004 | REQ-003 | Given a fixed prompt per hub, When `compiled-route.cjs` runs on both sides, Then `action`, `selectionKind` and `targets` match and only the policy hash and generation differ | `scratch/routes-before.txt` and `scratch/routes-after.txt` agree on the three fields for all seven hubs | Unmet | - |
| AC-005 | REQ-004 | Given the refreshed manifests, When the guard runs, Then it reports every hub fresh | `node .skilled/bin/compiled-route-guard.cjs` prints seven `fresh` lines and exits 0 | Unmet | - |
| AC-006 | REQ-005 | Given each hub root, When the per-hub check runs with that path, Then it passes with zero warnings | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK`, and the same command on the other six hub paths prints `OK` | Unmet | - |
| AC-007 | REQ-006 | Given the routing suites, When they run on the final tree, Then none reports a failure | The pytest and `node --test` runs named in `plan.md` report no failure and their counts are recorded in `scratch/` | Unmet | - |
| AC-008 | REQ-007 | Given the seven touched hubs, When each per-hub check runs, Then 13a and 13b pass on every hub | The seven `parent-skill-check.cjs` runs print PASS on 13a and 13b | Unmet | - |

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

Every criterion is unmet because the phase has not started. AC-003 decides closure first, since a shifted replay line means the move changed a route.
<!-- /ANCHOR:closure -->
