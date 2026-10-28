---
title: "Acceptance Criteria: Phase 4: Single vocabulary source per hub"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "single vocabulary source per hub acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/004-single-vocabulary-source"
    last_updated_at: "2026-10-28T06:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor review and landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: Single vocabulary source per hub

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/004-single-vocabulary-source`
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
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: For every hub, one file is named the authored vocabulary and a check fails when a copy disagrees with it. | `ci-hub-vocabulary-source.cjs` names `hub-router.json` `vocabularyClasses` for all 7 hubs and passes on the real files (drift 0, exit 0). Copies of the real mcp-tooling files, each broken on one leg (alias, stage-two, triggers), fail with exit 1. The test passes 7/7. psc 5k-alias now fails on any hub. `scratch/after.md` §2 | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: `compiled-route-guard.cjs --json` reports every hub fresh after the change. | 7 of 7 `fresh`, failures 0, after all seven were re-minted; `compiled-route-sync --check` 55 of 55 match. `scratch/after.md` §1 | Met | - |
| AC-003 | REQ-003 | Given the phase is implemented, When its gates run, Then: The router-reach doctor workflow reports no new WRONG-HUB or OUTRANKED phrase against the phase 002 baseline. | Router reach: wrong-hub 0, outranked 0, no-reach 0 across 717 probed phrases (baseline 0, 0, 0 across 510). Of the 11 phrases newly probed that failed at interim, 5 were removed and 6 two-hub disputes were allowlisted with both hubs pinned (allowed 3 to 9). `scratch/after.md` §3 | Met | - |
| AC-004 | REQ-004 | Given the phase is implemented, When its gates run, Then: the 62, 36 and 17 drift terms from phase 002 are closed. | Check legs at 0 for mcp-tooling, cli-external-orchestration and sk-doc. mcp-tooling: 59 carried, 3 removed. cli-external-orchestration: 34 carried, 2 removed. sk-doc: all 17 added to `hub-router.json`. `make a docx diff of these` now routes to sk-create-diff. `scratch/after.md` §2 | Met | - |

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

All four criteria are Met with observed evidence from the final gate run.
<!-- /ANCHOR:closure -->
