---
title: "Acceptance Criteria: Phase 13: addon-removal-and-speed-refinements"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "addon removal and speed refinements acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements"
    last_updated_at: "2026-10-26T07:30:00Z"
    last_updated_by: "conductor"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-013-addon-removal-and-speed-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 13: addon-removal-and-speed-refinements

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the add-on folder, When it is listed, Then it holds seven templates and no file under `.skilled` names a deleted one | `ls templates/addons/*.tmpl \| wc -l` prints 7; `rg -l 'before-after.md.tmpl\|roadmap.md.tmpl\|resource-map.md.tmpl' .skilled` prints nothing. Observed: 7; the `rg` over `.skilled .hermes README.md` exits 1 with no output | Met | - |
| AC-002 | REQ-002 | Given `create.sh`, When it scaffolds Levels 1, 2 and 3 with and without `--with-lazy-addons`, Then each packet passes strict validation | Six throwaway runs under `specs/zz-addon-check/`. Observed: all six printed `RESULT: PASSED` under `--strict --quiet`; track removed | Met | - |
| AC-003 | REQ-003 | Given the baselines, When both censuses rerun, Then every row matches when sorted | `diff` of the sorted before and after files prints nothing | Superseded | ADR-001 |
| AC-004 | REQ-004 | Given the deep-loop resource-map tests, When they run, Then they pass | `resource-map-extractor`, `fanout-root-resource-map`, `deep-research-reduce-state`. Observed: 4/4 and 32/32 passed | Met | - |
| AC-005 | REQ-005 | Given the card, When a model reaches the validate step, Then it runs one validate with `--quiet` and reruns without it only on FAILED | `rg -n -- '--quiet' spec-authoring-card.md` names the step; the card asks for one run. Observed: section 9, one validate run; check-card-sync prints "CARD SYNC OK" | Met | - |
| AC-006 | REQ-006 | Given a generated-metadata failure, When the validator prints its hint, Then the `--apply` command comes first and the hint names what it rewrites | The new hint test passes. Observed: repair-hint-order.vitest.ts, Tests 2 passed; `repair-derived.cjs --folder <f> --apply` prints first | Met | - |
| AC-007 | REQ-007 | Given a failing validate, When the card's fix step runs, Then it fixes every failing rule, reruns once and stops after three rounds | `rg -n 'every failing rule' spec-authoring-card.md` prints a line. Observed: a line in section 9, which also says "Stop after three rounds" | Met | - |
| AC-008 | REQ-008 | Given the spec and acceptance-criteria templates, When a model adds an id, Then a visible line says how ids are numbered, and the closure note forbids counts and id ranges | The golden snapshots and `template-fill-guidance.vitest.ts` pass. Observed: 36/36 passed; EXAMPLE_DRIFT_OK | Met | - |
| AC-009 | REQ-009 | Given the docs, When they list add-ons, Then none offers a deleted one | `rg -il 'before-after\.md\|roadmap\.md' .skilled README.md` lists no doc that offers them. Observed: prints nothing outside changelog/, runtime/data/ and fixtures/ | Met | - |
| AC-010 | REQ-003 | Given the baselines, When both censuses rerun, Then the six-rule census matches exactly and every strict-census change only removes errors or warnings, from a packet-root add-on file no template defines | six-rule diff printed nothing; strict diff: 2 rows, both fewer errors, both folders hold a root `resource-map.md`; see `decision-record.md` ADR-001 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence that names the criteria that carried the packet. GOOD: No. AC-002 is unmet. WEAK: Almost done. -->

**Closeable:** Yes

Yes. Every criterion is Met or Superseded by ADR-001.
<!-- /ANCHOR:closure -->
