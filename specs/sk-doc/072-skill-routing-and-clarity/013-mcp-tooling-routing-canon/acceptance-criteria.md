---
title: "Acceptance Criteria: Phase 13: mcp-tooling-routing-canon"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "mcp tooling routing canon acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/013-mcp-tooling-routing-canon"
    last_updated_at: "2026-10-29T06:49:04Z"
    last_updated_by: "claude-opus"
    recent_action: "Met every criterion with the gate and suite evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-tooling/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0268-mcp-tooling-routing-canon"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: mcp-tooling-routing-canon

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 013-mcp-tooling-routing-canon
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When every SKILL.md under `.skilled/skills` outside archives, fixtures, templates and assets is scanned for a `## MACHINE ROUTER` heading, Then none lacks one | The scan prints 54 files and 0 without the section; `grep -c "MACHINE ROUTER" .skilled/skills/mcp-tooling/SKILL.md` prints 2 (`scratch/after.txt`) | Met | - |
| AC-002 | REQ-002 | Given the hub SKILL.md from `origin/main`, When the new `validate_routing_shape` reads it, Then it returns the RS-005 finding, and the new file returns none | `scratch/after.txt` records both results | Met | - |
| AC-003 | REQ-002 | Given a fixture with no MACHINE ROUTER section, When each suite runs, Then the Python and JS checks both report RS-005 alone | `pytest .skilled/skills/sk-doc/scripts/tests/` prints 270 passed; `node --test parent-skill-check-routing-shape.test.cjs` prints pass 1 fail 0 | Met | - |
| AC-004 | REQ-003 | Given the canon docs and the `/create:skill` assets, When they are searched for the old code range, Then none remains | `rg 'RS-001 to RS-004' .skilled` prints nothing | Met | - |
| AC-005 | REQ-004 | Given mcp-tooling, sk-create-skill and the sk-doc hub, When each newest changelog is compared with its carriers, Then the versions match and each entry validates | 1.9.2.0, 1.7.6.0 and 2.3.30.0; `validate_document.py` reports 0 issues on each | Met | - |
| AC-006 | REQ-001 | Given the final tree, When the 38-gate set runs, Then every gate exits 0 | `.scratch-dc90/268-gates.txt` | Met | - |

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

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
