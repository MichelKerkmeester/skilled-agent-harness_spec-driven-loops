---
title: "Acceptance Criteria: Closure and routing proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-phase-4-provide-descriptive-slug"
    last_updated_at: "2026-09-06T13:52:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Closure and routing proof

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a daemon that serves its previous generation until rebuilt, When any routing claim is made, Then the rebuild happened first and the generation was observed to move | `generationBefore: 632 -> generationAfter: 633`, and again `637 -> 638` after the edge repair, from the rebuild's own output | Met | - |
| AC-002 | REQ-002 | Given the sixteen-phrase baseline, When it is replayed from the closing state, Then no phrase reaches nobody, chart and diagram name `sk-design`, and the three `sk-doc` controls are unchanged | `scratch/routing-after-005.txt` at generation 638: 0 phrases reach nobody against 4 at the baseline; `write a readme for this package` 0.95, `build a feature catalog` 0.82, `create a repo rule file` 0.9405, all byte-identical to baseline | Met | - |
| AC-003 | REQ-003 | Given gates that can report success in an exit code and failure in their output, When each is run, Then its output is read and `--strict` is used where offered | Two gates caught exactly this way: `validate-playbook-topology` printed `verdict=FAIL` while exiting 0, and `skill_graph_validate` reported `isValid: true` while the builder rejected 4 edges per run | Met | - |
| AC-004 | REQ-004 | Given a defect the measurements prove, When it lies inside this packet's blast radius, Then it is repaired and re-measured; when it does not, it is named with its cause and its owner | Repaired: 4 dangling edges (`rejectedEdges` 4 to 0, indexed edges 50 to 52) and 2 stale derived blocks (13 fresh, 0 stale). Named, not repaired: 4 blocked FLOWCHART fixtures in `sk-doc`'s playbook, and `SD-CR-001` failing since 2026-09-02 | Met | - |
| AC-005 | REQ-005 | Given documents describing the old fleet shape, When each is checked against the live audit, Then none still describes `sk-design` as standalone or `sk-doc` as the home of chart and diagram | `skill-root-metadata-contract.md` fleet table rewritten to the audit's own output (6 H / 7 S), which also corrected a third error nobody had reported: `sk-prompt` was listed class H and is class S. `parent-skills-nested-packets.md` extension matrix row restored to `sk-design` | Met | - |
| AC-006 | REQ-006 | Given `016`, whose hub decision this packet reverses, When it is read from its own side, Then it records the partial supersession without its reasoning being rewritten | `specs/sk-design/016-deprecate-sk-design-interface/spec.md`: Status and Successor rows updated, a supersession note added after the metadata anchor, and the original reasoning left as written. `validate.sh --strict` on `016`: `RESULT: PASSED`, 8 folders | Met | - |
| AC-007 | REQ-004 | Given `sk-doc`'s typed-gold playbook gate, When it is run with `--strict`, Then it passes | `verdict=FAIL valid=28 blocked=4`, exit 1. Four fixtures assert `sk-doc` owns FLOWCHART, which phase 004 made false. Three would validate under `sk-design`, which has no hub playbook root; the fourth pairs a `sk-doc` mode with a `sk-design` mode and validates under neither, since the gate is per-hub by design. Every path forward deletes tracked coverage, fabricates a scenario under an id already published in benchmark reports, or splits a corpus mid-benchmark | Superseded | ADR-003 |

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

AC-003 carried this phase. Every finding it produced came from reading a gate's output rather than
its exit code, and two of the three defects were invisible to the validator nominally responsible for
them. AC-007 is `Superseded` rather than `Met` or `Waived`: the gate is genuinely red, the cause is
this packet's, and the fix belongs to whoever owns a benchmark corpus keyed to reports from
2026-07-21. It is recorded as an open item on the parent, not closed here.
<!-- /ANCHOR:closure -->
