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
    last_updated_at: "2026-09-04T12:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the seven named fixes and measured each one"
    next_safe_action: "Hand the three scorer-held signals to the scorer owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-fix-before-2026-09-04.tsv"
      - "research/gate-a-fix-after-2026-09-04.tsv"
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
**Date:** 2026-09-04
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
| AC-004 | REQ-003 | Given the seven fixes the decision table names, When each is applied, Then the signal it targets moves and the move is measured | Applied 2026-09-04 at HEAD `81d439f764`. Baseline `research/gate-a-fix-before-2026-09-04.tsv` and result `research/gate-a-fix-after-2026-09-04.tsv`, both 389 and 388 rows at exit 0. RESOLVED moves 338 to 345 and NO_RECOMMENDATION 13 to 6, with `dqi score`, `ink-on-parchment retint`, `magicpath`, `magicpath ai`, `magicpath canvas`, `swe-1.7 dispatch` and `evaluate agent` each reaching exactly one mode. `benchmark a model or prompt framework` is retired and leaves the denominator. Per-fix before and after at `research/unresolved-signal-decisions.md:254`, with the resolved row for `dqi score` at `research/gate-a-fix-after-2026-09-04.tsv:137`. Four signals in the fix groups did not clear and each carries the scorer line that holds it, at `research/unresolved-signal-decisions.md:286` | Met | |
| AC-005 | REQ-003 | Given a vocabulary change can move an accuracy floor, When the fixes ship, Then no hub loses a signal and both continuous-integration gates hold | No hub's RESOLVED count falls: sk-code 58 to 59, sk-doc 96 to 97, mcp-tooling 96 to 99, system-deep-loop 19 to 20, cli-external-orchestration 69 to 70, and every bucket change in the sweep is one of the seven target signals. `score-routing-corpus.py` returns `overall_pass: true` with advisor 112 of 195 at 0.5744 and Gate 3 F1 0.9843 before and after, unchanged. `scorer-eval-baseline-ratchet.vitest.ts` passes 7 of 7 before and after. `compiled-route-guard.cjs` exits 0 with all five hubs fresh, and all five canaries print green. Bucket totals at `research/unresolved-signal-decisions.md:236`, gate results at `research/unresolved-signal-decisions.md:326`, and the run-by-run verification table at `implementation-summary.md:272` | Met | |

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

All five rows are Met. The sweep covered every declared signal, its headline was re-derived
by a second method rather than trusted, the fifty signals that do not resolve each carry a
decision with the mechanism that produced them, and the fixes those decisions named have now
been applied and measured.

The decisions are not uniform, which is the point of writing them down. Twenty-one are correct
as they stand: nineteen are vocabulary each hub's own `hub-router.json` declares
discovery-only, so deferring is the contract working rather than failing, and two reach a
command bridge that is a designed entry point to the same work. Fourteen had an identified fix
and a named file. Ten of those are now closed: seven route to one mode, one is retired, and two
are hub-identity phrases whose declaration was tidied to match the deferral they already served.
The other four are held by scorer code no hub's metadata reaches. Fourteen are cross-hub
boundaries no single hub can settle, handed to phase 004. One is a bucket artefact, where the
router returns one workflow mode plus a read-only surface packet and the MULTI rule cannot tell
the two apart.

The re-sweep also found a live defect this phase does not own. `sk-doc` was serving legacy
under `causeCode: stale-manifest`, because commit `756a7fcd4c` edited a compiled-routing
source input without re-pinning the activation manifest, and it cost 96 sk-doc signals their
mode. It was fixed elsewhere before the fixes below were applied, and sk-doc now reports
`compiled-serving` and `fresh`.

Applying the fixes changed what three of the decisions say. `deep-review` is already declared
in both of system-deep-loop's vocabulary fields, so the missing hyphenated form D-07 inferred
was an artefact of a sweep driver whose reply filenames collided. The real loss is an
abstention gate in `lib/scorer/fusion.ts`. `dom inspect` and `task list` are held at confidence
0.25 by the read-only explainer floor in `lib/scorer/text.ts` rather than by thin weight. The
`lighthouse` attempt was measured and reverted. All three now sit with phase 004's cross-hub
set or with whoever owns the scorer, and none of them is settleable from a hub's metadata.
<!-- /ANCHOR:closure -->
