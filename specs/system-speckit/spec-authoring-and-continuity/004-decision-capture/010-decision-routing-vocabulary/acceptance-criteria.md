---
title: "Acceptance Criteria: Phase 10: decision-routing-vocabulary"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "decision routing vocabulary acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/010-decision-routing-vocabulary"
    last_updated_at: "2026-11-03T11:00:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Marked every criterion Met with live-index evidence"
    next_safe_action: "Commit only the system-spec-kit part of the re-exported graph"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: decision-routing-vocabulary

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `010-decision-routing-vocabulary`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given system-spec-kit's metadata, When `jq '.intent_signals \| length'` and a `jq -r '.intent_signals[]' \| rg -cx` count for the four phrases run, Then they print 35 and 4, and `rg -x decision` over the list prints nothing | 2026-11-03: `jq` printed 35, the four-phrase count printed 4, and `rg -x decision` printed nothing (exit 1) | Met | - |
| AC-002 | REQ-002 | Given the router, When `rg -n '"DECISION"'` and `rg -n '^- \*\*DECISION\*\*'` run on `ROUTER.md` and `sk-skill-check.cjs check system-spec-kit` runs, Then they print two lines and one line, and C7 reports 22 intent signal groups and 22 resource-map entries with `Result: PASS` | `rg` printed `ROUTER.md:182` and `ROUTER.md:289` for DECISION and `ROUTER.md:58` for the bullet; C7 PASS with 22 intent signal groups and 22 resource-map entries, `Result: PASS` | Met | - |
| AC-003 | REQ-003 | Given a live index after the export and `advisor_rebuild`, When `advisor_recommend` runs for "Record my chat reply as a decision" and for "record this as a decision", Then each lists `system-spec-kit` first at confidence 0.8 or higher and uncertainty 0.35 or lower, with `"freshness":"live"` | Live lines: "Record my chat reply as a decision" gives `system-spec-kit` 0.8301, uncertainty 0.12; "record this as a decision" gives `system-spec-kit` 0.8461, uncertainty 0.16 | Met | - |
| AC-004 | REQ-004 | Given the live pre-change control from T002, When `advisor_recommend` runs for "decision tree", "colour decision", "decision branch" and "architecture decision" after the change, Then each returns the same ordered skill list as its control line | Control and post-change lines match: decision tree sk-design 0.82; colour decision sk-design 0.8461; decision branch sk-git 0.9365 then sk-design 0.8416; architecture decision sk-design 0.82 | Met | - |
| AC-005 | REQ-005 | Given the re-exported graph, When `skill-graph-freshness.cjs --strict` runs, Then it exits 0 and prints `STALE COMPILED: none` and `SIGNAL DRIFT compiled vs disk: none` | Exit 0 with `STALE COMPILED: none` and `SIGNAL DRIFT compiled vs disk: none`, rerun at close-out | Met | - |
| AC-006 | REQ-006 | Given the regenerated Hermes copy, When `sync-skills-hermes.cjs --check` and `sk-skill-check.cjs check system-spec-kit` run, Then the first prints `PASS` and the second reports C9 PASS | `PASS: 65 Hermes skill copies in sync`, exit 0; C9 PASS with every mirror pass | Met | - |
| AC-007 | REQ-007 | Given a live advisor, When `ci-router-vocabulary-reach.cjs --skill system-spec-kit` runs, Then no `wrong-hub`, `outranked` or `probe-error` row names any of the four new phrases | Live run at generation 2143 with probe-error 0: no row names any of the four phrases. The overall `RESULT: FAILED` comes from older phrases, recorded in `implementation-summary.md` Known Limitations | Met | - |
| AC-008 | REQ-008 | Given the edited router, When `check-card-sync.sh` and `generate-leaf-manifest.cjs --check .skilled/skills/system-spec-kit` run, Then they print `CARD SYNC OK` and `leaf-manifest.json OK` | `CARD SYNC OK`, exit 0; `leaf-manifest.json OK (1fbc9550...)`, exit 0 | Met | - |

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

Every criterion is Met on a live advisor index, checked 2026-11-03.
<!-- /ANCHOR:closure -->
