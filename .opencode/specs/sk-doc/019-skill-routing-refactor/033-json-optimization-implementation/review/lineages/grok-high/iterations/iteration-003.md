# Iteration 3: D4 Maintainability + adversarial P0 replay + breadth sweep

## Focus
- Dimension: D4 Maintainability (primary); adversarial re-attack of all active P1s; breadth sweep 005/006/007/009/011; confirm no P0 in 008/011 high-blast cutover docs.
- Files reviewed: `011-command-metadata-ingestion/{spec,implementation-summary}.md`; parent `graph-metadata.json`; re-read evidence for F001–F008; spot-check `005/006/007/009` Status/continuity; `008` rollback/guarded-rollout claims.
- Scope: final iteration under stopPolicy=max-iterations=3. Convergence telemetry noted but does not end the run early.

## Scorecard
- Dimensions covered: maintainability (primary); correctness/security/traceability (adversarial replay)
- Files reviewed: 10+
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0 (all prior P1s survive adversarial replay; none upgraded to P0)
- New findings ratio: 0.22 (2 new / ~9 active finding ids)

## Adversarial P0 Replay (Hunter / Skeptic / Referee)

| Finding | Hunter attack | Skeptic counter | Referee |
|---------|---------------|-----------------|---------|
| F001 | Could "before Phase 1" mean before first *gating* phase? | Map binds Phase 1→001; Transition Rules put baseline at Phase 2 | **Survive as P1** (not P0 — wording defect, not runtime hazard) |
| F002 | Could 53/72 be a deliberate re-pin? | routing-baseline freshCanonical labels 53/72 as **top-1**; pin artifact still 55/72 top-3; percentage 0.7361 matches top-1 | **Survive as P1**; root cause confirmed metric mixup |
| F003 | External pi-hook breakage excuses Complete? | REQ-007 has no carve-out; Status Complete asserts Errors:0 | **Survive as P1** (not P0 — documented deferral, not silent lie) |
| F005 | Continuity intentionally deferred to generate-context? | Status Complete without continuity refresh breaks resume ladder | **Survive as P1** |
| F006 | Map is structural plan not live status? | Column is Status; Transition Rules call it coordination truth | **Survive as P1** |
| F008 | Shared appendix OK for closing phase? | Identical blob cannot audit per-CHK claims; embeds F002 error | **Survive as P1** |
| F007 | Scratch is clearly labeled? | Still committed live-shaped patched graph-metadata | **Remain P2** |

No finding upgraded to P0. No P0 discovered.

## Findings

### P0, Blocker
(none)

### P1, Required

- **F009**: 011 packet self-contradicts Complete vs undelivered. `011-command-metadata-ingestion/implementation-summary.md:41` Status: **Complete**, but line 42 says **Delivered: Not yet — Planned, blocked on 006**; line 77 Verification: "Not yet run — this packet is Planned"; §What Was Built / §How It Was Delivered use future tense ("will generate", "will ship"); §Known Limitations still says "Blocked on 006 landing first". The YAML description (lines 3) claims shadow machinery shipped and live cutover was corpus-gated 3× and reverted — which would be a CONDITIONAL/partial outcome, not an unqualified Complete against REQ-002/REQ-003 (generated live COMMAND_BRIDGES). Parent REQ-005 ownership of O7 is therefore only partially evidenced. [SOURCE: 011-command-metadata-ingestion/implementation-summary.md:3,41-42,53-61,77,85; 011-command-metadata-ingestion/spec.md:85-89]

### P2, Suggestion

- **F010**: Parent `graph-metadata.json` still reports `derived.status: "planned"` and `last_active_child_id: null` despite all 12 children Status Complete and parent Status Complete. Reinforces F006 coordination-truth staleness at the graph-metadata layer used by memory/resume tooling. [SOURCE: graph-metadata.json:46,113-114; spec.md:46]

## Breadth Sweep Notes
- **005/006/007/009**: Status Complete; continuity_pct 0 (already covered by F005); no new P0/P1 unique defects beyond systemic continuity/map issues.
- **008**: High-blast migration documents rollback and CI-only lint (defers fail-closed runtime half explicitly as unguarded-daemon risk) — aligns with parent REQ-006. No P0.
- **011**: Guarded-rollout *intent* is correct (shadow-first); the defect is status hygiene / incomplete-cutover honesty (F009), not an unguarded live edit claim.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001,F002,F003,F006,F009 | survives replay |
| checklist_evidence | partial | hard | F008 | unchanged |
| feature_catalog_code | pass | advisory | O1-O11 owned; F009 notes O7 live cutover incomplete | ownership present; delivery honesty gap |
| playbook_capability | notApplicable | advisory | - | - |

## Claim Adjudication Packets

```json
{
  "findingId": "F009",
  "claim": "011 implementation-summary marks Status Complete while Delivered/Verification sections still say Planned/Not yet run and the live COMMAND_BRIDGES cutover remains unreverted-to-generated (hand-authored bridges remain live per description).",
  "evidenceRefs": [
    "011-command-metadata-ingestion/implementation-summary.md:41-42",
    "011-command-metadata-ingestion/implementation-summary.md:77",
    "011-command-metadata-ingestion/implementation-summary.md:3",
    "011-command-metadata-ingestion/spec.md:85-89"
  ],
  "counterevidenceSought": "Read full implementation-summary for a later amendment that reconciles Status with Delivered — none found. Checked whether 'Complete' means 'spike complete / shadow complete' — metadata table still uses unqualified Complete alongside Delivered: Not yet.",
  "alternativeExplanation": "Status Complete refers only to shadow machinery landing — rejected because Delivered/Verification explicitly say Planned and REQ-002/003 require generated live blocks.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Reconcile Status to Partial/Blocked with explicit deferred-REQ list, OR finish live cutover under corpus gate and rewrite Delivered/Verification to match Complete.",
  "transitions": [{"iteration":3,"from":null,"to":"P1","reason":"Initial discovery during D4 + 011 breadth sweep"}]
}
```

```json
{
  "findingId": "F010",
  "claim": "Parent graph-metadata.json still has derived.status planned and null last_active_child_id despite Complete children.",
  "evidenceRefs": ["graph-metadata.json:46", "graph-metadata.json:113-114"],
  "counterevidenceSought": "Checked for alternate status fields elsewhere in graph-metadata — derived.status is the live status signal; last_active_* remain null.",
  "alternativeExplanation": "graph-metadata is intentionally frozen at program-authoring time — still a maintainability/resume defect given children completed.",
  "finalSeverity": "P2",
  "confidence": 0.88,
  "downgradeTrigger": "Refresh derived.status to complete/in-progress-accurate and set last_active_child_id to 012 (or appropriate child).",
  "transitions": [{"iteration":3,"from":null,"to":"P2","reason":"Initial discovery"}]
}
```

## Assessment
- New findings ratio: 0.22 (low; approaching saturation under max-iterations stop)
- Dimensions addressed: all four now covered across the lineage
- Novelty: F009 is a high-value honesty finding on the highest-blast deferred cutover; adversarial replay produced no P0 upgrades
- Convergence telemetry: newInfoRatio trending down (1.0 → 0.58 → 0.22); stopPolicy=max-iterations forces synthesis after this iteration regardless

## Ruled Out
- Unguarded live 008/011 cutover violating parent REQ-006: ruled out for 008 (documented CI-only lint + rollback); 011 intended shadow-first — defect is status honesty (F009), not silent unguarded merge evidence in the packet.
- P0 security vulnerabilities in phase-local scripts: ruled out across iterations 2–3.

## Dead Ends
- None new.

## Recommended Next Focus
Synthesis: compile review-report.md; releaseReadinessState remains release-blocking only if P0 — here CONDITIONAL with active P1s. Remediation workstreams: (1) baseline/top-3 labeling scrub F002; (2) status/continuity/map refresh F003/F005/F006/F009/F010; (3) 012 checklist evidence rewrite F008; (4) REQ-001 wording F001.

Review verdict: CONDITIONAL
