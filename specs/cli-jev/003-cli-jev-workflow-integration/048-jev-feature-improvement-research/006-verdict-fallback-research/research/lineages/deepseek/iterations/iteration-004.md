# Iteration 4: Where else the same judgment would pay off

## Focus

Locate `.skilled` judgment points where a deterministic extractor reads a model-written artifact, a miss currently falls through to a default, and the same `choice`-over-a-fixed-key-set fallback plus keep-rule discipline could supply the missing judgment. Rank by fit, existing seam, and transferable evidence.

## Findings

1. **The direct production home is the reviewer scorer's own grader slot.** `classifyWithGrader` fires exactly when `extractVerdict` misses and `--grader llm` is set (`reviewer-scorer.cjs:155-167,169-171`); today it dispatches a process-isolated CLI rather than a typed classifier. Wiring the measured Jev column as a `jev` grader value reuses the same question, the same three keys, the same option-description contract and the measured keep (this run) with no new measurement logic; enablement sits behind `SPECKIT_REVIEWER_BENCHMARKS` (`reviewer-scorer.cjs:273-279`) and feature 025's own decision D5 keeps a `keep` from wiring itself. This is the only candidate that is simultaneously the same judgment, the same artifact family and already measured. [SOURCE: reviewer-scorer.cjs:155-171,273-279] [SOURCE: 025 spec.md Out of Scope: a `--grader jev` value needs a later phase and a `keep`] [SOURCE: iteration 2 finding 6]

2. **The residue flagger already emits its own miss list: skipped tables and unparsed rows in review reports.** `score-residue-flagger.cjs` parses review report tables and keeps only rows whose severity cell is exactly `P0|P1|P2`; a table with an unrecognized header goes to `skipped`, and a finding written outside the table shape never becomes a row. The deterministic verdict ladder in deep-review (FAIL/CONDITIONAL/PASS from active P0/P1 counts) therefore inherits whatever the parser missed. A fallback that classifies the severity of skipped or prose-embedded findings is the same judgment shape on a different key set; feature 033 measured Jev flagging as a `kill` on precision, so severity classification would be a new question, but the parser's `skipped` output is a ready-made candidate corpus source. [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs:139-206,335,353-363] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md: 033 kill]

3. **The deliverable extractor has an explicit low-confidence path where reasoning contaminates scoring.** `extractDeliverable` returns `high` for `<DELIVERABLE>` tags, `medium` for fences, and `low` with the whole transcript when neither exists; `run-benchmark.cjs` scores that whole text only when the contract is optional and fails the fixture when the contract is required. Every `low` extraction is a deterministic miss where a judgment about "what is the deliverable region" would prevent scoring reasoning as the answer — the same "extractor misses, judgment fills" shape with an existing confidence seam. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/extract-deliverable.cjs:8-13,30-38] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:188-205]

4. **Two more deterministic sub-scorers carry the same shape, one of them already Jev-validated.** `preplanning-regex.cjs` scores `0.0` whenever no `<pre-plan>` block exists, so a plan expressed in prose is treated as no plan; a fallback could answer "does this output contain a plan with the three required signals?". `hallucination-flag.cjs` extracts claimed flags and symbols against an allowlist, and the harness already pairs it with a semantic grader (`dispute.cjs`); the 024 Jev measurement returned a keep (`A=55 B=47`), which is direct evidence that the same judgment pays off on that surface — the remaining work there is transport integration, not proof. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs header] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs header] [SOURCE: 047 results.md: 024 keep A=55 B=47]

5. **One place the judgment should NOT go: runtime completion detection.** `fanout-run.cjs` reads a lineage's self-reported `stopReason` and, when it is missing or unrecognized, completes from on-disk artifacts rather than trusting the narrative (`isMaxIterationsStopReason`, `completionFromArtifacts`). A model fallback reading the synthesis prose would reintroduce exactly the self-report trust that the artifact check exists to bypass; the current design is already the correct shape and should be left alone. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:907-929,943-969]

6. **The reusable assets are the discipline, not the transport.** Across the candidates, what transfers is the label gate, the frozen keep rule, the option-rotation protocol, the append-only call log and the run-directory convention; the expensive part of each new candidate is its own labeled miss corpus, not the Jev plumbing. That ordering argues for one shared fallback harness feeding multiple typed questions rather than a per-scorer implementation. [SOURCE: iterations 1-3; score-verdict-fallback.cjs:44-60,700-863] [SOURCE: score-d4-agreement.cjs precedent named in deep-improvement/SKILL.md scoring bullet]

## Ranked Candidates

| Rank | Surface | Judgment | Seam today | Evidence in hand | Missing piece |
|------|---------|----------|------------|------------------|---------------|
| 1 | Reviewer scorer grader slot | Reviewer verdict on a regex miss | `--grader llm` branch (`reviewer-scorer.cjs:155-171`) | This run's keep, K=24 | A `jev` grader value and enablement |
| 2 | Residue flagger skipped rows | Severity of a finding outside the table | Parser emits `skipped` (`score-residue-flagger.cjs:196-204`) | 033 kill for flagging | A labeled severity corpus |
| 3 | Hallucination flag semantic gap | Whether a claimed symbol is real | Harness dispute path exists | 024 keep, A=55 B=47 | Transport integration |
| 4 | Deliverable extractor low path | What region is the deliverable | Confidence label returned | None | A corpus of `low` outputs |
| 5 | Preplanning regex zero path | Whether a plan exists in prose | Deterministic sub-scorer | None | A corpus and a question shape |
| - | Runtime completion detection | (should not be added) | Artifact fallback is correct | fanout-run.cjs:943-969 | none by design |

## Ruled Out

- Treating already-measured 047 features as answers to "where else": their keep/kill verdicts show where the judgment was tested, not where the same fallback shape is still available; the two cross-candidate signals are the 024 keep (integration pending) and the 033 kill (a different question on the same artifact family). [SOURCE: results.md]
- Replacing the artifact-based completion check with a model read: self-report unreliability is why the artifact check exists. [SOURCE: fanout-run.cjs:907-915,943-953]

## Dead Ends

- Searching `deep-review` for a severity parser of finding prose: the deterministic readers found are the report-table parser and the structured-record validators; prose findings without table rows appear to have no deterministic severity reader at all, which is why candidate 2 matters. [SOURCE: grep over `.skilled/skills/system-deep-loop/deep-review` and `runtime/lib/deep-loop`]

## Edge Cases

- Candidate 2's key set (P0/P1/P2) is a severity ladder, not the pass/fail/block contract; the keep rule and option protocol transfer, but `block`-style abstention has no analogue there and the question shape needs its own design. [SOURCE: score-residue-flagger.cjs:196-204]
- Candidate 3's novel claim sets already sit behind a deterministic cross-check, so the fallback would be a third opinion unless it replaces the CLI grader path outright; decide by measurement, not by preference. [SOURCE: hallucination-flag.cjs header; harness dispute path]

## Sources Consulted

- reviewer-scorer.cjs:155-171, 273-279; 025 spec.md (Out of Scope, section 7)
- score-residue-flagger.cjs:139-206, 335, 353-363
- extract-deliverable.cjs:8-13, 30-38; run-benchmark.cjs:188-205; fixture-lint.cjs:41
- preplanning-regex.cjs header; hallucination-flag.cjs header; bundle-gate.cjs header; cwd-check.cjs header
- runtime/scripts/fanout-run.cjs:907-929, 943-969
- deep-review/references/protocol/quick-reference.md:126-138, 162, 171-184
- 047 results.md (024 keep, 033 kill rows); deep-improvement/SKILL.md scoring bullet
- deep-research-strategy.md (read before iteration 4); steer.md (checked before iteration 4; absent)

## Assessment

- New information ratio: 0.82
- Novelty: the ranked cross-surface map is new; each candidate's seam citation is new to this lineage; candidate 1 was implied by iterations 2 and 3 but never framed as a transfer choice.
- Questions addressed: Q4 fully.
- Questions answered: Where else in .skilled would the same judgment pay off?
- Confidence: High for the seams and citations; the ranking's value ordering is judgment, with the measurement state of each candidate stated rather than assumed.

## Reflection

- What worked and why: searching for explicit miss outputs (`skipped`, confidence labels, zero-score paths) found seams that already surface their own failure lists, which is exactly what a fallback corpus needs.
- What did not work and why: no live `reviewer-report.json` or prose-severity corpus exists, so every candidate beyond rank 1 needs a labeling effort before it can be measured.
- What I would do differently: start from the parsers' own "unknown/skipped/low" outputs rather than from feature names; the miss lists are the entry point.

## Recommended Next Focus

Iteration 5: define what a default-on integration would need, its cost and risk, using the direct reviewer-grader slot as the reference design.
