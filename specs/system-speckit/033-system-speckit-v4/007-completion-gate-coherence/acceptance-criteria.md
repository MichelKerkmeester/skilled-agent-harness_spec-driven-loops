---
title: "Acceptance Criteria: One Validation Verdict, Honestly Earned"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "validation gate acceptance criteria"
  - "closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/040-validation-gate-coherence"
    last_updated_at: "2026-08-29T16:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-040"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: One Validation Verdict, Honestly Earned

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/040-validation-gate-coherence
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet, When it is validated under any supported engine selection, Then the verdict is the same | One engine remains, so the selection cannot vary. The replacement front-end was measured against the original across 120 packets with identical exit statuses | Met | - |
| AC-002 | REQ-001 | Given the two engines before the change, When a sample is validated under each, Then the disagreement is measured rather than assumed | 48 of 150 packets disagreed, in four signatures, each traced to a named cause before any code changed | Met | - |
| AC-003 | REQ-002 | Given the freshness rule, When any validator invokes it, Then one place decides whether it applies | Decided at the rule's own entry point; the rule's logic stays unguarded so it remains directly testable | Met | - |
| AC-004 | REQ-003 | Given a validation result, When a reader looks at it, Then the engine that produced it is named | `Engine:` line in text output and an `engine` field in JSON, both covered by tests | Met | - |
| AC-005 | REQ-004 | Given a packet, When the gate runs, Then no rule asks a question the packet cannot answer from inside itself | The command-tree comparison runs as its own repository check; three CI runs have passed since | Met | - |
| AC-006 | REQ-005 | Given a document that does not follow its template, When the gate reports it, Then one fault produces one finding | Superseded: the premise that the two rules always co-occur was measured and refuted, so merging them would hide a fault | Superseded | ADR-001 |
| AC-007 | REQ-006 | Given a validation path that cannot execute, When the surface is reviewed, Then it is removed rather than left in place | The shell rule engine, a duplicate rule, an expired grandfather path, and a stale hardcoded child list are gone; that list had been limiting one packet to 9 of its 25 children | Met | - |
| AC-008 | REQ-007 | Given the deletion of an engine, When the surviving engine runs, Then no check that reports a real fault is weakened | Two checks existing only in the removed engine were ported first and produce identical findings; the title check is deliberately stricter and rejects nothing in the corpus | Met | - |
| AC-009 | REQ-007 | Given a caller narrowing the run to a named subset, When a name is not recognised, Then the gate refuses rather than passing | An unknown name exits 1 naming it. Before the fix a typo reported `PASSED` for a packet no rule had examined | Met | - |
| AC-010 | REQ-007 | Given a restored check that would newly fail packets, When it lands, Then the surfaced faults are repaired rather than left to erode trust in the gate | 384 titles corrected, derived metadata re-derived; those packets went from 243 passing to 286 | Met | - |
| AC-011 | REQ-006 | Given the change set, When the repository's validation suites run, Then they are not left worse than they were | Measured as a delta against the previous commit. The chained suite that had stopped running entirely now runs: 96, 39 and 121 cases | Met | - |
| AC-012 | REQ-007 | Given a mass re-derive of packet metadata, When it completes, Then the corpus matches what the derivation produces | A specs-root lookup recognising only the pre-move layout had dropped repository-relative key files on every save since packets moved. Comparing every packet against the shipped derivation reached zero divergence over 617 packets and 2272 recovered entries. The first audit reported far less because it re-implemented the extractor instead of calling it | Met | - |
| AC-013 | REQ-007 | Given the derived key-file list is capped, When declared entries are admitted, Then what they displace is stated rather than described as lossless | Re-deriving evicts 47 entries that still exist, on the 50 packets that land at the twenty-entry cap, against 2272 recovered. Every candidate in the list already exists on disk, so this is priority between real files — a declaration outranks a name guessed from prose — not the loss of a live reference | Met | - |

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

The packet turned on AC-002 and AC-008. Measuring the two engines before
deleting either one is what turned a deletion into a port-then-delete: the
engine that looked redundant was making two checks the survivor had quietly
stopped making, and deleting it first would have been a silent reduction
described as a simplification.

AC-009 and AC-012 were found by review after the work shipped, and both were
worse than anything found before it: a gate that reported a clean pass for a
packet nothing had examined, and a mass re-derive that stripped the graph of the
links that make it worth traversing. Both are fixed and covered by tests.

Left out deliberately: 21 packets carry checklist fingerprints that were stale
before this work, and refreshing them would attest to verification nobody re-ran.
The aggregate description index is likewise left stale rather than regenerated,
because its refresh sweeps in unrelated packets.

Known and unfixed, each measured rather than assumed:

- The derivation reads `key_files` from `spec.md` only. Other canonical
  documents declare far more, and 369 packets name a real file in one of them
  that never reaches the graph. This predates the work here and is a coverage
  gap, not a regression.
- The containment guard rejects a declaration by looking for parent segments in
  the string rather than by resolving it. Of 338 such declarations, none escape
  the repository and 152 name a real file, mostly sibling phases in the same
  tree. The argument that admitted declared entries applies here too; expanding
  it was judged a separate change.
- One archived packet declares a bare `SKILL.md` that resolves, through a
  workspace-root fallback, to a different skill's file. The fallback roots make
  "resolves to something" a weak proxy for "is what the author meant".
<!-- /ANCHOR:closure -->
