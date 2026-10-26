---
title: "Acceptance Criteria: Phase 14: removed-template-reality-sweep"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "removed template reality sweep acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/014-removed-template-reality-sweep"
    last_updated_at: "2026-10-26T11:50:29Z"
    last_updated_by: "conductor"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Run strict validate on this folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-014-removed-template-reality-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 14: removed-template-reality-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/014-removed-template-reality-sweep
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the mention sweep reruns outside `specs/**`, `changelog/`, the generated trigger index and fixtures, Then no README, skill doc, command, agent, mirror or comment presents before-after, roadmap or resource-map as a spec-kit template or add-on | The `rg` commands in `scratch/audit-mentions.md`, rerun, list zero stale hits; `rg -n 'the addon' .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` prints nothing. Observed: the final sweep printed 10 hits, all judged fine; the `the addon` `rg` printed nothing, exit 1 | Met | - |
| AC-002 | REQ-002 | Given `templates/addons/` and `create.sh`, When the reality sweep reruns, Then every doc that states the add-on set, the template total or what `--with-lazy-addons` adds matches them | `ls .skilled/skills/system-spec-kit/templates/addons/*.tmpl \| wc -l` prints 7, and the add-on rows in `scratch/audit-reality.md`, rerun, list zero contradictions. Observed: `ls templates/addons` lists 7 files; H1 and H2 fixed the add-on, total and decision-record rows; the final sweep printed no stale hit | Met | - |
| AC-003 | REQ-003 | Given the card, `orchestrator.ts` and the templates, When the reality sweep reruns, Then every doc that describes the validate step, the repair hint or id numbering matches them | The validate, repair-hint and id rows in `scratch/audit-reality.md`, rerun, list zero contradictions. Observed: H3 fixed the validate cadence; the card section 10 line now cites the `--quiet` run; the /speckit per-step gate stays by decision, and `SKILL.md` line 61 says so; `check-card-sync.sh` prints `CARD SYNC OK` | Met | - |
| AC-004 | REQ-004 | Given the fixes, When the Hermes check runs, Then the Hermes copies match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Observed: `PASS: 67` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Both sweeps reran clean from the final tree and the Hermes check passed.
<!-- /ANCHOR:closure -->
