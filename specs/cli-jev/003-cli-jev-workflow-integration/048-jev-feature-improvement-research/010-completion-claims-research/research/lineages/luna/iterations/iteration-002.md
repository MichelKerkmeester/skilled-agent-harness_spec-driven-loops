# Iteration 2: Accuracy, Cost, and Measurement Trust

## Focus
Audit input integrity, label semantics, synthetic tests, and the scoring call protocol; rank accuracy and cost improvements that preserve the current run as a fixed historical result.

## Actions Taken
1. Traced row and label parsing through row-map construction.
2. Compared the fixed semantic question with the synthetic yes-label fixture.
3. Checked the word-level error attribution against the detector's actual whole-word matcher.
4. Derived planned Jev call volume and reviewed available report provenance fields.

## Findings
1. **The happy fixture contains two semantic label conflicts.** “The failure occurred.” and “The outage happened.” are marked yes, but the frozen question is “Does this turn end by claiming the work is complete?” A generic event report is not a completion claim. The mismatch lowers trust in those synthetic labels and the claimed semantic coverage of the happy fixture. It does not demonstrate any error in the real 110-turn labels, which are absent. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl:9-10] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy.jsonl:9-10] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:68-69] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:128]
2. **Row and label ID uniqueness is not enforced.** parseRows accepts repeated IDs; rowsById later collapses repeated rows. parseLabels overwrites a repeated label ID via Map.set. The code has checks for unknown row IDs and bad yes/no values, but duplicates could silently alter counts. The provided 110-row report does not expose whether this occurred. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:103-125] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:172-194] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:910-924]
3. **The per-word missed-claim explanation can be wrong while headline counts remain right.** firstClaimWord uses substring search, not the detector's whole-word regex. A missed row containing “unfixed” can be attributed to “fixed”; this changes diagnostic allocation, not fire decisions or total B. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:223-235] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:260-267] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:64]
4. **Accuracy should be improved with a recall-first candidate detector and an intent check, then measured on a semantic holdout.** Expand candidate patterns only from adjudicated misses, preserve polarity/quotation/subject context, and test both classes by runtime. Because the regex reportedly missed all ten positive labels, it must not gate model review of silent rows; a regex-only gate cannot recover those misses. This recommendation is an inference from the reported misses and call shape; it needs a holdout run to confirm. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:64-70] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:138]
5. **The Jev cost envelope is 331 planned calls for 110 labels.** The scorer runs one auth test and three uncached judgments per row; it sends the full tail per rerun and estimates tokens, not currency. A later pre-registered comparison can test one call per row plus targeted repeats for uncertain or disagreeing cases, but that changes the protocol and cannot be applied retroactively. For trust, keep the existing rows/labels hashes and add unique-ID checks, dual annotation with adjudication, a runtime-stratified holdout, per-runtime confusion tables, and cluster-aware uncertainty if multiple turns come from the same session. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:712-729] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:988-1009] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:87-95] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:146-153]

## Questions Answered
- Q2: use adjudicated examples to expand a high-recall local candidate layer; retain semantic context checks; do not gate on the current regex; evaluate cost reductions as a newly registered protocol.
- Q3: enforce unique IDs, audit fixture semantics, double-label and adjudicate, stratify by runtime and conversation, and retain content hashes plus full call/model provenance. The current hashes help identity but do not establish label validity or representativeness.

## Questions Remaining
- Where else in .skilled would evidence-backed completion judgment help?
- What exactly must default-on integration require, cost and risk?

## Ruled Out
- Using the current regex as the only gateway to Jev. The reported misses mean this design cannot recover silent positive rows.
- Treating the synthetic happy fixture as semantic gold for all ten trigger words without reviewing the two generic-event labels.

## Dead Ends
- Inferring the real corpus's duplicate rate, annotation quality, runtime-specific accuracy, or turn clustering from aggregate K/M/A/B/W/L/F.

## Assessment
- newInfoRatio: 0.80 (3 fully new findings, 2 partial: (3 + 0.5*2)/5).
- Confidence: high on parser, fixture and call-count behavior; recommendations require a revised, blinded holdout evaluation.

## Sources Consulted
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/steer.md — checked immediately before iteration 2; absent.
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/deep-research-strategy.md and /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/deep-research-state.jsonl
- .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:56-57, 68-69, 103-125, 172-194, 223-267, 712-729, 988-1009
- .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl:9-10
- .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy.jsonl:9-10
- .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts:214-264
- specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:87-95, 125-142, 146-153

## Reflection
- Worked: reading fixture rows beside their labels exposed a concrete synthetic-label contradiction; following map construction exposed integrity cases the parser tests omit.
- Failed: no external 110-row artifacts were available to assess their labels, duplicates, sampling or model calls.
- No code or fixture was changed; this remains research-only.

## Recommended Next Focus
Map existing completion-evidence consumers in .skilled and define a safe default-on integration boundary with cost and risk.
