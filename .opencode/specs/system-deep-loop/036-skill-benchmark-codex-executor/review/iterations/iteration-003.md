BINDING: mode=review target_agent=deep-review
BINDING: leaf=true target_read_only=true dimension=maintainability

# Deep Review Iteration 003

## Dimension

Maintainability — recommendation calibration, omitted report signal, internal consistency, and structural clarity for the analytical deliverable that will feed final recommendations. Security is outside the configured session.

### Recommendation calibration

| Recommendation | Calibration | Maintainability disposition |
|---:|---|---|
| 1 | Needs scope qualifier | The 18/18 surface result supports using the tested configuration for surface classification, but “use Luna” should remain scoped to this executor/run until holdout evidence exists. Captured by R3-P1-001. |
| 2 | Evidence direction is strong; wording is too global | 13/18 zero resource recall and D3=8 justify a conservative policy for this run. “Do not use Luna unattended” should say “do not use this tested configuration unattended pending holdout/ablation.” Captured by R3-P1-001. |
| 3 | Calibrated | The draft labels the read/recall relation a hypothesis and explicitly asks for an intervention retest; no causal overreach remains. |
| 4 | Calibrated, with one extension | Per-skill qualification follows from the report spread. Include executor/runtime configuration in the qualification unit. |
| 5 | Calibrated | The mcp-tooling control has no resource or surface gold, so adding gold before model comparison is required. |
| 6 | Mostly calibrated | The missing-gold counts verify. Apply “where semantically applicable” to sk-doc surface gold as well as sk-code expansion. |
| 7 | Calibrated | D1inter and D4 are unscored in all three Tier-2 reports. |
| 8 | Calibrated | Missing prompts and expected-resource arrays block exact omission/cardinality analysis. |
| 9 | Calibrated | Seven MR/CB rows omit liveEvidence but still contribute Mode-A scores; describe them as “rows without live evidence,” not proven synthetic rows. |
| 10 | Under-scoped | The holdout rule is correct but must include both Tier-1 reports if they continue to support the cross-skill generalization. Captured by R3-P1-001. |

### Omitted-signal check

- D1intra and D2 are numerically identical in all five reports, and row-level D2 identifies itself as the `router-replay-recall` proxy. They are not independent confirmations in these runs.
- All three Tier-2 reports have D5=100 with `hardGate=true`, `gateFailed=false`, zero hub-route regressions, and zero tool-surface violations. The draft lists D5 but never explains the positive signal: output-contract/hub/tool-surface conformance held even when leaf-resource accuracy failed.
- The intent signal is structurally weak or absent: all 43 mcp-tooling, sk-doc, and two-runtime Tier-1 row observations have `intentRecall=0` with `liveResourceOnly=true`; sk-code omits `intentRecall` on all 30 rows. D1intra must therefore be described using its resource/surface fallback semantics, not as generic intent routing.
- The draft already captures the material event/read distributions. Complete-population replay found no omitted family anomaly that reverses recommendations 1-5.

## Files Reviewed

- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:1]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:1]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:1]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:1]

## Findings by Severity

### P0

None.

### P1

#### R3-P1-001 [P1] Operational recommendations escape the fitted-only evidence they later disclaim

- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71`
- Evidence: The synthesis says Tier-1 “confirms” a model-wide negative is false, and recommendations 1-3 issue operational rules, but sk-doc, sk-code, and both Tier-1 generalization blocks have `holdoutScore=null` and `holdoutCount=0`. Recommendation 10 acknowledges the holdout requirement only for sk-doc/sk-code. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:77] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:81] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:85] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:115] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:18]
- Finding class: matrix/evidence
- Scope proof: Compared the generalization object in all five named reports with the cross-skill synthesis and each of the ten recommendations.
- Claim: The operational/model-level strength of recommendations 1-3 and the cross-skill conclusion is supported by the report populations.
- Counterevidence sought: Checked recommendation 3's intervention wording, recommendation 4's per-skill qualifier, and mcp-tooling's 4 fitted + 2 holdout split.
- Alternative explanation: The language can be read as a conservative safety policy. That supports caution, but not an unqualified claim about Luna beyond this configuration and fitted set.
- Final severity: P1
- Confidence: 0.94
- Downgrade trigger: Scope recommendations 1-3 and the cross-skill conclusion to this run/configuration, label them provisional pending holdouts/ablations, and extend recommendation 10 to Tier-1 evidence used for generalization.
- Recommendation: Separate observed results from policy and name the qualification unit as skill + executor/runtime + model configuration.

#### R3-P1-002 [P1] Omitted D1/D2 proxy and D5 hard-gate semantics overstate independent evidence

- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71`
- Evidence: In every report, D1intra equals D2 (Tier-2: 100/100, 24/24, 65/65; Tier-1: 100/100 and 98/98), while complete scenario-row extraction identifies D2 as the same `router-replay-recall` proxy. D5 is separately marked `hardGate=true`; it is 100 with no gate failure in every Tier-2 report and 97 in both Tier-1 reports. The draft lists the values but uses the D1/D2 pairs as corroboration without explaining either relationship. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:11] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:46] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:50] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:63] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:46] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:50] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:63] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:46] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:50] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:63] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:23] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:23]
- Finding class: matrix/evidence
- Scope proof: Complete-population comparison covered every dimension block and every scenario row in all five reports.
- Claim: D1intra/D2 and D5 can be read from the draft as independent, comparably scoped evidence for routing ability.
- Counterevidence sought: Searched for any report that broke D1intra=D2, used a non-replay D2 measure, or failed the D5 gate.
- Alternative explanation: D1 and D2 are conceptually separate benchmark dimensions, but these report instances explicitly reuse one replay-recall signal.
- Final severity: P1
- Confidence: 0.97
- Downgrade trigger: Add a score-semantics section explaining the D2 proxy, intentRecall/liveResourceOnly behavior, D5 hard-gate meaning, and which fields contribute independent evidence.
- Recommendation: Add “How to read these scores” before the findings table and stop presenting D1/D2 pairs as two confirmations.

### P2

#### R3-P2-001 [P2] The Open Questions section duplicates settled recommendation work

- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:119`
- Evidence: Question 2 restates recommendation 8's missing prompt/gold export; Question 3 restates recommendation 9's live-row aggregation decision; Question 4 mixes external provenance with the already-active liveEvidence wording correction. Only Question 1 is wholly unresolved. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:107] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:111] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:119] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:121] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:124]
- Finding class: instance-only
- Scope proof: Mapped all four questions against all ten recommendations and the active findings registry.
- Recommendation: Keep Question 1; turn Questions 2-3 into acceptance criteria under recommendations 8-9; split Question 4 into a cited provenance follow-up and the existing wording fix.

## Traceability Checks

- Core `spec_code`: partial. The prior 2/22 exact-anchor result remains open; this pass adds two evidence-calibration requirements.
- Core `checklist_evidence`: partial. Headline values reproduce, but provenance wording and recommendation scope still overstate what the reports establish.
- Overlay protocols: not applicable to this analytical file target.
- Resource-map coverage gate: skipped because `resource-map.md` is absent.
- Graph status: unavailable/empty. Complete-population JSON projections and exact target/report reads supplied graphless fallback coverage.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. Two new required corrections affect the final recommendation set: scope the operational claims to fitted evidence, and explain the duplicated proxy/hard-gate score semantics. The structural question cleanup is advisory.

## Next Dimension

Re-verification and consolidation — iteration 4 should adversarially re-check all active P1s, merge overlaps, and draft the adjusted final recommendation wording. All three configured dimensions are now covered; max-iterations still requires iterations 4-5.

Review verdict: CONDITIONAL
