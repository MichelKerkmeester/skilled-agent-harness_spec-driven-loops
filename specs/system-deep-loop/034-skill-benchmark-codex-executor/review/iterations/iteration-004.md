BINDING: mode=review target_agent=deep-review
BINDING: leaf=true target_read_only=true dimension=correctness+traceability-adversarial-reverification

# Deep Review Iteration 004

## Dimension

Correctness + traceability adversarial re-verification of all four active P1 findings. This pass acts as hunter, skeptic, and referee; it does not synthesize the final recommendations reserved for iteration 5.

## Files Reviewed

- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:3]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:12]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:12]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:12]
- [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:12]

## Findings by Severity

### P0

None.

### P1

#### R2-P1-002 — CONFIRMED, with an expanded uncited-claim list

- File: [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:99]
- Referee result: The active list is incomplete. Recommendations 6, 7, **8**, and 10 lack direct report citations; recommendation 8's report-schema claim at lines 107-109 was omitted from the register. All four Open Questions also lack citations. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:99] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:103] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:107] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:115] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:119]
- Provenance: The authorship and “Verified by Claude” statements cannot be established from benchmark reports. They require an audit/context artifact or narrower wording. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:3]
- Counterevidence sought: Every recommendation's Evidence paragraph and nearby paragraph-level links were checked. Recommendation 9 has a citation, though its one-row anchor is a precision issue covered by R2-P1-001 rather than an absent-citation issue. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:111]
- Alternative explanation: Earlier report links could be intended as blanket document sourcing, but they do not make later actionable claims or external verification provenance independently auditable.
- Final severity: **P1**, confidence 0.99.
- Downgrade trigger: Cite recommendations 6, 7, 8, and 10 plus each retained Open Question; cite non-report provenance for authorship/verification or remove those assertions.

#### R3-P1-001 — CONFIRMED P1, but narrowed to the central synthesis and holdout plan

- File: [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:69]
- Raw population check: mcp-tooling is 4 fitted + 2 holdout; sk-doc is 19 + 0; sk-code is 30 + 0; both Tier-1 reports are 9 + 0. Only mcp-tooling has holdouts, and that control has no routing gold. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:14] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:17] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:18] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:15] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:18]
- Referee result for recommendations 1-2: **Not overreach.** They are conservative operating policies: recommendation 1 requires deterministic leaf validation, and recommendation 2 prohibits unattended use after 13/18 fitted failures. Lack of holdouts strengthens the case for caution; it does not invalidate that policy. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:77] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:81]
- Referee result for recommendation 3: **False-positive subclaim.** It labels the reads/recall relationship as an intervention to retest rather than a proven causal rule. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:85]
- Surviving P1: “The real Luna signal” and Tier-1 “confirms” language generalize beyond fitted suites, while recommendation 10 limits the holdout remedy to sk-doc/sk-code even though Tier-1 supports the cross-skill conclusion. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:69] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:115]
- Alternative explanation: The provenance header scopes the subject configuration, and Tier-1 supplies a counterexample to absolute incapacity. That does not establish performance beyond these fitted suites.
- Final severity: **P1**, confidence 0.93.
- Downgrade trigger: Scope the cross-skill conclusion to these suites/configuration and include Tier-1 in the holdout requirement. Recommendations 1-3 need no P1 change.

### P2

#### R2-P1-001 — DOWNGRADED P1 → P2

The exact-line taxonomy from iteration 2 is correct: **2 full, 8 partial, 12 scenario-id-only**. A 10-anchor referee sample reproduced it:

| Draft line | Report anchor | Exact cited line | Exact-line class |
|---:|---|---|---|
| 17 | mcp-tooling:12 | aggregateScore 100 | partial |
| 23 | MT-004:181 | scenarioId MT-004 | scenario-id-only |
| 23 | MT-H02:661 | scenarioId MT-H02 | scenario-id-only |
| 33 | SD-008:406 | scenarioId SD-008 | scenario-id-only |
| 37 | SD-012:1751 | scenarioId SD-012 | scenario-id-only |
| 71 | Tier-1 opencode:12 | aggregateScore 86 | partial |
| 91 | Tier-1 opencode:12 | aggregateScore 86 linked as “86” | full |
| 91 | Tier-1 codex:12 | aggregateScore 85 linked as “85” | full |
| 97 | mcp-tooling:12 | aggregateScore 100 linked as “100/PASS” | partial |
| 113 | MR-001:1231 | scenarioId MR-001 | scenario-id-only |

[SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:17] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:23] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:33] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:37] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:91] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:97] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:113]

- Referee rationale: The shared doctrine requires a concrete file:line citation tied to observed behavior; it does not require every supporting scalar to appear on the one physical line. A scenarioId line is an unambiguous structured-record start, and following each sampled object reached the fields used by the claim. Those 12 anchors therefore provide block-level partial support rather than no support.
- Remaining defect: The eight aggregate links still underspecify multi-field sentences, and exact-field/range anchors would be better. That is citation precision, not a required correctness fix.
- Final severity: **P2**, confidence 0.98.

#### R3-P1-002 — DOWNGRADED P1 → P2, with the omission sweep folded in

- Equality: D1intra equals D2 in all five reports — Tier-2 100/100, 24/24, 65/65; Tier-1 100/100 and 98/98. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:44] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:48] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:44] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:48] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:44] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:48] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:49] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:53] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:49] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:53]
- Proxy label: router-replay-recall exists in row-level data in every report. The exact counts are 6 mcp-tooling, 19 sk-doc, 23 sk-code, and 9 in each Tier-1 report. The earlier phrase “all 30 sk-code rows omit intentRecall” was inaccurate: 23 replay rows serialize intentRecall as null; seven MR/CB browser rows lack that live metric block. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:250]
- D5: Tier-2 reports score 100; both Tier-1 reports score 97. All five set hardGate=true and gateFailed=false. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:61] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:61] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:61] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:64] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:66] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:69] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:66] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:69]
- Weighting: The scored non-gate dimensions allocate 13 points to D1, 20 to D2, and 15 to D3; the duplicated D1/D2 signal therefore occupies 33/48 of that point budget. D5 is a separate hard gate, not another averaged performance dimension. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:44] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:48] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:52] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:61]
- Referee rationale: The semantics omission is real, but the draft never explicitly claims D1/D2 statistical independence, reports D5 values in the Tier-2 table, and bases the operational recommendations on scenario-level recall rather than D5. The missing explanation does not reverse a conclusion.
- Final severity: **P2**, confidence 0.97. Add a “How to read these scores” note in iteration 5; no separate P1 arises from Tier-1 D5, intentRecall semantics, or aggregate weighting.

Existing P2 findings R1-P1-001 (absent versus null liveEvidence wording) and R3-P2-001 (Open Questions duplication) remain unchanged; they were not re-opened.

## Traceability Checks

- Core spec_code: **partial**. Exact-line count remains 2/22 full, but all 12 scenarioId pointers are accepted as usable structured-block anchors.
- Core checklist_evidence: **partial**. Two P1s remain: incomplete claim citations/provenance, and fitted-only cross-skill generalization.
- Generalization blocks: **verified** across all five reports.
- Measurement semantics: **verified** for D1/D2 equality, proxy presence, D5 hard-gate values, intentRecall null/absence behavior, and non-gate point allocation.
- Omission sweep: **complete**. Tier-1 D5=97, intentRecall semantics, and aggregate weighting are consolidated into R3-P1-002 at P2; no additional finding is needed.
- Overlay protocols: not applicable.
- Resource-map coverage gate: skipped because resource-map.md is absent.

## SCOPE VIOLATIONS

None.

## Verdict

**CONDITIONAL.** The adversarial pass reduces the active required findings from four P1s to two: R2-P1-002 and the narrowed R3-P1-001. R2-P1-001 and R3-P1-002 become P2 advisories. No P0 exists.

## Next Dimension

Iteration 5: synthesize the adjusted final recommendations from the two surviving P1s and four P2 advisories. No final recommendation wording is synthesized in this iteration.

Review verdict: CONDITIONAL
