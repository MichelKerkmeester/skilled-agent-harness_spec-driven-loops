---
title: "Acceptance Criteria: Phase 2: gate-a-signal-closure"
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
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-03T22:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed AC-003 against a fresh sweep at HEAD"
    next_safe_action: "Hand the sk-doc activation-pin defect to its owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-rerun-2026-09-03.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: gate-a-signal-closure

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/002-gate-a-signal-closure
**Level:** 3
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given every declared signal across five hubs, When each is measured through the daemon, Then each lands in exactly one bucket | Re-checked 2026-09-02: `awk -F'\t' 'NR>1{print $NF}' research/gate-a-raw.tsv \| sort \| uniq -c` covers all 444 data rows, and every row carries one of the five bucket values. Last data row at `research/gate-a-raw.tsv:445` | Met | |
| AC-002 | REQ-002 | Given the headline count, When it is re-derived from the raw file by a second method, Then both agree | An independent pass over `gate-a-raw.tsv` returns 234 RESOLVED of 444, matching the total at `research/gate-a-measurement.md:5` | Met | |
| AC-003 | REQ-003 | Given an unresolved signal, When the phase closes, Then it resolves to one mode or is retired with the choice recorded | Re-swept 2026-09-03 at HEAD `fe1ec30fe8` over 389 declared signals, captured in `research/gate-a-rerun-2026-09-03.tsv` with all 389 calls at exit 0. Holding the stale sk-doc activation pin aside, the unresolved set is the same 50 signals as the 2026-09-02 capture, member for member, in the same four buckets. `research/unresolved-signal-decisions.md` records a decision for all 50 in twelve groups, each verified against the file implementing its mechanism. An exact-set check confirms every unresolved signal is claimed by exactly one group, with no duplicate and no gap. Decision table at `research/unresolved-signal-decisions.md:124`, outcome tally at `research/unresolved-signal-decisions.md:164` | Met | |

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

All three rows are Met. The sweep covered every declared signal, its headline was re-derived
by a second method rather than trusted, and the fifty signals that do not resolve now each
carry a decision with the mechanism that produced them.

The decisions are not uniform, which is the point of writing them down. Twenty-one are correct
as they stand: nineteen are vocabulary each hub's own `hub-router.json` declares
discovery-only, so deferring is the contract working rather than failing, and two reach a
command bridge that is a designed entry point to the same work. Fourteen have an identified
fix and a named file. Fourteen are cross-hub boundaries no single hub can settle, handed to
phase 004. One is a bucket artefact, where the router returns one workflow mode plus a
read-only surface packet and the MULTI rule cannot tell the two apart.

The re-sweep also found a live defect this phase does not own. `sk-doc` is serving legacy
under `causeCode: stale-manifest`, because commit `756a7fcd4c` edited a compiled-routing
source input without re-pinning the activation manifest. It costs 96 sk-doc signals their
mode today. It is recorded in `research/unresolved-signal-decisions.md` and raised to the
parent packet, and it does not bear on these three criteria.
<!-- /ANCHOR:closure -->
