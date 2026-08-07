# Iteration 1: D1 Correctness — Parent REQ consistency, decision-record authority, baseline pinning, final capture

## Focus
- Dimension: D1 Correctness (primary); cross-reference to D3 Traceability where correctness claims depend on spec-vs-artifact alignment.
- Files reviewed: parent `spec.md` (REQ-001..REQ-007, Phase Documentation Map, Phase Transition Rules); `001-derived-authority-decision/decision-record.md` (ADR-001/ADR-002, Verification table); `002-baseline-capture/spec.md` (REQ-001..REQ-006); `002-baseline-capture/baseline/routing-baseline.json`, `capture-top3.json`, `compiler-validate-only.txt`; `010-parent-intent-projection-spike/decision-record.md` (ADR-002 ship bar); `012-integration-verification-rollout/results/final-corpus-capture.md`.
- Scope: internal consistency of load-bearing correctness claims — does the program's stated gating logic hold up against its own captured artifacts?

## Scorecard
- Dimensions covered: correctness (primary), traceability (touched where correctness depends on cross-artifact alignment)
- Files reviewed: 7 primary + 3 baseline artifacts
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first iteration — all findings novel)

## Findings

### P0, Blocker
(none)

### P1, Required

- **F001**: Parent REQ-001 acceptance criteria contradicts the Phase Documentation Map it governs. `spec.md:80` states the baseline is "recorded before Phase 1 begins", but Phase 1 (`001-derived-authority-decision`) is a documentary decision record that lands no gate, and baseline capture is itself Phase 2 (`spec.md:130`, `002-baseline-capture/spec.md`). The Phase Transition Rules (`spec.md:145`) correctly state "Phase 2 (baseline) precedes every gate, delete, migration, and rewire" — so the actual intent is "before any corpus-gated phase", not "before Phase 1". The REQ-001 acceptance wording is wrong and would be unsatisfiable as written (Phase 1 cannot cite a baseline that Phase 2 produces). [SOURCE: spec.md:80, spec.md:130, spec.md:145]

- **F002**: Final capture mislabels the pinned holdout top-3 baseline and reports a false "zero" delta. `012-integration-verification-rollout/results/final-corpus-capture.md:12` lists "TS scorer top-3 holdout | 53/72 = 0.7361" under "Pinned baseline" with delta "zero". The actual pinned baseline artifact `002-baseline-capture/baseline/capture-top3.json` records `holdout_top3: { correct: 55, total: 72, accuracy: 0.7639 }`. The true delta against the pin is -2 (53 vs 55), not zero. The prose at line 14 acknowledges a "55/72 recorded in one early artifact vs 53/72 measured all session" discrepancy and attributes it to a pre-program condition, but the table's "Pinned baseline" column and "zero" delta are misleading as written. The same 53/72 figure is baked into `010-parent-intent-projection-spike/decision-record.md:113` as the pre-registered ship-bar floor ("holdout top-3 (53/72) must not drop") — so the NO-SHIP verdict in 010 ADR-002 was measured against 53/72, not the 55/72 the pinned artifact actually records. [SOURCE: 012-integration-verification-rollout/results/final-corpus-capture.md:12, 002-baseline-capture/baseline/capture-top3.json, 010-parent-intent-projection-spike/decision-record.md:113]

- **F003**: Program marked Complete while its own hard validation gate (REQ-007) is documented as unmet. Parent `spec.md:46` and `spec.md:86` (REQ-007) require `validate.sh <folder> --recursive --strict` to report Errors:0 across the parent and all 12 children before the program is marked Complete. All 13 specs self-report Status: Complete. But `012-integration-verification-rollout/results/final-corpus-capture.md:23-25` documents that `npm run build` (dist) and `validate.sh --strict` remain broken repo-wide (a concurrent session's pi-hook relocation), and explicitly states "The dist rebuild + `validate --recursive --strict` re-run belong to whoever lands the pi-hook fix." The completion claim is premature relative to the program's own stated gate; the blocker is documented but the Status was advanced to Complete anyway. [SOURCE: spec.md:46, spec.md:86, 012-integration-verification-rollout/results/final-corpus-capture.md:23-25]

### P2, Suggestion

- **F004**: Stale continuity frontmatter in 010 decision-record. `010-parent-intent-projection-spike/decision-record.md:13-19` frontmatter records `completion_pct: 0`, `recent_action: "Authored planned phase spec"`, and `blockers: ["Phase 009 canonical derived-producer decision not yet resolved", "Phase 002/006 pinned routing-accuracy corpus not yet established"]`. The decision-record body (ADR-002, lines 117-123) records a completed measured NO-SHIP verdict with Status: Accepted, and the spec.md marks Status: Complete. The frontmatter continuity block was never updated to reflect the executed spike. [SOURCE: 010-parent-intent-projection-spike/decision-record.md:13-19, 010-parent-intent-projection-spike/decision-record.md:117-123]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:80 vs spec.md:130/145 | REQ-001 acceptance wording contradicts phase ordering (F001) |
| checklist_evidence | pending | hard | - | deferred to iteration 2 |

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Parent REQ-001 acceptance criteria says the baseline is recorded before Phase 1 begins, which contradicts the Phase Documentation Map that makes baseline capture Phase 2 and Phase 1 a decision record.",
  "evidenceRefs": ["spec.md:80", "spec.md:130", "spec.md:145"],
  "counterevidenceSought": "Re-read the full Phase Transition Rules block (spec.md:142-151) to check whether any rule reorders Phase 1 after Phase 2; none does — rule only states Phase 2 precedes every gate/delete/migration/rewire. Checked 001-derived-authority-decision/spec.md to confirm Phase 1 lands no gate (it is a decision record only).",
  "alternativeExplanation": "Could be intentional loose wording where 'Phase 1' means 'the first gating phase' rather than the folder named 001 — but the spec uses 'Phase 1' consistently to mean 001-derived-authority-decision in the Phase Documentation Map, so this reading does not rescue the acceptance criteria.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If REQ-001 acceptance criteria is amended to 'before any corpus-gated phase begins' (matching the Phase Transition Rules intent), downgrade to P2.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F002",
  "claim": "The 012 final capture reports a zero delta for TS scorer top-3 holdout against a 53/72 pinned baseline, but the actual pinned baseline artifact records 55/72, so the true delta is -2 and the 010 NO-SHIP ship bar was measured against the wrong pinned number.",
  "evidenceRefs": ["012-integration-verification-rollout/results/final-corpus-capture.md:12", "002-baseline-capture/baseline/capture-top3.json", "010-parent-intent-projection-spike/decision-record.md:113"],
  "counterevidenceSought": "Read the full capture-top3.json (holdout_top3.correct=55, total=72, accuracy=0.7639) and the routing-baseline.json top3_new block (consistent 55/72). Grepped 010 ADR-002 for the ship-bar floor — line 113 hardcodes 53/72. Checked 012 line 14 prose which acknowledges the 55-vs-53 discrepancy but the table at line 12 still labels 53/72 as 'Pinned baseline' with delta 'zero'.",
  "alternativeExplanation": "The 012 prose attributes 53/72 to the live measurement regime and 55/72 to 'one early artifact', claiming the discrepancy predates the program and is revert-isolation-verified independent of every phase. Even accepting that, the table column header 'Pinned baseline' is still wrong — the pinned artifact is 55/72, so labeling 53/72 as the pin and reporting 'zero' delta is internally inconsistent with the prose.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the 002 capture-top3.json is amended to record 53/72 as the canonical pin (with the 55/72 figure retracted as a capture-time error) AND 010/012 are updated to reference the corrected pin consistently, downgrade to P2.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F003",
  "claim": "The program is marked Complete (parent + all 12 children) while its own REQ-007 hard gate (validate --recursive --strict Errors:0) is documented as unmet in the 012 final capture artifact.",
  "evidenceRefs": ["spec.md:46", "spec.md:86", "012-integration-verification-rollout/results/final-corpus-capture.md:23-25"],
  "counterevidenceSought": "Confirmed parent spec.md:46 Status: Complete and REQ-007 at spec.md:86 requires Errors:0 before Complete. Checked all 12 child spec.md Status fields — all report Complete. Read 012 final-corpus-capture.md:23-25 which explicitly states validate.sh --strict and npm run build (dist) remain broken and the re-run 'belongs to whoever lands the pi-hook fix'.",
  "alternativeExplanation": "The breakage is documented as caused by a concurrent session's pi-hook relocation, not by this program's changes — so one could argue the gate is blocked by an external condition outside the program's control. But REQ-007 is worded as a hard precondition 'before the program is marked Complete' with no external-blocker escape clause; the honest status pending the pi-hook fix is CONDITIONAL/Blocked, not Complete.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If REQ-007 is amended to allow an external-blocker carve-out, OR the pi-hook fix lands and validate --recursive --strict is re-run with Errors:0 recorded, downgrade to P2.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

## Assessment
- New findings ratio: 1.0 (first iteration — all findings novel)
- Dimensions addressed: correctness (primary), traceability (touched)
- Novelty justification: 3 P1 correctness findings (REQ-001 wording contradiction, baseline-pin mislabeling with false zero delta, premature Complete vs unmet REQ-007) and 1 P2 stale-continuity finding. All cite file:line evidence re-verified against the checked-out tree this iteration.

## Ruled Out
- "The derived-authority decision (001) is internally inconsistent": ruled out. ADR-001/ADR-002 are internally consistent, the Verification table (decision-record.md:254-265) re-ran every load-bearing claim against source this session, and the additive-merge choice is coherent. No correctness defect found in 001.

## Dead Ends
- None this iteration.

## Recommended Next Focus
Iteration 2: D2 Security + D3 Traceability. Priority targets: (a) the stale parent Phase Documentation Map (all 12 listed "Planned" vs all 12 self-reporting "Complete") — high-value traceability finding; (b) checklist_evidence protocol across the 12 checklist.md files (verify [x] marks have evidence); (c) feature_catalog_code overlay — verify O1-O11 each map to exactly one owning phase per REQ-005; (d) security scan of 002/scripts/capture-top3.mjs and 010 scratch artifacts for unsafe patterns (the spike writes a patched graph-metadata.json). Also re-verify F002's 55-vs-53 figure against routing-baseline.json's top3_new block to lock the pin value down.

Review verdict: CONDITIONAL
