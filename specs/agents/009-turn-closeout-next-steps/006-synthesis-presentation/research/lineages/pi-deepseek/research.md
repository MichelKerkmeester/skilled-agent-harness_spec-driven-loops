# Synthesis Presentation: Repo Rule or Mode Contract? Research Synthesis

Detached fan-out lineage `pi-deepseek`, session `fanout-pi-deepseek-1789135481636-tk5wla`.
Four iterations, `stopPolicy: max-iterations`, convergence never invoked as a stop.

**Question:** does presenting a synthesized set of recommendations in chat earn its own repo rule,
and what does each of the six deep-loop modes owe the reader given what that mode actually produces?
The operator's request, verbatim: "synthesized recommendations should always be presented in chat in
simple and concise terms, structured written with HVR".

**Method:** the four decision tests in
`.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`, run in order, against the
live corpus (`REPO RULES.md`, all ten `repo-rules/` files, `AGENTS.md`), the six deep-loop
presentation contracts under `.opencode/commands/deep/assets/`, the three mode SKILL.md files they
belong to, and the HVR standard. Read-only research: no file outside this lineage directory was
written, and no rule text was drafted.

---

## Q1. Always-Loaded Test

**Answer: trigger-shaped, not always-loaded. No unconditional binding is forced.**

The test: "A rule file loads on a trigger. Content that must bind when no trigger has fired cannot
live in one." Ask: "on a turn where nothing fires, must this still hold?" A yes routes the content to
`AGENTS.md` as a compressed row
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:30-41].

Gate 5 is the only mechanism that loads the router and its rule files, and its trigger is "the FIRST
write of the session ... Read-only turns never fire it" [SOURCE: AGENTS.md:121-122]. With nothing
fired, the router's own fallback says "`AGENTS.md` alone governs" [SOURCE: REPO RULES.md:18].

That mechanics does not force a row here, for a reason the close-out obligation did not have.
Presenting a synthesis is conditioned on having produced one, and producing one is a write turn: the
loop writes iteration files, state and the synthesis before it presents
[SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:271-275]. The trigger table already
carries the matching rows, "present a recommendation, a fork, or a trade-off" and "close out a turn"
[SOURCE: REPO RULES.md:47-48]. The close-out obligation had to bind unconditionally because every
turn ends, including turns that write nothing; a synthesis presentation does not occur on every turn.
The doctrine doc records the general rule for the communication move, "A total move needs a total
trigger, or the content goes quiet" [SOURCE: decision-tests.md:48-51].

The one case that escapes the trigger is a later read-only turn where the operator asks what a
finished run concluded. No rule file loads there, and neither does `communication.md`. The framework
already accounts for that boundary: `AGENTS.md` section 8 keeps the two clauses "that bind regardless
of what loads" [SOURCE: AGENTS.md:428], and the section 10 close-out row binds the turn end with no
rule file at all [SOURCE: AGENTS.md:518].

The presentation moment itself is reached by the mode's own contract, which the command loads as part
of running the mode: deep research's contract is the "Presentation source of truth for
`/deep:research`" and owns "final result displays"
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:3,19]. That path also covers
non-interactive dispatch, where the delegation rule requires the brief to pre-resolve what the
delegate cannot ask: "Nobody is at its prompt, so it stops forever and reports success"
[SOURCE: repo-rules/delegation-and-orchestration.md:102-107]. A fan-out lineage's terminal message
must therefore carry the presentation intent in its own contract, not in a rule it may never load.

**Consequence:** Q1 passes. The behaviour continues to test 2 and needs no `AGENTS.md` row for the
presentation content.

---

## Q2. Scope Boundary Test

**Answer: In. No fifth widening is needed.**

The router's section 4, quoted verbatim. **In:** "how to think and act, restraint, scope, evidence,
risk, diagnosis, honesty, the posture to hold when work is handed to another runtime, how the
resulting reply reads, what you may claim about wiring you have changed, and how a turn hands control
back to the operator. Delivery joined the list when `AGENTS.md` §8 moved down; it is the one rule
here whose trigger is every substantive reply rather than a specific action, and §8 keeps the two
clauses that must bind even when nothing loads." [SOURCE: REPO RULES.md:75-81] **Out:** "skill
routing, workflow selection, spec-folder mechanics, and the *mechanics* of agent and CLI dispatch:
which agent, which command, which model, which flags. Those belong to `AGENTS.md` §2 and the skills it
routes to, and are deliberately absent here so each has exactly one place to change. The line is
between plumbing and posture: how to dispatch is theirs, how to think while dispatching is ours."
[SOURCE: REPO RULES.md:83-87]

The proposal is "how the resulting reply reads", an explicit In clause [SOURCE: REPO RULES.md:77],
and the trigger table already routes reply delivery on it [SOURCE: REPO RULES.md:47]. It selects no
runtime, agent, command, model or flag, so none of the Out clauses touch it.

The fourth widening, read in full, is the ask-surface carve-out. It admits "naming the surface that
asks the operator a question, in the runtime you are already running in", on the ground that nothing
is being selected, and it pre-refuses a fifth that "let a rule pick between runtimes"
[SOURCE: REPO RULES.md:96-107]. This proposal is not a surface-naming rule at all; it is delivery of
content the mode already produced. It fits inside the existing In list, and a fifth widening would be
invented requirement, not a requirement.

**One drift worth recording, not fixed.** The doctrine doc's section 2 still says the router "has
been widened exactly three times" and pre-refuses a fourth selection-shaped widening
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:72-76], while the
live router carries a fourth widening that admits no selection [SOURCE: REPO RULES.md:96-107]. A
reader running test 2 from the doctrine doc alone would misnumber the widening. The drift does not
change this proposal's placement, and `decision-tests.md` is owned by another mode and outside this
lineage's write surface.

---

## Q3. Four-Part Refusal Test

**Answer: a single row whose delivery half already has a home; the request is partly satisfied.**

**Part 1, trigger-shaped cluster.** The operator's sentence is one obligation, present the synthesis
in chat plainly. The doctrine is explicit that condition 1 fails when "It is a single row, not a
cluster. One row is a section in an existing rule"
[SOURCE: decision-tests.md:87-91]. The per-mode differences in Q5 are not extra rows in the rules
set; they are the contracts' content.

**Part 2, existing home, inventoried line by line.** `communication.md` section 7: state the verdict
first and reach it by analysis; if you cannot state the verdict yet, say that, because a named
uncertainty is a verdict about the evidence [SOURCE: repo-rules/communication.md:154-165]. Section 8:
"Recommend one approach. Name its main trade-off. Mention an alternative only when it could change
the decision"; "Separate required from optional"; "Name the failure a best practice prevents"; "State
assumptions when evidence is missing" [SOURCE: repo-rules/communication.md:169-186]. Sections 2, 5
and 6 carry the concision half: one idea per sentence, atomic paragraphs, length matched to the
question, every sentence carrying information
[SOURCE: repo-rules/communication.md:71-85,124-133,137-150]. That is the operator's "simple and
concise terms" and "recommendations presented as recommendations", already obliged for every
substantive reply.

`handoff-and-questions.md` obliges the turn end to "name what is now the operator's to do, in the
form that lets them do it" [SOURCE: repo-rules/handoff-and-questions.md:41-46], and its operator-action
table explicitly excludes "A summary of what you just did"
[SOURCE: repo-rules/handoff-and-questions.md:72-77]. The handback is about what happens next, not what
was found [SOURCE: repo-rules/handoff-and-questions.md:50-58]. It is neither a findings obligation
nor the right owner for one.

What no rule obliges is the missing half: a mode's completion message carrying the synthesis at all.
Q4 shows the templates are the evidence. So the request is **partly satisfied**: delivery doctrine
yes, content obligation no.

**Part 3, not design-excluded.** Q2 placed the proposal In.

**Part 4, anchors.** `AGENTS.md` section 8 names both reply rules, "How a reply reads is governed by
`repo-rules/communication.md`, and it fires on every substantive reply" and "How a reply ends is
governed by `repo-rules/handoff-and-questions.md`"
[SOURCE: AGENTS.md:424,426], and the section 10 Communication rows carry the fork recommendation and
the close-out obligation [SOURCE: AGENTS.md:515-518]. Anchors exist; they are not what refuses.

**The in-place option is closed by length.** `communication.md` is 244 lines, band "at the limit",
and a rule over 250 must "Split it, or cut it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:105,92]. A new
section cannot fit. `handoff-and-questions.md` (159 lines) is the wrong owner under Part 2. So both
the new-file route and the new-section route are refused, and what remains uncarried is per-mode
content, which belongs to the contracts.

---

## Q4. Restraint Test

**Answer: the failure is real, verified independently, and no template already has a field for it.
The restraint test does not refuse, and it locates the fix in the presentation templates.**

A set that grows because more rules feel thorough has failed the rule it ships; the test asks what
fails today without this rule, and "Might need it", "best practice" and "for completeness" are refused
vocabulary [SOURCE: decision-tests.md:104-114]. The candidate failure was on the record and was
verified rather than accepted.

**The incident.** The four-iteration run of 2026-09-11 in
`specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek` records
`"maxIterations": 4` and `"stopPolicy": "max-iterations"`
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-config.json],
four `iterations/iteration-00N.md` files, and a closing state row
`"event":"synthesis_complete","totalIterations":4,...,"stopReason":"maxIterationsReached"`
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-state.jsonl:5].
`research.md` measures 265 lines (measured in this session). That synthesis ends in a verdict with a
deciding test, and the verdict is the run's whole product
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/research.md].

**The template.** The success display the loop would present is: "Deep research complete. /
Iterations: [N] | Stop reason: [converged|max_iterations|all_answered] / Artifacts:
research/research.md, research/resource-map.md ..., [N] iteration files, continuity update ... / Ready
for: /speckit:plan [feature-description] / STATUS=OK PATH=[spec-folder-path]"
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:270-277]. No line names a
finding, a verdict, or a recommendation. The mode's own success criteria say "research/research.md
produced with findings from all iterations" [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:404-409]:
the file is the finding, the message is not.

**All six Results Display sections read.** Review gets closest and still names nothing: "Findings:
P0=[N] P1=[N] P2=[N] | Verdict: [PASS|CONDITIONAL|FAIL]"
[SOURCE: .opencode/commands/deep/assets/deep-review-presentation.txt:355-364], which the packet's own
spec calls the closest any mode gets [SOURCE: specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/spec.md:66].
Council reports topics, rounds, stop reason, the threshold and artifact paths
[SOURCE: .opencode/commands/deep/assets/deep-ai-council-presentation.txt:290-299]. Agent improvement
reports dimensional scores and a weighted score
[SOURCE: .opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:336-371]. Model
benchmark is the only contract that names a recommendation field, "Recommendation: continue, promote
(if eligible), or stop" [SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:310-315],
and its example shows scores only
[SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:331-357]. Skill
benchmark prints a verdict and an aggregate against report paths
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:77-85]. The fields that
do exist hold counts, scores, tokens or paths; none holds synthesized content.

**What it costs.** The operator must open a 265-line artifact to learn the conclusion the run existed
to produce. The chat and session record carry no conclusion, so the decision does not travel with the
run. For a detached fan-out lineage the terminal message is composed outside the rule path (Q1), so
the loss repeats per lineage. The cost is delivery, not data loss: the artifact is canonical and the
message names it.

**Consequence:** there is a named failure, so a mere "this would be nice" refusal does not apply. But
the failure lives in the presentation templates, not in the rules set, and Q3 already showed the
delivery doctrine has a home. The restraint test therefore argues for placing the fix in the
contracts, not for adding a rule.

---

## Q5. Per-Mode Table

One row per mode, four content columns, derived from each mode's own Results Display section and
SKILL.md. The modes differ because their artifacts differ, and two of them do not produce
recommendation-shaped output at all.

| Mode | Produces (synthesized artifact) | Chat should carry | Chat should NOT carry | Right noun? |
|------|--------------------------------|-------------------|-----------------------|-------------|
| **deep-research** | `research/research.md` compiled from every iteration (17 sections), `resource-map.md`, iteration files; ruled-out directions are first-class output | The answer or verdict, the 2-5 headline findings that support it, the key uncertainty, the ruled-out direction that matters, the artifact path | Per-iteration narration, full evidence chains, internal metrics (`newInfoRatio`, thresholds), the full source list | **Findings**, with a recommendation only when the question was decision-shaped; the 001 run literally produced a verdict |
| **deep-review** | `review/review-report.md` (9 core sections), findings registry, P0/P1/P2 severities, `PASS|CONDITIONAL|FAIL` verdict, remediation plan | The verdict, each P0 named with `file:line`, P1 findings summarized, the fix-first pointer, the artifact path | The full report, every P2, methodology and dimension-coverage tables, severity definitions | **Findings plus remediation**, not recommendations: these are defects to fix and a verdict about them |
| **deep-ai-council** | Per-topic reports, a session report, a findings registry; a recommended plan with convergence on adjudicator-verdict stability (two-of-three) | The recommended direction and why, the agreement level including any dissent, risk caveats, artifact paths | Seat-by-seat deliberation, round transcripts, prompt scaffolding, cost internals | **Recommendations is correct**; the skill hands "recommendations, risk analysis" to implementation, but the dissent must travel or convergence reads as consensus |
| **deep-agent-improvement** | Packet-local candidates, deterministic 5-dimension scores, an append-only journal, `stopReason` plus `sessionOutcome`, a guarded promotion decision | What changed in the candidate, the score delta against baseline, the promote/keep-baseline/rollback recommendation and its evidence, the artifact location | Candidate file dumps, all five dimension tables every iteration, journal internals | **Candidate plus a promotion recommendation**; "recommendations" applies at the promotion gate, not to the artifact |
| **deep-model-benchmark** | `report.json`: per-fixture scores, aggregate, `scoringMethod`, threshold pass/fail; a continue/promote/stop call | The aggregate against `requiredAggregateScore`, the failing fixtures (or pass counts), the promotion-eligibility call, the report path | Raw grader output, per-fixture transcripts, fixture materialization detail | **Scores plus a benchmark verdict**; calling a measurement a recommendation is a category error |
| **deep-skill-benchmark** | `skill-benchmark-report.json` (verdict, D1-D5, funnel, ranked bottlenecks, scenario rows) and a `report.md` rendered from it | The verdict and aggregate, the ranked bottlenecks (the actionable content), the report path, the routed next step | Scenario rows, D-dimension internals, any verdict the loop host did not produce | **Verdict plus ranked bottlenecks**: a diagnosis, not recommendations |

**deep-research, evidence.** The synthesis is "research/research.md (17 sections)" compiled at the
synth phase, and negative knowledge is a first-class output
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:244,364]. The convergence
report carries stop reason, iteration count, answered ratio and the `newInfoRatio` trend
[SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:415-421]. The completion display
carries none of the content
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:270-277].

**deep-review, evidence.** Nine core sections assembled from the findings registry
[SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:296-298]; P0 blocks PASS, P1 forces
CONDITIONAL, P2 is advisory, and the verdict mapping is fixed by the iteration final-line contract
[SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:319-333,339-359]. The display reduces
that to counts and a token
[SOURCE: .opencode/commands/deep/assets/deep-review-presentation.txt:355-364].

**deep-ai-council, evidence.** "It hands recommendations, risk analysis, and packet-local artifacts
to implementation agents or the top-level caller"
[SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:459-461], with convergence on
adjudicator-verdict stability and a two-of-three rule
[SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:305,14]. The display reports
topics, rounds, stop reason, threshold and paths
[SOURCE: .opencode/commands/deep/assets/deep-ai-council-presentation.txt:290-299].

**deep-agent-improvement, evidence.** Lane A writes packet-local candidates and scores five
deterministic dimensions [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:214-222];
every session ends with a `stopReason` and a `sessionOutcome` (`keptBaseline`, `promoted`,
`rolledBack`, `advisoryOnly`)
[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:258-271]. The display reports the
dimensions and a weighted score
[SOURCE: .opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:344-371].

**deep-model-benchmark, evidence.** Lane B materializes fixtures, runs them and scores against a
profile without mutating an agent
[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/SKILL.md:226-235]. Its display
instructions name the recommendation field, and the recommendation is an eligibility call about a
score [SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:310-315,331-357].

**deep-skill-benchmark, evidence.** The lane "emits a ranked Skill Benchmark Report with concrete,
remediable findings"; its Report phase output is "Verdict, dimension scores, ranked bottlenecks"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:55-65]. The JSON report
is the machine record and the router "never synthesizes a verdict"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:77-87]; the presentation
boundary forbids the router from emitting scores, verdicts, bottlenecks or report wording
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:115-119].

**The line across all six.** The common denominator is not "recommendations". It is the synthesized
conclusion plus the smallest set of specifics that changes what the reader does next, with the
artifact path for provenance. For research, agent improvement and model benchmark the next action is
a decision, so a recommendation belongs in the message. For review and skill benchmark the next
action is a fix, so the message owes named defects or ranked bottlenecks. For council the next action
is a plan, so the message owes the direction and the dissent. None owes its internals.

---

## Q6. HVR in a Reply

**Answer: HVR can bind a reply in its voice and tell layers, not in its document-structure layer. The
correct treatment is to reach into HVR for the tells while `communication.md` keeps the reply, and to
name the applicable subset where it is invoked. The boundary does not need changing for this case.**

The boundary, quoted from `communication.md` section 4: "This rule carries the ban because it fires
on every substantive reply. The full standard, including the vocabulary and structural tells this one
does not repeat, is `hvr-rules.md` in `sk-doc`. Load it when writing a document rather than a reply."
[SOURCE: repo-rules/communication.md:117-120]

HVR is document-scoped by its own text. Its purpose is "Linguistic standards for all documentation
output" [SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:17], and
its usage line applies it "to all AI-generated documentation: READMEs, implementation summaries,
decision records, install guides and spec folder docs"
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:29]. Its
pre-publish structure list is document-shaped: "H2 sections numbered ALL CAPS, separated by `---`
dividers", "No Table of Contents and no `<!-- ANCHOR -->` navigation comments"
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:455-459]. A chat
message has no H2 hierarchy and no TOC, so "written with HVR" taken wholesale would impose structure
the medium does not have.

The voice and tell layers are different. The ten voice directives are active voice, direct address,
conciseness, simple language, clarity, conversational tone, authenticity, practical focus, sentence
rhythm and certainty
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:54-106]. The word
and tell lists are hard blocker words, phrase blockers, setup language, the "not just X, but also Y"
construction, three-item enumeration, significance inflation and generic conclusions
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:136-149,155-168,283-295,348-378].
None of that requires a document, and all of it improves a recommendation message.
`communication.md` already carries the punctuation subset for replies and points at HVR for exactly
"the vocabulary and structural tells this one does not repeat"
[SOURCE: repo-rules/communication.md:105-119].

So the answer is the middle option: the mode contracts that invoke HVR should name the applicable
layers (voice directives, word and tell lists) and leave document structure out. If the operator
later wants HVR grading to bind every reply generally, the thing to change is section 4's one-line
load sentence, a sentence edit rather than a section: `communication.md` is at 244 lines against the
250 ceiling [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:105,92],
so a section cannot fit, while the boundary sentence itself already exists to amend.

---

## Q7. Duplication Line

**Answer: the repo rule binds cross-cutting reply posture; the mode contract binds what that mode
produces and what its completion message carries. Per-mode field lists cannot be a rule without
restating `communication.md`, and the contract is the artifact that actually loads at the moment the
message is composed.**

The test for the line: if a statement is true in the same way for every mode and for replies that are
not loop output, it is reply doctrine and already lives in `communication.md` or the always-loaded
document. If it varies by what the mode produces, it is mode-contract content. "Lead with the verdict"
is identical everywhere and already exists [SOURCE: repo-rules/communication.md:154-165]; "a
benchmark message carries an aggregate against its threshold" is true of one mode only.

The existing contracts already demonstrate the split they should keep. The model-benchmark router
loads the Lane B contract as the canonical source and "never restates" the flag support it does not
own [SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:270-276]. The
skill-benchmark presentation boundary forbids the router from emitting "benchmark scores, verdicts,
ranked bottlenecks, scenario rows, report wording"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:115-119]. The owning
document is the one closest to the artifact.

Applied to the sibling packet: if `specs/system-deep-loop/046-synthesis-chat-presentation` adds a
content field per mode, the contracts consume the operator's request at the moment it arises, and
they can name the HVR subset Q6 describes. A repo rule saying the same would restate
`communication.md` sections 7 and 8, which already carry the recommendation shape and its trade-offs
[SOURCE: repo-rules/communication.md:169-186]. The corpus's duplication guard is explicit, "Don't
restate another rule. Link instead"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md:132-145], and
rules default to zero sideways links
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:120-128]. The
router's scope statement says the same from the other side: Out content is "deliberately absent here
so each has exactly one place to change" [SOURCE: REPO RULES.md:85-87].

The line, stated once: the rule owns how a recommendation reads wherever it appears; the contracts
own what each mode's message contains and must not contain. Cross the line in either direction and
one of the two documents starts restating the other.

---

## VERDICT

**Verdict: `deep-loop-contracts-only`. Deciding test: the four-part refusal test.**

The delivery doctrine half of the operator's request is already satisfied by
`repo-rules/communication.md` sections 7 and 8, which oblige verdict-first recommendation
presentation, the named trade-off, required-versus-optional separation and stated assumptions
[SOURCE: repo-rules/communication.md:154-186]. That makes the proposal a single row whose home
already exists, and the doctrine doc refuses that shape as a new file on Part 1
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:87-91]. The
in-place route is closed by the length ceiling: `communication.md` sits at 244 of 250 lines
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:105,92,111-113].

The un-carried half is real, and the restraint test verified it rather than refusing it: a
four-iteration run wrote a 265-line synthesis and the success template offers no field for what it
found [SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:270-277]. The failure is
located in the presentation templates and the completion messages they govern, which is precisely
what the mode contracts own and what the sibling packet `specs/system-deep-loop/046-synthesis-chat-presentation`
is chartered to change [SOURCE: specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/spec.md:42].
The contracts are also the only artifact that loads at the fan-out and non-interactive completion
moments, where no repo rule is guaranteed (Q1).

Cleared routes, recorded so the outcome is complete:

| Candidate | Outcome | Test that decided it |
|-----------|---------|----------------------|
| New rule file for presentation | Refused | Four-part test Part 1 (single row) and Part 2 (existing home) [SOURCE: decision-tests.md:87-92] |
| New section inside an existing rule | Not available | Length ceiling, `communication.md` at 244/250 [SOURCE: rule-anatomy.md:105,92] |
| `AGENTS.md` row | Not required | Q1: the moment is action-conditioned and contract-loaded; the unconditional minimum already lives in AGENTS.md section 10 [SOURCE: AGENTS.md:518] |
| Fifth widening of section 4 | Not required | Q2: reply delivery is already In; the proposal selects nothing [SOURCE: REPO RULES.md:77,96-107] |
| Deep-loop contracts | **This is the verdict** | The real failure is a missing content field in the six Results Display templates, and the contracts own the moment |

**What the rule set should not do:** add no rule file, add no section to `communication.md`, add no
`AGENTS.md` row, and add no `REPO RULES.md` trigger row. The reply doctrine is unchanged and
`communication.md` stays at 244 lines.

**What the sibling packet should carry, on this evidence:** one content field, or equivalent
language, per mode as the Q5 table specifies; no generic "recommendations" wording for the benchmark
or review lanes; and, where HVR is invoked, the subset from Q6 (voice directives plus word and tell
lists), never the document-structure sections. The contracts should link to `communication.md`
rather than restate it.

**What would change this verdict.** Three things, stated so the operator can overturn it cheaply.
First, if the operator wants HVR grading to bind every reply and not only presentation messages, that
is a wider ask and it reaches `communication.md` section 4's one-line boundary sentence, not the
contracts (Q6). Second, if the sibling packet's contract changes are dropped, the verified failure has
no home and the verdict moves back to the rules set with the failure as its justification. Third, this
is one model's read; `delegation-and-orchestration.md` section 4 says a judgment question needs a
diverged, grounded or escalated lens, and the operator owns any preference call
[SOURCE: repo-rules/delegation-and-orchestration.md:128-146,186-194]. The grounding here is the
repository's own state files, templates and rule text, every load-bearing claim carrying a resolving
citation; the preference call, rule versus contract, is the operator's.

---

## Verification Notes

- All citations were read in this session from the working tree. Line counts (244 for
  `communication.md`, 265 for the 001 `research.md`, 107 for `REPO RULES.md` plus trailing) were
  measured with `wc -l`.
- The 001 incident was verified from that lineage's `deep-research-config.json`, its four iteration
  files, its closing `synthesis_complete` state row, and the measured synthesis, not from the packet's
  own restatement of it.
- No file outside this lineage directory was created, modified or deleted; no `generate-context.js`,
  `validate.sh` or git write command was run.
