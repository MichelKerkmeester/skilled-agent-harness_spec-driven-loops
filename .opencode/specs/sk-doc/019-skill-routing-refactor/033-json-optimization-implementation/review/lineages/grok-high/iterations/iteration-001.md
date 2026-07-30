# Iteration 1: D1 Correctness — REQ consistency, baseline pin authority, Complete-vs-gate

## Focus
- Dimension: D1 Correctness (primary); touch D3 where correctness claims depend on cross-artifact alignment.
- Files reviewed: parent `spec.md` (REQ-001..REQ-007, Phase Documentation Map, Phase Transition Rules); `002-baseline-capture/baseline/capture-top3.json`, `routing-baseline.json`; `010-parent-intent-projection-spike/decision-record.md` (ADR-002); `012-integration-verification-rollout/results/final-corpus-capture.md`; `001-derived-authority-decision/decision-record.md` (spot-check internal consistency).
- Scope: load-bearing correctness claims — do the program's gating numbers and status claims hold against its own pinned artifacts?

## Scorecard
- Dimensions covered: correctness (primary), traceability (touched)
- Files reviewed: 6 primary docs + 2 baseline JSON artifacts
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first iteration — all findings novel)

## Findings

### P0, Blocker
(none)

### P1, Required

- **F001**: Parent REQ-001 acceptance criteria contradicts the Phase Documentation Map it governs. `spec.md:80` states the baseline is "recorded before Phase 1 begins", but Phase 1 (`001-derived-authority-decision`) is a documentary decision record that lands no gate, and baseline capture is itself Phase 2 (`spec.md:130`, `002-baseline-capture`). The Phase Transition Rules (`spec.md:145`) correctly state "Phase 2 (baseline) precedes every gate, delete, migration, and rewire" — so the actual intent is "before any corpus-gated phase", not "before Phase 1". As written, REQ-001 acceptance is unsatisfiable (Phase 1 cannot cite a baseline Phase 2 produces). [SOURCE: spec.md:80, spec.md:130, spec.md:145]

- **F002**: Holdout top-1 figure (53/72) is systematically mislabeled as holdout top-3 across 010 and 012. The pinned top-3 artifact `002-baseline-capture/baseline/capture-top3.json` records `holdout_top3: { correct: 55, total: 72, accuracy: 0.7639 }`. The same folder's `routing-baseline.json` freshCanonical block distinguishes `holdout_top1: "53/72 = 73.61%"` from `holdout_top3: "55/72 = 76.39%"`. Yet `012-.../final-corpus-capture.md:12` lists "TS scorer top-3 holdout | 53/72 = 0.7361" under "Pinned baseline" with delta "zero" — 0.7361 is exactly the top-1 percentage. ADR-002 at `010-.../decision-record.md:113` hardcodes "holdout top-3 (53/72) must not drop" and line 121 reports "holdout top-3: 53→53". The 012 prose at line 14 acknowledges a 55-vs-53 discrepancy but still labels 53/72 as the top-3 pin. Root cause: top-1 holdout numerator reused under a top-3 label. [SOURCE: 002-baseline-capture/baseline/capture-top3.json:12-16, 002-baseline-capture/baseline/routing-baseline.json:84-86, 012-integration-verification-rollout/results/final-corpus-capture.md:12,14, 010-parent-intent-projection-spike/decision-record.md:113,121]

- **F003**: Program marked Complete while its own hard validation gate (REQ-007) is documented as unmet. Parent `spec.md:46` Status: Complete and `spec.md:86` (REQ-007) require `validate.sh <folder> --recursive --strict` Errors:0 across parent + all 12 children before Complete. All 12 child specs also report Status: Complete. But `012-.../final-corpus-capture.md:23-25` documents that `npm run build` (dist) and `validate.sh --strict` remain broken repo-wide (concurrent pi-hook relocation) and explicitly defers the re-run. No external-blocker escape clause exists in REQ-007; Status Complete is premature relative to the program's own gate. [SOURCE: spec.md:46, spec.md:86, 012-integration-verification-rollout/results/final-corpus-capture.md:23-25]

### P2, Suggestion

- **F004**: Stale continuity frontmatter in 010 decision-record. `010-parent-intent-projection-spike/decision-record.md` continuity block still carries `completion_pct: 0` and planned-phase blockers, while ADR-002 body records a completed measured NO-SHIP verdict (Status: Accepted) and the phase `spec.md` marks Status: Complete. [SOURCE: 010-parent-intent-projection-spike/decision-record.md:13-30, 010-parent-intent-projection-spike/decision-record.md:117-123]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:80 vs :130/:145; capture-top3 vs 012:12 | F001 + F002 |
| checklist_evidence | pending | hard | - | deferred to iteration 2 |

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Parent REQ-001 acceptance criteria says the baseline is recorded before Phase 1 begins, which contradicts the Phase Documentation Map that makes baseline capture Phase 2.",
  "evidenceRefs": ["spec.md:80", "spec.md:130", "spec.md:145"],
  "counterevidenceSought": "Re-read Phase Transition Rules (spec.md:142-151); no rule reorders Phase 1 after Phase 2. Confirmed 001 is decision-record-only (lands no gate). Checked whether 'Phase 1' elsewhere means 'first gating phase' — Phase Documentation Map uses 'Phase 1' consistently for 001-derived-authority-decision.",
  "alternativeExplanation": "Loose wording where 'Phase 1' means 'first gating phase' — rejected because the map binds 'Phase 1' to folder 001.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Amend REQ-001 acceptance to 'before any corpus-gated phase begins' matching Phase Transition Rules intent.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F002",
  "claim": "53/72 (=0.7361) is the holdout top-1 figure from the pinned routing-baseline freshCanonical block, but 010 ADR-002 and 012 final capture label it as holdout top-3; the actual pinned holdout top-3 is 55/72 (=0.7639).",
  "evidenceRefs": [
    "002-baseline-capture/baseline/capture-top3.json:12-16",
    "002-baseline-capture/baseline/routing-baseline.json:84-86",
    "012-integration-verification-rollout/results/final-corpus-capture.md:12",
    "010-parent-intent-projection-spike/decision-record.md:113"
  ],
  "counterevidenceSought": "Read capture-top3.json holdout_top3 (55/72). Read routing-baseline.json freshCanonical distinguishing holdout_top1 53/72 from holdout_top3 55/72. Compared 012 table percentage 0.7361 to top-1 percentage string. Re-read 012 line 14 prose acknowledging 55-vs-53 — still does not rescue the table column labeling 53/72 as top-3 pin.",
  "alternativeExplanation": "Could claim the live measurement regime redefined the pin to 53/72 mid-program — but the committed pin artifacts still say 55/72 for top-3, and the percentage match to top-1 is too exact to be coincidence.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Align 010/012 to cite holdout_top3=55/72 from capture-top3.json (or formally re-pin capture-top3.json to a new authoritative value with rationale) and stop labeling top-1 numerators as top-3.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery; metric-mixup root cause identified"}]
}
```

```json
{
  "findingId": "F003",
  "claim": "Parent and all 12 children report Status Complete while REQ-007's validate --recursive --strict Errors:0 gate is documented unmet in the 012 final capture.",
  "evidenceRefs": ["spec.md:46", "spec.md:86", "012-integration-verification-rollout/results/final-corpus-capture.md:23-25"],
  "counterevidenceSought": "Confirmed all 12 child Status: Complete via directory scan. Read 012 outstanding-blocker section stating validate.sh --strict remains broken and re-run is deferred to pi-hook fix owners.",
  "alternativeExplanation": "External concurrent-session breakage outside program control — rejected as escape because REQ-007 has no external-blocker carve-out; honest status is Blocked/CONDITIONAL until Errors:0.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Land pi-hook fix and record Errors:0 for validate --recursive --strict, OR amend REQ-007 with an explicit external-blocker carve-out and downgrade Status accordingly.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: correctness (primary), traceability (touched)
- Novelty justification: F002's root cause (top-1 numerator reused under top-3 label, proven by routing-baseline.json freshCanonical percentage match) is a precision finding beyond a generic "numbers disagree" claim. F001/F003 independently re-verified against checked-out tree.

## Ruled Out
- "001 derived-authority decision is internally inconsistent": ruled out. ADR-001/ADR-002 Accepted status, additive-merge choice coherent with stated constraints; no correctness defect found in 001 body this pass.

## Dead Ends
- None this iteration.

## Recommended Next Focus
Iteration 2: D2 Security + D3 Traceability. (a) Parent Phase Documentation Map stale (all 12 Planned vs Complete). (b) checklist_evidence spot-checks across children. (c) feature_catalog_code / O1-O11 ownership map (REQ-005). (d) Security scan of `002/.../capture-top3.mjs` and `010/.../scratch/` for unsafe write patterns / committed patched derived blocks. (e) Re-confirm F002 against any child checklist that cites 53/72 as top-3.

Review verdict: CONDITIONAL
