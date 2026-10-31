# Iteration 1: Score and Detector Mechanics

## Focus
Reconstruct the reported score arithmetic and detector behavior, separating established causes from what cannot be attributed without the original rows.

## Actions Taken
1. Compared the reported 010 phase result with the feature 026 keep-rule definition.
2. Recomputed the absolute accuracy gain and paired disagreement count from the recorded totals.
3. Read the scorer's verdict and column-counting logic alongside the imported sentinel detector.
4. Checked the original spec's detector path against the import used by the scorer.

## Findings
1. **Significant paired edge, insufficient margin.** The Jev column is 102/110 (92.73%) against regex 93/110 (84.55%), a 9/110 = 8.18-point gain. The paired result is W=13, L=4; 13 of 17 discordant pairs yields the stated exact p-win 0.02452. The margin rule requires 10*(A-B) >= M, so it needs 11 net correct rows at M=110; the observed net is 9. The scorer checks margin before the sign test, so the correct verdict remains stop (margin). [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:146-153] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:480-488]
2. **Coverage and stability are strong on this measured set.** K=M=110 means every labeled row was measured. F=0 means every three-run Jev row agreed with its modal answer under the scorer's definition. Neither result validates the labels or shows that the sample represents other sessions. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/010-completion-claims-research/spec.md:60] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:508-531]
3. **The baseline recognizes tokens, not completion intent.** It scans the last 400 characters for ten exact words. It can miss other phrasings or claims outside that tail; it can also fire on a negated, quoted, interrogative, or reported use inside the tail. These are consequences inferred from the regex, not confirmed causes for particular rows. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:64-70] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:113-119]
4. **The ten missed labels cannot be explained from the aggregate line.** The phase spec supplies totals, but the real rows, label file, report and calls log are not present in this packet. The scorer's report schema retains row/label hashes and a per-word miss census, but its external report is unavailable here. The specific balance of vocabulary, tail position, ambiguity and annotation error is therefore unknown. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60-78] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:988-1009]
5. **A cited source path is stale.** Feature 026 points to runtime/lib/hooks/completion-evidence-sentinel.cjs; the scorer actually imports runtime/hooks/lib/completion-evidence-sentinel.cjs. The inspected detector behavior is supported by the scorer import and real file. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:69] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:39-45]

## Questions Answered
- Q1, with a material limit: paired advantage is significant, the uplift is 8.18 points and the margin threshold requires 10; aggregate data does not reveal the exact ten miss mechanisms.

## Questions Remaining
- Which accuracy changes improve recall without creating false fires, and what call reduction is supportable?
- Are the corpus and labels semantically valid and reproducible?
- Where should evidence-backed completion judgment be reused?
- What should default-on integration require and expose?

## Ruled Out
- Claiming vocabulary omissions alone caused every miss: the unavailable rows and report prevent that attribution.

## Dead Ends
- Reconstructing the miss-word distribution from K/M/A/B/W/L/F alone; those aggregates are not sufficient statistics for token-level causes.

## Assessment
- newInfoRatio: 0.80 (3 fully new findings, 2 partially new findings; (3 + 0.5*2)/5).
- Confidence: high on score arithmetic and detector mechanics; low on row-level root cause until the exact rows and report are available.

## Sources Consulted
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/steer.md — checked immediately before iteration 1; absent.
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60-78
- specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:69, 146-161
- .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:39-45, 480-531, 988-1009
- .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:64-70, 113-119

## Reflection
- Worked: arithmetic cross-checks separated the significant paired result from the stricter margin gate.
- Failed: no row-level raw material was available to attribute each miss or audit each label.
- Scope deviation: standard reducer, spec preinit writeback, and packet-level synthesis are not run because they resolve or write outside this lineage; the user limits every write to this directory.

## Recommended Next Focus
Audit scorer input integrity, label semantics, and the current call protocol to rank accuracy and cost improvements.
