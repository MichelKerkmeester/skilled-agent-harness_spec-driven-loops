# Iteration 7: Broaden — systemic layout-migration drift sweep (traceability)

## Focus
Broadened angle (traceability). Sweep all phase implementation-summaries for the stale nested-numbering pattern discovered in F011, to determine whether the broken packet_pointer is an isolated typo or a systemic migration defect.

## Scorecard
- Dimensions covered: traceability (deepened)
- Files reviewed: 17 phase implementation-summaries (packet_pointer + session_id grep)
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.40

## Findings

### P1, Required

- **F012**: Layout-migration drift is systemic across phases 002-005 (broken nested packet_pointers), not isolated to phase 002
  - The packet_pointer field (a load-bearing resume/navigation pointer) is broken in FOUR phases, all pointing under a non-existent `001-deep-agent-router-and-orchestration/` parent with off-by-one numbering:
    - `002-route-proof-validation/implementation-summary.md:12` → `.../001-deep-agent-router-and-orchestration/001-route-proof-validation` (covered by F011)
    - `003-agent-dispatch-hardening/implementation-summary.md:12` → `.../001-deep-agent-router-and-orchestration/002-agent-dispatch-hardening`
    - `004-command-pre-route-headers/implementation-summary.md:8` → `.../001-deep-agent-router-and-orchestration/003-command-pre-route-headers`
    - `005-gpt-verification-smoke/implementation-summary.md:8` → `.../001-deep-agent-router-and-orchestration/004-gpt-verification-smoke`
  - None of these nested paths exist (`001-deep-agent-router-and-orchestration/` is itself a flat phase with only its own spec/plan/tasks/research — no child folders). The real folders are flat siblings `002`..`005`. The same `031-001-00N` session_id pattern (and stale `001/00N` numbering) also appears across these phases' plan/spec/tasks/checklist files, and in phase 006's plan/tasks.
  - Phases 001 and 007-017 have CORRECT flat self-referencing packet_pointers. The drift is confined to the early-phase cohort (002-006) that was created under the old nested `001/00N` layout and migrated to flat (per spec.md:74) WITHOUT regenerating their continuity metadata.
  - [SOURCE: grep packet_pointer across all impl-summaries; grep `001-deep-agent-router-and-orchestration/00[0-9]` → 002,003,004,005,006 files; spec.md:74 flat-siblings statement; real flat folder layout]

### P2, Suggestion
(none this iteration)

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:74 vs impl-summary packet_pointers | Parent spec.md declares flat layout; 4 child packet_pointers contradict it. The implementations themselves are real (verified for 002 in iter 6); the metadata navigation layer is broken. |

## Assessment
- New findings ratio: 0.40 (1 net-new P1 covering the systemic extent; high-value — confirms F011 is not a typo but a packet-wide migration defect)
- Dimensions addressed: traceability
- Novelty justification: The sweep answers the open question from iteration 6 (is F011 systemic?). It is: 4 of 17 phases have broken packet_pointers. The clean boundary (phases 007+ are correct) confirms this is a migration cohort artifact, not random drift — the early phases were written pre-flatten and never re-derived.

## Ruled Out
- Drift in phases 007-017: ruled out — all have correct flat self-referencing packet_pointers (verified across all 11 impl-summaries). (iteration 7, evidence: grep packet_pointer output for 007-017)
- Phase 001 self-reference error: ruled out — `001-deep-agent-router-and-orchestration/implementation-summary.md:8` correctly self-references its own flat path.

## Dead Ends
- None this iteration.

## Recommended Next Focus
- Probe phase 005 (the genuinely blocked smoke) and phase 008's Mode-D fix claims for any substance issues, then prepare for synthesis. Remaining iterations should look for any P0-class correctness/security issue not yet covered before concluding.

---

### Claim Adjudication Packet (F012)

```json
{
  "findingId": "F012",
  "claim": "The broken nested-layout packet_pointer from F011 is systemic: phases 002-005 all carry packet_pointers resolving to non-existent nested paths under 001-deep-agent-router-and-orchestration/ with off-by-one numbering, a cohort-level migration defect.",
  "evidenceRefs": [
    "003-agent-dispatch-hardening/implementation-summary.md:12",
    "004-command-pre-route-headers/implementation-summary.md:8",
    "005-gpt-verification-smoke/implementation-summary.md:8",
    "spec.md:74"
  ],
  "counterevidenceSought": "Grep'd packet_pointer across ALL 17 phase impl-summaries; confirmed 002-005 point under the non-existent nested parent while 001 and 007-017 correctly self-reference flat paths. Confirmed 001-deep-agent-router-and-orchestration/ has no child phase folders (ls). Checked that the off-by-one numbering (002->001, 003->002, 004->003, 005->004) is consistent with an old nested scheme, not a random corruption.",
  "alternativeExplanation": "The nested paths could be intentional legacy aliases kept for backward compatibility with older memory entries. Rejected: the parent spec.md:74 explicitly states the nested layout 'never matched the actual filesystem' and the packet reconciled to flat; there is no alias-resolver, and graph-metadata.json children_ids are all flat. The pointers are simply stale.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "If the 4 affected implementation-summaries are regenerated via generate-context.js (which derives packet_pointer from the real flat path), F012 resolves. Downgrade to P2 only if a documented alias layer is confirmed to resolve nested packet ids.",
  "transitions": [
    { "iteration": 7, "from": null, "to": "P1", "reason": "Systemic extent confirmed — 4 phases share the F011 broken-pointer pattern" }
  ]
}
```

Review verdict: CONDITIONAL
