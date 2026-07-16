# Deep Review Iteration 002

## Dimension

Traceability — exact audit of every markdown evidence anchor, quantitative claim, findings-table aggregate, provenance assertion, recommendation premise, and Open Question against the five named report JSONs.

## Files Reviewed

- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md`
- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json`
- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json`
- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json`
- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json`
- `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json`

The code graph was unavailable/empty. Direct reads, exact markdown-link parsing, complete-population JSON projections, and exact-key searches supplied graphless fallback coverage.

## Findings by Severity

### P0

None.

### P1

#### R2-P1-001 [P1] Twenty of twenty-two evidence anchors do not fully support their citing sentence

- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:17`
- Evidence: All 22 links resolve. Twelve cited lines contain only `scenarioId` (for example `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:181` and `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1231`), while eight contain only `aggregateScore` (for example `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12`). Those lines do not expose the full field/value sets claimed by the citing sentences. Only the two Tier-1 score links on draft line 91 fully support their linked values.
- Finding class: matrix/evidence
- Scope proof: Parsed every `.report.json:<line>` link and inspected its exact line plus adjacent context.
- Claim: The draft's links provide precise sentence-level report evidence.
- Counterevidence sought: Allowed partial credit wherever a cited aggregate line supported one component and checked adjacent lines for the remaining fields.
- Alternative explanation: The author may have intended row-start or block-start pointers, but the requested contract requires the cited line itself to carry the supporting field/value.
- Final severity: P1
- Confidence: 0.99
- Downgrade trigger: Re-anchor every load-bearing component to exact report field lines, or explicitly adopt documented block-range citation semantics.
- Recommendation: Use multiple exact anchors when one sentence combines aggregate, dimension, and population claims.

#### R2-P1-002 [P1] Load-bearing quantitative claims and all four Open Questions lack report citations

- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:101`
- Evidence: Recommendation 6's four gold-coverage counts, recommendation 7's all-three-report `unscored-mode-a` assertion, recommendation 10's holdout/fitted counts, several findings statistics, and all four Open Questions have no markdown report link. The underlying gaps mostly verify, but the draft does not let a reader trace them.
- Finding class: matrix/evidence
- Scope proof: Mapped every quantitative or schema-gap sentence in the complete 123-line draft to inline and paragraph-level links.
- Claim: Every quantitative recommendation and report-gap question is traceable to cited report evidence.
- Counterevidence sought: Checked surrounding paragraphs for shared citations and directly verified `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:15`, `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:17`, `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:15`, `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:17`, and `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715`.
- Alternative explanation: Earlier section links may be intended as blanket sourcing, but they do not identify evidence for later counts or external provenance claims.
- Final severity: P1
- Confidence: 0.98
- Downgrade trigger: Add exact anchors to each listed claim and cite the actual audit/context artifact for external provenance statements.
- Recommendation: Anchor recommendations 6–10 and each Open Question independently.

### P2

#### R1-P1-001 re-adjudication — DOWNGRADED P1 → P2

- Disposition: The prior P1 is a false positive at required-fix severity; retain a P2 precision issue.
- File: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:3`
- Evidence: Exact `has("liveEvidence")` checks show that MR-001..MR-004 and CB-001..CB-003 omit the key; they do not serialize `"liveEvidence": null`. Their Mode-A scores are present, so the semantic wording “have no live evidence” is supported. `DR-004` does contain `liveEvidence.statedRoutingParsed=false` at `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715`.
- Why iteration 1 differed: Its `found:false` result correctly detected missing keys but overreached by concluding that the report could not support the analytical point. jq's projection of a missing property as `null` explains the draft wording.
- Final severity: P2
- Confidence: 0.98
- Recommendation: Replace literal `liveEvidence=null` with “the `liveEvidence` field is absent” or “no live evidence is present.”

## Traceability Checks

- Core `spec_code`: partial — 2/22 anchors fully support their linked claim, 8 are partial, and 12 point only to scenario identifiers.
- Core `checklist_evidence`: partial — eight provenance figures reproduce; claim (g) is semantically supported but not literally serialized as stated, and “verified by Claude” is not provable from the reports alone.
- Findings table: values verified — mcp-tooling PASS/100, sk-doc FAIL/20, sk-code CONDITIONAL/65, all per-dimension cells, and every unscored marker match the aggregates.
- Recommendation gaps: substantively verified — recs 5, 6, 7, and 10 describe real report gaps, but their anchors are absent or incomplete.
- Open Questions: Q1–Q3 and the report half of Q4 describe real gaps; Q4's “supplied context says” clause needs a non-report provenance source. None of the four questions currently cites evidence.
- Overlay protocols: not applicable to this analytical file target.
- Resource-map coverage gate: skipped because `resource-map.md` is absent.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. Two required traceability defects remain: imprecise evidence anchors and uncited load-bearing claims. The prior browser-row P1 is downgraded to P2 because the report supports the semantic conclusion.

## Next Dimension

Maintainability — assess whether the findings/recommendations structure remains coherent and safely maintainable after the traceability corrections. The max-iterations policy still requires all five iterations.

Review verdict: CONDITIONAL

