# Iteration 003 - Competing and duplicate triggers, unfireable rows, and the scope statement

Read at: 94a72a4931 (94a72a493192a7c9f5e21199ccc8ced356356de1, 2026-09-13T17:17:51+02:00).
One focus, three parts: the trigger rows that compete for the same action, the rows or
clauses that could never fire, and the scope statement (REPO RULES.md:75-109) against
the current eleven.

## Findings

**F-301. Three rows compete for turn-end and reporting, and the competition resolves
by composition, not by the more-specific-wins rule.**

Rows :42, :48 and :49 (REPO RULES.md) each claim the same neighborhood: :42 close out a
turn and report a result; :48 report what a long run found; :49 End a turn and report
work done, blocked, or partly done (all at 94a72a4931). The router's own conflict rule
(:15-17: they compose; the more specific wins on conflict) never engages, because no
conflict arises: the It-settles columns partition the obligations.

- :42 settles what counts as proof, how a green run lies, what an honest close-out
  contains. The rule delivers: its Fires-when (:32-38) and its section 10 CLOSE-OUT
  (evidence-and-proof.md:173) own the honest status, and handoff-and-questions.md:52-54
  confirms the division: AGENTS.md section 10 and evidence-and-proof.md section 10
  already require an honest status... That is a report about what happened.
- :48 settles the shape of what is handed over (presenting-decisions.md:45-46: How the
  sentences read is communication.md. This file governs the shape of the decision you
  are handing over).
- :49 settles what happens next (handoff-and-questions.md:56-58: The handback is a
  report about what happens next, and it is a different document).

Composition carries these rows, which :15 licenses FIRST. No defect. The duplication is
in the trigger words, not in the obligations.

**F-302. The fork-and-trade-off vocabulary is claimed by two rows and two Fires-when
lists, divided cleanly by the files, and guarded only half-way by the machinery.**

presenting-decisions.md:35 (About to present a recommendation, a fork, or a trade-off)
and handoff-and-questions.md:38 (About to state a fork, a trade-off, or two acceptable
paths) overlap almost word for word, and rows :48 and :49 repeat the same duplication
(REPO RULES.md:48 vs :49) at 94a72a4931. The division the files themselves perform:

- presenting owns the shape: verdict first, the recommendation, the intended path
  (presenting-decisions.md:41-46, 50-58).
- handoff owns the mechanism: ask as a structured choice when all three hold
  (handoff-and-questions.md:101), recommend one option and say why (:112), citing
  presenting-decisions.md section 3 at :105.

The FM trigger_phrases are disjoint (presenting: which option should i pick, here are
the trade-offs...; handoff: structured choice instead of prose, offer options not
paragraphs...), which the checker guards (check-repo-rules.cjs:243-268). But the
Fires-when prose duplication and the near-identical row cells are guarded by nothing:
the Fires-when check only requires the section to be non-empty (:331-354) at
94a72a4931. Observed competition, resolved in the corpus, invisible to the machinery.

**F-303. Two file-level firing conditions have no corresponding clause in their rows.**

- skill-hub: skill-hub-routing.md:36 (Creating a new skill that will live under a hub,
  or refactoring one that already does) has no clause in row :50, whose four clauses are
  wire, rewire or remove a MODE; edit the five artifact kinds (registry, router,
  ROUTER.md, graph-metadata.json, SKILL.md mode table); report a mode
  registered/routed/reachable/integrated; quote a per-hub gate result (REPO RULES.md:50)
  at 94a72a4931. The FM trigger phrases agree with the file, not the row: they include
  refactoring a skill (skill-hub-routing.md FM). The It-settles cell (:50) is likewise
  mode-centric. A reader creating a new skill under a hub, matching on the action
  (REPO RULES.md:12), finds no row clause for that action.
- scope: scope-discipline.md:36 (The fix would be easier if you also changed something
  else) fires on the TEMPTATION, while row :41's closest clause, fix something noticed
  in passing (REPO RULES.md:41), fires on the NOTICING. Related, not identical: the
  row under-represents the file by one condition.

Both are gaps of the second kind the topic's first sentence asks about: the router
reaches the files (F-102) but describes them less completely than they describe
themselves.

**F-304. No row could never fire, and no clause inside a row is dead.**

All 11 rows trigger on recurring, everyday actions of this repository's workflow.
Clause-level spot checks, all at 94a72a4931: row :43's fan-out lineage and deep loop are
instantiated by this very invocation (the runner-created invocation-metadata.json in
this lineage declares effectiveConfig kind=cli-pi, model=glm-5.3-flash, reasoningEffort
max); row :50's SKILL.md mode table and graph-metadata.json are real, governed surfaces
(skill-hub-routing.md:37,72) with the per-hub checker present
(.opencode/commands/doctor/scripts/parent-skill-check.cjs) and 20 mode references in
sk-doc/SKILL.md; row :44's truncate appears in the rule it loads (blast-radius.md:33).
Negative finding, recorded as such: nothing dead.

**F-305. The scope statement's In-list covers all eleven files; the presenting
coverage is the only implicit one.**

The In-list (REPO RULES.md:77-79) names: how to think and act, restraint, scope,
evidence, risk, diagnosis, honesty, the posture when work is handed to another runtime,
how the resulting reply reads, what you may claim about wiring you have changed, and
how a turn hands control back. At 94a72a4931:

- restraint -> prevent-overengineering.md; scope -> scope-discipline.md; evidence ->
  evidence-and-proof.md; risk -> blast-radius.md; diagnosis -> root-cause-and-debugging.md;
  honesty -> uncertainty-and-honesty.md; the delegation posture -> delegation-and-
  orchestration.md (row :43); what you may claim about wiring -> skill-hub-routing.md
  (the :93-94 sentence grants the rule the pointing explicitly); how a turn hands
  control back -> handoff-and-questions.md.
- how the resulting reply reads -> communication.md, and, under the wide reading,
  presenting-decisions.md. This is the one implicit mapping: no In-clause names
  decisions. It is justified by the corpus's own record of the split
  (communication.md:49-51: The shape of a decision you hand over, the verdict-first
  ordering and the recommendation, moved to presenting-decisions.md when this file
  reached its length ceiling), by presenting-decisions.md:45-46, and by AGENTS.md
  section 8's two-paragraph structure (how a reply reads / how a decision is presented),
  of which the In-list clauses are the router-side echo.

Every one of the 11 files maps to at least one In-clause; every In-clause maps to at
least one existing file. The scope statement still describes the current set, under one
defensible reading it does not spell out.

**F-306. The Delivery exclusivity sentence survives its qualifier, and only barely.**

REPO RULES.md:80-82: Delivery joined the list when AGENTS.md section 8 moved down; it
is the one rule here whose trigger is every substantive reply rather than a specific
action. Supporting it: communication.md:37 (Fires#1: About to write any substantive
reply, an answer, an explanation, a close-out, a status) and :40-42 (Its trigger is
deliberately the broadest in the set... a rule about how replies read has to load
whenever a reply is being written). Contesting it: handoff-and-questions.md:35 (About
to end a turn, of any kind, substantive or not), a superset: that rule also fires on
every substantive reply, AND on the turns that are not. At 94a72a4931.

Verdict: the exclusivity holds only through its own qualifier, rather than a specific
action: communication's trigger is the writing itself, present in every substantive
reply, where handoff's trigger is the end-of-turn action. Read as raw exclusivity, the
sentence is wrong, because two rules fire on every substantive reply. Both readings
stated; the sentence's job is explanatory, so the stakes are low.

**F-307. The widenings: two labeled, two recoverable, the earlier fourth-refusal
honored, the fifth still true.**

- Third widening: the routing carve-out, self-labeled (REPO RULES.md:91), which keeps
  skill-hub-routing.md inside the In-list by the :93-94 sentence.
- Fourth widening: the ask-surface, self-labeled (:98: added as the fourth widening, on
  an operator decision that overrode a research refusal), and the earlier fourth-
  admitting-selection refusal (:95-96) is honored: the ask-surface names, it does not
  select (:104-105: That is not a selection, because nothing is being selected: the
  runtime is a given).
- First and second: NOT separately labeled. They are recoverable as the In-list's
  delegation-posture clause (:79) and the Delivery clause (:80, whose joined-the-list
  note records its arrival without numbering it). The topic's premise, that the scope
  statement records FOUR deliberate widenings, is true if those two unlabeled clauses
  count as the first two. Honest: the count is inferable, the numbering of the last two
  is explicit.
- The fifth, pre-refused (:108-109: A fifth widening that let a rule pick between
  runtimes would be the dissolution this one avoids): still true at 94a72a4931. No rule
  file picks between runtimes: handoff resolves the question surface AT the current
  runtime (handoff-and-questions.md:122-123: resolve it at the runtime you are in rather
  than assuming one; the :127-131 table lists, it does not select); delegation POINTS at
  the selector (delegation-and-orchestration.md:73: Read the executor's own contract,
  per AGENTS.md Dispatch Rules, the selection living where :85-89 of the router wants
  it); skill-hub names a repository-local checker (skill-hub-routing.md:85-86). The
  8db759d7af principle (rules may name a hub, never a file within one) also holds
  today: the only dotted path left anywhere in repo-rules/*.md is handoff-and-
  questions.md:128, and .pi/PLUGINS.md is a repository file, not a hub-internal one.

**F-308. Two Out-list sentences survive on careful readings, and one confirmation
clause rests on specs prose.**

- Which command: the Out-list (:85-86) reserves which agent, which command, which
  model, which flags for AGENTS.md section 2 and the skills. Yet the corpus names
  commands: /rewrite:response (communication.md:170-171, the didn't-follow response)
  and grep -a (evidence-and-proof.md:95, the NUL trap). Both readings are defensible:
  the Out-list's clause says the mechanics of agent and CLI dispatch, which these are
  not, they are a reply-repair surface and a diagnostic technique. Both PREDATE the
  section-4 text (the /rewrite:response line dates to 65a337865a, 2026-08-31), so the
  11:47 author saw them: chosen granularity, not unnoticed drift, at 94a72a4931.
- Only place a tool name appears (:107): true within the ask-surface scope, where only
  handoff section 5 names a question surface. Read as any tool anywhere in the eleven,
  false (grep, /rewrite:response). The sentence lives inside the ask-surface paragraph
  (:98-108), so the narrow reading is its natural one. Recorded, not softened.
- Names only what this repository confirms (:107-108): the Pi row is confirmed
  (PLUGINS.md:16-17, v2.10.0, exactly the file the row cites, handoff-and-questions.md:
  128). The Claude row's evidence cell says Named in this repository (handoff-and-
  questions.md:127), but AskUserQuestion appears in AGENTS.md, .claude/ and .pi/ nowhere
  at 94a72a4931; it occurs only in specs/ prose (for example specs/sk-prompt/
  007-sk-prompt-parent/002-architecture-decision/implementation-summary.md:61,96). The
  clause survives if the repository's confirmation includes its specs, which is
  INFERRED, the generous reading, and the 006 research independently noted the question
  surfaces are partly unverified (specs/sk-communication/006-sk-communication-clarity/
  001-research-communication-context/research/iterations/iteration-005.md:59) at
  94a72a4931.

## What was tried and ruled out (negative knowledge)

- Calling the :42/:49 pair a specificity defect: dropped, the files themselves perform
  the division the settle-columns advertise (handoff-and-questions.md:52-58), and the
  router's :15 licenses composition before it ranks by specificity.
- Calling presenting uncovered by the In-list: dropped, the wide reading holds on three
  independent texts (communication.md:49-51, presenting-decisions.md:45-46, AGENTS.md
  section 8's first two paragraphs).
- Hunting fifth-widening leaks: none found, checked in delegation (the :73 pointer),
  handoff (the :122-131 resolution) and skill-hub (the :85-86 repository-local checker).

## Convergence telemetry

newInfoRatio = 0.5 (partially new: the eleven-row structure, the It-settles columns and
the scope statement's clauses were inventoried in iterations 1 and 2; new here are the
composition verdicts on the three competitions, the two under-reach gaps, the
exclusivity contest, the widenings' labeling state, the fifth-refusal survival, and the
Out-list granularity and confirmation nuances). No simplicity bonus: this iteration
adds distinctions rather than collapsing them. Above the 0.05 threshold in the
telemetry sense, and the cap is reached: this is iteration 3 of 3, so the loop stops
with stopReason maxIterationsReached.

## What worked

Reading the FILES' own divisions (handoff:52-58, presenting:45-46) before judging the
ROWS: every competition question answered itself at the file level, and the two
under-reach gaps (F-303) surfaced only because the row clauses were laid against the
Fires-when clauses one by one.

## What failed

Nothing. One question remains deliberately open, as briefed: the sequencing of
alignment against 006's phase 003 (F-107), noted, not decided.

## Next Focus (into strategy)

- None: this was the final iteration. Synthesis follows.
