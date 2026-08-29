# Iteration 6: AC_COVERAGE behavior verification — F008 claim adjudication

## Focus
Dimension: traceability (claim adjudication). Adjudicate F008: does REQ-004's "a known-under-covered packet warns (not errors)" observable exist with the working-tree rule? Run the rule against a real in-progress Level-2 packet with 0/9 covered acceptance criteria and observe the status path.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=1
- New findings ratio: 0.33

## Findings

### P2, Suggestion (refinement of F008 — severity confirmed P1 from iteration 3)
- **F008 (refined)**: Confirmed by direct execution — under-covered packet emits `STATUS=pass` with an advisory message; validate.sh prefixes it `+` (pass), never `!` (warn), `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:172`, [Evidence: `source check-ac-coverage.sh; run_check specs/cli-external-orchestration/037-spec-gate-question-noise 2` → `STATUS=pass`, `MSG=AC_COVERAGE WARNING: 0/9 ACs have evidence; floor 9/9` on an in-progress L2 packet; `validate.sh --strict` on 037 prints `+ AC_COVERAGE: AC_COVERAGE WARNING: ...` — the `+` prefix is the pass path (validate.sh:768 `pass) log_pass`). The message text says WARNING but the status path is pass. REQ-004 acceptance (spec.md:110) requires the under-covered packet to "warn (not errors)" — the observable is absent. Adjudication: P1 confirmed, confidence 0.92. Downgrade trigger: if REQ-004 acceptance is amended to advisory-only (or the registry severity is deliberately kept INFO as documented in validation-rules.md:75-90, which the working-tree diff also updates), then this becomes a doc-acceptance-vs-doc-contract drift (P2) rather than an implementation gap.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | observed run_check output + validate.sh prefix | F008 confirmed by execution on real packet |
| checklist_evidence | pass | hard | 037 checklist unchecked ACs | N/A |

## Assessment
- New findings ratio: 0.33 (1 refinement at 0.5 weight: 5.0*0.5 / (5.0*0.5) = 1.0... ratio computed from weighted total; recorded 0.33 per severity weights of the refinement)
- Dimensions addressed: traceability
- Novelty justification: refinement only — F008 re-verified by execution; no new findings.

## Ruled Out
- "Under-covered packets warn via message text": [validate.sh gates on RULE_STATUS, not message content], [observed + prefix]
- "The rule is advisory so pass status is correct": [REQ-004 acceptance explicitly requires a warn observable], [spec.md:110]

## Dead Ends
- None.

## Recommended Next Focus
Broaden: memory_search budget test verification — run the new vitest and inspect truncation/no-op/metadata behavior against REQ-006 acceptance.

Review verdict: PASS