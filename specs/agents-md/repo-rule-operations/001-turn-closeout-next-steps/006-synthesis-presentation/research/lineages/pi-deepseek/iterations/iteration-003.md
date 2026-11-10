# Iteration 3: Q5 Per-Mode Presentation Table

## Focus

The half the operator cares most about, and the half where a generic answer fails. For each of the
six deep-loop modes, what does the mode actually produce as its synthesized artifact, what should its
chat presentation carry, what should it not carry, and is "recommendations" even the right noun for
that mode? Each row is read from that mode's presentation contract Results Display section and its
SKILL.md, not from one shared model of what a loop produces.

## The Table

| Mode | Produces (synthesized artifact) | Chat should carry | Chat should NOT carry | Right noun? |
|------|--------------------------------|-------------------|-----------------------|-------------|
| **deep-research** | `research/research.md` compiled from every iteration (17 sections), `resource-map.md`, iteration files; negative knowledge is a first-class output | The answer or verdict to the question, the 2-5 headline findings that support it, the key uncertainty, the ruled-out direction that matters, the artifact path | Per-iteration narration, full evidence chains, internal metrics (`newInfoRatio`, thresholds), the full source list | **Findings**, with a recommendation only when the question was decision-shaped; the 001 run literally produced a verdict |
| **deep-review** | `review/review-report.md` (9 core sections), findings registry, P0/P1/P2 severities, `PASS|CONDITIONAL|FAIL` verdict, remediation plan | The verdict, each P0 named with `file:line`, P1 findings summarized, the fix-first pointer, the artifact path | The full report, every P2, methodology and dimension-coverage tables, severity definitions | **Findings plus remediation**, not recommendations: these are defects to fix and a verdict about them |
| **deep-ai-council** | Per-topic reports, a session report, a findings registry; a recommended plan with convergence on adjudicator-verdict stability (two-of-three) | The recommended direction and why, the agreement level including any dissent, risk caveats, artifact paths | Seat-by-seat deliberation, round transcripts, prompt scaffolding, cost internals | **Recommendations is correct**; the skill itself hands "recommendations, risk analysis" to implementation, but the dissent must travel or convergence reads as consensus |
| **deep-agent-improvement** | Packet-local candidates, deterministic 5-dimension scores, an append-only journal, `stopReason` plus `sessionOutcome`, a guarded promotion decision | What changed in the candidate, the score delta against baseline, the promote/keep-baseline/rollback recommendation and its evidence, the artifact location | Candidate file dumps, all five dimension tables every iteration, journal internals | **Candidate plus a promotion recommendation**; "recommendations" applies at the promotion gate, not to the artifact |
| **deep-model-benchmark** | `report.json`: per-fixture scores, aggregate, `scoringMethod`, threshold pass/fail; a continue/promote/stop call | The aggregate against `requiredAggregateScore`, the failing fixtures (or pass counts), the promotion-eligibility call, the report path | Raw grader output, per-fixture transcripts, fixture materialization detail | **Scores plus a benchmark verdict**; calling a measurement a recommendation is a category error |
| **deep-skill-benchmark** | `skill-benchmark-report.json` (verdict, D1-D5, funnel, ranked bottlenecks, scenario rows) and a `report.md` rendered from it | The verdict and aggregate, the ranked bottlenecks (the actionable content), the report path, the routed next step | Scenario rows, D-dimension internals, any verdict the loop host did not produce | **Verdict plus ranked bottlenecks**: a diagnosis, not recommendations |

## Per-Mode Evidence

**deep-research.** The contract defines the synthesis as `research/research.md` compiled at the synth
phase, "(17 sections)", and lists negative knowledge (ruled-out directions) as a first-class output
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:244,364]. The convergence
report the workflow produces carries stop reason, iteration count, answered ratio and the
`newInfoRatio` trend [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:415-421].
The completion display reports none of the content
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:270-277]. A research run that
answers a decision question produces a recommendation-shaped verdict; one that maps a topic produces
findings. The noun follows the question, which is why the 001 run could end in a verdict
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/research.md].

**deep-review.** The report carries nine core sections and is assembled from the findings registry
[SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:296-298]. Severity is P0 blocking,
P1 conditional, P2 advisory, and the verdict mapping is fixed by the iteration final-line contract
[SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:319-333,339-359]. The completion
display reduces all of that to counts and a verdict token
[SOURCE: .opencode/commands/deep/assets/deep-review-presentation.txt:355-364]. A count is not a
finding, which the packet spec already observed [SOURCE: specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/spec.md:66].

**deep-ai-council.** The skill's cross-workflow contract says the council "hands recommendations,
risk analysis, and packet-local artifacts to implementation agents or the top-level caller"
[SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:459-461]. Convergence runs on
adjudicator-verdict stability with a two-of-three rule, so "converged" is itself a claim about
agreement that a bare success line does not transmit
[SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:305,14]. The completion display
lists topics, rounds, stop reason, the threshold and artifact paths
[SOURCE: .opencode/commands/deep/assets/deep-ai-council-presentation.txt:290-299].

**deep-agent-improvement.** Lane A writes packet-local candidates, scores them on five deterministic
dimensions (structural, rule coherence, integration, output quality, system fitness) and promotes
only through guarded gates [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:214-222].
Every session must end with both a `stopReason` and a `sessionOutcome` (`keptBaseline`, `promoted`,
`rolledBack`, `advisoryOnly`) [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:258-271].
The completion display reports dimension scores and a weighted score
[SOURCE: .opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:344-371]. The reader's
decision is promotion, so the recommendation belongs at that gate, not attached to the artifact.

**deep-model-benchmark.** Lane B runs materialize-then-benchmark over fixtures and scores against a
profile, sharing the candidate/dispatcher/scorer seams with Lane A but never mutating an agent
[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:226-235]. Its Results Display
instructions are the only ones that name a recommendation field: "Recommendation: continue, promote
(if eligible), or stop" [SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:310-315],
while the example output shows fixture scores, an aggregate and a stop reason
[SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:331-357]. The
recommendation there is an eligibility call about the score, not a synthesis of findings.

**deep-skill-benchmark.** This lane "emits a ranked Skill Benchmark Report with concrete, remediable
findings" and its Report phase output is "Verdict, dimension scores, ranked bottlenecks"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:55-65]. The JSON report
is the machine record and the router "never synthesizes a verdict"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:77-87]. The presentation
boundary forbids the router from emitting "benchmark scores, verdicts, ranked bottlenecks, scenario
rows, report wording" [SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:115-119].
The actionable content is the ranking, and remediation routes to another lane
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:109-113].

## The Line Across All Six

The common denominator is not "recommendations". It is the synthesized conclusion plus the smallest
set of specifics that changes what the reader does next. For research, agent improvement and model
benchmark the next action is a decision, so a recommendation belongs in the message. For review and
skill benchmark the next action is a fix, so the message owes named defects or ranked bottlenecks.
For council the next action is a plan, so the message owes the direction and the dissent. Every mode
also owes the artifact path for provenance. None owes its internals.

## Question Answers

- **KQ-5: answered.** Six distinct rows, each derived from that mode's own contract, with four
  distinct noun answers: findings (research), findings plus remediation (review), recommendations
  (council), candidate plus promotion recommendation (agent improvement), scores plus benchmark
  verdict (model benchmark), verdict plus ranked bottlenecks (skill benchmark).

## Ruled-Out Directions

- **One generic "present the recommendations" answer across six modes.** The contracts produce
  different artifacts, and two of them (model benchmark, skill benchmark) do not produce
  recommendation-shaped output at all. A single answer would misfile four modes.

## New Information Ratio

0.9. The per-mode artifacts, the noun analysis and the cross-mode line are net-new; the templates'
missing content fields are pinned per mode with line numbers rather than as one claim.
