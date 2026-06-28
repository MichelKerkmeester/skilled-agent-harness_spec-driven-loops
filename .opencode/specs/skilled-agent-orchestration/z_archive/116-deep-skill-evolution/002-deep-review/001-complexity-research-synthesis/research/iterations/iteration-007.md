# Iteration 007: Output Contracts And Synthesis Masking Risk

## Focus

Evaluate deep-review output contracts and synthesis behavior. Determine whether final reports can hide shallow searches by emphasizing verdicts, summaries, or severity tables without preserving null-search evidence, rejected hypotheses, and missed-class risks.

## Actions Taken

1. Read the active research packet state, dashboard, strategy, and iterations 001-006 before inspecting new surfaces.
2. Inspected deep-review synthesis workflow sections, the loop protocol report contract, the review-mode contract, and quick-reference report-section list.
3. Inspected reducer and dashboard rendering behavior for whether ruled-out paths, dead ends, null-search evidence, and missed-class risks survive into operator-facing summaries.
4. Inspected `sk-code-review` output contracts and checklists to compare findings-first human review behavior against deep-review's synthesis needs.
5. Read representative `review-report.md` examples to see whether reports preserve null-search evidence consistently or mostly present verdict, severity, clean-area, and planning summaries.

## Findings

1. Deep-review synthesis derives the headline verdict from active severity counts, not from search-depth proof. The YAML maps any active P0 to `FAIL`, any active P1 to `CONDITIONAL`, and otherwise `PASS`, with `hasAdvisories` only when PASS has active P2s [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1088]. The required Executive Summary then asks for verdict, advisory bit, active counts, and scope summary [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1171]. That is appropriate for release routing, but it can make a shallow review look complete when no active P0/P1 was found and no separate search-ledger gate exists.

2. The report contract preserves active findings much more strongly than null searches. The Planning Packet must include active findings, remediation workstreams, finding classes, affected surfaces, and fix-completeness metadata, and missing finding fields must be marked `UNKNOWN` rather than inferred from prose [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1177]. The Active Finding Registry requires ID, severity, title, dimension, file:line, evidence, impact, fix recommendation, disposition, `findingClass`, `scopeProof`, and `affectedSurfaceHints` [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1183]. There is no symmetric required registry for rejected hypotheses, negative searches, missed-class risks, unsearched producers, unsearched consumers, or absent test classes.

3. Null-search evidence appears only as a late, underspecified audit item. The synthesis instructions put "ruled-out claims" and "sources reviewed" in the Audit Appendix after Deferred Items [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1208], and the loop protocol's section table similarly makes Audit Appendix the final section for coverage, replay validation, and convergence evidence [SOURCE: .opencode/skills/deep-review/references/loop_protocol.md:464]. Because the appendix has no required row schema, minimum counts, or candidate-class coverage fields, a report can satisfy the contract with a terse sentence instead of durable negative evidence.

4. The state schema makes this masking possible because `ruledOut` is optional while findings details are required. Required iteration fields include counts, `findingsNew`, `findingDetails`, and `newFindingsRatio`; optional fields include `ruledOut`, `noveltyJustification`, `coverage`, and `graphEvents` [SOURCE: .opencode/skills/deep-review/references/state_format.md:205]. The prompt-pack delta stream may include `ruled_out` records, but the example only lists them as one event type among finding, classification, and traceability records [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:86]. This means the workflow can reject a missing iteration record, but not a missing null-search ledger.

5. The dashboard is especially vulnerable to hiding shallow searches. The rendered dashboard includes status, provisional verdict, severity counts, progress, dimension coverage, blocked stops, graph convergence, trend, corruption warnings, next focus, and active risks [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1120]. Its Active Risks section explicitly surfaces P0/P1/P2 debt, failed claim-adjudication, and blocked-stop events, then falls back to "None active beyond normal review uncertainty" when those are absent [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1215]. The asset template contains a "RESOLVED / RULED OUT" section for disproved findings and dead-end paths [SOURCE: .opencode/skills/deep-review/assets/deep_review_dashboard.md:84], but the live reducer-rendered dashboard does not emit a comparable ruled-out section. Operators scanning the dashboard can see release debt, not search debt.

6. The convergence model reinforces the same asymmetry. The highest-weight convergence signal is dimension coverage: every configured dimension and required traceability protocol covered, stable for the configured passes [SOURCE: .opencode/skills/deep-review/references/convergence.md:211]. A clean pass sets `newFindingsRatio = 0.0` [SOURCE: .opencode/skills/deep-review/references/convergence.md:363]. That is sensible if "no findings" follows a strong search, but the current output contract does not require proof that relevant bug classes were searched before zero novelty is treated as convergence-friendly.

7. `sk-code-review` is optimized for human findings-first review, not null-evidence preservation. Its doctrine says every P0/P1 needs concrete `file:line` evidence and findings should appear before summary or praise [SOURCE: .opencode/skills/sk-code-review/references/review_core.md:30] [SOURCE: .opencode/skills/sk-code-review/references/review_core.md:39]. Its interactive report flow is "scope, findings, merge posture, next action" [SOURCE: .opencode/skills/sk-code-review/references/review_ux_single_pass.md:34]. That is right for a single-pass review response. Deep-review synthesis needs an added machine contract because multi-iteration PASS/CONDITIONAL claims depend not only on what was found, but on what was deliberately searched and ruled out.

8. Existing review reports show the variance. A strong report can preserve some null-search information: the 096 re-review has Deferred Items that record specific ruled-out or severity-granularity items with dispositions [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/096-rename-opencode-dirs-to-plural/007-track-rereview/review/review-report.md:357]. Other reports emphasize the verdict and active registry while leaving null-search evidence thin: the 101/003 report's Audit Appendix records iterations, dimension coverage, graph convergence, "No P0 findings were identified", and claim-adjudication status, but no rejected-hypothesis matrix [SOURCE: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/review-report.md:78]. The 114/007 PASS report has a detailed verdict and dimension table, then points to iteration files as the evidence trail rather than embedding a null-search ledger in the report [SOURCE: .opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-models-rename/review/review-report.md:41] [SOURCE: .opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-models-rename/review/review-report.md:113].

9. The direct answer is yes: final reports can hide shallow searches by emphasizing verdicts, severity tables, planning packets, and clean-area summaries while leaving null-search evidence optional, late, and unstructured. The current contracts make active findings auditable and remediation-ready, but they do not make absence-of-finding claims equally auditable. Deep-review should therefore add a first-class `Search Ledger` or `Candidate Coverage Matrix` to both iteration records and synthesis reports, with required rows for candidate bug class, invariant, producer, consumer, negative/hostile test searched, evidence path, result, and disposition (`finding`, `ruled_out`, `deferred`, `blocked`, or `not_applicable`).

## Questions Answered

- Can final reports hide shallow searches? Yes. They can satisfy the current synthesis shape through verdict, active findings, dimension coverage, and audit-summary prose without preserving structured null-search evidence.
- Where is the masking strongest? Dashboard and synthesis surfaces. The dashboard does not render a ruled-out/search-debt section, and synthesis puts ruled-out claims in the last appendix without a required schema.
- Is this a flaw in findings-first review doctrine? Not exactly. Findings-first is right for review communication. The gap is that deep-review uses findings-first output as a convergence artifact, where "no finding" also needs evidence.
- What should change first? Add a required search ledger/candidate matrix and make synthesis report both active findings and clean/ruled-out candidate classes with the same file:line discipline.

## Questions Remaining

- Should the search ledger be required on every iteration, or only on code/spec review targets above a scope-size or risk threshold?
- Should validator enforcement live first in post-dispatch validation, reducer state, synthesis replay, or all three?
- How should old review packets remain readable while new packets fail closed on missing candidate-search evidence?
- What exact candidate-class taxonomy should seed the ledger without overfitting to the current workflow: correctness boundary, contract/data-flow, security sink, producer/consumer, invariant, negative test, resource-map traceability, and graph hotspot?

## Next Focus

Design the minimum enforceable search-ledger contract for deep-review: JSONL fields, delta record types, report section shape, validator checks, reducer dashboard rollup, and backward-compatible migration behavior.
