---
title: "Acceptance Criteria: Phase 7: sk-design and system-deep-loop hubs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-design and system-deep-loop hubs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/007-sk-design-and-deep-loop-hubs"
    last_updated_at: "2026-10-28T14:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: sk-design and system-deep-loop hubs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/007-sk-design-and-deep-loop-hubs`
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
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `parent-skill-check.cjs`, `package_skill.py --strict` and `compiled-route-guard.cjs` pass for both hubs. | At the final state all three pass. `parent-skill-check` on sk-design prints `PASS: 12b-routing-shape: hub and 4 packet(s) follow the routing canon (0 known debt)` and on system-deep-loop `hub and 3 packet(s) ...`, with `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exit 0 on both. `package_skill.py --check --strict` prints `Result: PASS`, exit 0, on all nine files, the two hubs and the seven packets. `compiled-route-guard.cjs --json` reports seven hubs `fresh` and `failures: 0`, and `compiled-route-sync.cjs --check` reports all 55 served copies matching. The full gate set is `scratch/after.md` §1, 39 of 39 at exit 0. `scratch/after.md:73`, `scratch/after.md:81`, `scratch/after.md:86`, `scratch/after.md:99`, `scratch/after.md:149` | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: Both hubs use the one no-match name. | Both hubs already used it at the baseline, so the phase kept it rather than making a change. A scan of the nine files for `UNKNOWN_*`, `NO_MATCH*` and `FALLBACK_*` finds `UNKNOWN_FALLBACK` and `UNKNOWN_FALLBACK_CHECKLIST` and nothing else, at `HEAD` and in the final tree. `scratch/before.md` §4 records the baseline reading. No renamed outcome appears anywhere in the phase diff. `scratch/before.md:35`, `scratch/before.md:37` | Met | - |

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

Both criteria are Met with observed evidence from the final gate run. AC-002 was already true when the phase started, and the record says so rather than claiming a change.
<!-- /ANCHOR:closure -->
