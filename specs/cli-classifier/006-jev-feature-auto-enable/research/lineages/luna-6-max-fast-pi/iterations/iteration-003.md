# Iteration 3: Routing-clarify evidence, eligibility, and serving seam

## Focus
Test feature 020's fixture result against current compiled-router behavior, distinguish mode suggestions from abstentions, and identify the evidence and contract changes required before any served suggestion.

## Actions Taken
- Re-read canonical state and strategy; Q1 and Q2 are recorded, so selected the next planned focus, routing clarify default.
- Read the scorer's zero-call census, score-time router replay/refusal, label gate, class/hub reporting, and current normalized routing output.
- Compared the 047 fixture keep with feature 020's corpus definition and the later 049/006 replay and census records.
- Reconciled the reported 359 versus 365 prompt counts by separating mode clarifications from checklist clarifications and noting the corpus revision.

## Findings
1. **P0 — Do not treat the 54-row keep as a current-router result.** The 047 authored fixture kept Jev at 28/54 against the first alternative at 15/54, with 34 `none_of_these` labels. The improved scorer replays each supplied row against the current compiled router before scoring: 42/54 now route rather than clarify, leaving 12 labeled rows, below the 30-row gate, so the current scorer stops before any model arm. Confirmation: only score rows with a pinned router build, actual `action: clarify`, unchanged mode alternatives, and recorded label provenance; reject every row that fails replay. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:637-695] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1521-1561] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:25-30]
2. **P0 — Measure real eligible volume and collect shadow labels before paying for more model rows.** Feature 020's committed-corpus spec records 2 mode-alternative clarifications in 359 prompts and zero gold-in-alternatives. A later read-only census reports 3 total clarifications in 365 prompts: 2 mode clarifications plus 1 checklist clarification; the denominator changed and the 3rd item is not a mode suggestion. Both say the real-use rate remains unmeasured without transcripts. At 2 eligible mode clarifications per 365 prompts, exact 80%-power estimates require 69 discordant pairs at a 0.65 win rate (about 32,000 committed prompts at the fixture's discordance rate), making shadow collection with user picks as labels the practical next step. Confirmation: count actual `action: clarify` events by hub from consented, redacted session metadata, record accepted/overridden picks as labels, and publish counts before another Jev run. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:72-90] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:18-23] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:32-45] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:417-433]
3. **P1 — Separate named-mode skill from abstention, and require the strongest simple baseline.** Twelve of Jev's 17 wins on the fixture are `none_of_these` answers; Jev names a mode correctly on 16/20 named-mode rows versus 15/20 for the first alternative, while always-none scores 34/54 versus Jev's 28/54 overall. The scorer now exposes hub/class results and the strongest baseline, but the keep rule still compares the first alternative rather than requiring a win over always-none; the 21 fixture discordant pairs also miss the power requirement. Confirmation: report named-mode accuracy, false-default rate, abstention precision/recall, coverage and confusion per hub; pre-register absolute/class floors and require improvement over the strongest safe policy on a powered, held-out shadow set. [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:32-45] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:732-760] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:704-722] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:150-166]
4. **P1 — No served suggestion fits the current normalized route contract.** The compiled engine exposes clarify alternatives to the scorer, but `compiledRoute` returns only hub/action/selection/targets/policy hash/generation, and the front door prints that normalized shape; feature 020 explicitly leaves serving and an alternatives event/contract change out of scope. After proof, an additive suggestion could be shown only beside a genuine mode `clarify`, validated against its exact alternatives and the same hub/policy hash/generation, and left for user confirmation; `none_of_these`, timeout, missing auth, malformed output or generation drift must preserve the plain clarify. Confirmation: routing-owner contract tests prove the alternatives/suggestion binding, while stubbed feature-gate and failure tests prove the legacy clarify is unchanged when disabled or unavailable; start with shadow, then canary, and only then consider live. [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:94-108] [SOURCE: .skilled/bin/compiled-route.cjs:26-51] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:212-213] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:54-73] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185]

## Ruled Out
- Scoring the supplied 54 rows without current-router replay; that measures ineligible rows and bypasses the 30-row label gate.
- Treating `none_of_these` recognition as named-mode accuracy or as a useful served default.
- Serving a suggestion through the current normalized routing contract, which does not expose alternatives.
- Inferring live rate from the committed census; both source versions explicitly say real-session rate is not measured.

## Dead Ends
- The original tie fixture cannot provide current model-arm evidence after the replay gate: only 12 of its 54 rows remain eligible, below 30 labeled rows.
- A one-number pooled keep against first-alternative order does not settle whether an optional mode suggestion beats abstention or the strongest safe policy.

## Edge Cases
- Ambiguous input: none; only actual mode-alternative clarifications count as suggestion opportunities, not checklist clarifications.
- Contradictory evidence: the older spec says 2 mode clarifications in 359 prompts; the later census reports 3 total in 365 (2 mode + 1 checklist). This reconciles as updated denominator and distinct eligibility classes; the transcript-derived production rate remains unknown.
- Missing dependencies: actual user transcripts and their accepted/overridden picks are not available in this read-only corpus.
- Partial success: the committed census and current router replay bound the opportunity and fixture eligibility, but neither supplies real-use shadow labels.

## Sources Consulted
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:108-159,417-433,637-695,704-722,732-760,1521-1569`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:70-104,134-147,150-166,198-213`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:94-110`
- `.skilled/bin/compiled-route.cjs:26-54`
- `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-003.md:18-73`
- `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185`

## Assessment
- New information ratio: 0.5.
- Novelty justification: all four findings refine already-known fixture and seam concerns with current scorer-path evidence; the census version difference is clarified, but the central proof-or-retire conclusion is not wholly new.
- Questions addressed: feature 020's corpus, labels, keep rule, power, hardening, integration and tests.
- Questions answered: “What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle routing clarify default?” — answered as a shadow-first protocol; real eligible traffic and user-pick labels remain unavailable.
- Questions remaining: alignment folder suggestion and the unified cross-feature proof-or-retire rule.

## Reflection
- What worked and why: tracing scorer replay through the current engine separated authored near-tie examples from actual mode clarifications; comparing class-level outcomes showed how abstentions drive the headline keep.
- What did not work and why: committed prompts do not contain enough eligible, labeled clarifications; without transcript/shadow data, production volume and value remain unknown.
- What I would do differently: inspect the alignment question's state inputs and its distractor control before considering any new save corpus.

## Questions Answered
- What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle routing clarify default?

## Questions Remaining
- What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?
- What unified proof-or-retire rule and ranked next step applies across the three candidates?

## Next Focus
Inspect feature 022's prompt, full-path candidate resolution, labels and distractor-state control; decide whether a masked-state ablation can distinguish semantic destination choice from visible-state copying.
